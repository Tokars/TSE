namespace TSE {

    /**
     * The main game engine class 
     */
    export class Engine {

        private _count: number = 0;
        private _canvas!: HTMLCanvasElement;
        private _shader!: Shader;
        private _buffer: GLBuffer;
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


            // set uniforms
            let colorPos = this._shader.getUniformLocation("u_color");
            gl.uniform4f(colorPos, 1, 0.5, 0, 1);

            this._buffer.bind();
            this._buffer.draw();

            // gl.viewport(0, 0, this._canvas.width, this._canvas.height);
            requestAnimationFrame(this.loop.bind(this));
        }

        private createBuffer(): void {
            this._buffer = new GLBuffer(3);

            let positionAttribute = new AttributeInfo()
            positionAttribute.location = this._shader.getAttributeLocation("a_position");
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);

            let vertices = [
                0, 0, 0,
                0, 1, 0,
                0.5, 0.5, 0
            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        }

        private loadShaders(): void {
            let vertexShaderSource = `
attribute vec3 a_position;

void main(){
        gl_Position = vec4(a_position, 1.0);
}`;
            let fragmentShaderSource = `
precision mediump float;
uniform vec4 u_color;
void main(){
    gl_FragColor = u_color;
}`;
            this._shader = new Shader("basic", vertexShaderSource, fragmentShaderSource);
        }
    }
}
