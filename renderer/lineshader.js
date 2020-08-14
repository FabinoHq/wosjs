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
//      renderer/lineshader.js : Line shader management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Line fragment shader                                                      //
////////////////////////////////////////////////////////////////////////////////
const lineFragmentShaderSrc = [
    "precision mediump float;",
    "varying vec2 texCoord;",
    "uniform vec3 color;",
    "uniform float alpha;",
    "uniform float ratio;",
    "uniform float smooth;",
    "void main()",
    "{",
    "    vec2 smoothed = clamp(abs(1.0-(abs(texCoord-0.5)*2.0))*",
    "        (vec2(ratio, 1.0)/smooth), 0.0, 1.0);",
    "    gl_FragColor = vec4(color, smoothed.x*smoothed.y*alpha);",
    "}"
].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  LineShader class definition                                               //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function LineShader(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Line shader
    this.shader = null;

    // Line shader uniforms locations
    this.colorUniform = -1;
    this.alphaUniform = -1;
    this.ratioUniform = -1;
    this.smoothUniform = -1;
}

LineShader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init line shader                                               //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset line shader
        this.colorUniform = -1;
        this.alphaUniform = -1;
        this.ratioUniform = -1;
        this.offsetUniform = -1;

        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Init line shader
        this.shader = new Shader(this.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(defaultVertexShaderSrc, lineFragmentShaderSrc))
        {
            return false;
        }

        // Get line shader uniforms locations
        this.shader.bind();
        this.colorUniform = this.shader.getUniform("color");
        this.alphaUniform = this.shader.getUniform("alpha");
        this.ratioUniform = this.shader.getUniform("ratio");
        this.smoothUniform = this.shader.getUniform("smooth");
        this.shader.unbind();

        // Line shader successfully loaded
        return true;
    }
};