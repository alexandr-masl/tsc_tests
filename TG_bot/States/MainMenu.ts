

import { State } from '../State';
const { Telegraf, Markup } = require('telegraf');
const colors = require("colors");


export class MainMenu implements State {

    public state_id = "main_menu";
    
    _btn_1_calbck: string;
    _btn_2_calbck: string;
    _btn_3_calbck: string;


    public constructor() {

        this._btn_1_calbck = JSON.stringify({state_name: this.state_id, state_query: "first"});
        this._btn_2_calbck = JSON.stringify({state_name: this.state_id, state_query: "second"});
        this._btn_3_calbck = JSON.stringify({state_name: this.state_id, state_query: "third"});
    };
    
    public async render(ctx:any) {      

        try{   

            const buttons = Markup.button.url(['First Button', this._btn_1_calbck])
            // const button = Markup.keyboard(buttons: HideableKBtn[][])


            await ctx.reply('My Menu\n', new Markup.inlineKeyboard(buttons))
            .then(async (msg: any) => {
                // await Mongooose.getInstance().updateSession(msg, 'update')
                console.log("... state updated ");
            });
        }
        catch(err){
            const error = '🤬 menu err..'
            console.log(err)
            // await MCR_bot.changeState(new Err_menu(error), ctx)
        };
    };

    public async callbacks_handler(query: any, ctx: any): Promise<any>{

        if (query.state_query == "first"){

            console.log(" ------->>>>> FIRST BUTTON TRIGERED !!!!!!!!!!!!!!!")
           
        }
        else if (query.state_query === "second"){


        }
        else if (query.state_query === "third"){


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