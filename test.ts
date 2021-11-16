const { tokens: { ApiKey } } = require('../settings.json');
const { tokens: { SecretKey } } = require('../settings.json');
const Binance = require('binance-api-node').default;
import { BinanceExch } from './Exchange/Binance';
import {Exchange} from './Exchange/Exchange';
const ws  = require('ws')

const TestClient = new BinanceExch(ApiKey, SecretKey)

const symbol_eth = "ETHUSDT"
const symbol_btc = "BTCUSDT"

const binance_client = Binance({
  apiKey: ApiKey,
  apiSecret: SecretKey,
})  

function callback(payload){


    console.log('------ CALLBACK --------')
    console.log(payload)
};


// binance_client.ws.candles(symbol_eth, '1m', callback);


const prices = binance_client.prices(callback)
// .then(p => {

//   console.log(p)
// })


async function any_funct(){

  const prices = await binance_client.prices()

  const my_coin = prices[symbol_eth]

  console.log("---> My coin price:", my_coin)
}

any_funct









// binance_client.ws.candles(symbol_btc, '1m', candle => {

//   callback(candle);
// });




// const socket = new ws("wss://stream.binance.com:9443/ws/ltcbtc@aggTrade/ethbtc@aggTrade")

// socket.onopen = function(e) {
//    console.log("Соединение установлено");
//    console.log("Отправляем данные на сервер");
// };
  
// socket.onmessage = function(event) {
//   console.log(`Данные получены с сервера: ${event.data}`);
// };

// socket.onclose = function(event) {
//   if (event.wasClean) {
//       console.log(`Соединение закрыто, код=${event.code} причина=${event.reason}`);
//   } else {
//       console.log('Соединение прервано');
//   }
// };
//   socket.onerror = function(error) {
//       console.log(`[error] ${error.message}`);
// };



