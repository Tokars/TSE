namespace TSE {

    /**
     * The main game engine class 
     */
    export class Engine {

        private _count: number = 0;
        private _canvas!: HTMLCanvasElement;
        private _shader!: Shader;
        private _sprite: Sprite;
        private _projection: Matrix4x4;

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

            // load
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, 0, this._canvas.height, -1.0, 100);
            this._sprite = new Sprite('test');
            this._sprite.load();
            this._sprite.position.x = 200;
            this.fullscreenCanvas();
            this.loop();
        }

        /**
         * Resizes the canvas to fit the window.
         */
        public fullscreenCanvas(): void {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            // gl.viewport(-1, 1, 1, -1);
        }

        private loop(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            // set uniforms
            let colorPos = this._shader.getUniformLocation("u_color");
            gl.uniform4f(colorPos, 1, 0.5, 0, 1);

            let projectPos = this._shader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectPos, false, new Float32Array(this._projection.data));

            let modelLocation = this._shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelLocation, false, new Float32Array(Matrix4x4.translation(this._sprite.position).data));

            this._sprite.draw();

            requestAnimationFrame(this.loop.bind(this));
        }

        private loadShaders(): void {
            let vertexShaderSource = `
attribute vec3 a_position;
uniform mat4 u_projection;
uniform mat4 u_model;

void main(){
        gl_Position = u_projection * u_model * vec4(a_position, 1.0);
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
