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
//      renderer/sprite.js : Sprite management                                //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Sprite class definition                                                   //
////////////////////////////////////////////////////////////////////////////////
function Sprite(renderer)
{
    // Sprite loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Sprite VBO
    this.vertexBuffer = null;
    // Sprite texture
    this.texture = null;
    // Sprite model matrix
    this.modelMatrix = null;

    // Sprite texture UV offset
    this.uoffset = 0.0;
    this.voffset = 0.0;
    // Sprite texture UV size
    this.usize = 1.0;
    this.vsize = 1.0;
}

Sprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init sprite                                                    //
    //  param tex : Texture pointer                                           //
    //  param uoffset : Sprite texture U offset                               //
    //  param voffset : Sprite texture V offset                               //
    //  param usize : Sprite texture U size                                   //
    //  param vsize : Sprite texture V size                                   //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, uoffset, voffset, usize, vsize)
    {
        // Reset sprite
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        if (uoffset !== undefined) { this.uoffset = uoffset; }
        if (voffset !== undefined) { this.voffset = voffset; }
        if (usize !== undefined) { this.usize = usize; }
        if (vsize !== undefined) { this.vsize = vsize; }

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
            this.uoffset, 1.0-(this.voffset+this.vsize),
            this.uoffset+this.usize, 1.0-this.voffset
        );

        // Sprite loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetMatrix : Reset sprite model matrix                               //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set sprite model matrix                                   //
    //  param modelMatrix : Sprite model matrix                               //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate sprite on X axis                                    //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate sprite on Y axis                                    //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate sprite                                                //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleX : Scale sprite along the X axis                                //
    //  param scaleX : X factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleY : Scale sprite along the Y axis                                //
    //  param scaleY : Y factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render sprite                                                //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        if (this.loaded)
        {
            // Bind default shader
            this.renderer.shader.bind();

            // Send shader uniforms
            this.renderer.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.renderer.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.renderer.shader.sendModelMatrix(this.modelMatrix);

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.draw();
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind default shader
            this.renderer.shader.unbind();
        }
    }
};

