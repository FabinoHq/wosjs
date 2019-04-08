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
//      math/point_2.js : 2D point management                                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Point2D class definition                                                  //
////////////////////////////////////////////////////////////////////////////////
function Point2D()
{
    // 2D point representation
    this.x = 0.0;
    this.y = 0.0;
}

Point2D.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset point to zero                                           //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.x = 0.0;
        this.y = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPoint : Set point position from a point                            //
    ////////////////////////////////////////////////////////////////////////////
    setPoint: function(point)
    {
        this.x = point.x;
        this.y = point.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setXY : Set point position from seperate coordinates                  //
    //  param X : X position of the point                                     //
    //  param Y : Y position of the point                                     //
    ////////////////////////////////////////////////////////////////////////////
    setXY: function(x, y)
    {
        this.x = x;
        this.y = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set point X position                                           //
    //  param X : X position of the point                                     //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.x = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set point Y position                                           //
    //  param Y : Y position of the point                                     //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.y = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get point X position                                           //
    //  return : X position of the point                                      //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get point Y position                                           //
    //  return : Y position of the point                                      //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Move point position                                            //
    //  param point : Point coordinates of the movement                       //
    ////////////////////////////////////////////////////////////////////////////
    move: function(point)
    {
        this.x += this.point.x;
        this.y += this.point.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveXY : Move point XY position                                       //
    //  param x : Point X translation value                                   //
    //  param y : Point Y translation value                                   //
    ////////////////////////////////////////////////////////////////////////////
    moveXY: function(x, y)
    {
        this.x += x;
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Move point X position                                         //
    //  param x : Point X translation value                                   //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.x += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Move point Y position                                         //
    //  param y : Point Y translation value                                   //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  normalize : Normalize point coordinates                               //
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

