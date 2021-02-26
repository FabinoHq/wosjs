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
//      renderer/skeletalmeshshaderlow.js : Low skeletal mesh shader          //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Low skeletal mesh vertex shader                                           //
////////////////////////////////////////////////////////////////////////////////
const skeletalMeshVertexShaderLowSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexCoord;",
    "attribute vec3 vertexNorm;",
    "attribute vec4 bonesIndices;",
    "attribute vec4 bonesWeights;",
    "uniform mat4 worldMatrix;",
    "uniform float bonesCount;",
    "uniform sampler2D bonesMatrices;",
    "varying vec2 texCoord;",
    "",
    "mat4 boneMatrix(float boneIndex)",
    "{",
    "    float j = (boneIndex+0.5)/bonesCount;",
    "    mat4 boneMat = mat4(texture2D(bonesMatrices, vec2(0.125, j)),",
    "                        texture2D(bonesMatrices, vec2(0.375, j)),",
    "                        texture2D(bonesMatrices, vec2(0.625, j)),",
    "                        texture2D(bonesMatrices, vec2(0.875, j)));",
    "    return boneMat;",
    "}",
    "",
    "void main()",
    "{",
    "    // Vertex position",
    "    vec4 vertPos = (",
    "        boneMatrix(bonesIndices[0])*bonesWeights[0]*vec4(vertexPos, 1.0)+",
    "        boneMatrix(bonesIndices[1])*bonesWeights[1]*vec4(vertexPos, 1.0)+",
    "        boneMatrix(bonesIndices[2])*bonesWeights[2]*vec4(vertexPos, 1.0)+",
    "        boneMatrix(bonesIndices[3])*bonesWeights[3]*vec4(vertexPos, 1.0)",
    "    );",
    "",
    "    texCoord = vertexCoord;",
    "    gl_Position = worldMatrix*vertPos;",
    "    ;",
    "}",
    ""
].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Low skeletal mesh fragment shader                                         //
////////////////////////////////////////////////////////////////////////////////
const skeletalMeshFragmentShaderLowSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "uniform float alpha;",
    "",
    "void main()",
    "{",
    "    vec4 texColor = texture2D(texture, texCoord);",
    "    gl_FragColor = vec4(texColor.rgb, texColor.a*alpha);",
    "}",
    ""
].join("\n");
