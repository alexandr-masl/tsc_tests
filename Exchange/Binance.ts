import {Exchange} from './Exchange';


const Binance = require('binance-api-node').default
 
export class BinanceExch implements Exchange {
   private client : any

   constructor (apiKey : string, apiSecret : string) {  
      this.client = Binance({
         apiKey: apiKey,
         apiSecret: apiSecret
      });
   };

   async place_order(order: any): Promise<null|any> {   
      try{   
         
         if (order.type === 'MARKET') {
         const mrkt = await this.client.order({
               symbol: order.symbol,
               type: order.type,
               side: order.side,
               quantity: order.quantity,
               newClientOrderId: order.clientOrderId,
               useServerTime: true,
            }).then(o => {return o }).catch(o => { return o });

            return mrkt;
         };

         if (order.type === 'LIMIT') {
            const limit = await this.client.order({
               symbol: order.symbol,
               type: order.type,
               side: order.side,
               quantity: order.quantity,
               price: order.price,
               newClientOrderId: order.clientOrderId,
               useServerTime: true,
            }).then(o => {return o}).catch(o => { return o});

            return limit;
         };

         if (order.type === 'STOP_LOSS_LIMIT') {
            const sl = await this.client.order({
               symbol: order.symbol,
               type: order.type,
               side: order.side,
               quantity: order.quantity,
               price: order.price,
               stopPrice: order.stopPrice,
               newClientOrderId: order.clientOrderId,
               useServerTime: true,
            }).then(o => {return o}).catch(o => { return o});

            return sl;
         };
      }
      catch(err){
         return {
            err: err
         };
      };
   };

   async cancel_order(order: any): Promise <any> {  
      try{  
         const cancel = await this.client.cancelOrder({
            symbol: order.symbol,
            origClientOrderId: order.clientOrderId,
            useServerTime: true
         })
         .then(o => {
            return o
         })
         .catch(o => {
            return o
         })

         if(cancel){
            return cancel
         }
         else{
            return null
         }
      }
      catch(err){
         return {
            err: err
         };
      };
   };

   async accountInfo( callback: (o: any) => void ){
      try{
         await this.client.accountInfo().then(o =>{        
            callback(o)
         })
      }
      catch(err){
         callback(err)
      }
   }

   getCandles( symbol : string, period : string, callback: (o: any) => any ) {
      const candle = this.client.ws.candles(symbol, period, candle => {

         if(candle.isFinal) {
            callback(candle);
            stop();
         };
     });
   
     function stop() { candle()}
   }

   price_stream(symbol : string, callback: (o: any) => any){

      const candle = this.client.ws.candles(symbol, '1m', candle => {

         callback(candle);
      });
     
     return candle;
   };

   async exch_balance(coin : string){  

      const balance = await this.client.accountInfo().then(o => {

         if (o.balances.filter(asset => asset.asset === coin).length){  

            return  o.balances.find(asset => asset.asset === coin); 
         }
         else{

            return null;
         } 
      });
      
      return {
         method: 'exch_balance',
         recived: balance
      };
   }

   async all_balances(){  
      try{
         const balance = await this.client.accountInfo().then(o =>  { 
            const not_null_balances = o.balances.filter(asset => Number(asset.free) > 0 || Number(asset.locked) > 0 ) 
            return  not_null_balances
         })

         if(balance){ 
            
            return balance
         }
         else{ 
            return null;
         }
      }
      catch(err){
         return err;
      }
   }

   async all_prices(){
     const prices = await this.client.prices()
      // .then(o => callback(o)).catch(o => callback(o))

      return {
         method: 'all_prices',
         recived: prices
      }
   }

   async curr_Price(symbol : string){
      const prices =  await this.client.prices();

      return {
         method: 'curr_Price',
         recived: prices[symbol]
      };
   };

   async current_price(symbol : string){
      const prices =  await this.client.prices();

      return prices[symbol] ? prices[symbol] : {err: "no price"};
   };

   account_stream(callback: (o: any) => any): any {

      const stream = this.client.ws.user(callback);
     
      return stream;
   };

