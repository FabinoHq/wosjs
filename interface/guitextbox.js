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
//           \\__/      \\_/    //______________/ //_____________/  JS        //
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
//    WOSjs : Web Operating System (javascript version)                       //
//      interface/guitextbox.js : GUI TextBox management                      //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default textbox settings                                                  //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultTextBoxMinWidth = 0.001;
const WOSDefaultTextBoxMaxWidth = 1.95;
const WOSDefaultTextBoxMinHeight = 0.03;
const WOSDefaultTextBoxMaxHeight = 0.55;
const WOSDefaultTextBoxCursorWidthFactor = 0.04;
const WOSDefaultTextBoxCursorHeightFactor = 0.96;
const WOSDefaultTextBoxCursorOffsetFactor = -0.02;
const WOSDefaultTextBoxTextOffsetFactor = 0.025;
const WOSDefaultTextBoxCheckWidthFactor = 0.02;
const WOSDefaultTextBoxCheckWidthOffset = 0.005;
const WOSDefaultTextBoxStateTime = 0.5;


////////////////////////////////////////////////////////////////////////////////
//  GuiTextBox class definition                                               //
//  param renderer : Renderer pointer                                         //
//  param textShader : Text shader pointer                                    //
//  param textBoxShader : Text box shader pointer                             //
//  param textSelectionShader : Text selection shader pointer                 //
//  param textCursorShader : Text cursor shader pointer                       //
////////////////////////////////////////////////////////////////////////////////
function GuiTextBox(
    renderer, textShader, textBoxShader, textSelectionShader, textCursorShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Text shader pointer
    this.textShader = textShader;
    // Text box shader pointer
    this.textBoxShader = textBoxShader;
    // Text selection shader pointer
    this.textSelectionShader = textSelectionShader;
    // Text cursor shader pointer
    this.textCursorShader = textCursorShader;

    // GuiText
    this.guitext = null;

    // Procedural sprites
    this.textbox = null;
    this.textsel = null;
    this.textcursor = null;

    // Textbox position
    this.position = new Vector2(0.0, 0.0);
    // Textbox size
    this.size = new Vector2(1.0, 1.0);
    // Textbox alpha
    this.alpha = 1.0;

    // Cursor position
    this.cursorPos = 0;
    // Cursor offset
    this.cursorOffset = 0.0;
    // Cursor state
    this.cursorState = true;
    // Cursor time
    this.cursorTime = 0.0;

    // Textbox states
    this.selected = false;
    this.pressed = false;
    this.selection = false;
    this.holdShift = false;
    this.selStart = 0;
    this.selStartOffset = 0.0;
    this.selEnd = 0;
    this.selEndOffset = 0.0;
}

