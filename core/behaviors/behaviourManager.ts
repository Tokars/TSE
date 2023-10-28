namespace TSE {

    export class BehaviorManager {

        private static _registeredBuilders: { [type: string]: IBehaviorBuilder } = {};

        public static registerBuilder(builder: IBehaviorBuilder): void {
            console.log(`----- [BehaviorManager] : register builder [${String(builder.type)}] -----`);
            BehaviorManager._registeredBuilders[String(builder.type)] = builder;
        }

        public static extractBehavior(json: any): IBehavior {
            if (json.type !== undefined) {
                let key: string = String(json.type);
                if (BehaviorManager._registeredBuilders[key] !== undefined) {
                    return BehaviorManager._registeredBuilders[key].buildFromJson(json);
                }
                throw Error(`Behavior manager error: builder is not registerd for type [${key}].`);
            } else {
                throw Error(`Behavior manager error: builder type is undefined.`);
            }
        }
    }
}