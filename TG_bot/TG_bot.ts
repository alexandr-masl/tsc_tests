
const {tokens: {token_dev}} = require('../../settings.json');
const {Telegraf} = require('telegraf');
const {Markup} = Telegraf;
import { Mongooose } from '../DataBase/Mongo';
import { MainMenu } from './States/MainMenu';
import { States_Store } from './States/States_Store';
const moment = require('moment');
const colors = require('colors');


export class TG_bot{

    tg_bot_inst: any;
    private token: any;
    public static _users_states: any[];
    public static instance : TG_bot;

    constructor(){

        TG_bot.instance = this;
        this.token     = token_dev;
        TG_bot._users_states = [];
        this.tg_bot_inst = new Telegraf(this.token);

        this.tg_bot_inst.catch((error: any) =>  {
            console.log('telegraf error', error.response, error.parameters, error.on || error);
        });

        // this.tg_bot_inst.use(async (ctx: any, next: any) => {

        //     const txt = ctx.channelPost;

        //     if (txt){
        //         this.channel_update(txt, ctx);
        //     }
        //     await next();
        // });

        this.tg_bot_inst.launch();
        this.launch_bot();
    };

    public async check_channel(channel_id: number, user_id: number): Promise<null|any>{
        const isMemberCheck = await ( async() => {try{ return await this.tg_bot_inst.telegram.getChat(channel_id)} catch(err){return null;};
        })();
        const is_member = isMemberCheck;

        console.log(' --- is member CHECK ---');
        console.log(is_member);


        if (is_member){
            const admins = await ( async() => {
                try{ return await this.tg_bot_inst.telegram.getChatAdministrators(channel_id)} catch(err){return {err: err}};
            })();

            if(admins.err){
                console.log('!!!!!ADMIN CHECK ERR');
                console.log(admins.err['response']);

                return null;
            };

            const isAdmin = admins.find(admin => admin.user.id == user_id)

            console.log('--- Get chat ADMINS ----');
            console.log(isAdmin);

            const is_creator = (isAdmin && isAdmin.status === 'creator') ? true : false;
                
            return {
                isMember: is_member,
                is_admin: is_creator
            };
        }
        return null;
    };

    public async get_chat_info(ch: number|string):Promise<null|any> {
        try{
            const ch_inf = await this.tg_bot_inst.telegram.getChat(ch).catch(console.error());
            return ch_inf
        }
        catch(err){
            return null;
        }
    };

    private async launch_bot(){

        this.tg_bot_inst.command('start', async (ctx : any) => {
            
            try{    

                const session = await Mongooose.getInstance().getSession(ctx.chat.id)
                if(!session){
                    await Mongooose.getInstance().createSession(ctx.update)
                };

                // const user = await Application.getInstance().get_user(ctx.chat.id)

                return await TG_bot.changeState(new MainMenu(), ctx)
            }catch(err){
                console.log(colors.red('!!! MCR BOT :: on start err ...'))
                console.log(err)
            }
        });
  
        this.tg_bot_inst.on('text', async (ctx : any) => {  

            await this._text_querry_handler(ctx);
        });

        this.tg_bot_inst.on('callback_query', async (ctx) => {

            ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
            ctx.answerCbQuery();

            await this._callbacks_handler(ctx);
        });

        const time = moment().format()
        // if(this.token === token_dev){
            console.log(colors.yellow('MCR:::DEV version ::: ') + time)
        // }
        // else if( this.token === token_prod){
        //     console.log(colors.blue('MCR:::PROD version::: ') + time)
        // }
        // else if( this.token === token_test){
        //     console.log(colors.green('MCR:::TEST version ::: ') + time)
        // };
    };

    public static getInstance(): TG_bot {
        if(!TG_bot.instance){
            TG_bot.instance = new TG_bot();
        };
        return TG_bot.instance;
    };

