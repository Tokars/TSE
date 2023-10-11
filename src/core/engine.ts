namespace TSE {

    /**
     * The main game engine class 
     */
    export class Engine {

        private _count: number = 0;
        private _canvas!: HTMLCanvasElement;
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

            // this._count++;
            // document.title = this._count.toString();
            gl.clear(gl.COLOR_BUFFER_BIT);
            requestAnimationFrame(this.loop.bind(this));

        }
    }
}
