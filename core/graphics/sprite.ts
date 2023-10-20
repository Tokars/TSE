namespace TSE {
    /**
     * Representation a 2D sprite which is drawn on the screen.
     */
    export class Sprite {

        protected _name: string;
        protected _materialName: string;
        protected _width: number;
        protected _height: number;
        protected _buffer: GLBuffer;
        protected _material: Material;
        protected _vertices: Vertext[] = [];

        /**
         * Create sprite.
         * @param name name of this sprite.
         * @param materialName name of the material to use with this sprite.
         * @param width of this sprite.
         * @param height of this sprite.
         */

        public constructor(name: string, materialName: string, width: number = 64, height: number = 64) {
            this._name = name;
            this._materialName = materialName;
            this._width = width;
            this._height = height;
            this._material = MaterialManager.getMaterial(this._materialName);

            
        }
        public get name(): string {
            return this._name;
        }

        public load(): void {
            this._buffer = new GLBuffer();

            let positionAttribute = new AttributeInfo()
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this._buffer.addAttributeLocation(positionAttribute);

            let texCoordAttribute = new AttributeInfo()
            texCoordAttribute.location = 1;
            texCoordAttribute.size = 2;
            this._buffer.addAttributeLocation(texCoordAttribute);
            
            this._vertices = [
                // x,y,z, u,v
                new Vertext(0, 0, 0, 0, 0),
                new Vertext(0, this._height, 0, 0, 1.0),
                new Vertext(this._width, this._height, 0, 1.0, 1.0),
                new Vertext(this._width, this._height, 0, 1.0, 1.0),
                new Vertext(this._width, 0, 0, 1.0, 0),
                new Vertext(0, 0, 0, 0, 0)
            ];

            for (let v of this._vertices) {
                this._buffer.pushBackData(v.toArray());
            }
            this._buffer.upload();
            this._buffer.unbind();
        }

        public update(time: number): void {
        }

        public draw(shader: Shader, model: Matrix4x4): void {

            let modelLocation = shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

            let colorLocation = shader.getUniformLocation("u_tint");
            let t = this._material.tint;
            gl.uniform4f(colorLocation, t.r, t.g, t.b, t.a);

            if (this._material.diffuseTexture !== undefined) {
                this._material.diffuseTexture.activateAndBind(0);
                let diffuseLocation = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(diffuseLocation, 0);
            }

            this._buffer.bind();
            this._buffer.draw();
        }

        public destroy(): void {
            this._buffer.destroy();
            MaterialManager.releaseMaterial(this._materialName);
            this._material = undefined;
            this._materialName = undefined;
        }
    }
}
