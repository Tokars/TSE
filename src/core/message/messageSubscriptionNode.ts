namespace TSE {
    export class MessageSubscriptionNode {

        public message: Message;
        public handler: IMessagehandler;

        public constructor(msg: Message, handler: IMessagehandler) {
            this.message = msg;
            this.handler = handler;
        }

    }
}