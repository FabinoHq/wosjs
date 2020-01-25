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
//  param animSpriteShader : Animated sprite shader pointer                   //
////////////////////////////////////////////////////////////////////////////////
function AnimSprite(renderer, animSpriteShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Animated sprite shader pointer
    this.animShader = animSpriteShader;

    // Animated sprite VBO
    this.vertexBuffer = null;
    // Animated sprite texture
    this.texture = null;
    // Animated sprite model matrix
    this.modelMatrix = null;
    // Animated sprite alpha
    this.alpha = 1.0;

    // Animated sprite size
    this.width = 1.0;
    this.height = 1.0;
    // Animated sprite frame count
    this.countX = 1;
    this.countY = 1;
    // Animated sprite start frame
    this.startX = 0;
    this.startY = 0;
    // Animated sprite end frame
    this.endX = 0;
    this.endY = 0;
    // Animated sprite frametime in seconds
    this.frametime = 1.0;

    // Animated sprite current states
    this.currentX = 0;
    this.currentY = 0;
    this.nextX = 0;
    this.nextY = 0;
    this.currentTime = 0.0;
    this.interpOffset = 0.0;
}

AnimSprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init animated sprite                                           //
    //  param tex : Texture pointer                                           //
    //  param width : Animated sprite width                                   //
    //  param height : Animated sprite height                                 //
    //  param countX : Animated sprite frames count in U texture axis         //
    //  param countY : Animated sprite frames count in V texture axis         //
    //  param frametime : Animated sprite frametime in seconds                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, width, height, countX, countY, frametime)
    {
        // Reset animated sprite
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        if (width !== undefined) { this.width = width; }
        if (height !== undefined) { this.height = height; }
        if (countX !== undefined) { this.countX = countX; }
        if (countY !== undefined) { this.countY = countY; }
        if (frametime !== undefined) { this.frametime = frametime; }
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.currentTime = 0.0;
        this.interpOffset = 0.0;

        // Check gl pointer
        if (!this.renderer.gl)
        {
            return false;
        }

        // Check animated sprite shader pointer
        if (!this.animShader)
        {
            return false;
        }

        // Create model matrix
        this.modelMatrix = new Matrix4x4();

        // Create vbo
        this.vertexBuffer = new VertexBuffer(this.renderer.gl);
        if (!this.vertexBuffer)
        {
            // Could not create vbo
            return false;
        }
        if (!this.vertexBuffer.init())
        {
            // Could not init vbo
            return false;
        }

        // Set texture
        this.texture = tex;
        if (!this.texture)
        {
            // Could not set texture
            return false;
        }

        // Update vertex buffer     
        this.vertexBuffer.setPlane(this.width, this.height);

        // Sprite loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set sprite size                                             //
    //  param width : Sprite width to set                                     //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        // Update vertex buffer
        this.width = width;
        this.height = height;
        this.vertexBuffer.setPlane(this.width, this.height);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setStart : Set animation start frame                                  //
    //  param startX : Animation start frame X position to set                //
    //  param startY : Animation start frame Y position to set                //
    ////////////////////////////////////////////////////////////////////////////
    setStart: function(startX, startY)
    {
        this.startX = startX;
        this.startY = startY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setEnd : Set animation end frame                                      //
    //  param endX : Animation end frame X position to set                    //
    //  param endY : Animation end frame Y position to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setEnd: function(endX, endY)
    {
        this.endX = endX;
        this.endY = endY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get sprite width                                           //
    //  return : Sprite width                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get sprite height                                         //
    //  return : Sprite height                                                //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetMatrix : Reset animated sprite model matrix                      //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set animated sprite model matrix                          //
    //  param modelMatrix : Animated sprite model matrix                      //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
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
    //  moveX : Translate animated sprite on X axis                           //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate animated sprite on Y axis                           //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate animated sprite                                       //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleX : Scale animated sprite along the X axis                       //
    //  param scaleX : X factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleY : Scale animated sprite along the Y axis                       //
    //  param scaleY : Y factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetAnim : Reset current animation frame                             //
    ////////////////////////////////////////////////////////////////////////////
    resetAnim: function()
    {
        this.currentTime = 0.0;
        this.interpOffset = 0.0;
        this.nextX = this.startX;
        this.nextY = this.startY;
        this.computeFrame();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  computeFrame : Compute current and next frame offsets                 //
    ////////////////////////////////////////////////////////////////////////////
    computeFrame: function()
    {
        // Compute next frame offset
        this.currentX = this.nextX;
        this.currentY = this.nextY;
        if (this.nextX < (this.countX-1))
        {
            // Check end frame
            if ((this.nextX >= this.endX) &&
                (this.nextY >= this.endY))
            {
                // End frame reached
                this.nextX = this.startX;
                this.nextY = this.startY;
            }
            else
            {
                ++this.nextX;
            }
        }
        else
        {
            if (this.nextY < (this.nextY-1))
            {
                // Check end frame
                if ((this.nextX >= this.endX) &&
                    (this.nextY >= this.endY))
                {
                    // End frame reached
                    this.nextX = this.startX;
                    this.nextY = this.startY;
                }
                else
                {
                    this.nextX = 0;
                    ++this.nextY;
                }
            }
            else
            {
                // Last frame reached
                this.nextX = this.startX;
                this.nextY = this.startY;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render animated sprite                                       //
    //  param frametime : Frametime for animation update                      //
    ////////////////////////////////////////////////////////////////////////////
    render: function(frametime)
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

        // Bind shader
        this.animShader.shader.bind();

        // Send shader uniforms
        this.animShader.shader.sendProjectionMatrix(this.renderer.projMatrix);
        this.animShader.shader.sendViewMatrix(this.renderer.view.viewMatrix);
        this.animShader.shader.sendModelMatrix(this.modelMatrix);
        this.animShader.shader.sendAlphaValue(this.alpha);
        this.animShader.shader.sendUniform(
            this.animShader.countXuniform, this.countX
        );
        this.animShader.shader.sendUniform(
            this.animShader.countYuniform, this.countY
        );
        this.animShader.shader.sendUniform(
            this.animShader.currentXuniform, this.currentX
        );
        this.animShader.shader.sendUniform(
            this.animShader.currentYuniform, this.currentY
        );
        this.animShader.shader.sendUniform(
            this.animShader.nextXuniform, this.nextX
        );
        this.animShader.shader.sendUniform(
            this.animShader.nextYuniform, this.nextY
        );
        this.animShader.shader.sendUniform(
            this.animShader.interpUniform, this.interpOffset
        );

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.vertexBuffer.bind();
        this.vertexBuffer.render(this.animShader.shader);
        this.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind shader
        this.animShader.shader.unbind();
    }
};

