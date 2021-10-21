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
exports.TG_bot = void 0;
var token_dev = require('../settings.json').tokens.token_dev;
var Telegraf = require('telegraf').Telegraf;
var Markup = Telegraf.Markup;
var Mongo_1 = require("../DataBase/Mongo");
var MainMenu_1 = require("./States/MainMenu");
var States_Store_1 = require("./States/States_Store");
var moment = require('moment');
var colors = require('colors');
var TG_bot = /** @class */ (function () {
    function TG_bot() {
        TG_bot.instance = this;
        this.token = token_dev;
        TG_bot._users_states = [];
        this.tg_bot_inst = new Telegraf(this.token);
        this.tg_bot_inst["catch"](function (error) {
            console.log('telegraf error', error.response, error.parameters, error.on || error);
        });
        // this.tg_bot_inst.use(async (ctx: any, next: any) => {
        //     const txt = ctx.channelPost;
        //     if (txt){
        //         this.channel_update(txt, ctx);
        //     }
        //     await next();
        // });
        this.tg_bot_inst.launch();
        this.launch_bot();
    }
    ;
    TG_bot.prototype.check_channel = function (channel_id, user_id) {
        return __awaiter(this, void 0, void 0, function () {
            var isMemberCheck, is_member, admins, isAdmin, is_creator;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                            var err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, this.tg_bot_inst.telegram.getChat(channel_id)];
                                    case 1: return [2 /*return*/, _a.sent()];
                                    case 2:
                                        err_1 = _a.sent();
                                        return [2 /*return*/, null];
                                    case 3:
                                        ;
                                        return [2 /*return*/];
                                }
                            });
                        }); })()];
                    case 1:
                        isMemberCheck = _a.sent();
                        is_member = isMemberCheck;
                        console.log(' --- is member CHECK ---');
                        console.log(is_member);
                        if (!is_member) return [3 /*break*/, 3];
                        return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                                var err_2;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 2, , 3]);
                                            return [4 /*yield*/, this.tg_bot_inst.telegram.getChatAdministrators(channel_id)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                        case 2:
                                            err_2 = _a.sent();
                                            return [2 /*return*/, { err: err_2 }];
                                        case 3:
                                            ;
                                            return [2 /*return*/];
                                    }
                                });
                            }); })()];
                    case 2:
                        admins = _a.sent();
                        if (admins.err) {
                            console.log('!!!!!ADMIN CHECK ERR');
                            console.log(admins.err['response']);
                            return [2 /*return*/, null];
                        }
                        ;
                        isAdmin = admins.find(function (admin) { return admin.user.id == user_id; });
                        console.log('--- Get chat ADMINS ----');
                        console.log(isAdmin);
                        is_creator = (isAdmin && isAdmin.status === 'creator') ? true : false;
                        return [2 /*return*/, {
                                isMember: is_member,
                                is_admin: is_creator
                            }];
                    case 3: return [2 /*return*/, null];
                }
            });
        });
    };
    ;
    TG_bot.prototype.get_chat_info = function (ch) {
        return __awaiter(this, void 0, void 0, function () {
            var ch_inf, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.tg_bot_inst.telegram.getChat(ch)["catch"](console.error())];
                    case 1:
                        ch_inf = _a.sent();
                        return [2 /*return*/, ch_inf];
                    case 2:
                        err_3 = _a.sent();
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    TG_bot.prototype.launch_bot = function () {
        return __awaiter(this, void 0, void 0, function () {
            var time;
            var _this = this;
            return __generator(this, function (_a) {
                this.tg_bot_inst.command('start', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                    var session, err_4;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 5, , 6]);
                                return [4 /*yield*/, Mongo_1.Mongooose.getInstance().getSession(ctx.chat.id)];
                            case 1:
                                session = _a.sent();
                                if (!!session) return [3 /*break*/, 3];
                                return [4 /*yield*/, Mongo_1.Mongooose.getInstance().createSession(ctx.update)];
                            case 2:
                                _a.sent();
                                _a.label = 3;
                            case 3:
                                ;
                                return [4 /*yield*/, TG_bot.changeState(new MainMenu_1.MainMenu(), ctx)];
                            case 4: 
                            // const user = await Application.getInstance().get_user(ctx.chat.id)
                            return [2 /*return*/, _a.sent()];
                            case 5:
                                err_4 = _a.sent();
                                console.log(colors.red('!!! MCR BOT :: on start err ...'));
                                console.log(err_4);
                                return [3 /*break*/, 6];
                            case 6:
                                ;
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.tg_bot_inst.on('text', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, this._text_querry_handler(ctx)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                this.tg_bot_inst.on('callback_query', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
                                ctx.answerCbQuery();
                                return [4 /*yield*/, this._callbacks_handler(ctx)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); });
                time = moment().format();
                // if(this.token === token_dev){
                console.log(colors.yellow('MCR:::DEV version ::: ') + time);
                return [2 /*return*/];
            });
        });
    };
    ;
    TG_bot.getInstance = function () {
        if (!TG_bot.instance) {
            TG_bot.instance = new TG_bot();
        }
        ;
        return TG_bot.instance;
    };
    ;
    TG_bot.changeState = function (state, ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var chat_id, user_state, new_user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        chat_id = ctx.chat.id;
                        user_state = TG_bot._users_states.find(function (user) { return user.id == chat_id; });
                        if (!user_state) {
                            new_user = {
                                id: ctx.chat.id,
                                curr_state: state,
                                ctx: ctx
                            };
                            this._users_states.push(new_user);
                        }
                        else {
                            this._users_states.map(function (user) {
                                if (user.id == chat_id) {
                                    user.curr_state = state;
                                    user.ctx = ctx;
                                }
                                ;
                            });
                        }
                        ;
                        return [4 /*yield*/, TG_bot.getInstance()._delete_expired_keyboard(ctx)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, TG_bot.getInstance()._delete_expired_notification(ctx)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, state.render(ctx)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ;
    TG_bot.delete_last_message = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, ctx.deleteMessage()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    TG_bot.prototype.send_notification = function (notification, for_user) {
        return __awaiter(this, void 0, void 0, function () {
            var user_state, home_btn_clbck, inlineMessageRatingKeyboard;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_state = TG_bot._users_states.find(function (state) { return state.id == for_user; });
                        if (!user_state) return [3 /*break*/, 4];
                        return [4 /*yield*/, TG_bot.getInstance()._delete_expired_keyboard(user_state.ctx)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, TG_bot.getInstance().tg_bot_inst.telegram.sendMessage(for_user, notification).then(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, user_state.curr_state.render(user_state.ctx)];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4:
                        home_btn_clbck = JSON.stringify({ home_button: true });
                        inlineMessageRatingKeyboard = Markup.inlineKeyboard([
                            Markup.callbackButton("home_btn_txt", home_btn_clbck)
                        ]).extra();
                        return [4 /*yield*/, this.tg_bot_inst.telegram.sendMessage(for_user, notification, inlineMessageRatingKeyboard).then(function (msg) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    TG_bot.prototype._callbacks_handler = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var query, user_menu;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = JSON.parse(ctx.update["callback_query"]["data"]);
                        if (!query)
                            return [2 /*return*/, null];
                        if (!query.home_button) return [3 /*break*/, 2];
                        return [4 /*yield*/, TG_bot.changeState(new MainMenu_1.MainMenu, ctx)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        ;
                        user_menu = States_Store_1.States_Store.getInstance().get_user_state(query);
                        // const user_state = TG_bot._users_states.find(user => user.id == ctx.chat.id);
                        // if (user_state && user_state.curr_state.state_id !== user_menu.state_id){
                        //     // await ctx.deleteMessage(ctx.update["callback_query"].message.message_id);
                        //     return null;
                        // };
                        if (!user_menu) {
                            return [2 /*return*/, console.log(colors.red("!!! TG_bot : _callbacks_handler : Can NOT define menu of callback  !!!!!"))];
                        }
                        ;
                        user_menu.callbacks_handler(query, ctx);
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    TG_bot.prototype._text_querry_handler = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var user_state, err_6, query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user_state = TG_bot._users_states.find(function (state) { return state.id == ctx.chat.id; });
                        if (!!user_state) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, ctx.deleteMessage()];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        ;
                        return [2 /*return*/, null];
                    case 5:
                        ;
                        query = ctx.update.message.text;
                        // await Mongooose.getInstance().updateSession(ctx.update.message, 'update');
                        return [4 /*yield*/, user_state.curr_state.messages_handler(query, ctx)];
                    case 6:
                        // await Mongooose.getInstance().updateSession(ctx.update.message, 'update');
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    TG_bot.prototype._delete_expired_notification = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Mongo_1.Mongooose.getInstance().getSession(ctx.chat.id)];
                    case 1:
                        session = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    TG_bot.prototype._delete_expired_keyboard = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Mongo_1.Mongooose.getInstance().getSession(ctx.chat.id)
                        // if (session.all_messages && session.all_messages.length){
                        //     await session.all_messages.map(async msg => {
                        //         try{  
                        //             await ctx.deleteMessage(msg);
                        //          }catch(o){
                        //             return null;
                        //          };
                        //     });
                        //     const ctx_update = ctx.update.callback_query ? ctx.update.callback_query.message : ctx.update.message
                        //     const clear = await Mongooose.getInstance().updateSession(ctx_update, 'clear');
                        // };
                    ];
                    case 1:
                        session = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return TG_bot;
}());
exports.TG_bot = TG_bot;
;
