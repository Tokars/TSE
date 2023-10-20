namespace TSE {

    export enum Keys {
        LEFT = "ArrowLeft",
        UP = "ArrowUp",
        RIGHT = "ArrowRight",
        DOWN = "ArrowDown"
    }

    export class MouseContext {
        public leftDown: boolean = false;
        public rightDown: boolean = false;
        public position: Vector2 = Vector2.zero;

        public constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
            this.leftDown = leftDown;
            this.rightDown = rightDown;
            this.position = position;
        }
    }

    export class InputManager {

        private static _keys: { [key: string]: boolean } = {};
        private static _previousMouseX: number;
        private static _previousMouseY: number;
        private static _mouseX: number = 0;
        private static _mouseY: number = 0;
        private static _lcm: boolean;
        private static _rcm: boolean;
        
        public static instance:InputManager;
        public static initialize(): void {
            for (let i = 0; i < 255; ++i) {
                InputManager._keys[i.toString()] = false;
            }

            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
            window.addEventListener("mousemove", InputManager.onMouseMove);
            window.addEventListener("mousedown", InputManager.onMouseDown);
            window.addEventListener("mouseup", InputManager.onMouseUp);
            
            this.instance = this;
        }

        public static isKeyDown(key: Keys): boolean {
            return InputManager._keys[key];
        }
        public static getMousePosition(): Vector2 {
            return new Vector2(InputManager._mouseX, InputManager._mouseY);
        }

        private static onKeyDown(event: KeyboardEvent): boolean {
            InputManager._keys[event.code] = true;
            console.log(`key down: ${event.code}`);

            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        private static onKeyUp(event: KeyboardEvent): boolean {
            InputManager._keys[event.code] = false;
            console.log(`key up: ${event.code}`);

            event.preventDefault();
            event.stopPropagation();
            return false;
        }

        private static onMouseMove(event: MouseEvent): void {
            InputManager._previousMouseX = InputManager._mouseX;
            InputManager._previousMouseY = InputManager._mouseY;

            InputManager._mouseX = event.clientX;
            InputManager._mouseY = event.clientY;

            console.log("mouse move --------");

        }

        private static onMouseDown(event: MouseEvent): void {
            if (event.button === 0) {
                InputManager._lcm = true;

            } else if (event.button === 2) {
                InputManager._rcm = true;
            }

            Message.send("MOUSE_DOWN", new MouseContext(InputManager._lcm, InputManager._rcm, InputManager.getMousePosition()));
            console.log("mouse down");

        }

        private static onMouseUp(event: MouseEvent): void {
            if (event.button === 0) {
                InputManager._lcm = false;

            } else if (event.button === 2) {
                InputManager._rcm = false;
            }
            console.log("mouse up");
            Message.send("MOUSE_UP", new MouseContext(InputManager._lcm, InputManager._rcm, InputManager.getMousePosition()));
        }
    }
}