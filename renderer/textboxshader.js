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
//      renderer/textboxshader.js : TextBox shader management                 //
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
//  TextBoxShader class definition                                            //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function TextBoxShader(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Textbox shader
    this.shader = null;

    // Textbox shader uniforms locations
}

TextBoxShader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init textbox shader                                            //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset textbox shader

        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Init textbox shader
        this.shader = new Shader(this.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(defaultVertexShaderSrc, textFragmentShaderSrc))
        {
            return false;
        }

        // Get textbox shader uniforms locations
        this.shader.bind();
        this.shader.unbind();

        // Textbox shader successfully loaded
        return true;
    }
};
