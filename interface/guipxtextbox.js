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
//      interface/guipxtextbox.js : GUI Pixel TextBox management              //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GUI Pixel Textbox default fragment shader                                 //
////////////////////////////////////////////////////////////////////////////////
const pxtextboxFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "uniform float alpha;",
    "void main()",
    "{",
    "    gl_FragColor = vec4(0.2, 0.2, 0.2, 0.8*alpha);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  GUI Pixel Textbox selection default fragment shader                       //
////////////////////////////////////////////////////////////////////////////////
const pxtextselectionFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "uniform float alpha;",
    "void main()",
    "{",
    "    gl_FragColor = vec4(0.0, 0.0, 0.8, 0.3*alpha);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  GUI Pixel Textbox cursor default fragment shader                          //
////////////////////////////////////////////////////////////////////////////////
const pxtextcursorFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "uniform float alpha;",
    "void main()",
    "{",
    "    gl_FragColor = vec4(0.8, 0.8, 0.8, 0.8*alpha);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Default pixel textbox settings                                            //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultPxTextBoxMinWidth = 0.1;
const WOSDefaultPxTextBoxMaxWidth = 1.95;
const WOSDefaultPxTextBoxMinHeight = 0.03;
const WOSDefaultPxTextBoxMaxHeight = 0.2;
const WOSDefaultPxTextBoxCursorWidthFactor = 0.04;
const WOSDefaultPxTextBoxCursorHeightFactor = 0.96;
const WOSDefaultPxTextBoxCursorOffsetFactor = -0.02;
const WOSDefaultPxTextBoxTextOffsetFactor = -0.08;
const WOSDefaultPxTextBoxCheckWidthFactor = 0.005;
const WOSDefaultPxTextBoxCheckWidthOffset = 0.002;


////////////////////////////////////////////////////////////////////////////////
//  GuiPxTextBox class definition                                             //
//  param renderer : Renderer pointer                                         //
//  param textShader : Text shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function GuiPxTextBox(renderer, textShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Text shader pointer
    this.textShader = textShader;

    // GuiPxText
    this.guipxtext = null;

    // Procedural sprites
    this.textbox = null;
    this.textsel = null;
    this.textcursor = null;

    // Pxtextbox position
    this.position = new Vector2(0.0, 0.0);
    // Pxtextbox size
    this.size = new Vector2(1.0, 1.0);
    // Pxtextbox alpha
    this.alpha = 1.0;

    // Cursor position
    this.cursorPos = 0;
    // Cursor offset
    this.cursorOffset = 0.0;

    // Pxtextbox states
    this.selected = false;
    this.pressed = false;
    this.selection = false;
    this.holdShift = false;
    this.selStart = 0;
    this.selStartOffset = 0.0;
    this.selEnd = 0;
    this.selEndOffset = 0.0;
}

