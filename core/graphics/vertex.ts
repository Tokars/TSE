namespace TSE {
    /**
     * Represent the data for sinlgle vertex.
     */
    export class Vertext {
        public position: Vector3 = Vector3.zero;
        public texCoords: Vector2 = Vector2.zero;


        public constructor(x: number = 0, y: number = 0, z: number = 0, tu: number = 0, tv: number = 0) {
            this.position = new Vector3(x, y, z);
            this.texCoords = new Vector2(tu, tv);
        }
        

        public toArray(): number[] {
            let array: number[] = [];
            array = array.concat(this.position.toArray());
            array = array.concat(this.texCoords.toArray());
            return array;
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }
    }
}