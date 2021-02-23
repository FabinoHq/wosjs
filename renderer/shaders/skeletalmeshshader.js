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
//  Skeletal mesh vertex shader                                               //
////////////////////////////////////////////////////////////////////////////////
const skeletalMeshVertexShaderSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexCoord;",
    "attribute vec3 vertexNorm;",
    "attribute vec4 bonesIndices;",
    "attribute vec4 bonesWeights;",
    "uniform mat4 worldMatrix;",
    "uniform mat4 modelMatrix;",
    "uniform float bonesCount;",
    "uniform sampler2D bonesMatrices;",
    "uniform vec3 cameraPos;",
    "uniform float lightsCount;",
    "uniform sampler2D lightsTexture;",
    "varying vec2 texCoord;",
    "varying vec3 normal;",
    "varying vec3 surfaceLights[8];",
    "varying vec3 surfaceView;",
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
    "float lightType(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.25, j)).x;",
    "}",
    "",
    "vec3 lightPos(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.25, j)).yzw;",
    "}",
    "",
    "void main()",
    "{",
    "    // Vertex normal",
    "    vec4 vNormal = (",
    "        boneMatrix(bonesIndices[0])*bonesWeights[0]*vec4(vertexNorm,1.0)+",
    "        boneMatrix(bonesIndices[1])*bonesWeights[1]*vec4(vertexNorm,1.0)+",
    "        boneMatrix(bonesIndices[2])*bonesWeights[2]*vec4(vertexNorm,1.0)+",
    "        boneMatrix(bonesIndices[3])*bonesWeights[3]*vec4(vertexNorm,1.0)",
    "    );",
    "",
    "    // Vertex position",
    "    vec4 vertPos = (",
    "        boneMatrix(bonesIndices[0])*bonesWeights[0]*vec4(vertexPos, 1.0)+",
    "        boneMatrix(bonesIndices[1])*bonesWeights[1]*vec4(vertexPos, 1.0)+",
    "        boneMatrix(bonesIndices[2])*bonesWeights[2]*vec4(vertexPos, 1.0)+",
    "        boneMatrix(bonesIndices[3])*bonesWeights[3]*vec4(vertexPos, 1.0)",
    "    );",
    "",
    "    // Dynamic lights",
    "    vec3 surfacePos = (modelMatrix*vec4(vertexPos, 1.0)).xyz;",
    "    surfaceView = ((-cameraPos) - surfacePos);",
    "    for (int i = 0; i < 8; ++i)",
    "    {",
    "        if (float(i) < lightsCount)",
    "        {",
    "            surfaceLights[i] = lightPos(float(i)) - surfacePos;",
    "        }",
    "    }",
    "",
    "    normal = mat3(modelMatrix)*vec3(vNormal);",
    "    texCoord = vertexCoord;",
    "    gl_Position = worldMatrix*vertPos;",
    "    ;",
    "}",
    ""
].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Skeletal mesh fragment shader                                             //
////////////////////////////////////////////////////////////////////////////////
const skeletalMeshFragmentShaderSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "varying vec3 normal;",
    "varying vec3 surfaceLights[8];",
    "varying vec3 surfaceView;",
    "uniform vec3 worldLightVec;",
    "uniform vec4 worldLightColor;",
    "uniform vec4 worldLightAmbient;",
    "uniform float lightsCount;",
    "uniform sampler2D lightsTexture;",
    "uniform float specularity;",
    "uniform float alpha;",
    "",
    "float lightType(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.25, j)).x;",
    "}",
    "",
    "vec4 lightColor(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.75, j));",
    "}",
    "",
    "void main()",
    "{",
    "    vec4 texColor = texture2D(texture, texCoord);",
    "    vec4 outColor = texColor;",
    "",
    "    // World light",
    "    vec3 pNormal = normalize(normal);",
    "    float pLight = clamp(dot(pNormal, worldLightVec), 0.0, 1.0);",
    "    vec3 worldLight = worldLightColor.rgb*worldLightColor.a*pLight;",
    "    vec3 ambientLight = worldLightAmbient.rgb*worldLightAmbient.a;",
    "    outColor.rgb *= (ambientLight+worldLight);",
    "",
    "    // Dynamic lights",
    "    vec3 vSurface = normalize(surfaceView);",
    "    float spec = clamp((1.0-specularity)*1000.0, 5.0, 1000.0);",
    "    for (int i = 0; i < 8; ++i)",
    "    {",
    "        if (float(i) < lightsCount)",
    "        {",
    "            if (lightType(float(i)) <= 0.5)",
    "            {",
    "                // Point light",
    "                vec3 surfaceLight = normalize(surfaceLights[i]);",
    "                vec3 halfSurface = normalize(surfaceLight + vSurface);",
    "                float curLight = clamp(",
    "                    dot(pNormal, surfaceLight), 0.0, 1.0",
    "                );",
    "                float specular = pow(",
    "                    clamp(dot(pNormal, halfSurface), 0.0001, 1.0), spec",
    "                )*specularity;",
    "                vec4 lightCol = lightColor(float(i));",
    "                vec3 pointLight = lightCol.rgb*lightCol.a*curLight;",
    "                outColor.rgb += (texColor.rgb*pointLight);",
    "                outColor.rgb += (lightCol.rgb*lightCol.a*specular);",
    "            }",
    "        }",
    "    }",
    "",
    "    gl_FragColor = vec4(outColor.rgb, outColor.a*alpha);",
    "}",
    ""
].join("\n");