    public static async changeState(state : any, ctx: any){

        const chat_id = ctx.chat.id;
        const user_state = TG_bot._users_states.find(user => user.id == chat_id);

        if (!user_state){

            const new_user = {

                id: ctx.chat.id,
                curr_state: state,
                ctx: ctx
            };

            this._users_states.push(new_user);
        }
        else {

            this._users_states.map(user => { 

                if (user.id == chat_id){

                    user.curr_state = state;
                    user.ctx = ctx
                };
            });
        };

        await TG_bot.getInstance()._delete_expired_keyboard(ctx);
        await TG_bot.getInstance()._delete_expired_notification(ctx);
        
        return await state.render(ctx);
    };

    public static async delete_last_message(ctx: any){
        try{            
            await ctx.deleteMessage();
        }
        catch(err){};
    };

    public async send_notification(notification: any, for_user: number) {

        let user_state = TG_bot._users_states.find(state => state.id == for_user);

        if (user_state){

            await TG_bot.getInstance()._delete_expired_keyboard(user_state.ctx);

            await TG_bot.getInstance().tg_bot_inst.telegram.sendMessage(
                for_user,
                notification
            ).then(async msg => {
                // await Mongooose.getInstance().updateSession(msg, 'update')
            });

            return await user_state.curr_state.render(user_state.ctx);
        }
        else {

            const home_btn_clbck =  JSON.stringify({home_button:true});

            const inlineMessageRatingKeyboard = Markup.inlineKeyboard([
                Markup.callbackButton("home_btn_txt", home_btn_clbck)
            ]).extra();

            await this.tg_bot_inst.telegram.sendMessage(
                for_user,
                notification,
                inlineMessageRatingKeyboard
            ).then(async msg => {
                // await Mongooose.getInstance().updateSession(msg, 'update')
            });
        };
    };

    private async _callbacks_handler(ctx: any){

        const query = JSON.parse(ctx.update["callback_query"]["data"]);

        if (!query) return null;

        // let user = await Application.getInstance().get_user(ctx.chat.id);

        if (query.home_button){

            return await TG_bot.changeState(new MainMenu, ctx);
        };

        const user_menu = States_Store.getInstance().get_user_state(query);

        // const user_state = TG_bot._users_states.find(user => user.id == ctx.chat.id);

        // if (user_state && user_state.curr_state.state_id !== user_menu.state_id){

        //     // await ctx.deleteMessage(ctx.update["callback_query"].message.message_id);

        //     return null;
        // };

        if (!user_menu){
            return console.log(colors.red("!!! TG_bot : _callbacks_handler : Can NOT define menu of callback  !!!!!"))
        };

        user_menu.callbacks_handler(query, ctx);
    };

    private async _text_querry_handler(ctx: any){

        let user_state = TG_bot._users_states.find(state => state.id == ctx.chat.id);

        if (!user_state){

            try {await ctx.deleteMessage();} catch(err) {};

            return null;
        };

        const query = ctx.update.message.text;

        // await Mongooose.getInstance().updateSession(ctx.update.message, 'update');

        await user_state.curr_state.messages_handler(query, ctx);
    };

    private async _delete_expired_notification(ctx: any){

        let session = await Mongooose.getInstance().getSession(ctx.chat.id);

        // if (session.notification){   

        //     if (session.notification.status === 'expired'){

        //         if ( session.notification.message_id) {   

        //             try {  
        //                 await ctx.deleteMessage(session.notification.message_id)
        //             }catch(o){}

        //             return await Mongooose.getInstance().updateNotification(ctx.chat.id, '', null);
        //         };
        //     }
        //     else {
        //         return await Mongooose.getInstance().updateNotification(ctx.chat.id, 'expired', session.notification.message_id)
        //     };
        // }
        // else{
        //     return null;
        // };
    };

    private async _delete_expired_keyboard(ctx : any){
        let session   = await Mongooose.getInstance().getSession(ctx.chat.id)

        // if (session.all_messages && session.all_messages.length){

        //     await session.all_messages.map(async msg => {
        //         try{  
        //             await ctx.deleteMessage(msg);
        //          }catch(o){
        //             return null;
        //          };
        //     });
        //     const ctx_update = ctx.update.callback_query ? ctx.update.callback_query.message : ctx.update.message
        //     const clear = await Mongooose.getInstance().updateSession(ctx_update, 'clear');
        // };
    };
};
