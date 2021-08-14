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
//      interface/guiscrollbar.js : GUI ScrollBar management                  //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GuiScrollBar class definition                                             //
//  param renderer : Renderer pointer                                         //
//  param scrollBarShader : ScrollBar shader pointer                          //
////////////////////////////////////////////////////////////////////////////////
function GuiScrollBar(renderer, scrollBarShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // ScrollBar shader pointer
    this.scrollBarShader = scrollBarShader;

    // ScrollBar shader uniforms locations
    this.alphaUniform = null;
    this.uvSizeUniform = null;
    this.uvFactorUniform = null;

    // ScrollBar texture
    this.texture = null;
    // ScrollBar model matrix
    this.modelMatrix = new Matrix4x4();

    // ScrollBar position
    this.position = new Vector2(0.0, 0.0);
    // ScrollBar size
    this.size = new Vector2(1.0, 1.0);
    // ScrollBar texture UV size
    this.uvSize = new Vector2(1.0, 1.0);
    // ScrollBar texture UV factor
    this.uvFactor = 1.0;
    // ScrollBar alpha
    this.alpha = 1.0;

    // ScrollBar pressed state
    this.scrollBarPressed = false;
    // ScrollBar offset
    this.offset = 0.0;
    // ScrollBar height
    this.height = 1.0;
}

GuiScrollBar.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI ScrollBar                                             //
    //  param texture : Texture pointer                                       //
    //  param width : ScrollBar width                                         //
    //  param height : ScrollBar height                                       //
    //  param factor : ScrollBar UV factor                                    //
    //  return : True if GUI ScrollBar is successfully loaded                 //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, factor)
    {
        // Reset scrollbar
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
        this.scrollBarPressed = false;
        this.offset = 0.0;
        this.height = 1.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check scrollbar shader pointer
        if (!this.scrollBarShader) return false;

        // Get scrollbar shader uniforms locations
        this.scrollBarShader.bind();
        this.alphaUniform = this.scrollBarShader.getUniform("alpha");
        if (!this.alphaUniform) return false;
        this.uvSizeUniform = this.scrollBarShader.getUniform("uvSize");
        if (!this.uvSizeUniform) return false;
        this.uvFactorUniform = this.scrollBarShader.getUniform("uvFactor");
        if (!this.uvFactorUniform) return false;
        this.scrollBarShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // GUI ScrollBar successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set scrollbar position                                  //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set scrollbar position from a 2 components vector   //
    //  param vector : 2 components vector to set scrollbar position from     //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set scrollbar X position                                       //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set scrollbar Y position                                       //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate scrollbar                                            //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate scrollbar by a 2 components vector               //
    //  param vector : 2 components vector to translate scrollbar by          //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate scrollbar on X axis                                 //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate scrollbar on Y axis                                 //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set scrollbar size                                          //
    //  param width : ScrollBar width to set                                  //
    //  param height : ScrollBar height to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set scrollbar size from a 2 components vector           //
    //  param vector : 2 components vector to set scrollbar size from         //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set scrollbar width                                        //
    //  param width : ScrollBar width to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set scrollbar height                                      //
    //  param height : ScrollBar height to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set scrollbar alpha                                        //
    //  param alpha : ScrollBar alpha to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFactor : Set scrollbar factor                                      //
    //  param factor : Scrollbar factor to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setFactor: function(factor)
    {
        this.uvFactor = factor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setScrollHeight : Set scrollbar scrollable height percentage          //
    //  param height : ScrollBar scrollable height percentage                 //
    ////////////////////////////////////////////////////////////////////////////
    setScrollHeight: function(height)
    {
        if (height <= 0.0) height = 0.0;
        if (height >= 1.0) height = 1.0;
        this.height = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setScrollOffset : Set scrollbar scrollable offset percentage          //
    //  param offset : ScrollBar scrollable offset percentage                 //
    ////////////////////////////////////////////////////////////////////////////
    setScrollOffset: function(offset)
    {
        if (offset <= 0.0) offset = 0.0;
        if (offset >= 1.0) offset = 1.0;
        this.offset = offset;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mousePress : Handle mouse press event                                 //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the scrollbar offset has been updated                //
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            if ((this.size.vec[1]*(1.0-this.height)) > 0.0)
            {
                this.offset = ((this.position.vec[1]+
                    (this.size.vec[1]*(1.0-(this.height*0.5))))-mouseY)/
                    (this.size.vec[1]*(1.0-this.height));
            }
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= 1.0) this.offset = 1.0;
            this.scrollBarPressed = true;
            return true;
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the scrollbar is picking                             //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        this.scrollBarPressed = false;
        return this.isPicking(mouseX, mouseY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the scrollbar offset has been updated                //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        if (this.scrollBarPressed)
        {
            if ((this.size.vec[1]*(1.0-this.height)) > 0.0)
            {
                this.offset = ((this.position.vec[1]+
                    (this.size.vec[1]*(1.0-(this.height*0.5))))-mouseY)/
                    (this.size.vec[1]*(1.0-this.height));
            }
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= 1.0) this.offset = 1.0;
            return true;
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPicking : Get scrollbar picking state                               //
    //  return : True if the scrollbar is picking                             //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // ScrollBar is picking
            return true;
        }

        // ScrollBar is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get scrollbar X position                                       //
    //  return : ScrollBar X position                                         //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get scrollbar Y position                                       //
    //  return : ScrollBar Y position                                         //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get scrollbar width                                        //
    //  return : ScrollBar width                                              //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get scrollbar height                                      //
    //  return : ScrollBar height                                             //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get scrollbar alpha                                        //
    //  return : ScrollBar alpha                                              //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFactor : Get scrollbar factor                                      //
    //  return : Scrollbar factor                                             //
    ////////////////////////////////////////////////////////////////////////////
    getFactor: function()
    {
        return this.uvFactor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getScrollHeight : Get scrollbar scrollable height percentage          //
    //  return : ScrollBar scrollable height percentage                       //
    ////////////////////////////////////////////////////////////////////////////
    getScrollHeight: function(height)
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getScrollOffset : Get scrollbar scrollable offset percentage          //
    //  return : ScrollBar scrollable offset percentage                       //
    ////////////////////////////////////////////////////////////////////////////
    getScrollOffset: function(offset)
    {
        return this.offset;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render scrollbar                                             //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set scrollbar model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scaleVec2(this.size);

        // Bind scrollbar shader
        this.scrollBarShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.scrollBarShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.uvSize.vec[0] = 0.0;
        this.uvSize.vec[1] = this.size.vec[1];
        this.scrollBarShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);
        this.scrollBarShader.sendUniform(this.uvFactorUniform, this.uvFactor);
        this.scrollBarShader.sendUniform(this.alphaUniform, this.alpha);

        // Bind texture
        this.texture.bind();

        // Bind VBO
        this.renderer.vertexBuffer.bind();

        // Render scrollbar background
        this.renderer.vertexBuffer.render(this.scrollBarShader);

        // Recompute matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translate(
            this.position.vec[0],
            this.position.vec[1]+((1.0-this.offset)*
            this.size.vec[1]*(1.0-this.height)), 0.0
        );
        this.modelMatrix.scale(
            this.size.vec[0], this.size.vec[1]*this.height, 1.0
        );
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Render scrollbar
        this.uvSize.vec[0] = 0.5;
        this.uvSize.vec[1] = this.size.vec[1]*this.height;
        this.scrollBarShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.scrollBarShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);
        this.renderer.vertexBuffer.render(this.scrollBarShader);

        // Unbind VBO
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind scrollbar shader
        this.scrollBarShader.unbind();
    }
};
