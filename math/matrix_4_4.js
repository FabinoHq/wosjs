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
//      math/matrix_4_4.js : 4x4 Matrix management                            //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Matrix4x4 class definition                                                //
////////////////////////////////////////////////////////////////////////////////
function Matrix4x4()
{
    this.matrix = new GLArrayDataType(16);
    this.matrix[0] = 1.0;
    this.matrix[1] = 0.0;
    this.matrix[2] = 0.0;
    this.matrix[3] = 0.0;
    this.matrix[4] = 0.0;
    this.matrix[5] = 1.0;
    this.matrix[6] = 0.0;
    this.matrix[7] = 0.0;
    this.matrix[8] = 0.0;
    this.matrix[9] = 0.0;
    this.matrix[10] = 1.0;
    this.matrix[11] = 0.0;
    this.matrix[12] = 0.0;
    this.matrix[13] = 0.0;
    this.matrix[14] = 0.0;
    this.matrix[15] = 1.0;
}

Matrix4x4.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  setIdentity : Set 4x4 identity matrix                                 //
    ////////////////////////////////////////////////////////////////////////////
    setIdentity: function()
    {
        this.matrix[0] = 1.0;
        this.matrix[1] = 0.0;
        this.matrix[2] = 0.0;
        this.matrix[3] = 0.0;
        this.matrix[4] = 0.0;
        this.matrix[5] = 1.0;
        this.matrix[6] = 0.0;
        this.matrix[7] = 0.0;
        this.matrix[8] = 0.0;
        this.matrix[9] = 0.0;
        this.matrix[10] = 1.0;
        this.matrix[11] = 0.0;
        this.matrix[12] = 0.0;
        this.matrix[13] = 0.0;
        this.matrix[14] = 0.0;
        this.matrix[15] = 1.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set 4x4 matrix from another matrix (copy)                 //
    //  param mat : 4x4 matrix to copy                                        //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(mat)
    {
        this.matrix[0] = mat.matrix[0];
        this.matrix[1] = mat.matrix[1];
        this.matrix[2] = mat.matrix[2];
        this.matrix[3] = mat.matrix[3];
        this.matrix[4] = mat.matrix[4];
        this.matrix[5] = mat.matrix[5];
        this.matrix[6] = mat.matrix[6];
        this.matrix[7] = mat.matrix[7];
        this.matrix[8] = mat.matrix[8];
        this.matrix[9] = mat.matrix[9];
        this.matrix[10] = mat.matrix[10];
        this.matrix[11] = mat.matrix[11];
        this.matrix[12] = mat.matrix[12];
        this.matrix[13] = mat.matrix[13];
        this.matrix[14] = mat.matrix[14];
        this.matrix[15] = mat.matrix[15];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOrthographic : Set 4x4 matrix to orthographic view matrix          //
    //  param left : Left of the orthographic view                            //
    //  param right : Right of the orthographic view                          //
    //  param top : Top of the orthographic view                              //
    //  param bottom : Bottom of the orthographic view                        //
    //  param near : Near plane of the orthographic view                      //
    //  param far : Far plane of the orthographic view                        //
    ////////////////////////////////////////////////////////////////////////////
    setOrthographic: function(left, right, top, bottom, near, far)
    {
        this.matrix[0] = 2.0/(right-left);
        this.matrix[1] = 0.0;
        this.matrix[2] = 0.0;
        this.matrix[3] = 0.0;
        this.matrix[4] = 0.0;
        this.matrix[5] = 2.0/(top-bottom);
        this.matrix[6] = 0.0;
        this.matrix[7] = 0.0;
        this.matrix[8] = 0.0;
        this.matrix[9] = 0.0;
        this.matrix[10] = -2.0/(far-near);
        this.matrix[11] = 0.0;
        this.matrix[12] = -(right+left)/(right-left);
        this.matrix[13] = -(top+bottom)/(top-bottom);
        this.matrix[14] = -(far+near)/(far-near);
        this.matrix[15] = 1.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFrustum : Set 4x4 matrix to frustum view matrix                    //
    //  param left : Left of the frustum view                                 //
    //  param right : Right of the frustum view                               //
    //  param top : Top of the frustum view                                   //
    //  param bottom : Bottom of the frustum view                             //
    //  param near : Near plane of the frustum view                           //
    //  param far : Far plane of the frustum view                             //
    ////////////////////////////////////////////////////////////////////////////
    setFrustum: function(left, right, top, bottom, near, far)
    {
        this.matrix[0] = (2.0*near)/(right-left);
        this.matrix[1] = 0.0;
        this.matrix[2] = 0.0;
        this.matrix[3] = 0.0;
        this.matrix[4] = 0.0;
        this.matrix[5] = (2.0*near)/(top-bottom);
        this.matrix[6] = 0.0;
        this.matrix[7] = 0.0;
        this.matrix[8] = (right+left)/(right-left);
        this.matrix[9] = (top+bottom)/(top-bottom);
        this.matrix[10] = -(far+near)/(far-near);
        this.matrix[11] = -1.0;
        this.matrix[12] = 0.0;
        this.matrix[13] = 0.0;
        this.matrix[14] = -(2.0*far*near)/(far-near);
        this.matrix[15] = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPerspective : Set 4x4 matrix to perspective view matrix            //
    //  param fovy : Angle of the field of view                               //
    //  param ratio : Perspective aspect ratio (width / height)               //
    //  param near : Near plane of the frustum view                           //
    //  param far : Far plane of the frustum view                             //
    ////////////////////////////////////////////////////////////////////////////
    setPerspective: function(fovy, ratio, near, far)
    {
        // Compute view frustum
        var frustHeight = (Math.tan((fovy/360.0)*Math.PI))*near;
        var frustWidth = frustHeight*ratio;
        var left = -frustWidth;
        var right = frustWidth;
        var top = frustHeight;
        var bottom = -frustHeight;
        
        // Set matrix
        this.matrix[0] = (2.0*near)/(right-left);
        this.matrix[1] = 0.0;
        this.matrix[2] = 0.0;
        this.matrix[3] = 0.0;
        this.matrix[4] = 0.0;
        this.matrix[5] = (2.0*near)/(top-bottom);
        this.matrix[6] = 0.0;
        this.matrix[7] = 0.0;
        this.matrix[8] = (right+left)/(right-left);
        this.matrix[9] = (top+bottom)/(top-bottom);
        this.matrix[10] = -(far+near)/(far-near);
        this.matrix[11] = -1.0;
        this.matrix[12] = 0.0;
        this.matrix[13] = 0.0;
        this.matrix[14] = -(2.0*far*near)/(far-near);
        this.matrix[15] = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  translate : Translate 4x4 matrix                                      //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    translate: function(x, y, z)
    {
        this.matrix[12] += (this.matrix[0]*x
                        + this.matrix[4]*y
                        + this.matrix[8]*z);

        this.matrix[13] += (this.matrix[1]*x
                        + this.matrix[5]*y
                        + this.matrix[9]*z);

        this.matrix[14] += (this.matrix[2]*x
                        + this.matrix[6]*y
                        + this.matrix[10]*z);

        this.matrix[15] += (this.matrix[3]*x
                        + this.matrix[7]*y
                        + this.matrix[11]*z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  translateVec2 : Translate 4x4 matrix with a 2 components vector       //
    //  param vector : 2 components vector to translate matrix with           //
    ////////////////////////////////////////////////////////////////////////////
    translateVec2: function(vector)
    {
        this.matrix[12] += (this.matrix[0]*vector.vec[0]
                        + this.matrix[4]*vector.vec[1]);

        this.matrix[13] += (this.matrix[1]*vector.vec[0]
                        + this.matrix[5]*vector.vec[1]);

        this.matrix[14] += (this.matrix[2]*vector.vec[0]
                        + this.matrix[6]*vector.vec[1]);

        this.matrix[15] += (this.matrix[3]*vector.vec[0]
                        + this.matrix[7]*vector.vec[1]);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  translateVec3 : Translate 4x4 matrix with a 3 components vector       //
    //  param vector : 3 components vector to translate matrix with           //
    ////////////////////////////////////////////////////////////////////////////
    translateVec3: function(vector)
    {
        this.matrix[12] += (this.matrix[0]*vector.vec[0]
                        + this.matrix[4]*vector.vec[1]
                        + this.matrix[8]*vector.vec[2]);

        this.matrix[13] += (this.matrix[1]*vector.vec[0]
                        + this.matrix[5]*vector.vec[1]
                        + this.matrix[9]*vector.vec[2]);

        this.matrix[14] += (this.matrix[2]*vector.vec[0]
                        + this.matrix[6]*vector.vec[1]
                        + this.matrix[10]*vector.vec[2]);

        this.matrix[15] += (this.matrix[3]*vector.vec[0]
                        + this.matrix[7]*vector.vec[1]
                        + this.matrix[11]*vector.vec[2]);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  translateX : Translate 4x4 matrix on X axis                           //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    translateX: function(x)
    {
        this.matrix[12] += (this.matrix[0]*x);
        this.matrix[13] += (this.matrix[1]*x);
        this.matrix[14] += (this.matrix[2]*x);
        this.matrix[15] += (this.matrix[3]*x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  translateY : Translate 4x4 matrix on Y axis                           //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    translateY: function(y)
    {
        this.matrix[12] += (this.matrix[4]*y);
        this.matrix[13] += (this.matrix[5]*y);
        this.matrix[14] += (this.matrix[6]*y);
        this.matrix[15] += (this.matrix[7]*y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  translateZ : Translate 4x4 matrix on Z axis                           //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    translateZ: function(z)
    {
        this.matrix[12] += (this.matrix[8]*z);
        this.matrix[13] += (this.matrix[9]*z);
        this.matrix[14] += (this.matrix[10]*z);
        this.matrix[15] += (this.matrix[11]*z);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate 4x4 matrix arround an arbritrary axis                 //
    //  param angle : Angle to rotate in degrees                              //
    //  param x : X axis rotation value                                       //
    //  param y : Y axis rotation value                                       //
    //  param z : Z axis rotation value                                       //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle, x, y, z)
    {
        var magnitude = Math.sqrt(x*x + y*y + z*z);
        var sinAngle = Math.sin(angle*Math.PI / 180.0);
        var cosAngle = Math.cos(angle*Math.PI / 180.0);
        var oneMinCos = 1.0-cosAngle;
        if (magnitude > 0.0)
        {
            x /= magnitude;
            y /= magnitude;
            z /= magnitude;
        }
        var rot0 = ((oneMinCos*x*x)+cosAngle);
        var rot1 = ((oneMinCos*x*y)-(z*sinAngle));
        var rot2 = ((oneMinCos*z*x)+(y*sinAngle));
        var rot4 = ((oneMinCos*x*y)+(z*sinAngle));
        var rot5 = ((oneMinCos*y*y)+cosAngle);
        var rot6 = ((oneMinCos*y*z)-(x*sinAngle));
        var rot8 = ((oneMinCos*z*x)-(y*sinAngle));
        var rot9 = ((oneMinCos*y*z)+(x*sinAngle));
        var rot10 = ((oneMinCos*z*z)+cosAngle);

        var rotMat = new Matrix4x4();

        rotMat.matrix[0] = (this.matrix[0]*rot0
                        + this.matrix[4]*rot1
                        + this.matrix[8]*rot2);

        rotMat.matrix[1] = (this.matrix[1]*rot0
                        + this.matrix[5]*rot1
                        + this.matrix[9]*rot2);

        rotMat.matrix[2] = (this.matrix[2]*rot0
                        + this.matrix[6]*rot1
                        + this.matrix[10]*rot2);

        rotMat.matrix[3] = (this.matrix[3]*rot0
                        + this.matrix[7]*rot1
                        + this.matrix[11]*rot2);

        rotMat.matrix[4] = (this.matrix[0]*rot4
                        + this.matrix[4]*rot5
                        + this.matrix[8]*rot6);

        rotMat.matrix[5] = (this.matrix[1]*rot4
                        + this.matrix[5]*rot5
                        + this.matrix[9]*rot6);

        rotMat.matrix[6] = (this.matrix[2]*rot4
                        + this.matrix[6]*rot5
                        + this.matrix[10]*rot6);

        rotMat.matrix[7] = (this.matrix[3]*rot4
                        + this.matrix[7]*rot5
                        + this.matrix[11]*rot6);

        rotMat.matrix[8] = (this.matrix[0]*rot8
                        + this.matrix[4]*rot9
                        + this.matrix[8]*rot10);

        rotMat.matrix[9] = (this.matrix[1]*rot8
                        + this.matrix[5]*rot9
                        + this.matrix[9]*rot10);

        rotMat.matrix[10] = (this.matrix[2]*rot8
                        + this.matrix[6]*rot9
                        + this.matrix[10]*rot10);

        rotMat.matrix[11] = (this.matrix[3]*rot8
                        + this.matrix[7]*rot9
                        + this.matrix[11]*rot10);

        rotMat.matrix[12] = this.matrix[12];
        rotMat.matrix[13] = this.matrix[13];
        rotMat.matrix[14] = this.matrix[14];
        rotMat.matrix[15] = this.matrix[15];

        this.matrix = rotMat.matrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate 4x4 matrix arround X axis                            //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angle)
    {
        var sinAngle = Math.sin(angle*Math.PI / 180.0);
        var cosAngle = Math.cos(angle*Math.PI / 180.0);

        var rotMat = new Matrix4x4();

        rotMat.matrix[0] = this.matrix[0];
        rotMat.matrix[1] = this.matrix[1];
        rotMat.matrix[2] = this.matrix[2];
        rotMat.matrix[3] = this.matrix[3];

        rotMat.matrix[4] = (this.matrix[4]*cosAngle
                            + this.matrix[8]*-sinAngle);

        rotMat.matrix[5] = (this.matrix[5]*cosAngle
                            + this.matrix[9]*-sinAngle);

        rotMat.matrix[6] = (this.matrix[6]*cosAngle
                            + this.matrix[10]*-sinAngle);

        rotMat.matrix[7] = (this.matrix[7]*cosAngle
                            + this.matrix[11]*-sinAngle);

        rotMat.matrix[8] = (this.matrix[4]*sinAngle
                            + this.matrix[8]*cosAngle);

        rotMat.matrix[9] = (this.matrix[5]*sinAngle
                            + this.matrix[9]*cosAngle);

        rotMat.matrix[10] = (this.matrix[6]*sinAngle
                            + this.matrix[10]*cosAngle);

        rotMat.matrix[11] = (this.matrix[7]*sinAngle
                            + this.matrix[11]*cosAngle);

        rotMat.matrix[12] = this.matrix[12];
        rotMat.matrix[13] = this.matrix[13];
        rotMat.matrix[14] = this.matrix[14];
        rotMat.matrix[15] = this.matrix[15];

        this.matrix = rotMat.matrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate 4x4 matrix arround Y axis                            //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angle)
    {
        var sinAngle = Math.sin(angle*Math.PI / 180.0);
        var cosAngle = Math.cos(angle*Math.PI / 180.0);

        var rotMat = new Matrix4x4();

        rotMat.matrix[0] = (this.matrix[0]*cosAngle
                            + this.matrix[8]*sinAngle);

        rotMat.matrix[1] = (this.matrix[1]*cosAngle
                            + this.matrix[9]*sinAngle);

        rotMat.matrix[2] = (this.matrix[2]*cosAngle
                            + this.matrix[10]*sinAngle);

        rotMat.matrix[3] = (this.matrix[3]*cosAngle
                            + this.matrix[11]*sinAngle);

        rotMat.matrix[4] = this.matrix[4];
        rotMat.matrix[5] = this.matrix[5];
        rotMat.matrix[6] = this.matrix[6];
        rotMat.matrix[7] = this.matrix[7];

        rotMat.matrix[8] = (this.matrix[0]*-sinAngle
                            + this.matrix[8]*cosAngle);

        rotMat.matrix[9] = (this.matrix[1]*-sinAngle
                            + this.matrix[9]*cosAngle);

        rotMat.matrix[10] = (this.matrix[2]*-sinAngle
                            + this.matrix[10]*cosAngle);

        rotMat.matrix[11] = (this.matrix[3]*-sinAngle
                            + this.matrix[11]*cosAngle);

        rotMat.matrix[12] = this.matrix[12];
        rotMat.matrix[13] = this.matrix[13];
        rotMat.matrix[14] = this.matrix[14];
        rotMat.matrix[15] = this.matrix[15];

        this.matrix = rotMat.matrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate 4x4 matrix arround Z axis                            //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angle)
    {
        var sinAngle = Math.sin(angle*Math.PI / 180.0);
        var cosAngle = Math.cos(angle*Math.PI / 180.0);

        var rotMat = new Matrix4x4();

        rotMat.matrix[0] = (this.matrix[0]*cosAngle
                            + this.matrix[4]*-sinAngle);

        rotMat.matrix[1] = (this.matrix[1]*cosAngle
                            + this.matrix[5]*-sinAngle);

        rotMat.matrix[2] = (this.matrix[2]*cosAngle
                            + this.matrix[6]*-sinAngle);

        rotMat.matrix[3] = (this.matrix[3]*cosAngle
                            + this.matrix[7]*-sinAngle);

        rotMat.matrix[4] = (this.matrix[0]*sinAngle
                            + this.matrix[4]*cosAngle);

        rotMat.matrix[5] = (this.matrix[1]*sinAngle
                            + this.matrix[5]*cosAngle);

        rotMat.matrix[6] = (this.matrix[2]*sinAngle
                            + this.matrix[6]*cosAngle);

        rotMat.matrix[7] = (this.matrix[3]*sinAngle
                            + this.matrix[7]*cosAngle);

        rotMat.matrix[8] = this.matrix[8];
        rotMat.matrix[9] = this.matrix[9];
        rotMat.matrix[10] = this.matrix[10];
        rotMat.matrix[11] = this.matrix[11];
        rotMat.matrix[12] = this.matrix[12];
        rotMat.matrix[13] = this.matrix[13];
        rotMat.matrix[14] = this.matrix[14];
        rotMat.matrix[15] = this.matrix[15];

        this.matrix = rotMat.matrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scale : Scale 4x4 matrix                                              //
    //  param x : X factor to scale to                                        //
    //  param y : Y factor to scale to                                        //
    //  param z : Z factor to scale to                                        //
    ////////////////////////////////////////////////////////////////////////////
    scale: function(x, y, z)
    {
        this.matrix[0] *= x;
        this.matrix[1] *= x;
        this.matrix[2] *= x;
        this.matrix[3] *= x;
        this.matrix[4] *= y;
        this.matrix[5] *= y;
        this.matrix[6] *= y;
        this.matrix[7] *= y;
        this.matrix[8] *= z;
        this.matrix[9] *= z;
        this.matrix[10] *= z;
        this.matrix[11] *= z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleVec2 : Scale 4x4 matrix by a 2 components vector                 //
    //  param vector : 2 components vector to scale matrix by                 //
    ////////////////////////////////////////////////////////////////////////////
    scaleVec2: function(vector)
    {
        this.matrix[0] *= vector.vec[0];
        this.matrix[1] *= vector.vec[0];
        this.matrix[2] *= vector.vec[0];
        this.matrix[3] *= vector.vec[0];
        this.matrix[4] *= vector.vec[1];
        this.matrix[5] *= vector.vec[1];
        this.matrix[6] *= vector.vec[1];
        this.matrix[7] *= vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleVec3 : Scale 4x4 matrix by a 3 components vector                 //
    //  param vector : 3 components vector to scale matrix by                 //
    ////////////////////////////////////////////////////////////////////////////
    scaleVec3: function(vector)
    {
        this.matrix[0] *= vector.vec[0];
        this.matrix[1] *= vector.vec[0];
        this.matrix[2] *= vector.vec[0];
        this.matrix[3] *= vector.vec[0];
        this.matrix[4] *= vector.vec[1];
        this.matrix[5] *= vector.vec[1];
        this.matrix[6] *= vector.vec[1];
        this.matrix[7] *= vector.vec[1];
        this.matrix[8] *= vector.vec[2];
        this.matrix[9] *= vector.vec[2];
        this.matrix[10] *= vector.vec[2];
        this.matrix[11] *= vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleX : Scale 4x4 matrix along the X axis                            //
    //  param x : X factor to scale to                                        //
    ////////////////////////////////////////////////////////////////////////////
    scaleX: function(x)
    {
        this.matrix[0] *= x;
        this.matrix[1] *= x;
        this.matrix[2] *= x;
        this.matrix[3] *= x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleY : Scale 4x4 matrix along the Y axis                            //
    //  param y : Y factor to scale to                                        //
    ////////////////////////////////////////////////////////////////////////////
    scaleY: function(y)
    {
        this.matrix[4] *= y;
        this.matrix[5] *= y;
        this.matrix[6] *= y;
        this.matrix[7] *= y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleZ : Scale 4x4 matrix along the Z axis                            //
    //  param z : Z factor to scale to                                        //
    ////////////////////////////////////////////////////////////////////////////
    scaleZ: function(z)
    {
        this.matrix[8] *= z;
        this.matrix[9] *= z;
        this.matrix[10] *= z;
        this.matrix[11] *= z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  multiply : Multiply 4x4 matrix by another 4x4 matrix                  //
    //  param mat : 4x4 matrix to multiply                                    //
    ////////////////////////////////////////////////////////////////////////////
    multiply: function(mat)
    {
        var multMat = new Matrix4x4();

        multMat.matrix[0] = (this.matrix[0]*mat.matrix[0]
                            + this.matrix[4]*mat.matrix[1]
                            + this.matrix[8]*mat.matrix[2]
                            + this.matrix[12]*mat.matrix[3]);

        multMat.matrix[1] = (this.matrix[1]*mat.matrix[0]
                            + this.matrix[5]*mat.matrix[1]
                            + this.matrix[9]*mat.matrix[2]
                            + this.matrix[13]*mat.matrix[3]);

        multMat.matrix[2] = (this.matrix[2]*mat.matrix[0]
                            + this.matrix[6]*mat.matrix[1]
                            + this.matrix[10]*mat.matrix[2]
                            + this.matrix[14]*mat.matrix[3]);

        multMat.matrix[3] = (this.matrix[3]*mat.matrix[0]
                            + this.matrix[7]*mat.matrix[1]
                            + this.matrix[11]*mat.matrix[2]
                            + this.matrix[15]*mat.matrix[3]);

        multMat.matrix[4] = (this.matrix[0]*mat.matrix[4]
                            + this.matrix[4]*mat.matrix[5]
                            + this.matrix[8]*mat.matrix[6]
                            + this.matrix[12]*mat.matrix[7]);

        multMat.matrix[5] = (this.matrix[1]*mat.matrix[4]
                            + this.matrix[5]*mat.matrix[5]
                            + this.matrix[9]*mat.matrix[6]
                            + this.matrix[13]*mat.matrix[7]);

        multMat.matrix[6] = (this.matrix[2]*mat.matrix[4]
                            + this.matrix[6]*mat.matrix[5]
                            + this.matrix[10]*mat.matrix[6]
                            + this.matrix[14]*mat.matrix[7]);

        multMat.matrix[7] = (this.matrix[3]*mat.matrix[4]
                            + this.matrix[7]*mat.matrix[5]
                            + this.matrix[11]*mat.matrix[6]
                            + this.matrix[15]*mat.matrix[7]);

        multMat.matrix[8] = (this.matrix[0]*mat.matrix[8]
                            + this.matrix[4]*mat.matrix[9]
                            + this.matrix[8]*mat.matrix[10]
                            + this.matrix[12]*mat.matrix[11]);

        multMat.matrix[9] = (this.matrix[1]*mat.matrix[8]
                            + this.matrix[5]*mat.matrix[9]
                            + this.matrix[9]*mat.matrix[10]
                            + this.matrix[13]*mat.matrix[11]);

        multMat.matrix[10] = (this.matrix[2]*mat.matrix[8]
                            + this.matrix[6]*mat.matrix[9]
                            + this.matrix[10]*mat.matrix[10]
                            + this.matrix[14]*mat.matrix[11]);

        multMat.matrix[11] = (this.matrix[3]*mat.matrix[8]
                            + this.matrix[7]*mat.matrix[9]
                            + this.matrix[11]*mat.matrix[10]
                            + this.matrix[15]*mat.matrix[11]);

        multMat.matrix[12] = (this.matrix[0]*mat.matrix[12]
                            + this.matrix[4]*mat.matrix[13]
                            + this.matrix[8]*mat.matrix[14]
                            + this.matrix[12]*mat.matrix[15]);

        multMat.matrix[13] = (this.matrix[1]*mat.matrix[12]
                            + this.matrix[5]*mat.matrix[13]
                            + this.matrix[9]*mat.matrix[14]
                            + this.matrix[13]*mat.matrix[15]);

        multMat.matrix[14] = (this.matrix[2]*mat.matrix[12]
                            + this.matrix[6]*mat.matrix[13]
                            + this.matrix[10]*mat.matrix[14]
                            + this.matrix[14]*mat.matrix[15]);

        multMat.matrix[15] = (this.matrix[3]*mat.matrix[12]
                            + this.matrix[7]*mat.matrix[13]
                            + this.matrix[11]*mat.matrix[14]
                            + this.matrix[15]*mat.matrix[15]);

        this.matrix = multMat.matrix;
    }
};

