

import { State } from '../../State';
const colors = require("colors");
import { Markup } from 'telegraf';
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Confirm_menu } from '../Trade/Confirm_menu';
import { userInfo } from 'os';
import { Mongooose } from '../../../DataBase/Mongo';
const Extra = require('telegraf/extra');



export class Trade_menu implements State {

    public state_id = "trade_menu";


    _back_btn_calbck: string;


    public constructor() {


        this._back_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "back" });
    };

    public async render(ctx: any) {

        try {

            await ctx.reply(

                'What coin are you interested in?\nSend me the name.\n'
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        [
                            m.callbackButton('Back', this._back_btn_calbck)
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

        if (query.state_query === "back") {

            return await TG_bot.changeState(new MainMenu(), ctx);
        }
        else {
            console.log(colors.red("!!!!!  TradeMenu ERR : Can NOT define callback_query, user:" + ctx.chat.id));
            return null;
        };
    };

    public async messages_handler(query: any, ctx: any) {
        try {
            /// тут надо как-то ловить сообщение пользователя и сохранять в currenCoin и будет збс
            ///по типу hears(/^[A-Z]+$/i, async ctx => {currentCoin = ctx.message.text} но не работает


            const coin_name = query;

            return await TG_bot.changeState(new Confirm_menu(coin_name), ctx);
                  
        }
        catch (err) { };

    };

    public test_f() {

    };
};