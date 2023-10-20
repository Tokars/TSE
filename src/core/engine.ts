namespace TSE {

    /**
     * The main game engine class 
     */
    export class Engine  implements IMessageHandler{

        private _count: number = 0;
        private _canvas!: HTMLCanvasElement;
        private _basicShader: BasicShader;
        private _projection: Matrix4x4;
        private _previousTime: number = 0;



        public constructor() {
            // console.log(`${this.constructor.name} created.`);
            // console.log(`${Engine.name} created.`);
        }
        public onMessage(message: Message): void {
        
            if (message.code === "MOUSE_UP"){
                let pos = InputManager.getMousePosition();
                document.title = `Pos: [${pos.x}, ${pos.y}]`;
            }
        }

        /**
         * Start the engine.
        */
        public start(): void {

            console.log(`${this.constructor.name}: ${this.start.name} called.`);

            this._canvas = GLUtilities.initialize();
            AssetManager.initialize();
            InputManager.initialize();
            ZoneManager.initialize();
            Message.subscribe("MOUSE_UP", this);
            
            gl.clearColor(0.01, 0.01, 0.2, 1);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this._basicShader = new BasicShader();
            this._basicShader.use();

            // Load materials
            MaterialManager.registerMaterial(new Material("avatar", "assets/textures/avatar.jpg", Color.toFloat(Color.white)));
            MaterialManager.registerMaterial(new Material("duck", "assets/textures/duck.png", Color.toFloat(Color.white)));
            MaterialManager.registerMaterial(new Material("frog_marked", "assets/textures/frog_marked.png", Color.toFloat(Color.white)));
            MaterialManager.registerMaterial(new Material("fox", "assets/textures/fox.png", Color.toFloat(Color.white)));

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
            this.update();
            this.render();
        }

        private update(): void {
            let delta = performance.now() - this._previousTime;
            MessageBus.update(delta);
            ZoneManager.update(delta);
            this._previousTime = performance.now();
        }
        private render(): void {
            gl.clear(gl.COLOR_BUFFER_BIT);

            ZoneManager.render(this._basicShader);

            // set uniforms

            let projectPos = this._basicShader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectPos, false, new Float32Array(this._projection.data));

            requestAnimationFrame(this.loop.bind(this));
        }
    }
}
