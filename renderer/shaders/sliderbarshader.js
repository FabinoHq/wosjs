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
//      renderer/sliderbarshader.js : SliderBar shader                        //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  SliderBar fragment shader                                                 //
////////////////////////////////////////////////////////////////////////////////
const sliderBarFragmentShaderSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "uniform vec2 uvSize;",
    "uniform float uvFactor;",
    "uniform float sliderValue;",
    "uniform float drawCursor;",
    "uniform float alpha;",
    "void main()",
    "",
    "{",
    "    float barSize = abs(uvSize.x*0.5*uvFactor);",
    "    vec2 curCoord = vec2(texCoord.x*barSize, (texCoord.y*0.5)+uvSize.y);",
    "    if (curCoord.x >= 0.25)",
    "    {",
    "        if (curCoord.x >= (barSize-0.25))",
    "        {",
    "            curCoord.x = (curCoord.x-0.5)-barSize;",
    "        }",
    "        else",
    "        {",
    "            curCoord.x = 0.125+mod(curCoord.x, 0.25);",
    "        }",
    "    }",
    "    if (barSize <= 0.25) { curCoord.x = texCoord.x*0.5; }",
    "    if (uvSize.y >= 0.25)",
    "    {",
    "        if (texCoord.x >= sliderValue) { curCoord.x = curCoord.x+0.5; }",
    "    }",
    "    if (drawCursor >= 0.5)",
    "    {",
    "        curCoord = texCoord*0.5;",
    "        curCoord.x += 0.5;",
    "    }",
    "    vec4 texColor = texture2D(texture, curCoord);",
    "    gl_FragColor = vec4(texColor.rgb, texColor.a*alpha);",
    "}",
    ""
].join("\n");
