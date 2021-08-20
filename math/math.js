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
//      math/math.js : Generic math functions                                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  WOS floating point epsilon                                                //
////////////////////////////////////////////////////////////////////////////////
const WOSFloatEpsilon = 0.0000001;

////////////////////////////////////////////////////////////////////////////////
//  WOS pi constants                                                          //
////////////////////////////////////////////////////////////////////////////////
const WOSPi = Math.PI;
const WOS2Pi = Math.PI*2.0;
const WOS2Pi3 = Math.PI*2.0/3.0;
const WOSPi2 = Math.PI*0.5;
const WOSPi3 = Math.PI/3.0;
const WOSPi4 = Math.PI*0.25;
const WOSPi8 = Math.PI*0.125;
const WOSDegToRad = Math.PI/180.0;
const WOSRadToDeg = 180.0/Math.PI;


////////////////////////////////////////////////////////////////////////////////
//  sign : Get number sign (-1 or +1)                                         //
//  param x : Number to get sign of                                           //
//  return : Sign of the number (-1 or +1)                                    //
////////////////////////////////////////////////////////////////////////////////
function sign(x)
{
    return (x >= 0) ? 1 : -1;
}

////////////////////////////////////////////////////////////////////////////////
//  truncate : Float to integer truncation                                    //
//  param x : Number to truncate                                              //
//  return : Truncated integer                                                //
////////////////////////////////////////////////////////////////////////////////
function truncate(x)
{
    return (x < 0) ? Math.ceil(x) : Math.floor(x);
}

////////////////////////////////////////////////////////////////////////////////
//  modulus : Integer modulo                                                  //
//  param x : Left operand                                                    //
//  param n : Right operand                                                   //
//  return : Integer modulo (x % n)                                           //
////////////////////////////////////////////////////////////////////////////////
function modulus(x, n)
{
    return truncate(((x%n)+n)%n);
}

////////////////////////////////////////////////////////////////////////////////
//  divideInt : Integer division                                              //
//  param x : Left operand                                                    //
//  param n : Right operand                                                   //
//  return : Integer division (x / n)                                         //
////////////////////////////////////////////////////////////////////////////////
function divideInt(x, n)
{
    if (n == 0) return 0;
    if (x < 0) x -= (n-1);
    return truncate(x/n);
}

////////////////////////////////////////////////////////////////////////////////
//  divideToInt : Float to integer division                                   //
//  param x : Left operand                                                    //
//  param n : Right operand                                                   //
//  return : Integer division (x / n)                                         //
////////////////////////////////////////////////////////////////////////////////
function divideToInt(x, n)
{
    if (n == 0) return 0;
    if (x < 0) return truncate(x/n)-1;
    return truncate(x/n);
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
    return x + t*(y-x);
}

////////////////////////////////////////////////////////////////////////////////
//  cubicInterp : Cubic interpolation                                         //
//  param x : First value                                                     //
//  param y : Second value                                                    //
//  param t : Percentage of the interpolation between first and second value  //
//  return : Interpolated value                                               //
////////////////////////////////////////////////////////////////////////////////
function cubicInterp(x, y, t)
{
    return x + (t*t*(3.0-2.0*t))*(y-x);
}

////////////////////////////////////////////////////////////////////////////////
//  hermitInterp : Hermit interpolation                                       //
//  param w : Previous value                                                  //
//  param x : First value                                                     //
//  param y : Second value                                                    //
//  param z : Next value                                                      //
//  param t : Percentage of the interpolation between first and second value  //
//  return : Interpolated value                                               //
////////////////////////////////////////////////////////////////////////////////
function hermitInterp(w, x, y, z, t)
{
    var dx = 0.5*(x-w)+0.5*(y-x);
    var dy = 0.5*(y-x)+0.5*(z-y);
    return x + (t*t*(3.0-2.0*t))*(y-x) + dx*(t*t*t-2.0*t*t+t) + dy*(t*t*t-t*t);
}

////////////////////////////////////////////////////////////////////////////////
//  distance : Distance between two points                                    //
//  param x1 : X position of the first point                                  //
//  param y1 : Y position of the first point                                  //
//  param x2 : X position of the second point                                 //
//  param y2 : Y position of the second point                                 //
//  return : Distance between the two given points                            //
////////////////////////////////////////////////////////////////////////////////
function distance(x1, y1, x2, y2)
{
    return Math.sqrt(((x2-x1)*(x2-x1))+((y2-y1)*(y2-y1)));
}

