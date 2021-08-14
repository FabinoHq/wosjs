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
//      renderer/spotlight.js : Spot light management                         //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  SpotLight class definition                                                //
////////////////////////////////////////////////////////////////////////////////
function SpotLight()
{
    // Spot light position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Spot light direction
    this.direction = new Vector3(0.0, 0.0, 0.0);
    // Spot light color
    this.color = new Vector4(0.0, 0.0, 0.0, 0.0);
    // Spot light radius
    this.radius = 1.0;
    // Spot light falloff radius
    this.falloffRadius = 2.0;
    // Spot light focal
    this.focal = 0.8;
    // Spot light falloff focal
    this.falloffFocal = 0.5;
}

SpotLight.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init spot light                                                //
    //  param position : Position of the spot light                           //
    //  param direction : Direction of the spot light                         //
    //  param color : Color of the spot light                                 //
    //  return : True if spot light is successfully loaded                    //
    ////////////////////////////////////////////////////////////////////////////
    init: function(position, direction, color)
    {
        // Reset spot light
        if (!this.position) return false;
        this.position.reset();
        if (!this.direction) return false;
        this.direction.reset();
        if (!this.color) return false;
        this.color.reset();
        this.radius = 1.0;
        this.falloffRadius = 2.0;
        this.focal = 0.8;
        this.falloffFocal = 0.5;

        // Set spot light position
        if (position) this.position.setVector(position);

        // Set spot light direction
        if (direction) this.direction.setVector(direction);

        // Set spot light color
        if (color) this.color.setVector(color);

        // Spot light successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset spot light                                              //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        // Reset spot light
        this.position.reset();
        this.direction.reset();
        this.color.reset();
        this.radius = 1.0;
        this.falloffRadius = 2.0;
        this.focal = 0.8;
        this.falloffFocal = 0.5;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpotLight : Set spot light from another spot light                 //
    //  param spotLight : Spot light to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSpotLight: function(spotLight)
    {
        if (spotLight)
        {
            // Set spot light
            this.position.setVector(spotLight.position);
            this.direction.setVector(spotLight.direction);
            this.color.setVector(spotLight.color);
            this.radius = spotLight.radius;
            this.falloffRadius = spotLight.falloffRadius;
            this.focal = spotLight.focal;
            this.falloffFocal = spotLight.falloffFocal;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirectionVec3 : Set spot light's position from a Vector3           //
    //  param position : Position of the spot light                           //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(position)
    {
        // Set spot light position
        this.position.setVector(position);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set spot light's position from 3 seperate components    //
    //  param x : X position of the spot light                                //
    //  param y : Y position of the spot light                                //
    //  param z : Z position of the spot light                                //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        // Set spot light position
        this.position.setXYZ(x, y, z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set spot light's X position                                    //
    //  param x : X position of the spot light                                //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        // Set spot light X position
        this.position.setX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set spot light's Y position                                    //
    //  param y : Y position of the spot light                                //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        // Set spot light Y position
        this.position.setX(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set spot light's Z position                                    //
    //  param z : Z position of the spot light                                //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        // Set spot light Z position
        this.position.setX(z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirectionVec3 : Set spot light's direction from a Vector3          //
    //  param direction : Direction of the spot light                         //
    ////////////////////////////////////////////////////////////////////////////
    setDirectionVec3: function(direction)
    {
        // Set spot light direction
        this.direction.setXYZ(
            -direction.vec[0], -direction.vec[1], -direction.vec[2]
        );
        this.direction.normalize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirection : Set spot light's direction from 3 seperate components  //
    //  param x : X direction of the spot light                               //
    //  param y : Y direction of the spot light                               //
    //  param z : Z direction of the spot light                               //
    ////////////////////////////////////////////////////////////////////////////
    setDirection: function(x, y, z)
    {
        // Set spot light direction
        this.direction.setXYZ(-x, -y, -z);
        this.direction.normalize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec4 : Set spot light's color from a Vector4                  //
    //  param color : Color of the spot light                                 //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec4: function(color)
    {
        // Set spot light color
        this.color.setVector(color);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirection : Set spot light's color from 4 seperate components      //
    //  param r : Red color component of the spot light                       //
    //  param g : Green color component of the spot light                     //
    //  param b : Blue color component of the spot light                      //
    //  param a : Alpha color component of the spot light                     //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b, a)
    {
        // Set spot light color
        this.color.setXYZW(r, g, b, a);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setRadius : Set spot light radius                                     //
    //  param radius : Radius of the spot light                               //
    ////////////////////////////////////////////////////////////////////////////
    setRadius: function(radius)
    {
        // Set spot light radius
        this.radius = radius;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFalloffRadius : Set spot light falloff radius                      //
    //  param radius : Falloff radius of the spot light                       //
    ////////////////////////////////////////////////////////////////////////////
    setFalloffRadius: function(falloffRadius)
    {
        // Set spot light falloff radius
        this.falloffRadius = falloffRadius;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFocal : Set spot light focal                                       //
    //  param focal : Focal of the spot light                                 //
    ////////////////////////////////////////////////////////////////////////////
    setFocal: function(focal)
    {
        // Set spot light focal
        this.focal = focal;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFalloffFocal : Set spot light falloff focal                        //
    //  param falloffFocal : Falloff focal of the spot light                  //
    ////////////////////////////////////////////////////////////////////////////
    setFalloffFocal: function(falloffFocal)
    {
        // Set spot light falloff focal
        this.falloffFocal = falloffFocal;
    }
};
