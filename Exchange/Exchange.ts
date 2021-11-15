   
export interface Exchange {
   getCandles( symbol: string, period: string, callback: (o: any) => void )
   all_prices(): any;
   account_stream(callback: (o: any)=> any) : any;
   accountInfo( callback: (o: any) => void ): any;
   getOpenOrder(symbol: string): any;
   getSymbolOrders(symbol : string): Promise<any[]>;
   exch_balance(symbol: string): any;
   curr_Price(symbol: string): any;
   symbol_info(strin: string): any;
   price_stream(symbol: string, callback: (o: any) => any): any;
   cancel_order(order: any): any;
   place_order(order: any): any;
   all_balances(): any;
   get_whole_balance_in_base_curr(balances: any,  prices: any): any;
   multy_request(methods: any[]): Promise<null|any>;
   current_price(symbol : string);
};
