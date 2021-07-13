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
//      interface/guipxtext.js : GUI Pixel text (distance field) management   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default pixel text hidden pass character                                  //
////////////////////////////////////////////////////////////////////////////////
const HiddenPxTextPassCharacter = '#';

////////////////////////////////////////////////////////////////////////////////
//  Default pixel font settings                                               //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultMinPxTextWidth = 0.001;
const WOSDefaultMaxPxTextWidth = 3.98;
const WOSDefaultMinPxTextHeight = 0.025;
const WOSDefaultMaxPxTextHeight = 0.2;
const WOSDefaultPxTextUVWidth = 0.0625;
const WOSDefaultPxTextUVHeight = 0.125;
const WOSDefaultPxTextXOffset = 0.44;
const WOSDefaultPxTextYOffset = 0.92;
const WOSDefaultPxTextScaleXFactor = 580.0;
const WOSDefaultPxTextScaleYFactor = 580.0;


////////////////////////////////////////////////////////////////////////////////
//  GuiText class definition                                                  //
//  param renderer : Renderer pointer                                         //
//  param textShader : Text shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function GuiPxText(renderer, textShader, lineShader)
{
    // Renderer pointer
    this.renderer = renderer;
    // Background renderer
    this.backrenderer = null;

    // Text shader pointer
    this.textShader = textShader;
    // Line shader pointer
    this.lineShader = lineShader;

    // Text shader uniforms locations
    this.colorUniform = -1;
    this.alphaUniform = -1;
    this.smoothUniform = -1;
    this.uvSizeUniform = -1;
    this.uvOffsetUniform = -1;

    // GuiPxText glyphs texture
    this.texture = null;
    // GuiPxText line need update
    this.needUpdate = false;
    // GuiPxText model matrix
    this.modelMatrix = new Matrix4x4();

    // GuiPxText position
    this.position = new Vector2(0.0, 0.0);
    // GuiPxText size
    this.size = new Vector2(0.05, 0.05);
    // GuiPxText rotation angle
    this.angle = 0.0;
    // GuiPxText color
    this.color = new Vector3(1.0, 1.0, 1.0);
    // GuiPxText alpha
    this.alpha = 1.0;
    // GuiPxText smooth value
    this.smooth = 0.1;
    // GuiPxText UV size
    this.uvSize = new Vector2(1.0, 1.0);
    // GuiPxText UV offset
    this.uvOffset = new Vector2(0.0, 0.0);

    // GuiPxText internal string
    this.text = "";
    this.textLength = 0;

    // Characters size
    this.charsize = new Vector2(1.0, 1.0);

    // Hidden text mode
    this.hidden = false;
    this.hidetext = "";
}

