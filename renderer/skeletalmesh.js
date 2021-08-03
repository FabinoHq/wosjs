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
//  param skeletalShaderMedium : Medium skeletal mesh shader pointer          //
//  param skeletalShaderLow : Low skeletal mesh shader pointer                //
////////////////////////////////////////////////////////////////////////////////
function SkeletalMesh(renderer,
    skeletalShader, skeletalShaderMedium, skeletalShaderLow)
{
    // Renderer pointer
    this.renderer = renderer;

    // Skeletal mesh shader pointer
    this.skeletalShader = skeletalShader;
    this.skeletalShaderMedium = skeletalShaderMedium;
    this.skeletalShaderLow = skeletalShaderLow;

    // Skeletal mesh shader uniforms locations
    this.shadowsTextureLocation = -1;
    this.normalMapLocation = -1;
    this.specularMapLocation = -1;
    this.cameraPosLocation = -1;
    this.cameraPosLocationMedium = -1;
    this.bonesMatricesLocation = -1;
    this.bonesMatricesLocationMedium = -1;
    this.bonesMatricesLocationLow = -1;
    this.bonesCountUniform = -1;
    this.bonesCountUniformMedium = -1;
    this.bonesCountUniformLow = -1;
    this.lightsTextureLocation = -1;
    this.lightsTextureLocationMedium = -1;
    this.shadowsMatrixLocation = -1;
    this.worldLightVecUniform = -1;
    this.worldLightVecUniformMedium = -1;
    this.worldLightColorUniform = -1;
    this.worldLightColorUniformMedium = -1;
    this.worldLightAmbientUniform = -1;
    this.worldLightAmbientUniformMedium = -1;
    this.specularityUniform = -1;
    this.specularityUniformMedium = -1;
    this.alphaUniform = -1;
    this.alphaUniformMedium = -1;
    this.alphaUniformLow = -1;

    // Skeletal mesh vertex buffer
    this.vertexBuffer = null;

    // Skeletal mesh texture
    this.texture = null;
    // Skeletal mesh normal map
    this.normalMap = null;
    // Skeletal mesh specular map
    this.specularMap = null;
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
    // Anim bones array
    this.animBones = null;
    // Animations array
    this.animations = null;

    // Anim groups
    this.animGroups = 0;
    // Anim keyframes
    this.keyFrames = null;
    // Current animations
    this.currentAnims = null;
    // Current frames
    this.currentFrames = null;
    // Current frametimes
    this.frametimes = null;
    // Current times
    this.currentTimes = null;
    // Current bones
    this.currentBones = null;

    // Skeletal mesh attachment
    this.attachedMesh = null;
    // Skeletal mesh bones attachment
    this.attachedBones = null;

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
        var j = 0;
        var k = 0;
        var found = false;

        // Reset skeletal mesh
        this.shadowsTextureLocation = -1;
        this.normalMapLocation = -1;
        this.specularMapLocation = -1;
        this.cameraPosLocation = -1;
        this.cameraPosLocationMedium = -1;
        this.bonesMatricesLocation = -1;
        this.bonesMatricesLocationMedium = -1;
        this.bonesMatricesLocationLow = -1;
        this.bonesCountUniform = -1;
        this.bonesCountUniformMedium = -1;
        this.bonesCountUniformLow = -1;
        this.lightsTextureLocation = -1;
        this.lightsTextureLocationMedium = -1;
        this.shadowsMatrixLocation = -1;
        this.worldLightVecUniform = -1;
        this.worldLightVecUniformMedium = -1;
        this.worldLightColorUniform = -1;
        this.worldLightColorUniformMedium = -1;
        this.worldLightAmbientUniform = -1;
        this.worldLightAmbientUniformMedium = -1;
        this.specularityUniform = -1;
        this.specularityUniformMedium = -1;
        this.alphaUniform = -1;
        this.alphaUniformMedium = -1;
        this.alphaUniformLow = -1;
        this.vertexBuffer = null;
        this.texture = null;
        this.normalMap = null;
        this.specularMap = null;
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
        this.animBones = null;
        this.animations = null;
        this.animGroups = 0;
        this.keyFrames = null;
        this.currentAnims = null;
        this.currentFrames = null;
        this.frametimes = null;
        this.currentTimes = null;
        this.currentBones = null;
        this.attachedMesh = null;
        this.attachedBones = null;
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
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
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
            this.normalMapLocation = this.skeletalShader.getUniform(
                "normalMap"
            );
            this.skeletalShader.sendIntUniform(this.normalMapLocation, 4);
            this.specularMapLocation = this.skeletalShader.getUniform(
                "specularMap"
            );
            this.skeletalShader.sendIntUniform(this.specularMapLocation, 5);
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

        // Get medium skeletal mesh shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            // Check medium skeletal mesh shader pointer
            if (!this.skeletalShaderMedium) return false;

            this.skeletalShaderMedium.bind();
            this.cameraPosLocationMedium = this.skeletalShaderMedium.getUniform(
                "cameraPos"
            );
            this.bonesMatricesLocationMedium =
                this.skeletalShaderMedium.getUniform("bonesMatrices");
            this.skeletalShaderMedium.sendIntUniform(
                this.bonesMatricesLocationMedium, 1
            );
            this.bonesCountUniformMedium = this.skeletalShaderMedium.getUniform(
                "bonesCount"
            );
            this.lightsTextureLocationMedium =
                this.skeletalShaderMedium.getUniform("lightsTexture");
            this.skeletalShaderMedium.sendIntUniform(
                this.lightsTextureLocationMedium, 2
            );
            this.worldLightVecUniformMedium =
                this.skeletalShaderMedium.getUniform("worldLightVec");
            this.worldLightColorUniformMedium =
                this.skeletalShaderMedium.getUniform("worldLightColor");
            this.worldLightAmbientUniformMedium =
                this.skeletalShaderMedium.getUniform("worldLightAmbient");
            this.specularityUniformMedium =
                this.skeletalShaderMedium.getUniform("specularity");
            this.alphaUniformMedium = this.skeletalShaderMedium.getUniform(
                "alpha"
            );
            this.skeletalShaderMedium.unbind();
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
        this.vertexBuffer = new SkeletalVertexBuffer(this.renderer);
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

        // Set anim groups count
        this.animGroups = model.animBones.length;

        // Create anim bones array
        this.animBones = new Array(this.bonesCount);
        for (i = 0; i < this.bonesCount; ++i)
        {
            this.animBones[i] = -1;

            // Look for matching bone
            found = false;
            for (j = 0; j < this.animGroups; ++j)
            {
                for (k = 0; k < model.animBones[j].length; ++k)
                {
                    if (model.animBones[j][k] == i)
                    {
                        // Get matching bone anim group
                        this.animBones[i] = j;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }
        }

        // Create animations array
        this.animations = model.animations;

        // Set keyframes count
        this.keyFrames = model.animFrames;

        // Create current animations array
        this.currentAnims = new Array(this.animGroups);
        for (i = 0; i < this.animGroups; ++i)
        {
            this.currentAnims[i] = 0;
        }

        // Create current frames array
        this.currentFrames = new Array(this.animGroups);
        for (i = 0; i < this.animGroups; ++i)
        {
            this.currentFrames[i] = 0;
        }

        // Create current frametimes array
        this.frametimes = new Array(this.animGroups);
        for (i = 0; i < this.animGroups; ++i)
        {
            this.frametimes[i] = 1.0;
        }

        // Create current times array
        this.currentTimes = new Array(this.animGroups);
        for (i = 0; i < this.animGroups; ++i)
        {
            this.currentTimes[i] = 0.0;
        }

        // Create current bones array
        this.currentBones = new Array(this.animGroups);
        for (i = 0; i < this.animGroups; ++i)
        {
            this.currentBones[i] = 0;
        }

        // Create bones attachement array
        this.attachedBones = new Array(this.bonesCount);

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Set default normal map
        this.normalMap = this.renderer.normalMap;

        // Set default specular map
        this.specularMap = this.renderer.specularMap;

        // Compute initial frame
        this.compute(0.0);

        // Skeletal mesh loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTexture : Set skeletal mesh texture                                //
    //  param texture : Skeletal mesh texture                                 //
    ////////////////////////////////////////////////////////////////////////////
    setTexture: function(texture)
    {
        if (texture)
        {
            this.texture = texture;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalMap : Set skeletal mesh normal map                           //
    //  param normalMap : Skeletal mesh normal map                            //
    ////////////////////////////////////////////////////////////////////////////
    setNormalMap: function(normalMap)
    {
        if (normalMap)
        {
            this.normalMap = normalMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularMap : Set skeletal mesh specular map                       //
    //  param specularMap : Skeletal mesh specular map                        //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularMap: function(specularMap)
    {
        if (specularMap)
        {
            this.specularMap = specularMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAttachment : Set skeletal mesh attachment mesh                     //
    //  param skeletalMesh : Skeletal mesh to attach skeletal mesh to         //
    ////////////////////////////////////////////////////////////////////////////
    setAttachment: function(skeletalMesh)
    {
        if (skeletalMesh)
        {
            this.attachedMesh = skeletalMesh;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBoneAttachment : Set skeletal mesh attachment bone                 //
    //  param bone : Current bone to attach skeletal mesh bone to             //
    //  param skeletalBone : Skeletal mesh bone to attach current bone to     //
    ////////////////////////////////////////////////////////////////////////////
    setBoneAttachment: function(bone, skeletalBone)
    {
        if (this.attachedMesh)
        {
            if ((bone >= 0 && bone) <= (this.attachedBones.length))
            {
                this.attachedBones[bone] = skeletalBone;
            }
        }
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
    //  setAngleX : Set skeletal mesh rotation X angle                        //
    //  param angleX : Skeletal mesh rotation X angle to set in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set skeletal mesh rotation Y angle                        //
    //  param angleY : Skeletal mesh rotation Y angle to set in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set skeletal mesh rotation Z angle                        //
    //  param angleZ : Skeletal mesh rotation Z angle to set in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
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
    //  setAnimation : Set skeletal mesh current animation                    //
    //  param animGroup : Anim group to set animation                         //
    //  param animation : Animation to set to the anim group                  //
    ////////////////////////////////////////////////////////////////////////////
    setAnimation: function(animGroup, animation)
    {
        if (this.animGroups)
        {
            if ((animGroup >= 0) && (animGroup <= this.animGroups))
            {
                if ((animation >= 0) &&
                    (animation <= this.animations[animGroup].length))
                {
                    this.currentAnims[animGroup] = animation;
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFrametime : Set skeletal mesh animation frametime                  //
    //  param animGroup : Anim group to set frametime                         //
    //  param frametime : Frametime to set to the anim group                  //
    ////////////////////////////////////////////////////////////////////////////
    setFrametime: function(animGroup, frametime)
    {
        if ((animGroup >= 0) && (animGroup <= this.animGroups))
        {
            this.frametimes[animGroup] = frametime;
        }
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
        var animGroup = -1;
        var currentFrame = -1;
        var nextFrame = -1;
        var currentAnim = -1;
        var currentBone = 0;
        var currentFrametime = 0.0;
        var currentTime = 0.0;
        var keyFrames = 0;
        var curI = 0;
        var nextI = 0;
        var animated = false;
        var pos = new Vector3();
        var nextPos = new Vector3();
        var rot = new Vector3();
        var nextRot = new Vector3();
        var attachedBone = 0;
        for (i = 0; i < this.animGroups; ++i)
        {
            this.currentBones[i] = 0;
        }

        // Compute animations frames
        for (i = 0; i < this.animGroups; ++i)
        {
            this.currentTimes[i] += frametime;
            if (this.currentTimes[i] >= this.frametimes[i])
            {
                // Next frame
                ++this.currentFrames[i];
                if (this.currentFrames[i] >=
                    this.keyFrames[i][this.currentAnims[i]])
                {
                    this.currentFrames[i] = 0;
                }
                this.currentTimes[i] = 0.0;
            }
        }

        for (i = 0; i < this.bonesCount; ++i)
        {
            // Transform bone matrix
            this.bonesMatrices[i].setIdentity();
            this.bonesMatrices[i].setMatrix(
                this.bonesMatrices[this.bonesParents[i]]
            );

            // Animate bone
            animated = false;
            if (this.attachedMesh)
            {
                // Bone attachment
                attachedBone = this.attachedBones[i];
                if ((attachedBone >= 0) &&
                    (attachedBone < this.attachedMesh.bonesCount))
                {
                    this.bonesMatrices[i].setMatrix(
                        this.attachedMesh.bonesMatrices[attachedBone]
                    );
                    animated = true;
                }
            }
            else
            {
                // Bone animation
                animGroup = this.animBones[i];
                if (animGroup >= 0)
                {
                    currentFrame = this.currentFrames[animGroup];
                    nextFrame = currentFrame+1;
                    currentTime = this.currentTimes[animGroup];
                    currentFrametime = this.frametimes[animGroup];
                    if (currentFrametime > 0.0)
                    {
                        currentTime /= currentFrametime;
                    }
                    if (nextFrame >=
                        this.keyFrames[animGroup][this.currentAnims[animGroup]])
                    {
                        nextFrame = 0;
                    }
                    if (currentFrame >= 0)
                    {
                        currentAnim = this.currentAnims[animGroup];
                        currentBone = this.currentBones[animGroup];
                        keyFrames = this.keyFrames[animGroup][currentAnim];
                        curI = (currentBone*keyFrames*6)+(currentFrame*6);
                        nextI = (currentBone*keyFrames*6)+(nextFrame*6);
                        pos.setXYZ(
                            this.animations[animGroup][currentAnim][curI],
                            this.animations[animGroup][currentAnim][curI+1],
                            this.animations[animGroup][currentAnim][curI+2]
                        );
                        rot.setXYZ(
                            this.animations[animGroup][currentAnim][curI+3],
                            this.animations[animGroup][currentAnim][curI+4],
                            this.animations[animGroup][currentAnim][curI+5]
                        );
                        nextPos.setXYZ(
                            this.animations[animGroup][currentAnim][nextI],
                            this.animations[animGroup][currentAnim][nextI+1],
                            this.animations[animGroup][currentAnim][nextI+2]
                        );
                        nextRot.setXYZ(
                            this.animations[animGroup][currentAnim][nextI+3],
                            this.animations[animGroup][currentAnim][nextI+4],
                            this.animations[animGroup][currentAnim][nextI+5]
                        );
                        pos.linearInterp(pos, nextPos, currentTime);
                        rot.linearInterp(rot, nextRot, currentTime);
                        this.bonesMatrices[i].translateVec3(pos);
                        this.bonesMatrices[i].rotateVec3(rot);
                        animated = true;
                    }
                    ++this.currentBones[animGroup];
                }
            }

            // Bone bind pose
            if (!animated)
            {
                this.bonesMatrices[i].translateVec3(this.bonesPositions[i]);
                this.bonesMatrices[i].rotateVec3(this.bonesAngles[i]);
            }

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
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality)
    {
        // Set skeletal mesh model matrix
        this.modelMatrix.setIdentity();
        if (this.attachedMesh)
        {
            this.modelMatrix.setMatrix(this.attachedMesh.modelMatrix);
        }
        this.modelMatrix.translateVec3(this.position);
        this.modelMatrix.rotateVec3(this.angles);
        this.modelMatrix.scale(this.scale, this.scale, this.scale);

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.camera.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.camera.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

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

        // Render skeletal mesh
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.skeletalShader.bind();

            this.shadowsMatrix.setMatrix(this.renderer.shadows.projMatrix);
            this.shadowsMatrix.multiply(this.renderer.shadows.viewMatrix);

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
                this.renderer.shadows.depthTexture
            );
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE4);
            this.normalMap.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE5);
            this.specularMap.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShader, quality);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE5);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE4);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
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
        else if (quality == WOSRendererQualityMedium)
        {
            // High quality
            this.skeletalShaderMedium.bind();

            // Send high quality shader uniforms
            this.skeletalShaderMedium.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.skeletalShaderMedium.sendModelMatrix(this.modelMatrix);
            this.skeletalShaderMedium.sendUniformVec3(
                this.cameraPosLocationMedium, this.renderer.camera.position
            );
            this.skeletalShaderMedium.sendUniform(
                this.bonesCountUniformMedium, this.bonesCount
            );
            this.skeletalShaderMedium.sendUniformVec3(
                this.worldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.skeletalShaderMedium.sendUniformVec4(
                this.worldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.skeletalShaderMedium.sendUniformVec4(
                this.worldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );
            this.skeletalShaderMedium.sendUniform(
                this.specularityUniformMedium, this.specularity
            );
            this.skeletalShaderMedium.sendUniform(
                this.alphaUniformMedium, this.alpha
            );

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

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShaderMedium, quality);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind skeletal mesh shader
            this.skeletalShaderMedium.unbind();
        }
        else
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
            this.vertexBuffer.render(this.skeletalShaderLow, quality);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind low skeletal mesh shader
            this.skeletalShaderLow.unbind();
        }
    }
};
