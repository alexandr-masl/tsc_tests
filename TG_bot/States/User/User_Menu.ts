

import { State } from '../../State';
const colors = require("colors");
import { Markup } from 'telegraf';
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Settings_menu } from '../Settings/Settings_menu';
import { userInfo } from 'os';
import { Mongooose } from '../../../DataBase/Mongo';
const Extra = require('telegraf/extra');


export class User_menu implements State {

    public state_id = "user_menu";
    
    _about_btn_calbck: string;
    _back_btn_calbck: string;


    public constructor() {

        this._about_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "about"});
        this._back_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "back"});
    };
    
    public async render(ctx:any) {      

        try{   

            await ctx.reply( 
                
                '<b>User Menu</b>\n'
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        [
                            m.callbackButton('About', this._about_btn_calbck),
                            m.callbackButton('Back', this._back_btn_calbck)
                        ]
                    ])
                )
            )
            .then(async (msg: any) => {
                await Mongooose.getInstance().updateSession(msg, 'update')
            });
        }
        catch(err){
            const error = '🤬 menu err..'
            console.log(err)
            // await MCR_bot.changeState(new Err_menu(error), ctx)
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any>{

        if (query.state_query === "about"){
            
            return await ctx.reply(ctx.botInfo.username), TG_bot.changeState(new Settings_menu(), ctx);
        }
        else if (query.state_query === "back"){

            return await TG_bot.changeState(new MainMenu(), ctx);
        }
        else {
            console.log(colors.red("!!!!!  MainMenu ERRR : Can NOT define callback_query, user:" + ctx.chat.id));
            return null;
        };
    };

    public async messages_handler(query: any, ctx: any){
        try{
            console.log("::::::::::: MAIN MENU, query", query);
            await ctx.deleteMessage();
        }
        catch(err){};
    };

    public test_f(){

    };
};