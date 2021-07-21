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
//      interface/guimultitext.js : GUI MultiLine Text management             //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default multi text settings                                               //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultMultiLineMinWidth = 0.01;
const WOSDefaultMultiLineMaxWidth = 1.95;
const WOSDefaultMultiLineMinHeight = 0.01;
const WOSDefaultMultiLineMaxHeight = 1.95;
const WOSDefaultMultiLineRightOffset = 0.05;
const WOSDefaultMultiLineScrollFactor = 1.5;


////////////////////////////////////////////////////////////////////////////////
//  GuiMultiText class definition                                             //
//  param renderer : Renderer pointer                                         //
//  param textShader : Text shader pointer                                    //
//  param fieldShader : Text field shader pointer                             //
////////////////////////////////////////////////////////////////////////////////
function GuiMultiText(renderer, textShader, fieldShader)
{
    // Renderer pointer
    this.renderer = renderer;
    // Background renderer
    this.backrenderer = null;

    // Text shader pointer
    this.textShader = textShader;
    // Text field shader pointer
    this.fieldShader = fieldShader;

    // GuiMultiText need update
    this.needUpdate = false;

    // GuiMultiText text height
    this.height = 0.0;
    // GuiMultiText position
    this.position = new Vector2(0.0, 0.0);
    // GuiMultiText size
    this.size = new Vector2(1.0, 1.0);
    // GuiMultiText rotation angle
    this.angle = 0.0;
    // GuiMultiText color
    this.color = new Vector3(1.0, 1.0, 1.0);
    // GuiMultiText alpha
    this.alpha = 1.0;

    // GuiMultiText max offset
    this.maxOffset = 0.0;
    // GuiMultiText offset
    this.offset = 0.0;


    // GuiMultiText internal string
    this.text = "";
    this.lines = null;
    this.textLength = 0;

    // ASCII mode
    this.asciiMode = false;
}

