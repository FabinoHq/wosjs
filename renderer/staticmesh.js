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
//           \\__/      \\_/    //______________/ //_____________/  JS        //
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
//    WOSjs : Web Operating System (javascript version)                       //
//      renderer/staticmesh.js : Static mesh management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Static mesh class definition                                              //
//  param renderer : Renderer pointer                                         //
//  param meshShader : Static mesh shader pointer                             //
//  param meshShaderMedium : Medium static mesh shader pointer                //
//  param meshShaderLow : Low static mesh shader pointer                      //
////////////////////////////////////////////////////////////////////////////////
function StaticMesh(renderer, meshShader, meshShaderMedium, meshShaderLow)
{
    // Renderer pointer
    this.renderer = renderer;

    // Static mesh shader pointer
    this.meshShader = meshShader;
    this.meshShaderMedium = meshShaderMedium;
    this.meshShaderLow = meshShaderLow;

    // Static mesh shader uniforms locations
    this.specularityUniform = null;
    this.specularityUniformMedium = null;
    this.alphaUniform = null;
    this.alphaUniformMedium = null;
    this.alphaUniformLow = null;

    // Static mesh vertex buffer
    this.vertexBuffer = null;

    // Static mesh texture
    this.texture = null;
    // Static mesh normal map
    this.normalMap = null;
    // Static mesh specular map
    this.specularMap = null;
    // Static mesh model matrix
    this.modelMatrix = new Matrix4x4();

    // Skeletal mesh attachment
    this.attachedMesh = null;
    // Skeletal bone attachment
    this.attachedBone = 0;

    // Static mesh position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Static mesh rotation angles
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Static mesh scale
    this.scaleFactor = 1.0;
    // Static mesh alpha
    this.alpha = 1.0;
    // Static mesh specularity
    this.specularity = 0.0;

    // VecMat 4x4 model matrix
    this.vecmat = new VecMat4x4();
}

