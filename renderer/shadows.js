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
//      renderer/shadows.js : Shadows management                              //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Shadows class definition                                                  //
//  param renderer : Renderer pointer                                         //
////////////////////////////////////////////////////////////////////////////////
function Shadows(renderer)
{
    // Renderer pointer
    this.renderer = renderer;

    // Size of the shadows texture
    this.width = 0;
    this.height = 0;

    // Aspect ratio of the shadows texture
    this.ratio = 1.0;

    // Shadows framebuffer
    this.framebuffer = null;
    // Shadows texture
    this.texture = null;
    // Shadows depth texture
    this.depthTexture = null;

    // Shadows projection matrix
    this.projMatrix = new Matrix4x4();
    // Shadows view matrix
    this.viewMatrix = new Matrix4x4();
    // Shadows world matrix
    this.worldMatrix = new Matrix4x4();
}

Shadows.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init shadows                                                   //
    //  param width : Width of the background renderer                        //
    //  param height : Height of the background renderer                      //
    ////////////////////////////////////////////////////////////////////////////
    init: function(width, height)
    {
        // Reset shadows
        this.width = 0;
        this.height = 0;
        if (width !== undefined) this.width = Math.round(width);
        if (height !== undefined) this.height = Math.round(height);
        this.ratio = 1.0;
        if (this.height > 0.0) this.ratio = this.width/this.height;
        this.framebuffer = null;
        this.texture = null;
        this.depthTexture = null;
        this.projMatrix.setIdentity();
        this.viewMatrix.setIdentity();
        this.worldMatrix.setIdentity();

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Init shadows framebuffer
        this.framebuffer = this.renderer.gl.createFramebuffer();
        if (!this.framebuffer)
        {
            // Could not create framebuffer
            return false;
        }
        this.renderer.gl.bindFramebuffer(
            this.renderer.gl.FRAMEBUFFER, this.framebuffer
        );

        // Init shadows texture
        this.texture = this.renderer.gl.createTexture();
        if (!this.texture)
        {
            // Could not create texture
            return false;
        }
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            this.width, this.height, 0, this.renderer.gl.RGBA,
            this.renderer.gl.UNSIGNED_BYTE, null
        );

        // Set texture wrap mode
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_S,
            this.renderer.gl.CLAMP_TO_EDGE
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_T,
            this.renderer.gl.CLAMP_TO_EDGE
        );

        // Set texture min and mag filters
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MIN_FILTER,
            this.renderer.gl.LINEAR
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MAG_FILTER,
            this.renderer.gl.LINEAR
        );

        // Attach texture to framebuffer
        this.renderer.gl.framebufferTexture2D(
            this.renderer.gl.FRAMEBUFFER, this.renderer.gl.COLOR_ATTACHMENT0,
            this.renderer.gl.TEXTURE_2D, this.texture, 0
        );

        // Unbind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Init shadows depth texture
        this.depthTexture = this.renderer.gl.createTexture();
        if (!this.depthTexture)
        {
            // Could not create depth texture
            return false;
        }
        this.renderer.gl.bindTexture(
            this.renderer.gl.TEXTURE_2D, this.depthTexture
        );
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.DEPTH_COMPONENT,
            this.width, this.height, 0, this.renderer.gl.DEPTH_COMPONENT,
            this.renderer.gl.UNSIGNED_INT, null
        );

        // Set depth texture wrap mode
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_S,
            this.renderer.gl.CLAMP_TO_EDGE
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_T,
            this.renderer.gl.CLAMP_TO_EDGE
        );

        // Set depth texture min and mag filters
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MIN_FILTER,
            this.renderer.gl.LINEAR
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_MAG_FILTER,
            this.renderer.gl.LINEAR
        );

        // Attach depth texture to framebuffer
        this.renderer.gl.framebufferTexture2D(
            this.renderer.gl.FRAMEBUFFER, this.renderer.gl.DEPTH_ATTACHMENT,
            this.renderer.gl.TEXTURE_2D, this.depthTexture, 0
        );

        // Check framebuffer status
        if (this.renderer.gl.checkFramebufferStatus(
            this.renderer.gl.FRAMEBUFFER) !=
            this.renderer.gl.FRAMEBUFFER_COMPLETE)
        {
            // Invalid framebuffer status
            return false;
        }

        // Unbind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Unbind framebuffer
        this.renderer.gl.bindFramebuffer(this.renderer.gl.FRAMEBUFFER, null);

        // Set projection matrix
        this.projMatrix.setIdentity();
        this.projMatrix.setPerspective(90.0, this.ratio, 0.01, 100.0);

        // Set view matrix
        this.viewMatrix.setIdentity();

        // Shadows loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clear : Clear shadows buffer                                          //
    ////////////////////////////////////////////////////////////////////////////
    clear: function()
    {
        // Bind shadows framebuffer
        this.renderer.gl.bindFramebuffer(
            this.renderer.gl.FRAMEBUFFER, this.framebuffer
        );

        // Update viewport
        this.renderer.gl.viewport(0, 0, this.width, this.height);
        this.renderer.gl.scissor(0, 0, this.width, this.height);
        this.renderer.gl.disable(this.renderer.gl.SCISSOR_TEST);

        // Enable depth test
        this.renderer.gl.enable(this.renderer.gl.DEPTH_TEST);

        // Set shadows buffer renderer clear color
        this.renderer.gl.clearColor(0.0, 0.0, 0.0, 0.0);

        // Clear shadows buffer renderer
        this.renderer.gl.clear(
            this.renderer.gl.COLOR_BUFFER_BIT |
            this.renderer.gl.DEPTH_BUFFER_BIT
        );

        // Set renderer matrices
        this.renderer.camera.projMatrix.setMatrix(this.projMatrix);
        this.renderer.camera.viewMatrix.setMatrix(this.viewMatrix);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setActive : Set shadows buffer as active renderer                     //
    ////////////////////////////////////////////////////////////////////////////
    setActive: function()
    {
        // Enable depth test
        this.renderer.gl.enable(this.renderer.gl.DEPTH_TEST);

        // Bind framebuffer
        this.renderer.gl.bindFramebuffer(
            this.renderer.gl.FRAMEBUFFER, this.framebuffer
        );

        // Update viewport
        this.renderer.gl.viewport(0, 0, this.width, this.height);
        this.renderer.gl.scissor(0, 0, this.width, this.height);
        this.renderer.gl.disable(this.renderer.gl.SCISSOR_TEST);

        // Set renderer matrices
        this.renderer.camera.projMatrix.setMatrix(this.projMatrix);
        this.renderer.camera.viewMatrix.setMatrix(this.viewMatrix);
    }
};
