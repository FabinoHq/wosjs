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
    this.bonesCountUniform = null;
    this.bonesCountUniformMedium = null;
    this.bonesCountUniformLow = null;
    this.specularityUniform = null;
    this.specularityUniformMedium = null;
    this.alphaUniform = null;
    this.alphaUniformMedium = null;
    this.alphaUniformLow = null;

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
    // Skeletal mesh root attachment
    this.attachedRoot = null;
    // Skeletal mesh root bone attachment
    this.attachedRootBone = 0;
    // Bones animated angles
    this.bonesAnimRot = null;

    // Skeletal mesh position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Skeletal mesh rotation angles
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Skeletal mesh scale
    this.scaleFactor = 1.0;
    // Skeletal mesh alpha
    this.alpha = 1.0;
    // Static mesh specularity
    this.specularity = 0.0;

    // VecMat 4x4 model matrix
    this.vecmat = new VecMat4x4();

    // Temp matrix
    this.tmpMat = new Matrix4x4();
    // Temp vectors
    this.prevPos = new Vector3();
    this.pos = new Vector3();
    this.nextPos = new Vector3();
    this.nextPos2 = new Vector3();
    this.prevRot = new Vector3();
    this.rot = new Vector3();
    this.nextRot = new Vector3();
    this.nextRot2 = new Vector3();
}

