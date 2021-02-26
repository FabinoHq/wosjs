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
//      renderer/renderer.js : WOS Rendering management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  WOS WebGL context names                                                   //
////////////////////////////////////////////////////////////////////////////////
const WOSGLContextNames = [
    "webgl", 
    "experimental-webgl",
    "webkit-3d",
    "moz-webgl"
];


////////////////////////////////////////////////////////////////////////////////
//  Renderer class definition                                                 //
////////////////////////////////////////////////////////////////////////////////
function Renderer()
{
    // Renderer loaded status
    this.loaded = false;

    // WebGL contexts
    this.gl = null;
    this.context = null;
    this.ctx = null;

    // WebGL offscreen contexts
    this.offCanvas = null;
    this.offContext = null;

    // Size of the renderer
    this.width = 0;
    this.height = 0;

    // Aspect ratio of the renderer
    this.ratio = 1.0;

    // Size of the viewport
    this.vpwidth = 0.0;
    this.vpheight = 0.0;

    // Offset of the viewport
    this.vpoffx = 0.0;
    this.vpoffy = 0.0;

    // Default graphics pipeline
    this.vertexBuffer = null;
    this.shader = null;
    this.worldMatrix = new Matrix4x4();
    this.projMatrix = new Matrix4x4();
    this.view = null;
    this.camera = null;

    // Lighting
    this.worldLight = null;
    this.dynamicLights = null;
}

