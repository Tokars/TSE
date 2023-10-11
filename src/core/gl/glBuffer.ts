namespace TSE {

    /**
     * Represents the information for GLBuffer attribute.
     */
    export class AttributeInfo {

        /**
            Location of attribute.
        */
        public location: number;
        /**
            Size (number of elements) in this attribute (i.e. Vector3 = 3)
        */
        public size: number;
        /**
            The number of element from the begining of the buffer.
        */
        public offset: number;
    }

    /**
     * Represents a WebGL buffer.
     */
    export class GLBuffer {

        private hasAttributeLocation: boolean = false;
        private _elementSize: number;
        private _stride: number;
        private _buffer: WebGLBuffer | null;
        private _targetBuffreType: number
        private _dataType: number;
        private _mode: number;
        private _typeSize: number;

        private _data: number[] = [];
        private _attributes: AttributeInfo[] = [];

        /**
         * Create a new GL buffer.
         * @param elementSize The size of each element in ths buffer.
         * @param dataType The data type of this buffer. gl.FLOAT.
         * @param targetBuffreType The buffer target type. Can be either gl.ARRAY_BUFFER or  gl.ELEMENT_ARRAY_BUFFER. default gl.ARRAY_BUFFER.
         * @param mode The drawing mode of this buffer. (i.e. gl.TRIANGLES, or gl.LINES) Default: gl.TRIANGLES.
         */
        public constructor(
            elementSize: number,
            dataType: number = gl.FLOAT,
            targetBuffreType: number = gl.ARRAY_BUFFER,
            mode: number = gl.TRIANGLES
        ) {

            this._elementSize = elementSize;
            this._dataType = dataType;
            this._targetBuffreType = targetBuffreType;
            this._mode = mode;

            // Determine byte size.

            switch (this._dataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this._typeSize = 4;
                    break;
                case gl.SHORT:
                    this._typeSize = 2;
                    break;

                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this._typeSize = 1;
                    break;

                default:
                    throw Error(`Unrecognized data type: ${dataType}`);
            }

            this._stride = this._elementSize * this._typeSize;
            this._buffer = gl.createBuffer();
        }

        public destroy(): void {
            gl.deleteBuffer(this._buffer);
        }

        /**
        * Bind this buffer.
        */
        public bind(normilized: boolean = false): void {
            gl.bindBuffer(this._targetBuffreType, this._buffer);
            if (this.hasAttributeLocation) {
                for (let it of this._attributes) {
                    gl.vertexAttribPointer(it.location, it.size, this._dataType, normilized, this._stride, it.offset * this._typeSize);
                    gl.enableVertexAttribArray(it.location);

                }
            }
        }


        /**
         * Unbind this buffer.
         */
        public unbind(): void {

            for (let it of this._attributes) {
                gl.disableVertexAttribArray(it.location);
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
        }

        /**
         * Adds an attribute with the provided info. to this buffer.
         * @param info 
         */
        public addAttributeLocation(info: AttributeInfo): void {
            this.hasAttributeLocation = true;
            this._attributes.push(info);
        }

        /**
         * Adds data to this buffer.
         * @param data 
         */
        public pushBackData(data: number[]): void {

            for (let d of data) {
                this._data.push(d);
            }
        }

        /**
         * Upload this buffer to the GPU.
         */
        public upload(): void {

            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
            let bufferData!: ArrayBuffer;
            switch (this._dataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this._data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this._data);
                    break;
                case gl.UNSIGNED_INT:
                case gl.SHORT:
                    bufferData = new Int16Array(this._data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this._data);
                    break
                case gl.BYTE:
                    bufferData = new Int8Array(this._data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this._data);
                    break;
            }

            gl.bufferData(this._targetBuffreType, bufferData, gl.STATIC_DRAW);
        }

        /**
         * Draw this buffer.
         */
        public draw() {

            if (this._targetBuffreType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this._mode, 0, this._data.length / this._elementSize)
            }
            else if (this._targetBuffreType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this._mode, this._data.length, this._dataType, 0);
            }
        }
    }
}