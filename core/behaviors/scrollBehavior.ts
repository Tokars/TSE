namespace TSE {

    export class ScrollBehaviorData implements IBehaviorData {

        public name: string;
        public velocity: Vector2 = Vector2.zero;
        public minPosition: Vector2 = Vector2.zero;
        public resetPosition: Vector2 = Vector2.zero;
        public startMessage: string;
        public resetMessage: string;
        public stopMessage: string;


        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error(`[ScrollBehaviorData] error: Name must be difened.`)
            }
            this.name = String(json.name);

            if (json.startMessage === undefined) {
                throw new Error(`[ScrollBehaviorData] error: startMessage must be difened.`)
            } this.startMessage = String(json.startMessage);

            if (json.resetMessage === undefined) {
                throw new Error(`[ScrollBehaviorData] error: resetMessage must be difened.`)
            }
            this.resetMessage = String(json.resetMessage);

            if (json.stopMessage === undefined) {
                throw new Error(`[ScrollBehaviorData] error: stopMessage must be difened.`)
            }
            this.stopMessage = String(json.stopMessage);

            if (json.velocity === undefined) {
                throw new Error(`[ScrollBehaviorData] error: velocity must be difened.`)
            }
            this.velocity.setFromJson(json.velocity);

            if (json.minPosition === undefined) {
                throw new Error(`[ScrollBehaviorData] error: minPosition must be difened.`)
            }
            this.minPosition.setFromJson(json.minPosition);


            if (json.resetPosition === undefined) {
                throw new Error(`[ScrollBehaviorData] error: resetPosition must be difened.`)
            }
            this.resetPosition.setFromJson(json.resetPosition);
        }
    }

    export class ScrollBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "scroll";
        }
        buildFromJson(json: any): IBehavior {
            let data = new ScrollBehaviorData();
            data.setFromJson(json);
            return new ScrollBehavior(data);
        }

    }

    export class ScrollBehavior extends BaseBehavior implements IMessageHandler {

        private _name: string;
        private _velocity: Vector2 = Vector2.zero;
        private _minPosition: Vector2 = Vector2.zero;
        private _resetPosition: Vector2 = Vector2.zero;
        private _startMessage: string;
        private _resetMessage: string;
        private _stopMessage: string;

        private _isScrolling: boolean;
        private _initialPosition: Vector2 = Vector2.zero;

        public constructor(data: ScrollBehaviorData) {
            super(data);
            this.name = data.name;
            this._velocity.copyFrom(data.velocity)
            this._minPosition.copyFrom(data.minPosition);
            this._resetPosition.copyFrom(data.resetPosition);

            this._startMessage = data.startMessage;
            this._stopMessage = data.stopMessage;
            this._resetMessage = data.resetMessage;
        }

        public updateReady(): void {
            super.updateReady();

            Message.subscribe(this._startMessage, this);
            Message.subscribe(this._stopMessage, this);
            Message.subscribe(this._resetMessage, this);
            
            this._initialPosition.copyFrom(this._owner.transform.position.toVector2());
        }

        public onMessage(message: Message): void {
            if (message.code === this._startMessage) {
                this._isScrolling = true;
            } else if (message.code === this._stopMessage) {
                this._isScrolling = false;
            } else if (message.code === this._resetMessage) {
                this.initial();
            }

        }
        private initial(): void {
            this._owner.transform.position.copyFrom(this._initialPosition.toVector3());
        }


        public update(time: number): void {
            if (this._isScrolling) {
                this._owner.transform.position.add(this._velocity.clone().scale(time / 1000).toVector3());
            }

            if (this._owner.transform.position.x <= this._minPosition.x && this._owner.transform.position.y <= this._minPosition.y) {
                this.reset();
            }
        }
        private reset(): void {
            this._owner.transform.position.copyFrom(this._resetPosition.toVector3());
        }
    }

    BehaviorManager.registerBuilder(new ScrollBehaviorBuilder());
}