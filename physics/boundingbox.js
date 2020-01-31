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
//      physics/boundingbox.js : BoundingBox management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  BoundingBox class definition                                              //
////////////////////////////////////////////////////////////////////////////////
function BoundingBox()
{
    this.position = new Vector2(0.0, 0.0);
    this.halfsize = new Vector2(0.0, 0.0);
}

BoundingBox.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  reset : Reset bounding box                                            //
    ////////////////////////////////////////////////////////////////////////////
    reset: function()
    {
        this.position.vec[0] = 0.0;
        this.position.vec[1] = 0.0;
        this.halfsize.vec[0] = 0.0;
        this.halfsize.vec[1] = 0.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set bounding box position from coordinates              //
    //  param x : Bounding box X position                                     //
    //  param y : Bounding box Y position                                     //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set bounding box position from a vector             //
    //  param pos : 2 components vector to set bounding box position from     //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(pos)
    {
        this.position.vec[0] = position.vec[0];
        this.position.vec[1] = position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set bounding box X position                                    //
    //  param x : Bounding box X position                                     //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set bounding box Y position                                    //
    //  param y : Bounding box Y position                                     //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHalf : Set bounding box half size from coordinates                 //
    //  param halfWidth : Bounding box half width                             //
    //  param halfHeight : Bounding box half height                           //
    ////////////////////////////////////////////////////////////////////////////
    setHalf: function(halfWidth, halfHeight)
    {
        this.halfsize.vec[0] = halfWidth;
        this.halfsize.vec[1] = halfHeight;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHalfVec2 : Set bounding box half size from a 2 components vector   //
    //  param half : 2 components vector to set bounding box half size from   //
    ////////////////////////////////////////////////////////////////////////////
    setHalfVec2: function(half)
    {
        this.halfsize.vec[0] = half.vec[0];
        this.halfsize.vec[1] = half.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHalfWidth : Set bounding box half width                            //
    //  param halfWidth : Bounding box half width                             //
    ////////////////////////////////////////////////////////////////////////////
    setHalfWidth: function(halfWidth)
    {
        this.halfsize.vec[0] = halfWidth;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHalfHeight : Set bounding box half height                          //
    //  param halfHeight : Bounding box half height                           //
    ////////////////////////////////////////////////////////////////////////////
    setHalfHeight: function(halfHeight)
    {
        this.halfsize.vec[1] = halfHeight;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set bounding box size from coordinates                      //
    //  param width : Bounding box width                                      //
    //  param height : Bounding box height                                    //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.halfsize.vec[0] = width*0.5;
        this.halfsize.vec[1] = height*0.5;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set bounding box size from a 2 components vector        //
    //  param size : 2 components vector to set bounding box size from        //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(size)
    {
        this.halfsize.vec[0] = size.vec[0]*0.5;
        this.halfsize.vec[1] = size.vec[1]*0.5;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set bounding box width                                     //
    //  param width : Bounding box width                                      //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.halfsize.vec[0] = width*0.5;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set bounding box height                                   //
    //  param height : Bounding box height                                    //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.halfsize.vec[1] = height*0.5;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get bounding box X position                                    //
    //  return : Bounding box X position                                      //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get bounding box Y position                                    //
    //  return : Bounding box Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHalfWidth : Get bounding box half width                            //
    //  return : Bounding box half width                                      //
    ////////////////////////////////////////////////////////////////////////////
    getHalfWidth: function()
    {
        return this.halfsize.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHalfHeight : Get bounding box half height                          //
    //  return : Bounding box half height                                     //
    ////////////////////////////////////////////////////////////////////////////
    getHalfHeight: function()
    {
        return this.halfsize.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get bounding box width                                     //
    //  return : Bounding box width                                           //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.halfsize.vec[0]*2.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get bounding box height                                   //
    //  return : Bounding box height                                          //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.halfsize.vec[1]*2.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate bounding box                                         //
    //  param vector : Vector to translate bounding box by                    //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate bounding box by coordinates                          //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate bounding box on X axis                              //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate bounding box on Y axis                              //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  collideSegment : Collide a segment with bounding box                  //
    //  param collision : Collision object to store collision informations    //
    //  param origin : Position of the segment start point                    //
    //  param offset : Size of the segment (end point - start point)          //
    //  param padding : Collision padding                                     //
    ////////////////////////////////////////////////////////////////////////////
    collideSegment: function(collision, origin, offset, padding)
    {
        var scaleX = 1.0;
        var scaleY = 1.0;
        var signX = 1.0;
        var signY = 1.0;
        var nearX = 0.0;
        var nearY = 0.0;
        var farX = 0.0;
        var farY = 0.0;
        var near = 0.0;
        var far = 0.0;

        // Reset collision
        collision.reset();
        collision.setFactor(1.0);
        collision.setPosition(
            origin.vec[0]+offset.vec[0], origin.vec[1]+offset.vec[1]
        );
        collision.setOffsetVec2(offset);
        if ((offset.vec[0] == 0.0) && (offset.vec[1] == 0.0)) return false;

        // Offset scale and sign
        if (offset.vec[0] != 0.0)
        {
            scaleX = (1.0/offset.vec[0]);
        }
        if (offset.vec[1] != 0.0)
        {
            scaleY = (1.0/offset.vec[1]);
        }
        signX = (scaleX >= 0.0)?1.0:-1.0;
        signY = (scaleY >= 0.0)?1.0:-1.0;

        // Compute near and far edges on both axis
        nearX = (this.position.vec[0]-(signX*(this.halfsize.vec[0]+
            padding.vec[0]))-origin.vec[0])*scaleX;
        nearY = (this.position.vec[1]-(signY*(this.halfsize.vec[1]+
            padding.vec[1]))-origin.vec[1])*scaleY;
        farX = (this.position.vec[0]+(signX*(this.halfsize.vec[0]+
            padding.vec[0]))-origin.vec[0])*scaleX;
        farY = (this.position.vec[1]+(signY*(this.halfsize.vec[1]+
            padding.vec[1]))-origin.vec[1])*scaleY;

        if ((nearX > farY) || (nearY > farX))
        {
            // Box is not in the direction
            return false;
        }

        // Compute near and far edges
        near = (nearX > nearY)?nearX:nearY;
        far = (farX < farY)?farX:farY;

        if ((near >= 1.0) || (far <= WOSFloatEpsilon))
        {
            // Outside the box
            return false;
        }

        // Clamp near value
        if (near <= 0.0) near = 0.0;
        if (near >= 1.0) near = 1.0;

        // Collision
        collision.setFactor(near);
        if (nearX > nearY)
        {
            collision.setNormal(-signX, 0.0);
        }
        else
        {
            collision.setNormal(0.0, -signY);
        }
        collision.setOffset(near*offset.vec[0], near*offset.vec[1]);
        collision.setPosition(
            origin.vec[0]+(near*offset.vec[0]),
            origin.vec[1]+(near*offset.vec[1])
        );
        collision.setColliding(true);
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  collideBox : Collide a bounding box with bounding box                 //
    //  param collision : Collision object to store collision informations    //
    //  param box : Bounding box to collide with                              //
    //  param offset : Offset vector to sweep bounding box by                 //
    ////////////////////////////////////////////////////////////////////////////
    collideBox: function(collision, box, offset)
    {
        var padding = new Vector2(0.0, 0.0);
        padding.vec[0] = box.halfsize.vec[0];
        padding.vec[1] = box.halfsize.vec[1];

        // Dynamic sweep collision
        if (!this.collideSegment(collision, box.position, offset, padding))
        {
            collision.reset();
            collision.setFactor(1.0);
            collision.setPosition(
                box.position.vec[0]+offset.vec[0],
                box.position.vec[1]+offset.vec[1]
            );
            collision.setOffset(offset.vec[0], offset.vec[1]);
            return false;
        }
        return true;
    }
};

