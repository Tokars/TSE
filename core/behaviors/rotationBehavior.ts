/// <reference path="baseBehavior.ts"/>
/// <reference path="behaviourManager.ts"/>

namespace TSE {

    export class RotationBehaviorData implements IBehaviorData {
        public name: string;
        public rotation: Vector3 = Vector3.zero;

        setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error(`RotationBehaviorData error: Name must be difened.`)
            }

            this.name = String(json.name);

            if (json.rotation !== undefined) {
                this.rotation.setFromJson(json.rotation);
            }
        }
    }

    export class RotationBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "rotation";
        }
        buildFromJson(json: any): IBehavior {
            let data = new RotationBehaviorData();
            data.setFromJson(json);
            return new RotationBehavior(data);
        }

    }

    export class RotationBehavior extends BaseBehavior {
        private _rotation: Vector3;

        public constructor(data: RotationBehaviorData) {

            super(data);
            this._rotation = data.rotation;

        }

        public update(time: number): void {
            this._owner.transform.rotation.add(this._rotation);
            super.update(time);
        }
    }
    BehaviorManager.registerBuilder(new RotationBehaviorBuilder());
}