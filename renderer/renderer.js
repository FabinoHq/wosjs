////////////////////////////////////////////////////////////////////////////////
//   _______                               ________________________________   //
//   \\ .   \                     ________/ . . . . . . . . . . . . . .   /   //
//    \\ .   \     ____       ___/ . . . . .   __________________________/    //
//     \\ .   \   //   \   __/. . .  _________/   /    //.   _________/       //
//      \\ .   \_//     \_//     ___/.  _____    /    //.   /_____            //
//       \\ .   \/   _   \/    _///.   /    \\   |    \\ .        \           //
//        \\ .      /\\       /  ||.   |    ||   |     \\______    \          //
//         \\ .    /  \\     /   ||.   \____//   |  _________//    /          //
//          \\ .  /    \\   /    // .            / // . . . .     /           //
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
//      renderer.js : WOS Rendering management                                //
////////////////////////////////////////////////////////////////////////////////


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

    // Size of the viewport
    this.vpwidth = 0.0;
    this.vpheight = 0.0;

    // Offset of the viewport
    this.vpoffx = 0.0;
    this.vpoffy = 0.0;

    // Default graphics pipeline
    this.shader = null;
    this.projMatrix = null;
    this.view = null;
}

Renderer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init renderer                                                  //
    //  param canvas : Renderer's canvas reference to init                    //
    ////////////////////////////////////////////////////////////////////////////
    init: function(canvas)
    {
        // WebGL names
        var glContextNames = [
            "webgl", 
            "experimental-webgl",
            "webkit-3d",
            "moz-webgl"
        ];
        var i = 0;
        
        // Reset renderer
        this.loaded = false;
        this.gl = null;
        this.context = null;
        this.ctx = null;
        this.offCanvas = null;
        this.offContext = null;
        this.width = 0;
        this.height = 0;
        this.vpwidth = 0.0;
        this.vpheight = 0.0;
        this.vpoffx = 0.0;
        this.vpoffy = 0.0;
        this.shader = null;
        this.projMatrix = null;
        this.view = null;

        // Get html canvas
        this.context = document.getElementById(canvas);

        // Check context
        if (!this.context)
        {
            return false;
        }

        // Check rendering context
        if (!window.WebGLRenderingContext)
        {
            return false;
        }

        // Check valid context
        for (i = 0; i < glContextNames.length; ++i)
        {
            try {
            this.gl = this.context.getContext(glContextNames[i]);
            } catch(e) {}
            
            if (this.gl)
            {
                // Valid context found
                break;
            }
        }

        if (!this.gl)
        {
            // No valid context found
            return false;
        }
        
        // Get canvas context
        this.ctx = this.context.getContext("2d");

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
        if (this.width <= 1.0) { this.width = 1.0; }
        if (this.height <= 1.0) { this.height = 1.0; }
        this.context.width = this.width;
        this.context.height = this.height;

        // Create offscreen canvas
        this.offCanvas = document.createElement('canvas');
        if (!this.offCanvas)
        {
            return false;
        }
        this.offCanvas.width = 1;
        this.offCanvas.height = 1;

        // Get offscreen context
        this.offContext = this.offCanvas.getContext('2d');
        if (!this.offContext)
        {
            return false;
        }

        // Set default clear color
        this.gl.clearColor(
            WOSDefaultClearColorRed,
            WOSDefaultClearColorGreen,
            WOSDefaultClearColorBlue,
            1.0
        );

        // Aspect ratio clamping
        this.vpwidth = this.width;
        this.vpheight = this.height;
        if (this.vpwidth >= this.vpheight*WOSRatioXMax)
        {
            this.vpwidth = this.vpheight*WOSRatioXMax;
        }
        if (this.vpheight >= this.vpwidth*WOSRatioYMax)
        {
            this.vpheight = this.vpwidth*WOSRatioYMax;
        }
        if (this.vpwidth <= 1.0) { this.vpwidth = 1.0; }
        if (this.vpheight <= 1.0) { this.vpheight = 1.0; }
        this.vpoffx = (this.width-this.vpwidth)*0.5;
        this.vpoffy = (this.height-this.vpheight)*0.5;

        // Set viewport
        this.gl.viewport(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);

        // Init depth and blend function
        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.BLEND);
        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

        // WebGL successfully loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clear : Clear renderer                                                //
    ////////////////////////////////////////////////////////////////////////////
    clear: function()
    {
        // Update context size
        this.context.width = this.width;
        this.context.height = this.height;

        // Aspect ratio clamping
        this.vpwidth = this.width;
        this.vpheight = this.height;
        if (this.vpwidth >= this.vpheight*WOSRatioXMax)
        {
            this.vpwidth = this.vpheight*WOSRatioXMax;
        }
        if (this.vpheight >= this.vpwidth*WOSRatioYMax)
        {
            this.vpheight = this.vpwidth*WOSRatioYMax;
        }
        if (this.vpwidth <= 1.0) { this.vpwidth = 1.0; }
        if (this.vpheight <= 1.0) { this.vpheight = 1.0; }
        this.vpoffx = (this.width-this.vpwidth)*0.5;
        this.vpoffy = (this.height-this.vpheight)*0.5;

        // Update viewport
        this.gl.viewport(this.vpoffx, this.vpoffy, this.vpwidth, this.vpheight);

        // Clear screen
        this.gl.clear(
            this.gl.COLOR_BUFFER_BIT |
            this.gl.DEPTH_BUFFER_BIT |
            this.gl.STENCIL_BUFFER_BIT
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setView : Set rendering view                                          //
    ////////////////////////////////////////////////////////////////////////////
    setView: function(view)
    {
        if (view)
        {
            // Set current view
            this.view = view;

            // Bind shader
            this.shader.bind();

            // Update view matrix
            this.view.compute();
            this.shader.sendViewMatrix(this.view.viewMatrix);
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
        if (this.width <= 1.0) { this.width = 1.0; }
        if (this.height <= 1.0) { this.height = 1.0; }
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
    //  getTextWidth : Get text width with tuffy font                         //
    //  param text : Text to get width of                                     //
    //  param fontsize : Size of the font used                                //
    //  return : Width of the text in pixels                                  //
    ////////////////////////////////////////////////////////////////////////////
    getTextWidth: function(text, fontsize)
    {
        var textWidth = 1;
        this.offContext.font = fontsize.toString() + "px tuffy";
        textWidth = this.offContext.measureText(text).width;
        return textWidth;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderText : Render text offscreen into texture with tuffy font       //
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
        this.offCanvas.width = width;
        this.offCanvas.height = height;

        // Draw text
        this.offContext.scale(1.0, -1.0);
        this.offContext.font = fontsize.toString() + "px tuffy";
        this.offContext.fillText(text, 0, (-0.27*fontsize));

        // Get pixels data
        textData = this.offContext.getImageData(0, 0, width, height);
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
        this.offCanvas.width = width;
        this.offCanvas.height = height;

        // Create image context
        this.offContext.scale(1.0, -1.0);
        this.offContext.drawImage(image, 0, -height);

        // Get pixels data
        imageData = this.offContext.getImageData(0, 0, width, height);
        pixelsData = new Uint8Array(imageData.data.buffer);
        return pixelsData;
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
