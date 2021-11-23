import { State } from '../../State';
const colors = require("colors");
import { TG_bot } from '../../TG_bot';
import { MainMenu } from '../MainMenu';
import { Confirm_menu } from '../Trade/Confirm_menu';
import { Mongooose } from '../../../DataBase/Mongo';
const Extra = require('telegraf/extra');

const { tokens: { ApiKey } } = require('../../../../settings.json');
const { tokens: { SecretKey } } = require('../../../../settings.json');
const Binance = require('binance-api-node').default;
export const binance_client = Binance({
  apiKey: ApiKey,
  apiSecret: SecretKey,
}) 
let current_balance = [];

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
                'What coin are you interested in?\nSend me the name.\n'
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
            console.log(err)
            // await MCR_bot.changeState(new Err_menu(error), ctx)
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any> {
        if (query.state_query === "back") {
            return await TG_bot.changeState(new MainMenu(), ctx);
        }
        else if (query.state_query === "blnc") {
            async function get_balance (): Promise<void>{

                const balance = await binance_client.accountInfo().then((o: { balances: any[]; }) =>  { 
                  const not_null_balances = o.balances.filter((asset: { free: any; locked: any; }) => Number(asset.free) > 0 || Number(asset.locked) > 0 ) 
                  return  not_null_balances
               })
           
               for (let n = 0; n < balance.length; n++){
                  
                  current_balance.push(balance[n].asset + ": " + balance[n].free + " (+locked: " + balance[n].locked + ")\n");
                  console.log(current_balance);
                  
                   
               }
               TG_bot.instance.send_notification('Your balance is:\n' + current_balance, ctx.chat.id);    
               current_balance = [];
               
              }
              
              get_balance();
        }
        else {
            console.log(colors.red("!!!!!  TradeMenu ERR : Can NOT define callback_query, user:" + ctx.chat.id));
            return null;
        };
    };
    public async messages_handler(query: any, ctx: any) {
        try {
            const coin_name = query.toUpperCase();
            return await TG_bot.changeState(new Confirm_menu(coin_name), ctx);
        }
        catch (err) { };
    };

};