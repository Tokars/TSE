namespace TSE {

    export class Sprite {

        private _name: string;
        private _textureName: string;
        private _width: number;
        private _height: number;
        private _buffer: GLBuffer;
        private _texture: Texture;

        private _position: Vector3 = new Vector3();

        public get position(): Vector3 {
            return this._position;
        }
        public get name(): string {
            return this._name;
        }


        /**
         * Create sprite.
         * @param name name of this sprite.
         * @param textureName name of the texture to use with this sprite.
         * @param width of this sprite.
         * @param height of this sprite.
         */

        public constructor(name: string, textureName: string, width: number = 100, height: number = 100) {
            this._name = name;
            this._textureName = textureName;
            this._width = width;
            this._height = height;
            this._texture = TextureManager.getTexture(textureName);
        }

        public load(): void {
            this._buffer = new GLBuffer(5);

            let positionAttribute = new AttributeInfo()
            positionAttribute.location = 0;
            positionAttribute.offset = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);
            
            
            let texCoordAttribute = new AttributeInfo()
            texCoordAttribute.location = 1;
            texCoordAttribute.offset = 3;
            texCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(texCoordAttribute);

            let vertices = [
                // x,y,z, u,v
                0, 0, 0, 0, 0,
                0, this._height, 0, 0, 1.0,
                this._width, this._height, 0, 1.0, 1.0,

                this._width, this._height, 0, 1.0, 1.0,
                this._width, 0, 0, 1.0, 0,
                0, 0, 0, 0, 0

            ];
            this._buffer.pushBackData(vertices);
            this._buffer.upload();
            this._buffer.unbind();
        }

        public destroy(): void {
            this._buffer.destroy();
            TextureManager.releaseTexture(this._textureName);
        }

        public update(time: number): void {
        }

        public draw(shader: Shader): void {
            this._texture.activateAndBind()
            let diffuseLocation = shader.getUniformLocation("u_diffuse");
            gl.uniform1i(diffuseLocation, 0);
            this._buffer.bind();
            this._buffer.draw();
        }
    }
}