Renderer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init renderer                                                  //
    //  param canvas : Renderer's canvas name to init                         //
    ////////////////////////////////////////////////////////////////////////////
    init: function(canvas)
    {
        var i = 0;
        var texFloatExt = 0;
        var depthTextureExt = 0;
        
        // Reset renderer
        this.loaded = false;
        this.gl = null;
        this.context = null;
        this.ctx = null;
        this.offCanvas = null;
        this.offContext = null;
        this.width = 0;
        this.height = 0;
        this.ratio = 1.0;
        this.vpwidth = 0.0;
        this.vpheight = 0.0;
        this.vpoffx = 0.0;
        this.vpoffy = 0.0;
        this.vertexBuffer = null;
        this.shader = null;
        this.worldMatrix.setIdentity();
        this.projMatrix.setIdentity();
        this.view = null;
        this.camera = null;
        this.worldLight = null;
        this.dynamicLights = null;

        // Get html canvas
        this.context = document.getElementById(canvas);

        // Check context
        if (!this.context) return false;

        // Check rendering context
        if (!window.WebGLRenderingContext) return false;

        // Check valid context
        for (i = 0; i < WOSGLContextNames.length; ++i)
        {
            try
            {
                this.gl = this.context.getContext(
                    WOSGLContextNames[i], { alpha: false, antialias: true }
                );
            }
            catch(e)
            {
                this.gl = null;
            }

            if (this.gl)
            {
                // Valid context found
                break;
            }
        }

        // No valid context found
        if (!this.gl) return false;

        // Check texture float extension
        texFloatExt = this.gl.getExtension("OES_texture_float");
        if (!texFloatExt) return false;

        // Check depth texture extension
        depthTextureExt = this.gl.getExtension("WEBGL_depth_texture");
        if (!depthTextureExt) return false;

        // Get canvas context
        this.ctx = this.context.getContext("2d");

        // Set context pointer lock function
        this.context.requestPointerLock =
            this.context.requestPointerLock ||
            this.context.mozRequestPointerLock ||
            this.context.webkitRequestPointerLock;

        // Init context handlers
        this.context.addEventListener(
            "webglcontextlost", 
            this.handleContextLost, 
            false
        );
        this.context.addEventListener(
            "webglcontextrestored", 
            this.handleContextRestored,
            false
        );

        // Init context size
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.width <= 1.0) this.width = 1.0;
        if (this.height <= 1.0) this.height = 1.0;
        this.context.width = this.width;
        this.context.height = this.height;

        // Create offscreen canvas
        this.offCanvas = document.createElement('canvas');
        if (!this.offCanvas) return false;
        this.offCanvas.width = 1;
        this.offCanvas.height = 1;

        // Get offscreen context
        this.offContext = this.offCanvas.getContext('2d');
        if (!this.offContext) return false;

        // Init default vbo
        this.vertexBuffer = new VertexBuffer(this.gl);
        if (!this.vertexBuffer) return false;
        if (!this.vertexBuffer.init()) return false;

        // Init default shader
        this.shader = new Shader(this.gl);
        if (!this.shader) return false;
        if (!this.shader.init()) return false;

        // Set renderer clear color
        this.gl.clearColor(
            WOSDefaultClearColorRed,
            WOSDefaultClearColorGreen,
            WOSDefaultClearColorBlue,
            1.0
        );

        // Aspect ratio clamping
        this.vpwidth = this.width;
        this.vpheight = this.height;
        if (WOSRatioMaxClamping)
        {
            if (this.vpwidth >= this.vpheight*WOSRatioXMax)
                this.vpwidth = this.vpheight*WOSRatioXMax;
            if (this.vpheight >= this.vpwidth*WOSRatioYMax)
                this.vpheight = this.vpwidth*WOSRatioYMax;
        }
        if (this.vpwidth <= 1.0) this.vpwidth = 1.0;
        if (this.vpheight <= 1.0) this.vpheight = 1.0;
        this.vpoffx = (this.width-this.vpwidth)*0.5;
        this.vpoffy = (this.height-this.vpheight)*0.5;
        if (this.vpheight > 0.0) this.ratio = this.vpwidth/this.vpheight;

        // Init viewport
        this.gl.viewport(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);
        this.gl.scissor(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);
        this.gl.disable(this.gl.SCISSOR_TEST);

        // Disable dithering
        this.gl.disable(this.gl.DITHER);

        // Init depth and blend functions
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
        this.gl.depthMask(true);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.blendEquation(this.gl.FUNC_ADD);

        // Set texture 0 as active texture
        this.gl.activeTexture(this.gl.TEXTURE0);

        // Set default world matrix
        this.worldMatrix.setIdentity();

        // Set default projection matrix
        this.projMatrix.setOrthographic(
            -this.ratio, this.ratio, 1.0, -1.0, -2.0, 2.0
        );
        this.projMatrix.translateZ(-1.0);

        // Init view
        this.view = new View();

        // Init camera
        this.camera = new Camera();

        // Init world light
        this.worldLight = new WorldLight(this);
        this.worldLight.init();
        this.worldLight.setDirection(0.2, 0.1, 0.9);
        this.worldLight.setColor(1.0, 1.0, 1.0, 0.2);
        this.worldLight.setAmbient(1.0, 1.0, 1.0, 0.1);

        // Init dynamic lights
        this.dynamicLights = new DynamicLights(this);
        this.dynamicLights.init();

        // Renderer is successfully loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clear : Clear renderer                                                //
    ////////////////////////////////////////////////////////////////////////////
    clear: function()
    {
        // Unbind framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // Update context size
        this.context.width = this.width;
        this.context.height = this.height;

        // Aspect ratio clamping
        this.vpwidth = this.width;
        this.vpheight = this.height;
        if (WOSRatioMaxClamping)
        {
            if (this.vpwidth >= this.vpheight*WOSRatioXMax)
                this.vpwidth = this.vpheight*WOSRatioXMax;
            if (this.vpheight >= this.vpwidth*WOSRatioYMax)
                this.vpheight = this.vpwidth*WOSRatioYMax;
        }
        if (this.vpwidth <= 1.0) this.vpwidth = 1.0;
        if (this.vpheight <= 1.0) this.vpheight = 1.0;
        this.vpoffx = (this.width-this.vpwidth)*0.5;
        this.vpoffy = (this.height-this.vpheight)*0.5;
        if (this.vpheight > 0.0) this.ratio = this.vpwidth/this.vpheight;

        // Update viewport
        this.gl.viewport(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);
        this.gl.scissor(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);
        this.gl.disable(this.gl.SCISSOR_TEST);

        // Set renderer clear color
        this.gl.clearColor(
            WOSDefaultClearColorRed,
            WOSDefaultClearColorGreen,
            WOSDefaultClearColorBlue,
            1.0
        );

        // Clear screen
        this.gl.clear(
            this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT
        );

        // Set default view
        this.setDefaultView();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setActive : Set renderer as active                                    //
    ////////////////////////////////////////////////////////////////////////////
    setActive: function()
    {
        // Unbind framebuffer
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);

        // Update viewport
        this.gl.viewport(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);

        // Disable subzone
        this.disableSubzone();

        // Set default view
        this.setDefaultView();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSubzone : Set rendering sub zone                                   //
    //  param width : Sub zone width                                          //
    //  param height : Sub zone height                                        //
    //  param offsetX : Subzone X offset                                      //
    //  param offsetY : Subzone Y offset                                      //
    ////////////////////////////////////////////////////////////////////////////
    setSubzone: function(width, height, offsetX, offsetY)
    {
        this.gl.scissor(
            this.vpoffx+(((offsetX/this.ratio)+1.0)*0.5*this.vpwidth),
            this.vpoffy+((offsetY+1.0)*0.5*this.vpheight),
            this.vpwidth/this.ratio*0.5*width,
            this.vpheight*0.5*height
        );
        this.gl.enable(this.gl.SCISSOR_TEST);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  disableSubzone : Disable rendering sub zone                           //
    ////////////////////////////////////////////////////////////////////////////
    disableSubzone: function()
    {
        this.gl.scissor(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);
        this.gl.disable(this.gl.SCISSOR_TEST);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDefaultView : Set default rendering view                           //
    ////////////////////////////////////////////////////////////////////////////
    setDefaultView: function()
    {
        if (this.view)
        {
            // Reset projection matrix
            this.projMatrix.setOrthographic(
                -this.ratio, this.ratio, 1.0, -1.0, -2.0, 2.0
            );
            this.projMatrix.translateZ(-1.0);

            // Reset view
            this.view.reset();

            // Disable depth buffer
            this.gl.disable(this.gl.DEPTH_TEST);

            // Update view matrix
            this.view.compute();
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setView : Set rendering view                                          //
    //  param view : View matrix to use for rendering                         //
    ////////////////////////////////////////////////////////////////////////////
    setView: function(view)
    {
        if (view)
        {
            // Reset projection matrix
            this.projMatrix.setOrthographic(
                -this.ratio, this.ratio, 1.0, -1.0, -2.0, 2.0
            );
            this.projMatrix.translateZ(-1.0);

            // Set current view
            this.view = view;

            // Disable depth buffer
            this.gl.disable(this.gl.DEPTH_TEST);

            // Update view matrix
            this.view.compute();
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCamera : Set rendering camera                                      //
    //  param camera : Camera to use for rendering                            //
    //  param frametime : Frametime to compute camera movements               //
    ////////////////////////////////////////////////////////////////////////////
    setCamera: function(camera, frametime)
    {
        if (camera)
        {
            // Set current view
            this.camera = camera;

            // Enable depth buffer
            this.gl.enable(this.gl.DEPTH_TEST);

            // Clear depth buffer
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT);

            // Update view matrix
            this.camera.compute(this.ratio, frametime);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleOnResize : Handle render zone resize                            //
    ////////////////////////////////////////////////////////////////////////////
    handleOnResize: function()
    {
        // Update renderer size
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        if (this.width <= 1.0) this.width = 1.0;
        if (this.height <= 1.0) this.height = 1.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleContextLost : Handle renderer context lost                      //
    //  param e : event                                                       //
    ////////////////////////////////////////////////////////////////////////////
    handleContextLost: function(e)
    {
        console.log("context lost");
        e.preventDefault();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleContextLost : Handle renderer context restored                  //
    ////////////////////////////////////////////////////////////////////////////
    handleContextRestored: function()
    {
        console.log("context restored");
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMouseLock : Set mouse locked status                                //
    ////////////////////////////////////////////////////////////////////////////
    setMouseLock: function(lock)
    {
        if (lock)
        {
            // Request pointer lock
            this.context.requestPointerLock();
        }
        else
        {
            // Exit pointer lock
            document.exitPointerLock();
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderText : Render text offscreen into texture with WOS default font //
    //  param text : Text to render                                           //
    //  param width : Width of the text texture to render                     //
    //  param height : Height of the text texture to render                   //
    //  param fontsize : Font size of the text to render                      //
    //  return : Text texture pixels data                                     //
    ////////////////////////////////////////////////////////////////////////////
    renderText: function(text, width, height, fontsize)
    {
        var textData = null;
        var pixelsData = null;

        // Update offscreen canvas size
        this.offCanvas.width = Math.round(width);
        this.offCanvas.height = Math.round(height);

        // Draw text
        this.offContext.font = fontsize.toString() + "px wosfont";
        this.offContext.fillText(text, 0, (0.84*fontsize));

        // Get pixels data
        textData = this.offContext.getImageData(
            0, 0, this.offCanvas.width, this.offCanvas.height
        );
        pixelsData = new Uint8Array(textData.data.buffer);
        return pixelsData;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderImage : Render image offscreen into texture                     //
    //  param image : Image to render                                         //
    //  param width : Width of the image texture to render                    //
    //  param height : Height of the image texture to render                  //
    //  return : Image texture pixels data                                    //
    ////////////////////////////////////////////////////////////////////////////
    renderImage: function(image, width, height)
    {
        var imageData = null;
        var pixelsData = null;

        // Update offscreen canvas size
        this.offCanvas.width = Math.round(width);
        this.offCanvas.height = Math.round(height);

        // Create image context
        this.offContext.drawImage(image, 0, 0);

        // Get pixels data
        imageData = this.offContext.getImageData(
            0, 0, this.offCanvas.width, this.offCanvas.height
        );
        pixelsData = new Uint8Array(imageData.data.buffer);
        return pixelsData;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTextWidth : Get text width with WOS default font                   //
    //  param text : Text to get width of                                     //
    //  param fontsize : Size of the font used                                //
    //  return : Width of the text in pixels                                  //
    ////////////////////////////////////////////////////////////////////////////
    getTextWidth: function(text, fontsize)
    {
        var textWidth = 1;
        this.offContext.font = fontsize.toString() + "px wosfont";
        textWidth = this.offContext.measureText(text).width;
        return textWidth;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get renderer's width                                       //
    //  return : Width of the renderer in pixels                              //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get renderer's height                                     //
    //  return : Height of the renderer in pixels                             //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getRatio : Get renderer's viewport ratio                              //
    //  return : Ratio of the renderer's viewport                             //
    ////////////////////////////////////////////////////////////////////////////
    getRatio: function()
    {
        return this.ratio;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getViewportWidth : Get renderer's viewport width                      //
    //  return : Width of the viewport in pixels                              //
    ////////////////////////////////////////////////////////////////////////////
    getViewportWidth: function()
    {
        return this.vpwidth;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getViewportHeight : Get renderer's viewport height                    //
    //  return : Height of the viewport in pixels                             //
    ////////////////////////////////////////////////////////////////////////////
    getViewportHeight: function()
    {
        return this.vpheight;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getViewportHeight : Get renderer's viewport offset on X axis          //
    //  return : X offset of the viewport in pixels                           //
    ////////////////////////////////////////////////////////////////////////////
    getViewportOffsetX: function()
    {
        return this.vpoffx;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getViewportHeight : Get renderer's viewport offset on Y axis          //
    //  return : Y offset of the viewport in pixels                           //
    ////////////////////////////////////////////////////////////////////////////
    getViewportOffsetY: function()
    {
        return this.vpoffy;
    }
};
