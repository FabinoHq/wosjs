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
//      interface/guipxmultitext.js : GUI MultiLine Pixel Text management     //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default pixel multi text settings                                         //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultPxMultiTextMinWidth = 0.2;
const WOSDefaultPxMultiTextMaxWidth = 1.95;
const WOSDefaultPxMultiTextMinHeight = 0.05;
const WOSDefaultPxMultiTextMaxHeight = 1.95;
const WOSDefaultPxMultiTextScrollFactor = 1.5;


////////////////////////////////////////////////////////////////////////////////
//  GuiPxMultiText class definition                                           //
//  param renderer : Renderer pointer                                         //
//  param textShader : Text shader pointer                                    //
//  param fieldShader : Text field shader pointer                             //
//  param scrollBarShader : Scrollbar shader pointer                          //
////////////////////////////////////////////////////////////////////////////////
function GuiPxMultiText(renderer, textShader, fieldShader, scrollBarShader)
{
    // Renderer pointer
    this.renderer = renderer;
    // Background renderer
    this.backrenderer = null;

    // Text shader pointer
    this.textShader = textShader;
    // Text field shader pointer
    this.fieldShader = fieldShader;
    // Scollbar shader pointer
    this.scrollBarShader = scrollBarShader;

    // GuiPxText glyphs texture
    this.texture = null;

    // GuiPxMultiText need update
    this.needUpdate = false;

    // GuiPxMultiText text height
    this.height = 0.0;
    // GuiPxMultiText position
    this.position = new Vector2(0.0, 0.0);
    // GuiPxMultiText size
    this.size = new Vector2(1.0, 1.0);
    // GuiPxMultiText color
    this.color = new Vector3(1.0, 1.0, 1.0);
    // GuiPxMultiText lines alpha
    this.linesAlpha = 1.0;
    // GuiPxMultiText alpha
    this.alpha = 1.0;
    // GuiPxMultiText smooth value
    this.smooth = 0.1;

    // GuiPxMultiText scrollable state
    this.scrollable = false;
    // GuiPxMultiText scroll bar
    this.scrollBar = null;
    // GuiPxMultiText max offset
    this.maxOffset = 0.0;
    // GuiPxMultiText offset
    this.offset = 0.0;
    // GuiPxMultiText scrollbar width
    this.scrollBarWidth = 0.0;

    // GuiPxMultiText internal string
    this.text = "";
    this.lines = null;
    this.textLength = 0;
}

