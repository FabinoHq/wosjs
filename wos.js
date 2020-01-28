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
//  WOS frame max ratios                                                      //
////////////////////////////////////////////////////////////////////////////////
const WOSRatioMaxClamping = true;
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
window.addEventListener('touchmove', function(event)
{
    if (wos && event.targetTouches.length >= 1)
    {
        wos.handleMouseMove(
            event.targetTouches[0].pageX,
            event.targetTouches[0].pageY
        );
    }
    event.preventDefault();
}, false);

////////////////////////////////////////////////////////////////////////////////
//  window.onmousedown : Triggered when a mouse button is pressed             //
////////////////////////////////////////////////////////////////////////////////
window.onmousedown = function(event)
{
    if (wos) wos.handleMouseDown(event.button, event.clientX, event.clientY);
}
window.addEventListener('touchstart', function(event)
{
    if (wos && event.targetTouches.length >= 1)
    {
        wos.handleMouseDown(0,
            event.targetTouches[0].pageX,
            event.targetTouches[0].pageY
        );
    }
    event.preventDefault();
}, false);

////////////////////////////////////////////////////////////////////////////////
//  window.onmouseup : Triggered when a mouse button is released              //
////////////////////////////////////////////////////////////////////////////////
window.onmouseup = function(event)
{
    if (wos) wos.handleMouseUp(event.button, event.clientX, event.clientY);
}
window.addEventListener('touchend', function()
{
    if (wos) wos.handleMouseUp(0, 0, 0);
}, false);


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

    // Line shader
    this.lineShader = null;
    // Sprite shader
    this.spriteShader = null;
    // Animated sprite shader
    this.animSpriteShader = null;
    // Text shader
    this.textShader = null;

    // Test line
    this.testline = null;
    // Test sprite
    this.testsprite = null;
    // Test procedural sprite
    this.testproc = null;
    // Test anim
    this.testanim = null;
    // Test text
    this.testtext = null;
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
        //this.audio.enable();

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
        // Play test sound
        if (this.audio.enabled)
        {
            this.loader.getSound("test.wav").play();
        }

        // Init line shader
        this.lineShader = new LineShader(this.renderer.gl);
        this.lineShader.init();

        // Init sprite shader
        this.spriteShader = new SpriteShader(this.renderer.gl);
        this.spriteShader.init();

        // Init animated sprite shader
        this.animSpriteShader = new AnimSpriteShader(this.renderer.gl);
        this.animSpriteShader.init();

        // Init text shader
        this.textShader = new TextShader(this.renderer.gl);
        this.textShader.init();


        // Init test line
        this.testline = new Line(this.renderer, this.lineShader);
        this.testline.init(0.1, -0.5, -0.5, 0.5, 0.5);
        this.testline.setColor(0.4, 0.0, 0.8);
        this.testline.setAlpha(0.7);
        this.testline.setSmoothness(0.4);

        // Init test sprite
        this.testsprite = new Sprite(this.renderer, this.spriteShader);
        this.testsprite.init(
            this.loader.getTexture("testsprite.png"), 0.05, 0.09
        );

        // Init test procedural sprite
        this.testproc = new ProcSprite(this.renderer);
        this.testproc.init();

        // Init test anim
        this.testanim = new AnimSprite(this.renderer, this.animSpriteShader);
        this.testanim.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0, 2, 2, 1.0
        );
        this.testanim.setStart(0, 0);
        this.testanim.setEnd(1, 1);
        this.testanim.resetAnim();

        // Init test text
        this.testtext = new GuiText(this.renderer, this.textShader);
        this.testtext.init("Test text");

        // init test text box
        this.testtextbox = new GuiTextBox(this.renderer, this.textShader);
        this.testtextbox.init(0.5, 0.2, "Test");
        this.testtextbox.setSelected(true);

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

        // Update WOS
        this.compute();
        this.render();

        // Request new frame
        requestAnimFrame(handleAnimFrame);
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
        //if (this.testtextbox) this.testtextbox.keyPress(key);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleKeyUp : Handle key released                                     //
    //  param key : Key released                                              //
    ////////////////////////////////////////////////////////////////////////////
    handleKeyUp: function(key)
    {
        //if (this.testtextbox) this.testtextbox.keyRelease(key);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseMove : Handle mouse moved                                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseX : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseMove: function(mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        /*if (this.testtextbox)
            this.testtextbox.mouseMove(this.realMouseX, this.realMouseY);*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseMove : Handle mouse button pressed                         //
    //  param button : Mouse button pressed                                   //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseX : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseDown: function(button, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        /*if (this.testtextbox)
            this.testtextbox.mousePress(this.realMouseX, this.realMouseY);*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseUp : Handle mouse button released                          //
    //  param button : Mouse button released                                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseX : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseUp: function(button, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        /*if (this.testtextbox)
            this.testtextbox.mouseRelease(this.realMouseX, this.realMouseY);*/
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
        this.curMouseX = ((this.mouseX/this.renderer.getWidth())*2.0)-1.0;
        this.curMouseY = -((this.mouseY/this.renderer.getHeight())*2.0)+1.0;
        this.realMouseX = ((this.mouseX-this.renderer.getViewportOffsetX())/
                            this.renderer.getViewportWidth()*2.0)-1.0;
        this.realMouseY = -((this.mouseY-this.renderer.getViewportOffsetY())/
                            this.renderer.getViewportHeight()*2.0)+1.0;
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

        // Render test line
        //this.testline.setTarget(this.realMouseX, this.realMouseY);
        //this.testline.render();

        // Render test sprite
        this.testsprite.resetMatrix();
        //this.testsprite.moveX(-this.testsprite.getWidth()/2.0);
        //this.testsprite.moveY(-this.testsprite.getHeight()/2.0);
        //this.testsprite.render();

        // Render procedural test sprite
        this.testproc.resetMatrix();
        //this.testproc.moveX(-this.testproc.getWidth()/2.0);
        //this.testproc.moveY(-this.testproc.getHeight()/2.0);
        //this.testproc.render(0.0, 0.0, 0.0);

        // Render test anim
        this.testanim.resetMatrix();
        //this.testanim.moveX(-this.testanim.getWidth()/2.0);
        //this.testanim.moveY(-this.testanim.getHeight()/2.0);
        //this.testanim.render(this.frametime);

        // Render test text
        this.testtext.resetMatrix();
        //this.testtext.moveX(-this.testtext.getWidth()/2.0);
        //this.testtext.moveY(-this.testtext.getHeight()/2.0);
        //this.testtext.render();

        // Render test text box
        //this.testtextbox.setX(-this.testtextbox.getWidth()/2.0);
        //this.testtextbox.setY(-this.testtextbox.getHeight()/2.0);
        //this.testtextbox.render();
    }
};