   async symbol_info(symbol : string){

      const _info = await this.client.exchangeInfo().then( info =>  {


         const symbol_info = {

            symbol         : {},
            priceRangeUp   : {},
            priceRangeDown : {},
            minPrice       : {},
            maxPrice       : {},
            tickSize       : {},
            minQty         : {},
            maxQty         : {},
            minNotional    : {},
            info           : info
         }

         // console.log('binance:::exchange info:::')
         // console.log(info)

         info.symbols.map(symbolB => {

            if (symbolB.symbol === symbol){

               symbol_info.symbol = symbolB.symbol


               symbolB.filters.map(f => {
                  if (f.filterType === 'PERCENT_PRICE')
                  {
                        symbol_info.priceRangeUp =  Number(f.multiplierUp)
                        symbol_info.priceRangeDown = Number(f.multiplierDown)
                  }
                  if (f.filterType === 'PRICE_FILTER')
                  {
                     symbol_info.minPrice = f.minPrice
                     symbol_info.maxPrice = f.maxPrice
                     symbol_info.tickSize = Number(f.tickSize)
                  }
                  else if (f.filterType === 'LOT_SIZE')
                  {
                     symbol_info.minQty = Number(f.minQty)
                     symbol_info.maxQty = Number(f.maxQty)
                  }
                  else if (f.filterType === 'MIN_NOTIONAL')
                  {
                     symbol_info.minNotional = Number(f.minNotional)
                  }
               })
            }
         })

         return {
            method: 'symbol_info',
            recived: symbol_info
         };
      })

      return _info
   };

   async getOpenOrder(symbol : string) {
         
      const openOrders = await this.client.openOrders({ symbol });
      return openOrders;
   };

   async getSymbolOrders(symbol : string): Promise<any[]> {
         
      const orders = await this.client.allOrders({symbol});

      if (orders && orders.length)
         return orders;
      else 
         return [];
   };

   get_whole_balance_in_base_curr(balances: any,  prices: any) {

      const btc_balance = exch_balance_of_base_curr(balances, prices, 'BTC')
      const usdt_balance = exch_balance_of_base_curr(balances, prices, 'USDT')

      const both_balances = {
          BTC  : btc_balance,
          USDT : usdt_balance
      }

      function exch_balance_of_base_curr (balances_arr: any[], prices_arr: any[], curr: any) { 
         
         // console.log('binance :: get balance of base curr :: got balance arr : ')
         // console.log(balances_arr);

         let balance_of_base_curr = balances_arr.find(asset => asset.asset === curr)

         if ( balance_of_base_curr) {    

             let whole_balance = Number(balance_of_base_curr.free) + Number(balance_of_base_curr.locked)
 
             let all_coins_in_base_curr = [] 
 
             balances_arr.map( async asset => {      
     
                 if ( asset.asset !== curr ) { 
     
                     let curr_price
     
                     if ( curr === 'BTC' && asset.asset === 'USDT') { 
     
                         curr_price = prices_arr[ curr + asset.asset]
                     }
                     else { 
     
                         curr_price = prices_arr[asset.asset + curr]
                     }    
     
     
                     let asset_in_base_curr = { 
     
                         symbol : asset.asset + curr,
                         amount : Number(curr_price) * (Number(asset.free) + Number(asset.locked))
                     }
         
                     if ( curr === 'BTC' && asset.asset === 'USDT' ) {
     
                         asset_in_base_curr = { 
     
                             symbol : asset.asset + curr,
                             amount :  (Number(asset.free) + Number(asset.locked)) / Number(curr_price)
                         }
     
                         const price = ((Number(asset.free) + Number(asset.locked)) / Number(curr_price)) + 1 
     
                         if ( price > 1.0001) {
     
                             all_coins_in_base_curr.push(asset_in_base_curr)
                         }
                         
                         else { return }
     
                     }
                     else { 
     
                         if (((Number(asset.free) + Number(asset.locked)) * Number(curr_price) + 1 ) > 1.0001) {
     
                             all_coins_in_base_curr.push(asset_in_base_curr)
                         }
                         else { return }
                     }
                     
                 } 
                 else { return }
     
             })
     
             if (all_coins_in_base_curr.length > 0 ) { 
     
                 let res_balance = 0 
                 const base_bal = (Number(balance_of_base_curr.free)  + Number(balance_of_base_curr.locked))
     
                 all_coins_in_base_curr.map(b => { 
     
                     res_balance = res_balance + b.amount
                 })
     
                 return res_balance + base_bal
             }
             else { 
                 return whole_balance
             }
         }
         else {
             return null
         }
     }
      
     return both_balances
   };

   async multy_request(methods: any[]): Promise<null|any> {
      if(!methods.length){
         return null;
      }
      else{
         methods.map(method => method = Promise.resolve(method));
      }

      let object_to_return = {};

      try{      

         await Promise.all(methods)
            .then(responses => {
                  responses.map(response => {
                     const method = response.method;
                     const recived = response.recived;

                     object_to_return[method] = recived;
                  });
            });
            
            return object_to_return;
         }
         catch(err){
            return object_to_return
         }
   };
};
