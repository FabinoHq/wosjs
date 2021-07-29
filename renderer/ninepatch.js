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
//      renderer/ninepatch.js : Ninepatch management                          //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Ninepatch class definition                                                //
//  param renderer : Renderer pointer                                         //
//  param ninepatchShader : Ninepatch shader pointer                          //
////////////////////////////////////////////////////////////////////////////////
function Ninepatch(renderer, ninepatchShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Ninepatch shader pointer
    this.ninepatchShader = ninepatchShader;

    // Ninepatch shader uniforms locations
    this.alphaUniform = -1;
    this.uvSizeUniform = -1;
    this.uvFactorUniform = -1;

    // Ninepatch texture
    this.texture = null;
    // Ninepatch model matrix
    this.modelMatrix = new Matrix4x4();

    // Ninepatch position
    this.position = new Vector2(0.0, 0.0);
    // Ninepatch size
    this.size = new Vector2(1.0, 1.0);
    // Ninepatch texture UV factor
    this.uvFactor = 1.0;
    // Ninepatch alpha
    this.alpha = 1.0;
}

Ninepatch.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init ninepatch                                                 //
    //  param texture : Texture pointer                                       //
    //  param width : Ninepatch width                                         //
    //  param height : Ninepatch height                                       //
    //  param factor : Ninepatch UV factor                                    //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, factor)
    {
        // Reset ninepatch
        this.alphaUniform = -1;
        this.uvSizeUniform = -1;
        this.uvFactorUniform = -1;
        this.texture = null;
        this.modelMatrix.setIdentity();
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.uvFactor = 1.0;
        if (factor !== undefined) this.uvFactor = factor;
        this.alpha = 1.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check ninepatch shader pointer
        if (!this.ninepatchShader) return false;

        // Get ninepatch shader uniforms locations
        this.ninepatchShader.bind();
        this.uvSizeUniform = this.ninepatchShader.getUniform("uvSize");
        this.uvFactorUniform = this.ninepatchShader.getUniform("uvFactor");
        this.alphaUniform = this.ninepatchShader.getUniform("alpha");
        this.ninepatchShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Ninepatch loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set ninepatch position                                  //
    //  param x : Ninepatch X position                                        //
    //  param y : Ninepatch Y position                                        //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set ninepatch position from a 2 components vector   //
    //  param vector : 2 components vector to set ninepatch position from     //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set ninepatch X position                                       //
    //  param x : Ninepatch X position                                        //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set ninepatch Y position                                       //
    //  param y : Ninepatch Y position                                        //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate ninepatch                                            //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate ninepatch by a 2 components vector               //
    //  param vector : 2 components vector to translate ninepatch by          //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate ninepatch on X axis                                 //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate ninepatch on Y axis                                 //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set ninepatch size                                          //
    //  param width : Ninepatch width to set                                  //
    //  param height : Ninepatch height to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set ninepatch size from a 2 components vector           //
    //  param vector : 2 components vector to set ninepatch size from         //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set ninepatch width                                        //
    //  param width : Ninepatch width to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set ninepatch height                                      //
    //  param height : Ninepatch height to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set ninepatch alpha                                        //
    //  param alpha : Ninepatch alpha to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFactor : Set ninepatch factor                                      //
    //  param factor : Ninepatch factor to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setFactor: function(factor)
    {
        this.uvFactor = factor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get ninepatch X position                                       //
    //  return : Ninepatch X position                                         //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get ninepatch Y position                                       //
    //  return : Ninepatch Y position                                         //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get ninepatch width                                        //
    //  return : Ninepatch width                                              //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get ninepatch height                                      //
    //  return : Ninepatch height                                             //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get ninepatch alpha                                        //
    //  return : Ninepatch alpha                                              //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFactor : Get ninepatch factor                                      //
    //  return : Ninepatch factor                                             //
    ////////////////////////////////////////////////////////////////////////////
    getFactor: function()
    {
        return this.uvFactor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render ninepatch                                             //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set ninepatch model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scaleVec2(this.size);

        // Bind ninepatch shader
        this.ninepatchShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send ninepatch shader uniforms
        this.ninepatchShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.ninepatchShader.sendUniformVec2(this.uvSizeUniform, this.size);
        this.ninepatchShader.sendUniform(this.uvFactorUniform, this.uvFactor);
        this.ninepatchShader.sendUniform(this.alphaUniform, this.alpha);

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.ninepatchShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind ninepatch shader
        this.ninepatchShader.unbind();
    }
};
