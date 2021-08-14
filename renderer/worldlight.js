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
//      renderer/worldlight.js : World light management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  WorldLight class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function WorldLight()
{
    // Light direction
    this.direction = new Vector3(0.0, 0.0, 0.0);
    // Light color
    this.color = new Vector4(0.0, 0.0, 0.0, 0.0);
    // Ambient color
    this.ambient = new Vector4(0.0, 0.0, 0.0, 0.0);
}

WorldLight.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init world light                                               //
    //  param direction : Direction of the world light                        //
    //  param color : Color of the world light                                //
    //  param ambient : Ambient color of the world light                      //
    //  return : True if world light is successfully loaded                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(direction, color, ambient)
    {
        // Reset world light
        if (!this.direction) return false;
        this.direction.reset();
        if (!this.color) return false;
        this.color.reset();
        if (!this.ambient) return false;
        this.ambient.reset();

        // Set world light direction
        if (direction) this.direction.setVector(direction);

        // Set world light color
        if (color) this.color.setVector(color);

        // Set world light ambient color
        if (ambient) this.ambient.setVector(ambient);

        // World light successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirectionVec3 : Set world light's direction from a Vector3         //
    //  param direction : Direction of the world light                        //
    ////////////////////////////////////////////////////////////////////////////
    setDirectionVec3: function(direction)
    {
        // Set world light direction
        this.direction.setXYZ(
            -direction.vec[0], -direction.vec[1], -direction.vec[2]
        );
        this.direction.normalize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirection : Set world light's direction from 3 seperate components //
    //  param x : X direction of the world light                              //
    //  param y : Y direction of the world light                              //
    //  param z : Z direction of the world light                              //
    ////////////////////////////////////////////////////////////////////////////
    setDirection: function(x, y, z)
    {
        // Set world light direction
        this.direction.setXYZ(-x, -y, -z);
        this.direction.normalize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec4 : Set world light's color from a Vector4                 //
    //  param color : Color of the world light                                //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec4: function(color)
    {
        // Set world light color
        this.color.setVector(color);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirection : Set world light's color from 4 seperate components     //
    //  param r : Red color component of the world light                      //
    //  param g : Green color component of the world light                    //
    //  param b : Blue color component of the world light                     //
    //  param a : Alpha color component of the world light                    //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b, a)
    {
        // Set world light color
        this.color.setXYZW(r, g, b, a);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec4 : Set world light's ambient color from a Vector4         //
    //  param ambient : Ambient color of the world light                      //
    ////////////////////////////////////////////////////////////////////////////
    setAmbientVec4: function(ambient)
    {
        // Set world light ambient color
        this.ambient.setVector(ambient);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDirection : Set world light's ambient color                        //
    //  param r : Red ambient color component of the world light              //
    //  param g : Green ambient color component of the world light            //
    //  param b : Blue ambient color component of the world light             //
    //  param a : Alpha ambient color component of the world light            //
    ////////////////////////////////////////////////////////////////////////////
    setAmbient: function(r, g, b, a)
    {
        // Set world light ambient color
        this.ambient.setXYZW(r, g, b, a);
    }
};
