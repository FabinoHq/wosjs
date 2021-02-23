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
        this.lightsTexture = null;
        this.lightsArray = null;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Create point lights array
        this.pointLights = new Array();

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
    //  update : Update dynamic lights                                        //
    ////////////////////////////////////////////////////////////////////////////
    update: function()
    {
        var i = 0;

        // Update lights array
        this.lightsCount = 0;
        this.lightsArray = new GLArrayDataType(this.pointLights.length*12);
        for (i = 0; i < this.pointLights.length; ++i)
        {
            // Point light type
            this.lightsArray[(this.lightsCount*12)] = 0.0;

            // Point light position
            this.lightsArray[(this.lightsCount*12)+1] =
                this.pointLights[i].position.vec[0];
            this.lightsArray[(this.lightsCount*12)+2] =
                this.pointLights[i].position.vec[1];
            this.lightsArray[(this.lightsCount*12)+3] =
                this.pointLights[i].position.vec[2];

            // Point light color
            this.lightsArray[(this.lightsCount*12)+4] =
                this.pointLights[i].color.vec[0];
            this.lightsArray[(this.lightsCount*12)+5] =
                this.pointLights[i].color.vec[1];
            this.lightsArray[(this.lightsCount*12)+6] =
                this.pointLights[i].color.vec[2];
            this.lightsArray[(this.lightsCount*12)+7] =
                this.pointLights[i].color.vec[3];

            // Point light radius
            this.lightsArray[(this.lightsCount*12)+8] =
                this.pointLights[i].radius;

            // Point light falloff radius
            this.lightsArray[(this.lightsCount*12)+9] =
                this.pointLights[i].falloffRadius;

            this.lightsArray[(this.lightsCount*12)+10] = 0.0;
            this.lightsArray[(this.lightsCount*12)+11] = 0.0;

            ++this.lightsCount;
        }

        // Upload dynamic lights into texture
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.lightsTexture
        );
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            3, this.lightsCount, 0, this.renderer.gl.RGBA,
            this.renderer.gl.FLOAT, this.lightsArray
        );
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
    }
};
