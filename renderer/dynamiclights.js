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
//      renderer/dynamiclights.js : Dynamic lights management                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  WOS Max dynamic lights                                                    //
////////////////////////////////////////////////////////////////////////////////
const WOSMaxDynamicLights = 8;


////////////////////////////////////////////////////////////////////////////////
//  DynamicLights class definition                                            //
//  param renderer : Renderer pointer                                         //
////////////////////////////////////////////////////////////////////////////////
function DynamicLights(renderer)
{
    // Renderer pointer
    this.renderer = renderer;

    // Dynamic lights count
    this.lightsCount = 0;
    // Point lights
    this.pointLights = null;
    // Spot lights
    this.spotLights = null;
    // Dynamic lights texture
    this.lightsTexture = null;
    // Dynamic lights array
    this.lightsArray = null;
}

DynamicLights.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init dynamic lights                                            //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset dynamic lights
        this.lightsCount = 0;
        this.pointLights = null;
        this.spotLights = null;
        this.lightsTexture = null;
        this.lightsArray = null;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Create point lights array
        this.pointLights = new Array();

        // Create spot lights array
        this.spotLights = new Array();

        // Create dynamic lights texture
        this.lightsTexture = this.renderer.gl.createTexture();
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.lightsTexture
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MIN_FILTER,
            this.renderer.gl.NEAREST
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MAG_FILTER,
            this.renderer.gl.NEAREST
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_S,
            this.renderer.gl.CLAMP_TO_EDGE
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_T,
            this.renderer.gl.CLAMP_TO_EDGE
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Create lights array
        this.lightsArray = new GLArrayDataType();

        // Dynamic light loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clear : Clear dynamic lights                                          //
    ////////////////////////////////////////////////////////////////////////////
    clear: function()
    {
        // Clear dynamic lights
        this.lightsCount = 0;
        this.pointLights = [];
        this.spotLights = [];
        this.lightsArray = [];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addPointLight : Add new point light                                   //
    //  param pointLight : Point light to add                                 //
    ////////////////////////////////////////////////////////////////////////////
    addPointLight: function(pointLight)
    {
        if (pointLight)
        {
            this.pointLights.push(new PointLight());
            this.pointLights[this.pointLights.length-1].setPointLight(
                pointLight
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addSpotLight : Add new spot light                                     //
    //  param spotLight : Spot light to add                                   //
    ////////////////////////////////////////////////////////////////////////////
    addSpotLight: function(spotLight)
    {
        if (spotLight)
        {
            this.spotLights.push(new SpotLight());
            this.spotLights[this.spotLights.length-1].setSpotLight(spotLight);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  update : Update dynamic lights                                        //
    ////////////////////////////////////////////////////////////////////////////
    update: function()
    {
        var i = 0;

        // Update lights array
        this.lightsCount = 0;
        this.lightsArray = new GLArrayDataType(128);

        // Add point lights
        for (i = 0; i < this.pointLights.length; ++i)
        {
            if (this.lightsCount < WOSMaxDynamicLights)
            {
                // Point light type
                this.lightsArray[(this.lightsCount*16)] = 0.0;

                // Point light position
                this.lightsArray[(this.lightsCount*16)+1] =
                    this.pointLights[i].position.vec[0];
                this.lightsArray[(this.lightsCount*16)+2] =
                    this.pointLights[i].position.vec[1];
                this.lightsArray[(this.lightsCount*16)+3] =
                    this.pointLights[i].position.vec[2];

                // Point light color
                this.lightsArray[(this.lightsCount*16)+4] =
                    this.pointLights[i].color.vec[0];
                this.lightsArray[(this.lightsCount*16)+5] =
                    this.pointLights[i].color.vec[1];
                this.lightsArray[(this.lightsCount*16)+6] =
                    this.pointLights[i].color.vec[2];
                this.lightsArray[(this.lightsCount*16)+7] =
                    this.pointLights[i].color.vec[3];

                this.lightsArray[(this.lightsCount*16)+8] = 0.0;
                this.lightsArray[(this.lightsCount*16)+9] = 0.0;
                this.lightsArray[(this.lightsCount*16)+10] = 0.0;

                // Point light radius
                this.lightsArray[(this.lightsCount*16)+11] =
                    this.pointLights[i].radius;

                // Point light falloff radius
                this.lightsArray[(this.lightsCount*16)+12] =
                    this.pointLights[i].falloffRadius;

                this.lightsArray[(this.lightsCount*16)+13] = 0.0;
                this.lightsArray[(this.lightsCount*16)+14] = 0.0;
                this.lightsArray[(this.lightsCount*16)+15] = 0.0;

                ++this.lightsCount;
            }
        }

        // Add spot lights
        for (i = 0; i < this.spotLights.length; ++i)
        {
            if (this.lightsCount < WOSMaxDynamicLights)
            {
                // Spot light type
                this.lightsArray[(this.lightsCount*16)] = 1.0;

                // Spot light position
                this.lightsArray[(this.lightsCount*16)+1] =
                    this.spotLights[i].position.vec[0];
                this.lightsArray[(this.lightsCount*16)+2] =
                    this.spotLights[i].position.vec[1];
                this.lightsArray[(this.lightsCount*16)+3] =
                    this.spotLights[i].position.vec[2];

                // Spot light color
                this.lightsArray[(this.lightsCount*16)+4] =
                    this.spotLights[i].color.vec[0];
                this.lightsArray[(this.lightsCount*16)+5] =
                    this.spotLights[i].color.vec[1];
                this.lightsArray[(this.lightsCount*16)+6] =
                    this.spotLights[i].color.vec[2];
                this.lightsArray[(this.lightsCount*16)+7] =
                    this.spotLights[i].color.vec[3];

                // Spot light direction
                this.lightsArray[(this.lightsCount*16)+8] =
                    this.spotLights[i].direction.vec[0];
                this.lightsArray[(this.lightsCount*16)+9] =
                    this.spotLights[i].direction.vec[1];
                this.lightsArray[(this.lightsCount*16)+10] =
                    this.spotLights[i].direction.vec[2];

                // Spot light radius
                this.lightsArray[(this.lightsCount*16)+11] =
                    this.spotLights[i].radius;

                // Spot light falloff radius
                this.lightsArray[(this.lightsCount*16)+12] =
                    this.spotLights[i].falloffRadius;

                // Spot light focal
                this.lightsArray[(this.lightsCount*16)+13] =
                    this.spotLights[i].focal;

                // Spot light falloff focal
                this.lightsArray[(this.lightsCount*16)+14] =
                    this.spotLights[i].falloffFocal;

                this.lightsArray[(this.lightsCount*16)+15] = 0.0;

                ++this.lightsCount;
            }
        }

        // Upload dynamic lights into texture
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.lightsTexture
        );
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            4, this.lightsCount, 0, this.renderer.gl.RGBA,
            this.renderer.gl.FLOAT, this.lightsArray
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    }
};
