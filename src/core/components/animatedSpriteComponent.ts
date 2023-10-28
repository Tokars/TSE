/// <reference path ="componentManager.ts"/>
/// <reference path="baseComponent.ts" />
/// <reference path ="spriteComponent.ts"/>
namespace TSE {

    export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {

        public autoPlay: boolean = true;
        public sheetWidth: number;
        public sheetHeight: number;
        public frameWidth: number;
        public frameHeight: number;
        public frameCount: number;
        public frameDelay: number;
        public frameSequence: number[] = [];
        public setFromJson(json: any): void {
            super.setFromJson(json);

            console.log(`[AnimatedSpriteComponentData] name = [${this.name}] materialName = [${this.materialName}] Set from JSON`);
            if (json.autoPlay !== undefined) {
                this.autoPlay = Boolean(json.autoPlay);
            }

            if (json.sheetWidth === undefined) {
                throw new Error(`[AnimatedSpriteComponentData] error : requires sheetWidth.`)
            } else {
                this.sheetWidth = Number(json.sheetWidth);
            }
            if (json.sheetHeight === undefined) {
                throw new Error(`[AnimatedSpriteComponentData] error : requires sheetHeight.`)
            } else {
                this.sheetHeight = Number(json.sheetHeight);
            }
            if (json.frameWidth === undefined) {
                throw new Error(`[AnimatedSpriteComponentData] error : requires frameWidth.`)
            } else {
                this.frameWidth = Number(json.frameWidth);
            }
            if (json.frameHeight === undefined) {
                throw new Error(`[AnimatedSpriteComponentData] error : requires frameHeight.`)
            } else {
                this.frameHeight = Number(json.frameHeight);
            }
            if (json.frameCount === undefined) {
                throw new Error(`[AnimatedSpriteComponentData] error : requires frameCount.`)
            } else {
                this.frameCount = Number(json.frameCount);
            }

            if (json.frameSequence === undefined) {
                throw new Error(`[AnimatedSpriteComponentData] error : requires frameSequence[].`)
            } else {
                this.frameSequence = json.frameSequence;
            }
            if (json.frameDelay === undefined) {
                console.warn(`[AnimatedSpriteComponentData] warn : frameDelay is undefined. Assigned default value. `);
                this.frameDelay = 420;
            } else {
                this.frameDelay = json.frameDelay;
            }
        }
    }

    export class AnimatedSpriteComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "animatedSprite";
        }
        public buildFromJson(json: any): IComponent {

            console.log(`[AnimatedSpriteComponentBuilder] Build from JSON`);

            let data = new AnimatedSpriteComponentData();
            data.setFromJson(json);

            return new AnimatedSpriteComponent(data);
        }
    }

    export class AnimatedSpriteComponent extends BaseComponent {
        private _autoPlay: boolean;
        private _sprite: AnimatedSprite;


        public constructor(data: AnimatedSpriteComponentData) {
            super(data);

            this._autoPlay = data.autoPlay;
            this._sprite = new AnimatedSprite(data.name, data.materialName,
                data.sheetWidth, data.sheetHeight, data.frameWidth, data.frameHeight,
                data.frameCount, data.frameSequence, data.frameDelay);

            if (data.origin.equals(Vector3.zero) === false) {
                this._sprite.origin.copyFrom(data.origin);
            }
        }

        public get isPlaying(): boolean {
            return this._sprite.isPlaying;
        }

        public load(): void {
            this._sprite.load();
        }

        public updateReady(): void {
            if (this._autoPlay === false) {
                this._sprite.stop();
            }
        }
        public update(time: number): void {
            this._sprite.update(time);
            super.update(time);
        }
        public render(shader: Shader) {
            this._sprite.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }

        public play(): void {
            this._sprite.play();
        }
        public stop(): void {
            this._sprite.stop();
        }


        public setFrame(frame: number): void {
            this._sprite.setFrame(frame);
        }
    }

    ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
}