GuiMultiText.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI MultiLine Text                                        //
    //  param text : Text to set                                              //
    //  param height : Text field width                                       //
    //  param height : Text field height                                      //
    //  param lineHeight : Text line height                                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(text, width, height, lineHeight)
    {
        var i = 0;
        var j = 0;
        var currentLine = 0;
        var currentText = "";
        var currentLen = 0;
        var lastSpace = 0;

        // Reset GuiMultiText
        this.backrenderer = null;
        this.needUpdate = false;
        this.height = 0.0;
        this.position.reset();
        this.angle = 0.0;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.color.setXYZ(1.0, 1.0, 1.0);
        this.alpha = 1.0;
        this.maxOffset = 0.0;
        this.offset = 0.0;
        this.text = "";
        this.lines = null;
        this.textLength = 0;
        this.asciiMode = false;

        // Set text line height
        if (lineHeight !== undefined) this.height = lineHeight;
        if (this.height <= WOSDefaultMinTextHeight)
            this.height = WOSDefaultMinTextHeight;
        if (this.height >= WOSDefaultMaxTextHeight)
            this.height = WOSDefaultMaxTextHeight;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check text shader pointer
        if (!this.textShader) return false;

        // Check field shader pointer
        if (!this.fieldShader) return false;

        // Set text
        this.setText(text);

        // Create background renderer
        this.backrenderer = new BackRenderer(this.renderer, this.fieldShader);
        this.backrenderer.init(1, 1);

        // Multitext need update
        this.needUpdate = true;

        // Multiline text loaded
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
    //  setLineHeight : Set text line height                                  //
    //  param lineHeight : Text line height to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setLineHeight: function(lineHeight)
    {
        // Set text line height
        this.height = lineHeight;
        if (this.height <= WOSDefaultMinTextHeight)
            this.height = WOSDefaultMinTextHeight;
        if (this.height >= WOSDefaultMaxTextHeight)
            this.height = WOSDefaultMaxTextHeight;

        // Set font size based on text line height
        this.fontsize = this.height*WOSDefaultFontSizeFactor;
        if (this.fontsize <= WOSDefaultMinFontSize)
            this.fontsize = WOSDefaultMinFontSize;
        if (this.fontsize >= WOSDefaultMaxFontSize)
            this.fontsize = WOSDefaultMaxFontSize;

        // Update text
        this.setText(this.getText());
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set sprite size                                             //
    //  param width : Sprite width to set                                     //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        if (width <= WOSDefaultMultiLineMinWidth)
        {
            width = WOSDefaultMultiLineMinWidth;
        }
        if (width >= WOSDefaultMultiLineMaxWidth)
        {
            width = WOSDefaultMultiLineMaxWidth;
        }
        if (height <= WOSDefaultMultiLineMinHeight)
        {
            height = WOSDefaultMultiLineMinHeight;
        }
        if (height >= WOSDefaultMultiLineMaxHeight)
        {
            height = WOSDefaultMultiLineMaxHeight;
        }
        this.size.vec[0] = width;
        this.size.vec[1] = height;

        // Update text
        this.setText(this.getText());
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set sprite size from a 2 components vector              //
    //  param vector : 2 components vector to set sprite size from            //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
        if (this.size.vec[0] <= WOSDefaultMultiLineMinWidth)
        {
            this.size.vec[0] = WOSDefaultMultiLineMinWidth;
        }
        if (this.size.vec[0] >= WOSDefaultMultiLineMaxWidth)
        {
            this.size.vec[0] = WOSDefaultMultiLineMaxWidth;
        }
        if (this.size.vec[1] <= WOSDefaultMultiLineMinHeight)
        {
            this.size.vec[1] = WOSDefaultMultiLineMinHeight;
        }
        if (this.size.vec[1] >= WOSDefaultMultiLineMaxHeight)
        {
            this.size.vec[1] = WOSDefaultMultiLineMaxHeight;
        }

        // Update text
        this.setText(this.getText());
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set sprite width                                           //
    //  param width : Sprite width to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        if (width <= WOSDefaultMultiLineMinWidth)
        {
            width = WOSDefaultMultiLineMinWidth;
        }
        if (width >= WOSDefaultMultiLineMaxWidth)
        {
            width = WOSDefaultMultiLineMaxWidth;
        }
        this.size.vec[0] = width;

        // Update text
        this.setText(this.getText());
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set sprite height                                         //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        if (height <= WOSDefaultMultiLineMinHeight)
        {
            height = WOSDefaultMultiLineMinHeight;
        }
        if (height >= WOSDefaultMultiLineMaxHeight)
        {
            height = WOSDefaultMultiLineMaxHeight;
        }
        this.size.vec[1] = height;
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
    //  setText : Set GuiMultiText internal text string                       //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
    setText: function(text)
    {
        var i = 0;
        var j = 0;
        var currentLine = 0;
        var currentText = "";
        var currentLen = 0;
        var lastSpace = 0;

        // Set text
        this.maxOffset = 0.0;
        this.text = "";
        this.lines = new Array();
        this.textLength = 0;
        if (text)
        {
            this.lines[0] = new GuiText(this.renderer, this.textShader);
            this.textLength = text.length;
            this.text = text;
            for (i = 0; i < this.textLength; ++i)
            {
                if (text[i] == '\n')
                {
                    this.lines[currentLine].init(
                        currentText, this.height, false
                    );
                    ++currentLine;
                    currentText = "";
                    this.lines[currentLine] = new GuiText(
                        this.renderer, this.textShader
                    );
                }
                else
                {
                    if (this.asciiMode)
                    {
                        currentText += this.convertASCII(text[i]);
                    }
                    else
                    {
                        currentText += text[i];
                    }
                }
            }
            this.lines[currentLine].init(
                currentText, this.height, false
            );

            for (i = 0; i < this.lines.length; ++i)
            {
                // Check line width
                if (this.lines[i].getWidth() >=
                    (this.size.vec[0]-WOSDefaultMultiLineRightOffset))
                {
                    lastSpace = 0;
                    for (j = 2; j < this.lines[i].getLength(); ++j)
                    {
                        if (this.lines[i].getChar(j) == ' ')
                        {
                            lastSpace = j;
                        }

                        // Check character positions
                        if (this.lines[i].getCharPos(j+1) >=
                            (this.size.vec[0]-WOSDefaultMultiLineRightOffset))
                        {
                            // Insert new line
                            currentText = this.lines[i].getText();
                            currentLen = this.lines[i].getLength();
                            if (lastSpace == 0)
                            {
                                // No previous space, cut through letters
                                this.lines[i].setText(
                                    currentText.substring(0, j-1)
                                );
                                currentText = currentText.substring(
                                    j-1, currentLen
                                );
                            }
                            else
                            {
                                // Cut according to previous space
                                this.lines[i].setText(
                                    currentText.substring(0, lastSpace)
                                );
                                currentText = currentText.substring(
                                    lastSpace+1, currentLen
                                );
                            }
                            this.lines.splice(
                                i+1, 0,
                                new GuiText(this.renderer, this.textShader)
                            );
                            this.lines[i+1].init(
                                currentText, this.height, false
                            );
                            break;
                        }
                    }
                }
            }

            // Compute max scroll offset
            this.maxOffset =
                (this.lines.length*this.height*WOSDefaultTextYOffset)-
                this.size.vec[1]+(this.height*0.05);
            if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

            // Clamp current scroll offset
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= this.maxOffset) this.offset = this.maxOffset;
        }

        // Multitext need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addText : Add GuiMultiText internal text                              //
    //  param text : Text to add                                              //
    ////////////////////////////////////////////////////////////////////////////
    addText: function(text)
    {
        var isMaxOffset = (this.offset >= this.maxOffset);
        if (text)
        {
            // Update text
            this.text += text;
            this.setText(this.text);

            // Auto text scroll
            if (isMaxOffset) this.offset = this.maxOffset;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addLine : Add GuiMultiText new line                                   //
    //  param text : Text line to add                                         //
    ////////////////////////////////////////////////////////////////////////////
    addLine: function(text)
    {
        var isMaxOffset = (this.offset >= this.maxOffset);
        var currentLine = this.lines.length;
        var currentText = "";

        if (text)
        {
            this.text += '\n';
            this.lines[currentLine] = new GuiText(
                this.renderer, this.textShader
            );
            for (i = 0; i < text.length; ++i)
            {
                if (this.asciiMode)
                {
                    currentText += this.convertASCII(text[i]);
                }
                else
                {
                    currentText += text[i];
                }
            }
            this.text += currentText;
            this.textLength = this.text.length;
            this.lines[currentLine].init(
                currentText, this.height, false
            );

            // Compute max scroll offset
            this.maxOffset =
                (this.lines.length*this.height*WOSDefaultTextYOffset)-
                this.size.vec[1]+(this.height*0.05);
            if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

            // Clamp current scroll offset
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= this.maxOffset) this.offset = this.maxOffset;

            // Auto text scroll
            if (isMaxOffset) this.offset = this.maxOffset;

            // Text need update
            this.needUpdate = true;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  removeLine : Remove GuiMultiText line at given index                  //
    //  param index : Index to remove GuiMultiText line at                    //
    ////////////////////////////////////////////////////////////////////////////
    removeLine: function(index)
    {
        var i = 0;
        var lineStart = 0;
        var lineEnd = 0;
        var lineReturn = "";
        if ((index >= 0) && (index < this.lines.length))
        {
            // Look for line indexes in internal text
            for (i = 0; i < index; ++i)
            {
                lineStart += this.lines[i].getLength();
                if ((this.text[lineStart] == '\n') ||
                    (this.text[lineStart] == ' '))
                {
                    ++lineStart;
                }
            }
            lineEnd = lineStart + this.lines[index].getLength();
            if (this.text[lineEnd] == ' ')
            {
                ++lineEnd;
            }
            if (this.text[lineEnd] == '\n')
            {
                if (lineStart > 0)
                {
                    if (this.text[lineStart-1] != '\n') lineReturn = '\n';
                }
                ++lineEnd;
            }

            // Clamp indexes into text length range
            if (lineStart <= 0) lineStart = 0;
            if (lineStart >= this.text.length) lineStart = this.text.length;
            if (lineEnd <= 0) lineEnd = 0;
            if (lineEnd >= this.text.length) lineEnd = this.text.length;

            // Remove line from internal text
            this.text = this.text.substring(0, lineStart) + lineReturn +
                this.text.substring(lineEnd, this.text.length);
            this.textLength = this.text.length;
            this.lines.splice(index, 1);

            // Compute max scroll offset
            this.maxOffset =
                (this.lines.length*this.height*WOSDefaultTextYOffset)-
                this.size.vec[1]+(this.height*0.05);
            if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

            // Clamp current scroll offset
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= this.maxOffset) this.offset = this.maxOffset;

            // Multitext need update
            this.needUpdate = true;
        }
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
    //  mouseWheel : Handle mouse wheel event                                 //
    //  param mouseWheel : Mouse wheel delta                                  //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseWheel: function(mouseWheel, mouseX, mouseY)
    {
        if (mouseX >= this.position.vec[0] &&
            mouseX <= (this.position.vec[0]+this.size.vec[0]) &&
            mouseY >= this.position.vec[1] &&
            mouseY <= (this.position.vec[1]+this.size.vec[1]))
        {
            if (mouseWheel < 0.0)
            {
                // Mouse wheel up
                this.offset -= this.height*WOSDefaultMultiLineScrollFactor;
                if (this.offset <= 0.0) this.offset = 0.0;
                this.needUpdate = true;
            }
            else if (mouseWheel > 0.0)
            {
                // Mouse wheel down
                this.offset += this.height*WOSDefaultMultiLineScrollFactor;
                if (this.offset >= this.maxOffset) this.offset = this.maxOffset;
                this.needUpdate = true;
            }
        }
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
        return this.text[index];
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
    //  getLinesCount : Get text number of lines                              //
    //  return : Text lines count                                             //
    ////////////////////////////////////////////////////////////////////////////
    getLinesCount: function()
    {
        return this.lines.length;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render multiline text                                        //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        var i = 0;
        var fieldWidth = 0;
        var fieldHeight = 0;
        var start = 0;
        var end = 0;

        if (this.needUpdate)
        {
            // Set background renderer size
            fieldWidth = Math.round(
                this.size.vec[0]*WOSDefaultPxTextScaleXFactor
            );
            fieldHeight = Math.round(
                this.size.vec[1]*WOSDefaultPxTextScaleYFactor
            );
            this.size.vec[0] = fieldWidth/WOSDefaultPxTextScaleXFactor;
            this.size.vec[1] = fieldHeight/WOSDefaultPxTextScaleYFactor;
            this.backrenderer.setRenderSize(fieldWidth, fieldHeight);

            // Render into background renderer
            this.backrenderer.clear();
            this.backrenderer.setActive();

            if ((this.height*WOSDefaultTextYOffset) > 0.0)
            {
                start = Math.round(
                    (this.offset/(this.height*WOSDefaultTextYOffset))-1.0
                );
                end = Math.round(
                    ((this.offset+this.size.vec[1])/
                    (this.height*WOSDefaultTextYOffset))+1.0
                );
            }
            if (start <= 0) start = 0;
            if (start >= this.lines.length) start = this.lines.length;
            if (end <= 0) end = 0;
            if (end >= this.lines.length) end = this.lines.length;

            for (i = start; i < end; ++i)
            {
                // Set line position
                this.lines[i].setPosition(
                    this.position.vec[0] + (0.1*this.height),
                    (this.position.vec[1]+this.size.vec[1])-
                    (i*this.height*WOSDefaultTextYOffset)-(1.05*this.height)+
                    this.offset
                );

                // Set text model matrix
                this.lines[i].modelMatrix.setIdentity();
                if (this.size.vec[1] > 0.0)
                {
                    this.lines[i].modelMatrix.scale(
                        2.0/this.size.vec[1], 2.0/this.size.vec[1], 1.0
                    );
                }
                this.lines[i].modelMatrix.translateVec2(this.lines[i].position);
                this.lines[i].modelMatrix.scaleVec2(this.lines[i].size);

                // Bind text shader
                this.textShader.bind();

                // Compute world matrix
                this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
                this.renderer.worldMatrix.multiply(
                    this.renderer.view.viewMatrix
                );
                this.renderer.worldMatrix.multiply(this.lines[i].modelMatrix);

                // Send shader uniforms
                this.textShader.sendWorldMatrix(this.renderer.worldMatrix);
                this.textShader.sendUniformVec3(
                    this.lines[i].colorUniform, this.lines[i].color
                );
                this.textShader.sendUniform(
                    this.lines[i].alphaUniform, this.lines[i].alpha*1.5
                );

                // Bind texture
                this.renderer.gl.bindTexture(
                    this.renderer.gl.TEXTURE_2D,
                    this.lines[i].texture
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

            // Set renderer as active
            this.renderer.setActive();

            // Multitext updated
            this.needUpdate = false;
        }

        // Render text field
        this.backrenderer.setAlpha(this.alpha);
        this.backrenderer.setSizeVec2(this.size);
        this.backrenderer.setPositionVec2(this.position);
        this.backrenderer.setAngle(this.angle);
        this.backrenderer.render();
    }
};
