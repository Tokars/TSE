namespace TSE {

    /**
     * The main game engine class 
     */
    export class Engine {

        private _count: number = 0;
        private _canvas!: HTMLCanvasElement;
        private _shader!: Shader;
        private _buffer!: WebGLBuffer | null;
        public constructor() {
            // console.log(`${this.constructor.name} created.`);
            // console.log(`${Engine.name} created.`);
        }

        /**
         * Start the engine.
        */
        public start(): void {

            console.log(`${this.constructor.name}: ${this.start.name} called.`);
            this._canvas = GLUtilities.initialize();
            
            gl.clearColor(0.01, 0.01, 0.2, 1);
            this.loadShaders();
            this._shader.use();
            this.createBuffer();
            
            this.fullscreenCanvas();
            this.loop();
        }

        /**
         * Resizes the canvas to fit the window.
         */
        public fullscreenCanvas(): void {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer);
            
            let location = this._shader.getAttributeLocation("a_position");
            
            
            gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(0);

            gl.drawArrays(gl.TRIANGLES, 0, 3);

            gl.viewport(0,0, this._canvas.width, this._canvas.height);
            requestAnimationFrame(this.loop.bind(this));
        }

        private createBuffer(): void {
            this._buffer = gl.createBuffer();

            let vertices = [
                0, 0, 0,
                0, 0.5, 0,
                0.5, 0.5, 0
            ];


            gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
            
            let location = this._shader.getAttributeLocation("a_position");
            
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.disableVertexAttribArray(0);

        }

        private loadShaders(): void {
            let vertexShaderSource = `
attribute vec3 a_position;

void main(){
        gl_Position = vec4(a_position, 1.0);
}`;
            let fragmentShaderSource = `
precision mediump float;
void main(){
    gl_FragColor = vec4(1.0);
}`;
            this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
}
