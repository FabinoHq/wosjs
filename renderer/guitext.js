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


////////////////////////////////////////////////////////////////////////////////
//  GUI Text default vertex shader                                            //
////////////////////////////////////////////////////////////////////////////////
const textVertexShaderSrc = [
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexColor;",
    "uniform mat4 projMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat4 modelMatrix;",
    "uniform float alphaUniform;",
    "uniform vec3 colorUniform;",
    "varying vec2 texCoord;",
    "varying float alphaValue;",
    "varying vec3 colorValue;",
    "void main()",
    "{",
    "   texCoord = vertexColor;",
    "   alphaValue = alphaUniform;",
    "   colorValue = colorUniform;",
    "   gl_Position = projMatrix*viewMatrix*modelMatrix*vec4(vertexPos, 1.0);",
    "}"
].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  GUI Text default fragment shader                                          //
////////////////////////////////////////////////////////////////////////////////
const textFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "varying float alphaValue;",
    "varying vec3 colorValue;",
    "void main()",
    "{",
    "   float textAlpha = texture2D(texture, texCoord).a;",
    "   gl_FragColor = vec4(colorValue, textAlpha*alphaValue);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Default hidden pass character (unicode dot)                               //
////////////////////////////////////////////////////////////////////////////////
const HiddenTextPassCharacter = "\u2022";

////////////////////////////////////////////////////////////////////////////////
//  Default font settings                                                     //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultFontCharsizeFactor = 0.00092;


