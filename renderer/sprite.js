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
//      renderer/sprite.js : Sprite management                                //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Sprite fragment shader                                                    //
////////////////////////////////////////////////////////////////////////////////
const spriteFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "varying float alphaValue;",
    "uniform vec2 uvOffset;",
    "uniform vec2 uvSize;",
    "void main()",
    "{",
    "   vec4 texColor = texture2D(texture, (texCoord*uvSize)+uvOffset);",
    "   gl_FragColor = vec4(texColor.rgb, texColor.a*alphaValue);",
    "}"
].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  Sprite class definition                                                   //
////////////////////////////////////////////////////////////////////////////////
function Sprite(renderer)
{
    // Sprite loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Sprite shader
    this.shader = null;
    // Sprite VBO
    this.vertexBuffer = null;
    // Sprite texture
    this.texture = null;
    // Sprite model matrix
    this.modelMatrix = null;
    // Sprite alpha
    this.alpha = 1.0;

    // Shader uniforms locations
    this.uvSizeUniform = -1;
    this.uvOffsetUniform = -1;

    // Sprite size
    this.width = 1.0;
    this.height = 1.0;
    // Sprite texture UV offset
    this.uvOffset = null;
    // Sprite texture UV size
    this.uvSize = null;
}

Sprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init sprite                                                    //
    //  param tex : Texture pointer                                           //
    //  param width : Sprite width                                            //
    //  param height : Sprite height                                          //
    //  param uoffset : Sprite texture U offset                               //
    //  param voffset : Sprite texture V offset                               //
    //  param usize : Sprite texture U size                                   //
    //  param vsize : Sprite texture V size                                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, width, height, uoffset, voffset, usize, vsize)
    {
        // Reset sprite
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.uvSize = new Vector2(1.0, 1.0);
        this.uvOffset = new Vector2(0.0, 0.0);
        if (width !== undefined) { this.width = width; }
        if (height !== undefined) { this.height = height; }
        if (uoffset !== undefined) { this.uvOffset.setX(uoffset); }
        if (voffset !== undefined) { this.uvOffset.setY(voffset); }
        if (usize !== undefined) { this.uvSize.setX(usize); }
        if (vsize !== undefined) { this.uvSize.setY(vsize); }

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

        // Init shader
        this.shader = new Shader(this.renderer.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(defaultVertexShaderSrc, spriteFragmentShaderSrc))
        {
            return false;
        }

        // Get shader uniforms locations
        this.shader.bind();
        this.uvOffsetUniform = this.shader.getUniform("uvOffset");
        if (this.uvOffsetUniform == -1) { return false; }
        this.uvSizeUniform = this.shader.getUniform("uvSize");
        if (this.uvSizeUniform == -1) { return false; }

        // Set shader uniforms
        this.shader.sendUniformVec2(this.uvOffsetUniform, this.uvOffset);
        this.shader.sendUniformVec2(this.uvSizeUniform, this.uvSize);
        this.shader.unbind();

        // Set texture
        this.texture = tex;
        if (!this.texture)
        {
            // Could not set texture
            return false;
        }

        // Update vertex buffer
        this.vertexBuffer.setPlane(this.width, this.height);

        // Sprite loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set sprite size                                             //
    //  param width : Sprite width to set                                     //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        // Update vertex buffer
        this.width = width;
        this.height = height;
        this.vertexBuffer.setPlane(this.width, this.height);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSubrect : Set sprite render subrectangle                           //
    //  param uoffset : Sprite texture U offset                               //
    //  param voffset : Sprite texture V offset                               //
    //  param usize : Sprite texture U size                                   //
    //  param vsize : Sprite texture V size                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSubrect: function(uoffset, voffset, usize, vsize)
    {
        // Update sprite subrect
        this.uvOffset.setXY(uoffset, voffset);
        this.uvSize.setXY(usize, vsize);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get sprite width                                           //
    //  return : Sprite width                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get sprite height                                         //
    //  return : Sprite height                                                //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetMatrix : Reset sprite model matrix                               //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set sprite model matrix                                   //
    //  param modelMatrix : Sprite model matrix                               //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set sprite alpha                                           //
    //  param alpha : Sprite alpha to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate sprite on X axis                                    //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate sprite on Y axis                                    //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate sprite                                                //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleX : Scale sprite along the X axis                                //
    //  param scaleX : X factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleY : Scale sprite along the Y axis                                //
    //  param scaleY : Y factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render sprite                                                //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        if (this.loaded)
        {
            // Bind default shader
            this.shader.bind();

            // Send shader uniforms
            this.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.shader.sendModelMatrix(this.modelMatrix);
            this.shader.sendAlphaValue(this.alpha);
            this.shader.sendUniformVec2(this.uvOffsetUniform, this.uvOffset);
            this.shader.sendUniformVec2(this.uvSizeUniform, this.uvSize);

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.shader);
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind default shader
            this.shader.unbind();
        }
    }
};

