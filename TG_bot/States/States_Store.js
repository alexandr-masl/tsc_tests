"use strict";
exports.__esModule = true;
exports.States_Store = void 0;
var MainMenu_1 = require("./MainMenu");
var Settings_menu_1 = require("./Settings/Settings_menu");
var User_Menu_1 = require("./User/User_Menu");
var States_Store = /** @class */ (function () {
    function States_Store() {
        States_Store.instance = this;
    }
    ;
    States_Store.getInstance = function () {
        if (!States_Store.instance) {
            States_Store.instance = new States_Store();
        }
        ;
        return States_Store.instance;
    };
    ;
    States_Store.prototype.get_state_by_id = function (state_name) {
    };
    ;
    States_Store.prototype.get_user_state = function (query) {
        var state_id = query.state_name;
        if (state_id === "main_menu") {
            return new MainMenu_1.MainMenu;
        }
        else if (state_id === "settings_menu") {
            return new Settings_menu_1.Settings_menu;
        }
        else if (state_id === "user_menu") {
            return new User_Menu_1.User_menu;
        }
        else {
            return null;
        }
        ;
    };
    ;
    return States_Store;
}());
exports.States_Store = States_Store;
;
