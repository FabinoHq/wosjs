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

    // Skeletal mesh vertex buffer
    this.vertexBuffer = null;

    // Skeletal mesh texture
    this.texture = null;
    // Skeletal mesh model matrix
    this.modelMatrix = null;

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
        // Reset skeletal mesh
        this.texture = null;
        this.modelMatrix = null;
        this.position = new Vector3(0.0, 0.0, 0.0);
        this.size = new Vector3(1.0, 1.0, 1.0);
        this.angles = new Vector3(0.0, 0.0, 0.0);
        this.alpha = 1.0;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check skeletal mesh shader pointer
        if (!this.skeletalShader) return false;

        // Check model pointer
        if (!model) return false;

        // Check texture pointer
        if (!texture) return false;

        // Init vertex buffer
        this.vertexBuffer = new VertexBuffer(this.renderer.gl);
        if ((model.facesCount > 0) && model.vertices &&
            model.texCoords && model.indices)
        {
            if (!this.vertexBuffer.init(model.facesCount, model.vertices,
                model.texCoords, model.indices))
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
    //  render : Render skeletal mesh                                         //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set skeletal mesh model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec3(this.position);
        this.modelMatrix.rotateX(this.angles.vec[0]);
        this.modelMatrix.rotateY(this.angles.vec[1]);
        this.modelMatrix.rotateZ(this.angles.vec[2]);
        this.modelMatrix.scaleVec3(this.size);

        // Bind skeletal mesh shader
        this.skeletalShader.shader.bind();

        // Send shader uniforms
        this.skeletalShader.shader.sendProjectionMatrix(
            this.renderer.camera.projMatrix
        );
        this.skeletalShader.shader.sendViewMatrix(
            this.renderer.camera.viewMatrix
        );
        this.skeletalShader.shader.sendModelMatrix(this.modelMatrix);
        this.skeletalShader.shader.sendUniform(
            this.skeletalShader.alphaUniform, this.alpha
        );

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.vertexBuffer.bind();
        this.vertexBuffer.render(this.skeletalShader.shader);
        this.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind skeletal mesh shader
        this.skeletalShader.shader.unbind();
    }
};
