namespace TSE {
    export class Vector3 {
        private _x: number;
        private _y: number;
        private _z: number;

        public constructor(x: number = 0, y: number = 0, z: number = 0) {
            this._x = x;
            this._y = y;
            this._z = z;
        }


        public get x(): number {
            return this._x;
        }

        public get y(): number {
            return this._y;
        }

        public get z(): number {
            return this._z;
        }


        public set x(v: number) {
            this._x = v;
        }

        public set y(v: number) {
            this._y = v;
        }

        public set z(v: number) {
            this._z = v;
        }

        public toArray(): number[] {
            return [this._x, this._y, this._z];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }
    }
}