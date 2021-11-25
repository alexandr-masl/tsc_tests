import { State } from '../State';
import { MainMenu } from './MainMenu';
import { Settings_menu } from './Settings/Settings_menu';
import { Trade_menu } from './Trade/Trade_menu';
import { Price_menu } from './Trade/Price_menu';
import { Quantity_menu } from './Trade/Quantity_menu';
import { Confirm_menu } from './Trade/Confirm_menu';

export class States_Store {

    public static instance : States_Store;

    constructor(){

        States_Store.instance = this;
    };

    public static getInstance(): States_Store {
        if (!States_Store.instance){
            States_Store.instance = new States_Store();
        };
        return States_Store.instance;
    };

    public get_state_by_id(state_name: string){


    };

    public  get_user_state(query: any): State{

        const state_id = query.state_name;


        if (state_id === "main_menu" ){

            return new MainMenu;
        }
        else if (state_id === "settings_menu" ){

            return new Settings_menu;
        }
        else if (state_id === "trade_menu" ){

            return new Trade_menu;
        }
        else if (state_id === "price_menu" ){


            return new Price_menu();
        }
    
        else if (state_id === "quantity_menu" ){

            return new Quantity_menu;
    }
        else if (state_id === "confirm_menu" ){

             return new Confirm_menu();
    }
        else {

            return null;
        };
    };
};