GuiTextBox.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI TextBox                                               //
    //  param asciiMode : TextBox ASCII mode                                  //
    //  param width : TextBox field width                                     //
    //  param height : TextBox field height                                   //
    //  param text : Text to set                                              //
    //  param hide : Text hide mode                                           //
    //  return : True if GUI TextBox is successfully loaded                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(asciiMode, width, height, text, hide)
    {
        // Reset textbox
        this.guitext = null;
        this.textbox = null;
        this.textsel = null;
        this.textcursor = null;
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.alpha = 1.0;
        this.cursorPos = 0;
        this.cursorOffset = 0.0;
        this.selected = false;
        this.pressed = false;
        this.selection = false;
        this.holdShift = false;
        this.selStart = 0;
        this.selStartOffset = 0.0;
        this.selEnd = 0;
        this.selEndOffset = 0.0;
        this.cursorState = true;
        this.cursorTime = 0.0;

        // Clamp textbox size
        if (this.size.vec[0] <= WOSDefaultTextBoxMinWidth)
            this.size.vec[0] = WOSDefaultTextBoxMinWidth;
        if (this.size.vec[0] >= WOSDefaultTextBoxMaxWidth)
            this.size.vec[0] = WOSDefaultTextBoxMaxWidth;
        if (this.size.vec[1] <= WOSDefaultTextBoxMinHeight)
            this.size.vec[1] = WOSDefaultTextBoxMinHeight;
        if (this.size.vec[1] >= WOSDefaultTextBoxMaxHeight)
            this.size.vec[1] = WOSDefaultTextBoxMaxHeight;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check shaders pointers
        if (!this.textShader) return false;
        if (!this.textBoxShader) return false;
        if (!this.textSelectionShader) return false;
        if (!this.textCursorShader) return false;

        // Init text
        this.guitext = new GuiText(this.renderer, this.textShader);
        this.guitext.init(text, this.size.vec[1]*0.9, hide);
        this.guitext.setASCIImode(asciiMode);

        // Check text size
        if (this.guitext.getWidth() >
            this.size.vec[0]-(WOSDefaultTextBoxCheckWidthOffset+
            this.size.vec[1]*WOSDefaultTextBoxCheckWidthFactor))
        {
            this.guitext.setText("");
        }

        // Init textbox
        this.textbox = new ProcSprite(this.renderer);
        this.textbox.init(
            this.textBoxShader, this.size.vec[0], this.size.vec[1]
        );

        // Init text selection
        this.textsel = new ProcSprite(this.renderer);
        this.textsel.init(this.textSelectionShader, 0, this.size.vec[1]);

        // Init cursor
        this.textcursor = new ProcSprite(this.renderer);
        this.textcursor.init(
            this.textCursorShader,
            (this.size.vec[1]*WOSDefaultTextBoxCursorWidthFactor),
            (this.size.vec[1]*WOSDefaultTextBoxCursorHeightFactor)
        );

        // Get initial cursor position
        this.cursorPos = this.guitext.getLength();
        this.cursorOffset = this.guitext.getCharPos(this.cursorPos);

        // GUI TextBox successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set textbox position                                    //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set textbox position from a 2 components vector     //
    //  param vector : 2 components vector to set textbox position from       //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set textbox X position                                         //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set textbox Y position                                         //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate textbox                                              //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate textbox by a 2 components vector                 //
    //  param vector : 2 components vector to translate textbox by            //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate textbox on X axis                                   //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate textbox on Y axis                                   //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColor : Set text color                                             //
    //  param r : Text red color channel to set                               //
    //  param g : Text blue color channel to set                              //
    //  param b : Text green color channel to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b)
    {
        this.guitext.setColor(r, g, b);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec3 : Set text color from a 3 component vector               //
    //  param color : 3 component vector to set text color from               //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec3: function(color)
    {
        this.guitext.setColorVec3(color);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set textbox alpha                                          //
    //  param alpha : Textbox alpha to set                                    //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set textbox internal text string                            //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
    setText: function(text)
    {
        this.guitext.setText(text);

        // Check text size
        if (this.guitext.getWidth() >
            this.size.vec[0]-(WOSDefaultTextBoxCheckWidthOffset+
            this.size.vec[1]*WOSDefaultTextBoxCheckWidthFactor))
        {
            this.guitext.setText("");
        }

        // Update cursor
        this.cursorPos = this.guitext.getLength();
        this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
        this.cursorState = true;
        this.cursorTime = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSelected : Set textbox selected state                              //
    //  param selected : Textbox active selected state                        //
    ////////////////////////////////////////////////////////////////////////////
    setSelected: function(selected)
    {
        if (selected)
        {
            this.selected = true;
        }
        else
        {
            this.selected = false;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveCursorLeft : Move textbox cursor to the left                      //
    ////////////////////////////////////////////////////////////////////////////
    moveCursorLeft: function()
    {
        if (this.selected)
        { 
            if (this.selection)
            {
                if (this.holdShift)
                {
                    if (this.cursorPos > 0)
                    {
                        // Extend selection to the left
                        --this.cursorPos;
                        this.cursorOffset = this.guitext.getCharPos(
                            this.cursorPos
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guitext.getCharPos(
                            this.selEnd
                        );
                        selSize = Math.abs(
                            this.selEndOffset-this.selStartOffset
                        );
                        this.textsel.setSize(selSize, this.size.vec[1]);

                        if (this.cursorPos == this.selStart)
                        {
                            this.textsel.setSize(0, this.size.vec[1]);
                            this.selection = false;
                        }
                    }
                }
                else
                {
                    // Set cursor position to the left of the selection
                    this.cursorPos = Math.min(this.selStart, this.selEnd);
                    this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                    this.selection = false;
                }
            }
            else
            {
                if (this.cursorPos > 0)
                {
                    if (this.holdShift)
                    {
                        // Select character to the left
                        --this.cursorPos;
                        this.cursorOffset = this.guitext.getCharPos(
                            this.cursorPos
                        );
                        this.selStart = this.cursorPos+1;
                        this.selStartOffset = this.guitext.getCharPos(
                            this.selStart
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guitext.getCharPos(
                            this.selEnd
                        );
                        selSize = Math.abs(
                            this.selEndOffset-this.selStartOffset
                        );
                        this.textsel.setSize(selSize, this.size.vec[1]);
                        this.selection = true;
                    }
                    else
                    {
                        // Move cursor to the left
                        --this.cursorPos;
                        this.cursorOffset = this.guitext.getCharPos(
                            this.cursorPos
                        );
                    }
                }
            }
            this.cursorState = true;
            this.cursorTime = 0.0;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveCursorRight : Move textbox cursor to the right                    //
    ////////////////////////////////////////////////////////////////////////////
    moveCursorRight: function()
    {
        if (this.selected)
        {
            if (this.selection)
            {
                if (this.holdShift)
                {
                    if (this.cursorPos < this.guitext.getLength())
                    {
                        // Extend selection to the right
                        ++this.cursorPos;
                        this.cursorOffset = this.guitext.getCharPos(
                            this.cursorPos
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guitext.getCharPos(
                            this.selEnd
                        );
                        selSize = Math.abs(
                            this.selEndOffset-this.selStartOffset
                        );
                        this.textsel.setSize(selSize, this.size.vec[1]);

                        if (this.cursorPos == this.selStart)
                        {
                            this.textsel.setSize(0, this.size.vec[1]);
                            this.selection = false;
                        }
                    }
                }
                else
                {
                    // Set cursor position to the right of the selection
                    this.cursorPos = Math.max(this.selStart, this.selEnd);
                    this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                    this.selection = false;
                }
            }
            else
            {
                if (this.cursorPos < this.guitext.getLength())
                {
                    if (this.holdShift)
                    {
                        // Select character to the right
                        ++this.cursorPos;
                        this.cursorOffset = this.guitext.getCharPos(
                            this.cursorPos
                        );
                        this.selStart = this.cursorPos-1;
                        this.selStartOffset = this.guitext.getCharPos(
                            this.selStart
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guitext.getCharPos(
                            this.selEnd
                        );
                        selSize = Math.abs(
                            this.selEndOffset-this.selStartOffset
                        );
                        this.textsel.setSize(selSize, this.size.vec[1]);
                        this.selection = true;
                    }
                    else
                    {
                        // Move cursor to the right
                        ++this.cursorPos;
                        this.cursorOffset = this.guitext.getCharPos(
                            this.cursorPos
                        );
                    }
                }
            }
            this.cursorState = true;
            this.cursorTime = 0.0;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addCharacter : Add character to textbox                               //
    //  param character : Character to add                                    //
    ////////////////////////////////////////////////////////////////////////////
    addCharacter: function(character)
    {
        if (this.selected)
        {
            if (this.selection)
            {
                this.guitext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }

            if ((this.guitext.getNextWidth(character)) <=
                this.size.vec[0]-(WOSDefaultTextBoxCheckWidthOffset+
                this.size.vec[1]*WOSDefaultTextBoxCheckWidthFactor))
            {
                this.guitext.addCharacter(this.cursorPos, character);
                ++this.cursorPos;
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
            }
            this.pressed = false;
            this.cursorState = true;
            this.cursorTime = 0.0;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  eraseLeft : Erase character at left                                   //
    ////////////////////////////////////////////////////////////////////////////
    eraseLeft: function()
    {
        if (this.selected)
        {
            if (this.selection)
            {
                this.guitext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }
            else
            {
                if (this.cursorPos > 0)
                {
                    this.guitext.eraseCharacter(this.cursorPos);
                    --this.cursorPos;
                    this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                }
            }
            this.pressed = false;
            this.cursorState = true;
            this.cursorTime = 0.0;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  eraseRight : Erase character at right                                 //
    ////////////////////////////////////////////////////////////////////////////
    eraseRight: function()
    {
        if (this.selected)
        {
            if (this.selection)
            {
                this.guitext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }
            else
            {
                if (this.cursorPos < this.guitext.getLength())
                {
                    this.guitext.eraseCharacter(this.cursorPos+1);
                    this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                }
            }
            this.cursorState = true;
            this.cursorTime = 0.0;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  keyPress : Handle key pressed event                                   //
    //  param key : Key pressed                                               //
    ////////////////////////////////////////////////////////////////////////////
    keyPress: function(key)
    {
        switch (key)
        {
            case "Shift":
                this.holdShift = true;
                break;
            case "Spacebar": case ' ':
                this.addCharacter(' ');
                break;
            case "ArrowLeft": case "Left":
                this.moveCursorLeft();
                break;
            case "ArrowRight": case "Right":
                this.moveCursorRight();
                break;
            case "Backspace":
                this.eraseLeft();
                break;
            case "Delete": case "Del":
                this.eraseRight();
                break;
            default:
                if (key.length == 1)
                {
                    this.addCharacter(key);
                }
                break;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  keyPress : Handle key released event                                  //
    //  param key : Key released                                              //
    ////////////////////////////////////////////////////////////////////////////
    keyRelease: function(key)
    {
        if (key == "Shift")
        {
            this.holdShift = false;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mousePress : Handle mouse press event                                 //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the textbox is selected                              //
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;

        if (this.isPicking(mouseX, mouseY))
        {
            // Compute mouse x offset
            mouseOffX = mouseX-this.position.vec[0];
            if (mouseOffX <= 0.0) mouseOffX = 0.0;
            if (mouseOffX >= this.size.vec[0]) mouseOffX = this.size.vec[0];

            // Get current character position
            for (i = 0; i <= this.guitext.getLength(); ++i)
            {
                curOffset = this.guitext.getCharPos(i);
                if (mouseOffX >= curOffset)
                {
                    this.cursorPos = i;
                    this.cursorOffset = curOffset;
                    this.selStart = i;
                    this.selStartOffset = curOffset;
                }
                else
                {
                    break;
                }
            }
            this.textsel.setSize(0, this.size.vec[1]);
            this.selection = false;
            this.pressed = true;
            this.selected = true;
            this.cursorState = true;
            this.cursorTime = 0.0;
            return true;
        }
        else
        {
            this.selected = false;
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the textbox is selected                              //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;

        if (this.pressed)
        {
            if (this.isPicking(mouseX, mouseY))
            {
                // Compute mouse x offset
                mouseOffX = mouseX-this.position.vec[0];
                if (mouseOffX <= 0.0) mouseOffX = 0.0;
                if (mouseOffX >= this.size.vec[0]) mouseOffX = this.size.vec[0];

                // Get current character position
                for (i = 0; i <= this.guitext.getLength(); ++i)
                {
                    curOffset = this.guitext.getCharPos(i);
                    if (mouseOffX >= curOffset)
                    {
                        this.cursorPos = i;
                        this.cursorOffset = curOffset;
                    }
                    else
                    {
                        break;
                    }
                }

                // Update selection
                if (this.cursorPos == this.selStart)
                {
                    this.textsel.setSize(0, this.size.vec[1]);
                    this.selection = false;
                }
                this.pressed = false;
                return true;
            }
        }
        this.pressed = false;
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the textbox is selected                              //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;
        var selSize = 0.0;

        if (this.pressed)
        {
            // Set text cursor
            this.renderer.setTextCursor();

            // Compute mouse x offset
            mouseOffX = mouseX-this.position.vec[0];
            if (mouseOffX <= 0.0) mouseOffX = 0.0;
            if (mouseOffX >= this.size.vec[0]) mouseOffX = this.size.vec[0];

            // Get current character position
            for (i = 0; i <= this.guitext.getLength(); ++i)
            {
                curOffset = this.guitext.getCharPos(i);
                if (mouseOffX >= curOffset)
                {
                    this.cursorPos = i;
                    this.cursorOffset = curOffset;
                }
                else
                {
                    break;
                }
            }

            // Update selection
            if (this.cursorPos == this.selStart)
            {
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }
            else
            {
                this.selEnd = this.cursorPos;
                this.selEndOffset = this.cursorOffset;
                selSize = Math.abs(this.selEndOffset-this.selStartOffset);
                this.textsel.setSize(selSize, this.size.vec[1]);
                this.selection = true;
            }
            this.cursorState = true;
            this.cursorTime = 0.0;
            return true;
        }
        else
        {
            if (this.isPicking(mouseX, mouseY))
            {
                // Set text cursor
                this.renderer.setTextCursor();
            }
            else
            {
                // Set default cursor
                this.renderer.setDefaultCursor();
            }
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPicking : Get textbox picking state                                 //
    //  return : True if the textbox is picking                               //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // Textbox is picking
            return true;
        }

        // Textbox is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get textbox X position                                         //
    //  return : Textbox X position                                           //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get textbox Y position                                         //
    //  return : Textbox Y position                                           //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get textbox width                                          //
    //  return : Textbox width                                                //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get textbox height                                        //
    //  return : Textbox height                                               //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get textbox alpha                                          //
    //  return : Textbox alpha                                                //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getText : Get textbox internal text string                            //
    //  return : Textbox internal text string                                 //
    ////////////////////////////////////////////////////////////////////////////
    getText: function()
    {
        return this.guitext.getText();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getLength : Get textbox internal text characters length               //
    //  return : Textbox internal text length                                 //
    ////////////////////////////////////////////////////////////////////////////
    getLength: function()
    {
        return this.guitext.getLength();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isSelected : Get textbox selected state                               //
    //  return : True if the text box is selected, false otherwise            //
    ////////////////////////////////////////////////////////////////////////////
    isSelected: function()
    {
        return this.selected;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute textbox                                             //
    //  param frametime : Frametime for textbox update                        //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        this.cursorTime += frametime;
        if (this.cursorTime >= WOSDefaultTextBoxStateTime)
        {
            this.cursorState = !this.cursorState;
            this.cursorTime -= WOSDefaultTextBoxStateTime;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render textbox                                               //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Render box
        this.textbox.setPositionVec2(this.position);
        this.textbox.setAlpha(this.alpha);
        this.textbox.render();

        // Render text
        this.guitext.setPosition(
            this.position.vec[0]+
            (this.size.vec[1]*WOSDefaultTextBoxTextOffsetFactor),
            this.position.vec[1]
        );
        this.guitext.setAlpha(this.alpha);
        this.guitext.render();

        if (this.selected)
        {
            if (this.selection)
            {
                // Render selection
                this.textsel.setPosition(
                    this.position.vec[0]+
                    (this.size.vec[1]*WOSDefaultTextBoxTextOffsetFactor)+
                    Math.min(this.selStartOffset, this.selEndOffset),
                    this.position.vec[1]
                );
                this.textsel.setAlpha(this.alpha);
                this.textsel.render();
            }
            else
            {
                // Render cursor
                if (this.cursorState)
                {
                    this.textcursor.setPosition(
                        this.position.vec[0]+
                        (this.size.vec[1]*WOSDefaultTextBoxTextOffsetFactor)+
                        this.cursorOffset+
                        (this.size.vec[1]*WOSDefaultTextBoxCursorOffsetFactor),
                        this.position.vec[1]+(this.size.vec[1]*
                        (1.0-WOSDefaultTextBoxCursorHeightFactor)*0.5)
                    );
                    this.textcursor.setAlpha(this.alpha);
                    this.textcursor.render();
                }
            }
        }
    }
};
