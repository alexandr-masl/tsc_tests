import { State } from '../State';
import { MainMenu } from './MainMenu';

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

        const state_id = query.s;
        const trade_id = query.t;
        const state_payload = query.pl;

        if (state_id === "main_menu" ){

            return new MainMenu;
        }
        else {

            return null;
        };
    };
};