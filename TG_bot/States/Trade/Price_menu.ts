import { State } from '../../State';
const colors = require("colors");
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Confirm_menu } from '../Trade/Confirm_menu';
import { Mongooose } from '../../../DataBase/Mongo';
import { Trade_menu } from './Trade_menu';
import { Quantity_menu } from '../Trade/Quantity_menu';
const Extra = require('telegraf/extra');


export class Price_menu implements State {
    public state_id = "price_menu";

    _back_btn_calbck: string;
    

    public constructor() {
        this._back_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "back" });
        
    };
    public async render(ctx: any) {
        try {
            await ctx.reply(
                'Send me the price.\n'
                , Extra.HTML().markup((m) =>
                    m.inlineKeyboard([
                        
                            
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
            console.log(err)
            
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any> {
        if (query.state_query === "back") {
            return await TG_bot.changeState(new Trade_menu(), ctx);
        }
        else {
            console.log(colors.red("!!!!!  TradeMenu ERR : Can NOT define callback_query, user:" + ctx.chat.id));
            return null;
        };
    };
    public async messages_handler(query: number, ctx: any) {
        try {
            const selected_price = query;
            await Mongooose.getInstance().update_users_price(ctx.chat.id, selected_price)
            // return await TG_bot.changeState(new Trade_menu(), ctx);
            return await TG_bot.changeState(new Quantity_menu(), ctx);
        }
        catch (err) { };
    };

};