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
//      renderer/guitext.js : GUI Text management                             //
////////////////////////////////////////////////////////////////////////////////

// Default text fragment shader
const textFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "   float textAlpha = texture2D(texture, texCoord).a;",
    "   gl_FragColor = vec4(0.9, 0.9, 0.9, textAlpha*0.9);",
    "}" ].join("\n");

const HiddenTextPassCharacter = "\u2022";

function GuiText(renderer)
{
    this.loaded = false;
    this.renderer = renderer;
    this.vertexBuffer = null;
    this.texture = null;
    this.modelMatrix = null;
    this.shader = null;
    this.text = "";
    this.fontsize = 20.0;
    this.width = 1;
    this.height = 1;
    this.textLength = 0;
    this.charsizes = null;
    this.hidden = false;
    this.hidetext = "";
}

GuiText.prototype = {
    init: function(text, height, hide, shaderSrc)
    {
        var i = 0;
        var pixelsData = null;

        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.shader = null;
        this.text = "";
        this.fontsize = 20.0;
        this.width = 1;
        this.height = 1;
        this.textLength = 0;
        this.charsizes = null;
        this.hidden = false;
        this.hidetext = "";

        // Set hidden
        if (hide !== undefined)
        {
            this.hidden = hide;
        }

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

        // Set height
        if (height !== undefined)
        {
            this.height = Math.ceil(height);
        }
        if (this.height <= 20) { this.height = 20; }
        if (this.height >= 240) { this.height = 240; }

        // Set font size
        this.fontsize = this.height*0.8;
        if (this.fontsize <= 10.0) { this.fontsize = 10.0; }
        if (this.fontsize >= 200.0) { this.fontsize = 200.0; }

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
        
        // Create model matrix
        this.modelMatrix = new Matrix4x4();

        // Create vbo
        this.vertexBuffer = new VertexBuffer(this.renderer.gl);
        if (!this.vertexBuffer)
        {
            // Could not create vbo
            return false;
        }
        if (!this.vertexBuffer.init())
        {
            // Could not init vbo
            return false;
        }

        // Set text width
        this.width = Math.ceil(
            this.renderer.getTextWidth(this.text, this.fontsize)
        );
        if (this.width <= 1) { this.width = 1; }
        if (this.width >= GameWidth) { this.width = GameWidth; }

        // Get char sizes
        this.charsizes = new Array();
        for (i = 0; i <= this.textLength; ++i)
        {
            this.charsizes[i] = this.renderer.getTextWidth(
                this.text.substring(0, i), this.fontsize
            );
        }

        // Render text
        pixelsData = this.renderer.renderText(
            this.text, this.width, this.height, this.fontsize
        );

        // Create texture
        this.texture = this.renderer.gl.createTexture();
        if (!this.texture)
        {
            // Could not create texture
            return false;
        }
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            this.width, this.height, 0,
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

        // Update vertex buffer     
        this.vertexBuffer.setPlane(this.width, this.height);

        // Init shader
        this.shader = new Shader(this.renderer.gl);
        if (shaderSrc)
        {
            this.shader.init(defaultVertexShaderSrc, shaderSrc);
        }
        else
        {
            this.shader.init(defaultVertexShaderSrc, textFragmentShaderSrc);
        }

        // Text loaded
        this.loaded = true;
        return true;
    },

    setText: function(text)
    {
        var pixelsData = null;

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

        if (!this.loaded)
        {
            return false;
        }

        // Set text width
        this.width = Math.ceil(
            this.renderer.getTextWidth(this.text, this.fontsize)
        );
        if (this.width <= 1) { this.width = 1; }

        // Get char sizes
        this.charsizes = new Array();
        for (i = 0; i <= this.textLength; ++i)
        {
            this.charsizes[i] = this.renderer.getTextWidth(
                this.text.substring(0, i), this.fontsize
            );
        }

        // Render text
        pixelsData = this.renderer.renderText(
            this.text, this.width, this.height, this.fontsize
        );

        // Update texture data
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            this.width, this.height, 0,
            this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, pixelsData
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Update vertex buffer     
        this.vertexBuffer.setPlane(this.width, this.height);
        return true;
    },

    addCharacter: function(index, character)
    {
        if (this.loaded)
        {
            if (index <= 0) { index = 0; }
            if (index >= this.textLength) { index = this.textLength; }
            this.setText(
                this.text.substring(0, index) + character +
                this.text.substring(index, this.textLength)
            );
        }
    },

    eraseCharacter: function(index)
    {
        if (this.loaded && this.textLength > 0)
        {
            if (index <= 0) { index = 0; }
            if (index >= this.textLength) { index = this.textLength; }
            this.setText(
                this.text.substring(0, index-1) +
                this.text.substring(index, this.textLength)
            );
        }
    },

    eraseSelection: function(start, end)
    {
        var selStart = 0;
        var selEnd = 0;

        if (this.loaded)
        {
            if (start == end)
            {
                return;
            }
            else if (start < end)
            {
                selStart = start;
                selEnd = end;
            }
            else
            {
                selStart = end;
                selEnd = start;
            }

            if (selStart <= 0) { selStart = 0; }
            if (selStart >= this.textLength) { selStart = this.textLength; }
            if (selEnd <= 0) { selEnd = 0; }
            if (selEnd >= this.textLength) { selEnd = this.textLength; }
            this.setText(
                this.text.substring(0, selStart) +
                this.text.substring(selEnd, this.textLength)
            );
        }
    },

    getCharPos: function(index)
    {
        if (this.loaded)
        {
            if (index <= 0) { index = 0; }
            if (index >= this.textLength) { index = this.textLength; }
            return this.charsizes[index];
        }
    },

    getNextWidth: function(character)
    {
        var width = this.width;
        if (this.loaded)
        {
            if (this.hidden) { character = HiddenTextPassCharacter; }
            width += this.renderer.getTextWidth(character, this.fontsize);
        }
        return width;
    },

    getText: function()
    {
        if (this.hidden) { return this.hidetext; }
        else { return this.text; }
    },

    getLength: function()
    {
        return this.textLength;
    },

    getWidth: function()
    {
        return this.width;
    },

    getHeight: function()
    {
        return this.height;
    },

    getFontsize: function()
    {
        return this.fontsize;
    },

    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    draw: function()
    {
        if (this.loaded)
        {
            // Bind shader
            this.shader.bind();

            // Send shader uniforms
            this.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.shader.sendModelMatrix(this.modelMatrix);

            // Bind texture
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.texture
            );

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.draw();
            this.vertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

            // Unbind shader
            this.shader.unbind();
        }
    }
};

