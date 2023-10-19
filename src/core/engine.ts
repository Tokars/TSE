namespace TSE {

    /**
     * The main game engine class 
     */
    export class Engine {

        private _count: number = 0;
        private _canvas!: HTMLCanvasElement;
        private _basicShader: BasicShader;
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
            AssetManager.initialize();
            ZoneManager.initialize();
            gl.clearColor(0.01, 0.01, 0.2, 1);

            this._basicShader = new BasicShader();
            this._basicShader.use();

            // Load materials
            MaterialManager.registerMaterial
                (new Material("avatar", "assets/textures/avatar.jpg", Color.toFloat(new Color())));

            // load
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -1.0, 100);
            ZoneManager.changeZone(0);

            this.resize();
            this.loop();
        }

        /**
         * Resizes the canvas to fit the window.
         */
        public resize(): void {
            this._canvas.width = window.innerWidth;
            this._canvas.height = window.innerHeight;

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            this._projection = Matrix4x4.orthographic(0, this._canvas.width, this._canvas.height, 0, -1.0, 100);
        }

        private loop(): void {
            MessageBus.update(0);
            ZoneManager.update(0);
            
            gl.clear(gl.COLOR_BUFFER_BIT);
            
            ZoneManager.render(this._basicShader);

            // set uniforms

            let projectPos = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectPos, false, new Float32Array(this._projection.data));

            requestAnimationFrame(this.loop.bind(this));
        }
    }
}
