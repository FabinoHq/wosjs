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
//  WOS WebGL maximum texture size                                            //
////////////////////////////////////////////////////////////////////////////////
const WOSGLMaxTextureSize = 2048;

////////////////////////////////////////////////////////////////////////////////
//  WOS Renderer quality                                                      //
////////////////////////////////////////////////////////////////////////////////
const WOSRendererQualityLow = 0;
const WOSRendererQualityMedium = 1;
const WOSRendererQualityHigh = 2;

////////////////////////////////////////////////////////////////////////////////
//  WOS Renderer shadows quality                                              //
////////////////////////////////////////////////////////////////////////////////
const WOSRendererShadowsQualityLow = 0;
const WOSRendererShadowsQualityMedium = 1;
const WOSRendererShadowsQualityHigh = 2;

////////////////////////////////////////////////////////////////////////////////
//  WOS Renderer animations quality                                           //
////////////////////////////////////////////////////////////////////////////////
const WOSRendererAnimQualityLow = 0;
const WOSRendererAnimQualityHigh = 1;


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

    // Renderer quality
    this.maxQuality = WOSRendererQualityLow;
    this.quality = WOSRendererQualityLow;

    // Renderer extensions
    this.texFloatExt = null;
    this.depthTextureExt = null;
    this.texFilterAnisotropic = null;

    // Max texture units
    this.maxTextureUnits = 0;
    this.maxVertTextureUnits = 0;
    this.maxCombTextureUnits = 0;

    // Max texture size
    this.maxTextureSize = 0;

    // Renderer texture anisotropic filter
    this.maxTexAnisotropy = 0;
    this.texAnisotropy = 0;

    // Max vertex attribs
    this.maxVertexAttribs = 0;

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

    // Graphic pipeline
    this.vertexBuffer = null;
    this.planeVertexBuffer = null;
    this.shader = null;
    this.worldMatrix = new Matrix4x4();
    this.projMatrix = new Matrix4x4();
    this.view = null;
    this.camera = null;
    this.uniforms = null;

    // Lighting
    this.worldLight = null;
    this.dynamicLights = null;
    this.normalMap = null;
    this.specularMap = null;

    // Shadows
    this.shadows = null;
    this.maxShadowsQuality = WOSRendererShadowsQualityLow;
    this.shadowsQuality = WOSRendererShadowsQualityLow;

    // Animations
    this.animQuality = WOSRendererAnimQualityHigh;

    // Back renderers
    this.textLineRenderer = null;
    this.textFieldRenderer = null;
}

