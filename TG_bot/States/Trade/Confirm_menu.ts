import { State } from '../../State';
const colors = require("colors");
import { Markup } from 'telegraf';
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Trade_menu } from '../Trade/Trade_menu';
import { userInfo } from 'os';
import { Mongooose } from '../../../DataBase/Mongo';
const Extra = require('telegraf/extra');


export class Confirm_menu implements State {

    public state_id = "confirm_menu";

    _coin_name: string;
    _confirm_btn_calbck: string;
    _cancel_btn_calbck: string;


    public constructor(coin_name: string) {

        this._coin_name = coin_name;
        this._confirm_btn_calbck = JSON.stringify({state_name:this.state_id,state_query:"con",pl:coin_name});
        this._cancel_btn_calbck = JSON.stringify({state_name:this.state_id,state_query:"can",pl:coin_name});
    };

    public async render(ctx: any) {

        try {

            const user_config = await Mongooose.getInstance().get_user_config(ctx.chat.id)

            await ctx.reply(

                `Are you sure you want to ${user_config.trade_options} ${this._coin_name}?`
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        [
                            m.callbackButton('Confirm', this._confirm_btn_calbck),
                            m.callbackButton('Cancel', this._cancel_btn_calbck)
                        ]
                    ])
                )
            )
                .then(async (msg: any) => {
                    await Mongooose.getInstance().updateSession(msg, 'update')
                });
        }
        catch (err) {
            const error = '🤬 menu err..'
            console.log(err)
            // await MCR_bot.changeState(new Err_menu(error), ctx)
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any> {

        if (query.state_query === "con") {
            return await TG_bot.instance.send_notification('Done!', ctx.chat.id),
            TG_bot.changeState(new MainMenu(), ctx);
        
        }
        else if (query.state_query === "can") {

            return await TG_bot.changeState(new Trade_menu(), ctx);
        }
        else {
            console.log(colors.red("!!!!!  TradeMenu ERR : Can NOT define callback_query, user:" + ctx.chat.id));
            return null;
        };
    };

    public async messages_handler(query: any, ctx: any) {
        try {

        }
        catch (err) { };
    };

    public test_f() {

    };
};