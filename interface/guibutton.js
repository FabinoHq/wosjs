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
//      interface/guibutton.js : GUI Button management                        //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GuiButton class definition                                                //
//  param renderer : Renderer pointer                                         //
//  param buttonShader : Button shader pointer                                //
////////////////////////////////////////////////////////////////////////////////
function GuiButton(renderer, buttonShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Button shader pointer
    this.buttonShader = buttonShader;

    // Button shader uniforms locations
    this.alphaUniform = null;
    this.stateUniform = null;

    // Button texture
    this.texture = null;
    // Button model matrix
    this.modelMatrix = new Matrix4x4();

    // Button position
    this.position = new Vector2(0.0, 0.0);
    // Button size
    this.size = new Vector2(1.0, 1.0);
    // Button alpha
    this.alpha = 1.0;
    // Button state
    this.buttonState = 0;

    // Round button
    this.isRound = false;
}

GuiButton.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI Button                                                //
    //  param texture : Texture pointer                                       //
    //  param width : Button width                                            //
    //  param height : Button height                                          //
    //  param round : Round button                                            //
    //  return : True if GUI Button is successfully loaded                    //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, round)
    {
        // Reset button
        this.alphaUniform = null;
        this.stateUniform = null;
        this.texture = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.alpha = 1.0;
        this.buttonState = 0;
        this.isRound = false;
        if (round !== undefined) { if (round) this.isRound = true; }

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check button shader pointer
        if (!this.buttonShader) return false;

        // Get button shader uniforms locations
        this.buttonShader.bind();
        this.alphaUniform = this.buttonShader.getUniform("alpha");
        if (!this.alphaUniform) return false;
        this.stateUniform = this.buttonShader.getUniform("buttonState");
        if (!this.stateUniform) return false;
        this.buttonShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // GUI Button successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set button position                                     //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set button position from a 2 components vector      //
    //  param vector : 2 components vector to set button position from        //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set button X position                                          //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set button Y position                                          //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate button                                               //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate button by a 2 components vector                  //
    //  param vector : 2 components vector to translate button by             //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate button on X axis                                    //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate button on Y axis                                    //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set button size                                             //
    //  param width : Button width to set                                     //
    //  param height : Button height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set button size from a 2 components vector              //
    //  param vector : 2 components vector to set button size from            //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set button width                                           //
    //  param width : Button width to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set button height                                         //
    //  param height : Button height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set button alpha                                           //
    //  param alpha : Button alpha to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mousePress : Handle mouse press event                                 //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is pressed                                //
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            this.buttonState = 3;
            return true;
        }
        else
        {
            this.buttonState = 0;
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is released                               //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            if (this.buttonState == 3)
            {
                this.buttonState = 1;
                return true;
            }
            this.buttonState = 1;
        }
        else
        {
            this.buttonState = 0;
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is pressed                                //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            switch (this.buttonState)
            {
                case 2: case 3:
                    this.buttonState = 3;
                    return true;

                default:
                    this.buttonState = 1;
                    break;
            }
        }
        else
        {
            switch (this.buttonState)
            {
                case 2: case 3:
                    this.buttonState = 2;
                    return true;

                default:
                    this.buttonState = 0;
                    break;
            }
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPicking : Get button picking state                                  //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is picking                                //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            if (this.isRound)
            {
                var rayx = this.size.vec[0]*0.5;
                var rayy = this.size.vec[1]*0.5;
                var dx = (mouseX - (this.position.vec[0] + rayx));
                var dy = (mouseY - (this.position.vec[1] + rayy));
                if (((dx*dx)/(rayx*rayx) + (dy*dy)/(rayy*rayy)) < 1.0)
                {
                    // Button is picking
                    return true;
                }
            }
            else
            {
                // Button is picking
                return true;
            }
        }

        // Button is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get button X position                                          //
    //  return : Button X position                                            //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get button Y position                                          //
    //  return : Button Y position                                            //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get button width                                           //
    //  return : Button width                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get button height                                         //
    //  return : Button height                                                //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get button alpha                                           //
    //  return : Button alpha                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render button                                                //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set button model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scaleVec2(this.size);

        // Bind button shader
        this.buttonShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.buttonShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.buttonShader.sendUniform(this.alphaUniform, this.alpha);
        this.buttonShader.sendIntUniform(this.stateUniform, this.buttonState);

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.buttonShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind button shader
        this.buttonShader.unbind();
    }
};
