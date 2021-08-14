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
//      interface/guitextbutton.js : GUI TextButton management                //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GuiTextButton class definition                                            //
//  param renderer : Renderer pointer                                         //
//  param buttonShader : TextButton shader pointer                            //
//  param textShader : Text shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function GuiTextButton(renderer, buttonShader, textShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // TextButton shader pointer
    this.buttonShader = buttonShader;

    // TextButton shader uniforms locations
    this.uvSizeUniform = null;
    this.uvFactorUniform = null;
    this.alphaUniform = null;
    this.stateUniform = null;

    // TextButton texture
    this.texture = null;
    // TextButton model matrix
    this.modelMatrix = new Matrix4x4();

    // TextButton text
    this.guitext = new GuiText(renderer, textShader);
    // TextButton height
    this.height = 0.1;
    // TextButton text offset
    this.offset = new Vector2(0.0, 0.0);
    // TextButton text color
    this.color = new Vector3(1.0, 1.0, 1.0);
    // TextButton text alpha
    this.textAlpha = 1.0;
    // TextButton text hover color
    this.hoverColor = new Vector3(1.0, 1.0, 1.0);
    // TextButton text hover alpha
    this.textHoverAlpha = 1.0;

    // TextButton position
    this.position = new Vector2(0.0, 0.0);
    // TextButton size
    this.size = new Vector2(1.0, 1.0);
    // TextButton texture UV factor
    this.uvFactor = 1.0;
    // TextButton alpha
    this.alpha = 1.0;
    // TextButton state
    this.buttonState = 0;
    // TextButton fixed size
    this.fixedSized = false;
}

