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
//      renderer/skeletalmeshshader.js : Skeletal mesh shader                 //
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
    "attribute vec3 vertexTan;",
    "attribute vec4 bonesIndices;",
    "attribute vec4 bonesWeights;",
    "uniform mat4 worldMatrix;",
    "uniform mat4 modelMatrix;",
    "uniform mat4 shadowsMatrix;",
    "uniform float bonesCount;",
    "uniform sampler2D bonesMatrices;",
    "uniform vec3 cameraPos;",
    "uniform float lightsCount;",
    "uniform sampler2D lightsTexture;",
    "varying vec2 texCoord;",
    "varying mat3 tbnMatrix;",
    "varying vec3 surfaceLights[8];",
    "varying vec3 surfaceView;",
    "varying vec4 shadowsTexCoord;",
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
    "    return texture2D(lightsTexture, vec2(0.125, j)).x;",
    "}",
    "",
    "vec3 lightPos(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.125, j)).yzw;",
    "}",
    "",
    "void main()",
    "{",
    "    // Skin matrix",
    "    mat4 skinMatrix = boneMatrix(bonesIndices[0])*bonesWeights[0] +",
    "                       boneMatrix(bonesIndices[1])*bonesWeights[1] +",
    "                       boneMatrix(bonesIndices[2])*bonesWeights[2] +",
    "                       boneMatrix(bonesIndices[3])*bonesWeights[3];",
    "    vec4 vertPos = skinMatrix*vec4(vertexPos, 1.0);",
    "",
    "    // Shadows cast",
    "    shadowsTexCoord = shadowsMatrix*modelMatrix*vertPos;",
    "",
    "    // Dynamic lights",
    "    vec3 surfacePos = (modelMatrix*vertPos).xyz;",
    "    surfaceView = ((-cameraPos) - surfacePos);",
    "    for (int i = 0; i < 8; ++i)",
    "    {",
    "        if (float(i) < lightsCount)",
    "        {",
    "            surfaceLights[i] = lightPos(float(i)) - surfacePos;",
    "        }",
    "    }",
    "",
    "    // TBN matrix",
    "    vec3 t = normalize(",
    "        mat3(modelMatrix)*mat3(skinMatrix)*vec3(vertexTan)",
    "    );",
    "    vec3 n = normalize(",
    "        mat3(modelMatrix)*mat3(skinMatrix)*vec3(vertexNorm)",
    "    );",
    "    vec3 b = normalize(cross(n, t));",
    "",
    "    // Output",
    "    tbnMatrix = mat3(t, b, n);",
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
    "uniform sampler2D normalMap;",
    "uniform sampler2D specularMap;",
    "varying vec2 texCoord;",
    "varying mat3 tbnMatrix;",
    "varying vec3 surfaceLights[8];",
    "varying vec3 surfaceView;",
    "varying vec4 shadowsTexCoord;",
    "uniform vec3 worldLightVec;",
    "uniform vec4 worldLightColor;",
    "uniform vec4 worldLightAmbient;",
    "uniform float lightsCount;",
    "uniform sampler2D lightsTexture;",
    "uniform sampler2D shadowsTexture;",
    "uniform float specularity;",
    "uniform float alpha;",
    "",
    "float lightType(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.125, j)).x;",
    "}",
    "",
    "vec4 lightColor(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.375, j));",
    "}",
    "",
    "vec3 lightDirection(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.625, j)).xyz;",
    "}",
    "",
    "float lightRadius(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.625, j)).w;",
    "}",
    "",
    "float lightFalloffRadius(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.875, j)).x;",
    "}",
    "",
    "float lightFocal(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.875, j)).y;",
    "}",
    "",
    "float lightFalloffFocal(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/lightsCount;",
    "    return texture2D(lightsTexture, vec2(0.875, j)).z;",
    "}",
    "",
    "void main()",
    "{",
    "    vec4 texColor = texture2D(texture, texCoord);",
    "    if ((texColor.a*alpha) <= 0.0) discard;",
    "    vec4 outColor = texColor;",
    "",
    "    // Normal map",
    "    vec3 normalTex = 2.0*(texture2D(normalMap, texCoord).rgb)-1.0;",
    "    vec3 pNormal = normalize(tbnMatrix*normalTex);",
    "",
    "    // Specular map",
    "    vec3 specularTex = texture2D(specularMap, texCoord).rgb;",
    "",
    "    // World light",
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
    "            // Point light and Spot light",
    "            vec3 surfaceLight = normalize(surfaceLights[i]);",
    "            vec3 halfSurface = normalize(surfaceLight + vSurface);",
    "            float curLight = clamp(dot(pNormal, surfaceLight), 0.0, 1.0);",
    "            float specular = pow(",
    "                clamp(dot(pNormal, halfSurface), 0.0001, 1.0), spec",
    "            )*specularity;",
    "            vec4 lightCol = lightColor(float(i));",
    "            vec3 pointLight = lightCol.rgb*lightCol.a*curLight;",
    "            float radiusatt = smoothstep(",
    "                lightFalloffRadius(float(i)), lightRadius(float(i)),",
    "                length(surfaceLights[i])",
    "            );",
    "            pointLight *= radiusatt; specular *= radiusatt;",
    "            if (lightType(float(i)) >= 0.5)",
    "            {",
    "                // Spot light",
    "                float focalatt = smoothstep(",
    "                    lightFalloffFocal(float(i)), lightFocal(float(i)),",
    "                    dot(surfaceLight, lightDirection(float(i)))",
    "                );",
    "                pointLight *= focalatt; specular *= focalatt;",
    "            }",
    "            outColor.rgb += (texColor.rgb*pointLight);",
    "            outColor.rgb += (lightCol.rgb*specularTex*",
    "                lightCol.a*specular);",
    "        }",
    "    }",
    "",
    "    // Shadows",
    "    vec3 shadowTex = 0.5+(shadowsTexCoord.xyz/shadowsTexCoord.w)*0.5;",
    "    bool drawShadow = (shadowTex.x >= 0.0 && shadowTex.x <= 1.0 &&",
    "                      shadowTex.y >= 0.0 && shadowTex.y <= 1.0);",
    "    float projShadow = texture2D(shadowsTexture, shadowTex.xy).r;",
    "    float curDepth = shadowTex.z-0.0002;",
    "    float shadowVal = (drawShadow && (projShadow <= curDepth)) ? 0.2:1.0;",
    "    outColor.rgb *= shadowVal;",
    "",
    "    gl_FragColor = vec4(outColor.rgb, outColor.a*alpha);",
    "}",
    ""
].join("\n");
