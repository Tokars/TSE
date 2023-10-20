namespace TSE {

    class MaterialReferenceNode {

        public material: Material;
        public referenceCount: number;

        public constructor(material: Material) {
            this.material = material;
        }
    }

    export class MaterialManager {

        private static _materials: { [name: string]: MaterialReferenceNode } = {};

        private constructor() {
        }

        public static registerMaterial(material: Material): void {
            if (MaterialManager._materials[material.name] === undefined) {
                MaterialManager._materials[material.name] = new MaterialReferenceNode(material);
            }
        }

        public static getMaterial(materialName: string): Material {
            if (MaterialManager._materials[materialName] === undefined) {
                throw new Error(`Required material [${materialName}] doesn't exists or not registered.`);
            } else {
                MaterialManager._materials[materialName].referenceCount++;
                return MaterialManager._materials[materialName].material;
            }
        }

        public static releaseMaterial(materialName: string): void {

            let matRef = MaterialManager._materials[materialName];
            if (matRef === undefined) {
                console.warn("cannot release a material with has not been registered.");
            } else {

                matRef.referenceCount--;
                if (matRef.referenceCount < 1) {
                    matRef.material.destroy()
                    // matRef.material = null;

                    let deleteRes = delete MaterialManager._materials[materialName];
                    console.log(`release material: [${materialName}] success result = ${deleteRes}`);
                }
            }
        }
    }
}