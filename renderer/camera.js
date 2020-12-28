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
//      renderer/camera.js : Renderer camera management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Camera class definition                                                   //
////////////////////////////////////////////////////////////////////////////////
function Camera()
{
    // Camera matrices
    this.projMatrix = new Matrix4x4();
    this.viewMatrix = new Matrix4x4();

    // Camera position
    this.x = 0.0;
    this.y = 0.0;
    this.z = 0.0;

    // Camera angles
    this.horizontal = 0.0;
    this.vertical = 0.0;
}

Camera.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset the camera                                              //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.projMatrix.setIdentity();
        this.viewMatrix.setIdentity();
        this.x = 0.0;
        this.y = 0.0;
        this.z = 0.0;
        this.horizontal = 0.0;
        this.vertical = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute the camera matrix                                   //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(fovy, ratio, near, far)
    {
        this.projMatrix.setIdentity();
        this.projMatrix.setPerspective(fovy, ratio, near, far);
        this.viewMatrix.setIdentity();
        this.viewMatrix.rotateX(this.horizontal);
        this.viewMatrix.rotateY(this.vertical);
        this.viewMatrix.translate(this.x, this.y, this.z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Move the camera                                                //
    //  param x : Value of the translation on the X axis                      //
    //  param y : Value of the translation on the Y axis                      //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y, z)
    {
        this.x += x;
        this.y += y;
        this.z += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec3 : Move the camera with a 3 components vector                 //
    //  param vector : 3 components vector to move the camera by              //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.x += vector.vec[0];
        this.y += vector.vec[1];
        this.z += vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Move the camera on the X axis                                 //
    //  param x : Value of the translation on the X axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.x += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Move the camera on the Y axis                                 //
    //  param y : Value of the translation on the Y axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.y += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Move the camera on the Z axis                                 //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.z += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate the camera along the horizontal axis                  //
    //  param angle : Value of the rotation in degrees                        //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.horizontal += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateVertical : Rotate the camera along the vertical axis            //
    //  param angle : Value of the rotation in degrees                        //
    ////////////////////////////////////////////////////////////////////////////
    rotateVertical: function(angle)
    {
        this.vertical += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get the camera's X position                                    //
    //  return : X position of the camera                                     //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get the camera's Y position                                    //
    //  return : Y position of the camera                                     //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get the camera's Z position                                    //
    //  return : Z position of the camera                                     //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get the camera's horizontal rotation angle                 //
    //  return : Horizontal rotation angle of the camera                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.horizontal;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleVertical : Get the camera's vertical rotation angle           //
    //  return : Horizontal rotation angle of the camera                      //
    ////////////////////////////////////////////////////////////////////////////
    getAngleVertical: function()
    {
        return this.vertical;
    }
};
