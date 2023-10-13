namespace TSE {
    export interface IMessagehandler {
        onMessage(message: Message): void;
    }
}