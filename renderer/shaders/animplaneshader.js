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
//      renderer/animplaneshader.js : Animated plane shader                   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Animated plane fragment shader                                            //
////////////////////////////////////////////////////////////////////////////////
const animPlaneFragmentShaderSrc = [
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
    "uniform sampler2D lightsTexture;",
    "uniform sampler2D shadowsTexture;",
    "uniform float specularity;",
    "uniform float alpha;",
    "uniform vec2 count;",
    "uniform vec2 current;",
    "uniform vec2 next;",
    "uniform float interp;",
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
    "    vec4 texColor = texture2D(texture, (texCoord+current)/count)*",
    "        (1.0-interp)+texture2D(texture, (texCoord+next)/count)*interp;",
    "    if ((texColor.a*alpha) <= 0.0) discard;",
    "    vec4 outColor = texColor;",
    "",
    "    // Normal map",
    "    vec3 normalTex = 2.0*(texture2D(normalMap,",
    "        (texCoord+current)/count).rgb*(1.0-interp) + texture2D(",
    "        normalMap, (texCoord+next)/count).rgb*interp)-1.0;",
    "    vec3 pNormal = normalize(tbnMatrix*normalTex);",
    "",
    "    // Specular map",
    "    vec3 specularTex = texture2D(specularMap,",
    "        (texCoord+current)/count).rgb*(1.0-interp) + texture2D(",
    "        specularMap, (texCoord+next)/count).rgb*interp;",
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
    "        if (lightOn(float(i)) >= 0.5)",
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
    "            if (i >= 4)",
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
