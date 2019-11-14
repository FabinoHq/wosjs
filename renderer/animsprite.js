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
////////////////////////////////////////////////////////////////////////////////
function AnimSprite(renderer)
{
    // Animated sprite loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Animated sprite VBO
    this.vertexBuffer = null;
    // Animated sprite next frame VBO
    this.nextVertexBuffer = null;
    // Animated sprite texture
    this.texture = null;
    // Animated sprite model matrix
    this.modelMatrix = null;
    // Animated sprite alpha
    this.alpha = 1.0;

    // Animated sprite texture UV size
    this.usize = 1.0;
    this.vsize = 1.0;
    // Animated sprite frame count
    this.countX = 1;
    this.countY = 1;
    // Animated sprite frametime in seconds
    this.frametime = 1.0;

    // Animated sprite current states
    this.currentX = 0;
    this.currentY = 0;
    this.currentTime = 0.0;
    this.interTime = 0.0;
    this.interpolation = true;
}

AnimSprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init animated sprite                                           //
    //  param tex : Texture pointer                                           //
    //  param usize : Animated sprite texture U size                          //
    //  param vsize : Animated sprite texture V size                          //
    //  param countX : Animated sprite frames count in U texture axis         //
    //  param countY : Animated sprite frames count in V texture axis         //
    //  param frametime : Animated sprite frametime in seconds                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, usize, vsize, countX, countY, frametime, interpolation)
    {
        var nextFrameX = 0.0;
        var nextFrameY = 0.0;

        // Reset animated sprite
        this.loaded = false;
        this.vertexBuffer = null;
        this.nextVertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        if (usize !== undefined) { this.usize = usize; }
        if (vsize !== undefined) { this.vsize = vsize; }
        if (countX !== undefined) { this.countX = countX; }
        if (countY !== undefined) { this.countY = countY; }
        if (frametime !== undefined) { this.frametime = frametime; }
        if (interpolation !== undefined) { this.interpolation = interpolation; }
        this.currentX = 0;
        this.currentY = 0;
        this.currentTime = 0.0;

        // Check gl pointer
        if (!this.renderer.gl)
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

        // Create next frame vbo
        this.nextVertexBuffer = new VertexBuffer(this.renderer.gl);
        if (!this.nextVertexBuffer)
        {
            // Could not create next frame vbo
            return false;
        }
        if (!this.nextVertexBuffer.init())
        {
            // Could not init next frame vbo
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
        this.vertexBuffer.setPlane(
            this.texture.width*this.usize, this.texture.height*this.vsize
        );
        this.vertexBuffer.updateTexcoords(
            0.0, 1.0-this.vsize, this.usize, 1.0
        );

        if (this.interpolation)
        {
            // Update next frame vertex buffer     
            this.nextVertexBuffer.setPlane(
                this.texture.width*this.usize, this.texture.height*this.vsize
            );

            // Compute next frame offset
            nextFrameX = this.currentX;
            nextFrameY = this.currentY;
            if (nextFrameX < (this.countX-1))
            {
                ++nextFrameX;
            }
            else
            {
                if (nextFrameY < (this.countY-1))
                {
                    nextFrameX = 0;
                    ++nextFrameY;
                }
                else
                {
                    nextFrameX = 0;
                    nextFrameY = 0;
                }
            }

            // Update next vertex buffer texture coordinates     
            this.nextVertexBuffer.updateTexcoords(
                nextFrameX*this.usize,1.0-((nextFrameY+1)*this.vsize),
                (nextFrameX+1)*this.usize,1.0-(nextFrameY*this.vsize)
            );
        }

        // Sprite loaded
        this.loaded = true;
        return true;
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
    //  render : Render animated sprite                                       //
    //  param frametime : Frametime for animation update                      //
    ////////////////////////////////////////////////////////////////////////////
    render: function(frametime)
    {
        var nextFrameX = 0;
        var nextFrameY = 0;
        var cubicInterp = 0.0;
        var smoothInterp = 0.0;

        if (this.loaded)
        {
            // Update current animation time
            this.currentTime += frametime;
            if (this.frametime > 0.0)
            {
                this.interTime += frametime/this.frametime;
            }
            else
            {
                this.interTime += frametime;
            }

            // Update VBOs if needed
            if (this.currentTime >= this.frametime)
            {
                // Reset interpolation timer
                this.interTime = 0.0;

                // Compute frame offset
                if (this.currentX < (this.countX-1))
                {
                    ++this.currentX;
                }
                else
                {
                    if (this.currentY < (this.countY-1))
                    {
                        this.currentX = 0;
                        ++this.currentY;
                    }
                    else
                    {
                        this.currentX = 0;
                        this.currentY = 0;
                    }
                }

                // Update vertex buffer texture coordinates     
                this.vertexBuffer.updateTexcoords(
                    this.currentX*this.usize,1.0-((this.currentY+1)*this.vsize),
                    (this.currentX+1)*this.usize,1.0-(this.currentY*this.vsize)
                );

                if (this.interpolation)
                {
                    // Compute next frame offset
                    nextFrameX = this.currentX;
                    nextFrameY = this.currentY;
                    if (nextFrameX < (this.countX-1))
                    {
                        ++nextFrameX;
                    }
                    else
                    {
                        if (nextFrameY < (this.countY-1))
                        {
                            nextFrameX = 0;
                            ++nextFrameY;
                        }
                        else
                        {
                            nextFrameX = 0;
                            nextFrameY = 0;
                        }
                    }

                    // Update next vertex buffer texture coordinates     
                    this.nextVertexBuffer.updateTexcoords(
                        nextFrameX*this.usize,1.0-((nextFrameY+1)*this.vsize),
                        (nextFrameX+1)*this.usize,1.0-(nextFrameY*this.vsize)
                    );
                }

                // Reset timer
                this.currentTime = 0.0;
            }

            // Bind default shader
            this.renderer.shader.bind();

            // Send shader uniforms
            this.renderer.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.renderer.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.renderer.shader.sendModelMatrix(this.modelMatrix);
            if (this.interpolation)
            {
                cubicInterp = (this.interTime * this.interTime *
                    (3.0-2.0 * this.interTime)
                );
                smoothInterp = this.interTime + (this.interTime - cubicInterp);

                this.renderer.shader.sendAlphaValue(
                    this.alpha*((1.0-smoothInterp) +
                    (0.5 - Math.abs(0.5-this.interTime))*0.3)
                );
            }
            else
            {
                this.renderer.shader.sendAlphaValue(this.alpha);
            }

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.renderer.shader);
            this.vertexBuffer.unbind();

            if (this.interpolation)
            {
                this.renderer.shader.sendAlphaValue(
                    this.alpha*(smoothInterp +
                    (0.5 - Math.abs(0.5-this.interTime))*0.3)
                );

                // Render next frame VBO
                this.nextVertexBuffer.bind();
                this.nextVertexBuffer.render();
                this.nextVertexBuffer.unbind();
            }

            // Unbind texture
            this.texture.unbind();

            // Unbind default shader
            this.renderer.shader.unbind();
        }
    }
};

