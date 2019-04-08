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
//      math/vector_2.js : 2D vector management                               //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Vector2D class definition                                                 //
////////////////////////////////////////////////////////////////////////////////
function Vector2D()
{
    // 2D vector representation
    this.x = 0.0;
    this.y = 0.0;
}

Point2D.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset vector to zero                                          //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.x = 0.0;
        this.y = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setVector : Set vector components from a vector                       //
    //  param vector : New vector components                                  //
    ////////////////////////////////////////////////////////////////////////////
    setVector: function(vector)
    {
        this.x = vector.x;
        this.y = vector.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setXY : Set vector values from seperate components                    //
    //  param X : X value of the vector                                       //
    //  param Y : Y value of the vector                                       //
    ////////////////////////////////////////////////////////////////////////////
    setXY: function(x, y)
    {
        this.x = x;
        this.y = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set vector X components                                        //
    //  param X : X components of the vector                                  //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.x = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set vector Y position                                          //
    //  param Y : Y position of the vector                                    //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.y = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get vector X position                                          //
    //  return : X position of the vector                                     //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get vector Y position                                          //
    //  return : Y position of the vector                                     //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  add : Vectorial addition                                              //
    //  param vector : Vector to add                                          //
    ////////////////////////////////////////////////////////////////////////////
    add: function(vector)
    {
        this.x += this.vector.x;
        this.y += this.vector.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addXY : Vectorial addition from seperate components                   //
    //  param x : Value to add to the vector's X component                    //
    //  param y : Value to add to the vector's Y component                    //
    ////////////////////////////////////////////////////////////////////////////
    addXY: function(x, y)
    {
        this.x += x;
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addX : Add a value to the vector's X component                        //
    //  param x : Value to add to the vector's X component                    //
    ////////////////////////////////////////////////////////////////////////////
    addX: function(x)
    {
        this.x += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addY : Add a value to the vector's Y component                        //
    //  param y : Value to add to the vector's Y component                    //
    ////////////////////////////////////////////////////////////////////////////
    addY: function(y)
    {
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  normalize : Normalize vector                                          //
    ////////////////////////////////////////////////////////////////////////////
    normalize: function()
    {
        var length = (this.x*this.x)+(this.y*this.y);
        var invLength = 1.0;
        if (length > 0.0)
        {
            length = Math.sqrt(length);
            invLength = 1.0/length;
            this.x *= invLength;
            this.y *= invLength;
        }
    }
};