GuiPxText.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI PxText                                                //
    //  param texture : Texture pointer                                       //
    //  param text : Text to set                                              //
    //  param height : Text field height                                      //
    //  param hide : Text hide mode                                           //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, text, height, hide)
    {
        var i = 0;

        // Reset GuiText
        this.backrenderer = null;
        this.colorUniform = -1;
        this.alphaUniform = -1;
        this.smoothUniform = -1;
        this.uvSizeUniform = -1;
        this.uvOffsetUniform = -1;
        this.texture = null;
        this.needUpdate = false;
        this.modelMatrix.setIdentity();
        this.position.reset();
        this.angle = 0.0;
        this.size.setXY(1.0, 1.0);
        this.color.setXYZ(1.0, 1.0, 1.0);
        this.uvSize.setXY(WOSDefaultPxTextUVWidth, WOSDefaultPxTextUVHeight);
        this.uvOffset.reset();
        this.alpha = 1.0;
        this.smooth = 0.1;
        this.text = "";
        this.textLength = 0;
        this.charsize.setXY(1.0, 1.0);
        this.hidden = false;
        this.hidetext = "";

        // Set hidden mode
        if (hide !== undefined) this.hidden = hide;

        // Set text
        if (text !== undefined)
        {
            this.textLength = text.length;
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

        // Set char size
        if (height !== undefined) this.charsize.vec[1] = height;
        if (this.charsize.vec[1] <= WOSDefaultMinPxTextHeight)
            this.charsize.vec[1] = WOSDefaultMinPxTextHeight;
        if (this.charsize.vec[1] >= WOSDefaultMaxPxTextHeight)
            this.charsize.vec[1] = WOSDefaultMaxPxTextHeight;
        this.charsize.vec[0] = this.charsize.vec[1];

        // Set text size
        this.size.vec[0] =
            this.charsize.vec[0]*WOSDefaultPxTextXOffset*(this.textLength+1);
        this.size.vec[1] = this.charsize.vec[1];

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check text shader pointer
        if (!this.textShader) return false;

        // Check line shader pointer
        if (!this.lineShader) return false;

        // Create background renderer
        this.backrenderer = new BackRenderer(this.renderer, this.lineShader);
        this.backrenderer.init(1, 1);
        this.backrenderer.setAlpha(2.0);

        // Get text shader uniforms locations
        this.textShader.bind();
        this.colorUniform = this.textShader.getUniform("color");
        this.alphaUniform = this.textShader.getUniform("alpha");
        this.smoothUniform = this.textShader.getUniform("smooth");
        this.uvOffsetUniform = this.textShader.getUniform("uvOffset");
        this.uvSizeUniform = this.textShader.getUniform("uvSize");
        this.textShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;
        this.texture.setSmooth(true);

        // Clamp text width
        if (this.size.vec[0] <= WOSDefaultMinPxTextWidth)
            this.size.vec[0] = WOSDefaultMinPxTextWidth;
        if (this.size.vec[0] >= WOSDefaultMaxPxTextWidth)
            this.size.vec[0] = WOSDefaultMaxPxTextWidth;

        // Text line need update
        this.needUpdate = true;

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
        // Set char size
        if (height <= WOSDefaultMinPxTextHeight)
            height = WOSDefaultMinPxTextHeight;
        if (height >= WOSDefaultMaxPxTextHeight)
            height = WOSDefaultMaxPxTextHeight;
        this.charsize.vec[0] = height;
        this.charsize.vec[1] = height;

        // Set text size
        this.size.vec[0] =
            this.charsize.vec[0]*WOSDefaultPxTextXOffset*(this.textLength+1);
        this.size.vec[1] = height;

        // Text line need update
        this.needUpdate = true;
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

        // Text line need update
        this.needUpdate = true;
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
    //  setSmooth : Set text smooth value                                     //
    //  param smooth : Text smooth value to set                               //
    ////////////////////////////////////////////////////////////////////////////
    setSmooth: function(smooth)
    {
        if (smooth <= 0.0) smooth = 0.0;
        if (smooth >= 1.0) smooth = 1.0;
        this.smooth = smooth*0.4;

        // Text line need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set GuiText internal text string                            //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
    setText: function(text)
    {
        // Set text
        this.hidetext = "";
        this.text = "";
        this.textLength = 0;
        if (text)
        {
            this.textLength = text.length;
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

        // Set text width
        this.size.vec[0] =
            this.charsize.vec[0]*WOSDefaultPxTextXOffset*(this.textLength+1);

        // Clamp text width
        if (this.size.vec[0] <= WOSDefaultMinPxTextWidth)
            this.size.vec[0] = WOSDefaultMinPxTextWidth;
        if (this.size.vec[0] >= WOSDefaultMaxPxTextWidth)
            this.size.vec[0] = WOSDefaultMaxPxTextWidth;

        // Text line need update
        this.needUpdate = true;
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
            this.text.substring(0, index) + this.convertASCII(character) +
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
    //  getSmooth : Get smooth value                                          //
    //  return : Text smooth value                                            //
    ////////////////////////////////////////////////////////////////////////////
    getSmooth: function()
    {
        return this.smooth;
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

        // Return character position at given index
        return (this.charsize*index);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextWidth : Get text next width when a character is inserted       //
    //  return : Text width when new character is inserted                    //
    ////////////////////////////////////////////////////////////////////////////
    getNextWidth: function()
    {
        // Return next text width
        return (this.size.vec[0]+this.charsize.vec[0]*WOSDefaultPxTextXOffset);
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
        return this.charsize.vec[1];
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
        var i = 0;
        var charCode = 0;
        var charX = 0;
        var charY = 0;
        var lineWidth = 0;
        var lineHeight = 0;
        var invCharX = 0.0;
        var invCharY = 0.0;

        if (this.needUpdate)
        {
            // Update line size
            lineWidth = Math.round(
                this.size.vec[0]*WOSDefaultPxTextScaleXFactor
            );
            lineHeight = Math.round(
                this.size.vec[1]*WOSDefaultPxTextScaleYFactor
            );

            // Update inverse char size
            if (this.charsize.vec[0] > 0.0) invCharX = 2.0/this.charsize.vec[0];
            if (this.charsize.vec[1] > 0.0) invCharY = 2.0/this.charsize.vec[1];

            // Set background renderer size
            this.backrenderer.setRenderSize(lineWidth, lineHeight);

            // Render into background renderer
            this.backrenderer.clear();
            this.backrenderer.setActive();

            // Bind text shader
            this.textShader.bind();

            // Send shader uniforms
            this.textShader.sendWorldMatrix(this.renderer.worldMatrix);
            this.textShader.sendUniformVec3(this.colorUniform, this.color);
            this.textShader.sendUniform(this.alphaUniform, 1.5);
            this.textShader.sendUniform(this.smoothUniform, this.smooth);
            this.textShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);

            // Bind texture
            this.texture.bind();

            // Bind VBO
            this.renderer.vertexBuffer.bind();

            // Render text
            for (i = 0; i < this.textLength; ++i)
            {
                // Get current character
                charCode = this.text.charCodeAt(i)-32;
                if (charCode < 0) { charCode = 31; }
                if (charCode > 94) { charCode = 31; }
                charX = Math.floor(charCode%16);
                charY = Math.floor(charCode/16);
                if (charX <= 0) { charX = 0; }
                if (charX >= 15) { charX = 15; }
                if (charY <= 0) { charY = 0; }
                if (charY >= 5) { charY = 5; }

                // Set text model matrix
                this.modelMatrix.setIdentity();
                this.modelMatrix.translate(-this.backrenderer.ratio, -1.0, 0.0);
                this.modelMatrix.scale(invCharX, invCharY, 1.0);
                this.modelMatrix.translateX(
                    (WOSDefaultPxTextXOffset*this.charsize.vec[0]*i)-
                    (WOSDefaultPxTextXOffset*this.charsize.vec[0]*0.18)
                );
                this.modelMatrix.scaleVec2(this.charsize);

                // Compute world matrix
                this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
                this.renderer.worldMatrix.multiply(
                    this.renderer.view.viewMatrix
                );
                this.renderer.worldMatrix.multiply(this.modelMatrix);

                this.uvOffset.vec[0] = charX*WOSDefaultPxTextUVWidth;
                this.uvOffset.vec[1] = charY*WOSDefaultPxTextUVHeight;

                // Update shader uniforms
                this.textShader.sendWorldMatrix(this.renderer.worldMatrix);
                this.textShader.sendUniformVec2(
                    this.uvOffsetUniform, this.uvOffset
                );

                // Render VBO
                this.renderer.vertexBuffer.render(this.textShader);
            }

            // Unbind VBO
            this.renderer.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind text shader
            this.textShader.unbind();

            // Set renderer as active
            this.renderer.setActive();

            // Text line updated
            this.needUpdate = false;
        }

        // Render text line
        this.backrenderer.setAlpha(this.alpha);
        this.backrenderer.setSizeVec2(this.size);
        this.backrenderer.setPositionVec2(this.position);
        this.backrenderer.setAngle(this.angle);
        this.backrenderer.render();
    }
};
