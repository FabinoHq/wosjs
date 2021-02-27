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
//      renderer/skeletalmesh.js : Skeletal mesh management                   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Skeletal mesh class definition                                            //
//  param renderer : Renderer pointer                                         //
//  param skeletalShader : Skeletal mesh shader pointer                       //
//  param skeletalShaderLow : Low skeletal mesh shader pointer                //
////////////////////////////////////////////////////////////////////////////////
function SkeletalMesh(renderer, skeletalShader, skeletalShaderLow)
{
    // Renderer pointer
    this.renderer = renderer;

    // Skeletal mesh shader pointer
    this.skeletalShader = skeletalShader;
    this.skeletalShaderLow = skeletalShaderLow;

    // Skeletal mesh shader uniforms locations
    this.shadowsTextureLocation = -1;
    this.cameraPosLocation = -1;
    this.lightsCountLocation = -1;
    this.bonesMatricesLocation = -1;
    this.bonesMatricesLocationLow = -1;
    this.bonesCountUniform = -1;
    this.bonesCountUniformLow = -1;
    this.lightsTextureLocation = -1;
    this.shadowsMatrixLocation = -1;
    this.worldLightVecUniform = -1;
    this.worldLightColorUniform = -1;
    this.worldLightAmbientUniform = -1;
    this.specularityUniform = -1;
    this.alphaUniform = -1;
    this.alphaUniformLow = -1;

    // Skeletal mesh vertex buffer
    this.vertexBuffer = null;

    // Skeletal mesh texture
    this.texture = null;
    // Skeletal mesh model matrix
    this.modelMatrix = new Matrix4x4();
    // Skeletal mesh shadows matrix
    this.shadowsMatrix = new Matrix4x4();

    // Bones count
    this.bonesCount = 0;
    // Bones parents
    this.bonesParents = null;
    // Bones positions
    this.bonesPositions = null;
    // Bones angles
    this.bonesAngles = null;
    // Bones matrices
    this.bonesMatrices = null;
    // Bones bind pose inverse matrices
    this.bonesInverses = null;
    // Bones matrices texture
    this.bonesTexture = null;
    // Bones array
    this.bonesArray = null;

    // Skeletal mesh position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Skeletal mesh rotation angles
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Skeletal mesh scale
    this.scale = 1.0;
    // Skeletal mesh alpha
    this.alpha = 1.0;
    // Static mesh specularity
    this.specularity = 0.0;
}

