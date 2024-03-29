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

    // Camera movement vectors
    this.target = new Vector3(0.0, 0.0, 0.0);
    this.upward = new Vector3(0.0, 1.0, 0.0);

    // Camera fovy
    this.fovy = WOSPi2;

    // Camera near and far planes
    this.nearPlane = 0.1;
    this.farPlane = 100.0;
}

Camera.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset the camera                                              //
    //  return : True if camera is successfully reset                         //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        // Reset camera
        if (!this.projMatrix) return false;
        this.projMatrix.setIdentity();
        if (!this.viewMatrix) return false;
        this.viewMatrix.setIdentity();
        if (!this.position) return false;
        this.position.reset();
        if (!this.angles) return false;
        this.angles.reset();
        if (!this.target) return false;
        this.target.reset();
        if (!this.upward) return false;
        this.upward.setXYZ(0.0, 1.0, 0.0);
        this.fovy = WOSPi2;
        this.nearPlane = 0.1;
        this.farPlane = 100.0;

        // Camera successfully reset
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute the camera matrix                                   //
    //  param ratio : Ratio of the rendering zone                             //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(ratio)
    {
        // Compute camera target
        this.target.vec[0] = Math.cos(this.angles.vec[0]);
        this.target.vec[0] *= Math.sin(this.angles.vec[1]);
        this.target.vec[1] = Math.sin(this.angles.vec[0]);
        this.target.vec[2] = Math.cos(this.angles.vec[0]);
        this.target.vec[2] *= Math.cos(this.angles.vec[1]);
        this.target.normalize();

        // Compute projection matrix
        this.projMatrix.setIdentity();
        this.projMatrix.setPerspective(
            this.fovy, ratio, this.nearPlane, this.farPlane
        );

        // Compute view matrix
        this.viewMatrix.setIdentity();
        this.viewMatrix.rotateX(-this.angles.vec[0]);
        this.viewMatrix.rotateY(-this.angles.vec[1]);
        this.viewMatrix.rotateZ(-this.angles.vec[2]);
        this.viewMatrix.translate(
            -this.position.vec[0], -this.position.vec[1], -this.position.vec[2]
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set the camera's position                               //
    //  param x : X position of the camera                                    //
    //  param y : Y position of the camera                                    //
    //  param z : Z position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set camera's position from a vector                 //
    //  param vector : 3 components vector to set camera position             //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
        this.position.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set the camera's X position                                    //
    //  param x : X position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set the camera's Y position                                    //
    //  param y : Y position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set the camera's Z position                                    //
    //  param z : Z position of the camera                                    //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Move the camera                                                //
    //  param x : Value of the translation on the X axis                      //
    //  param y : Value of the translation on the Y axis                      //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y, z)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec3 : Move the camera with a 3 components vector                 //
    //  param vector : 3 components vector to move the camera by              //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.position.vec[2] += vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Move the camera on the X axis                                 //
    //  param x : Value of the translation on the X axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Move the camera on the Y axis                                 //
    //  param y : Value of the translation on the Y axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Move the camera on the Z axis                                 //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngles : Set camera rotation angles                                //
    //  param angleX : Camera X rotation angle to set in radians              //
    //  param angleY : Camera Y rotation angle to set in radians              //
    //  param angleZ : Camera Z rotation angle to set in radians              //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set camera rotation angles from a vector              //
    //  param vector : 3 components vector to set rotation angles from        //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(vector)
    {
        this.angles.vec[0] = vector.vec[0];
        this.angles.vec[1] = vector.vec[1];
        this.angles.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set camera X rotation angle                               //
    //  param angleX : Camera X rotation angle to set in radians              //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set camera Y rotation angle                               //
    //  param angleY : Camera Y rotation angle to set in radians              //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set camera Z rotation angle                               //
    //  param angleZ : Camera Z rotation angle to set in radians              //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate camera                                                //
    //  param angleX : X angle to rotate camera by in radians                 //
    //  param angleY : Y angle to rotate camera by in radians                 //
    //  param angleZ : Z angle to rotate camera by in radians                 //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateVec3 : Rotate camera with a vector                              //
    //  param angles : 3 component angles vector to rotate camera with        //
    ////////////////////////////////////////////////////////////////////////////
    rotateVec3: function(angles)
    {
        this.angles.vec[0] += angles.vec[0];
        this.angles.vec[1] += angles.vec[1];
        this.angles.vec[2] += angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate the camera around the X axis                         //
    //  param angleX : Value of the X rotation in radians                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate the camera around the Y axis                         //
    //  param angleY : Value of the Y rotation in radians                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate the camera around the Z axis                         //
    //  param angleZ : Value of the Z rotation in radians                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFovy : Set the camera fovy angle                                   //
    //  param fovy : Value of the camera fovy in radians                      //
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
