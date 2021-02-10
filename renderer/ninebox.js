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
//      renderer/ninebox.js : Ninebox management                              //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Ninebox class definition                                                  //
//  param renderer : Renderer pointer                                         //
//  param nineboxShader : Ninebox shader pointer                              //
////////////////////////////////////////////////////////////////////////////////
function Ninebox(renderer, nineboxShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Ninebox shader pointer
    this.nineboxShader = nineboxShader;

    // Ninebox shader uniforms locations
    this.alphaUniform = -1;
    this.uvSizeUniform = -1;
    this.uvFactorUniform = -1;

    // Ninebox texture
    this.texture = null;
    // Ninebox model matrix
    this.modelMatrix = null;

    // Ninebox position
    this.position = null;
    // Ninebox size
    this.size = null;
    // Ninebox rotation angle
    this.angle = 0.0;
    // Ninebox texture UV size
    this.uvSize = null;
    // Ninebox texture UV factor
    this.uvFactor = null;
    // Ninebox alpha
    this.alpha = 1.0;
}

Ninebox.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init ninebox                                                   //
    //  param texture : Texture pointer                                       //
    //  param width : Ninebox width                                           //
    //  param height : Ninebox height                                         //
    //  param factor : Ninebox factor                                         //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, factor)
    {
        // Reset ninebox
        this.alphaUniform = -1;
        this.uvSizeUniform = -1;
        this.uvFactorUniform = -1;
        this.texture = null;
        this.modelMatrix = null;
        this.position = new Vector2(0.0, 0.0);
        this.size = new Vector2(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angle = 0.0;
        this.uvSize = new Vector2(1.0, 1.0);
        this.uvFactor = 1.0;
        if (factor !== undefined) this.uvFactor = factor;
        this.alpha = 1.0;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check ninebox shader pointer
        if (!this.nineboxShader) return false;

        // Get ninebox shader uniforms locations
        this.nineboxShader.bind();
        this.alphaUniform = this.nineboxShader.getUniform("alpha");
        this.uvSizeUniform = this.nineboxShader.getUniform("uvSize");
        this.uvFactorUniform = this.nineboxShader.getUniform("uvFactor");
        this.nineboxShader.unbind();

        // Create model matrix
        this.modelMatrix = new Matrix4x4();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Ninebox loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set ninebox position                                    //
    //  param x : Ninebox X position                                          //
    //  param y : Ninebox Y position                                          //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set ninebox position from a 2 components vector     //
    //  param vector : 2 components vector to set ninebox position from       //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set ninebox X position                                         //
    //  param x : Ninebox X position                                          //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set ninebox Y position                                         //
    //  param y : Ninebox Y position                                          //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate ninebox                                              //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate ninebox by a 2 components vector                 //
    //  param vector : 2 components vector to translate ninebox by            //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate ninebox on X axis                                   //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate ninebox on Y axis                                   //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set ninebox size                                            //
    //  param width : Ninebox width to set                                    //
    //  param height : Ninebox height to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set ninebox size from a 2 components vector             //
    //  param vector : 2 components vector to set ninebox size from           //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set ninebox width                                          //
    //  param width : Ninebox width to set                                    //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set ninebox height                                        //
    //  param height : Ninebox height to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set ninebox rotation angle                                 //
    //  param angle : Ninebox rotation angle to set in degrees                //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate ninebox                                               //
    //  param angle : Angle to rotate ninebox by in degrees                   //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set ninebox alpha                                          //
    //  param alpha : Ninebox alpha to set                                    //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFactor : Set ninebox factor                                        //
    //  param factor : Ninebox factor to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setFactor: function(factor)
    {
        this.uvFactor = factor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get ninebox X position                                         //
    //  return : Ninebox X position                                           //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get ninebox Y position                                         //
    //  return : Ninebox Y position                                           //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get ninebox width                                          //
    //  return : Ninebox width                                                //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get ninebox height                                        //
    //  return : Ninebox height                                               //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get ninebox rotation angle                                 //
    //  return : Ninebox rotation angle in degrees                            //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get ninebox alpha                                          //
    //  return : Ninebox alpha                                                //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFactor : Get ninebox factor                                        //
    //  return : Ninebox factor                                               //
    ////////////////////////////////////////////////////////////////////////////
    getFactor: function()
    {
        return this.uvFactor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render ninebox                                               //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set ninebox model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.translate(
            this.size.vec[0]*0.5, this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.rotateZ(this.angle);
        this.modelMatrix.translate(
            -this.size.vec[0]*0.5, -this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.scaleVec2(this.size);

        // Bind ninebox shader
        this.nineboxShader.bind();

        // Send shader uniforms
        this.nineboxShader.sendProjectionMatrix(
            this.renderer.projMatrix
        );
        this.nineboxShader.sendViewMatrix(this.renderer.view.viewMatrix);
        this.nineboxShader.sendModelMatrix(this.modelMatrix);
        this.nineboxShader.sendUniform(this.alphaUniform, this.alpha);
        this.nineboxShader.sendUniformVec2(this.uvSizeUniform, this.size);
        this.nineboxShader.sendUniform(this.uvFactorUniform, this.uvFactor);

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.nineboxShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind ninebox shader
        this.nineboxShader.unbind();
    }
};
