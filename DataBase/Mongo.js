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
exports.Mongooose = void 0;
var Objects_1 = require("./Objects");
var mongoose = require('mongoose');
var moment = require('moment');
var Mongooose = /** @class */ (function () {
    function Mongooose() {
        Mongooose.instance = this;
        var options = {
            autoIndex: false,
            poolSize: 10,
            bufferMaxEntries: 0,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        };
        var connectWithRetry = function () {
            console.log('MongoDB connection..');
            mongoose.connect("mongodb://localhost:27017/Tsc_tests").then(function () {
                console.log('MongoDB is connected');
            })["catch"](function (err) {
                console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
                console.log(err);
                setTimeout(connectWithRetry, 5000);
            });
        };
        connectWithRetry();
        this.session = new mongoose.model('Session', Objects_1.sessionSchema);
    }
    Mongooose.getInstance = function () {
        if (!Mongooose.instance) {
            Mongooose.instance = new Mongooose();
        }
        ;
        return Mongooose.instance;
    };
    ;
    ;
    Mongooose.prototype.createSession = function (session) {
        return __awaiter(this, void 0, void 0, function () {
            var res, new_session, session_result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        return [4 /*yield*/, this.session.findOne({ session_id: session.message.chat.id }).exec()];
                    case 1:
                        res = _a.sent();
                        if (!(res == null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new this.session({
                                session_id: session.message.chat.id,
                                data: {
                                    message_id: session.message.message_id,
                                    from: session.message.from.id,
                                    text: session.message.text
                                }
                            })];
                    case 2:
                        new_session = _a.sent();
                        return [4 /*yield*/, new_session.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.session.findOne({ session_id: session.message.chat.id }).exec()];
                    case 5:
                        session_result = _a.sent();
                        return [2 /*return*/, session_result];
                    case 6:
                        err_1 = _a.sent();
                        console.log("Can not create session: session_id = " + session.message.chat.id + ", err = " + err_1);
                        throw err_1;
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Mongooose.prototype.getSession = function (session_id) {
        return __awaiter(this, void 0, void 0, function () {
            var user_sess, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.session.findOne({ session_id: session_id }).exec()];
                    case 1:
                        user_sess = _a.sent();
                        if (user_sess) {
                            return [2 /*return*/, (user_sess).toObject()];
                        }
                        else {
                            return [2 /*return*/, null];
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_2 = _a.sent();
                        console.error("Could not get user session  " + session_id + " ");
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ;
    Mongooose.prototype.updateSession = function (session, command) {
        return __awaiter(this, void 0, void 0, function () {
            var time, res_session, err_3, time, res_session, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(command === 'update')) return [3 /*break*/, 6];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        time = moment().format();
                        return [4 /*yield*/, this.session.updateOne({ session_id: session.chat.id }, { $set: {
                                    data: {
                                        message_id: session.message_id,
                                        from: session.from.id,
                                        text: session.text,
                                        date: time
                                    }
                                },
                                $push: { all_messages: session.message_id }
                            }).exec()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.session.findOne({ session_id: session.chat.id }).exec()];
                    case 3:
                        res_session = _a.sent();
                        return [2 /*return*/, res_session];
                    case 4:
                        err_3 = _a.sent();
                        console.log("Can not update session: session_id = " + session.session_id);
                        throw err_3;
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        if (!(command === 'clear')) return [3 /*break*/, 12];
                        _a.label = 7;
                    case 7:
                        _a.trys.push([7, 10, , 11]);
                        time = moment().format();
                        return [4 /*yield*/, this.session.updateOne({ session_id: session.chat.id }, { $set: { data: {
                                        message_id: null,
                                        from: session.from.id,
                                        text: session.text,
                                        date: time
                                    },
                                    all_messages: [] }
                            }).exec()];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, this.session.findOne({ session_id: session.chat.id }).exec()];
                    case 9:
                        res_session = _a.sent();
                        return [2 /*return*/, res_session];
                    case 10:
                        err_4 = _a.sent();
                        console.log("Can not update session: session_id = " + session.session_id);
                        throw err_4;
                    case 11:
                        ;
                        _a.label = 12;
                    case 12:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Mongooose.prototype.add_session_payload = function (session_id, name, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var res_session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(name === "temp_api_keys")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.session.updateOne({ session_id: session_id }, { $set: { payload: { temp_api_keys: { api_key: payload, api_secret: null } } }
                            }).exec()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.session.findOne({ session_id: session_id }).exec()];
                    case 2:
                        res_session = _a.sent();
                        return [2 /*return*/, res_session];
                    case 3: return [2 /*return*/, { err: "unknow request.." }];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Mongooose.prototype.get_session_payload = function (session_id) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.session.findOne({ session_id: session_id }).exec()];
                    case 1:
                        session = _a.sent();
                        return [2 /*return*/, session.payload];
                }
            });
        });
    };
    ;
    Mongooose.prototype.update_session_payload = function (session_id, payload_name, update) {
        return __awaiter(this, void 0, void 0, function () {
            var session, api_key, session_update;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(payload_name === "update_api_secret")) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.session.findOne({ session_id: session_id }).exec()];
                    case 1:
                        session = _a.sent();
                        if (!session)
                            return [2 /*return*/, { err: "session not found..." }];
                        api_key = session.payload.temp_api_keys.api_key;
                        return [4 /*yield*/, this.session.updateOne({ session_id: session_id }, { $set: { payload: { temp_api_keys: { api_key: api_key, api_secret: update } } }
                            }).exec()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.session.findOne({ session_id: session_id }).exec()];
                    case 3:
                        session_update = _a.sent();
                        return [2 /*return*/, session_update];
                    case 4: return [2 /*return*/, { err: "unknow request.." }];
                    case 5:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    Mongooose.prototype.delete_session_payload = function (session_id, payload_name) {
        return __awaiter(this, void 0, void 0, function () {
            var res_session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(payload_name === "temp_api_keys")) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.session.updateOne({ session_id: session_id }, { $set: { payload: { temp_api_keys: null } }
                            }).exec()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.session.findOne({ session_id: session_id }).exec()];
                    case 2:
                        res_session = _a.sent();
                        return [2 /*return*/, res_session];
                    case 3: return [2 /*return*/, { err: "unknow request.." }];
                    case 4:
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    ;
    return Mongooose;
}());
exports.Mongooose = Mongooose;
;
