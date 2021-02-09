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
//      renderer/textshader.js : Text shader management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Text default fragment shader                                              //
////////////////////////////////////////////////////////////////////////////////
const textFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "uniform vec3 color;",
    "uniform float alpha;",
    "void main()",
    "{",
    "    float textAlpha = texture2D(texture, texCoord).a;",
    "    gl_FragColor = vec4(color, textAlpha*alpha);",
    "}" ].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  TextShader class definition                                               //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function TextShader(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Text shader
    this.shader = null;

    // Text shader uniforms locations
    this.colorUniform = -1;
    this.alphaUniform = -1;
}

TextShader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init text shader                                               //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset text shader
        this.colorUniform = -1;
        this.alphaUniform = -1;

        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Init text shader
        this.shader = new Shader(this.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(defaultVertexShaderSrc, textFragmentShaderSrc))
        {
            return false;
        }

        // Get text shader uniforms locations
        this.shader.bind();
        this.colorUniform = this.shader.getUniform("color");
        this.alphaUniform = this.shader.getUniform("alpha");
        this.shader.unbind();

        // Text shader successfully loaded
        return true;
    }
};
