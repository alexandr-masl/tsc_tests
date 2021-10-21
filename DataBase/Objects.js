"use strict";
exports.__esModule = true;
exports.sessionSchema = void 0;
var mongoose = require('mongoose');
exports.sessionSchema = new mongoose.Schema({
    session_id: {
        type: Number,
        required: true
    },
    data: {
        message_id: Number,
        from: Number,
        text: String,
        date: Date
    },
    notification: {
        message_id: Number,
        status: String
    },
    all_messages: [Number],
    current_state: {
        id: String,
        name: String
    },
    payload: {
        type: new mongoose.Schema({
            temp_api_keys: {
                api_key: String,
                api_secret: String
            }
        })
    }
});
