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
//  Animated sprite fragment shader                                           //
////////////////////////////////////////////////////////////////////////////////
const animspriteFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "varying float alphaValue;",
    "uniform float countX;",
    "uniform float countY;",
    "uniform float currentX;",
    "uniform float currentY;",
    "uniform float nextX;",
    "uniform float nextY;",
    "uniform float interp;",
    "void main()",
    "{",
    "   vec2 coords = vec2(texCoord.x/countX, texCoord.y/countY);",
    "   vec2 coords2 = coords;",
    "   coords.x += currentX/countX;",
    "   coords.y += currentY/countY;",
    "   coords2.x += nextX/countX;",
    "   coords2.y += nextY/countY;",
    "   vec4 tc1 = texture2D(texture, coords);",
    "   vec4 tc2 = texture2D(texture, coords2);",
    "   vec4 texColor = vec4(",
    "     tc1.r*(1.0-interp)+tc2.r*interp, tc1.g*(1.0-interp)+tc2.g*interp,",
    "     tc1.b*(1.0-interp)+tc2.b*interp, tc1.a*(1.0-interp)+tc2.a*interp",
    "   );",
    "   gl_FragColor = vec4(texColor.rgb, texColor.a*alphaValue);",
    "}"
].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  AnimSprite class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function AnimSprite(renderer)
{
    // Animated sprite loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Animated sprite shader
    this.shader = null;
    // Animated sprite VBO
    this.vertexBuffer = null;
    // Animated sprite texture
    this.texture = null;
    // Animated sprite model matrix
    this.modelMatrix = null;
    // Animated sprite alpha
    this.alpha = 1.0;

    // Shader uniforms locations
    this.countXuniform = -1;
    this.countYuniform = -1;
    this.currentXuniform = -1;
    this.currentYuniform = -1;
    this.nextXuniform = -1;
    this.nextYuniform = -1;
    this.interpUniform = -1;

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
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.countXuniform = -1;
        this.countYuniform = -1;
        this.currentXuniform = -1;
        this.currentYuniform = -1;
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

        // Init shader
        this.shader = new Shader(this.renderer.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(
            defaultVertexShaderSrc, animspriteFragmentShaderSrc))
        {
            return false;
        }

        // Get shader uniforms locations
        this.shader.bind();
        this.countXuniform = this.shader.getUniform("countX");
        if (this.countXuniform == -1) { return false; }
        this.countYuniform = this.shader.getUniform("countY");
        if (this.countYuniform == -1) { return false; }
        this.currentXuniform = this.shader.getUniform("currentX");
        if (this.currentXuniform == -1) { return false; }
        this.currentYuniform = this.shader.getUniform("currentY");
        if (this.currentYuniform == -1) { return false; }
        this.nextXuniform = this.shader.getUniform("nextX");
        if (this.nextXuniform == -1) { return false; }
        this.nextYuniform = this.shader.getUniform("nextY");
        if (this.nextYuniform == -1) { return false; }
        this.interpUniform = this.shader.getUniform("interp");
        if (this.interpUniform == -1) { return false; }

        // Set shader uniforms
        this.shader.sendUniform(this.countXuniform, this.countX);
        this.shader.sendUniform(this.countYuniform, this.countY);
        this.shader.sendUniform(this.currentXuniform, this.currentX);
        this.shader.sendUniform(this.currentYuniform, this.currentY);
        this.shader.sendUniform(this.nextXuniform, this.currentX);
        this.shader.sendUniform(this.nextYuniform, this.currentY);
        this.shader.sendUniform(this.interpUniform, this.interpOffset);
        this.shader.unbind();

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
        this.loaded = true;
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
        if (this.loaded)
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
            this.shader.bind();

            // Send shader uniforms
            this.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.shader.sendModelMatrix(this.modelMatrix);
            this.shader.sendAlphaValue(this.alpha);
            this.shader.sendUniform(this.currentXuniform, this.currentX);
            this.shader.sendUniform(this.currentYuniform, this.currentY);
            this.shader.sendUniform(this.nextXuniform, this.nextX);
            this.shader.sendUniform(this.nextYuniform, this.nextY);
            this.shader.sendUniform(this.interpUniform, this.interpOffset);

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.shader);
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind shader
            this.shader.unbind();
        }
    }
};

