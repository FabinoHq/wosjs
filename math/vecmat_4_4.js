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
//      math/vecmat_4_4.js : 4x4 components vectors matrix representation     //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  VecMat4x4 class definition                                                //
////////////////////////////////////////////////////////////////////////////////
function VecMat4x4()
{
    this.col0 = new GLArrayDataType(4);
    this.col1 = new GLArrayDataType(4);
    this.col2 = new GLArrayDataType(4);
    this.col3 = new GLArrayDataType(4);
    this.col0[0] = 1.0;
    this.col0[1] = 0.0;
    this.col0[2] = 0.0;
    this.col0[3] = 0.0;
    this.col1[0] = 0.0;
    this.col1[1] = 1.0;
    this.col1[2] = 0.0;
    this.col1[3] = 0.0;
    this.col2[0] = 0.0;
    this.col2[1] = 0.0;
    this.col2[2] = 1.0;
    this.col2[3] = 0.0;
    this.col3[0] = 0.0;
    this.col3[1] = 0.0;
    this.col3[2] = 0.0;
    this.col3[3] = 1.0;
}

VecMat4x4.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  setIdentity : Set 4x4 identity matrix                                 //
    ////////////////////////////////////////////////////////////////////////////
    setIdentity: function()
    {
        this.col0[0] = 1.0;
        this.col0[1] = 0.0;
        this.col0[2] = 0.0;
        this.col0[3] = 0.0;
        this.col1[0] = 0.0;
        this.col1[1] = 1.0;
        this.col1[2] = 0.0;
        this.col1[3] = 0.0;
        this.col2[0] = 0.0;
        this.col2[1] = 0.0;
        this.col2[2] = 1.0;
        this.col2[3] = 0.0;
        this.col3[0] = 0.0;
        this.col3[1] = 0.0;
        this.col3[2] = 0.0;
        this.col3[3] = 1.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set 4x4 vectors components from a 4x4 matrix              //
    //  param mat : 4x4 Matrix to set 4x4 vectors components from             //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(mat)
    {
        this.col0[0] = mat.matrix[0];
        this.col0[1] = mat.matrix[1];
        this.col0[2] = mat.matrix[2];
        this.col0[3] = mat.matrix[3];
        this.col1[0] = mat.matrix[4];
        this.col1[1] = mat.matrix[5];
        this.col1[2] = mat.matrix[6];
        this.col1[3] = mat.matrix[7];
        this.col2[0] = mat.matrix[8];
        this.col2[1] = mat.matrix[9];
        this.col2[2] = mat.matrix[10];
        this.col2[3] = mat.matrix[11];
        this.col3[0] = mat.matrix[12];
        this.col3[1] = mat.matrix[13];
        this.col3[2] = mat.matrix[14];
        this.col3[3] = mat.matrix[15];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setVectors : Set 4x4 vectors components from 4 vectors                //
    //  param col0 : Matrix colomn 0 vector                                   //
    //  param col1 : Matrix colomn 1 vector                                   //
    //  param col2 : Matrix colomn 2 vector                                   //
    //  param col3 : Matrix colomn 3 vector                                   //
    ////////////////////////////////////////////////////////////////////////////
    setVectors: function(col0, col1, col2, col3)
    {
        this.col0[0] = col0.vec[0];
        this.col0[1] = col0.vec[1];
        this.col0[2] = col0.vec[2];
        this.col0[3] = col0.vec[3];
        this.col1[0] = col1.vec[0];
        this.col1[1] = col1.vec[1];
        this.col1[2] = col1.vec[2];
        this.col1[3] = col1.vec[3];
        this.col2[0] = col2.vec[0];
        this.col2[1] = col2.vec[1];
        this.col2[2] = col2.vec[2];
        this.col2[3] = col2.vec[3];
        this.col3[0] = col3.vec[0];
        this.col3[1] = col3.vec[1];
        this.col3[2] = col3.vec[2];
        this.col3[3] = col3.vec[3];
    }
};
