const { tokens: { ApiKey } } = require('../settings.json');
const { tokens: { SecretKey } } = require('../settings.json');
const Binance = require('binance-api-node').default;
import { BinanceExch } from './Exchange/Binance';
import {Exchange} from './Exchange/Exchange';
const ws  = require('ws')

const TestClient = new BinanceExch(ApiKey, SecretKey)


const client = Binance({
    apiKey: ApiKey,
    apiSecret: SecretKey,
  })
  
  console.log(client.ping())
  console.log(client.exchangeInfo())
  console.log(client.getInfo())

const socket = new ws("wss://stream.binance.com:9443/ws/ltcbtc@aggTrade/ethbtc@aggTrade")
socket.onopen = function(e) {
   console.log("Соединение установлено");
   console.log("Отправляем данные на сервер");
};
  
  socket.onmessage = function(event) {
    console.log(`Данные получены с сервера: ${event.data}`);
  };
  
  socket.onclose = function(event) {
    if (event.wasClean) {
        console.log(`Соединение закрыто, код=${event.code} причина=${event.reason}`);
    } else {
        console.log('Соединение прервано');
    }
  };
   socket.onerror = function(error) {
       console.log(`[error] ${error.message}`);
  };

