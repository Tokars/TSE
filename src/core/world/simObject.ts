namespace TSE {
    export class SimObject {
        private _id: number;
        private _chidren: SimObject[] = [];
        private _parent: SimObject;
        private _isLoaded: boolean = false;
        private _localMatrix: Matrix4x4 = Matrix4x4.identity();
        private _worldMatrix: Matrix4x4 = Matrix4x4.identity();
        private _scene: Scene;
        private _behaviors: IBehavior[] = [];
        private _components: IComponent[] = [];
        public name: string;
        public transform: Transform = new Transform();

        public constructor(id: number, name: string, scene?: Scene) {
            this._id = id;
            this.name = name;
            this._scene = scene;
        }

        public get id(): number {
            return this._id;
        }
        public get parent(): SimObject {
            return this._parent;
        }

        public get worldMatrix(): Matrix4x4 {
            return this._worldMatrix;
        }

        public get isLoaded(): boolean {
            return this._isLoaded;
        }

        public addChild(child: SimObject): void {
            child._parent = this;
            this._chidren.push(child);
            child.onAdded(this._scene);
        }
        public removeChild(child: SimObject): void {
            let index = this._chidren.indexOf(child);
            if (index !== -1) {
                child._parent = undefined;
                this._chidren.splice(index, 1);
            }
        }

        public getObjectByName(name: string): SimObject {
            if (this.name === name) {
                return this;
            }
            for (let child of this._chidren) {
                let result = child.getObjectByName(name);
                if (result !== undefined) {
                    return result;
                }
            }

            return undefined;
        }

        public addComponent(component: IComponent): void {
            this._components.push(component);
            component.setOwner(this);
        }

        public addBehavior(behavior: IBehavior): void {
            this._behaviors.push(behavior);
            behavior.setOwner(this);
        }

        public load(): void {
            this._isLoaded = true;

            for (let c of this._components) {
                c.load();
            }

            for (let c of this._chidren) {
                c.load();
            }
        }

        public update(time: number): void {

            this._localMatrix = this.transform.getTransformationMatrix();

            this.updateWorldMatrix((this._parent !== undefined) ? this._parent.worldMatrix : undefined);

            for (let c of this._components) {
                c.update(time);
            }
            
            for (let b of this._behaviors) {
                b.update(time);
            }

            for (let c of this._chidren) {
                c.update(time);
            }
        }

        public render(shader: Shader): void {
            for (let c of this._components) {
                c.render(shader);
            }

            for (let c of this._chidren) {
                c.render(shader);
            }
        }

        protected onAdded(scene: Scene): void {
            this._scene = scene;
        }

        private updateWorldMatrix(parentMatrix: Matrix4x4): void {
            if (parentMatrix !== undefined) {
                this._worldMatrix = Matrix4x4.multiply(parentMatrix, this._localMatrix);
            } else {
                this._worldMatrix.copyFrom(this._localMatrix);
            }
        }
    }
}