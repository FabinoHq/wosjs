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
//      renderer/guitextbox.js : GUI TextBox management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GUI Textbox default fragment shader                                       //
////////////////////////////////////////////////////////////////////////////////
const textboxFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "   gl_FragColor = vec4(0.2, 0.2, 0.2, 0.8);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  GUI Textbox selection default fragment shader                             //
////////////////////////////////////////////////////////////////////////////////
const textselectionFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "   gl_FragColor = vec4(0.0, 0.0, 0.8, 0.3);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  GUI Textbox cursor default fragment shader                                //
////////////////////////////////////////////////////////////////////////////////
const textcursorFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "   gl_FragColor = vec4(0.8, 0.8, 0.8, 0.8);",
    "}" ].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  GuiTextBox class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function GuiTextBox(renderer)
{
    this.loaded = false;
    this.renderer = renderer;
    this.guitext = null;
    this.textbox = null;
    this.textsel = null;
    this.textcursor = null;
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
    this.width = 1;
    this.height = 1;
    this.posx = 0.0;
    this.posy = 0.0;
}

GuiTextBox.prototype = {
    init: function(width, height, text, hide, textShader)
    {
        this.loaded = false;
        this.guitext = null;
        this.textbox = null;
        this.textsel = null;
        this.textcursor = null;
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
        this.width = 1;
        this.height = 1;
        this.posx = 0.0;
        this.posy = 0.0;

        // Set width and height
        if (width !== undefined)
        {
            this.width = Math.ceil(width);
        }
        if (this.width <= 20) { this.width = 20; }
        if (this.width >= GameWidth) { this.width = GameWidth; }
        if (height !== undefined)
        {
            this.height = Math.ceil(height);
        }
        if (this.height <= 20) { this.height = 20; }
        if (this.height >= 240) { this.height = 240; }

        // Check renderer pointer
        if (!this.renderer)
        {
            return false;
        }

        // Check gl pointer
        if (!this.renderer.gl)
        {
            return false;
        }

        // Init text
        this.guitext = new GuiText(this.renderer);
        this.guitext.init(text, this.height*0.9, hide, textShader);

        // Check text size
        if (this.guitext.getWidth() > this.width-(2.0+this.height*0.08))
        {
            this.guitext.setText("");
        }

        // Init textbox
        this.textbox = new ProcSprite(this.renderer);
        this.textbox.init(textboxFragmentShaderSrc, this.width, this.height);

        // Init text selection
        this.textsel = new ProcSprite(this.renderer);
        this.textsel.init(textselectionFragmentShaderSrc, 0, this.height);

        // Init cursor
        this.textcursor = new ProcSprite(this.renderer);
        this.textcursor.init(
            textcursorFragmentShaderSrc,
            (1.0+this.height*0.05), (this.height*0.96)
        );

        // Get initial cursor position
        this.cursorPos = this.guitext.getLength();
        this.cursorOffset = this.guitext.getCharPos(this.cursorPos);

        // Textbox loaded
        this.loaded = true;
        return true;
    },

    setText: function(text)
    {
        if (this.loaded)
        {
            this.guitext.setText(text);
            // Check text size
            if (this.guitext.getWidth() > this.width-(2.0+this.height*0.08))
            {
                this.guitext.setText("");
            }

            // Update cursor
            this.cursorPos = this.guitext.getLength();
            this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
        }
    },

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

    moveCursorLeft: function()
    {
        if (this.loaded && this.selected)
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
                        this.textsel.setSize(selSize, this.height);

                        if (this.cursorPos == this.selStart)
                        {
                            this.textsel.setSize(0, this.height);
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
                        this.textsel.setSize(selSize, this.height);
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
        }
    },

    moveCursorRight: function()
    {
        if (this.loaded && this.selected)
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
                        this.textsel.setSize(selSize, this.height);

                        if (this.cursorPos == this.selStart)
                        {
                            this.textsel.setSize(0, this.height);
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
                        this.textsel.setSize(selSize, this.height);
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
        }
    },

    addCharacter: function(character)
    {
        if (this.loaded && this.selected)
        {
            if (this.selection)
            {
                this.guitext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.height);
                this.selection = false;
            }

            if (this.guitext.getNextWidth(character)
                <= this.width-(2.0+this.height*0.08))
            {
                this.guitext.addCharacter(this.cursorPos, character);
                ++this.cursorPos;
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
            }
            this.pressed = false;
        }
    },

    eraseLeft: function()
    {
        if (this.loaded && this.selected)
        {
            if (this.selection)
            {
                this.guitext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.height);
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
        }
    },

    eraseRight: function()
    {
        if (this.loaded && this.selected)
        {
            if (this.selection)
            {
                this.guitext.eraseSelection(this.selStart, this.selEnd);
                this.cursorPos = Math.min(this.selStart, this.selEnd);
                this.cursorOffset = this.guitext.getCharPos(this.cursorPos);
                this.textsel.setSize(0, this.height);
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
        }
    },

    keyPress: function(key)
    {
        switch (key)
        {
            case "Shift":
                this.holdShift = true;
                break;
            case ' ': case "Spacebar":
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

    keyRelease: function(key)
    {
        if (key == "Shift")
        {
            this.holdShift = false;
        }
    },

    mousePress: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;

        if (this.loaded)
        {
            if (mouseX >= this.posx && mouseX <= (this.posx+this.width) &&
                mouseY >= this.posy && mouseY <= (this.posy+this.height))
            {
                // Compute mouse x offset
                mouseOffX = mouseX-this.posx;
                if (mouseOffX <= 0.0) { mouseOffX = 0.0; }
                if (mouseOffX >= this.width) { mouseOffX = this.width; }

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
                this.textsel.setSize(0, this.height);
                this.selection = false;
                this.pressed = true;
                this.selected = true;
            }
            else
            {
                this.selected = false;
            }
        }
    },

    mouseRelease: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;

        if (this.loaded)
        {
            if (this.pressed)
            {
                if (mouseX >= this.posx && mouseX <= (this.posx+this.width) &&
                    mouseY >= this.posy && mouseY <= (this.posy+this.height))
                {
                    // Compute mouse x offset
                    mouseOffX = mouseX-this.posx;
                    if (mouseOffX <= 0.0) { mouseOffX = 0.0; }
                    if (mouseOffX >= this.width) { mouseOffX = this.width; }

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
                        this.textsel.setSize(0, this.height);
                        this.selection = false;
                    }
                }
            }
            this.pressed = false;
        }
    },

    mouseMove: function(mouseX, mouseY)
    {
        var i = 0;
        var mouseOffX = 0.0;
        var curOffset = 0.0;
        var selSize = 0.0;

        if (this.loaded)
        {
            if (this.pressed)
            {
                // Compute mouse x offset
                mouseOffX = mouseX-this.posx;
                if (mouseOffX <= 0.0) { mouseOffX = 0.0; }
                if (mouseOffX >= this.width) { mouseOffX = this.width; }

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
                    this.textsel.setSize(0, this.height);
                    this.selection = false;
                }
                else
                {
                    this.selEnd = this.cursorPos;
                    this.selEndOffset = this.cursorOffset;
                    selSize = Math.abs(this.selEndOffset-this.selStartOffset);
                    this.textsel.setSize(selSize, this.height);
                    this.selection = true;
                }
            }
        }
    },

    getText: function()
    {
        if (this.loaded) { return this.guitext.getText(); }
        else { return ""; }
    },

    getSelected: function()
    {
        return this.selected;
    },

    setPosition: function(x, y)
    {
        this.posx = x;
        this.posy = y;
    },

    setX: function(x)
    {
        this.posx = x;
    },

    setY: function(y)
    {
        this.posy = y;
    },

    move: function(x, y)
    {
        this.posx += x;
        this.posy += y;
    },

    moveX: function(x)
    {
        this.posx += x;
    },

    moveY: function(y)
    {
        this.posy += y;
    },

    draw: function()
    {
        if (this.loaded)
        {
            // Render box
            this.textbox.resetMatrix();
            this.textbox.moveX(this.posx);
            this.textbox.moveY(this.posy);
            this.textbox.draw(0.0, 0.0, 0.0);

            // Render text
            this.guitext.resetMatrix();
            this.guitext.moveX(this.posx+(this.height*0.04));
            this.guitext.moveY(this.posy+(this.height*0.05));
            this.guitext.draw();

            if (this.selected)
            {
                if (this.selection)
                {
                    // Render selection
                    this.textsel.resetMatrix();
                    this.textsel.moveX(
                        this.posx + (this.height*0.03) +
                        Math.min(this.selStartOffset, this.selEndOffset)
                    );
                    this.textsel.moveY(this.posy);
                    this.textsel.draw(0.0, 0.0, 0.0);
                }
                else
                {
                    // Render cursor
                    this.textcursor.resetMatrix();
                    this.textcursor.moveX(
                        this.posx+this.cursorOffset+(this.height*0.01)
                    );
                    this.textcursor.moveY(this.posy+(this.height*0.02));
                    this.textcursor.draw(0.0, 0.0, 0.0);
                }
            }
        }
    }
};

