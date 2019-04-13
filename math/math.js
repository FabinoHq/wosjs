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
//      math.js : Generic math functions                                      //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  modulus : Integer modulo                                                  //
//  param x : Left operand                                                    //
//  param n : Right operand                                                   //
//  return : Integer modulo (x % n)                                           //
////////////////////////////////////////////////////////////////////////////////
function modulus(x, n)
{
    return parseInt(((x%n)+n)%n, 10);
}

////////////////////////////////////////////////////////////////////////////////
//  divideInt : Integer division                                              //
//  param x : Left operand                                                    //
//  param n : Right operand                                                   //
//  return : Integer division (x / n)                                         //
////////////////////////////////////////////////////////////////////////////////
function divideInt(x, n)
{
    if (n == 0) { return 0; }
    if (x < 0) { x -= (n-1); }
    return parseInt(x/n, 10);
}

////////////////////////////////////////////////////////////////////////////////
//  linearInterp : Linear interpolation                                       //
//  param x : First value                                                     //
//  param y : Second value                                                    //
//  param t : Percentage of the interpolation between first and second value  //
//  return : Interpolated value                                               //
////////////////////////////////////////////////////////////////////////////////
function linearInterp(x, y, t)
{
    return (1-t)*x + t*y;
}

////////////////////////////////////////////////////////////////////////////////
//  pseudoRand : 2D based pseudo-random value                                 //
//  param x : X offset                                                        //
//  param y : Y offset                                                        //
//  return : Generated pseudo-random value                                    //
////////////////////////////////////////////////////////////////////////////////
function pseudoRand(x, y)
{
    var xrnd = (Math.sin(x+7163.148)*4414.5787)%0.5+0.5;
    var yrnd = (Math.sin(y+3578.735)*7648.3458)%0.5+0.5;
    return (Math.sin((xrnd*yrnd*1848.41575)+58964.376)*2768.8745)%0.5+0.5;
}

////////////////////////////////////////////////////////////////////////////////
//  fractalHeigthmap : 2D Fractal pseudo random heightmap                     //
//  param i : Integer I index (X) offset                                      //
//  param j : Integer J index (Y) offset                                      //
//  return : Generated fractal heightmap value at (i,j) coordinates           //
////////////////////////////////////////////////////////////////////////////////
function fractalHeigthmap(i, j)
{
    var ix = i;
    var jy = j;

    // Fractal frequencies
    var freq = 5;
    var freq2 = 3;
    var freq3 = 2;

    var ix1 = ((modulus(ix, freq))/freq)*1.0;
    var jy1 = ((modulus(jy, freq))/freq)*1.0;
    ix1 = (ix1*ix1*(3.0-2.0*ix1));
    jy1 = (jy1*jy1*(3.0-2.0*jy1));

    var ix2 = ((modulus(ix, freq2))/freq2)*1.0;
    var jy2 = ((modulus(jy, freq2))/freq2)*1.0;
    ix2 = (ix2*ix2*(3.0-2.0*ix2));
    jy2 = (jy2*jy2*(3.0-2.0*jy2));

    var ix3 = ((modulus(ix, freq3))/freq3)*1.0;
    var jy3 = ((modulus(jy, freq3))/freq3)*1.0;
    ix3 = (ix3*ix3*(3.0-2.0*ix3));
    jy3 = (jy3*jy3*(3.0-2.0*jy3));

    // Fondamental noise
    var rnd = pseudoRand(
        Math.floor(ix/freq), Math.floor(jy/freq)
    );
    var rnd2 = pseudoRand(
        Math.floor(ix/freq), Math.floor((jy+freq)/freq)
    );
    var rnd3 = pseudoRand(
        Math.floor((ix+freq)/freq), Math.floor(jy/freq)
    );
    var rnd4 = pseudoRand(
        Math.floor((ix+freq)/freq), Math.floor((jy+freq)/freq)
    );
    var bilinear1 = rnd + (rnd3-rnd)*ix1 +
                    (rnd2-rnd)*jy1 + ((rnd4+rnd)-(rnd3+rnd2))*ix1*jy1;

    // Second harmonic noise
    var brnd = pseudoRand(
        Math.floor(ix/freq2), Math.floor(jy/freq2)
    );
    var brnd2 = pseudoRand(
        Math.floor(ix/freq2), Math.floor((jy+freq2)/freq2)
    );
    var brnd3 = pseudoRand(
        Math.floor((ix+freq2)/freq2), Math.floor(jy/freq2)
    );
    var brnd4 = pseudoRand(
        Math.floor((ix+freq2)/freq2), Math.floor((jy+freq2)/freq2)
    );
    var bilinear2 = brnd + (brnd3-brnd)*ix2 +
                    (brnd2-brnd)*jy2 + ((brnd4+brnd)-(brnd3+brnd2))*ix2*jy2;

    // Third harmonic noise
    var crnd = pseudoRand(
        Math.floor(ix/freq3), Math.floor(jy/freq3)
    );
    var crnd2 = pseudoRand(
        Math.floor(ix/freq3), Math.floor((jy+freq3)/freq3)
    );
    var crnd3 = pseudoRand(
        Math.floor((ix+freq3)/freq3), Math.floor(jy/freq3)
    );
    var crnd4 = pseudoRand(
        Math.floor((ix+freq3)/freq3), Math.floor((jy+freq3)/freq3)
    );
    var bilinear3 = crnd + (crnd3-crnd)*ix3 +
                    (crnd2-crnd)*jy3 + ((crnd4+crnd)-(crnd3+crnd2))*ix3*jy3;

    // Final fractal noise
    return (bilinear1*0.7+bilinear2*0.2+bilinear3*0.1);
}

