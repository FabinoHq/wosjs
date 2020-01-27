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
//      renderer/line.js : Line rendering management                          //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Line class definition                                                     //
//  param renderer : Renderer pointer                                         //
//  param lineShader : Line shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function Line(renderer, lineShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Line shader pointer
    this.lineShader = lineShader;

    // Line VBO
    this.vertexBuffer = null;
    // Line model matrix
    this.modelMatrix = null;
    // Line alpha
    this.alpha = 1.0;

    // Line sprite size
    this.width = 1.0;
    this.height = 1.0;
}

Line.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init line                                                      //
    //  param x1 : Line x first position                                      //
    //  param y1 : Line y first position                                      //
    //  param x2 : Line x second position                                     //
    //  param y2 : Line y second position                                     //
    ////////////////////////////////////////////////////////////////////////////
    init: function(x1, y1, x2, y2)
    {
        // Reset line
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.alpha = 1.0;
        this.width = 1.0;
        this.height = 1.0;

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
        this.vertexBuffer.setPlane2D(this.width, this.height);

        // Line loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get line sprite width                                      //
    //  return : Line sprite width                                            //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get line sprite height                                    //
    //  return : Line sprite height                                           //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetMatrix : Reset line sprite model matrix                          //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Reset line sprite model matrix                            //
    //  param modelMatrix : Line sprite model matrix to set                   //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set line sprite alpha                                      //
    //  param alpha : Line sprite alpha to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate line sprite on X axis                               //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate line sprite on Y axis                               //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render line                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Bind line shader
        this.lineShader.shader.bind();

        // Send line shader uniforms
        this.lineShader.shader.sendProjectionMatrix(this.renderer.projMatrix);
        this.lineShader.shader.sendViewMatrix(this.renderer.view.viewMatrix);
        this.lineShader.shader.sendModelMatrix(this.modelMatrix);
        this.lineShader.shader.sendUniform(
            this.lineShader.alphaUniform, this.alpha
        );
        
        // Render VBO
        this.vertexBuffer.bind();
        this.vertexBuffer.render(this.lineShader.shader);
        this.vertexBuffer.unbind();

        // Unbind line shader
        this.lineShader.shader.unbind();
    }
};

