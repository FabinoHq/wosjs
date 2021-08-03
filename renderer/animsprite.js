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
//      renderer/animsprite.js : Animated sprite management                   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  AnimSprite class definition                                               //
//  param renderer : Renderer pointer                                         //
//  param animShader : Animated sprite shader pointer                         //
////////////////////////////////////////////////////////////////////////////////
function AnimSprite(renderer, animShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Animated sprite shader pointer
    this.animShader = animShader;

    // Animated sprite shader uniforms locations
    this.alphaUniform = -1;
    this.countUniform = -1;
    this.currentUniform = -1;
    this.nextUniform = -1;
    this.interpUniform = -1;

    // Animated sprite texture
    this.texture = null;
    // Animated sprite model matrix
    this.modelMatrix = new Matrix4x4();

    // Animated sprite position
    this.position = new Vector2(0.0, 0.0);
    // Animated sprite size
    this.size = new Vector2(1.0, 1.0);
    // Animated sprite rotation angle
    this.angle = 0.0;
    // Animated sprite frame count
    this.count = new Vector2(1, 1);
    // Animated sprite start frame
    this.start = new Vector2(0, 0);
    // Animated sprite end frame
    this.end = new Vector2(0, 0);
    // Animated sprite frametime in seconds
    this.frametime = 1.0;
    // Animated sprite alpha
    this.alpha = 1.0;

    // Animated sprite current states
    this.current = new Vector2(0, 0);
    this.next = new Vector2(0, 0);
    this.currentTime = 0.0;
    this.interpOffset = 0.0;
    this.interp = 0.0;
}

AnimSprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init animated sprite                                           //
    //  param tex : Texture pointer                                           //
    //  param width : Animated sprite width                                   //
    //  param height : Animated sprite height                                 //
    //  param countX : Animated sprite frames count in U texture axis         //
    //  param countY : Animated sprite frames count in V texture axis         //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, width, height, countX, countY)
    {
        // Reset animated sprite
        this.alphaUniform = -1;
        this.countUniform = -1;
        this.currentUniform = -1;
        this.nextUniform = -1;
        this.interpUniform = -1;
        this.texture = null;
        this.modelMatrix.setIdentity();
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angle = 0.0;
        this.count.setXY(1, 1);
        if (countX !== undefined) this.count.vec[0] = countX;
        if (countY !== undefined) this.count.vec[1] = countY;
        this.start.setXY(0, 0);
        this.end.setXY(0, 0);
        this.frametime = 1.0;
        this.alpha = 1.0;
        this.current.setXY(0, 0);
        this.next.setXY(0, 0);
        this.currentTime = 0.0;
        this.interpOffset = 0.0;
        this.interp = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check animated sprite shader pointer
        if (!this.animShader) return false;

        // Get animated sprite shader uniforms locations
        this.animShader.bind();
        this.alphaUniform = this.animShader.getUniform("alpha");
        this.countUniform = this.animShader.getUniform("count");
        this.currentUniform = this.animShader.getUniform("current");
        this.nextUniform = this.animShader.getUniform("next");
        this.interpUniform = this.animShader.getUniform("interp");
        this.animShader.unbind();

        // Set texture
        this.texture = tex;
        if (!this.texture) return false;

        // Compute initial frame
        this.compute(0.0);

        // Sprite loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set animated sprite position                            //
    //  param x : Animated sprite X position                                  //
    //  param y : Animated sprite Y position                                  //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set anim position from a 2 components vector        //
    //  param vector : 2 components vector to set anim position from          //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set animated sprite X position                                 //
    //  param x : Animated sprite X position                                  //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set animated sprite Y position                                 //
    //  param y : Animated sprite Y position                                  //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate animated sprite                                      //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate animated sprite by a 2 components vector         //
    //  param vector : 2 components vector to translate animated sprite by    //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate animated sprite on X axis                           //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate animated sprite on Y axis                           //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set animated sprite size                                    //
    //  param width : Animated sprite width to set                            //
    //  param height : Animated sprite height to set                          //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set animated sprite size from a 2 components vector     //
    //  param vector : 2 components vector to set animated sprite size from   //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set animated sprite width                                  //
    //  param width : Animated sprite width to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set animated sprite height                                //
    //  param height : Animated sprite height to set                          //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set animated sprite rotation angle                         //
    //  param angle : Animated sprite rotation angle to set in degrees        //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate animated sprite                                       //
    //  param angle : Angle to rotate animated sprite by in degrees           //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCount : Set animation frame count                                  //
    //  param countX : Animation X frames total count                         //
    //  param countY : Animation Y frames total count                         //
    ////////////////////////////////////////////////////////////////////////////
    setCount: function(countX, countY)
    {
        this.count.setXY(countX, countY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setStart : Set animation start frame                                  //
    //  param startX : Animation start frame X position to set                //
    //  param startY : Animation start frame Y position to set                //
    ////////////////////////////////////////////////////////////////////////////
    setStart: function(startX, startY)
    {
        this.start.setXY(startX, startY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setEnd : Set animation end frame                                      //
    //  param endX : Animation end frame X position to set                    //
    //  param endY : Animation end frame Y position to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setEnd: function(endX, endY)
    {
        this.end.setXY(endX, endY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFrametime : Set animated sprite frametime                          //
    //  param frametime : Animated sprite frametime to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setFrametime: function(frametime)
    {
        this.frametime = frametime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set animated sprite alpha                                  //
    //  param alpha : Animated sprite alpha to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get animated sprite X position                                 //
    //  return : Animated sprite X position                                   //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get animated sprite Y position                                 //
    //  return : Animated sprite Y position                                   //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get animated sprite width                                  //
    //  return : Animated sprite width                                        //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get animated sprite height                                //
    //  return : Animated sprite height                                       //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get animated sprite rotation angle                         //
    //  return : Animated sprite rotation angle in degrees                    //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCountX : Get animated sprite X frames count                        //
    //  return : Animated sprite X frames count                               //
    ////////////////////////////////////////////////////////////////////////////
    getCountX: function()
    {
        return this.count.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCountY : Get animated sprite Y frames count                        //
    //  return : Animated sprite Y frames count                               //
    ////////////////////////////////////////////////////////////////////////////
    getCountY: function()
    {
        return this.count.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getStartX : Get animated sprite X start frame                         //
    //  return : Animated sprite X start frame                                //
    ////////////////////////////////////////////////////////////////////////////
    getStartX: function()
    {
        return this.start.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getStartY : Get animated sprite Y start frame                         //
    //  return : Animated sprite Y start frame                                //
    ////////////////////////////////////////////////////////////////////////////
    getStartY: function()
    {
        return this.start.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getEndX : Get animated sprite X end frame                             //
    //  return : Animated sprite X end frame                                  //
    ////////////////////////////////////////////////////////////////////////////
    getEndX: function()
    {
        return this.end.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getEndY : Get animated sprite Y end frame                             //
    //  return : Animated sprite Y end frame                                  //
    ////////////////////////////////////////////////////////////////////////////
    getEndY: function()
    {
        return this.end.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFrametime : Get animated sprite frametime                          //
    //  return : Animated sprite frametime                                    //
    ////////////////////////////////////////////////////////////////////////////
    getFrametime: function()
    {
        return this.frametime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get animated sprite alpha                                  //
    //  return : Animated sprite alpha                                        //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCurrentX : Get animated sprite X current frame                     //
    //  return : Animated sprite X current frame                              //
    ////////////////////////////////////////////////////////////////////////////
    getCurrentX: function()
    {
        return this.current.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCurrentY : Get animated sprite Y current frame                     //
    //  return : Animated sprite Y current frame                              //
    ////////////////////////////////////////////////////////////////////////////
    getCurrentY: function()
    {
        return this.current.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextX : Get animated sprite X next frame                           //
    //  return : Animated sprite X next frame                                 //
    ////////////////////////////////////////////////////////////////////////////
    getNextX: function()
    {
        return this.next.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextY : Get animated sprite Y next frame                           //
    //  return : Animated sprite Y next frame                                 //
    ////////////////////////////////////////////////////////////////////////////
    getNextY: function()
    {
        return this.next.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCurrentTime : Get animated sprite current time                     //
    //  return : Animated sprite current time                                 //
    ////////////////////////////////////////////////////////////////////////////
    getCurrentTime: function()
    {
        return this.currentTime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetAnim : Reset current animation                                   //
    ////////////////////////////////////////////////////////////////////////////
    resetAnim: function()
    {
        this.currentTime = 0.0;
        this.interpOffset = 0.0;
        this.next.set(this.start);
        this.computeFrame();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  computeFrame : Compute current and next frame offsets                 //
    ////////////////////////////////////////////////////////////////////////////
    computeFrame: function()
    {
        // Compute next frame offset
        this.current.set(this.next);
        if (this.next.vec[0] < (this.count.vec[0]-1))
        {
            // Check end frame
            if ((this.next.vec[0] >= this.end.vec[0]) &&
                (this.next.vec[1] >= this.end.vec[1]))
            {
                // End frame reached
                this.next.set(this.start);
            }
            else
            {
                ++this.next.vec[0];
            }
        }
        else
        {
            if (this.next.vec[1] < (this.count.vec[1]-1))
            {
                // Check end frame
                if ((this.next.vec[0] >= this.end.vec[0]) &&
                    (this.next.vec[1] >= this.end.vec[1]))
                {
                    // End frame reached
                    this.next.set(this.start);
                }
                else
                {
                    this.next.vec[0] = 0;
                    ++this.next.vec[1];
                }
            }
            else
            {
                // Last frame reached
                this.next.set(this.start);
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute animated sprite                                     //
    //  param frametime : Frametime for animation update                      //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        // Update current animation time
        this.currentTime += frametime;
        if (this.frametime > 0.0)
        {
            this.interpOffset += frametime/this.frametime;
        }
        else
        {
            this.interpOffset += frametime;
        }

        if (this.currentTime >= this.frametime)
        {
            // Reset interpolation timer
            this.interpOffset = 0.0;

            // Compute frame offets
            this.computeFrame();

            // Reset timer
            this.currentTime = 0.0;
        }

        // Compute cubic interpolation
        this.interp = this.interpOffset + (this.interpOffset - 
            this.interpOffset*this.interpOffset*(3.0-2.0*this.interpOffset));
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render animated sprite                                       //
    //  param frametime : Frametime for animation update                      //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set animated sprite model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.translate(
            this.size.vec[0]*0.5, this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.rotateZ(this.angle);
        this.modelMatrix.translate(
            -this.size.vec[0]*0.5, -this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.scaleVec2(this.size);

        // Bind shader
        this.animShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send animated sprite shader uniforms
        this.animShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.animShader.sendUniform(this.alphaUniform, this.alpha);
        this.animShader.sendUniformVec2(this.countUniform, this.count);
        this.animShader.sendUniformVec2(this.currentUniform, this.current);
        this.animShader.sendUniformVec2(this.nextUniform, this.next);
        this.animShader.sendUniform(this.interpUniform, this.interp);

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.animShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind shader
        this.animShader.unbind();
    }
};
