namespace TSE {

    /**
     * Represents a WebGL shader.
     */
    export class Shader {

        private _name: string;
        private _program!: WebGLProgram;
        private _attributes: { [name: string]: number } = {};
        /**
         * 
         * @param name Name of this shader.
         * @param vertexSource The source of the vertext shader.
         * @param fragmentSource The source of the fragment shader.
         */
        public constructor(name: string, vertexSource: string, fragmentSource: string) {
            this._name = name;
            let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

            this.createProgram(vertexShader, fragmentShader);
        }

        /**
        the name of this shader.
        */
        public get name(): string {
            return this.name;
        }

        /**
        Use this shader
        */
        public use(): void {
            gl.useProgram(this._program);
        }


        /**
         * Get the location if an attribute with the provided name.
         * @param name name of shader's attribute whose location to retrive.
         * @returns num.
         */
        public getAttributeLocation(name: string): number {
            if (this._attributes[name] === undefined) {
                throw new Error(`Unable to find attribute named = [${name}] in shader [${this._name}].`);
            }

            return this._attributes[name];

        }

        private loadShader(source: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType) as WebGLShader;

            gl.shaderSource(shader, source);
            gl.compileShader(shader);

            let error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error(`Error compiling shader ${this._name}: ${error}`);
            }
            return shader;
        }

        private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {

            this._program = gl.createProgram() as WebGLProgram;

            gl.attachShader(this._program, vertexShader);
            gl.attachShader(this._program, fragmentShader);
            gl.linkProgram(this._program);
            let error = gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error(`Error linking shader ${this._name}: ${error}`);
            }
            
            this.detectAttributes();
        }


        private detectAttributes(): void {
            let attrCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < attrCount; ++i) {
                let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i) as WebGLActiveInfo;
                if (!attributeInfo) {
                    break;
                }

                this._attributes[attributeInfo.name] = gl.getAttribLocation(this._program, attributeInfo.name);

            }


        }
    }
}