StaticMesh.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init static mesh                                               //
    //  param model : Model pointer                                           //
    //  param texture : Texture pointer                                       //
    //  return : True if static mesh is successfully loaded                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(model, texture)
    {
        // Reset static mesh
        this.specularityUniform = null;
        this.specularityUniformMedium = null;
        this.alphaUniform = null;
        this.alphaUniformMedium = null;
        this.alphaUniformLow = null;
        this.vertexBuffer = null;
        this.texture = null;
        this.normalMap = null;
        this.specularMap = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        this.attachedMesh = null;
        this.attachedBone = 0;
        if (!this.position) return false;
        this.position.reset();
        if (!this.angles) return false;
        this.angles.reset();
        this.scaleFactor = 1.0;
        this.alpha = 1.0;
        this.specularity = 0.0;
        if (!this.vecmat) return false;
        this.vecmat.setIdentity();

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check low static mesh shader pointer
        if (!this.meshShaderLow) return false;

        // Get static mesh shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            // Check static mesh shader pointer
            if (!this.meshShader) return false;

            this.meshShader.bind();
            this.specularityUniform = this.meshShader.getUniform("specularity");
            if (!this.specularityUniform) return false;
            this.alphaUniform = this.meshShader.getUniform("alpha");
            if (!this.alphaUniform) return false;
            this.meshShader.unbind();
        }

        // Get medium static mesh shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            // Check medium static mesh shader pointer
            if (!this.meshShaderMedium) return false;

            this.meshShaderMedium.bind();
            this.specularityUniformMedium =
                this.meshShaderMedium.getUniform("specularity");
            if (!this.specularityUniformMedium) return false;
            this.alphaUniformMedium = this.meshShaderMedium.getUniform("alpha");
            if (!this.alphaUniformMedium) return false;
            this.meshShaderMedium.unbind();
        }

        // Get low static mesh shader uniforms locations
        this.meshShaderLow.bind();
        this.alphaUniformLow = this.meshShaderLow.getUniform("alpha");
        if (!this.alphaUniformLow) return false;
        this.meshShaderLow.unbind();

        // Check model pointer
        if (!model) return false;

        // Check texture pointer
        if (!texture) return false;

        // Init vertex buffer
        this.vertexBuffer = new MeshVertexBuffer(this.renderer);
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

        // Set default normal map
        this.normalMap = this.renderer.normalMap;

        // Set default specular map
        this.specularMap = this.renderer.specularMap;

        // Static mesh successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTexture : Set static mesh texture                                  //
    //  param texture : Static mesh texture                                   //
    ////////////////////////////////////////////////////////////////////////////
    setTexture: function(texture)
    {
        if (texture)
        {
            this.texture = texture;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalMap : Set static mesh normal map                             //
    //  param normalMap : Static mesh normal map                              //
    ////////////////////////////////////////////////////////////////////////////
    setNormalMap: function(normalMap)
    {
        if (normalMap)
        {
            this.normalMap = normalMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularMap : Set static mesh specular map                         //
    //  param specularMap : Static mesh specular map                          //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularMap: function(specularMap)
    {
        if (specularMap)
        {
            this.specularMap = specularMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetAttachment : Reset skeletal mesh attachments                     //
    ////////////////////////////////////////////////////////////////////////////
    resetAttachment: function()
    {
        this.attachedMesh = null;
        this.attachedBone = 0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAttachment : Set skeletal mesh attachment bone                     //
    //  param skeletalMesh : Skeletal mesh to attach static mesh to           //
    //  param skeletalBone : Skeletal mesh bone to attach static mesh to      //
    ////////////////////////////////////////////////////////////////////////////
    setAttachment: function(skeletalMesh, skeletalBone)
    {
        if (skeletalMesh)
        {
            this.attachedMesh = skeletalMesh;
            this.attachedBone = skeletalBone;
        }
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
    //  param angleX : Static mesh X rotation angle to set in radians         //
    //  param angleY : Static mesh Y rotation angle to set in radians         //
    //  param angleZ : Static mesh Z rotation angle to set in radians         //
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
    //  setAngleX : Set static mesh rotation X angle                          //
    //  param angleX : Static mesh rotation X angle to set in radians         //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set static mesh rotation Y angle                          //
    //  param angleY : Static mesh rotation Y angle to set in radians         //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set static mesh rotation Z angle                          //
    //  param angleZ : Static mesh rotation Z angle to set in radians         //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate static mesh                                           //
    //  param angleX : X angle to rotate static mesh by in radians            //
    //  param angleY : Y angle to rotate static mesh by in radians            //
    //  param angleZ : Z angle to rotate static mesh by in radians            //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateVec3 : Rotate static mesh with a vector                         //
    //  param angles : 3 component angles vector to rotate static mesh with   //
    ////////////////////////////////////////////////////////////////////////////
    rotateVec3: function(angles)
    {
        this.angles.vec[0] += angles.vec[0];
        this.angles.vec[1] += angles.vec[1];
        this.angles.vec[2] += angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate static mesh around the X axis                        //
    //  param angleX : X angle to rotate static mesh by in radians            //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate static mesh around the Y axis                        //
    //  param angleY : Y angle to rotate static mesh by in radians            //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate static mesh around the Z axis                        //
    //  param angleZ : Z angle to rotate static mesh by in radians            //
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
        this.scaleFactor = scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scale : Scale static mesh                                             //
    //  param scale : Static mesh scale factor to apply                       //
    ////////////////////////////////////////////////////////////////////////////
    scale: function(scale)
    {
        this.scaleFactor *= scale;
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
    //  return : Static mesh X rotation angle in radians                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get static mesh Y rotation angle                          //
    //  return : Static mesh Y rotation angle in radians                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get static mesh Z rotation angle                          //
    //  return : Static mesh Z rotation angle in radians                      //
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
        return this.scaleFactor;
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
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality)
    {
        // Set static mesh model matrix
        this.modelMatrix.setIdentity();
        if (this.attachedMesh)
        {
            this.modelMatrix.setMatrix(this.attachedMesh.modelMatrix);
            this.modelMatrix.multiply(
                this.attachedMesh.bonesMatrices[this.attachedBone]
            );
        }
        this.modelMatrix.translateVec3(this.position);
        this.modelMatrix.rotateVec3(this.angles);
        this.modelMatrix.scale(
            this.scaleFactor, this.scaleFactor, this.scaleFactor
        );
        this.vecmat.setMatrix(this.modelMatrix);

        // Set maximum quality
        if (this.renderer.shadowsQuality <= WOSRendererShadowsQualityLow)
        {
            if (this.renderer.maxQuality >= WOSRendererQualityMedium)
            {
                if (quality >= WOSRendererQualityMedium)
                {
                    quality = WOSRendererQualityMedium;
                }
                else
                {
                    quality = WOSRendererQualityLow;
                }
            }
            else
            {
                quality = WOSRendererQualityLow;
            }
        }
        if (quality >= this.renderer.quality)
        {
            quality = this.renderer.quality;
        }
        if (quality >= this.renderer.maxQuality)
        {
            quality = this.renderer.maxQuality;
        }

        // Render static mesh
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.meshShader.bind();

            // Send high quality shader uniforms
            this.meshShader.sendModelVecmat(this.vecmat);
            this.meshShader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.meshShader.sendUniform(this.alphaUniform, this.alpha);

            // Bind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            if (this.normalMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
                this.normalMap.bind();
            }
            if (this.specularMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
                this.specularMap.bind();
            }

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.meshShader, quality);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind static mesh shader
            this.meshShader.unbind();
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality
            this.meshShaderMedium.bind();

            // Send medium quality shader uniforms
            this.meshShaderMedium.sendModelVecmat(this.vecmat);
            this.meshShaderMedium.sendUniform(
                this.specularityUniformMedium, this.specularity
            );
            this.meshShaderMedium.sendUniform(
                this.alphaUniformMedium, this.alpha
            );

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.meshShaderMedium, quality);
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind medium static mesh shader
            this.meshShaderMedium.unbind();
        }
        else
        {
            // Low quality
            this.meshShaderLow.bind();

            // Send low quality shader uniforms
            this.meshShaderLow.sendModelVecmat(this.vecmat);
            this.meshShaderLow.sendUniform(this.alphaUniformLow, this.alpha);

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.meshShaderLow, quality);
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind low static mesh shader
            this.meshShaderLow.unbind();
        }
    }
};
