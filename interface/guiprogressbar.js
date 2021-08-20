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
//      interface/guiprogressbar.js : GUI ProgressBar management              //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GuiProgressBar class definition                                           //
//  param renderer : Renderer pointer                                         //
//  param progressBarShader : ProgressBar shader pointer                      //
////////////////////////////////////////////////////////////////////////////////
function GuiProgressBar(renderer, progressBarShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // ProgressBar shader pointer
    this.progressBarShader = progressBarShader;

    // ProgressBar shader uniforms locations
    this.alphaUniform = null;
    this.uvSizeUniform = null;
    this.uvFactorUniform = null;

    // ProgressBar texture
    this.texture = null;
    // ProgressBar model matrix
    this.modelMatrix = new Matrix4x4();

    // ProgressBar position
    this.position = new Vector2(0.0, 0.0);
    // ProgressBar size
    this.size = new Vector2(1.0, 1.0);
    // ProgressBar texture UV size
    this.uvSize = new Vector2(1.0, 1.0);
    // ProgressBar texture UV factor
    this.uvFactor = 1.0;
    // ProgressBar alpha
    this.alpha = 1.0;

    // ProgressBar percentage value
    this.value = 0.0;

    // VecMat 4x4 model matrix
    this.vecmat = new VecMat4x4();
}

GuiProgressBar.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI ProgressBar                                           //
    //  param texture : Texture pointer                                       //
    //  param width : ProgressBar width                                       //
    //  param height : ProgressBar height                                     //
    //  param factor : ProgressBar UV factor                                  //
    //  return : True if GUI ProgressBar is successfully loaded               //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, factor)
    {
        // Reset progress bar
        this.alphaUniform = null;
        this.uvSizeUniform = null;
        this.uvFactorUniform = null;
        this.texture = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        if (!this.uvSize) return false;
        this.uvSize.setXY(1.0, 1.0);
        this.uvFactor = 1.0;
        if (factor !== undefined) this.uvFactor = factor;
        this.alpha = 1.0;
        this.value = 0.0;
        if (!this.vecmat) return false;
        this.vecmat.setIdentity();

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check progress bar shader pointer
        if (!this.progressBarShader) return false;

        // Get progress bar shader uniforms locations
        this.progressBarShader.bind();
        this.alphaUniform = this.progressBarShader.getUniform("alpha");
        if (!this.alphaUniform) return false;
        this.uvSizeUniform = this.progressBarShader.getUniform("uvSize");
        if (!this.uvSizeUniform) return false;
        this.uvFactorUniform = this.progressBarShader.getUniform("uvFactor");
        if (!this.uvFactorUniform) return false;
        this.progressBarShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // GUI ProgressBar successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set progress bar position                               //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set bar position from a 2 components vector         //
    //  param vector : 2 components vector to set progress bar position from  //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set progress bar X position                                    //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set progress bar Y position                                    //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate progress bar                                         //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate progress bar by a 2 components vector            //
    //  param vector : 2 components vector to translate progress bar by       //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate progress bar on X axis                              //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate progress bar on Y axis                              //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set progress bar size                                       //
    //  param width : ProgressBar width to set                                //
    //  param height : ProgressBar height to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set progress bar size from a 2 components vector        //
    //  param vector : 2 components vector to set progress bar size from      //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set progress bar width                                     //
    //  param width : ProgressBar width to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set progress bar height                                   //
    //  param height : ProgressBar height to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set progress bar alpha                                     //
    //  param alpha : ProgressBar alpha to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFactor : Set progress bar factor                                   //
    //  param factor : ProgressBar factor to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setFactor: function(factor)
    {
        this.uvFactor = factor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setValue : Set progress bar normalized percentage value               //
    //  param value : Normalized percentage value to set                      //
    ////////////////////////////////////////////////////////////////////////////
    setValue: function(value)
    {
        if (value <= 0.0) value = 0.0;
        if (value >= 1.0) value = 1.0;
        this.value = value;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get progress bar X position                                    //
    //  return : ProgressBar X position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get progress bar Y position                                    //
    //  return : ProgressBar Y position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get progress bar width                                     //
    //  return : ProgressBar width                                            //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get progress bar height                                   //
    //  return : ProgressBar height                                           //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get progress bar alpha                                     //
    //  return : ProgressBar alpha                                            //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFactor : Get progress bar factor                                   //
    //  return : ProgressBar factor                                           //
    ////////////////////////////////////////////////////////////////////////////
    getFactor: function()
    {
        return this.uvFactor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getValue : Get progress bar value                                     //
    //  return : ProgressBar value                                            //
    ////////////////////////////////////////////////////////////////////////////
    getValue: function()
    {
        return this.value;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render progress bar                                          //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set progress bar model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scaleVec2(this.size);
        this.vecmat.setMatrix(this.modelMatrix);

        // Bind progress bar shader
        this.progressBarShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);

        // Send shader uniforms
        this.progressBarShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.progressBarShader.sendModelVecmat(this.vecmat);
        this.uvSize.vec[0] = this.size.vec[0];
        this.uvSize.vec[1] = 0.0;
        this.progressBarShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);
        this.progressBarShader.sendUniform(this.uvFactorUniform, this.uvFactor);
        this.progressBarShader.sendUniform(this.alphaUniform, this.alpha);

        // Bind texture
        this.texture.bind();

        // Bind VBO
        this.renderer.vertexBuffer.bind();

        // Render progress bar background
        this.renderer.vertexBuffer.render(this.progressBarShader);

        // Recompute matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scale(
            this.size.vec[0]*this.value, this.size.vec[1], 1.0
        );
        this.vecmat.setMatrix(this.modelMatrix);

        // Render progress bar
        this.progressBarShader.sendModelVecmat(this.vecmat);
        this.uvSize.vec[0] = this.size.vec[0]*this.value;
        this.uvSize.vec[1] = 0.5;
        this.progressBarShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);
        this.renderer.vertexBuffer.render(this.progressBarShader);

        // Unbind VBO
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind progress bar shader
        this.progressBarShader.unbind();
    }
};
