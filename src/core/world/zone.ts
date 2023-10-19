namespace TSE {

    export enum ZoneState {
        UNINITIALIZED,
        LOADING,
        UPDATING
    }

    export class Zone {

        private _id: number;
        private _name: string;
        private _description: string;
        private _scene: Scene;
        private _state: ZoneState = ZoneState.UNINITIALIZED;

        private _globalID: number = -1;


        public constructor(id: number, name: string, description: string) {

            this._id = id;
            this._name = name;
            this._description = description;

            this._scene = new Scene();
        }

        public get id(): number {
            return this._id;
        }

        public get name(): string {
            return this._name;
        }
        public get description(): string {
            return this._description;
        }

        public get scene(): Scene {
            return this._scene;
        }

        public initialize(data: any): void {
            if (data.objects === undefined) {
                throw new Error(`Zone init. error: objects not present.`);
            } else {
                for (let o in data.objects) {
                    let obj = data.objects[o];
                    this.loadSimObject(obj, this._scene.root);
                }
            }
        }
        private loadSimObject(data: any, parent: SimObject): void {
            let name: string;
            if (data.name !== undefined) {
                name = String(data.name);
            }

            this._globalID++;
            let simObject = new SimObject(this._globalID, name, this._scene);

            if (data.transform !== undefined) {
                simObject.transform.setFromJson(data.transform);
            }
            
            if (data.components !== undefined){
                for(let c in data.components){
                    let d = data.components[c];
                    let component = ComponentManager.extractComponenet(d);
                    simObject.addComponent(component);
                }
            }

            if (data.children !== undefined) {
                for (let c in data.children) {
                    let obj = data.children[c];
                    this.loadSimObject(obj, simObject);
                }
            }

            if (parent !== undefined) {
                parent.addChild(simObject);
            }
        }

        public load(): void {
            this._state = ZoneState.LOADING;
            this._scene.load();
            this._state = ZoneState.UPDATING;
        }
        public unload(): void {

        }

        public update(time: number): void {
            if (this._state === ZoneState.UPDATING) {
                this._scene.update(time);
            }
        }

        public render(shader: Shader): void {
            if (this._state === ZoneState.UPDATING) {
                this._scene.render(shader);
            }
        }

        public onActivated(): void {
        }

        public onDeactivated(): void {
        }
    }
}