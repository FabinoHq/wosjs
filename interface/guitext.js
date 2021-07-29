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
//  Default text hidden pass character (unicode dot)                          //
////////////////////////////////////////////////////////////////////////////////
const HiddenTextPassCharacter = '\u2022';

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
const WOSDefaultMaxTextWidth = 1.98;
const WOSDefaultMinTextHeight = 0.025;
const WOSDefaultMaxTextHeight = 0.5;
const WOSDefaultTextYOffset = 0.9;


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
    this.modelMatrix = new Matrix4x4();

    // GuiText position
    this.position = new Vector2(0.0, 0.0);
    // GuiText size
    this.size = new Vector2(0.05, 0.05);
    // GuiText rotation angle
    this.angle = 0.0;
    // GuiText color
    this.color = new Vector3(1.0, 1.0, 1.0);
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

    // ASCII mode
    this.asciiMode = false;
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
        this.modelMatrix.setIdentity();
        this.position.reset();
        this.angle = 0.0;
        this.size.setXY(0.05, 0.05);
        this.color.setXYZ(1.0, 1.0, 1.0);
        this.alpha = 1.0;
        this.text = "";
        this.textLength = 0;
        this.fontsize = 40.0;
        this.charsizes = null;
        this.hidden = false;
        this.hidetext = "";
        this.asciiMode = false;

        // Set hidden mode
        if (hide !== undefined) this.hidden = hide;

        // Set text
        this.text = "";
        this.textLength = 0;
        if (text !== undefined)
        {
            this.textLength = text.length;
            if (this.asciiMode)
            {
                if (this.hidden)
                {
                    for (i = 0; i < this.textLength; ++i)
                    {
                        this.hidetext += this.convertASCII(text[i]);
                        this.text += HiddenPxTextPassCharacter;
                    }
                }
                else
                {
                    for (i = 0; i < this.textLength; ++i)
                    {
                        this.text += this.convertASCII(text[i]);
                    }
                }
            }
            else
            {
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
            )*WOSDefaultFontCharsizeFactor-
            (i*0.00001)-(i*this.fontsize*0.000001);
        }

        // Update pixels data size
        pixelsDataWidth = Math.round(
            this.size.vec[0]*WOSDefaultFontScaleXFactor
        );
        pixelsDataHeight = Math.round(
            this.size.vec[1]*WOSDefaultFontScaleYFactor
        );
        this.size.vec[0] = pixelsDataWidth/WOSDefaultFontScaleXFactor;
        this.size.vec[1] = pixelsDataHeight/WOSDefaultFontScaleYFactor;

        // Create texture
        this.texture = this.renderer.gl.createTexture();
        if (!this.texture) return false;
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.renderText(
            this.text, pixelsDataWidth, pixelsDataHeight, this.fontsize
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

        // Text loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setASCIImode : Set text ASCII mode                                    //
    //  param asciiMode : Text ASCII mode state                               //
    ////////////////////////////////////////////////////////////////////////////
    setASCIImode: function(asciiMode)
    {
        // Set ASCII mode
        this.asciiMode = asciiMode;

        // Update text
        this.setText(this.getText());
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
        this.hidetext = "";
        this.textLength = 0;
        if (text)
        {
            this.textLength = text.length;
            if (this.asciiMode)
            {
                if (this.hidden)
                {
                    for (i = 0; i < this.textLength; ++i)
                    {
                        this.hidetext += this.convertASCII(text[i]);
                        this.text += HiddenPxTextPassCharacter;
                    }
                }
                else
                {
                    for (i = 0; i < this.textLength; ++i)
                    {
                        this.text += this.convertASCII(text[i]);
                    }
                }
            }
            else
            {
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
            )*WOSDefaultFontCharsizeFactor-
            (i*0.00001)-(i*this.fontsize*0.000001);
        }

        // Update pixels data size
        pixelsDataWidth = Math.round(
            this.size.vec[0]*WOSDefaultFontScaleXFactor
        );
        pixelsDataHeight = Math.round(
            this.size.vec[1]*WOSDefaultFontScaleYFactor
        );
        this.size.vec[0] = pixelsDataWidth/WOSDefaultFontScaleXFactor;
        this.size.vec[1] = pixelsDataHeight/WOSDefaultFontScaleYFactor;

        // Update texture data
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.renderText(
            this.text, pixelsDataWidth, pixelsDataHeight, this.fontsize
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
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
    //  convertASCII : Convert character to ASCII                             //
    //  param character : Character to convert to ASCII                       //
    //  return : ASCII converted character                                    //
    ////////////////////////////////////////////////////////////////////////////
    convertASCII: function(character)
    {
        if (character == '\u00A1') return '!';
        if (character == '\u00B5') return 'u';
        if (character == '\u00BF') return '?';
        if (character == '\u00C0') return 'A';
        if (character == '\u00C1') return 'A';
        if (character == '\u00C2') return 'A';
        if (character == '\u00C3') return 'A';
        if (character == '\u00C4') return 'A';
        if (character == '\u00C5') return 'A';
        if (character == '\u00C7') return 'C';
        if (character == '\u00C8') return 'E';
        if (character == '\u00C9') return 'E';
        if (character == '\u00CA') return 'E';
        if (character == '\u00CB') return 'E';
        if (character == '\u00CC') return 'I';
        if (character == '\u00CD') return 'I';
        if (character == '\u00CE') return 'I';
        if (character == '\u00CF') return 'I';
        if (character == '\u00D1') return 'N';
        if (character == '\u00D2') return 'O';
        if (character == '\u00D3') return 'O';
        if (character == '\u00D4') return 'O';
        if (character == '\u00D5') return 'O';
        if (character == '\u00D6') return 'O';
        if (character == '\u00D7') return 'x';
        if (character == '\u00D8') return 'O';
        if (character == '\u00D9') return 'U';
        if (character == '\u00DA') return 'U';
        if (character == '\u00DB') return 'U';
        if (character == '\u00DC') return 'U';
        if (character == '\u00DD') return 'Y';
        if (character == '\u00E0') return 'a';
        if (character == '\u00E1') return 'a';
        if (character == '\u00E2') return 'a';
        if (character == '\u00E3') return 'a';
        if (character == '\u00E4') return 'a';
        if (character == '\u00E5') return 'a';
        if (character == '\u00E7') return 'c';
        if (character == '\u00E8') return 'e';
        if (character == '\u00E9') return 'e';
        if (character == '\u00EA') return 'e';
        if (character == '\u00EB') return 'e';
        if (character == '\u00EC') return 'i';
        if (character == '\u00ED') return 'i';
        if (character == '\u00EE') return 'i';
        if (character == '\u00EF') return 'i';
        if (character == '\u00F1') return 'n';
        if (character == '\u00F2') return 'o';
        if (character == '\u00F3') return 'o';
        if (character == '\u00F4') return 'o';
        if (character == '\u00F5') return 'o';
        if (character == '\u00F6') return 'o';
        if (character == '\u00F7') return '/';
        if (character == '\u00F8') return 'o';
        if (character == '\u00F9') return 'u';
        if (character == '\u00FA') return 'u';
        if (character == '\u00FB') return 'u';
        if (character == '\u00FC') return 'u';
        if (character == '\u00FD') return 'y';
        if (character == '\u00FF') return 'y';
        if (character.charCodeAt(0) < 32) return '';
        if (character.charCodeAt(0) > 126) return '?';
        return character;
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
    //  getChar : Get text character at given index                           //
    //  param index : Index to get text character at                          //
    //  return : Text character at given index                                //
    ////////////////////////////////////////////////////////////////////////////
    getChar: function(index)
    {
        // Clamp index into text length range
        if (index <= 0) index = 0;
        if (index >= this.textLength) index = this.textLength;

        if (this.hidden) return this.hidetext[index];
        return this.text[index];
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

        // Return next text width
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
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
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
