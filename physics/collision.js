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
//      physics/collision.js : Collision management                           //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Collision class definition                                                //
////////////////////////////////////////////////////////////////////////////////
function Collision()
{
    this.collide = false;
    this.position = new Vector2(0.0, 0.0);
    this.offset = new Vector2(0.0, 0.0);
    this.normal = new Vector2(0.0, 0.0);
    this.factor = 0.0;
}

Collision.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset collision                                               //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.collide = false;
        this.position.vec[0] = 0.0;
        this.position.vec[1] = 0.0;
        this.offset.vec[0] = 0.0;
        this.offset.vec[1] = 0.0;
        this.normal.vec[0] = 0.0;
        this.normal.vec[1] = 0.0;
        this.factor = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCollision : Set from collision                                     //
    //  param collision : Collision object to set from                        //
    ////////////////////////////////////////////////////////////////////////////
    setCollision: function(collision)
    {
        this.collide = collision.collide;
        this.position.vec[0] = collision.position.vec[0];
        this.position.vec[1] = collision.position.vec[1];
        this.offset.vec[0] = collision.offset.vec[0];
        this.offset.vec[1] = collision.offset.vec[1];
        this.normal.vec[0] = collision.normal.vec[0];
        this.normal.vec[1] = collision.normal.vec[1];
        this.factor = collision.factor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColliding : Set collision colliding state                          //
    //  param colliding : Collision colliding state to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setColliding: function(colliding)
    {
        this.collide = colliding;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set collision position from coordinates                 //
    //  param x : Collision X position to set                                 //
    //  param y : Collision Y position to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set collision position from a 2 components vector   //
    //  param pos : 2 components vector to set collision position from        //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(pos)
    {
        this.position.vec[0] = position.vec[0];
        this.position.vec[1] = position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set collision X position                                       //
    //  param x : Collision X position to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set collision Y position                                       //
    //  param y : Collision Y position to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffset : Set collision offset from coordinates                     //
    //  param offsetX : Collision X offset to set                             //
    //  param offsetY : Collision Y offset to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setOffset: function(offsetX, offsetY)
    {
        this.offset.vec[0] = offsetX;
        this.offset.vec[1] = offsetY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetVec2 : Set collision offset from a 2 components vector       //
    //  param offset : 2 components vector to set collision offset from       //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetVec2: function(offset)
    {
        this.offset.set(offset);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetX : Set collision X offset                                   //
    //  param offsetX : Collision X offset to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetX: function(offsetX)
    {
        this.offset.vec[0] = offsetX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetY : Set collision Y offset                                   //
    //  param offsetY : Collision Y offset to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetY: function(offsetY)
    {
        this.offset.vec[1] = offsetY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormal : Set collision normal from coordinates                     //
    //  param normalX : Collision X normal to set                             //
    //  param normalY : Collision Y normal to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setNormal: function(normalX, normalY)
    {
        this.normal.vec[0] = normalX;
        this.normal.vec[1] = normalY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalVec2 : Set collision normal from a 2 components vector       //
    //  param normal : 2 components vector to set collision normal from       //
    ////////////////////////////////////////////////////////////////////////////
    setNormalVec2: function(normal)
    {
        this.normal.set(normal);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalX : Set collision X normal                                   //
    //  param normalX : Collision X normal to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setNormalX: function(normalX)
    {
        this.normal.vec[0] = normalX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalY : Set collision Y normal                                   //
    //  param normalY : Collision Y normal to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setNormalY: function(normalY)
    {
        this.normal.vec[1] = normalY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFactor : Set collision factor                                      //
    //  param factor : Collision factor to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setFactor: function(factor)
    {
        this.factor = factor;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getColliding : Get collision colliding state                          //
    //  return : Collision colliding state                                    //
    ////////////////////////////////////////////////////////////////////////////
    getColliding: function()
    {
        return this.collide;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get collision X position                                       //
    //  return : Collision X position                                         //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get collision Y position                                       //
    //  return : Collision Y position                                         //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOffsetX : Get collision X offset                                   //
    //  return : Collision X offset                                           //
    ////////////////////////////////////////////////////////////////////////////
    getOffsetX: function()
    {
        return this.offset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOffsetY : Get collision Y offset                                   //
    //  return : Collision Y offset                                           //
    ////////////////////////////////////////////////////////////////////////////
    getOffsetY: function()
    {
        return this.offset.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNormalX : Get collision X normal                                   //
    //  return : Collision X normal                                           //
    ////////////////////////////////////////////////////////////////////////////
    getNormalX: function()
    {
        return this.normal.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNormalY : Get collision Y normal                                   //
    //  return : Collision Y normal                                           //
    ////////////////////////////////////////////////////////////////////////////
    getNormalY: function()
    {
        return this.normal.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFactor : Get collision factor                                      //
    //  return : Collision factor                                             //
    ////////////////////////////////////////////////////////////////////////////
    getFactor: function()
    {
        return this.factor;
    }
};
