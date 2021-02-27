////////////////////////////////////////////////////////////////////////////////
//   _______                               ________________________________   //
//   \\ .   \                     ________/ . . . . . . . . . . . . . .   /   //
//    \\ .   \     ____       ___/ . . . . .   __________________________/    //
//     \\ .   \   //   \   __/. . .  _________/   /    // .  _________/       //
//      \\ .   \_//     \_//     ___/.  _____    /    // .  /_____            //
//       \\ .   \/   _   \/    _/// .  /    \\   |    \\  .       \           //
//        \\ .      /\\       /  || .  |    ||   |     \\______    \          //
//         \\ .    /  \\     /   || .  \____//   |  _________//    /          //
//          \\ .  /    \\   /    //  .           / // . . . .     /           //
//           \\__/      \\_/    //______________/ //_____________/            //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////
//   This is free and unencumbered software released into the public domain.  //
//                                                                            //
//   Anyone is free to copy, modify, publish, use, compile, sell, or          //
//   distribute this software, either in source code form or as a compiled    //
//   binary, for any purpose, commercial or non-commercial, and by any        //
//   means.                                                                   //
//                                                                            //
//   In jurisdictions that recognize copyright laws, the author or authors    //
//   of this software dedicate any and all copyright interest in the          //
//   software to the public domain. We make this dedication for the benefit   //
//   of the public at large and to the detriment of our heirs and             //
//   successors. We intend this dedication to be an overt act of              //
//   relinquishment in perpetuity of all present and future rights to this    //
//   software under copyright law.                                            //
//                                                                            //
//   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,          //
//   EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF       //
//   MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.   //
//   IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR        //
//   OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,    //
//   ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR    //
//   OTHER DEALINGS IN THE SOFTWARE.                                          //
//                                                                            //
//   For more information, please refer to <http://unlicense.org>             //
////////////////////////////////////////////////////////////////////////////////
//    WOS : Web Operating System                                              //
//      renderer/staticmesh.js : Static mesh management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Static mesh class definition                                              //
//  param renderer : Renderer pointer                                         //
//  param meshShader : Static mesh shader pointer                             //
//  param meshShaderLow : Low static mesh shader pointer                      //
////////////////////////////////////////////////////////////////////////////////
function StaticMesh(renderer, meshShader, meshShaderLow)
{
    // Renderer pointer
    this.renderer = renderer;

    // Static mesh shader pointer
    this.meshShader = meshShader;
    this.meshShaderLow = meshShaderLow;

    // Static mesh shader uniforms locations
    this.shadowsTextureLocation = -1;
    this.cameraPosLocation = -1;
    this.lightsCountLocation = -1;
    this.lightsTextureLocation = -1;
    this.shadowsMatrixLocation = -1;
    this.worldLightVecUniform = -1;
    this.worldLightColorUniform = -1;
    this.worldLightAmbientUniform = -1;
    this.specularityUniform = -1;
    this.alphaUniform = -1;
    this.alphaUniformLow = -1;

    // Static mesh vertex buffer
    this.vertexBuffer = null;

    // Static mesh texture
    this.texture = null;
    // Static mesh model matrix
    this.modelMatrix = new Matrix4x4();
    // Static mesh shadows matrix
    this.shadowsMatrix = new Matrix4x4();

    // Static mesh position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Static mesh rotation angles
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Static mesh scale
    this.scale = 1.0;
    // Static mesh alpha
    this.alpha = 1.0;
    // Static mesh specularity
    this.specularity = 0.0;
}

