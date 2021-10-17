

export interface State {

    state_id: string;

    render(ctx: any): void;
    callbacks_handler(query: any, ctx: any): void;
    messages_handler(query: any, ctx: any): void;
};