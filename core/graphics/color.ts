namespace TSE {
    export class Color {
        private _r: number;
        private _g: number;
        private _b: number;
        private _a: number;


        public constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
            this._r = r;
            this._g = g;
            this._b = b;
            this._a = a;
        }

        public get r(): number {
            return this._r;
        }
        public get rFloat(): number {
            return this._r / 255.0;
        }

        public get g(): number {
            return this._g;
        }
        public get gFloat(): number {
            return this._g / 255.0;
        }

        public get b(): number {
            return this._b;
        }

        public get bFloat(): number {
            return this._b / 255.0;
        }
        public get a(): number {
            return this._a;
        }

        public get aFloat(): number {
            return this._a / 255.0;
        }

        public toArray(): number[] {
            return [this._r, this.g, this._b, this._a];
        }

        public toFloatArray(): number[] {
            return [this._r / 255.0, this.g / 255.0, this._b / 255.0, this._a / 255.0];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toFloatArray());
        }

        public static get white(): Color {
            return new Color(255, 255, 255, 255);
        }
        public static get black(): Color {
            return new Color(0, 0, 0, 255);
        }
        public static get red(): Color {
            return new Color(255, 0, 0, 255);
        }

        public static get green(): Color {
            return new Color(0, 255, 0, 255);
        }
        public static get blue(): Color {
            return new Color(0, 0, 255, 255);
        }
        
        public static get clear(): Color {
            return new Color(0, 0, 0, 0);
        }


        public static toFloat(color: Color): Color {

            return new Color(color.r / 255.0, color.g / 255.0, color.b / 255.0, color.a / 255.0);
        }

    }
}