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
//      math/vector_4.js : 4 components vector management                     //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Vector4 class definition                                                  //
//  param x : Optional X value of the vector                                  //
//  param y : Optional Y value of the vector                                  //
//  param z : Optional Z value of the vector                                  //
//  param w : Optional W value of the vector                                  //
////////////////////////////////////////////////////////////////////////////////
function Vector4(x, y, z, w)
{
    // 4 components vector representation
    this.vec = new GLArrayDataType(4);
    this.vec[0] = 0.0;
    this.vec[1] = 0.0;
    this.vec[2] = 0.0;
    this.vec[3] = 0.0;
    if (x !== undefined) this.vec[0] = x;
    if (y !== undefined) this.vec[1] = y;
    if (z !== undefined) this.vec[2] = z;
    if (w !== undefined) this.vec[3] = w;
}

Vector4.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset vector to zero                                          //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.vec[0] = 0.0;
        this.vec[1] = 0.0;
        this.vec[2] = 0.0;
        this.vec[3] = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setVector : Set vector components from a vector                       //
    //  param vector : New vector components                                  //
    ////////////////////////////////////////////////////////////////////////////
    setVector: function(vector)
    {
        this.vec[0] = vector.vec[0];
        this.vec[1] = vector.vec[1];
        this.vec[2] = vector.vec[2];
        this.vec[3] = vector.vec[3];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setXYZW : Set vector values from seperate components                  //
    //  param x : X value of the vector                                       //
    //  param y : Y value of the vector                                       //
    //  param z : Z value of the vector                                       //
    //  param w : W value of the vector                                       //
    ////////////////////////////////////////////////////////////////////////////
    setXYZW: function(x, y, z, w)
    {
        this.vec[0] = x;
        this.vec[1] = y;
        this.vec[2] = z;
        this.vec[3] = w;
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
    //  setY : Set vector Y component                                         //
    //  param y : Y component of the vector                                   //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set vector Z component                                         //
    //  param z : Z component of the vector                                   //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setW : Set vector W component                                         //
    //  param w : W component of the vector                                   //
    ////////////////////////////////////////////////////////////////////////////
    setW: function(w)
    {
        this.vec[3] = w;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get vector X component                                         //
    //  return : X component of the vector                                    //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get vector Y component                                         //
    //  return : Y component of the vector                                    //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get vector Z component                                         //
    //  return : Z component of the vector                                    //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getW : Get vector W component                                         //
    //  return : W component of the vector                                    //
    ////////////////////////////////////////////////////////////////////////////
    getW: function()
    {
        return this.vec[3];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  add : Vectorial addition                                              //
    //  param vector : Vector to add                                          //
    ////////////////////////////////////////////////////////////////////////////
    add: function(vector)
    {
        this.vec[0] += vector.vec[0];
        this.vec[1] += vector.vec[1];
        this.vec[2] += vector.vec[2];
        this.vec[3] += vector.vec[3];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addXYZW : Vectorial addition from seperate components                 //
    //  param x : Value to add to the vector's X component                    //
    //  param y : Value to add to the vector's Y component                    //
    //  param z : Value to add to the vector's Z component                    //
    //  param w : Value to add to the vector's W component                    //
    ////////////////////////////////////////////////////////////////////////////
    addXYZW: function(x, y, z, w)
    {
        this.vec[0] += x;
        this.vec[1] += y;
        this.vec[2] += z;
        this.vec[3] += w;
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
    //  addZ : Add a value to the vector's Z component                        //
    //  param z : Value to add to the vector's Z component                    //
    ////////////////////////////////////////////////////////////////////////////
    addZ: function(z)
    {
        this.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addW : Add a value to the vector's W component                        //
    //  param w : Value to add to the vector's W component                    //
    ////////////////////////////////////////////////////////////////////////////
    addW: function(w)
    {
        this.vec[3] += w;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  normalize : Normalize vector                                          //
    ////////////////////////////////////////////////////////////////////////////
    normalize: function()
    {
        var length = (this.vec[0]*this.vec[0]) +
                    (this.vec[1]*this.vec[1]) +
                    (this.vec[2]*this.vec[2]) +
                    (this.vec[3]*this.vec[3]);
        var invLength = 1.0;
        if (length > 0.0)
        {
            length = Math.sqrt(length);
            invLength = 1.0/length;
            this.vec[0] *= invLength;
            this.vec[1] *= invLength;
            this.vec[2] *= invLength;
            this.vec[3] *= invLength;
        }
    }
};