////////////////////////////////////////////////////////////////////////////////
//  randomInt : Random integer generation                                     //
//  param min : Minimum integer value                                         //
//  param max : Maximum integer value                                         //
//  return : Random integer between min and max                               //
////////////////////////////////////////////////////////////////////////////////
function randomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return (Math.floor(Math.random()*(max-min+1)) + min);
}

////////////////////////////////////////////////////////////////////////////////
//  pseudoRand : 2D based pseudo-random value                                 //
//  param seed : Normalized seed of the pseudo-random generation              //
//  param x : X offset                                                        //
//  param y : Y offset                                                        //
//  return : Generated pseudo-random value                                    //
////////////////////////////////////////////////////////////////////////////////
function pseudoRand(seed, x, y)
{
    seed = (seed%1.0)*12458.0+31.45;
    var xrnd = (Math.sin(x+713.148*seed)*4414.5787*seed)%0.5+0.5;
    var yrnd = (Math.sin(y+358.735*seed)*7648.3458*seed)%0.5+0.5;
    return (Math.sin((xrnd*yrnd*188.45*seed)+594.76*seed)*278.845*seed)%0.5+0.5;
}

////////////////////////////////////////////////////////////////////////////////
//  fractalHeigthmap : 2D Fractal pseudo random heightmap                     //
//  param seed : Normalized seed of the pseudo-random generation              //
//  param i : Integer I index (X) offset                                      //
//  param j : Integer J index (Y) offset                                      //
//  return : Generated fractal heightmap value at (i,j) coordinates           //
////////////////////////////////////////////////////////////////////////////////
function fractalHeigthmap(seed, i, j)
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
        seed, Math.floor(ix/freq), Math.floor(jy/freq)
    );
    var rnd2 = pseudoRand(
        seed, Math.floor(ix/freq), Math.floor((jy+freq)/freq)
    );
    var rnd3 = pseudoRand(
        seed, Math.floor((ix+freq)/freq), Math.floor(jy/freq)
    );
    var rnd4 = pseudoRand(
        seed, Math.floor((ix+freq)/freq), Math.floor((jy+freq)/freq)
    );
    var bilinear1 = rnd + (rnd3-rnd)*ix1 +
                    (rnd2-rnd)*jy1 + ((rnd4+rnd)-(rnd3+rnd2))*ix1*jy1;

    // Second harmonic noise
    var brnd = pseudoRand(
        seed, Math.floor(ix/freq2), Math.floor(jy/freq2)
    );
    var brnd2 = pseudoRand(
        seed, Math.floor(ix/freq2), Math.floor((jy+freq2)/freq2)
    );
    var brnd3 = pseudoRand(
        seed, Math.floor((ix+freq2)/freq2), Math.floor(jy/freq2)
    );
    var brnd4 = pseudoRand(
        seed, Math.floor((ix+freq2)/freq2), Math.floor((jy+freq2)/freq2)
    );
    var bilinear2 = brnd + (brnd3-brnd)*ix2 +
                    (brnd2-brnd)*jy2 + ((brnd4+brnd)-(brnd3+brnd2))*ix2*jy2;

    // Third harmonic noise
    var crnd = pseudoRand(
        seed, Math.floor(ix/freq3), Math.floor(jy/freq3)
    );
    var crnd2 = pseudoRand(
        seed, Math.floor(ix/freq3), Math.floor((jy+freq3)/freq3)
    );
    var crnd3 = pseudoRand(
        seed, Math.floor((ix+freq3)/freq3), Math.floor(jy/freq3)
    );
    var crnd4 = pseudoRand(
        seed, Math.floor((ix+freq3)/freq3), Math.floor((jy+freq3)/freq3)
    );
    var bilinear3 = crnd + (crnd3-crnd)*ix3 +
                    (crnd2-crnd)*jy3 + ((crnd4+crnd)-(crnd3+crnd2))*ix3*jy3;

    // Final fractal heightmap
    return (bilinear1*0.7+bilinear2*0.2+bilinear3*0.1);
}
