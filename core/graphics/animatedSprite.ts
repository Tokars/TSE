/// <reference path ="sprite.ts"/>

namespace TSE {

    class UVInfo {

        public constructor(min: Vector2, max: Vector2) {
            this.min = min;
            this.max = max;
        }

        public min: Vector2;
        public max: Vector2;
    }

    export class AnimatedSprite extends Sprite {
        private _frameWidth: number;
        private _frameHeight: number;
        private _frameCount: number;
        private _frameSequence: number[];
        private _currentFrame: number = 0;
        private _frameTime: number;
        private _currentTime: number = 0; // miliseconds. todo: make config.
        private _frameUVs: UVInfo[] = [];
        /**
         * Create sprite.
         * @param name name of this sprite.
         * @param materialName name of the material to use with this sprite.
         * @param width of this sprite.
         * @param height of this sprite.
         */
        public constructor(
            name: string, materialName: string,
            width: number = 64, height: number = 64,
            frameWidth: number = 10, frameHeight: number = 10,
            frameCount: number = 1, frameSequence: number[] = [], frameDelay: number = 420) {
            super(name, materialName, width, height);

            this._frameTime = frameDelay;
            this._frameWidth = frameWidth;
            this._frameHeight = frameHeight;
            this._frameCount = frameCount;
            this._frameSequence = frameSequence;
            this.calcUVs();
        }

        private calcUVs() {
            let x: number = 0;
            let y: number = 0;
            for (let i = 0; i < this._frameCount; ++i) {
                x = (i * this._frameWidth) % this._width;
                console.log(`x = ${x}: y = ${y}`);
                let minU = x / this._width;
                let minV = (y * this._frameHeight) / this._height;
                let min: Vector2 = new Vector2(minU, minV);
                console.log(`min UV [x.${min.x} y.${min.y}]`);
                let maxU = (x + this._frameWidth) / this._width;
                let maxV = ((y * this._frameHeight) + this._frameHeight) / this._height;
                let max: Vector2 = new Vector2(maxU, maxV);
                console.log(`max UV [x.${max.x} y.${max.y}]`);

                // it's mean uv pos. reached to the right edge of sprite-sheet.
                if (max.x == 1) {
                    y++; // move pos. by .y
                    x = 0; // reset .x.
                }
                this._frameUVs.push(new UVInfo(min, max));
            }
        }
        public load(): void {
            super.load();
        }

        public update(time: number): void {
            this._currentTime += time;

            if (this._currentTime > this._frameTime) {
                this._currentTime = 0;

                if (this._currentFrame >= this._frameSequence.length) {
                    this._currentFrame = 0;
                }

                let frameIndex = this._frameSequence[this._currentFrame];
                let UV = this._frameUVs[frameIndex];

                this._vertices = [
                    // x,y,z, u,v
                    new Vertext(0, 0, 0, UV.min.x, UV.min.y),
                    new Vertext(0, this._frameHeight, 0, UV.min.x, UV.max.y),
                    new Vertext(this._frameWidth, this._frameHeight, 0, UV.max.x, UV.max.y),
                    new Vertext(this._frameWidth, this._frameHeight, 0, UV.max.x, UV.max.y),
                    new Vertext(this._frameWidth, 0, 0, UV.max.x, UV.min.y),
                    new Vertext(0, 0, 0, UV.min.x, UV.min.y),
                ];

                this._buffer.clearData();
                for (let v of this._vertices) {
                    this._buffer.pushBackData(v.toArray());
                }
                this._buffer.upload();
                this._buffer.unbind();
                this._currentFrame++;
            }
            super.update(time);
        }

        public destroy(): void {
            super.destroy();
        }
    }
}