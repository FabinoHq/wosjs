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
//      renderer/freeflycam.js : Free fly camera management                   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  FreeflyCam class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function FreeflyCam()
{
    // Freefly camera matrices
    this.projMatrix = new Matrix4x4();
    this.viewMatrix = new Matrix4x4();

    // Freefly camera position
    this.position = new Vector3(0.0, 0.0, 0.0);

    // Freefly camera angles
    this.angles = new Vector3(0.0, 0.0, 0.0);

    // Freefly camera fovy
    this.fovy = 90.0;

    // Freefly camera near and far planes
    this.nearPlane = 0.001;
    this.farPlane = 1000.0;

    // Freefly camera speed
    this.speed = 1.0;

    // Freefly camera movement vectors
    this.target = new Vector3(0.0, 0.0, 0.0);
    this.upward = new Vector3(0.0, 1.0, 0.0);
    this.cross = new Vector3(0.0, 0.0, 0.0);

    // Freefly camera key states
    this.forward = false;
    this.backward = false;
    this.leftward = false;
    this.rightward = false;
}

FreeflyCam.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset the freefly camera                                      //
    //  return : True if freefly camera is successfully reset                 //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        // Reset freefly camera
        if (!this.projMatrix) return false;
        this.projMatrix.setIdentity();
        if (!this.viewMatrix) return false;
        this.viewMatrix.setIdentity();
        if (!this.position) return false;
        this.position.reset();
        if (!this.angles) return false;
        this.angles.reset();
        this.fovy = 90.0;
        this.nearPlane = 0.001;
        this.farPlane = 1000.0;
        this.speed = 1.0;
        if (!this.target) return false;
        this.target.reset();
        if (!this.upward) return false;
        this.upward.setXYZ(0.0, 1.0, 0.0);
        if (!this.cross) return false;
        this.cross.reset();
        this.forward = false;
        this.backward = false;
        this.leftward = false;
        this.rightward = false;

        // Freefly camera sucessfully reset
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute the freefly camera matrix                           //
    //  param ratio : Ratio of the rendering zone                             //
    //  param frametime : Frametime to compute freefly camera movements       //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(ratio, frametime)
    {
        // Compute freefly camera speed
        var speed = this.speed*frametime;
        var crossSpeed = speed*Math.SQRT1_2;

        // Compute freefly camera target
        this.target.vec[0] = Math.cos(this.angles.vec[0]*Math.PI/180.0);
        this.target.vec[0] *= Math.sin(this.angles.vec[1]*Math.PI/180.0);
        this.target.vec[1] = Math.sin(this.angles.vec[0]*Math.PI/180.0);
        this.target.vec[2] = Math.cos(this.angles.vec[0]*Math.PI/180.0);
        this.target.vec[2] *= Math.cos(this.angles.vec[1]*Math.PI/180.0);
        this.target.normalize();

        // Compute freefly camera cross product
        this.cross.crossProduct(this.target, this.upward);
        this.cross.normalize();

        // Compute keystates
        if (this.forward && !this.backward && !this.leftward && !this.rightward)
        {
            // Move forward
            this.position.vec[0] += this.target.vec[0]*speed;
            this.position.vec[1] -= this.target.vec[1]*speed;
            this.position.vec[2] += this.target.vec[2]*speed;
        }
        if (this.forward && this.leftward && this.rightward && !this.backward)
        {
            // Move forward
            this.position.vec[0] += this.target.vec[0]*speed;
            this.position.vec[1] -= this.target.vec[1]*speed;
            this.position.vec[2] += this.target.vec[2]*speed;
        }
        if (this.backward && !this.forward && !this.leftward && !this.rightward)
        {
            // Move backward
            this.position.vec[0] -= this.target.vec[0]*speed;
            this.position.vec[1] += this.target.vec[1]*speed;
            this.position.vec[2] -= this.target.vec[2]*speed;
        }
        if (this.backward && this.leftward && this.rightward && !this.forward)
        {
            // Move backward
            this.position.vec[0] -= this.target.vec[0]*speed;
            this.position.vec[1] += this.target.vec[1]*speed;
            this.position.vec[2] -= this.target.vec[2]*speed;
        }
        if (this.leftward && !this.rightward && !this.forward && !this.backward)
        {
            // Move leftward
            this.position.vec[0] += this.cross.vec[0]*speed;
            this.position.vec[1] -= this.cross.vec[1]*speed;
            this.position.vec[2] += this.cross.vec[2]*speed;
        }
        if (this.leftward && this.forward && this.backward && !this.rightward)
        {
            // Move leftward
            this.position.vec[0] += this.cross.vec[0]*speed;
            this.position.vec[1] -= this.cross.vec[1]*speed;
            this.position.vec[2] += this.cross.vec[2]*speed;
        }
        if (this.rightward && !this.leftward && !this.forward && !this.backward)
        {
            // Move rightward
            this.position.vec[0] -= this.cross.vec[0]*speed;
            this.position.vec[1] += this.cross.vec[1]*speed;
            this.position.vec[2] -= this.cross.vec[2]*speed;
        }
        if (this.rightward && this.forward && this.backward && !this.leftward)
        {
            // Move rightward
            this.position.vec[0] -= this.cross.vec[0]*speed;
            this.position.vec[1] += this.cross.vec[1]*speed;
            this.position.vec[2] -= this.cross.vec[2]*speed;
        }
        if (this.forward && this.leftward && !this.backward && !this.rightward)
        {
            // Move forward leftward
            this.position.vec[0] += this.target.vec[0]*crossSpeed;
            this.position.vec[1] -= this.target.vec[1]*crossSpeed;
            this.position.vec[2] += this.target.vec[2]*crossSpeed;
            this.position.vec[0] += this.cross.vec[0]*crossSpeed;
            this.position.vec[1] -= this.cross.vec[1]*crossSpeed;
            this.position.vec[2] += this.cross.vec[2]*crossSpeed;
        }
        if (this.forward && this.rightward && !this.backward && !this.leftward)
        {
            // Move forward rightward
            this.position.vec[0] += this.target.vec[0]*crossSpeed;
            this.position.vec[1] -= this.target.vec[1]*crossSpeed;
            this.position.vec[2] += this.target.vec[2]*crossSpeed;
            this.position.vec[0] -= this.cross.vec[0]*crossSpeed;
            this.position.vec[1] += this.cross.vec[1]*crossSpeed;
            this.position.vec[2] -= this.cross.vec[2]*crossSpeed;
        }
        if (this.backward && this.leftward && !this.forward && !this.rightward)
        {
            // Move backward leftward
            this.position.vec[0] -= this.target.vec[0]*crossSpeed;
            this.position.vec[1] += this.target.vec[1]*crossSpeed;
            this.position.vec[2] -= this.target.vec[2]*crossSpeed;
            this.position.vec[0] += this.cross.vec[0]*crossSpeed;
            this.position.vec[1] -= this.cross.vec[1]*crossSpeed;
            this.position.vec[2] += this.cross.vec[2]*crossSpeed;
        }
        if (this.backward && this.rightward && !this.leftward && !this.forward)
        {
            // Move backward rightward
            this.position.vec[0] -= this.target.vec[0]*crossSpeed;
            this.position.vec[1] += this.target.vec[1]*crossSpeed;
            this.position.vec[2] -= this.target.vec[2]*crossSpeed;
            this.position.vec[0] -= this.cross.vec[0]*crossSpeed;
            this.position.vec[1] += this.cross.vec[1]*crossSpeed;
            this.position.vec[2] -= this.cross.vec[2]*crossSpeed;
        }

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
    //  setForward : Set forward key state                                    //
    //  param forward : Forward key state                                     //
    ////////////////////////////////////////////////////////////////////////////
    setForward: function(forward)
    {
        this.forward = forward;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBackward : Set backward key state                                  //
    //  param backward : Backward key state                                   //
    ////////////////////////////////////////////////////////////////////////////
    setBackward: function(backward)
    {
        this.backward = backward;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setLeftward : Set leftward key state                                  //
    //  param leftward : Leftward key state                                   //
    ////////////////////////////////////////////////////////////////////////////
    setLeftward: function(leftward)
    {
        this.leftward = leftward;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setRightward : Set rightward key state                                //
    //  param rightward : Rightward key state                                 //
    ////////////////////////////////////////////////////////////////////////////
    setRightward: function(rightward)
    {
        this.rightward = rightward;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Mouse moved                                               //
    //  param mouseDx : Mouse X offset                                        //
    //  param mouseDy : Mouse Y offset                                        //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseDx, mouseDy)
    {
        // Set freefly camera angles
        this.angles.vec[1] -= mouseDx*0.2;
        this.angles.vec[0] -= mouseDy*0.2;

        // Clamp X freefly camera angle
        if (this.angles.vec[0] <= -89.98) { this.angles.vec[0] = -89.98; }
        if (this.angles.vec[0] >= 89.98) { this.angles.vec[0] = 89.98; }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set the freefly camera's position                       //
    //  param x : X position of the freefly camera                            //
    //  param y : Y position of the freefly camera                            //
    //  param z : Z position of the freefly camera                            //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        this.position.vec[0] = -x;
        this.position.vec[1] = -y;
        this.position.vec[2] = -z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set freefly camera's position from a vector         //
    //  param vector : 3 components vector to set freefly camera position     //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        this.position.vec[0] = -vector.vec[0];
        this.position.vec[1] = -vector.vec[1];
        this.position.vec[2] = -vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set the freefly camera's X position                            //
    //  param x : X position of the freefly camera                            //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = -x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set the freefly camera's Y position                            //
    //  param y : Y position of the freefly camera                            //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = -y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set the freefly camera's Z position                            //
    //  param z : Z position of the freefly camera                            //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = -z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Move the freefly camera                                        //
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
    //  moveVec3 : Move the freefly camera with a 3 components vector         //
    //  param vector : 3 components vector to move the freefly camera by      //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] -= vector.vec[0];
        this.position.vec[1] -= vector.vec[1];
        this.position.vec[2] -= vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Move the freefly camera on the X axis                         //
    //  param x : Value of the translation on the X axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] -= x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Move the freefly camera on the Y axis                         //
    //  param y : Value of the translation on the Y axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] -= y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Move the freefly camera on the Z axis                         //
    //  param z : Value of the translation on the Z axis                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] -= z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngles : Set freefly camera rotation angles                        //
    //  param angleX : Freefly camera X rotation angle to set in degrees      //
    //  param angleY : Freefly camera Y rotation angle to set in degrees      //
    //  param angleZ : Freefly camera Z rotation angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = -angleX;
        this.angles.vec[1] = -angleY;
        this.angles.vec[2] = -angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set freefly camera rotation angles from a vector      //
    //  param vector : 3 components vector to set rotation angles from        //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(vector)
    {
        this.angles.vec[0] = -vector.vec[0];
        this.angles.vec[1] = -vector.vec[1];
        this.angles.vec[2] = -vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set freefly camera X rotation angle                       //
    //  param angleX : Freefly camera X rotation angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = -angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set freefly camera Y rotation angle                       //
    //  param angleY : Freefly camera Y rotation angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = -angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set freefly camera Z rotation angle                       //
    //  param angleZ : Freefly camera Z rotation angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = -angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate the freefly camera along the X axis                  //
    //  param angleX : Value of the X rotation in degrees                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] -= angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate the freefly camera along the Y axis                  //
    //  param angleY : Value of the Y rotation in degrees                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleX)
    {
        this.angles.vec[1] -= angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate the freefly camera along the Z axis                  //
    //  param angleZ : Value of the Z rotation in degrees                     //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] -= angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFovy : Set the freefly camera fovy angle                           //
    //  param fovy : Value of the freefly camera fovy in degrees              //
    ////////////////////////////////////////////////////////////////////////////
    setFovy: function(fovy)
    {
        this.fovy = fovy;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNearPlane : Set the freefly camera near plane                      //
    //  param nearPlane : Value of the freefly camera near plane              //
    ////////////////////////////////////////////////////////////////////////////
    setNearPlane: function(nearPlane)
    {
        this.nearPlane = nearPlane;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFarPlane : Set the freefly amera far plane                         //
    //  param farPlane : Value of the freefly camera far plane                //
    ////////////////////////////////////////////////////////////////////////////
    setFarPlane: function(farPlane)
    {
        this.farPlane = farPlane;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get the freefly camera's X position                            //
    //  return : X position of the freefly camera                             //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get the freefly camera's Y position                            //
    //  return : Y position of the freefly camera                             //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get the freefly camera's Z position                            //
    //  return : Z position of the freefly camera                             //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.position.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get the freefly camera's X rotation angle                  //
    //  return : X rotation angle of the freefly camera                       //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get the freefly camera's Y rotation angle                 //
    //  return : Y rotation angle of the freefly camera                       //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get the freefly camera's Z rotation angle                 //
    //  return : Z rotation angle of the freefly camera                       //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
    }
};
