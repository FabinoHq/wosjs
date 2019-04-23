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
//      wos.js : WOS Global management                                        //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  WOS Global instance                                                       //
////////////////////////////////////////////////////////////////////////////////
var wos = null;

////////////////////////////////////////////////////////////////////////////////
//  WOS Global frame size                                                     //
////////////////////////////////////////////////////////////////////////////////
const WOSWidth = 2048;
const WOSHeight = 1152;
const WOSInvWidth = (1.0/WOSWidth);
const WOSInvHeight = (1.0/WOSHeight);
const WOSRatioXMax = 2.0;
const WOSRatioYMax = 0.7;

////////////////////////////////////////////////////////////////////////////////
//  Default callback timeout (60Hz)                                           //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultCallbackTimeout = 1000.0/60.0;

////////////////////////////////////////////////////////////////////////////////
//  Default background clear color                                            //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultClearColorRed = 0.0;
const WOSDefaultClearColorGreen = 0.0;
const WOSDefaultClearColorBlue = 0.0;


////////////////////////////////////////////////////////////////////////////////
//  WebGL Array data types                                                    //
////////////////////////////////////////////////////////////////////////////////
GLIndexDataType = ((typeof Uint16Array != "undefined") ?
                    (Uint16Array) : (Array));

GLArrayDataType = ((typeof Float32Array != "undefined") ?
                    (Float32Array) : ((typeof WebGLFloatArray != "undefined") ?
                    (WebGlFloatArray) : (Array)));

MapArrayDataType = Array;


////////////////////////////////////////////////////////////////////////////////
//  window.onload : WOS Entry point                                           //
////////////////////////////////////////////////////////////////////////////////
window.onload = function()
{
    // Start WOS
    wos = new Wos();
    if (wos) wos.init();
}

////////////////////////////////////////////////////////////////////////////////
//  window.requestAnimFrame : WOS Update callback                             //
//      param callback : function to be called back (must be handleAnimFrame) //
////////////////////////////////////////////////////////////////////////////////
window.requestAnimFrame = (function(callback)
{
    return (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                return window.setTimeout(callback, WOSDefaultCallbackTimeout);
            });
})();

////////////////////////////////////////////////////////////////////////////////
//  handleAnimFrame : WOS Callback function                                   //
////////////////////////////////////////////////////////////////////////////////
function handleAnimFrame()
{
    if (wos) wos.run();
}

////////////////////////////////////////////////////////////////////////////////
//  document.oncontextmenu : Triggered on web browser context menu            //
////////////////////////////////////////////////////////////////////////////////
document.oncontextmenu = function()
{
    return false;
}

////////////////////////////////////////////////////////////////////////////////
//  window.requestFullFrame : Request web browser fullscreen mode             //
////////////////////////////////////////////////////////////////////////////////
window.requestFullFrame = function()
{
    if (document.documentElement.requestFullscreen)
        document.documentElement.requestFullscreen();
    else if (document.documentElement.mozRequestFullScreen)
        document.documentElement.mozRequestFullScreen();
    else if (document.documentElement.webkitRequestFullScreen)
        document.documentElement.webkitRequestFullScreen();
    else if (document.documentElement.msRequestFullscreen)
        document.documentElement.msRequestFullscreen();
}

////////////////////////////////////////////////////////////////////////////////
//  window.onresize : Triggered when web browser size is changing             //
////////////////////////////////////////////////////////////////////////////////
window.onresize = function()
{
    if (wos) wos.handleOnResize();
}

////////////////////////////////////////////////////////////////////////////////
//  window.onkeydown : Triggered when a key is pressed                        //
////////////////////////////////////////////////////////////////////////////////
window.onkeydown = function(event)
{
    if (wos) wos.handleKeyDown(event.key);
}

