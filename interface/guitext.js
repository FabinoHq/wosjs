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
//      interface/guitext.js : GUI Text management                            //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default hidden pass character (unicode dot)                               //
////////////////////////////////////////////////////////////////////////////////
const HiddenTextPassCharacter = "\u2022";

////////////////////////////////////////////////////////////////////////////////
//  Default font settings                                                     //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultFontCharsizeFactor = 0.00098;
const WOSDefaultFontScaleXFactor = 1024.0;
const WOSDefaultFontScaleYFactor = 1024.0;
const WOSDefaultFontSizeFactor = 800.0;
const WOSDefaultMinFontSize = 12.0;
const WOSDefaultMaxFontSize = 400.0;
const WOSDefaultMinTextWidth = 0.001;
const WOSDefaultMaxTextWidth = 3.98;
const WOSDefaultMinTextHeight = 0.015;
const WOSDefaultMaxTextHeight = 0.5;


////////////////////////////////////////////////////////////////////////////////
//  GuiText class definition                                                  //
//  param renderer : Renderer pointer                                         //
//  param textShader : Text shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function GuiText(renderer, textShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Text shader pointer
    this.textShader = textShader;

    // Text shader uniforms locations
    this.colorUniform = -1;
    this.alphaUniform = -1;

    // GuiText generated texture
    this.texture = null;
    // GuiText model matrix
    this.modelMatrix = null;

    // GuiText position
    this.position = null;
    // GuiText size
    this.size = null;
    // GuiText rotation angle
    this.angle = 0.0;
    // GuiText color
    this.color = null;
    // GuiText alpha
    this.alpha = 1.0;

    // GuiText internal string
    this.text = "";
    this.textLength = 0;
    this.fontsize = 40.0;

    // Characters sizes array
    this.charsizes = null;

    // Hidden text mode
    this.hidden = false;
    this.hidetext = "";
}

