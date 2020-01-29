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
//      renderer/rect.js : Rect rendering management                          //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Rect class definition                                                     //
//  param renderer : Renderer pointer                                         //
//  param rectShader : Rect shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function Rect(renderer, rectShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Rect shader pointer
    this.rectShader = rectShader;

    // Rect VBO
    this.vertexBuffer = null;
    // Rect model matrix
    this.modelMatrix = null;
    // Rect color
    this.color = null;
    // Rect alpha
    this.alpha = 1.0;

    // Rect position
    this.position = null;
    // Rect width
    this.width = 1.0;
    // Rect height
    this.height = 1.0;
}

Rect.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init rect                                                      //
    //  param width : Rect width                                              //
    //  param height : Rect height                                            //
    ////////////////////////////////////////////////////////////////////////////
    init: function(width, height)
    {
        // Reset rect
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.color = new Vector3(1.0, 1.0, 1.0);
        this.alpha = 1.0;
        this.position = new Vector2(0.0, 0.0);
        this.width = width;
        this.height = height;

        // Check gl pointer
        if (!this.renderer.gl)
        {
            return false;
        }

        // Check rect shader pointer
        if (!this.rectShader)
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
        this.vertexBuffer.setPlane2D(1.0, 1.0);

        // Rect loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set rect size                                               //
    //  param width : Rect width to set                                       //
    //  param height : Rect height to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.width = width;
        this.height = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set rect width                                             //
    //  param width : Rect width to set                                       //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.width = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set rect height                                           //
    //  param height : Rect height to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.height = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColor : Set rect color                                             //
    //  param r : Rect red color channel to set                               //
    //  param g : Rect blue color channel to set                              //
    //  param b : Rect green color channel to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b)
    {
        this.color.vec[0] = r;
        this.color.vec[1] = g;
        this.color.vec[2] = b;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set rect alpha                                             //
    //  param alpha : Rect alpha to set                                       //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Translate rect sprite on X axis                               //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Translate rect on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate rect sprite on X axis                               //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate rect on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get rect width                                             //
    //  return : Rect width                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get rect height                                           //
    //  return : Rect height                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get rect alpha                                             //
    //  return : Rect alpha                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get rect X position                                            //
    //  return : Rect X position                                              //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get rect Y position                                            //
    //  return : Rect Y position                                              //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render line                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set rect model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translate(
            this.position.vec[0], this.position.vec[1], 0.0
        );
        this.modelMatrix.scale(this.width, this.height, 0.0);

        // Bind rect shader
        this.rectShader.shader.bind();

        // Send rect shader uniforms
        this.rectShader.shader.sendProjectionMatrix(this.renderer.projMatrix);
        this.rectShader.shader.sendViewMatrix(this.renderer.view.viewMatrix);
        this.rectShader.shader.sendModelMatrix(this.modelMatrix);
        this.rectShader.shader.sendUniformVec3(
            this.rectShader.colorUniform, this.color
        );
        this.rectShader.shader.sendUniform(
            this.rectShader.alphaUniform, this.alpha
        );

        // Render VBO
        this.vertexBuffer.bind();
        this.vertexBuffer.render(this.rectShader.shader);
        this.vertexBuffer.unbind();

        // Unbind rect shader
        this.rectShader.shader.unbind();
    }
};