GuiPxMultiText.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI PxMultiText                                           //
    //  param texture : Texture pointer                                       //
    //  param text : Text to set                                              //
    //  param width : Text field width                                        //
    //  param height : Text field height                                      //
    //  param lineHeight : Text line height                                   //
    //  param scrollable : Text line scrollable state                         //
    //  param scrollBarTexture : ScrollBar texture                            //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, text, width, height, lineHeight,
        scrollable, scrollBarTexture, scrollBarWidth)
    {
        var i = 0;
        var j = 0;
        var currentLine = 0;
        var currentText = "";
        var currentLen = 0;
        var lastSpace = 0;

        // Reset GuiPxMultiText
        this.backrenderer = null;
        this.texture = null;
        this.needUpdate = false;
        this.height = 0.0;
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.color.setXYZ(1.0, 1.0, 1.0);
        this.linesAlpha = 1.0;
        this.alpha = 1.0;
        this.smooth = 0.1;
        this.scrollable = false;
        if (scrollable !== undefined) this.scrollable = scrollable;
        this.scrollBar = null;
        this.maxOffset = 0.0;
        this.offset = 0.0;
        this.scrollBarWidth = 0.0;
        if (this.scrollable && (scrollBarWidth !== undefined))
        {
            this.scrollBarWidth = scrollBarWidth;
        }
        this.text = "";
        this.lines = null;
        this.textLength = 0;

        // Clamp multitext field size
        if (this.size.vec[0] <= WOSDefaultPxMultiTextMinWidth)
        {
            this.size.vec[0] = WOSDefaultPxMultiTextMinWidth;
        }
        if (this.size.vec[0] >= WOSDefaultPxMultiTextMaxWidth)
        {
            this.size.vec[0] = WOSDefaultPxMultiTextMaxWidth;
        }
        if (this.scrollable)
        {
            if (this.size.vec[0] <=
                (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth))
            {
                this.size.vec[0] =
                    (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth);
            }
        }
        if (this.size.vec[1] <= WOSDefaultPxMultiTextMinHeight)
        {
            this.size.vec[1] = WOSDefaultPxMultiTextMinHeight;
        }
        if (this.size.vec[1] >= WOSDefaultPxMultiTextMaxHeight)
        {
            this.size.vec[1] = WOSDefaultPxMultiTextMaxHeight;
        }

        // Set text line height
        if (lineHeight !== undefined) this.height = lineHeight;
        if (this.height <= WOSDefaultMinPxTextHeight)
            this.height = WOSDefaultMinPxTextHeight;
        if (this.height >= WOSDefaultMaxPxTextHeight)
            this.height = WOSDefaultMaxPxTextHeight;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check text shader pointer
        if (!this.textShader) return false;

        // Check field shader pointer
        if (!this.fieldShader) return false;

        // Create scrollbar
        if (this.scrollable)
        {
            this.scrollBar = new GuiScrollBar(
                this.renderer, this.scrollBarShader
            );
            if (!this.scrollBar.init(
                scrollBarTexture, scrollBarWidth, 1.0, 15.0))
            {
                return false;
            }
        }

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;
        this.texture.setSmooth(true);

        // Set text
        this.setText(text);

        // Create background renderer
        this.backrenderer = new BackRenderer(this.renderer, this.fieldShader);
        this.backrenderer.init(1, 1);

        // PxMultitext need update
        this.needUpdate = true;

        // PxMultitext text loaded
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
    //  setLineHeight : Set text line height                                  //
    //  param lineHeight : Text line height to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setLineHeight: function(lineHeight)
    {
        // Set text line height
        this.height = lineHeight;
        if (this.height <= WOSDefaultMinPxTextHeight)
            this.height = WOSDefaultMinPxTextHeight;
        if (this.height >= WOSDefaultMaxPxTextHeight)
            this.height = WOSDefaultMaxPxTextHeight;

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
        if (width <= WOSDefaultPxMultiTextMinWidth)
        {
            width = WOSDefaultPxMultiTextMinWidth;
        }
        if (width >= WOSDefaultPxMultiTextMaxWidth)
        {
            width = WOSDefaultPxMultiTextMaxWidth;
        }
        if (this.scrollable)
        {
            if (width <= (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth))
            {
                width = (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth);
            }
        }
        if (height <= WOSDefaultPxMultiTextMinHeight)
        {
            height = WOSDefaultPxMultiTextMinHeight;
        }
        if (height >= WOSDefaultPxMultiTextMaxHeight)
        {
            height = WOSDefaultPxMultiTextMaxHeight;
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
        if (this.size.vec[0] <= WOSDefaultPxMultiTextMinWidth)
        {
            this.size.vec[0] = WOSDefaultPxMultiTextMinWidth;
        }
        if (this.size.vec[0] >= WOSDefaultPxMultiTextMaxWidth)
        {
            this.size.vec[0] = WOSDefaultPxMultiTextMaxWidth;
        }
        if (this.scrollable)
        {
            if (this.size.vec[0] <=
                (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth))
            {
                this.size.vec[0] =
                    (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth);
            }
        }
        if (this.size.vec[1] <= WOSDefaultPxMultiTextMinHeight)
        {
            this.size.vec[1] = WOSDefaultPxMultiTextMinHeight;
        }
        if (this.size.vec[1] >= WOSDefaultPxMultiTextMaxHeight)
        {
            this.size.vec[1] = WOSDefaultPxMultiTextMaxHeight;
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
        if (width <= WOSDefaultPxMultiTextMinWidth)
        {
            width = WOSDefaultPxMultiTextMinWidth;
        }
        if (width >= WOSDefaultPxMultiTextMaxWidth)
        {
            width = WOSDefaultPxMultiTextMaxWidth;
        }
        if (this.scrollable)
        {
            if (width <= (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth))
            {
                width = (WOSDefaultPxMultiTextMinWidth+this.scrollBarWidth);
            }
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
        if (height <= WOSDefaultPxMultiTextMinHeight)
        {
            height = WOSDefaultPxMultiTextMinHeight;
        }
        if (height >= WOSDefaultPxMultiTextMaxHeight)
        {
            height = WOSDefaultPxMultiTextMaxHeight;
        }
        this.size.vec[1] = height;

        // Compute max scroll offset
        this.maxOffset =
            (this.lines.length*this.height*WOSDefaultPxTextYOffset)-
            this.size.vec[1]+(this.height*0.05);
        if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

        // Clamp current scroll offset
        if (this.offset <= 0.0) this.offset = 0.0;
        if (this.offset >= this.maxOffset) this.offset = this.maxOffset;

        // Update scrollbar
        if (this.scrollable)
        {
            if (this.maxOffset > 0.0)
            {
                this.scrollBar.setScrollOffset(this.offset/this.maxOffset);
            }
            else
            {
                this.scrollBar.setScrollOffset(0.0);
            }
            this.scrollBar.setScrollHeight(1.0/(this.maxOffset+1.0));
        }

        // Text need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColor : Set text color                                             //
    //  param r : Text red color channel to set                               //
    //  param g : Text blue color channel to set                              //
    //  param b : Text green color channel to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b)
    {
        // Set text color
        this.color.vec[0] = r;
        this.color.vec[1] = g;
        this.color.vec[2] = b;

        // Multitext need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setLinesAlpha : Set lines alpha                                       //
    //  param alpha : Text lines alpha to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setLinesAlpha: function(alpha)
    {
        this.linesAlpha = alpha;

        // Multitext need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set multitext alpha                                        //
    //  param alpha : Multitext alpha to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSmooth : Set multitext smooth value                                //
    //  param smooth : Text smooth value to set                               //
    ////////////////////////////////////////////////////////////////////////////
    setSmooth: function(smooth)
    {
        if (smooth <= 0.0) smooth = 0.0;
        if (smooth >= 1.0) smooth = 1.0;
        this.smooth = smooth*0.4;

        // Multitext need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set GuiPxMultiText internal text string                     //
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
            this.lines[0] = new GuiPxText(this.renderer, this.textShader);
            this.textLength = text.length;
            this.text = text;
            for (i = 0; i < this.textLength; ++i)
            {
                if (text[i] == '\n')
                {
                    this.lines[currentLine].init(
                        false, this.texture, currentText, this.height, false
                    );
                    ++currentLine;
                    currentText = "";
                    this.lines[currentLine] = new GuiPxText(
                        this.renderer, this.textShader
                    );
                }
                else
                {
                    currentText += this.convertASCII(text[i]);
                }
            }
            this.lines[currentLine].init(
                false, this.texture, currentText, this.height, false
            );

            for (i = 0; i < this.lines.length; ++i)
            {
                // Check line width
                if (this.lines[i].getWidth() >=
                    (this.size.vec[0]-this.scrollBarWidth-0.02))
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
                            (this.size.vec[0]-this.scrollBarWidth-0.02))
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
                                new GuiPxText(this.renderer, this.textShader)
                            );
                            this.lines[i+1].init(
                                false, this.texture,
                                currentText, this.height, false
                            );
                            break;
                        }
                    }
                }
            }

            // Compute max scroll offset
            this.maxOffset =
                (this.lines.length*this.height*WOSDefaultPxTextYOffset)-
                this.size.vec[1]+(this.height*0.05);
            if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

            // Clamp current scroll offset
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= this.maxOffset) this.offset = this.maxOffset;

            // Update scrollbar
            if (this.scrollable)
            {
                if (this.maxOffset > 0.0)
                {
                    this.scrollBar.setScrollOffset(this.offset/this.maxOffset);
                }
                else
                {
                    this.scrollBar.setScrollOffset(0.0);
                }
                this.scrollBar.setScrollHeight(1.0/(this.maxOffset+1.0));
            }
        }

        // PxMultitext need update
        this.needUpdate = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addText : Add GuiPxMultiText internal text                            //
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
    //  addLine : Add GuiPxMultiText new line                                 //
    //  param text : Text line to add                                         //
    ////////////////////////////////////////////////////////////////////////////
    addLine: function(text)
    {
        var i = 0;
        var j = 0;
        var isMaxOffset = (this.offset >= this.maxOffset);
        var currentLine = this.lines.length;
        var currentText = "";
        var lastSpace = 0;

        if (text)
        {
            this.text += '\n';
            this.lines[currentLine] = new GuiPxText(
                this.renderer, this.textShader
            );
            for (i = 0; i < text.length; ++i)
            {
                if (text[i] != '\n')
                {
                    currentText += this.convertASCII(text[i]);
                }
            }
            this.text += currentText;
            this.textLength = this.text.length;
            this.lines[currentLine].init(
                false, this.texture, currentText, this.height, false
            );

            for (i = currentLine; i < this.lines.length; ++i)
            {
                // Check line width
                if (this.lines[i].getWidth() >=
                    (this.size.vec[0]-this.scrollBarWidth-0.02))
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
                            (this.size.vec[0]-this.scrollBarWidth-0.02))
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
                                new GuiPxText(this.renderer, this.textShader)
                            );
                            this.lines[i+1].init(
                                false, this.texture,
                                currentText, this.height, false
                            );
                            break;
                        }
                    }
                }
            }

            // Compute max scroll offset
            this.maxOffset =
                (this.lines.length*this.height*WOSDefaultPxTextYOffset)-
                this.size.vec[1]+(this.height*0.05);
            if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

            // Clamp current scroll offset
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= this.maxOffset) this.offset = this.maxOffset;

            // Auto text scroll
            if (isMaxOffset) this.offset = this.maxOffset;

            // Update scrollbar
            if (this.scrollable)
            {
                if (this.maxOffset > 0.0)
                {
                    this.scrollBar.setScrollOffset(this.offset/this.maxOffset);
                }
                else
                {
                    this.scrollBar.setScrollOffset(0.0);
                }
                this.scrollBar.setScrollHeight(1.0/(this.maxOffset+1.0));
            }

            // Text need update
            this.needUpdate = true;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  removeLine : Remove GuiPxMultiText line at given index                //
    //  param index : Index to remove GuiPxMultiText line at                  //
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
                (this.lines.length*this.height*WOSDefaultPxTextYOffset)-
                this.size.vec[1]+(this.height*0.05);
            if (this.maxOffset <= 0.0) this.maxOffset = 0.0;

            // Clamp current scroll offset
            if (this.offset <= 0.0) this.offset = 0.0;
            if (this.offset >= this.maxOffset) this.offset = this.maxOffset;

            // Update scrollbar
            if (this.scrollable)
            {
                if (this.maxOffset > 0.0)
                {
                    this.scrollBar.setScrollOffset(this.offset/this.maxOffset);
                }
                else
                {
                    this.scrollBar.setScrollOffset(0.0);
                }
                this.scrollBar.setScrollHeight(1.0/(this.maxOffset+1.0));
            }

            // PxMultitext need update
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
    //  mousePress : Handle mouse press event                                 //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        if (this.scrollable)
        {
            if (this.scrollBar.mousePress(mouseX, mouseY))
            {
                this.offset = this.scrollBar.getScrollOffset()*this.maxOffset;
                this.needUpdate = true;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        if (this.scrollable)
        {
            this.scrollBar.mouseRelease(mouseX, mouseY);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        if (this.scrollable)
        {
            if (this.scrollBar.mouseMove(mouseX, mouseY))
            {
                this.offset = this.scrollBar.getScrollOffset()*this.maxOffset;
                this.needUpdate = true;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseWheel : Handle mouse wheel event                                 //
    //  param mouseWheel : Mouse wheel delta                                  //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseWheel: function(mouseWheel, mouseX, mouseY)
    {
        if (this.scrollable)
        {
            if (this.isPicking(mouseX, mouseY))
            {
                if (mouseWheel < 0.0)
                {
                    // Mouse wheel up
                    this.offset -=
                        this.height*WOSDefaultPxMultiTextScrollFactor;
                    if (this.offset <= 0.0) this.offset = 0.0;
                    if (this.maxOffset > 0.0)
                    {
                        this.scrollBar.setScrollOffset(
                            this.offset/this.maxOffset
                        );
                    }
                    else
                    {
                        this.scrollBar.setScrollOffset(0.0);
                    }
                    this.needUpdate = true;
                }
                else if (mouseWheel > 0.0)
                {
                    // Mouse wheel down
                    this.offset +=
                        this.height*WOSDefaultPxMultiTextScrollFactor;
                    if (this.offset >= this.maxOffset)
                    {
                        this.offset = this.maxOffset;
                    }
                    if (this.maxOffset > 0.0)
                    {
                        this.scrollBar.setScrollOffset(
                            this.offset/this.maxOffset
                        );
                    }
                    else
                    {
                        this.scrollBar.setScrollOffset(0.0);
                    }
                    this.needUpdate = true;
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPicking : Get pxmultitext picking state                             //
    //  return : True if the pxmultitext is picking                           //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // PxMultitext is picking
            return true;
        }

        // PxMultitext is not picking
        return false;
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
    //  render : Render multiline pixel text                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        var i = 0;
        var j = 0;
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

            if ((this.height*WOSDefaultPxTextYOffset) > 0.0)
            {
                start = Math.round(
                    (this.offset/(this.height*WOSDefaultPxTextYOffset))-1.0
                );
                end = Math.round(
                    ((this.offset+this.size.vec[1])/
                    (this.height*WOSDefaultPxTextYOffset))+1.0
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
                    (-this.height*0.05)-this.size.vec[0]*0.5,
                    this.size.vec[1]-(this.size.vec[1]*0.5)-
                    (i*this.height*WOSDefaultPxTextYOffset)-(0.98*this.height)+
                    this.offset
                );

                // Bind text shader
                this.textShader.bind();

                // Send shader uniforms
                this.textShader.sendWorldMatrix(this.renderer.worldMatrix);
                this.textShader.sendUniformVec3(
                    this.lines[i].colorUniform, this.color
                );
                this.textShader.sendUniform(
                    this.lines[i].alphaUniform, this.linesAlpha
                );
                this.textShader.sendUniform(
                    this.lines[i].smoothUniform, this.smooth
                );
                this.textShader.sendUniformVec2(
                    this.lines[i].uvSizeUniform, this.lines[i].uvSize
                );

                // Bind texture
                this.texture.bind();

                // Bind VBO
                this.renderer.vertexBuffer.bind();

                // Render text
                for (j = 0; j < this.lines[i].textLength; ++j)
                {
                    // Get current character
                    charCode = this.lines[i].text.charCodeAt(j)-32;
                    if (charCode < 0) { charCode = 31; }
                    if (charCode > 94) { charCode = 31; }
                    charX = Math.floor(charCode%16);
                    charY = Math.floor(charCode/16);
                    if (charX <= 0) { charX = 0; }
                    if (charX >= 15) { charX = 15; }
                    if (charY <= 0) { charY = 0; }
                    if (charY >= 5) { charY = 5; }

                    // Set text model matrix
                    this.lines[i].modelMatrix.setIdentity();
                    if (this.size.vec[1] > 0.0)
                    {
                        this.lines[i].modelMatrix.scale(
                            2.0/this.size.vec[1], 2.0/this.size.vec[1], 1.0
                        );
                    }
                    this.lines[i].modelMatrix.translateVec2(
                        this.lines[i].position
                    );
                    this.lines[i].modelMatrix.translateX(
                        (WOSDefaultPxTextXOffset*
                        this.lines[i].charsize.vec[0]*j)-
                        (WOSDefaultPxTextXOffset*
                        this.lines[i].charsize.vec[0]*0.18)
                    );
                    this.lines[i].modelMatrix.scaleVec2(this.lines[i].charsize);

                    // Compute world matrix
                    this.renderer.worldMatrix.setMatrix(
                        this.renderer.projMatrix
                    );
                    this.renderer.worldMatrix.multiply(
                        this.renderer.view.viewMatrix
                    );
                    this.renderer.worldMatrix.multiply(
                        this.lines[i].modelMatrix
                    );

                    this.lines[i].uvOffset.vec[0] =
                        charX*WOSDefaultPxTextUVWidth;
                    this.lines[i].uvOffset.vec[1] =
                        charY*WOSDefaultPxTextUVHeight;

                    // Update shader uniforms
                    this.textShader.sendWorldMatrix(this.renderer.worldMatrix);
                    this.textShader.sendUniformVec2(
                        this.lines[i].uvOffsetUniform, this.lines[i].uvOffset
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
            }

            // Set renderer as active
            this.renderer.setActive();

            // PxMultitext updated
            this.needUpdate = false;
        }

        // Render text field
        this.backrenderer.setAlpha(this.alpha);
        this.backrenderer.setSizeVec2(this.size);
        this.backrenderer.setPositionVec2(this.position);
        this.backrenderer.render();

        // Render scroll bar
        if (this.scrollable)
        {
            this.scrollBar.setHeight(this.size.vec[1]-0.01);
            this.scrollBar.setPosition(
                this.position.vec[0]+this.size.vec[0]-
                this.scrollBarWidth-0.005,
                this.position.vec[1]+0.005
            );
            this.scrollBar.render();
        }
    }
};