StaticMesh.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init static mesh                                               //
    //  param model : Model pointer                                           //
    //  param texture : Texture pointer                                       //
    ////////////////////////////////////////////////////////////////////////////
    init: function(model, texture)
    {
        // Reset static mesh
        this.shadowsMatrixLocation = -1;
        this.cameraPosLocation = -1;
        this.lightsCountLocation = -1;
        this.lightsTextureLocation = -1;
        this.shadowsMatrixLocation = -1;
        this.worldLightVecUniform = -1;
        this.worldLightColorUniform = -1;
        this.worldLightAmbientUniform = -1;
        this.specularityUniform = -1;
        this.alphaUniform = -1;
        this.alphaUniformLow = -1;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix.setIdentity();
        this.position.reset();
        this.angles.reset();
        this.scale = 1.0;
        this.alpha = 1.0;
        this.specularity = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check low static mesh shader pointer
        if (!this.meshShaderLow) return false;

        // Get static mesh shader uniforms locations
        if (this.renderer.maxQuality >= 1)
        {
            // Check static mesh shader pointer
            if (!this.meshShader) return false;

            this.meshShader.bind();
            this.shadowsMatrixLocation = this.meshShader.getUniform(
                "shadowsMatrix"
            );
            this.cameraPosLocation = this.meshShader.getUniform("cameraPos");
            this.lightsCountLocation = this.meshShader.getUniform(
                "lightsCount"
            );
            this.lightsTextureLocation = this.meshShader.getUniform(
                "lightsTexture"
            );
            this.meshShader.sendIntUniform(this.lightsTextureLocation, 1);
            this.shadowsTextureLocation = this.meshShader.getUniform(
                "shadowsTexture"
            );
            this.meshShader.sendIntUniform(this.shadowsTextureLocation, 2);
            this.worldLightVecUniform =
                this.meshShader.getUniform("worldLightVec");
            this.worldLightColorUniform =
                this.meshShader.getUniform("worldLightColor");
            this.worldLightAmbientUniform =
                this.meshShader.getUniform("worldLightAmbient");
            this.specularityUniform = this.meshShader.getUniform("specularity");
            this.alphaUniform = this.meshShader.getUniform("alpha");
            this.meshShader.unbind();
        }

        // Get low static mesh shader uniforms locations
        this.meshShaderLow.bind();
        this.alphaUniformLow = this.meshShaderLow.getUniform("alpha");
        this.meshShaderLow.unbind();

        // Check model pointer
        if (!model) return false;

        // Check texture pointer
        if (!texture) return false;

        // Init vertex buffer
        this.vertexBuffer = new MeshVertexBuffer(this.renderer.gl);
        if ((model.facesCount > 0) && model.vertices &&
            model.texCoords && model.indices)
        {
            if (!this.vertexBuffer.init(model.facesCount, model.vertices,
                model.texCoords, model.normals, model.indices))
            {
                // Could not create vertex buffer
                return false;
            }
        }
        else
        {
            // Invalid model data
            return false;
        }

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Static mesh loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set static mesh position                                //
    //  param x : Static mesh X position                                      //
    //  param y : Static mesh Y position                                      //
    //  param z : Static mesh Z position                                      //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set static mesh position from a 3 components vector //
    //  param vector : 3 components vector to set static mesh position from   //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
        this.position.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set static mesh X position                                     //
    //  param x : Static mesh X position                                      //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set static mesh Y position                                     //
    //  param y : Static mesh Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set static mesh Z position                                     //
    //  param z : Static mesh Z position                                      //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate static mesh                                          //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y, z)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
        this.position.vec[1] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec3 : Translate static mesh by a 3 components vector             //
    //  param vector : 3 components vector to translate static mesh by        //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.position.vec[2] += vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate static mesh on X axis                               //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate static mesh on Y axis                               //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Translate static mesh on Z axis                               //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngles : Set static mesh rotation angles                           //
    //  param angle : Static mesh rotation angle to set in degrees            //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set static mesh rotation angles from a vector         //
    //  param vector : 3 components vector to set rotation angles from        //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(vector)
    {
        this.angles.vec[0] = vector.vec[0];
        this.angles.vec[1] = vector.vec[1];
        this.angles.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate static mesh on the X axis                            //
    //  param angleX : X angle to rotate static mesh by in degrees            //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate static mesh on the Y axis                            //
    //  param angleY : Y angle to rotate static mesh by in degrees            //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate static mesh on the Z axis                            //
    //  param angleZ : Z angle to rotate static mesh by in degrees            //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setScale : Set static mesh scale                                      //
    //  param scale : Static mesh scale to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setScale: function(scale)
    {
        this.scale = scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scale : Scale static mesh                                             //
    //  param scale : Static mesh scale factor to apply                       //
    ////////////////////////////////////////////////////////////////////////////
    scale: function(scale)
    {
        this.scale *= scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularity : Set static mesh specularity                          //
    //  param specularity : Static mesh specularity to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularity: function(specularity)
    {
        this.specularity = specularity;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set static mesh alpha                                      //
    //  param alpha : Static mesh alpha to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get static mesh X position                                     //
    //  return : Static mesh X position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get static mesh Y position                                     //
    //  return : Static mesh Y position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get static mesh Z position                                     //
    //  return : Static mesh Z position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.position.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleX : Get static mesh X rotation angle                          //
    //  return : Static mesh X rotation angle in degrees                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get static mesh Y rotation angle                          //
    //  return : Static mesh Y rotation angle in degrees                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get static mesh Z rotation angle                          //
    //  return : Static mesh Z rotation angle in degrees                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getScale : Get static mesh scale                                      //
    //  return : Static mesh scale                                            //
    ////////////////////////////////////////////////////////////////////////////
    getScale: function()
    {
        return this.scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getSpecularity : Get static mesh specularity                          //
    //  return : Static mesh specularity                                      //
    ////////////////////////////////////////////////////////////////////////////
    getSpecularity: function()
    {
        return this.specularity;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get static mesh alpha                                      //
    //  return : Static mesh alpha                                            //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render static mesh                                           //
    //  param quality : Static mesh shader quality                            //
    //  param shadows : Shadows manager pointer                               //
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality, shadows)
    {
        // Set static mesh model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec3(this.position);
        this.modelMatrix.rotateVec3(this.angles);
        this.modelMatrix.scale(this.scale, this.scale, this.scale);

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.camera.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.camera.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Set maximum quality
        if (quality >= this.renderer.maxQuality)
        {
            quality = this.renderer.maxQuality;
        }
        if (!shadows)
        {
            quality = 0;
        }

        // Render static mesh
        if (quality == 0)
        {
            // Low quality
            this.meshShaderLow.bind();

            // Send low quality shader uniforms
            this.meshShaderLow.sendWorldMatrix(this.renderer.worldMatrix);
            this.meshShaderLow.sendUniform(this.alphaUniformLow, this.alpha);

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.meshShaderLow);
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind low static mesh shader
            this.meshShaderLow.unbind();
        }
        else
        {
            // High quality
            this.meshShader.bind();

            // Send high quality shader uniforms
            this.shadowsMatrix.setMatrix(shadows.projMatrix);
            this.shadowsMatrix.multiply(shadows.viewMatrix);

            this.meshShader.sendWorldMatrix(this.renderer.worldMatrix);
            this.meshShader.sendModelMatrix(this.modelMatrix);
            this.meshShader.sendUniformMat4(
                this.shadowsMatrixLocation, this.shadowsMatrix
            );
            this.meshShader.sendUniformVec3(
                this.cameraPosLocation, this.renderer.camera.position
            );
            this.meshShader.sendUniform(
                this.lightsCountLocation,
                this.renderer.dynamicLights.lightsCount
            );
            this.meshShader.sendUniformVec3(
                this.worldLightVecUniform, this.renderer.worldLight.direction
            );
            this.meshShader.sendUniformVec4(
                this.worldLightColorUniform, this.renderer.worldLight.color
            );
            this.meshShader.sendUniformVec4(
                this.worldLightAmbientUniform, this.renderer.worldLight.ambient
            );
            this.meshShader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.meshShader.sendUniform(this.alphaUniform, this.alpha);

            // Bind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.dynamicLights.lightsTexture
            );
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                shadows.depthTexture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.meshShader);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind static mesh shader
            this.meshShader.unbind();
        }
    }
};
