namespace TSE {
    export class MessageSubscriptionNode {

        public message: Message;
        public handler: IMessageHandler;

        public constructor(msg: Message, handler: IMessageHandler) {
            this.message = msg;
            this.handler = handler;
        }

    }
}