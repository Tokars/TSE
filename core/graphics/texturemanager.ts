namespace TSE {

    class TextureRefernceNode {
        public texture: Texture;
        public referenceCount: number = 1;

        public constructor(texture: Texture) {
            this.texture = texture;
        }
    }

    export class TextureManager {

        private static _textures: { [keyName: string]: TextureRefernceNode } = {};
        private constructor() {

        }

        public static getTexture(textureName: string): Texture {
            if (TextureManager._textures[textureName] === undefined) {
                let texture = new Texture(textureName);
                TextureManager._textures[textureName] = new TextureRefernceNode(texture);
                
            } else {
                TextureManager._textures[textureName].referenceCount++;
            }

            return TextureManager._textures[textureName].texture;
        }

        public static releaseTexture(textureName: string): void {
            if (TextureManager._textures[textureName] === undefined) {
                console.warn(`A texture [${textureName}] doesn't not exists. And cannot be released.`);

            } else {
                
                TextureManager._textures[textureName].referenceCount --;
                
                if (TextureManager._textures[textureName].referenceCount < 1) {
                    TextureManager._textures[textureName].texture.destroy();
                    let deleteRes = delete TextureManager._textures[textureName];
                    
                    console.log(`release texture: [${textureName}] success result = ${deleteRes}`);
                }
            }
        }
    }
}