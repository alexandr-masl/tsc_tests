const { tokens: { ApiKey } } = require('../settings.json');
const { tokens: { SecretKey } } = require('../settings.json');
const Binance = require('binance-api-node').default;
// import { BinanceExch } from './Exchange/Binance';
const ws  = require('ws')

const symbol_eth = "ETHUSDT"
const symbol_btc = "BTCUSDT"

export const binance_client = Binance({
  apiKey: ApiKey,
  apiSecret: SecretKey,
})  

// function callback(payload){
//     console.log('------ CALLBACK --------')
//     console.log(payload)
// };
// // binance_client.ws.candles(symbol_eth, '1m', callback);
// // binance_client.ws.depth(symbol_eth, callback);
// // binance_client.ws.allTickers(callback);
// binance_client.ws.user(callback);





// const prices = binance_client.prices(callback)
// .then(p => {

//   console.log(p)
// })


async function any_funct(): Promise<void>{

  const balance = await binance_client.accountInfo().then((o: { balances: any[]; }) =>  { 
    const not_null_balances = o.balances.filter((asset: { free: any; locked: any; }) => Number(asset.free) > 0 || Number(asset.locked) > 0 ) 
    return  not_null_balances
 })



  console.log("---> My balance is:", balance)
}

any_funct()









// binance_client.ws.candles(symbol_btc, '1m', candle => {

//   callback(candle);
// });