SkeletalMesh.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init skeletal mesh                                             //
    //  param model : Model pointer                                           //
    //  param texture : Texture pointer                                       //
    //  return : True if skeletal mesh is successfully loaded                 //
    ////////////////////////////////////////////////////////////////////////////
    init: function(model, texture)
    {
        var i = 0;
        var j = 0;
        var k = 0;
        var found = false;

        // Reset skeletal mesh
        this.bonesCountUniform = null;
        this.bonesCountUniformMedium = null;
        this.bonesCountUniformLow = null;
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
        this.attachedRoot = null;
        this.attachedRootBone = 0;
        this.bonesAnimRot = null;
        if (!this.position) return false;
        this.position.reset();
        if (!this.angles) return false;
        this.angles.reset();
        this.scaleFactor = 1.0;
        this.alpha = 1.0;
        this.specularity = 0.0;
        if (!this.vecmat) return false;
        this.vecmat.setIdentity();
        if (!this.tmpMat) return false;
        this.tmpMat.setIdentity();
        if (!this.prevPos) return false;
        this.prevPos.reset();
        if (!this.pos) return false;
        this.pos.reset();
        if (!this.nextPos) return false;
        this.nextPos.reset();
        if (!this.nextPos2) return false;
        this.nextPos2.reset();
        if (!this.prevRot) return false;
        this.prevRot.reset();
        if (!this.rot) return false;
        this.rot.reset();
        if (!this.nextRot) return false;
        this.nextRot.reset();
        if (!this.nextRot2) return false;
        this.nextRot2.reset();

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
            this.bonesCountUniform =
                this.skeletalShader.getUniform("bonesCount");
            if (!this.bonesCountUniform) return false;
            this.specularityUniform =
                this.skeletalShader.getUniform("specularity");
            if (!this.specularityUniform) return false;
            this.alphaUniform = this.skeletalShader.getUniform("alpha");
            if (!this.alphaUniform) return false;
            this.skeletalShader.unbind();
        }

        // Get medium skeletal mesh shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            // Check medium skeletal mesh shader pointer
            if (!this.skeletalShaderMedium) return false;

            this.skeletalShaderMedium.bind();
            this.bonesCountUniformMedium =
                this.skeletalShaderMedium.getUniform("bonesCount");
            if (!this.bonesCountUniformMedium) return false;
            this.specularityUniformMedium =
                this.skeletalShaderMedium.getUniform("specularity");
            if (!this.specularityUniformMedium) return false;
            this.alphaUniformMedium =
                this.skeletalShaderMedium.getUniform("alpha");
            if (!this.alphaUniformMedium) return false;
            this.skeletalShaderMedium.unbind();
        }

        // Get low skeletal mesh shader uniforms locations
        this.skeletalShaderLow.bind();
        this.bonesCountUniformLow =
            this.skeletalShaderLow.getUniform("bonesCount");
        if (!this.bonesCountUniformLow) return false;
        this.alphaUniformLow = this.skeletalShaderLow.getUniform("alpha");
        if (!this.alphaUniformLow) return false;
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
        if (!this.bonesParents) return false;
        this.bonesMatrices = new Array(this.bonesCount);
        if (!this.bonesMatrices) return false;
        this.bonesInverses = new Array(this.bonesCount);
        if (!this.bonesInverses) return false;
        this.bonesPositions = new Array(this.bonesCount);
        if (!this.bonesPositions) return false;
        this.bonesAngles = new Array(this.bonesCount);
        if (!this.bonesAngles) return false;
        this.bonesAnimRot = new Array(this.bonesCount);
        if (!this.bonesAnimRot) return false;
        for (i = 0; i < this.bonesCount; ++i)
        {
            this.bonesParents[i] = model.bonesParents[i];
            this.bonesPositions[i] = new Vector3(model.bonesPositions[(i*3)],
                model.bonesPositions[(i*3)+1], model.bonesPositions[(i*3)+2]
            );
            if (!this.bonesPositions[i]) return false;
            this.bonesAngles[i] = new Vector3(model.bonesAngles[(i*3)],
                model.bonesAngles[(i*3)+1], model.bonesAngles[(i*3)+2]
            );
            if (!this.bonesAngles[i]) return false;
            this.bonesAnimRot[i] = new Vector3(model.bonesAngles[(i*3)],
                model.bonesAngles[(i*3)+1], model.bonesAngles[(i*3)+2]
            );
            if (!this.bonesAnimRot[i]) return false;
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

        // Skeletal mesh successfully loaded
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
    //  resetAttachment : Reset skeletal mesh attachments                     //
    ////////////////////////////////////////////////////////////////////////////
    resetAttachment: function()
    {
        var i = 0;
        this.attachedMesh = null;
        for (i = 0; i < this.attachedBones.length; ++i)
        {
            this.attachedBones[bone] = 0;
        }
        this.attachedRoot = null;
        this.attachedRootBone = 0;
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
            this.attachedRoot = null;
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
            if ((bone >= 0) && (bone <= this.attachedBones.length))
            {
                this.attachedBones[bone] = skeletalBone;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setRootAttachment : Set skeletal mesh root bone attachment mesh       //
    //  param skeletalMesh : Skeletal mesh to attach skeletal root bone to    //
    //  param skeletalBone : Skeletal mesh bone to attach root bone to        //
    ////////////////////////////////////////////////////////////////////////////
    setRootAttachment: function(skeletalMesh, skeletalBone)
    {
        if (skeletalMesh)
        {
            if ((skeletalBone >= 0) &&
                (skeletalBone <= skeletalMesh.bonesCount))
            {
                this.attachedRoot = skeletalMesh;
                this.attachedRootBone = skeletalBone;
                this.attachedMesh = null;
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
    //  param angleX : Skeletal mesh rotation angle to set in radians         //
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
    //  param angleX : Skeletal mesh rotation X angle to set in radians       //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set skeletal mesh rotation Y angle                        //
    //  param angleY : Skeletal mesh rotation Y angle to set in radians       //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set skeletal mesh rotation Z angle                        //
    //  param angleZ : Skeletal mesh rotation Z angle to set in radians       //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate skeletal mesh                                         //
    //  param angleX : X angle to rotate skeletal mesh by in radians          //
    //  param angleY : Y angle to rotate skeletal mesh by in radians          //
    //  param angleZ : Z angle to rotate skeletal mesh by in radians          //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateVec3 : Rotate skeletal mesh with a vector                       //
    //  param angles : 3 component angles vector to rotate skeletal mesh with //
    ////////////////////////////////////////////////////////////////////////////
    rotateVec3: function(angles)
    {
        this.angles.vec[0] += angles.vec[0];
        this.angles.vec[1] += angles.vec[1];
        this.angles.vec[2] += angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate skeletal mesh around the X axis                      //
    //  param angleX : X angle to rotate skeletal mesh by in radians          //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate skeletal mesh around the Y axis                      //
    //  param angleY : Y angle to rotate skeletal mesh by in radians          //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate skeletal mesh around the Z axis                      //
    //  param angleZ : Z angle to rotate skeletal mesh by in radians          //
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
        this.scaleFactor = scale;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scale : Scale skeletal mesh                                           //
    //  param scale : Skeletal mesh scale factor to apply                     //
    ////////////////////////////////////////////////////////////////////////////
    scale: function(scale)
    {
        this.scaleFactor *= scale;
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
    //  return : Skeletal mesh X rotation angle in radians                    //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get skeletal mesh Y rotation angle                        //
    //  return : Skeletal mesh Y rotation angle in radians                    //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get skeletal mesh Z rotation angle                        //
    //  return : Skeletal mesh Z rotation angle in radians                    //
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
        return this.scaleFactor;
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
        var animGroup = -1;
        var prevFrame = -1;
        var currentFrame = -1;
        var nextFrame = -1;
        var nextFrame2 = -1;
        var currentAnim = -1;
        var currentBone = 0;
        var currentFrametime = 0.0;
        var currentTime = 0.0;
        var keyFrames = 0;
        var prevI = 0;
        var curI = 0;
        var nextI = 0;
        var nextI2 = 0;
        var animated = false;
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
                        // Animate bone
                        currentAnim = this.currentAnims[animGroup];
                        currentBone = this.currentBones[animGroup];
                        keyFrames = this.keyFrames[animGroup][currentAnim];
                        curI = (currentBone*keyFrames*6)+(currentFrame*6);
                        nextI = (currentBone*keyFrames*6)+(nextFrame*6);
                        this.pos.setXYZ(
                            this.animations[animGroup][currentAnim][curI],
                            this.animations[animGroup][currentAnim][curI+1],
                            this.animations[animGroup][currentAnim][curI+2]
                        );
                        this.rot.setXYZ(
                            this.animations[animGroup][currentAnim][curI+3],
                            this.animations[animGroup][currentAnim][curI+4],
                            this.animations[animGroup][currentAnim][curI+5]
                        );
                        this.nextPos.setXYZ(
                            this.animations[animGroup][currentAnim][nextI],
                            this.animations[animGroup][currentAnim][nextI+1],
                            this.animations[animGroup][currentAnim][nextI+2]
                        );
                        this.nextRot.setXYZ(
                            this.animations[animGroup][currentAnim][nextI+3],
                            this.animations[animGroup][currentAnim][nextI+4],
                            this.animations[animGroup][currentAnim][nextI+5]
                        );
                        if (this.renderer.animQuality ==
                            WOSRendererAnimQualityHigh)
                        {
                            // High quality hermit interpolation
                            prevFrame = currentFrame-1;
                            if (prevFrame < 0)
                            {
                                prevFrame = this.keyFrames
                                    [animGroup][this.currentAnims[animGroup]]-1;
                            }
                            nextFrame2 = nextFrame+1;
                            if (nextFrame2 >= this.keyFrames[
                                animGroup][this.currentAnims[animGroup]])
                            {
                                nextFrame2 = 0;
                            }
                            prevI = (currentBone*keyFrames*6)+(prevFrame*6);
                            nextI2 = (currentBone*keyFrames*6)+(nextFrame2*6);
                            this.prevPos.setXYZ(
                            this.animations[animGroup][currentAnim][prevI],
                            this.animations[animGroup][currentAnim][prevI+1],
                            this.animations[animGroup][currentAnim][prevI+2]
                            );
                            this.prevRot.setXYZ(
                            this.animations[animGroup][currentAnim][prevI+3],
                            this.animations[animGroup][currentAnim][prevI+4],
                            this.animations[animGroup][currentAnim][prevI+5]
                            );
                            this.nextPos2.setXYZ(
                            this.animations[animGroup][currentAnim][nextI2],
                            this.animations[animGroup][currentAnim][nextI2+1],
                            this.animations[animGroup][currentAnim][nextI2+2]
                            );
                            this.nextRot2.setXYZ(
                            this.animations[animGroup][currentAnim][nextI2+3],
                            this.animations[animGroup][currentAnim][nextI2+4],
                            this.animations[animGroup][currentAnim][nextI2+5]
                            );
                            this.pos.hermitInterp(
                                this.prevPos, this.pos,
                                this.nextPos, this.nextPos2, currentTime
                            );
                            this.rot.hermitInterp(
                                this.prevRot, this.rot,
                                this.nextRot, this.nextRot2, currentTime
                            );
                        }
                        else
                        {
                            // Low quality linear interpolation
                            this.pos.linearInterp(
                                this.pos, this.nextPos, currentTime
                            );
                            this.rot.linearInterp(
                                this.rot, this.nextRot, currentTime
                            );
                        }
                        this.bonesMatrices[i].translateVec3(this.pos);
                        this.bonesMatrices[i].rotateVec3(this.rot);

                        // Compute final bone position and rotation
                        if (i == 0)
                        {
                            this.bonesAnimRot[i].setVector(this.rot);
                        }
                        else
                        {
                            this.bonesAnimRot[i].setVector(
                                this.bonesAnimRot[this.bonesParents[i]]
                            );
                            this.bonesAnimRot[i].add(this.rot);
                        }
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
                this.bonesAnimRot[i].setVector(this.bonesAngles[i]);
            }

            // Multiply bone matrix by inverse bind pose matrix
            this.tmpMat.setMatrix(this.bonesMatrices[i]);
            this.tmpMat.multiply(this.bonesInverses[i]);

            // Copy bone matrix to bones array
            this.bonesArray[i*16] = this.tmpMat.matrix[0];
            this.bonesArray[(i*16)+1] = this.tmpMat.matrix[1];
            this.bonesArray[(i*16)+2] = this.tmpMat.matrix[2];
            this.bonesArray[(i*16)+3] = this.tmpMat.matrix[3];
            this.bonesArray[(i*16)+4] = this.tmpMat.matrix[4];
            this.bonesArray[(i*16)+5] = this.tmpMat.matrix[5];
            this.bonesArray[(i*16)+6] = this.tmpMat.matrix[6];
            this.bonesArray[(i*16)+7] = this.tmpMat.matrix[7];
            this.bonesArray[(i*16)+8] = this.tmpMat.matrix[8];
            this.bonesArray[(i*16)+9] = this.tmpMat.matrix[9];
            this.bonesArray[(i*16)+10] = this.tmpMat.matrix[10];
            this.bonesArray[(i*16)+11] = this.tmpMat.matrix[11];
            this.bonesArray[(i*16)+12] = this.tmpMat.matrix[12];
            this.bonesArray[(i*16)+13] = this.tmpMat.matrix[13];
            this.bonesArray[(i*16)+14] = this.tmpMat.matrix[14];
            this.bonesArray[(i*16)+15] = this.tmpMat.matrix[15];
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
            // Mesh attachment
            this.modelMatrix.setMatrix(this.attachedMesh.modelMatrix);
        }
        if (this.attachedRoot)
        {
            // Root bone attachment
            this.modelMatrix.setMatrix(this.attachedRoot.modelMatrix);
            this.modelMatrix.multiply(
                this.attachedRoot.bonesMatrices[this.attachedRootBone]
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

        // Render skeletal mesh
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.skeletalShader.bind();

            // Send high quality shader uniforms
            this.skeletalShader.sendModelVecmat(this.vecmat);
            this.skeletalShader.sendUniform(
                this.bonesCountUniform, this.bonesCount
            );
            this.skeletalShader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.skeletalShader.sendUniform(this.alphaUniform, this.alpha);

            // Bind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            if (this.normalMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
                this.normalMap.bind();
            }
            if (this.specularMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
                this.specularMap.bind();
            }
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D, this.bonesTexture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShader, quality);
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
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality
            this.skeletalShaderMedium.bind();

            // Send medium quality shader uniforms
            this.skeletalShaderMedium.sendModelVecmat(this.vecmat);
            this.skeletalShaderMedium.sendUniform(
                this.bonesCountUniformMedium, this.bonesCount
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
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D, this.bonesTexture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShaderMedium, quality);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
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
            this.skeletalShaderLow.sendModelVecmat(this.vecmat);
            this.skeletalShaderLow.sendUniform(
                this.bonesCountUniformLow, this.bonesCount
            );
            this.skeletalShaderLow.sendUniform(
                this.alphaUniformLow, this.alpha
            );

            // Bind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D, this.bonesTexture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.skeletalShaderLow, quality);
            this.vertexBuffer.unbind();

            // Unbind textures
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind low skeletal mesh shader
            this.skeletalShaderLow.unbind();
        }
    }
};