GuiTextButton.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI TextButton                                            //
    //  param texture : Texture pointer                                       //
    //  param text : Text to set                                              //
    //  param height : TextButton height                                      //
    //  param factor : TextButton UV factor                                   //
    //  return : True if GUI TextButton is successfully loaded                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, text, height, factor)
    {
        // Reset text button
        this.uvSizeUniform = null;
        this.uvFactorUniform = null;
        this.alphaUniform = null;
        this.buttonStateUniform = null;
        this.texture = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        this.height = 0.1;
        if (!this.offset) return false;
        this.offset.reset();
        if (!this.color) return false;
        this.color.setXYZ(1.0, 1.0, 1.0);
        this.textAlpha = 1.0;
        if (!this.hoverColor) return false;
        this.hoverColor.setXYZ(1.0, 1.0, 1.0);
        this.textHoverAlpha = 1.0;
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        this.uvFactor = 1.0;
        if (factor !== undefined) this.uvFactor = factor;
        this.alpha = 1.0;
        this.buttonState = 0;
        this.fixedSized = false;

        // Set text button height
        if (height !== undefined) this.height = height;
        if (this.height <= WOSDefaultMinTextHeight)
            this.height = WOSDefaultMinTextHeight;
        if (this.height >= WOSDefaultMaxTextHeight)
            this.height = WOSDefaultMaxTextHeight;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check button shader pointer
        if (!this.buttonShader) return false;

        // Get button shader uniforms locations
        this.buttonShader.bind();
        this.uvSizeUniform = this.buttonShader.getUniform("uvSize");
        if (!this.uvSizeUniform) return false;
        this.uvFactorUniform = this.buttonShader.getUniform("uvFactor");
        if (!this.uvFactorUniform) return false;
        this.alphaUniform = this.buttonShader.getUniform("alpha");
        if (!this.alphaUniform) return false;
        this.stateUniform = this.buttonShader.getUniform("buttonState");
        if (!this.stateUniform) return false;
        this.buttonShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Set text
        if (!this.guitext) return false;
        if (!this.guitext.init(text, this.height, false)) return false;

        // Set text button size
        this.size.vec[0] = this.guitext.getWidth()+(this.height*0.5);
        this.size.vec[1] = this.height;

        // GUI TextButton successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextOffset : Set text button text offset                           //
    //  param x : X text offset to set                                        //
    //  param y : Y text offset to set                                        //
    ////////////////////////////////////////////////////////////////////////////
    setTextOffset: function(x, y)
    {
        this.offset.vec[0] = x;
        this.offset.vec[1] = y;

        // Set text button size
        if (this.fixedSize)
        {
            this.size.vec[0] = this.guitext.getWidth()+
                (this.height*0.5)+Math.abs(this.offset.vec[0]*2.0);
            this.size.vec[1] = this.height+Math.abs(this.offset.vec[1]*2.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextOffsetVec2 : Set text offset from a 2 components vector        //
    //  param vector : 2 components vector to set text offset from            //
    ////////////////////////////////////////////////////////////////////////////
    setTextOffsetVec2: function(vector)
    {
        this.offset.vec[0] = vector.vec[0];
        this.offset.vec[1] = vector.vec[1];

        // Set text button size
        if (this.fixedSize)
        {
            this.size.vec[0] = this.guitext.getWidth()+
                (this.height*0.5)+Math.abs(this.offset.vec[0]*2.0);
            this.size.vec[1] = this.height+Math.abs(this.offset.vec[1]*2.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextOffsetX : Set text button text X offset                        //
    //  param x : Text button text X offset to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setTextOffsetX: function(x)
    {
        this.offset.vec[0] = x;

        // Set text button width
        if (this.fixedSize)
        {
            this.size.vec[0] = this.guitext.getWidth()+
                (this.height*0.5)+Math.abs(this.offset.vec[0]*2.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextOffsetY : Set text button text Y offset                        //
    //  param y : Text button text Y offset to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setTextOffsetY: function(y)
    {
        this.offset.vec[1] = y;

        // Set text button height
        if (this.fixedSize)
        {
            this.size.vec[1] = this.height+Math.abs(this.offset.vec[1]*2.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set text button position                                //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set text button position from a 2 components vector //
    //  param vector : 2 components vector to set text button position from   //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set text button X position                                     //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set text button Y position                                     //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate text button                                          //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate text button by a 2 components vector             //
    //  param vector : 2 components vector to translate text button by        //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate text button on X axis                               //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate text button on Y axis                               //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setButtonSize : Set text button size                                  //
    //  param buttonWidth : TextButton width to set                           //
    //  param buttonHeight : TextButton height to set                         //
    ////////////////////////////////////////////////////////////////////////////
    setButtonSize: function(buttonWidth, buttonHeight)
    {
        if (this.fixedSize)
        {
            // Set fixed button size
            this.size.vec[0] = buttonWidth;
            this.size.vec[1] = buttonHeight;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setButtonSizeVec2 : Set text button size by a 2 components vector     //
    //  param size : 2 components vector to set button size                   //
    ////////////////////////////////////////////////////////////////////////////
    setButtonSizeVec2: function(size)
    {
        if (this.fixedSize)
        {
            // Set fixed button size
            this.size.vec[0] = size.vec[0];
            this.size.vec[1] = size.vec[1];
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setButtonWidth : Set text button width                                //
    //  param buttonWidth : TextButton width to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setButtonWidth: function(width)
    {
        if (this.fixedSize)
        {
            // Set fixed button width
            this.size.vec[0] = width;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setButtonHeight : Set text button height                              //
    //  param buttonHeight : TextButton height to set                         //
    ////////////////////////////////////////////////////////////////////////////
    setButtonHeight: function(height)
    {
        if (this.fixedSize)
        {
            // Set fixed button height
            this.size.vec[1] = height;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set text button height                                    //
    //  param height : TextButton height to set                               //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.height = height;
        if (this.height <= WOSDefaultMinTextHeight)
            this.height = WOSDefaultMinTextHeight;
        if (this.height >= WOSDefaultMaxTextHeight)
            tthis.height = WOSDefaultMaxTextHeight;

        // Update text height
        this.guitext.setHeight(this.height);

        // Set text button size
        if (this.fixedSize)
        {
            this.size.vec[0] = this.guitext.getWidth()+
                (this.height*0.5)+Math.abs(this.offset.vec[0]*2.0);
            this.size.vec[1] = this.height+Math.abs(this.offset.vec[1]*2.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColor : Set text color                                             //
    //  param r : Text red color channel to set                               //
    //  param g : Text blue color channel to set                              //
    //  param b : Text green color channel to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b)
    {
        this.color.vec[0] = r;
        this.color.vec[1] = g;
        this.color.vec[2] = b;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec3 : Set text color from a 3 component vector               //
    //  param color : 3 component vector to set text color from               //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec3: function(color)
    {
        this.color.vec[0] = color.vec[0];
        this.color.vec[1] = color.vec[1];
        this.color.vec[2] = color.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHoverColor : Set text hover color                                  //
    //  param r : Text red hover color channel to set                         //
    //  param g : Text blue hover color channel to set                        //
    //  param b : Text green hover color channel to set                       //
    ////////////////////////////////////////////////////////////////////////////
    setHoverColor: function(r, g, b)
    {
        this.hoverColor.vec[0] = r;
        this.hoverColor.vec[1] = g;
        this.hoverColor.vec[2] = b;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHoverColorVec3 : Set text hover color from a 3 component vector    //
    //  param color : 3 component vector to set text hover color from         //
    ////////////////////////////////////////////////////////////////////////////
    setHoverColorVec3: function(color)
    {
        this.hoverColor.vec[0] = color.vec[0];
        this.hoverColor.vec[1] = color.vec[1];
        this.hoverColor.vec[2] = color.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set text button alpha                                      //
    //  param alpha : TextButton alpha to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextAlpha : Set text alpha                                         //
    //  param alpha : TextButton text alpha to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setTextAlpha: function(textAlpha)
    {
        this.textAlpha = textAlpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextHoverAlpha : Set text hover alpha                              //
    //  param alpha : TextButton text hover alpha to set                      //
    ////////////////////////////////////////////////////////////////////////////
    setTextHoverAlpha: function(textHoverAlpha)
    {
        this.textHoverAlpha = textHoverAlpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set GuiTextButton internal text string                      //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
    setText: function(text)
    {
        this.guitext.setText(text);

        // Recompute button width
        if (!this.fixedSize)
        {
            this.size.vec[0] = this.guitext.getWidth()+
                (this.height*0.5)+Math.abs(this.offset.vec[0]*2.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFixedSize : Set text button fixed size                             //
    //  param fixedSize : TextButton fixed size mode                          //
    ////////////////////////////////////////////////////////////////////////////
    setFixedSize: function(fixedSize)
    {
        this.fixedSize = fixedSize;
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
    //  isPicking : Get text button picking state                             //
    //  return : True if the text button is picking                           //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // TextButton is picking
            return true;
        }

        // TextButton is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get text button X position                                     //
    //  return : TextButton X position                                        //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get text button Y position                                     //
    //  return : TextButton Y position                                        //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get text button width                                      //
    //  return : TextButton width                                             //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get text button height                                    //
    //  return : TextButton height                                            //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTextHeight : Get text height                                       //
    //  return : TextButton text height                                       //
    ////////////////////////////////////////////////////////////////////////////
    getTextHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get text button alpha                                      //
    //  return : TextButton alpha                                             //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render text button                                           //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set text button model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scaleVec2(this.size);

        // Bind text button shader
        this.buttonShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.buttonShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.buttonShader.sendUniformVec2(this.uvSizeUniform, this.size);
        this.buttonShader.sendUniform(this.uvFactorUniform, this.uvFactor);
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

        // Unbind text button shader
        this.buttonShader.unbind();

        // Render text
        this.guitext.setPosition(
            this.position.vec[0]+this.offset.vec[0]+
            (this.size.vec[0]*0.5)-(this.guitext.getWidth()*0.5),
            this.position.vec[1]+this.offset.vec[1]+
            (this.size.vec[1]*0.5)-(this.guitext.getHeight()*0.54)
        );
        if ((this.buttonState == 1) || (this.buttonState == 3))
        {
            this.guitext.setColorVec3(this.hoverColor);
            this.guitext.setAlpha(this.textHoverAlpha);
        }
        else
        {
            this.guitext.setColorVec3(this.color);
            this.guitext.setAlpha(this.textAlpha);
        }
        this.guitext.render();
    }
};
