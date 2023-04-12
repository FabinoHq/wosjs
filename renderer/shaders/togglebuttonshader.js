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
//           \\__/      \\_/    //______________/ //_____________/  JS        //
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
//    WOSjs : Web Operating System (javascript version)                       //
//      renderer/togglebuttonshader.js : Toggle button shader                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Toggle button fragment shader                                             //
////////////////////////////////////////////////////////////////////////////////
const toggleButtonFragmentShaderSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "uniform float alpha;",
    "uniform int buttonState;",
    "",
    "void main()",
    "{",
    "    vec2 buttonCoord = vec2(texCoord.x*0.5, texCoord.y*0.25);",
    "    if (buttonState == 1) { buttonCoord.x += 0.5; }",
    "    else if (buttonState == 2) { buttonCoord.y += 0.25; }",
    "    else if (buttonState == 3)",
    "    {",
    "        buttonCoord.x += 0.5; buttonCoord.y += 0.25;",
    "    }",
    "    else if (buttonState == 4) { buttonCoord.y += 0.5; }",
    "    else if (buttonState == 5)",
    "    {",
    "        buttonCoord.x += 0.5; buttonCoord.y += 0.5;",
    "    }",
    "    else if (buttonState == 6) { buttonCoord.y += 0.75; }",
    "    else if (buttonState == 7)",
    "    {",
    "        buttonCoord.x += 0.5; buttonCoord.y += 0.75;",
    "    }",
    "    vec4 texColor = texture2D(texture, buttonCoord);",
    "    gl_FragColor = vec4(texColor.rgb, texColor.a*alpha);",
    "}",
    ""
].join("\n");
