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
//      renderer/pointlight.js : Point light management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  PointLight class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function PointLight()
{
    // Point light position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Point light color
    this.color = new Vector4(0.0, 0.0, 0.0, 0.0);
    // Point light radius
    this.radius = 1.0;
    // Point light falloff radius
    this.falloffRadius = 2.0;
}

PointLight.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init point light                                               //
    //  param position : Position of the point light                          //
    //  param color : Color of the point light                                //
    //  return : True if point light is successfully loaded                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(position, color)
    {
        // Reset point light
        if (!this.position) return false;
        this.position.reset();
        if (!this.color) return false;
        this.color.reset();
        this.radius = 1.0;
        this.falloffRadius = 2.0;

        // Set point light position
        if (position) this.position.setVector(position);

        // Set point light color
        if (color) this.color.setVector(color);

        // Point light successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset point light                                             //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        // Reset point light
        this.position.reset();
        this.color.reset();
        this.radius = 1.0;
        this.falloffRadius = 2.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPointLight : Set point light from another point light              //
    //  param pointLight : Point light to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setPointLight: function(pointLight)
    {
        // Set point light
        this.position.setVector(pointLight.position);
        this.color.setVector(pointLight.color);
        this.radius = pointLight.radius;
        this.falloffRadius = pointLight.falloffRadius;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirectionVec3 : Set point light's position from a Vector3          //
    //  param position : Position of the point light                          //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(position)
    {
        // Set point light position
        this.position.setVector(position);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set point light's position from 3 seperate components   //
    //  param x : X position of the point light                               //
    //  param y : Y position of the point light                               //
    //  param z : Z position of the point light                               //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        // Set point light position
        this.position.setXYZ(x, y, z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set point light's X position                                   //
    //  param x : X position of the point light                               //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        // Set point light X position
        this.position.setX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set point light's Y position                                   //
    //  param y : Y position of the point light                               //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        // Set point light Y position
        this.position.setX(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set point light's Z position                                   //
    //  param z : Z position of the point light                               //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        // Set point light Z position
        this.position.setX(z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec4 : Set point light's color from a Vector4                 //
    //  param color : Color of the point light                                //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec4: function(color)
    {
        // Set point light color
        this.color.setVector(color);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirection : Set point light's color from 4 seperate components     //
    //  param r : Red color component of the point light                      //
    //  param g : Green color component of the point light                    //
    //  param b : Blue color component of the point light                     //
    //  param a : Alpha color component of the point light                    //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b, a)
    {
        // Set point light color
        this.color.setXYZW(r, g, b, a);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setRadius : Set point light radius                                    //
    //  param radius : Radius of the point light                              //
    ////////////////////////////////////////////////////////////////////////////
    setRadius: function(radius)
    {
        // Set point light radius
        this.radius = radius;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFalloffRadius : Set point light falloff radius                     //
    //  param radius : Falloff radius of the point light                      //
    ////////////////////////////////////////////////////////////////////////////
    setFalloffRadius: function(falloffRadius)
    {
        // Set point light falloff radius
        this.falloffRadius = falloffRadius;
    }
};
