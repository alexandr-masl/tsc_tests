import { sessionSchema, userConfigSchema } from "./Objects";

const mongoose = require('mongoose')
const moment       = require('moment')

export class Mongooose {
  
  private static instance: Mongooose;
  public session : any;
  public users_configs: any;

  public static getInstance(): Mongooose {
    if (!Mongooose.instance) {
      Mongooose.instance = new Mongooose();
    };
    return Mongooose.instance;
  };

  constructor() {

    Mongooose.instance = this

    const options = {
      autoIndex: false,
      poolSize: 10,
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    };
  
    const connectWithRetry = () => {

      console.log('MongoDB connection..');
      
      mongoose.connect("mongodb://localhost:27017/Tsc_tests").then(()=>{

        console.log('MongoDB is connected');

      }).catch(err=>{

        console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
        console.log(err);
        setTimeout(connectWithRetry, 5000);

      });
    };
  
    connectWithRetry();

    this.session = new mongoose.model('Session', sessionSchema);
    this.users_configs = new mongoose.model('Config', userConfigSchema);
  };

  async create_user_config(chat_id: number){
    try {

      const res = await this.users_configs.findOne({config_id: chat_id}).exec();

      if (!res) {
          const new_session = await new this.users_configs({
            config_id: chat_id
          });
          await new_session.save();
      };

      const res_update = await this.users_configs.findOne({config_id: chat_id}).exec();
      return res_update
    }
    catch (err) {
        console.log(`Can not create user config = ${chat_id}, err = ${err}`);
        throw err;
    }
  };

  async get_user_config(chat_id: number){

    const config = await this.users_configs.findOne({config_id: chat_id}).exec();

    if (!config){

      return await this.create_user_config(chat_id)
    }

    return config;
  };

  async update_users_trade_options(chat_id: number, new_trade_type: string){

    try {

        await this.users_configs.updateOne({config_id: chat_id}, 
          { $set: { 
              trade_options : new_trade_type
            }
        }).exec();

        const res_update = await this.users_configs.findOne({config_id: chat_id}).exec();
        return res_update
    }
    catch (err) {
        console.log(`Can not update trade options = ${chat_id}`);
        throw err;
    }

  };
  async update_users_quantity(chat_id: number, new_quantity: number){

    try {

        await this.users_configs.updateOne({config_id: chat_id}, 
          { $set: { 
              quantity : new_quantity
            }
        }).exec();

        const res_update = await this.users_configs.findOne({config_id: chat_id}).exec();
        return res_update
    }
    catch (err) {
        console.log(`Can not update quantity = ${chat_id}`);
        throw err;
    }

  };
  async update_users_price(chat_id: number, new_price: number){

    try {

        await this.users_configs.updateOne({config_id: chat_id}, 
          { $set: { 
              price : new_price
            }
        }).exec();

        const res_update = await this.users_configs.findOne({config_id: chat_id}).exec();
        return res_update
    }
    catch (err) {
        console.log(`Can not update price = ${chat_id}`);
        throw err;
    }

  };
  async update_users_coin(chat_id: number, new_coin: number){

    try {

        await this.users_configs.updateOne({config_id: chat_id}, 
          { $set: { 
              coin : new_coin
            }
        }).exec();

        const res_update = await this.users_configs.findOne({config_id: chat_id}).exec();
        return res_update
    }
    catch (err) {
        console.log(`Can not update coin = ${chat_id}`);
        throw err;
    }

  };

  async createSession(session) {
    try {
        const res = await this.session.findOne({ session_id : session.message.chat.id }).exec();

        if (!res) {
            const new_session = await new this.session({
                session_id : session.message.chat.id,
                data : {
                  message_id : session.message.message_id,
                  from       : session.message.from.id,
                  text       : session.message.text
                }
            });
            await new_session.save();
        };

        const session_result = await this.session.findOne({ session_id : session.message.chat.id }).exec();
        return session_result
    }
    catch (err) {
        console.log(`Can not create session: session_id = ${session.message.chat.id}, err = ${err}`);
        throw err;
    }
  };

  async getSession(session_id) {

    try {
      let user_sess = await this.session.findOne({session_id}).exec();
      if ( user_sess ) {
        return (user_sess).toObject()
      }
      else {
        return null
      }
    }
    catch (err) {

      console.error(`Could not get user session  ${session_id} `);
      throw err;
    }
  };

  async updateSession(session: any, command: string) {
    
    if ( command === 'update'){    
      try {
          const time = moment().format();

          await this.session.updateOne({session_id : session.chat.id }, 
            { $set: { 
              data : {
                message_id : session.message_id,
                from       : session.from.id,
                text       : session.text,
                date       : time
              }}, 
              $push: {all_messages: session.message_id},
            }).exec();
          const res_session = await this.session.findOne({session_id : session.chat.id}).exec();
          return res_session;
      }
      catch (err) {
          console.log(`Can not update session: session_id = ${session.session_id}`);
          throw err;
      }
    }
    else if (command === 'clear') {
      try {
        const time = moment().format();
        await this.session.updateOne({session_id : session.chat.id }, 
          { $set: { data : {
                      message_id : null,
                      from       : session.from.id,
                      text       : session.text,
                      date       : time
                    },
                    all_messages : []} 
          }).exec();
        const res_session = await this.session.findOne({session_id : session.chat.id}).exec();
        return res_session
      }
      catch (err) {
          console.log(`Can not update session: session_id = ${session.session_id}`);
          throw err;
      };
    };
  };

  async add_session_payload(session_id: any, name: string, payload: any){

    if (name === "temp_api_keys"){

      await this.session.updateOne({session_id: session_id }, 
        {$set: {payload: {temp_api_keys: {api_key: payload, api_secret: null}}}
      }).exec();
  
      const res_session = await this.session.findOne({session_id : session_id}).exec();
  
      return res_session;
    }
    else {

      return {err: "unknow request.."};
    };
  };

  async get_session_payload(session_id: any){

    const session = await this.session.findOne({session_id : session_id}).exec();
    return session.payload;
  };

  async update_session_payload(session_id: number, payload_name: string, update: any){

    if (payload_name === "update_api_secret"){

      const session = await this.session.findOne({session_id : session_id}).exec();

      if (!session)
        return {err: "session not found..."}

      const api_key = session.payload.temp_api_keys.api_key

      await this.session.updateOne({session_id: session_id }, 
        {$set: {payload: {temp_api_keys: {api_key: api_key, api_secret: update}}}
      }).exec();
  
      const session_update = await this.session.findOne({session_id : session_id}).exec();
  
      return session_update;
    }
    else {

      return {err: "unknow request.."};
    };
  };

  async delete_session_payload(session_id: number, payload_name: string){

    if ( payload_name === "temp_api_keys"){

      await this.session.updateOne({session_id: session_id }, 
        {$set: {payload: {temp_api_keys: null}}
      }).exec();
  
      const res_session = await this.session.findOne({session_id : session_id}).exec();
  
      return res_session;
    }
    else {

      return {err: "unknow request.."};
    };
  };



};
