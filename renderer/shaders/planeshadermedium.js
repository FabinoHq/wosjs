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
//      renderer/planeshadermedium.js : Medium plane shader                   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Medium plane vertex shader                                                //
////////////////////////////////////////////////////////////////////////////////
const planeVertexShaderMediumSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexCoord;",
    "attribute vec3 vertexNorm;",
    "uniform mat4 worldMatrix;",
    "uniform vec4 modelCol0;",
    "uniform vec4 modelCol1;",
    "uniform vec4 modelCol2;",
    "uniform vec4 modelCol3;",
    "uniform vec3 cameraPos;",
    "uniform sampler2D lightsTexture;",
    "varying vec2 texCoord;",
    "varying vec3 normal;",
    "varying vec3 surfaceLights;",
    "varying vec3 surfaceView;",
    "",
    "vec3 lightPos(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.125, j)).yzw;",
    "}",
    "",
    "void main()",
    "{",
    "    // Model matrix",
    "    mat4 modelMatrix = mat4(1.0);",
    "    modelMatrix[0] = modelCol0;",
    "    modelMatrix[1] = modelCol1;",
    "    modelMatrix[2] = modelCol2;",
    "    modelMatrix[3] = modelCol3;",
    "",
    "    // Dynamic lights",
    "    vec3 surfacePos = (modelMatrix*vec4(vertexPos, 1.0)).xyz;",
    "    surfaceView = ((-cameraPos) - surfacePos);",
    "    surfaceLights = lightPos(0.0) - surfacePos;",
    "",
    "    // Output",
    "    normal = normalize(mat3(modelMatrix)*vertexNorm);",
    "    texCoord = vertexCoord;",
    "    gl_Position = worldMatrix*modelMatrix*vec4(vertexPos, 1.0);",
    "}",
    ""
].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Medium plane fragment shader                                              //
////////////////////////////////////////////////////////////////////////////////
const planeFragmentShaderMediumSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "varying vec3 normal;",
    "varying vec3 surfaceLights;",
    "varying vec3 surfaceView;",
    "uniform vec3 worldLightVec;",
    "uniform vec4 worldLightColor;",
    "uniform vec4 worldLightAmbient;",
    "uniform sampler2D lightsTexture;",
    "uniform float specularity;",
    "uniform float alpha;",
    "uniform vec2 uvOffset;",
    "uniform vec2 uvSize;",
    "",
    "float lightOn(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.125, j)).x;",
    "}",
    "",
    "vec4 lightColor(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.375, j));",
    "}",
    "",
    "vec3 lightDirection(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.625, j)).xyz;",
    "}",
    "",
    "float lightRadius(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.625, j)).w;",
    "}",
    "",
    "float lightFalloffRadius(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.875, j)).x;",
    "}",
    "",
    "float lightFocal(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.875, j)).y;",
    "}",
    "",
    "float lightFalloffFocal(float lightIndex)",
    "{",
    "    float j = (lightIndex+0.5)/8.0;",
    "    return texture2D(lightsTexture, vec2(0.875, j)).z;",
    "}",
    "",
    "void main()",
    "{",
    "    vec4 texColor = texture2D(texture, (texCoord*uvSize)+uvOffset);",
    "    if ((texColor.a*alpha) <= 0.0) discard;",
    "    vec4 outColor = texColor;",
    "    vec3 pNormal = normalize(normal);",
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
    "    if (lightOn(0.0) >= 0.5)",
    "    {",
    "        // Point light",
    "        vec3 surfaceLight = normalize(surfaceLights);",
    "        vec3 halfSurface = normalize(surfaceLight + vSurface);",
    "        float curLight = clamp(dot(pNormal, surfaceLight), 0.0, 1.0);",
    "        float specular = pow(",
    "            clamp(dot(pNormal, halfSurface), 0.0001, 1.0), spec",
    "        )*specularity;",
    "        vec4 lightCol = lightColor(0.0);",
    "        vec3 pointLight = lightCol.rgb*lightCol.a*curLight;",
    "        float radiusatt = smoothstep(",
    "            lightFalloffRadius(0.0), lightRadius(0.0),",
    "            length(surfaceLights)",
    "        );",
    "        pointLight *= radiusatt; specular *= radiusatt;",
    "        outColor.rgb += (texColor.rgb*pointLight);",
    "        outColor.rgb += (lightCol.rgb*lightCol.a*specular);",
    "    }",
    "",
    "    gl_FragColor = vec4(outColor.rgb, outColor.a*alpha);",
    "}",
    ""
].join("\n");
