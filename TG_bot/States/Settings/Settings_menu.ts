

import { State } from '../../State';
const colors = require("colors");
import { Markup } from 'telegraf';
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Trade_menu } from '../Trade/Trade_menu';
import { Mongooose } from '../../../DataBase/Mongo';
const Extra = require('telegraf/extra');


export class Settings_menu implements State {

    public state_id = "settings_menu";
    
    _buy_btn_calbck: string;
    _sell_btn_calbck: string;
    _hold_btn_calbck: string;
    _back_btn_calbck: string;


    public constructor() {

        this._buy_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "buy"});
        this._sell_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "sell"});
        this._hold_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "hold"});
        this._back_btn_calbck = JSON.stringify({state_name: this.state_id, state_query: "back"});
    };
    
    public async render(ctx:any) {      

        try{   

            await ctx.reply( 
                '<b>Settings Menu</b>\nChoose trade operation'
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([

                        [m.callbackButton('Buy coins', this._buy_btn_calbck), m.callbackButton('Sell coins', this._sell_btn_calbck), m.callbackButton('Hold coins', this._hold_btn_calbck)],
                        [m.callbackButton('Back', this._back_btn_calbck)]
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

        const selected_buy_option = query.state_query;

        if (selected_buy_option === "back")
            return await TG_bot.changeState(new MainMenu(), ctx);

        else {

            await Mongooose.getInstance().update_users_trade_options(ctx.chat.id, selected_buy_option)
            return await TG_bot.changeState(new Trade_menu(), ctx);
        } 


        // if (selected_buy_option == "buy"){

        //     await Mongooose.getInstance().update_users_trade_options(ctx.chat.id, selected_buy_option)

        //     return await TG_bot.changeState(new Trade_menu(), ctx);
        // }
        // else if (selected_buy_option === "sell"){

        //     return await TG_bot.changeState(new Trade_menu(), ctx);
        // }
        // else if (selected_buy_option === "hold"){

        //     return await TG_bot.changeState(new Trade_menu(), ctx);
        // }
        // else if (selected_buy_option === "back"){

        //     return await TG_bot.changeState(new MainMenu(), ctx);
        // }
        // else {
        //     console.log(colors.red("!!!!!  MainMenu ERRR : Can NOT define callback_query, user:" + ctx.chat.id));
        //     return null;
        // };
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