SkeletalMesh.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init skeletal mesh                                             //
    //  param model : Model pointer                                           //
    //  param texture : Texture pointer                                       //
    ////////////////////////////////////////////////////////////////////////////
    init: function(model, texture)
    {
        var i = 0;

        // Reset skeletal mesh
        this.shadowsTextureLocation = -1;
        this.cameraPosLocation = -1;
        this.lightsCountLocation = -1;
        this.bonesMatricesLocation = -1;
        this.bonesMatricesLocationLow = -1;
        this.bonesCountUniform = -1;
        this.bonesCountUniformLow = -1;
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
        this.shadowsMatrix.setIdentity();
        this.bonesCount = 0;
        this.bonesParents = null;
        this.bonesPositions = null;
        this.bonesAngles = null;
        this.bonesMatrices = null;
        this.bonesInverses = null;
        this.bonesTexture = null;
        this.bonesArray = null;
        this.position.reset();
        this.angles.reset();
        this.scale = 1.0;
        this.alpha = 1.0;
        this.specularity = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check low skeletal mesh shader pointer
        if (!this.skeletalShaderLow) return false;

        // Get skeletal mesh shader uniforms locations
        if (this.renderer.maxQuality >= 1)
        {
            // Check skeletal mesh shader pointer
            if (!this.skeletalShader) return false;

            this.skeletalShader.bind();
            this.shadowsMatrixLocation = this.skeletalShader.getUniform(
                "shadowsMatrix"
            );
            this.cameraPosLocation = this.skeletalShader.getUniform(
                "cameraPos"
            );
            this.lightsCountLocation = this.skeletalShader.getUniform(
                "lightsCount"
            );
            this.bonesMatricesLocation = this.skeletalShader.getUniform(
                "bonesMatrices"
            );
            this.skeletalShader.sendIntUniform(this.bonesMatricesLocation, 1);
            this.bonesCountUniform = this.skeletalShader.getUniform(
                "bonesCount"
            );
            this.lightsTextureLocation = this.skeletalShader.getUniform(
                "lightsTexture"
            );
            this.skeletalShader.sendIntUniform(this.lightsTextureLocation, 2);
            this.shadowsTextureLocation = this.skeletalShader.getUniform(
                "shadowsTexture"
            );
            this.skeletalShader.sendIntUniform(this.shadowsTextureLocation, 3);
            this.worldLightVecUniform =
                this.skeletalShader.getUniform("worldLightVec");
            this.worldLightColorUniform =
                this.skeletalShader.getUniform("worldLightColor");
            this.worldLightAmbientUniform =
                this.skeletalShader.getUniform("worldLightAmbient");
            this.specularityUniform = this.skeletalShader.getUniform(
                "specularity"
            );
            this.alphaUniform = this.skeletalShader.getUniform("alpha");
            this.skeletalShader.unbind();
        }

        // Get low skeletal mesh shader uniforms locations
        this.skeletalShaderLow.bind();
        this.bonesMatricesLocationLow = this.skeletalShaderLow.getUniform(
            "bonesMatrices"
        );
        this.skeletalShaderLow.sendIntUniform(this.bonesMatricesLocationLow, 1);
        this.bonesCountUniformLow = this.skeletalShaderLow.getUniform(
            "bonesCount"
        );
        this.alphaUniformLow = this.skeletalShaderLow.getUniform("alpha");
        this.skeletalShaderLow.unbind();

        // Check model pointer
        if (!model) return false;

        // Check texture pointer
        if (!texture) return false;

        // Init vertex buffer
        this.vertexBuffer = new SkeletalVertexBuffer(this.renderer.gl);
        if ((model.facesCount > 0) && model.vertices &&
            model.texCoords && model.normals && model.indices)
        {
            if (!this.vertexBuffer.init(model.facesCount, model.vertices,
                model.texCoords, model.normals, model.indices,
                model.bonesIndices, model.bonesWeights))
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

        // Check skeletal model data
        if (!model.skeletalModel) return false;

        // Create bones matrices
        this.bonesCount = model.bonesCount;
        this.bonesParents = new Array(this.bonesCount);
        this.bonesMatrices = new Array(this.bonesCount);
        this.bonesInverses = new Array(this.bonesCount);
        this.bonesPositions = new Array(this.bonesCount);
        this.bonesAngles = new Array(this.bonesCount);
        for (i = 0; i < this.bonesCount; ++i)
        {
            this.bonesParents[i] = model.bonesParents[i];
            this.bonesPositions[i] = new Vector3(model.bonesPositions[(i*3)],
                model.bonesPositions[(i*3)+1], model.bonesPositions[(i*3)+2]
            );
            this.bonesAngles[i] = new Vector3(model.bonesAngles[(i*3)],
                model.bonesAngles[(i*3)+1], model.bonesAngles[(i*3)+2]
            );
            this.bonesMatrices[i] = new Matrix4x4();
            this.bonesMatrices[i].setIdentity();
            this.bonesMatrices[i].setMatrix(
                this.bonesMatrices[this.bonesParents[i]]
            );
            this.bonesMatrices[i].translateVec3(this.bonesPositions[i]);
            this.bonesMatrices[i].rotateVec3(this.bonesAngles[i]);
            this.bonesInverses[i] = new Matrix4x4();
            this.bonesInverses[i].setMatrix(this.bonesMatrices[i]);
            this.bonesInverses[i].inverse();
        }

        // Create bones matrices texture
        this.bonesTexture = this.renderer.gl.createTexture();
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.bonesTexture
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MIN_FILTER,
            this.renderer.gl.NEAREST
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MAG_FILTER,
            this.renderer.gl.NEAREST
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_S,
            this.renderer.gl.CLAMP_TO_EDGE
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_T,
            this.renderer.gl.CLAMP_TO_EDGE
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Create bones array
        this.bonesArray = new GLArrayDataType(this.bonesCount*16);

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Skeletal mesh loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set skeletal mesh position                              //
    //  param x : Skeletal mesh X position                                    //
    //  param y : Skeletal mesh Y position                                    //
    //  param z : Skeletal mesh Z position                                    //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set skeletal mesh position from a vector            //
    //  param vector : 3 components vector to set skeletal mesh position from //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
        this.position.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set skeletal mesh X position                                   //
    //  param x : Skeletal mesh X position                                    //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set skeletal mesh Y position                                   //
    //  param y : Skeletal mesh Y position                                    //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set skeletal mesh Z position                                   //
    //  param z : Skeletal mesh Z position                                    //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate skeletal mesh                                        //
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
    //  moveVec3 : Translate skeletal mesh by a 3 components vector           //
    //  param vector : 3 components vector to translate skeletal mesh by      //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.position.vec[2] += vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate skeletal mesh on X axis                             //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate skeletal mesh on Y axis                             //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Translate skeletal mesh on Z axis                             //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngles : Set skeletal mesh rotation angles                         //
    //  param angle : Skeletal mesh rotation angle to set in degrees          //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set skeletal mesh rotation angles from a vector       //
    //  param vector : 3 components vector to set rotation angles from        //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(vector)
    {
        this.angles.vec[0] = vector.vec[0];
        this.angles.vec[1] = vector.vec[1];
        this.angles.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate skeletal mesh on the X axis                          //
    //  param angleX : X angle to rotate skeletal mesh by in degrees          //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate skeletal mesh on the Y axis                          //
    //  param angleY : Y angle to rotate skeletal mesh by in degrees          //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate skeletal mesh on the Z axis                          //
    //  param angleZ : Z angle to rotate skeletal mesh by in degrees          //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setScale : Set skeletal mesh scale                                    //
    //  param scale : Skeletal mesh scale to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setScale: function(scale)
    {
        this.scale = scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scale : Scale skeletal mesh                                           //
    //  param scale : Skeletal mesh scale factor to apply                     //
    ////////////////////////////////////////////////////////////////////////////
    scale: function(scale)
    {
        this.scale *= scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularity : Set skeletal mesh specularity                        //
    //  param specularity : Skeletal mesh specularity to set                  //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularity: function(specularity)
    {
        this.specularity = specularity;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set skeletal mesh alpha                                    //
    //  param alpha : Skeletal mesh alpha to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get skeletal mesh X position                                   //
    //  return : Skeletal mesh X position                                     //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get skeletal mesh Y position                                   //
    //  return : Skeletal mesh Y position                                     //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get skeletal mesh Z position                                   //
    //  return : Skeletal mesh Z position                                     //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.position.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleX : Get skeletal mesh X rotation angle                        //
    //  return : Skeletal mesh X rotation angle in degrees                    //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get skeletal mesh Y rotation angle                        //
    //  return : Skeletal mesh Y rotation angle in degrees                    //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get skeletal mesh Z rotation angle                        //
    //  return : Skeletal mesh Z rotation angle in degrees                    //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getScale : Get skeletal mesh scale                                    //
    //  return : Skeletal mesh scale                                          //
    ////////////////////////////////////////////////////////////////////////////
    getScale: function()
    {
        return this.scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getSpecularity : Get skeletal mesh specularity                        //
    //  return : Skeletal mesh specularity                                    //
    ////////////////////////////////////////////////////////////////////////////
    getSpecularity: function()
    {
        return this.specularity;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get skeletal mesh alpha                                    //
    //  return : Skeletal mesh alpha                                          //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute skeletal mesh                                       //
    //  param frametime : Frametime for skeletal mesh update                  //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        var i = 0;
        var tmpMat = new Matrix4x4();

        for (i = 0; i < this.bonesCount; ++i)
        {
            // Transform bone matrix
            this.bonesMatrices[i].setIdentity();
            this.bonesMatrices[i].setMatrix(
                this.bonesMatrices[this.bonesParents[i]]
            );
            this.bonesMatrices[i].translateVec3(this.bonesPositions[i]);
            this.bonesMatrices[i].rotateVec3(this.bonesAngles[i]);

            // Multiply bone matrix by inverse bind pose matrix
            tmpMat.setMatrix(this.bonesMatrices[i]);
            tmpMat.multiply(this.bonesInverses[i]);

            // Copy bone matrix to bones array
            this.bonesArray[i*16] = tmpMat.matrix[0];
            this.bonesArray[(i*16)+1] = tmpMat.matrix[1];
            this.bonesArray[(i*16)+2] = tmpMat.matrix[2];
            this.bonesArray[(i*16)+3] = tmpMat.matrix[3];
            this.bonesArray[(i*16)+4] = tmpMat.matrix[4];
            this.bonesArray[(i*16)+5] = tmpMat.matrix[5];
            this.bonesArray[(i*16)+6] = tmpMat.matrix[6];
            this.bonesArray[(i*16)+7] = tmpMat.matrix[7];
            this.bonesArray[(i*16)+8] = tmpMat.matrix[8];
            this.bonesArray[(i*16)+9] = tmpMat.matrix[9];
            this.bonesArray[(i*16)+10] = tmpMat.matrix[10];
            this.bonesArray[(i*16)+11] = tmpMat.matrix[11];
            this.bonesArray[(i*16)+12] = tmpMat.matrix[12];
            this.bonesArray[(i*16)+13] = tmpMat.matrix[13];
            this.bonesArray[(i*16)+14] = tmpMat.matrix[14];
            this.bonesArray[(i*16)+15] = tmpMat.matrix[15];
        }

        // Bind bones matrices texture
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.bonesTexture
        );

        // Upload bones matrices array into texture
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            4, this.bonesCount, 0, this.renderer.gl.RGBA,
            this.renderer.gl.FLOAT, this.bonesArray
        );

        // Unbind bones matrices texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render skeletal mesh                                         //
    //  param quality : Skeletal mesh shader quality                          //
    //  param shadows : Shadows manager pointer                               //
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality, shadows)
    {
        // Set skeletal mesh model matrix
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

        // Render skeletal mesh
        if (quality == 0)
        {
            // Low quality
            this.skeletalShaderLow.bind();

            // Send low quality shader uniforms
            this.skeletalShaderLow.sendWorldMatrix(this.renderer.worldMatrix);
            this.skeletalShaderLow.sendUniform(
                this.bonesCountUniformLow, this.bonesCount
            );
            this.skeletalShaderLow.sendUniform(
                this.alphaUniformLow, this.alpha
            );

            // Bind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D, this.bonesTexture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShaderLow);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind low skeletal mesh shader
            this.skeletalShaderLow.unbind();
        }
        else
        {
            // High quality
            this.skeletalShader.bind();

            this.shadowsMatrix.setMatrix(shadows.projMatrix);
            this.shadowsMatrix.multiply(shadows.viewMatrix);

            // Send high quality shader uniforms
            this.skeletalShader.sendWorldMatrix(this.renderer.worldMatrix);
            this.skeletalShader.sendModelMatrix(this.modelMatrix);
            this.skeletalShader.sendUniformMat4(
                this.shadowsMatrixLocation, this.shadowsMatrix
            );
            this.skeletalShader.sendUniformVec3(
                this.cameraPosLocation, this.renderer.camera.position
            );
            this.skeletalShader.sendUniform(
                this.lightsCountLocation,
                this.renderer.dynamicLights.lightsCount
            );
            this.skeletalShader.sendUniform(
                this.bonesCountUniform, this.bonesCount
            );
            this.skeletalShader.sendUniformVec3(
                this.worldLightVecUniform, this.renderer.worldLight.direction
            );
            this.skeletalShader.sendUniformVec4(
                this.worldLightColorUniform, this.renderer.worldLight.color
            );
            this.skeletalShader.sendUniformVec4(
                this.worldLightAmbientUniform, this.renderer.worldLight.ambient
            );
            this.skeletalShader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.skeletalShader.sendUniform(this.alphaUniform, this.alpha);

            // Bind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D, this.bonesTexture
            );
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.dynamicLights.lightsTexture
            );
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                shadows.depthTexture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShader);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind skeletal mesh shader
            this.skeletalShader.unbind();
        }
    }
};
