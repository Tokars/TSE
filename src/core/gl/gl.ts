namespace TSE {

    /**
     * The WeGl rendering context.
     */
    export var gl: WebGLRenderingContext;

    /**
     * Responsible for settings up a WebGL rendering context.
     */
    export class GLUtilities {

        /**
         * Initializes WebGL, potentially using the canvas with an assigned id matching the provided if it is defined.
         * @param elementId the id of element to search for.
         * @returns canvas.
         */
        public static initialize(elementId?: string): HTMLCanvasElement {

            let canvas: HTMLCanvasElement;
            if (elementId !== undefined) {
                canvas = document.getElementById(elementId) as HTMLCanvasElement;

                if (canvas === undefined)
                    throw new Error(`Cannot find a canvas element named = ${elementId}`);
            }
            else {
                canvas = document.createElement("canvas") as HTMLCanvasElement;
                document.body.appendChild(canvas);
            }


            gl = canvas.getContext('webgl') as WebGLRenderingContext;
            if (gl === null || gl === undefined) {
                throw new Error(`Unable to initialize WebGL`);
            }

            return canvas;
        }
    }
}