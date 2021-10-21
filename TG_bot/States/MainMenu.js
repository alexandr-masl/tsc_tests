"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MainMenu = void 0;
var colors = require("colors");
var TG_bot_1 = require("../TG_bot");
var Settings_menu_1 = require("./Settings/Settings_menu");
var User_Menu_1 = require("../States/User/User_Menu");
var Extra = require('telegraf/extra');
var MainMenu = /** @class */ (function () {
    function MainMenu() {
        this.state_id = "main_menu";
        this._settings_menu_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "first" });
        this._user_menu_btn_calbck = JSON.stringify({ state_name: this.state_id, state_query: "second" });
        this._btn_3_calbck = JSON.stringify({ state_name: this.state_id, state_query: "third" });
    }
    ;
    MainMenu.prototype.render = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, error;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        // const buttons = Markup.button.url(['First Button', this._btn_1_calbck])
                        // const button = Markup.keyboard(buttons: HideableKBtn[][])
                        return [4 /*yield*/, ctx.reply('<b>Main Menu</b>\n', Extra.HTML().markup(function (m) {
                                return m.inlineKeyboard([
                                    [
                                        m.callbackButton('Settings', _this._settings_menu_btn_calbck),
                                        m.callbackButton('User', _this._user_menu_btn_calbck),
                                        m.callbackButton('❗️THIRD', _this._btn_3_calbck)
                                    ]
                                ]);
                            }))
                                .then(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 1:
                        // const buttons = Markup.button.url(['First Button', this._btn_1_calbck])
                        // const button = Markup.keyboard(buttons: HideableKBtn[][])
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        error = '🤬 menu err..';
                        console.log(err_1);
                        return [3 /*break*/, 3];
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MainMenu.prototype.callbacks_handler = function (query, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(query.state_query == "first")) return [3 /*break*/, 2];
                        console.log(" ------->>>>> FIRST BUTTON TRIGERED !!!!!!!!!!!!!!!");
                        return [4 /*yield*/, TG_bot_1.TG_bot.changeState(new Settings_menu_1.Settings_menu, ctx)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        if (!(query.state_query === "second")) return [3 /*break*/, 4];
                        console.log(" ------->>>>> SECOND BUTTON TRIGERED !!!!!!!!!!!!!!!");
                        return [4 /*yield*/, TG_bot_1.TG_bot.changeState(new User_Menu_1.User_menu, ctx)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        if (query.state_query === "third") {
                        }
                        else {
                            console.log(colors.red("!!!!!  MainMenu ERRR : Can NOT define callback_query, user:" + ctx.chat.id));
                            return [2 /*return*/, null];
                        }
                        _a.label = 5;
                    case 5:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MainMenu.prototype.messages_handler = function (query, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        console.log("::::::::::: MAIN MENU, query", query);
                        return [4 /*yield*/, ctx.deleteMessage()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    MainMenu.prototype.test_f = function () {
    };
    ;
    return MainMenu;
}());
exports.MainMenu = MainMenu;
;
