namespace TSE {
    export class ComponentManager {

        private static _registeredBuilders: { [type: string]: IComponentBuilder } = {};

        public static registerBuilder(builder: IComponentBuilder): void {
            // console.log(`----- [ComponentManager] register builder [${String(builder.type)}] -----`);
            ComponentManager._registeredBuilders[String(builder.type)] = builder;
        }

        public static extractComponent(json: any): IComponent {

            // console.log(`[ComponentManager]: Extract component = [${json.type}]`);

            if (json.type !== undefined) {

                let key: string = String(json.type);
                if (ComponentManager._registeredBuilders[key] !== undefined) {
                    return ComponentManager._registeredBuilders[key].buildFromJson(json);
                }
                throw Error(`Component manager error: builder is not registerd for type [${key}].`);
            } else {
                throw Error(`Component manager error: builder type is undefined.`);
            }
        }
    }
}