GuiText.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI Text                                                  //
    //  param text : Text to set                                              //
    //  param height : Text field height                                      //
    //  param hide : Text hide mode                                           //
    ////////////////////////////////////////////////////////////////////////////
    init: function(text, height, hide)
    {
        var i = 0;
        var pixelsData = null;
        var pixelsDataWidth = 0;
        var pixelsDataHeight = 0;

        // Reset GuiText
        this.colorUniform = -1;
        this.alphaUniform = -1;
        this.texture = null;
        this.modelMatrix = null;
        this.position = new Vector2(0.0, 0.0);
        this.angle = 0.0;
        this.size = new Vector2(0.05, 0.05);
        this.color = new Vector3(1.0, 1.0, 1.0);
        this.alpha = 1.0;
        this.text = "";
        this.textLength = 0;
        this.fontsize = 40.0;
        this.charsizes = null;
        this.hidden = false;
        this.hidetext = "";

        // Set hidden mode
        if (hide !== undefined) this.hidden = hide;

        // Set text
        this.text = "";
        this.textLength = 0;
        if (text !== undefined)
        {
            this.textLength = text.length;
            if (this.hidden)
            {
                this.hidetext = text;
                for (i = 0; i < this.textLength; ++i)
                {
                    this.text += HiddenTextPassCharacter;
                }
            }
            else
            {
                this.hidetext = "";
                this.text = text;
            }
        }

        // Set text field height
        if (height !== undefined) this.size.vec[1] = height;
        if (this.size.vec[1] <= WOSDefaultMinTextHeight)
            this.size.vec[1] = WOSDefaultMinTextHeight;
        if (this.size.vec[1] >= WOSDefaultMaxTextHeight)
            this.size.vec[1] = WOSDefaultMaxTextHeight;

        // Set font size based on text field height
        this.fontsize = this.size.vec[1]*WOSDefaultFontSizeFactor;
        if (this.fontsize <= WOSDefaultMinFontSize)
            this.fontsize = WOSDefaultMinFontSize;
        if (this.fontsize >= WOSDefaultMaxFontSize)
            this.fontsize = WOSDefaultMaxFontSize;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check text shader pointer
        if (!this.textShader) return false;

        // Get text shader uniforms locations
        this.textShader.bind();
        this.colorUniform = this.textShader.getUniform("color");
        this.alphaUniform = this.textShader.getUniform("alpha");
        this.textShader.unbind();

        // Set text width
        this.size.vec[0] = this.renderer.getTextWidth(
            this.text, this.fontsize
        )*WOSDefaultFontCharsizeFactor;

        // Clamp text width
        if (this.size.vec[0] <= WOSDefaultMinTextWidth)
            this.size.vec[0] = WOSDefaultMinTextWidth;
        if (this.size.vec[0] >= WOSDefaultMaxTextWidth)
            this.size.vec[0] = WOSDefaultMaxTextWidth;

        // Get char sizes
        this.charsizes = new Array();
        for (i = 0; i <= this.textLength; ++i)
        {
            this.charsizes[i] = this.renderer.getTextWidth(
                this.text.substring(0, i), this.fontsize
            )*WOSDefaultFontCharsizeFactor;
        }

        // Update pixels data size
        pixelsDataWidth = Math.round(
            this.size.vec[0]*WOSDefaultFontScaleXFactor
        );
        pixelsDataHeight = Math.round(
            this.size.vec[1]*WOSDefaultFontScaleYFactor
        );

        // Render text
        pixelsData = this.renderer.renderText(
            this.text, pixelsDataWidth, pixelsDataHeight, this.fontsize
        );

        // Create texture
        this.texture = this.renderer.gl.createTexture();
        if (!this.texture) return false;
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            pixelsDataWidth, pixelsDataHeight, 0,
            this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, pixelsData
        );

        // Set texture wrap mode
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

        // Set texture min and mag filters
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MIN_FILTER,
            this.renderer.gl.LINEAR
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MAG_FILTER,
            this.renderer.gl.LINEAR
        );

        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Create model matrix
        this.modelMatrix = new Matrix4x4();
        if (!this.modelMatrix) return false;

        // Text loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set text position                                       //
    //  param x : Text X position                                             //
    //  param y : Text Y position                                             //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set text position from a 2 components vector        //
    //  param vector : 2 components vector to set text position from          //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set text X position                                            //
    //  param x : Text X position                                             //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set text Y position                                            //
    //  param y : Text Y position                                             //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate text                                                 //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate text by a 2 components vector                    //
    //  param vector : 2 components vector to translate text by               //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate text on X axis                                      //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate text on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set text height                                           //
    //  param height : Text height to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        // Set text field height
        this.size.vec[1] = height;
        if (this.size.vec[1] <= WOSDefaultMinTextHeight)
            this.size.vec[1] = WOSDefaultMinTextHeight;
        if (this.size.vec[1] >= WOSDefaultMaxTextHeight)
            this.size.vec[1] = WOSDefaultMaxTextHeight;

        // Set font size based on text field height
        this.fontsize = this.size.vec[1]*WOSDefaultFontSizeFactor;
        if (this.fontsize <= WOSDefaultMinFontSize)
            this.fontsize = WOSDefaultMinFontSize;
        if (this.fontsize >= WOSDefaultMaxFontSize)
            this.fontsize = WOSDefaultMaxFontSize;

        // Update text
        this.setText(this.getText());
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set text rotation angle                                    //
    //  param angle : Text rotation angle to set in degrees                   //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate text                                                  //
    //  param angle : Angle to rotate text by in degrees                      //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
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
    //  setAlpha : Set text alpha                                             //
    //  param alpha : Text alpha to set                                       //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set GuiText internal text string                            //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
    setText: function(text)
    {
        var pixelsData = null;
        var pixelsDataWidth = 0;
        var pixelsDataHeight = 0;

        // Set text
        this.text = "";
        this.textLength = 0;
        if (text)
        {
            this.textLength = text.length;
            if (this.hidden)
            {
                this.hidetext = text;
                for (i = 0; i < this.textLength; ++i)
                {
                    this.text += HiddenTextPassCharacter;
                }
            }
            else
            {
                this.hidetext = "";
                this.text = text;
            }
        }

        // Set text width
        this.size.vec[0] = this.renderer.getTextWidth(
            this.text, this.fontsize
        )*WOSDefaultFontCharsizeFactor;

        // Clamp text width
        if (this.size.vec[0] <= WOSDefaultMinTextWidth)
            this.size.vec[0] = WOSDefaultMinTextWidth;
        if (this.size.vec[0] >= WOSDefaultMaxTextWidth)
            this.size.vec[0] = WOSDefaultMaxTextWidth;

        // Get char sizes
        this.charsizes = new Array();
        for (i = 0; i <= this.textLength; ++i)
        {
            this.charsizes[i] = this.renderer.getTextWidth(
                this.text.substring(0, i), this.fontsize
            )*WOSDefaultFontCharsizeFactor;
        }

        // Update pixels data size
        pixelsDataWidth = Math.round(
            this.size.vec[0]*WOSDefaultFontScaleXFactor
        );
        pixelsDataHeight = Math.round(
            this.size.vec[1]*WOSDefaultFontScaleYFactor
        );

        // Render text
        pixelsData = this.renderer.renderText(
            this.text, pixelsDataWidth, pixelsDataHeight, this.fontsize
        );

        // Update texture data
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            pixelsDataWidth, pixelsDataHeight, 0,
            this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, pixelsData
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addCharacter : Add character to text at given index                   //
    //  param index : Index to add character at                               //
    //  param character : Character to add at specified index                 //
    ////////////////////////////////////////////////////////////////////////////
    addCharacter: function(index, character)
    {
        // Clamp index into text length range
        if (index <= 0) index = 0;
        if (index >= this.textLength) index = this.textLength;

        // Insert character
        this.setText(
            this.text.substring(0, index) + character +
            this.text.substring(index, this.textLength)
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  eraseCharacter : Erase text character at given index                  //
    //  param index : Index to erase character at                             //
    ////////////////////////////////////////////////////////////////////////////
    eraseCharacter: function(index)
    {
        if (this.textLength > 0)
        {
            // Clamp index into text length range
            if (index <= 1) index = 1;
            if (index >= this.textLength) index = this.textLength;

            // Erase character
            this.setText(
                this.text.substring(0, index-1) +
                this.text.substring(index, this.textLength)
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  eraseSelection : Erase text characters between start and end indexes  //
    //  param start : Start index to erase characters from                    //
    //  param end : Start index to erase characters to                        //
    ////////////////////////////////////////////////////////////////////////////
    eraseSelection: function(start, end)
    {
        var selStart = 0;
        var selEnd = 0;

        // Check indexes ordering
        if (start == end)
        {
            // Nothing to erase
            return;
        }
        else if (start < end)
        {
            // Normal indexes order
            selStart = start;
            selEnd = end;
        }
        else
        {
            // Inverted indexes order
            selStart = end;
            selEnd = start;
        }

        // Clamp indexes into text length range
        if (selStart <= 0) selStart = 0;
        if (selStart >= this.textLength) selStart = this.textLength;
        if (selEnd <= 0) selEnd = 0;
        if (selEnd >= this.textLength) selEnd = this.textLength;

        // Erase characters selection
        this.setText(
            this.text.substring(0, selStart) +
            this.text.substring(selEnd, this.textLength)
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHidden : Set text hidden mode                                      //
    //  param hidden : Text hidden mode to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setHidden: function(hidden)
    {
        var text = this.getText();
        this.hidden = hidden;
        this.setText(text);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get text X position                                            //
    //  return : Text X position                                              //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get text Y position                                            //
    //  return : Text Y position                                              //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get text width                                             //
    //  return : Text width                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get text height                                           //
    //  return : Text height                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get text rotation angle                                    //
    //  return : Text rotation angle in degrees                               //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get text alpha                                             //
    //  return : Text alpha                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getText : Get text internal string                                    //
    //  return : Text internal string                                         //
    ////////////////////////////////////////////////////////////////////////////
    getText: function()
    {
        if (this.hidden) return this.hidetext;
        return this.text;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCharPos : Get character position offset at given index             //
    //  param index : Index to get character position at                      //
    //  return : character position offset                                    //
    ////////////////////////////////////////////////////////////////////////////
    getCharPos: function(index)
    {
        // Clamp index into text length range
        if (index <= 0) index = 0;
        if (index >= this.textLength) index = this.textLength;

        // Return character size at given index
        return this.charsizes[index];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextWidth : Get text next width when a given character is inserted //
    //  param character : Character willing to be inserted                    //
    //  return : Text width when new character is inserted                    //
    ////////////////////////////////////////////////////////////////////////////
    getNextWidth: function(character)
    {
        // Get current text width
        var width = this.size.vec[0];

        // Add new character width
        if (this.hidden) character = HiddenTextPassCharacter;
        width += this.renderer.getTextWidth(character, this.fontsize)/
                    WOSDefaultFontScaleXFactor;

        // Return total width
        return width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getLength : Get text characters length                                //
    //  return : Text length                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getLength: function()
    {
        return this.textLength;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFontsize : Get text font size                                      //
    //  return : Text font size                                               //
    ////////////////////////////////////////////////////////////////////////////
    getFontsize: function()
    {
        return this.fontsize;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHidden : Get text hidden mode                                      //
    //  return : Text hidden mode                                             //
    ////////////////////////////////////////////////////////////////////////////
    getHidden: function()
    {
        return this.hidden;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render text                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set text model matrix
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

        // Bind text shader
        this.textShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setIdentity();
        this.renderer.worldMatrix.multiply(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.textShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.textShader.sendUniformVec3(this.colorUniform, this.color);
        this.textShader.sendUniform(this.alphaUniform, this.alpha);

        // Bind texture
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D,
            this.texture
        );

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.textShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Unbind text shader
        this.textShader.unbind();
    }
};
