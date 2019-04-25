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
//      renderer/procsprite.js : Procedural sprite management                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  ProcSprite class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function ProcSprite(renderer)
{
    // Procedural sprite loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Procedural sprite shader
    this.shader = null;
    // Procedural sprite VBO
    this.vertexBuffer = null;
    // Procedural sprite model matrix
    this.modelMatrix = null;

    // Procedural sprite shader uniforms locations
    this.uniformTimer = -1;
    this.uniformOffsetX = -1;
    this.uniformOffsetY = -1;
}

ProcSprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init procedural sprite                                         //
    //  param shaderSrc : Procedural sprite fragment shader source            //
    //  param width : Procedural sprite width                                 //
    //  param height : Procedural sprite height                               //
    ////////////////////////////////////////////////////////////////////////////
    init: function(shaderSrc, width, height)
    {
        // Reset procedural sprite
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.uniformTimer = -1;
        this.uniformOffsetX = -1;
        this.uniformOffsetY = -1;

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

        // Update vbo
        this.vertexBuffer.setPlane(width, height);

        // Init shader
        this.shader = new Shader(this.renderer.gl);
        if (!this.shader)
        {
            return false;
        }
        if (!this.shader.init(defaultVertexShaderSrc, shaderSrc))
        {
            return false;
        }

        // Get uniforms locations
        this.shader.bind();
        this.uniformTimer = this.shader.getUniform("timer");
        if (this.uniformTimer == -1) return false;
        this.uniformOffsetX = this.shader.getUniform("offsetX");
        if (this.uniformOffsetX == -1) return false;
        this.uniformOffsetY = this.shader.getUniform("offsetY");
        if (this.uniformOffsetY == -1) return false;
        this.shader.unbind();

        // Sprite loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set procedural sprite size                                  //
    //  param width : Procedural sprite width to set                          //
    //  param height : Procedural sprite height to set                        //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        // Update vbo
        this.vertexBuffer.setPlane(width, height);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetMatrix : Reset procedural sprite model matrix                    //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Reset procedural sprite model matrix                      //
    //  param modelMatrix : Procedural sprite model matrix to set             //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate procedural sprite on X axis                         //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate procedural sprite on Y axis                         //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render procedural sprite                                     //
    //  param timer : Time offset for aniumated procedural generation         //
    //  param offsetX : X position offset for procedural generation           //
    //  param offsetY : Y position offset for procedural generation           //
    ////////////////////////////////////////////////////////////////////////////
    render: function(timer, offsetX, offsetY)
    {
        if (this.loaded)
        {
            // Bind shader
            this.shader.bind();

            // Send shader uniforms
            this.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.shader.sendModelMatrix(this.modelMatrix);
            this.shader.sendUniform(this.uniformTimer, timer);
            this.shader.sendUniform(this.uniformOffsetX, offsetX);
            this.shader.sendUniform(this.uniformOffsetY, offsetY);
            
            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.draw();
            this.vertexBuffer.unbind();

            // Unbind shader
            this.shader.unbind();
        }
    }
};