Renderer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init renderer                                                  //
    //  param canvas : Renderer's canvas name to init                         //
    //  return : True if renderer is successfully loaded                      //
    ////////////////////////////////////////////////////////////////////////////
    init: function(canvas)
    {
        var i = 0;

        // Reset renderer
        this.loaded = false;
        this.gl = null;
        this.context = null;
        this.ctx = null;
        this.offCanvas = null;
        this.offContext = null;
        this.maxQuality = WOSRendererQualityLow;
        this.quality = WOSRendererQualityLow;
        this.texFloatExt = null;
        this.depthTextureExt = null;
        this.texFilterAnisotropic = null;
        this.maxTextureUnits = 0;
        this.maxVertTextureUnits = 0;
        this.maxCombTextureUnits = 0;
        this.maxTextureSize = 0;
        this.maxTexAnisotropy = 0;
        this.texAnisotropy = 0;
        this.maxVertexAttribs = 0;
        this.width = 0;
        this.height = 0;
        this.ratio = 1.0;
        this.vpwidth = 0.0;
        this.vpheight = 0.0;
        this.vpoffx = 0.0;
        this.vpoffy = 0.0;
        this.vertexBuffer = null;
        this.planeVertexBuffer = null;
        this.shader = null;
        if (!this.worldMatrix) return false;
        this.worldMatrix.setIdentity();
        if (!this.projMatrix) return false;
        this.projMatrix.setIdentity();
        this.view = null;
        this.camera = null;
        this.uniforms = null;
        this.worldLight = null;
        this.dynamicLights = null;
        this.normalMap = null;
        this.specularMap = null;
        this.shadows = null;
        this.maxShadowsQuality = WOSRendererShadowsQualityLow;
        this.shadowsQuality = WOSRendererShadowsQualityLow;
        this.animQuality = WOSRendererAnimQualityHigh;
        this.textLineRenderer = null;
        this.textFieldRenderer = null;

        // Get html canvas
        this.context = document.getElementById(canvas);

        // Check context
        if (!this.context)
        {
            // Invalid canvas context
            messageBoxText = "[0x0001] Invalid canvas context";
            return false;
        }

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

        // Check if context is valid
        if (!this.gl)
        {
            // No valid context found
            messageBoxText = "[0x0002] No valid context found";
            return false;
        }

        // Set context pointer lock function
        this.context.requestPointerLock =
            this.context.requestPointerLock ||
            this.context.mozRequestPointerLock ||
            this.context.webkitRequestPointerLock;

        // Check texture float extension
        this.texFloatExt = this.gl.getExtension("OES_texture_float");
        if (!this.texFloatExt)
        {
            // Texture float extension is not supported
            messageBoxText =
                "[0x0003] Texture float extension is not supported";
            return false;
        }

        // Check depth texture extension
        this.depthTextureExt = this.gl.getExtension("WEBGL_depth_texture");
        if (this.depthTextureExt)
        {
            this.maxQuality = WOSRendererQualityHigh;
        }
        else
        {
            this.maxQuality = WOSRendererQualityMedium;
        }

        // Check anisotropic texture filter extension
        this.texFilterAnisotropic = (
            this.gl.getExtension("EXT_texture_filter_anisotropic") ||
            this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
            this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic")
        );
        if (this.texFilterAnisotropic)
        {
            this.maxTexAnisotropy = this.gl.getParameter(
                this.texFilterAnisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT
            );
        }
        this.texAnisotropy = this.maxTexAnisotropy;

        // Check max texture units
        this.maxTextureUnits = this.gl.getParameter(
            this.gl.MAX_TEXTURE_IMAGE_UNITS
        );
        this.maxVertTextureUnits = this.gl.getParameter(
            this.gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS
        );
        this.maxCombTextureUnits = this.gl.getParameter(
            this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS
        );

        if ((this.maxTextureUnits < 1) || (this.maxVertTextureUnits < 1) ||
            (this.maxCombTextureUnits < 2))
        {
            // Not enough texture units
            messageBoxText = "[0x0004] Not enough texture units";
            return false;
        }

        if ((this.maxTextureUnits < 2) || (this.maxVertTextureUnits < 5) ||
            (this.maxCombTextureUnits < 7))
        {
            // Not enough texture units for high or medium quality
            if (this.maxQuality >= WOSRendererQualityLow)
            {
                this.maxQuality = WOSRendererQualityLow;
            }
        }

        // Check max texture size
        this.maxTextureSize = this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE);
        if (this.maxTextureSize < WOSGLMaxTextureSize)
        {
            // Invalid maximum texture size
            messageBoxText = "[0x0005] Invalid maximum texture size";
            return false;
        }

        // Check max vertex attribs
        this.maxVertexAttribs = this.gl.getParameter(
            this.gl.MAX_VERTEX_ATTRIBS
        );
        if (this.maxVertexAttribs < 4)
        {
            // Not enough vertex attribs
            messageBoxText = "[0x0006] Not enough vertex attribs";
            return false;
        }

        if (this.maxVertexAttribs < 5)
        {
            // Not enough vertex attribs for medium quality
            this.maxQuality = WOSRendererQualityLow;
        }

        if (this.maxVertexAttribs < 6)
        {
            // Not enough vertex attribs for high quality
            if (this.maxQuality >= WOSRendererQualityMedium)
            {
                this.maxQuality = WOSRendererQualityMedium;
            }
        }

        // Set default renderer quality
        this.quality = this.maxQuality;

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
        if (this.width <= 1.0) this.width = 1.0;
        if (this.height <= 1.0) this.height = 1.0;
        this.context.width = this.width;
        this.context.height = this.height;

        // Create offscreen canvas
        this.offCanvas = document.createElement('canvas');
        if (!this.offCanvas)
        {
            // Could not create offscreen canvas
            messageBoxText = "[0x0007] Could not create offscreen canvas";
            return false;
        }
        this.offCanvas.width = 1;
        this.offCanvas.height = 1;

        // Get offscreen context
        this.offContext = this.offCanvas.getContext('2d');
        if (!this.offContext)
        {
            // Could not get offscreen context
            messageBoxText = "[0x0008] Could not get offscreen context";
            return false;
        }

        // Init default vbo
        this.vertexBuffer = new VertexBuffer(this.gl);
        if (!this.vertexBuffer)
        {
            // Could not create default vbo
            messageBoxText = "[0x0009] Could not create default vbo";
            return false;
        }
        if (!this.vertexBuffer.init())
        {
            // Could not init default vbo
            messageBoxText = "[0x000A] Could not init default vbo";
            return false;
        }

        // Init plane vbo
        this.planeVertexBuffer = new MeshVertexBuffer(this);
        if (!this.planeVertexBuffer)
        {
            // Could not create plane vbo
            messageBoxText = "[0x000B] Could not create plane vbo";
            return false;
        }
        if (!this.planeVertexBuffer.init())
        {
            // Could not init plane vbo
            messageBoxText = "[0x000C] Could not init plane vbo";
            return false;
        }

        // Init default shader
        this.shader = new Shader(this.gl);
        if (!this.shader)
        {
            // Could not create default shader
            messageBoxText = "[0x000D] Could not create default shader";
            return false;
        }
        if (!this.shader.init())
        {
            // Could not init default shader
            messageBoxText = "[0x000E] Could not init default shader";
            return false;
        }

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

        // Disable back face culling
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.frontFace(this.gl.CCW);
        this.gl.cullFace(this.gl.BACK);

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
        if (!this.view)
        {
            // Could not create default view
            messageBoxText = "[0x000F] Could not create default view";
            return false;
        }
        if (!this.view.reset())
        {
            // Could not init default view
            messageBoxText = "[0x0010] Could not init default view";
            return false;
        }

        // Init camera
        this.camera = new Camera();
        if (!this.camera)
        {
            // Could not create default camera
            messageBoxText = "[0x0011] Could not create default camera";
            return false;
        }
        if (!this.camera.reset())
        {
            // Could not init default camera
            messageBoxText = "[0x0012] Could not init default camera";
            return false;
        }

        // Init shaders uniforms
        this.uniforms = new Uniforms();
        if (!this.uniforms)
        {
            // Could not create shaders uniforms
            messageBoxText = "[0x0013] Could not create shaders uniforms";
            return false;
        }

        // Init world light
        this.worldLight = new WorldLight();
        if (!this.worldLight)
        {
            // Could not create world light
            messageBoxText = "[0x0014] Could not create world light";
            return false;
        }
        if (!this.worldLight.init())
        {
            // Could not init world light
            messageBoxText = "[0x0015] Could not init world light";
            return false;
        }
        this.worldLight.setDirection(0.2, 0.1, 0.9);
        this.worldLight.setColor(1.0, 1.0, 1.0, 0.2);
        this.worldLight.setAmbient(1.0, 1.0, 1.0, 0.1);

        // Init dynamic lights
        this.dynamicLights = new DynamicLights(this);
        if (!this.dynamicLights)
        {
            // Could not create dynamic lights
            messageBoxText = "[0x0016] Could not create dynamic lights";
            return false;
        }
        if (!this.dynamicLights.init())
        {
            // Could not init dynamic lights
            messageBoxText = "[0x0017] Could not init dynamic lights";
            return false;
        }

        // Init default normal map
        this.normalMap = new Texture(this);
        if (!this.normalMap)
        {
            // Could not create default normal map
            messageBoxText = "[0x0018] Could not create default normal map";
            return false;
        }
        if (!this.normalMap.init(1, 1, new Uint8Array([128, 128, 255, 255])))
        {
            // Could not init default normal map
            messageBoxText = "[0x0019] Could not init default normal map";
            return false;
        }

        // Init default specular map
        this.specularMap = new Texture(this);
        if (!this.specularMap)
        {
            // Could not create default specular map
            messageBoxText = "[0x001A] Could not create default specular map";
            return false;
        }
        if (!this.specularMap.init(1, 1, new Uint8Array([255, 255, 255, 255])))
        {
            // Could not init default specular map
            messageBoxText = "[0x001B] Could not init default specular map";
            return false;
        }

        // Init shadows
        this.shadows = new Shadows(this);
        this.maxShadowsQuality = WOSRendererShadowsQualityHigh;
        this.shadowsQuality = WOSRendererShadowsQualityHigh;
        if (!this.shadows)
        {
            // No shadows
            this.maxShadowsQuality = WOSRendererShadowsQualityLow;
            this.shadowsQuality = WOSRendererShadowsQualityLow;
        }
        if (!this.shadows.init(2048, 2048))
        {
            if (!this.shadows.init(512, 512))
            {
                // No shadows
                this.maxShadowsQuality = WOSRendererShadowsQualityLow;
                this.shadowsQuality = WOSRendererShadowsQualityLow;
            }
            else
            {
                // Medium quality shadows
                this.maxShadowsQuality = WOSRendererShadowsQualityMedium;
                this.shadowsQuality = WOSRendererShadowsQualityMedium;
            }
        }
        if (this.shadowsQuality > WOSRendererShadowsQualityLow)
        {
            // Set default shadows
            this.shadows.setPosition(3.0, 3.0, -3.0);
            this.shadows.setAngles(-0.7, -3.7, 0.0);
        }

        // Init text line renderer
        this.textLineRenderer = new BackRenderer(this, this.shader);
        if (!this.textLineRenderer)
        {
            // Could not create text line renderer
            messageBoxText = "[0x001C] Could not create text line renderer";
            return false;
        }
        if (!this.textLineRenderer.init(1, 1, true))
        {
            // Could not init text line renderer
            messageBoxText = "[0x001D] Could not init text line renderer";
            return false;
        }

        // Init text field renderer
        this.textFieldRenderer = new BackRenderer(this, this.shader);
        if (!this.textFieldRenderer)
        {
            // Could not create text field renderer
            messageBoxText = "[0x001E] Could not create text field renderer";
            return false;
        }
        if (!this.textFieldRenderer.init(1, 1, true))
        {
            // Could not init text field renderer
            messageBoxText = "[0x001F] Could not init text field renderer";
            return false;
        }

        // Renderer successfully loaded
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
    //  setQuality : Set renderer current quality                             //
    //  param quality : Current renderer quality to set                       //
    ////////////////////////////////////////////////////////////////////////////
    setQuality: function(quality)
    {
        if (quality <= WOSRendererQualityLow) quality = WOSRendererQualityLow;
        if (quality >= this.maxQuality) quality = this.maxQuality;
        this.quality = quality;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setShadowsQuality : Set renderer current shadows quality              //
    //  param shadowsQuality : Current renderer shadows quality to set        //
    ////////////////////////////////////////////////////////////////////////////
    setShadowsQuality: function(shadowsQuality)
    {
        if (shadowsQuality <= WOSRendererShadowsQualityLow)
        {
            shadowsQuality = WOSRendererShadowsQualityLow;
        }
        if (shadowsQuality >= this.maxShadowsQuality)
        {
            shadowsQuality = this.maxShadowsQuality;
        }
        if (shadowsQuality == WOSRendererShadowsQualityHigh)
        {
            if (!this.shadows.setTextureSize(2048, 2048))
            {
                shadowsQuality = WOSRendererShadowsQualityMedium;
            }
        }
        if (shadowsQuality == WOSRendererShadowsQualityMedium)
        {
            if (!this.shadows.setTextureSize(512, 512))
            {
                shadowsQuality = WOSRendererShadowsQualityLow;
            }
        }
        this.shadowsQuality = shadowsQuality;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnimQuality : Set renderer current animations quality              //
    //  param quality : Current renderer animations quality to set            //
    ////////////////////////////////////////////////////////////////////////////
    setAnimQuality: function(animQuality)
    {
        if (animQuality <= WOSRendererAnimQualityLow)
        {
            animQuality = WOSRendererAnimQualityLow;
        }
        if (animQuality >= WOSRendererAnimQualityHigh)
        {
            animQuality = WOSRendererAnimQualityHigh;
        }
        this.animQuality = animQuality;
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

            // Reset view
            this.view.reset();
            this.view.compute();

            // Disable depth buffer
            this.gl.disable(this.gl.DEPTH_TEST);

            // Disable back face culling
            this.gl.disable(this.gl.CULL_FACE);

            // Enable blending
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.blendEquation(this.gl.FUNC_ADD);
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

            // Set current view
            this.view = view;

            // Disable depth buffer
            this.gl.disable(this.gl.DEPTH_TEST);

            // Disable back face culling
            this.gl.disable(this.gl.CULL_FACE);

            // Enable blending
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.blendEquation(this.gl.FUNC_ADD);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCamera : Set rendering camera                                      //
    //  param camera : Camera to use for rendering                            //
    ////////////////////////////////////////////////////////////////////////////
    setCamera: function(camera)
    {
        if (camera)
        {
            // Set current view
            this.camera = camera;

            // Enable depth buffer
            this.gl.enable(this.gl.DEPTH_TEST);

            // Enable back face culling
            this.gl.enable(this.gl.CULL_FACE);

            // Enable blending
            this.gl.enable(this.gl.BLEND);
            this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
            this.gl.blendEquation(this.gl.FUNC_ADD);

            // Clear depth buffer
            this.gl.clear(this.gl.DEPTH_BUFFER_BIT);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBackFaceCulling : Set renderer back face culling state             //
    //  param backFaceCulling : Renderer back face culling state to set       //
    ////////////////////////////////////////////////////////////////////////////
    setBackFaceCulling: function(backFaceCulling)
    {
        if (backFaceCulling)
        {
            this.gl.enable(this.gl.CULL_FACE);
        }
        else
        {
            this.gl.disable(this.gl.CULL_FACE);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDepthTesting : Set renderer depth testing state                    //
    //  param depthTesting : Renderer depth testing state to set              //
    ////////////////////////////////////////////////////////////////////////////
    setDepthTesting: function(depthTesting)
    {
        if (depthTesting)
        {
            // Enable depth buffer
            this.gl.enable(this.gl.DEPTH_TEST);
        }
        else
        {
            // Disable depth buffer
            this.gl.disable(this.gl.DEPTH_TEST);
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
    //  setDefaultCursor : Set default mouse cursor                           //
    ////////////////////////////////////////////////////////////////////////////
    setDefaultCursor: function()
    {
        this.context.style.cursor = 'url("cursors/default.png"), auto';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCrosshairCursor : Set crosshair mouse cursor                       //
    ////////////////////////////////////////////////////////////////////////////
    setCrosshairCursor: function()
    {
        this.context.style.cursor =
            'url("cursors/crosshair.png") 16 16, crosshair';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTextCursor : Set text mouse cursor                                 //
    ////////////////////////////////////////////////////////////////////////////
    setTextCursor: function()
    {
        this.context.style.cursor = 'url("cursors/textcursor.png") 8 12, text';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setGrabCursor : Set grab mouse cursor                                 //
    ////////////////////////////////////////////////////////////////////////////
    setGrabCursor: function()
    {
        this.context.style.cursor = 'url("cursors/grabcursor.png") 10 10, grab';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setGrabbingCursor : Set grabbing mouse cursor                         //
    ////////////////////////////////////////////////////////////////////////////
    setGrabbingCursor: function()
    {
        this.context.style.cursor =
            'url("cursors/grabbingcursor.png") 8 8, grabbing';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setEWResizeCursor : Set east-west resize mouse cursor                 //
    ////////////////////////////////////////////////////////////////////////////
    setEWResizeCursor: function()
    {
        this.context.style.cursor =
            'url("cursors/ewresize.png") 12 5, ew-resize';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNSResizeCursor : Set north-south resize mouse cursor               //
    ////////////////////////////////////////////////////////////////////////////
    setNSResizeCursor: function()
    {
        this.context.style.cursor =
            'url("cursors/nsresize.png") 5 12, ns-resize';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNESWResizeCursor : Set north-east south-west resize mouse cursor   //
    ////////////////////////////////////////////////////////////////////////////
    setNESWResizeCursor: function()
    {
        this.context.style.cursor =
            'url("cursors/neswresize.png") 9 9, nesw-resize';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNWSEResizeCursor : Set north-west south-east resize mouse cursor   //
    ////////////////////////////////////////////////////////////////////////////
    setNWSEResizeCursor: function()
    {
        this.context.style.cursor =
            'url("cursors/nwseresize.png") 9 9, nwse-resize';
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMouseLock : Set mouse locked status                                //
    ////////////////////////////////////////////////////////////////////////////
    setMouseLock: function(lock)
    {
        if (lock)
        {
            if (this.context.requestPointerLock)
            {
                // Request pointer lock
                this.context.requestPointerLock();
            }
        }
        else
        {
            if (document.exitPointerLock)
            {
                // Exit pointer lock
                document.exitPointerLock();
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderTextData : Render text into pixels data with WOS default font   //
    //  param text : Text to render                                           //
    //  param width : Width of the text texture to render                     //
    //  param height : Height of the text texture to render                   //
    //  param fontsize : Font size of the text to render                      //
    //  return : Text texture pixels data                                     //
    ////////////////////////////////////////////////////////////////////////////
    renderTextData: function(text, width, height, fontsize)
    {
        var textData = null;
        var pixelsData = null;

        // Update offscreen canvas size
        this.offCanvas.width = Math.round(width);
        this.offCanvas.height = Math.round(height);

        // Clamp canvas size
        if (this.offCanvas.width <= 1) { this.offCanvas.width = 1; }
        if (this.offCanvas.width >= WOSGLMaxTextureSize)
        {
            this.offCanvas.width = WOSGLMaxTextureSize;
        }
        if (this.offCanvas.height <= 1) { this.offCanvas.height = 1; }
        if (this.offCanvas.height >= WOSGLMaxTextureSize)
        {
            this.offCanvas.height = WOSGLMaxTextureSize;
        }

        // Render text
        this.offContext.font = fontsize.toString() + "px wosfont";
        this.offContext.strokeText(text, 0, (0.84*fontsize));
        this.offContext.fillText(text, 0, (0.84*fontsize));

        // Get pixels data
        textData = this.offContext.getImageData(
            0, 0, this.offCanvas.width, this.offCanvas.height
        );
        pixelsData = new Uint8Array(textData.data.buffer);
        return pixelsData;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderText : Render text into texture with WOS default font           //
    //  param text : Text to render                                           //
    //  param width : Width of the text texture to render                     //
    //  param height : Height of the text texture to render                   //
    //  param fontsize : Font size of the text to render                      //
    ////////////////////////////////////////////////////////////////////////////
    renderText: function(text, width, height, fontsize)
    {
        // Update offscreen canvas size
        this.offCanvas.width = Math.round(width);
        this.offCanvas.height = Math.round(height);

        // Clamp canvas size
        if (this.offCanvas.width <= 1) { this.offCanvas.width = 1; }
        if (this.offCanvas.width >= WOSGLMaxTextureSize)
        {
            this.offCanvas.width = WOSGLMaxTextureSize;
        }
        if (this.offCanvas.height <= 1) { this.offCanvas.height = 1; }
        if (this.offCanvas.height >= WOSGLMaxTextureSize)
        {
            this.offCanvas.height = WOSGLMaxTextureSize;
        }

        // Render text
        this.offContext.font = fontsize.toString() + "px wosfont";
        this.offContext.strokeText(text, 0, (0.84*fontsize));
        this.offContext.fillText(text, 0, (0.84*fontsize));

        // Copy text to texture
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.offCanvas
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderImageData : Render image offscreen into data                    //
    //  param image : Image to render                                         //
    //  param width : Width of the image texture to render                    //
    //  param height : Height of the image texture to render                  //
    //  return : Image texture pixels data                                    //
    ////////////////////////////////////////////////////////////////////////////
    renderImageData: function(image, width, height)
    {
        var imageData = null;
        var pixelsData = null;

        // Update offscreen canvas size
        this.offCanvas.width = Math.round(width);
        this.offCanvas.height = Math.round(height);

        // Clamp canvas size
        if (this.offCanvas.width <= 1) { this.offCanvas.width = 1; }
        if (this.offCanvas.width >= WOSGLMaxTextureSize)
        {
            this.offCanvas.width = WOSGLMaxTextureSize;
        }
        if (this.offCanvas.height <= 1) { this.offCanvas.height = 1; }
        if (this.offCanvas.height >= WOSGLMaxTextureSize)
        {
            this.offCanvas.height = WOSGLMaxTextureSize;
        }

        // Render image
        this.offContext.drawImage(image, 0, 0);

        // Get pixels data
        imageData = this.offContext.getImageData(
            0, 0, this.offCanvas.width, this.offCanvas.height
        );
        pixelsData = new Uint8Array(imageData.data.buffer);
        return pixelsData;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  renderImage : Render image offscreen into texture                     //
    //  param image : Image to render                                         //
    //  param width : Width of the image texture to render                    //
    //  param height : Height of the image texture to render                  //
    ////////////////////////////////////////////////////////////////////////////
    renderImage: function(image, width, height)
    {
        // Update offscreen canvas size
        this.offCanvas.width = Math.round(width);
        this.offCanvas.height = Math.round(height);

        // Clamp canvas size
        if (this.offCanvas.width <= 1) { this.offCanvas.width = 1; }
        if (this.offCanvas.width >= WOSGLMaxTextureSize)
        {
            this.offCanvas.width = WOSGLMaxTextureSize;
        }
        if (this.offCanvas.height <= 1) { this.offCanvas.height = 1; }
        if (this.offCanvas.height >= WOSGLMaxTextureSize)
        {
            this.offCanvas.height = WOSGLMaxTextureSize;
        }

        // Render image
        this.offContext.drawImage(image, 0, 0);

        // Copy image to texture
        this.gl.texImage2D(
            this.gl.TEXTURE_2D, 0, this.gl.RGBA,
            this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.offCanvas
        );
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
    //  getMaxQuality : Get renderer max quality                              //
    //  return : Maximum quality of the renderer                              //
    ////////////////////////////////////////////////////////////////////////////
    getMaxQuality: function()
    {
        return this.maxQuality;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getQuality : Get current renderer quality                             //
    //  return : Current quality of the renderer                              //
    ////////////////////////////////////////////////////////////////////////////
    getQuality: function()
    {
        return this.quality;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getShadowsQuality : Get current renderer shadows quality              //
    //  return : Current shadows quality of the renderer                      //
    ////////////////////////////////////////////////////////////////////////////
    getShadowsQuality: function()
    {
        return this.shadowsQuality;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAnimQuality : Get current renderer animations quality              //
    //  return : Current animations quality of the renderer                   //
    ////////////////////////////////////////////////////////////////////////////
    getAnimQuality: function()
    {
        return this.animQuality;
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
