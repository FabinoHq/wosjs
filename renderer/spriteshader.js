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
//      renderer/spriteshader.js : Sprite shader management                   //
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
//  SpriteShader class definition                                             //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function SpriteShader(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Sprite shader
    this.shader = null;

    // Sprite shader uniforms locations
    this.uvSizeUniform = -1;
    this.uvOffsetUniform = -1;
}

SpriteShader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init sprite shader                                             //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset sprite shader
        this.uvSizeUniform = -1;
        this.uvOffsetUniform = -1;

        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Init sprite shader
        this.shader = new Shader(this.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(defaultVertexShaderSrc, spriteFragmentShaderSrc))
        {
            return false;
        }

        // Get sprite shader uniforms locations
        this.shader.bind();
        this.uvOffsetUniform = this.shader.getUniform("uvOffset");
        if (this.uvOffsetUniform == -1) { return false; }
        this.uvSizeUniform = this.shader.getUniform("uvSize");
        if (this.uvSizeUniform == -1) { return false; }
        this.shader.unbind();

        // Sprite shader successfully loaded
        return true;
    }
};
