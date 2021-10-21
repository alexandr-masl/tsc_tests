import { State } from '../State';
import { MainMenu } from './MainMenu';
import { Settings_menu } from './Settings/Settings_menu';
import { User_menu } from './User/User_Menu';

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
        else if (state_id === "user_menu" ){

            return new User_menu;
        }
        else {

            //hghghghghgh
            return null;
        };
    };
};