////////////////////////////////////////////////////////////////////////////////
//  GuiText class definition                                                  //
////////////////////////////////////////////////////////////////////////////////
function GuiText(renderer)
{
    // GuiText loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // GuiText VBO
    this.vertexBuffer = null;
    // GuiText generated texture
    this.texture = null;
    // GuiText model matrix
    this.modelMatrix = null;
    // GuiText shader
    this.shader = null;
    // GuiText shader color uniform location
    this.colorUniform = -1;

    // GuiText internal string
    this.text = "";

    // GuiText alpha
    this.alpha = 1.0;
    // GuiText color
    this.color = new Vector3(1.0, 1.0, 1.0);

    // GuiText parameters
    this.fontsize = 20.0;
    this.width = 1;
    this.height = 1;
    this.textLength = 0;

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
    //  param shaderSrc : Text fragment shader source to use                  //
    ////////////////////////////////////////////////////////////////////////////
    init: function(text, height, hide, shaderSrc)
    {
        var i = 0;
        var pixelsData = null;

        // Reset GuiText
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.shader = null;
        this.colorUniform = -1;
        this.text = "";
        this.alpha = 1.0;
        this.colorR = 1.0;
        this.colorG = 1.0;
        this.colorB = 1.0;
        this.fontsize = 20.0;
        this.width = 1.0;
        this.height = 1.0;
        this.textLength = 0;
        this.charsizes = null;
        this.hidden = false;
        this.hidetext = "";

        // Set hidden mode
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

        // Set text field height
        if (height !== undefined)
        {
            this.height = height;
        }
        // Clamp to minimum and maximum text field height
        if (this.height <= 0.015) { this.height = 0.015; }
        if (this.height >= 0.5) { this.height = 0.5; }

        // Set font size based on text field height
        this.fontsize = this.height*800.0;
        if (this.fontsize <= 12.0) { this.fontsize = 12.0; }
        if (this.fontsize >= 400.0) { this.fontsize = 400.0; }

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
        this.width = this.renderer.getTextWidth(
            this.text, this.fontsize
        )*WOSDefaultFontCharsizeFactor;

        // Clamp text width
        if (this.width <= 0.001) { this.width = 0.001; }
        if (this.width >= 2.0) { this.width = 2.0; }

        // Get char sizes
        this.charsizes = new Array();
        for (i = 0; i <= this.textLength; ++i)
        {
            this.charsizes[i] = this.renderer.getTextWidth(
                this.text.substring(0, i), this.fontsize
            )*WOSDefaultFontCharsizeFactor;
        }

        // Render text
        pixelsData = this.renderer.renderText(
            this.text, this.width*1100.0, this.height*920.0, this.fontsize
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
            this.width*1100.0, this.height*920.0, 0,
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
        this.vertexBuffer.setPlane(
            this.width, this.height
        );

        // Init shader
        this.shader = new Shader(this.renderer.gl);
        if (shaderSrc)
        {
            this.shader.init(textVertexShaderSrc, shaderSrc);
        }
        else
        {
            this.shader.init(textVertexShaderSrc, textFragmentShaderSrc);
        }
        this.shader.bind();

        // Init shader color uniform
        this.colorUniform = this.shader.getUniform("colorUniform");
        this.shader.sendUniformVec3(this.colorUniform, this.color.vec);

        // Text loaded
        this.shader.unbind();
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setText : Set GuiText internal text string                            //
    //  param text : Text to set                                              //
    ////////////////////////////////////////////////////////////////////////////
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
        this.width = this.renderer.getTextWidth(
            this.text, this.fontsize
        )*WOSDefaultFontCharsizeFactor;

        // Clamp text width
        if (this.width <= 0.001) { this.width = 0.001; }
        if (this.width >= 2.0) { this.width = 2.0; }

        // Get char sizes
        this.charsizes = new Array();
        for (i = 0; i <= this.textLength; ++i)
        {
            this.charsizes[i] = this.renderer.getTextWidth(
                this.text.substring(0, i), this.fontsize
            )*WOSDefaultFontCharsizeFactor;
        }

        // Render text
        pixelsData = this.renderer.renderText(
            this.text, this.width*1100.0, this.height*920.0, this.fontsize
        );

        // Update texture data
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            this.width*1100.0, this.height*920.0, 0,
            this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, pixelsData
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Update vertex buffer     
        this.vertexBuffer.setPlane(this.width, this.height);
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addCharacter : Add character to text at given index                   //
    //  param index : Index to add character at                               //
    //  param character : Character to add at specified index                 //
    ////////////////////////////////////////////////////////////////////////////
    addCharacter: function(index, character)
    {
        if (this.loaded)
        {
            // Clamp index into text length range
            if (index <= 0) { index = 0; }
            if (index >= this.textLength) { index = this.textLength; }

            // Insert character
            this.setText(
                this.text.substring(0, index) + character +
                this.text.substring(index, this.textLength)
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  eraseCharacter : Erase text character at given index                  //
    //  param index : Index to erase character at                             //
    ////////////////////////////////////////////////////////////////////////////
    eraseCharacter: function(index)
    {
        if (this.loaded && this.textLength > 0)
        {
            // Clamp index into text length range
            if (index <= 1) { index = 1; }
            if (index >= this.textLength) { index = this.textLength; }

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

        if (this.loaded)
        {
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
            if (selStart <= 0) { selStart = 0; }
            if (selStart >= this.textLength) { selStart = this.textLength; }
            if (selEnd <= 0) { selEnd = 0; }
            if (selEnd >= this.textLength) { selEnd = this.textLength; }

            // Erase characters selection
            this.setText(
                this.text.substring(0, selStart) +
                this.text.substring(selEnd, this.textLength)
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCharPos : Get character position offset at given index             //
    //  param index : Index to get character position at                      //
    //  return : character position offset                                    //
    ////////////////////////////////////////////////////////////////////////////
    getCharPos: function(index)
    {
        if (this.loaded)
        {
            // Clamp index into text length range
            if (index <= 0) { index = 0; }
            if (index >= this.textLength) { index = this.textLength; }

            // Return character size at given index
            return this.charsizes[index];
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextWidth : Get text next width when a given character is inserted //
    //  param character : Character willing to be inserted                    //
    //  return : Text width when new character is inserted                    //
    ////////////////////////////////////////////////////////////////////////////
    getNextWidth: function(character)
    {
        // Get current text width
        var width = this.width;
        if (this.loaded)
        {
            // Add new character width
            if (this.hidden) { character = HiddenTextPassCharacter; }
            width += this.renderer.getTextWidth(character, this.fontsize);
        }

        // Return total width
        return width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getText : Get text internal string                                    //
    //  return : Text internal string                                         //
    ////////////////////////////////////////////////////////////////////////////
    getText: function()
    {
        if (this.hidden) { return this.hidetext; }
        else { return this.text; }
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
    //  getWidth : Get text width                                             //
    //  return : Text width                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get text height                                           //
    //  return : Text height                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
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
    //  resetMatrix : Reset text model matrix                                 //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set text model matrix                                     //
    //  param modelMatrix : Text model matrix                                 //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
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
    //  moveX : Translate text on X axis                                      //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate text on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate text                                                  //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleX : Scale text along the X axis                                  //
    //  param scaleX : X factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleY : Scale text along the Y axis                                  //
    //  param scaleY : Y factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render text                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        if (this.loaded)
        {
            // Bind text shader
            this.shader.bind();

            // Send shader uniforms
            this.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.shader.sendModelMatrix(this.modelMatrix);
            this.shader.sendAlphaValue(this.alpha);
            this.shader.sendUniformVec3(this.colorUniform, this.color.vec);

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

            // Unbind text shader
            this.shader.unbind();
        }
    }
};

