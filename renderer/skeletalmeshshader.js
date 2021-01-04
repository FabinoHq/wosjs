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
//      renderer/skeletalmeshshader.js : Skeletal mesh shader management      //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Skeletal vertex shader                                                    //
////////////////////////////////////////////////////////////////////////////////
const skeletalVertexShaderSrc = [
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexColor;",
    "uniform mat4 projMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat4 modelMatrix;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "    texCoord = vertexColor;",
    "    gl_Position = projMatrix*viewMatrix*modelMatrix*vec4(vertexPos, 1.0);",
    "}"
].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Skeletal mesh fragment shader                                             //
////////////////////////////////////////////////////////////////////////////////
const skeletalMeshFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "uniform float alpha;",
    "void main()",
    "{",
    "    vec4 texColor = texture2D(texture, texCoord);",
    "    gl_FragColor = vec4(texColor.rgb, texColor.a*alpha);",
    "}"
].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  SkeletalMeshShader class definition                                       //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function SkeletalMeshShader(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Skeletal mesh shader
    this.shader = null;

    // Skeletal mesh shader uniforms locations
    this.alphaUniform = -1;
}

SkeletalMeshShader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init skeletal mesh shader                                      //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset skeletal mesh shader
        this.alphaUniform = -1;

        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Init skeletal mesh shader
        this.shader = new Shader(this.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(
            skeletalVertexShaderSrc, skeletalMeshFragmentShaderSrc))
        {
            return false;
        }

        // Get skeletal mesh shader uniforms locations
        this.shader.bind();
        this.alphaUniform = this.shader.getUniform("alpha");
        this.shader.unbind();

        // Skeletal mesh shader successfully loaded
        return true;
    }
};
