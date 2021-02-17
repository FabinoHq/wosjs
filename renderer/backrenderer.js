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
//      renderer/backrenderer.js : WOS Background rendering management        //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  BackRenderer class definition                                             //
//  param renderer : Renderer pointer                                         //
//  param backrendererShader : Background renderer shader pointer             //
////////////////////////////////////////////////////////////////////////////////
function BackRenderer(renderer, backrendererShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Background renderer shader
    this.backrendererShader = backrendererShader;

    // Background renderer shader uniforms locations
    this.alphaUniform = -1;

    // Size of the background renderer
    this.width = 0;
    this.height = 0;

    // Aspect ratio of the background renderer
    this.ratio = 1.0;

    // Background renderer framebuffer
    this.framebuffer = null;
    // Background renderer depth buffer
    this.depthbuffer = null;
    // Background renderer texture
    this.texture = null;

    // Background renderer model matrix
    this.modelMatrix = new Matrix4x4();

    // Background renderer position
    this.position = new Vector2(0.0, 0.0);
    // Background renderer size
    this.size = new Vector2(1.0, 1.0);
    // Background renderer rotation angle
    this.angle = 0.0;
    // Background renderer alpha
    this.alpha = 1.0;
}

BackRenderer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init background renderer                                       //
    ////////////////////////////////////////////////////////////////////////////
    init: function(width, height)
    {
        // Reset background renderer
        this.width = 0;
        this.height = 0;
        if (width !== undefined) this.width = Math.round(width);
        if (height !== undefined) this.height = Math.round(height);
        this.ratio = 1.0;
        if (this.height > 0.0) this.ratio = this.width/this.height;
        this.framebuffer = null;
        this.depthbuffer = null;
        this.texture = null;
        this.modelMatrix.setIdentity();
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        this.angle = 0.0;
        this.alpha = 1.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check background renderer shader pointer
        if (!this.backrendererShader) return false;

        // Get background renderer shader uniforms locations
        this.backrendererShader.bind();
        this.alphaUniform = this.backrendererShader.getUniform("alpha");
        this.backrendererShader.unbind();

        // Init background renderer framebuffer
        this.framebuffer = this.renderer.gl.createFramebuffer();
        if (!this.framebuffer)
        {
            // Could not create framebuffer
            return false;
        }
        this.renderer.gl.bindFramebuffer(
            this.renderer.gl.FRAMEBUFFER, this.framebuffer
        );

        // Init background renderer depth buffer
        this.depthbuffer = this.renderer.gl.createRenderbuffer();
        if (!this.depthbuffer)
        {
            // Could not create depth buffer
            return false;
        }
        this.renderer.gl.bindRenderbuffer(
            this.renderer.gl.RENDERBUFFER, this.depthbuffer
        );

        // Attach depth buffer to framebuffer
        this.renderer.gl.renderbufferStorage(
            this.renderer.gl.RENDERBUFFER, this.renderer.gl.DEPTH_COMPONENT16,
            this.width, this.height
        );
        this.renderer.gl.framebufferRenderbuffer(
            this.renderer.gl.FRAMEBUFFER, this.renderer.gl.DEPTH_ATTACHMENT,
            this.renderer.gl.RENDERBUFFER, this.depthbuffer
        );

        // Init background renderer texture
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

        // Background renderer successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clear : Clear background renderer                                     //
    ////////////////////////////////////////////////////////////////////////////
    clear: function()
    {
        // Bind framebuffer
        this.renderer.gl.bindFramebuffer(
            this.renderer.gl.FRAMEBUFFER, this.framebuffer
        );

        // Update viewport
        this.renderer.gl.viewport(0, 0, this.width, this.height);
        this.renderer.gl.scissor(0, 0, this.width, this.height);
        this.renderer.gl.disable(this.renderer.gl.SCISSOR_TEST);

        // Set background renderer clear color
        this.renderer.gl.clearColor(0.0, 0.0, 0.0, 0.0);

        // Clear background renderer
        this.renderer.gl.clear(
            this.renderer.gl.COLOR_BUFFER_BIT |
            this.renderer.gl.DEPTH_BUFFER_BIT |
            this.renderer.gl.STENCIL_BUFFER_BIT
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setActive : Set background renderer as active                         //
    ////////////////////////////////////////////////////////////////////////////
    setActive: function()
    {
        // Bind framebuffer
        this.renderer.gl.bindFramebuffer(
            this.renderer.gl.FRAMEBUFFER, this.framebuffer
        );

        // Update viewport
        this.renderer.gl.viewport(0, 0, this.width, this.height);
        this.renderer.gl.scissor(0, 0, this.width, this.height);
        this.renderer.gl.disable(this.renderer.gl.SCISSOR_TEST);

        // Set default view
        this.setDefaultView();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDefaultView : Set default back renderer view                       //
    ////////////////////////////////////////////////////////////////////////////
    setDefaultView: function()
    {
        if (this.renderer.view)
        {
            // Reset projection matrix
            this.renderer.projMatrix.setOrthographic(
                -this.ratio, this.ratio, -1.0, 1.0, -2.0, 2.0
            );
            this.renderer.projMatrix.translateZ(-1.0);

            // Reset view
            this.renderer.view.reset();

            // Disable depth buffer
            this.renderer.gl.disable(this.renderer.gl.DEPTH_TEST);

            // Update view matrix
            this.renderer.view.compute();
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setView : Set back renderer view                                      //
    //  param view : View matrix to use for back rendering                    //
    ////////////////////////////////////////////////////////////////////////////
    setView: function(view)
    {
        if (view)
        {
            // Reset projection matrix
            this.renderer.projMatrix.setOrthographic(
                -this.ratio, this.ratio, -1.0, 1.0, -2.0, 2.0
            );
            this.renderer.projMatrix.translateZ(-1.0);

            // Set current view
            this.renderer.view = view;

            // Disable depth buffer
            this.renderer.gl.disable(this.renderer.gl.DEPTH_TEST);

            // Update view matrix
            this.renderer.view.compute();
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCamera : Set back renderer camera                                  //
    //  param camera : Camera to use for back rendering                       //
    //  param frametime : Frametime to compute camera movements               //
    ////////////////////////////////////////////////////////////////////////////
    setCamera: function(camera, frametime)
    {
        if (camera)
        {
            // Set current view
            this.renderer.camera = camera;

            // Enable depth buffer
            this.renderer.gl.enable(this.renderer.gl.DEPTH_TEST);

            // Clear depth buffer
            this.renderer.gl.clear(this.renderer.gl.DEPTH_BUFFER_BIT);

            // Update view matrix
            this.renderer.camera.compute(this.ratio, frametime);
            this.renderer.camera.projMatrix.scaleY(-1.0);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set backrenderer position                               //
    //  param x : Backrenderer X position                                     //
    //  param y : Backrenderer Y position                                     //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set renderer position from a 2 components vector    //
    //  param vector : 2 components vector to set backrenderer position from  //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set backrenderer X position                                    //
    //  param x : Backrenderer X position                                     //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set backrenderer Y position                                    //
    //  param y : Backrenderer Y position                                     //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate backrenderer                                         //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate backrenderer by a 2 components vector            //
    //  param vector : 2 components vector to translate backrenderer by       //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate backrenderer on X axis                              //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate backrenderer on Y axis                              //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set backrenderer size                                       //
    //  param width : Backrenderer width to set                               //
    //  param height : Backrenderer height to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set backrenderer size from a 2 components vector        //
    //  param vector : 2 components vector to set backrenderer size from      //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set backrenderer width                                     //
    //  param width : Backrenderer width to set                               //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set backrenderer height                                   //
    //  param height : Backrenderer height to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set backrenderer rotation angle                            //
    //  param angle : Backrenderer rotation angle to set in degrees           //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate backrenderer                                          //
    //  param angle : Angle to rotate backrenderer by in degrees              //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getRenderWidth : Get background renderer's width                      //
    //  return : Width of the background renderer in pixels                   //
    ////////////////////////////////////////////////////////////////////////////
    getRenderWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getRenderHeight : Get background renderer's height                    //
    //  return : Height of the background renderer in pixels                  //
    ////////////////////////////////////////////////////////////////////////////
    getRenderHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getRenderRatio : Get background renderer's ratio                      //
    //  return : Ratio of the background renderer's                           //
    ////////////////////////////////////////////////////////////////////////////
    getRenderRatio: function()
    {
        return this.ratio;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get backrenderer X position                                    //
    //  return : Backrenderer X position                                      //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get backrenderer Y position                                    //
    //  return : Backrenderer Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get backrenderer width                                     //
    //  return : Backrenderer width                                           //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get backrenderer height                                   //
    //  return : Backrenderer height                                          //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get backrenderer rotation angle                            //
    //  return : Backrenderer rotation angle in degrees                       //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get backrenderer alpha                                     //
    //  return : Backrenderer alpha                                           //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render background renderer                                   //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set background renderer model matrix
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

        // Bind background renderer shader
        this.backrendererShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.backrendererShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.backrendererShader.sendUniform(this.alphaUniform, this.alpha);

        // Bind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.texture);

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.backrendererShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Unbind sprite shader
        this.backrendererShader.unbind();
    }
};
