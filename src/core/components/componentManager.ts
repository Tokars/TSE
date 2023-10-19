namespace TSE {
    export class ComponentManager {

        private static _registeredBuilders: { [type: string]: IComponentBuilder } = {};

        public static registerBuilder(builder: IComponentBuilder): void {
            console.log(`----- register builder [${String(builder.type)}] -----`);
            ComponentManager._registeredBuilders[String(builder.type)] = builder;
        }

        public static extractComponenet(json: any): IComponent {
            if (json.type !== undefined) {
                if (ComponentManager._registeredBuilders[String(json.type)] !== undefined) {
                    return ComponentManager._registeredBuilders[String(json.type)].buildFromJson(json);
                }
                throw Error(`Componenet manager error: builder is not registerd for type [${String(json.type)}].`);
            } else {
                throw Error(`Componenet manager error: builder type is undefined.`);
            }
        }
    }
}