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
//      math/vector_2.js : 2 components vector management                     //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Vector2 class definition                                                  //
////////////////////////////////////////////////////////////////////////////////
function Vector2(x, y)
{
    // 2 components vector representation
    this.vec = new GLArrayDataType(2);
    this.vec[0] = 0.0;
    this.vec[1] = 0.0;
    if (x !== undefined) this.vec[0] = x;
    if (y !== undefined) this.vec[1] = y;
}

Vector2.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset vector to zero                                          //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.vec[0] = 0.0;
        this.vec[1] = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  set : Set vector components from a vector                             //
    //  param vector : New vector components                                  //
    ////////////////////////////////////////////////////////////////////////////
    set: function(vector)
    {
        this.vec[0] = vector.vec[0];
        this.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setXY : Set vector values from seperate components                    //
    //  param x : X value of the vector                                       //
    //  param y : Y value of the vector                                       //
    ////////////////////////////////////////////////////////////////////////////
    setXY: function(x, y)
    {
        this.vec[0] = x;
        this.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set vector X components                                        //
    //  param x : X components of the vector                                  //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set vector Y position                                          //
    //  param y : Y position of the vector                                    //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get vector X position                                          //
    //  return : X position of the vector                                     //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get vector Y position                                          //
    //  return : Y position of the vector                                     //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  add : Vectorial addition                                              //
    //  param vector : Vector to add                                          //
    ////////////////////////////////////////////////////////////////////////////
    add: function(vector)
    {
        this.vec[0] += vector.vec[0];
        this.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addXY : Vectorial addition from seperate components                   //
    //  param x : Value to add to the vector's X component                    //
    //  param y : Value to add to the vector's Y component                    //
    ////////////////////////////////////////////////////////////////////////////
    addXY: function(x, y)
    {
        this.vec[0] += x;
        this.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addX : Add a value to the vector's X component                        //
    //  param x : Value to add to the vector's X component                    //
    ////////////////////////////////////////////////////////////////////////////
    addX: function(x)
    {
        this.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addY : Add a value to the vector's Y component                        //
    //  param y : Value to add to the vector's Y component                    //
    ////////////////////////////////////////////////////////////////////////////
    addY: function(y)
    {
        this.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  normalize : Normalize vector                                          //
    ////////////////////////////////////////////////////////////////////////////
    normalize: function()
    {
        var length = (this.vec[0]*this.vec[0])+(this.vec[1]*this.vec[1]);
        var invLength = 1.0;
        if (length > 0.0)
        {
            length = Math.sqrt(length);
            invLength = 1.0/length;
            this.vec[0] *= invLength;
            this.vec[1] *= invLength;
        }
    }
};
