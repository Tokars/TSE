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

        public getComponentByName(name: string): IComponent {
            // todo: improve this slow search.
            for (let component of this._components) {
                if (component.name === name) {
                    return component;
                }
            }

            // todo: move to own method search in child.
            for (let child of this._chidren) {
                let component = child.getComponentByName(name);
                if (component !== undefined) {
                    return component;
                }
            }

            return undefined;
        }

        public getBehaviorByName(name: string): IBehavior {
            // todo: improve this slow search.
            for (let behavior of this._behaviors) {
                if (behavior.name === name) {
                    return behavior;
                }
            }

            // todo: move to own method search in child.
            for (let child of this._chidren) {
                let behavior = child.getBehaviorByName(name);
                if (behavior !== undefined) {
                    return behavior;
                }
            }

            return undefined;
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
            console.log(`[GameObject][${this.name}] added component = [${component.name}]`);
        }

        public addBehavior(behavior: IBehavior): void {
            this._behaviors.push(behavior);
            behavior.setOwner(this);
        }

        public load(): void {
            for (let c of this._components) {
                c.load();
            }

            for (let c of this._chidren) {
                c.load();
            }
            this._isLoaded = true;
        }
        public updateReady(): void {
            for (let c of this._components) {
                c.updateReady();
            }

            for (let b of this._behaviors) {
                b.updateReady();
            }

            for (let c of this._chidren) {
                c.updateReady();
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
        public getWorldPosition(): Vector3 {
            return new Vector3( this._worldMatrix.data[12], this._worldMatrix.data[13], this._worldMatrix.data[14] );
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