////////////////////////////////////////////////////////////////////////////////
//  window.onkeyup : Triggered when a key is released                         //
////////////////////////////////////////////////////////////////////////////////
window.onkeyup = function(event)
{
    if (wos) wos.handleKeyUp(event.key);
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmousemove : Triggered when the mouse is moved                    //
////////////////////////////////////////////////////////////////////////////////
window.onmousemove = function(event)
{
    if (wos) wos.handleMouseMove(event.clientX, event.clientY);
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmousedown : Triggered when a mouse button is pressed             //
////////////////////////////////////////////////////////////////////////////////
window.onmousedown = function(event)
{
    if (wos) wos.handleMouseDown(event.button, event.clientX, event.clientY);
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmouseup : Triggered when a mouse button is released              //
////////////////////////////////////////////////////////////////////////////////
window.onmouseup = function(event)
{
    if (wos) wos.handleMouseUp(event.button, event.clientX, event.clientY);
}


////////////////////////////////////////////////////////////////////////////////
//  WOS class definition                                                      //
////////////////////////////////////////////////////////////////////////////////
function Wos()
{
    // WOS loaded status
    this.loaded = false;

    // Last clock time
    this.lastTime = 0.0;
    // Frametime
    this.frametime = 0.0;

    // Mouse position relative to web navigator's window
    this.mouseX = 0;
    this.mouseY = 0;
    // Mouse position used for cursor
    this.curMouseX = 0.0;
    this.curMouseY = 0.0;
    // Mouse position adjusted to WOS render size
    this.realMouseX = 0.0;
    this.realMouseY = 0.0;

    // WOS renderer
    this.renderer = null;
    // WOS audio engine
    this.audio = null;
    // WOS assets loader
    this.loader = null;
}


Wos.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Start WOS (load basic system)                                  //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Init renderer
        this.renderer = new Renderer();
        this.renderer.init("woscreen");
        this.renderer.clear();

        // Init audio engine
        this.audio = new AudioEngine();
        this.audio.init();

        // Init assets loader
        this.loader = new Loader(this.renderer, this.audio);
        this.loader.init();

        // Load basic system
        this.loader.wos = this;
        this.loader.onAssetsLoaded = function()
        {
            this.wos.initDone();
        }
        this.loader.loadFonts();
        this.loader.loadTextures();
        this.loader.loadSounds();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  initDone : Basic system ready                                         //
    ////////////////////////////////////////////////////////////////////////////
    initDone: function()
    {
        // Run WOS
        this.lastTime = window.performance.now()*0.001;
        this.loaded = true;
        this.run();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  run : WOS main loop callback                                          //
    ////////////////////////////////////////////////////////////////////////////
    run: function()
    {
        // Compute frametime
        this.updateFrameTime();

        // Request new frame
        requestAnimFrame(handleAnimFrame);

        // Update WOS
        this.compute();
        this.render();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleOnResize : Handle window resizing                               //
    ////////////////////////////////////////////////////////////////////////////
    handleOnResize: function()
    {
        this.renderer.handleOnResize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleKeyDown : Handle key pressed                                    //
    //  param key : Key pressed                                               //
    ////////////////////////////////////////////////////////////////////////////
    handleKeyDown: function(key)
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleKeyUp : Handle key released                                     //
    //  param key : Key released                                              //
    ////////////////////////////////////////////////////////////////////////////
    handleKeyUp: function(key)
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseMove : Handle mouse moved                                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseX : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseMove: function(mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseMove : Handle mouse button pressed                         //
    //  param button : Mouse button pressed                                   //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseDown: function(button, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseUp : Handle mouse button released                          //
    //  param button : Mouse button released                                  //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseUp: function(button, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateFrameTime : Compute current frame time                          //
    ////////////////////////////////////////////////////////////////////////////
    updateFrameTime: function()
    {
        // Get current time in seconds
        var currentTime = window.performance.now()*0.001;

        // Compute frametime
        this.frametime = currentTime - this.lastTime;
        this.lastTime = currentTime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateMousePosition : Compute current mouse position                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseX : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    updateMousePosition: function(mouseX, mouseY)
    {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.curMouseX = ((this.mouseX/this.renderer.getWidth())*WOSWidth);
        this.curMouseY = ((this.mouseY/this.renderer.getHeight())*WOSHeight);
        this.realMouseX = (this.mouseX-this.renderer.getViewportOffsetX())/
                            this.renderer.getViewportWidth()*WOSWidth;
        this.realMouseY = (this.mouseY-this.renderer.getViewportOffsetY())/
                            this.renderer.getViewportHeight()*WOSHeight;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute all physics and UI logic                            //
    ////////////////////////////////////////////////////////////////////////////
    compute: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : WOS frame rendering                                          //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Clear renderer
        this.renderer.clear();
    }
};

