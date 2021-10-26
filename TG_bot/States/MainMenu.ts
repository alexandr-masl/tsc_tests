

import { State } from '../State';
const colors = require("colors");
import { Markup } from 'telegraf';
import { TG_bot } from '../TG_bot';
import { Settings_menu } from './Settings/Settings_menu';
import { Trade_menu } from './Trade/Trade_menu';
import { Mongooose } from '../../DataBase/Mongo';
const Extra = require('telegraf/extra');
import { currentOperation } from './Settings/Settings_menu';

export class MainMenu implements State {

    public state_id = "main_menu";
    
    _settings_menu_btn_calbck: string;
    _trade_menu_btn_calbck: string;
    

    public constructor() {

        this._settings_menu_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "setting"});
        this._trade_menu_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "trade"});
    
    };
    
    public async render(ctx:any) {      

        try{   

            
            await ctx.reply( 
                `<b>Main Menu</b>\nSelected options is - ${currentOperation}\nYou can change the option in Setting menu`
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        [
                            m.callbackButton('Settings', this._settings_menu_btn_calbck),
                            m.callbackButton('Trade', this._trade_menu_btn_calbck),
                           
                        ]
                    ])
                )
            )
            .then(async (msg: any) => {

                await Mongooose.getInstance().updateSession(msg, 'update');
            });

            let session = await Mongooose.getInstance().getSession(ctx.chat.id);

            console.log('--- Main Menu - Session ---')
            console.log(session)

        }
        catch(err){
            const error = '🤬 menu err..'
            console.log(err)
            // await MCR_bot.changeState(new Err_menu(error), ctx)
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any>{

        if (query.state_query == "setting"){

           return await TG_bot.changeState(new Settings_menu, ctx);
           
        }
        else if (query.state_query === "trade"){
           
            return await TG_bot.changeState(new Trade_menu, ctx);

        }
        
        else {

            console.log(colors.red("!!!!!  MainMenu ERR : Can NOT define callback_query, user:" + ctx.chat.id));
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