GuiPxTextBox.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI PxTextBox                                             //
    //  param texture : Texture pointer                                       //
    //  param width : PxTextBox field width                                   //
    //  param height : PxTextBox field height                                 //
    //  param text : Text to set                                              //
    //  param hide : Text hide mode                                           //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, text, hide)
    {
        // Reset Pxtextbox
        this.guipxtext = null;
        this.textbox = null;
        this.textsel = null;
        this.textcursor = null;
        this.position.reset();
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

        // Clamp pxtextbox size
        if (this.size.vec[0] <= WOSDefaultPxTextBoxMinWidth)
            this.size.vec[0] = WOSDefaultPxTextBoxMinWidth;
        if (this.size.vec[0] >= WOSDefaultPxTextBoxMaxWidth)
            this.size.vec[0] = WOSDefaultPxTextBoxMaxWidth;
        if (this.size.vec[1] <= WOSDefaultPxTextBoxMinHeight)
            this.size.vec[1] = WOSDefaultPxTextBoxMinHeight;
        if (this.size.vec[1] >= WOSDefaultPxTextBoxMaxHeight)
            this.size.vec[1] = WOSDefaultPxTextBoxMaxHeight;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Init text
        this.guipxtext = new GuiPxText(this.renderer, this.textShader);
        this.guipxtext.init(false, texture, text, this.size.vec[1]*0.9, hide);

        // Check text size
        if (this.guipxtext.getWidth() >
            this.size.vec[0]-(WOSDefaultPxTextBoxCheckWidthOffset+
            this.size.vec[1]*WOSDefaultPxTextBoxCheckWidthFactor))
        {
            this.guipxtext.setText("");
        }

        // Init pxtextbox
        this.textbox = new ProcSprite(this.renderer);
        this.textbox.init(
            pxtextboxFragmentShaderSrc, this.size.vec[0], this.size.vec[1]
        );

        // Init text selection
        this.textsel = new ProcSprite(this.renderer);
        this.textsel.init(
            pxtextselectionFragmentShaderSrc, 0, this.size.vec[1]
        );

        // Init cursor
        this.textcursor = new ProcSprite(this.renderer);
        this.textcursor.init(
            pxtextcursorFragmentShaderSrc,
            (this.size.vec[1]*WOSDefaultPxTextBoxCursorWidthFactor),
            (this.size.vec[1]*WOSDefaultPxTextBoxCursorHeightFactor)
        );

        // Get initial cursor position
        this.cursorPos = this.guipxtext.getLength();
        this.cursorOffset = this.guipxtext.getCharPos(this.cursorPos);

        // Textbox loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set pxtextbox position                                  //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set pxtextbox position from a 2 components vector   //
    //  param vector : 2 components vector to set pxtextbox position from     //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set pxtextbox X position                                       //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set pxtextbox Y position                                       //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate pxtextbox                                            //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate pxtextbox by a 2 components vector               //
    //  param vector : 2 components vector to translate pxtextbox by          //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate pxtextbox on X axis                                 //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate pxtextbox on Y axis                                 //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set pxtextbox alpha                                        //
    //  param alpha : Textbox alpha to set                                    //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set pxtextbox internal text string                          //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
    setText: function(text)
    {
        this.guipxtext.setText(text);

        // Check text size
        if (this.guipxtext.getWidth() >
            this.size.vec[0]-(WOSDefaultPxTextBoxCheckWidthOffset+
            this.size.vec[1]*WOSDefaultPxTextBoxCheckWidthFactor))
        {
            this.guipxtext.setText("");
        }

        // Update cursor
        this.cursorPos = this.guipxtext.getLength();
        this.cursorOffset = this.guipxtext.getCharPos(this.cursorPos);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSelected : Set pxtextbox selected state                            //
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
    //  moveCursorLeft : Move pxtextbox cursor to the left                    //
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
                        this.cursorOffset = this.guipxtext.getCharPos(
                            this.cursorPos
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guipxtext.getCharPos(
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
                    this.cursorOffset = this.guipxtext.getCharPos(
                        this.cursorPos
                    );
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
                        this.cursorOffset = this.guipxtext.getCharPos(
                            this.cursorPos
                        );
                        this.selStart = this.cursorPos+1;
                        this.selStartOffset = this.guipxtext.getCharPos(
                            this.selStart
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guipxtext.getCharPos(
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
                        this.cursorOffset = this.guipxtext.getCharPos(
                            this.cursorPos
                        );
                    }
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveCursorRight : Move pxtextbox cursor to the right                  //
    ////////////////////////////////////////////////////////////////////////////
    moveCursorRight: function()
    {
        if (this.selected)
        {
            if (this.selection)
            {
                if (this.holdShift)
                {
                    if (this.cursorPos < this.guipxtext.getLength())
                    {
                        // Extend selection to the right
                        ++this.cursorPos;
                        this.cursorOffset = this.guipxtext.getCharPos(
                            this.cursorPos
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guipxtext.getCharPos(
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
                    this.cursorOffset = this.guipxtext.getCharPos(
                        this.cursorPos
                    );
                    this.selection = false;
                }
            }
            else
            {
                if (this.cursorPos < this.guipxtext.getLength())
                {
                    if (this.holdShift)
                    {
                        // Select character to the right
                        ++this.cursorPos;
                        this.cursorOffset = this.guipxtext.getCharPos(
                            this.cursorPos
                        );
                        this.selStart = this.cursorPos-1;
                        this.selStartOffset = this.guipxtext.getCharPos(
                            this.selStart
                        );
                        this.selEnd = this.cursorPos;
                        this.selEndOffset = this.guipxtext.getCharPos(
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
                        this.cursorOffset = this.guipxtext.getCharPos(
                            this.cursorPos
                        );
                    }
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addCharacter : Add character to pxtextbox                             //
    //  param character : Character to add                                    //
    ////////////////////////////////////////////////////////////////////////////
    addCharacter: function(character)
    {
        if (this.selected)
        {
            if (this.selection)
            {
                this.guipxtext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guipxtext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }

            if ((this.guipxtext.getNextWidth()) <=
                this.size.vec[0]+(WOSDefaultPxTextBoxCheckWidthOffset+
                this.size.vec[1]*WOSDefaultPxTextBoxCheckWidthFactor))
            {
                this.guipxtext.addCharacter(this.cursorPos, character);
                ++this.cursorPos;
                this.cursorOffset = this.guipxtext.getCharPos(this.cursorPos);
            }
            this.pressed = false;
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
                this.guipxtext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guipxtext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }
            else
            {
                if (this.cursorPos > 0)
                {
                    this.guipxtext.eraseCharacter(this.cursorPos);
                    --this.cursorPos;
                    this.cursorOffset = this.guipxtext.getCharPos(
                        this.cursorPos
                    );
                }
            }
            this.pressed = false;
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
                this.guipxtext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guipxtext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.size.vec[1]);
                this.selection = false;
            }
            else
            {
                if (this.cursorPos < this.guipxtext.getLength())
                {
                    this.guipxtext.eraseCharacter(this.cursorPos+1);
                    this.cursorOffset = this.guipxtext.getCharPos(
                        this.cursorPos
                    );
                }
            }
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
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;

        if (mouseX >= this.position.vec[0] &&
            mouseX <= (this.position.vec[0]+this.size.vec[0]) &&
            mouseY >= this.position.vec[1] &&
            mouseY <= (this.position.vec[1]+this.size.vec[1]))
        {
            // Compute mouse x offset
            mouseOffX = mouseX-this.position.vec[0];
            if (mouseOffX <= 0.0) mouseOffX = 0.0;
            if (mouseOffX >= this.size.vec[0]) mouseOffX = this.size.vec[0];

            // Get current character position
            for (i = 0; i <= this.guipxtext.getLength(); ++i)
            {
                curOffset = this.guipxtext.getCharPos(i);
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
        }
        else
        {
            this.selected = false;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;

        if (this.pressed)
        {
            if (mouseX >= this.position.vec[0] &&
                mouseX <= (this.position.vec[0]+this.size.vec[0]) &&
                mouseY >= this.position.vec[1] &&
                mouseY <= (this.position.vec[1]+this.size.vec[1]))
            {
                // Compute mouse x offset
                mouseOffX = mouseX-this.position.vec[0];
                if (mouseOffX <= 0.0) mouseOffX = 0.0;
                if (mouseOffX >= this.size.vec[0]) mouseOffX = this.size.vec[0];

                // Get current character position
                for (i = 0; i <= this.guipxtext.getLength(); ++i)
                {
                    curOffset = this.guipxtext.getCharPos(i);
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
            }
        }
        this.pressed = false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;
        var selSize = 0.0;

        if (this.pressed)
        {
            // Compute mouse x offset
            mouseOffX = mouseX-this.position.vec[0];
            if (mouseOffX <= 0.0) mouseOffX = 0.0;
            if (mouseOffX >= this.size.vec[0]) mouseOffX = this.size.vec[0];

            // Get current character position
            for (i = 0; i <= this.guipxtext.getLength(); ++i)
            {
                curOffset = this.guipxtext.getCharPos(i);
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
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get pxtextbox X position                                       //
    //  return : Textbox X position                                           //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get pxtextbox Y position                                       //
    //  return : Textbox Y position                                           //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get pxtextbox width                                        //
    //  return : Textbox width                                                //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get pxtextbox height                                      //
    //  return : Textbox height                                               //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get pxtextbox alpha                                        //
    //  return : Textbox alpha                                                //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getText : Get pxtextbox internal text string                          //
    //  return : Textbox internal text string                                 //
    ////////////////////////////////////////////////////////////////////////////
    getText: function()
    {
        return this.guipxtext.getText();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getLength : Get pxtextbox internal text characters length             //
    //  return : Textbox internal text length                                 //
    ////////////////////////////////////////////////////////////////////////////
    getLength: function()
    {
        return this.guipxtext.getLength();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isSelected : Get pxtextbox selected state                             //
    //  return : True if the text box is selected, false otherwise            //
    ////////////////////////////////////////////////////////////////////////////
    isSelected: function()
    {
        return this.selected;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render pxtextbox                                             //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Render box
        this.textbox.setPositionVec2(this.position);
        this.textbox.setAlpha(this.alpha);
        this.textbox.render();

        // Render text
        this.guipxtext.setPosition(
            this.position.vec[0]+
            (this.size.vec[1]*WOSDefaultPxTextBoxTextOffsetFactor),
            this.position.vec[1]
        );
        this.guipxtext.setAlpha(this.alpha);
        this.guipxtext.render();

        if (this.selected)
        {
            if (this.selection)
            {
                // Render selection
                this.textsel.setPosition(
                    this.position.vec[0]+
                    (this.size.vec[1]*WOSDefaultPxTextBoxTextOffsetFactor)+
                    Math.min(this.selStartOffset, this.selEndOffset),
                    this.position.vec[1]
                );
                this.textsel.setAlpha(this.alpha);
                this.textsel.render();
            }
            else
            {
                // Render cursor
                this.textcursor.setPosition(
                    this.position.vec[0]+
                    (this.size.vec[1]*WOSDefaultPxTextBoxTextOffsetFactor)+
                    this.cursorOffset+
                    (this.size.vec[1]*WOSDefaultPxTextBoxCursorOffsetFactor),
                    this.position.vec[1]+(this.size.vec[1]*
                    (1.0-WOSDefaultPxTextBoxCursorHeightFactor)*0.5)
                );
                this.textcursor.setAlpha(this.alpha);
                this.textcursor.render();
            }
        }
    }
};
