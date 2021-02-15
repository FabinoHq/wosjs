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
////////////////////////////////////////////////////////////////////////////////
function SkeletalMesh(renderer, skeletalShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Skeletal mesh shader pointer
    this.skeletalShader = skeletalShader;

    // Skeletal mesh shader uniforms locations
    this.bonesMatricesLocation = -1;
    this.bonesCountUniform = -1;
    this.alphaUniform = -1;

    // Skeletal mesh vertex buffer
    this.vertexBuffer = null;

    // Skeletal mesh texture
    this.texture = null;
    // Skeletal mesh model matrix
    this.modelMatrix = null;

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
    this.position = null;
    // Skeletal mesh size
    this.size = null;
    // Skeletal mesh rotation angles
    this.angles = null;
    // Skeletal mesh alpha
    this.alpha = 1.0;
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
        this.bonesMatricesLocation = -1;
        this.bonesCountUniform = -1;
        this.alphaUniform = -1;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.bonesTexture = null;
        this.position = new Vector3(0.0, 0.0, 0.0);
        this.size = new Vector3(1.0, 1.0, 1.0);
        this.angles = new Vector3(0.0, 0.0, 0.0);
        this.alpha = 1.0;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check skeletal mesh shader pointer
        if (!this.skeletalShader) return false;

        // Get skeletal mesh shader uniforms locations
        this.skeletalShader.bind();
        this.bonesMatricesLocation = this.skeletalShader.getUniform(
            "bonesMatrices"
        );
        this.skeletalShader.sendIntUniform(this.bonesMatricesLocation, 1);
        this.alphaUniform = this.skeletalShader.getUniform("alpha");
        this.bonesCountUniform = this.skeletalShader.getUniform("bonesCount");
        this.skeletalShader.unbind();

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

        // Create model matrix
        this.modelMatrix = new Matrix4x4();

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
    //  setSize : Set skeletal mesh size                                      //
    //  param width : Skeletal mesh width to set                              //
    //  param height : Skeletal mesh height to set                            //
    //  param depth : Skeletal mesh depth to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height, depth)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
        this.size.vec[2] = depth;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec3 : Set skeletal mesh size from a 3 components vector       //
    //  param vector : 3 components vector to set skeletal mesh size from     //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec3: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
        this.size.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set skeletal mesh width                                    //
    //  param width : Skeletal mesh width to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set skeletal mesh height                                  //
    //  param height : Skeletal mesh height to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDepth : Set skeletal mesh depth                                    //
    //  param depth : Skeletal mesh depth to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setDepth: function(depth)
    {
        this.size.vec[2] = depth;
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
    //  getWidth : Get skeletal mesh width                                    //
    //  return : Skeletal mesh width                                          //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get skeletal mesh height                                  //
    //  return : Skeletal mesh height                                         //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get skeletal mesh depth                                   //
    //  return : Skeletal mesh depth                                          //
    ////////////////////////////////////////////////////////////////////////////
    getDepth: function()
    {
        return this.size.vec[2];
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
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set skeletal mesh model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec3(this.position);
        this.modelMatrix.rotateVec3(this.angles);
        this.modelMatrix.scaleVec3(this.size);

        // Bind skeletal mesh shader
        this.skeletalShader.bind();

        // Send shader uniforms
        this.skeletalShader.sendProjectionMatrix(
            this.renderer.camera.projMatrix
        );
        this.skeletalShader.sendViewMatrix(this.renderer.camera.viewMatrix);
        this.skeletalShader.sendModelMatrix(this.modelMatrix);
        this.skeletalShader.sendUniform(this.alphaUniform, this.alpha);
        this.skeletalShader.sendUniform(
            this.bonesCountUniform, this.bonesCount
        );

        // Bind texture
        this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
        this.texture.bind();
        this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.bonesTexture
        );

        // Render VBO
        this.vertexBuffer.bind();
        this.vertexBuffer.render(this.skeletalShader);
        this.vertexBuffer.unbind();

        // Unbind texture
        this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
        this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
        this.texture.unbind();

        // Unbind skeletal mesh shader
        this.skeletalShader.unbind();
    }
};
