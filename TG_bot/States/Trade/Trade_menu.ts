import { State } from '../../State';
const colors = require("colors");
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Price_menu } from '../Trade/Price_menu';
import { Mongooose } from '../../../DataBase/Mongo';
import { BinanceExch } from '../../../Exchange/Binance';
const Extra = require('telegraf/extra');
const { tokens: { ApiKey, ApiSecret } } = require('../../../../settings.json');

export class Trade_menu implements State {
    public state_id = "trade_menu";

    _back_btn_calbck: string;
    _balance_btn_calbck: string;

    public constructor() {
        this._back_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "back" });
        this._balance_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "blnc" });
    };

    public async render(ctx: any) {
        try {
            await ctx.reply(
                'What pair are you interested in?\nSend me the symbol\n(for example, BTCUSDT).\n'
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        
                        [m.callbackButton('My balance', this._balance_btn_calbck)],
                        [m.callbackButton('Back', this._back_btn_calbck)]
                        
                    ])
                )
            )
                .then(async (msg: any) => {
                    await Mongooose.getInstance().updateSession(msg, 'update')
                });
        }
        catch (err) {
            const error = '🤬 menu err..'
            console.log(error)
            
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any> {

        const exhange_client = new BinanceExch(ApiKey, ApiSecret)

        if (query.state_query === "back") {

            return await TG_bot.changeState(new MainMenu(), ctx);
        }
        else if (query.state_query === "blnc") {

            const balance = await exhange_client.all_balances()

            console.log("EXCHANGE CLIENT BALANCE")
            console.log(balance)

            if (!balance.length) return null

            const current_balances = balance.map((value) => {

                return value.asset + ": " + value.free + " (+locked: " + value.locked + ")\n"
            })

            await TG_bot.instance.send_notification('Your balance is:\n' + current_balances, ctx.chat.id);  
        }
        else {
            console.log(colors.red("!!!!!  TradeMenu ERR : Can NOT define callback_query, user:" + ctx.chat.id));
            return null;
        };
    };
    public async messages_handler(query: any, ctx: any) {
        try {
            const selected_pair_name = query.toUpperCase();
            await Mongooose.getInstance().update_users_coin(ctx.chat.id, selected_pair_name)
        
            return await TG_bot.changeState(new Price_menu(), ctx);
        }
        catch (err) { 
            const error = '🤬 menu err..'
            console.log(error)
        };
    };

};