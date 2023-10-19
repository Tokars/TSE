/* 
/// <reference path ="zone.ts"/>

namespace TSE {

    export class TestZone extends Zone {
        private _parentObject: SimObject;
        private _testObject: SimObject;
        public load(): void {

            this._parentObject = new SimObject(0, "parent_obj");
            this._parentObject.addComponent(new SpriteComponent("test_sprite", "avatar"));
            this._parentObject.transform.position.x = 256;
            this._parentObject.transform.position.y = 256;

            this._testObject = new SimObject(1, "test_obj");
            this._testObject.addComponent(new SpriteComponent("test_sprite", "avatar"));

            this._testObject.transform.position.x = 64;
            this._testObject.transform.position.y = 64;

            this._parentObject.addChild(this._testObject);
            this.scene.addObject(this._parentObject);

            super.load();
        }
        public update(time: number): void {

            this._parentObject.transform.rotation.z += 0.01;
            this._testObject.transform.rotation.z += 0.01;
            super.update(time);
        }
    }
} */