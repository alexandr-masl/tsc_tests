import { State } from '../../State';
const colors = require("colors");
import { Markup } from 'telegraf';
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Trade_menu } from '../Trade/Trade_menu';
import { userInfo } from 'os';
import { Mongooose } from '../../../DataBase/Mongo';
const Extra = require('telegraf/extra');
import { binance_client } from './Trade_menu';


export class Confirm_menu implements State {

    public state_id = "confirm_menu";

    _confirm_btn_calbck: string;
    _back_btn_calbck: string;


    public constructor() {

        this._confirm_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "con"});
        this._back_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "back"});
    };

    public async render(ctx: any) {

        try {

            const user_config = await Mongooose.getInstance().get_user_config(ctx.chat.id)

            await ctx.reply(

                `You choose ${user_config.coin}\nside: ${user_config.trade_options}\nquantity: ${user_config.quantity}\nprice: ${user_config.price}\nAre you sure?`
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        [
                            m.callbackButton('Confirm', this._confirm_btn_calbck),
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

        if (query.state_query === "con") {

            const user_config = await Mongooose.getInstance().get_user_config(ctx.chat.id)


            const place_order = await binance_client.order({
                symbol: `${user_config.coin.toUpperCase()}`,
                side: `${user_config.trade_options.toUpperCase()}`,
                quantity: `${user_config.quantity}`,
                price: `${user_config.price}`
            })
            .then(o => {return o }).catch(o => { return o })

            // if (place_order.toString().includes("Error")){

            console.log('---- PLACED ORDER RESULT')
            console.log(place_order)

            const error_txt = place_order.toString()

            await TG_bot.getInstance().tg_bot_inst.telegram.sendMessage(
                ctx.chat.id,
                error_txt
            )
            // }

            return await TG_bot.changeState(new Trade_menu(), ctx);    
        }
        else if (query.state_query === "back") {

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