/// <reference path ="componentManager.ts"/>
/// <reference path ="baseComponent.ts"/>

namespace TSE {

    export class SpriteComponentData implements IComponentData {
        public name: string;
        public materialName: string;
        public origin: Vector3 = Vector3.zero;
        public width: number;
        public height: number;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }
            if (json.width !== undefined) {
                this.width = Number(json.width);
            }
            if (json.height !== undefined) {
                this.height = Number(json.height);
            }
            if (json.materialName !== undefined) {
                this.materialName = String(json.materialName);
            }
            // console.log(`[SpriteComponentData] name = [${this.name}] materialName = [${this.materialName}] Set from JSON`);

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }
        }
    }

    export class SpriteComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "sprite";
        }
        public buildFromJson(json: any): IComponent {

            // console.log(`[SpriteComponentBuilder] Build from JSON`);
            let data = new SpriteComponentData();
            data.setFromJson(json);

            return new SpriteComponent(data);
        }
    }

    export class SpriteComponent extends BaseComponent {
        private _sprite: Sprite;
        private _width: number;
        private _height: number;


        public constructor(data: SpriteComponentData) {
            super(data);
            this._width = data.width;
            this._height = data.height;
            this._sprite = new Sprite(data.name, data.materialName, this._width, this._height);

            if (data.origin.equals(Vector3.zero) === false) {
                this._sprite.origin.copyFrom(data.origin);
            }
        }

        public load(): void {
            this._sprite.load();
        }

        public render(shader: Shader) {
            this._sprite.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }
    }
    ComponentManager.registerBuilder(new SpriteComponentBuilder());
}