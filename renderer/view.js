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
//      renderer/view.js : Renderer view management                           //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  View class definition                                                     //
////////////////////////////////////////////////////////////////////////////////
function View()
{
    // View matrix
    this.viewMatrix = new Matrix4x4();

    // View position
    this.x = 0.0;
    this.y = 0.0;

    // View angle
    this.angle = 0.0;
}

View.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset the view                                                //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.viewMatrix.setIdentity();
        this.x = 0.0;
        this.y = 0.0;
        this.angle = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute the view matrix                                     //
    ////////////////////////////////////////////////////////////////////////////
    compute: function()
    {
        this.viewMatrix.setIdentity();
        this.viewMatrix.rotateZ(this.angle);
        this.viewMatrix.translate(this.x, this.y, 0.0);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Move the view                                                  //
    //  param x : Value of the translation on the X axis                      //
    //  param y : Value of the translation on the Y axis                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.x += x;
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Move the view on the X axis                                   //
    //  param x : Value of the translation on the X axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.x += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Move the view on the Y axis                                   //
    //  param y : Value of the translation on the Y axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate the view along the Z axis                             //
    //  param angle : Value of the rotation in degrees                        //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get the view's X position                                      //
    //  return : X position of the view                                       //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get the view's Y position                                      //
    //  return : Y position of the view                                       //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get the view's rotation angle                              //
    //  return : Rotation angle of the view                                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    }
};
