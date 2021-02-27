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
    this.position = new Vector3(0.0, 0.0, 0.0);

    // Camera angles
    this.angles = new Vector3(0.0, 0.0, 0.0);

    // Camera fovy
    this.fovy = 90.0;

    // Camera near and far planes
    this.nearPlane = 0.001;
    this.farPlane = 1000.0;
}

Camera.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset the camera                                              //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        // Reset camera
        this.projMatrix.setIdentity();
        this.viewMatrix.setIdentity();
        this.position.reset();
        this.angles.reset();
        this.fovy = 90.0;
        this.nearPlane = 0.001;
        this.farPlane = 1000.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute the camera matrix                                   //
    //  param ratio : Ratio of the rendering zone                             //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(ratio)
    {
        // Compute projection matrix
        this.projMatrix.setIdentity();
        this.projMatrix.setPerspective(
            this.fovy, ratio, this.nearPlane, this.farPlane
        );

        // Compute view matrix
        this.viewMatrix.setIdentity();
        this.viewMatrix.rotateX(this.angles.vec[0]);
        this.viewMatrix.rotateY(this.angles.vec[1]);
        this.viewMatrix.rotateY(this.angles.vec[2]);
        this.viewMatrix.translateVec3(this.position);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set the camera's position                               //
    //  param x : X position of the camera                                    //
    //  param y : Y position of the camera                                    //
    //  param z : Z position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        this.position.vec[0] = -x;
        this.position.vec[1] = -y;
        this.position.vec[2] = -z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set camera's position from a vector                 //
    //  param vector : 3 components vector to set camera position             //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        this.position.vec[0] = -vector.vec[0];
        this.position.vec[1] = -vector.vec[1];
        this.position.vec[2] = -vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set the camera's X position                                    //
    //  param x : X position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = -x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set the camera's Y position                                    //
    //  param y : Y position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = -y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set the camera's Z position                                    //
    //  param z : Z position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = -z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Move the camera                                                //
    //  param x : Value of the translation on the X axis                      //
    //  param y : Value of the translation on the Y axis                      //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y, z)
    {
        this.position.vec[0] -= x;
        this.position.vec[1] -= y;
        this.position.vec[2] -= z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec3 : Move the camera with a 3 components vector                 //
    //  param vector : 3 components vector to move the camera by              //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] -= vector.vec[0];
        this.position.vec[1] -= vector.vec[1];
        this.position.vec[2] -= vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Move the camera on the X axis                                 //
    //  param x : Value of the translation on the X axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] -= x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Move the camera on the Y axis                                 //
    //  param y : Value of the translation on the Y axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] -= y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Move the camera on the Z axis                                 //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] -= z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngles : Set camera rotation angles                                //
    //  param angleX : Camera X rotation angle to set in degrees              //
    //  param angleY : Camera Y rotation angle to set in degrees              //
    //  param angleZ : Camera Z rotation angle to set in degrees              //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = -angleX;
        this.angles.vec[1] = -angleY;
        this.angles.vec[2] = -angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set camera rotation angles from a vector              //
    //  param vector : 3 components vector to set rotation angles from        //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(vector)
    {
        this.angles.vec[0] = -vector.vec[0];
        this.angles.vec[1] = -vector.vec[1];
        this.angles.vec[2] = -vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set camera X rotation angle                               //
    //  param angleX : Camera X rotation angle to set in degrees              //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = -angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set camera Y rotation angle                               //
    //  param angleY : Camera Y rotation angle to set in degrees              //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = -angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set camera Z rotation angle                               //
    //  param angleZ : Camera Z rotation angle to set in degrees              //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = -angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate the camera along the X axis                          //
    //  param angleX : Value of the X rotation in degrees                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] -= angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate the camera along the Y axis                          //
    //  param angleY : Value of the Y rotation in degrees                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleX)
    {
        this.angles.vec[1] -= angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate the camera along the Z axis                          //
    //  param angleZ : Value of the Z rotation in degrees                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] -= angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFovy : Set the camera fovy angle                                   //
    //  param fovy : Value of the camera fovy in degrees                      //
    ////////////////////////////////////////////////////////////////////////////
    setFovy: function(fovy)
    {
        this.fovy = fovy;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNearPlane : Set the camera near plane                              //
    //  param nearPlane : Value of the camera near plane                      //
    ////////////////////////////////////////////////////////////////////////////
    setNearPlane: function(nearPlane)
    {
        this.nearPlane = nearPlane;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFarPlane : Set the camera far plane                                //
    //  param farPlane : Value of the camera far plane                        //
    ////////////////////////////////////////////////////////////////////////////
    setFarPlane: function(farPlane)
    {
        this.farPlane = farPlane;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get the camera's X position                                    //
    //  return : X position of the camera                                     //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get the camera's Y position                                    //
    //  return : Y position of the camera                                     //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get the camera's Z position                                    //
    //  return : Z position of the camera                                     //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.position.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get the camera's X rotation angle                          //
    //  return : X rotation angle of the camera                               //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get the camera's Y rotation angle                         //
    //  return : Y rotation angle of the camera                               //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get the camera's Z rotation angle                         //
    //  return : Z rotation angle of the camera                               //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
    }
};
