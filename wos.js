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
//  document.exitPointerLock : Pointer lock exit event                        //
////////////////////////////////////////////////////////////////////////////////
document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock ||
    document.webkitExitPointerLock;

////////////////////////////////////////////////////////////////////////////////
//  window.pointerLockChange : Pointer lock status changed                    //
////////////////////////////////////////////////////////////////////////////////
window.pointerLockChange = function()
{
    if (document.pointerLockElement || document.mozPointerLockElement)
    {
        document.addEventListener("mousemove", window.onmousetrack, false);
    }
    else
    {
        document.removeEventListener("mousemove", window.onmousetrack, false);
    }
}
document.addEventListener(
    "pointerlockchange", window.pointerLockChange, false
);
document.addEventListener(
    "mozpointerlockchange", window.pointerLockChange, false
);

////////////////////////////////////////////////////////////////////////////////
//  window.onmousetrack : Mouse tracking event                                //
////////////////////////////////////////////////////////////////////////////////
window.onmousetrack = function(event)
{
    if (wos) wos.handleMouseTrack(event.movementX, event.movementY);
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmousedown : Triggered when a mouse button is pressed             //
////////////////////////////////////////////////////////////////////////////////
window.onmousedown = function(event)
{
    if (wos) wos.handleMouseDown(event.button, event.clientX, event.clientY);
}
window.addEventListener('click', function(event)
{
    //if (wos) wos.handleMouseDown(event.button, event.clientX, event.clientY);
}, false);
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
//  window wheel event : Triggered by the mouse wheel                         //
////////////////////////////////////////////////////////////////////////////////
window.addEventListener('wheel', function(event)
{
    if (wos) wos.handleMouseWheel(event.deltaY, event.clientX, event.clientY);
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
    // Previous mouse position
    this.prevMouseX = 0.0;
    this.prevMouseY = 0.0;
    // Mouse sensitivity
    this.mouseSensitivity = 1.0;

    // WOS renderer
    this.renderer = null;
    // WOS backrenderer
    this.backrenderer = null;
    // WOS audio engine
    this.audio = null;
    // WOS assets loader
    this.loader = null;

    // Test line
    this.testline = null;
    // Test rect
    this.testrect = null;
    // Test sprite
    this.testsprite = null;
    // Test procedural sprite
    this.testproc = null;
    // Test ninebox
    this.testninebox = null;
    // Test anim
    this.testanim = null;
    // Test button
    this.testbutton = null;
    // Test toggle button
    this.testtogglebutton = null;
    // Test progress bar
    this.testprogressbar = null;
    // Test text
    this.testtext = null;
    // Test multitext
    this.testmultitext = null;
    // Test text box
    this.testtextbox = null;
    // Test pixel text
    this.testpxtext = null;
    // Test pixel multi text
    this.testpxmultitext = null;
    // Test pixel text box
    this.testpxtextbox = null;

    // Test camera
    this.camera = null;
    // Test freefly camera
    this.freeflycam = null;

    // Test point light
    this.pointLight = null;
    // Test spot light
    this.spotLight = null;
    // Test shadows
    this.shadows = null;

    // Test plane
    this.testplane = null;
    // Test anim plane
    this.testanimplane = null;
    // Test procedural plane
    this.testprocplane = null;
    // Test static mesh
    this.staticmesh = null;
    // Test skeletal mesh
    this.skeletalmesh = null;
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
        this.loader.loadShaders();
        this.loader.loadFonts();
        this.loader.loadTextures();
        this.loader.loadModels();
        this.loader.loadSounds();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  initDone : Basic system ready                                         //
    ////////////////////////////////////////////////////////////////////////////
    initDone: function()
    {
        // Init backrenderer
        this.backrenderer = new BackRenderer(
            this.renderer, this.loader.backrendererShader
        );
        this.backrenderer.init(1024, 1024);
        this.backrenderer.clear();

        // Play test sound
        if (this.audio.enabled)
        {
            this.loader.getSound("test.wav").play();
        }

        // Init test line
        this.testline = new Line(this.renderer, this.loader.lineShader);
        this.testline.init(0.1, -0.5, -0.5, 0.5, 0.5);
        this.testline.setColor(0.4, 0.0, 0.8);
        this.testline.setAlpha(0.7);
        this.testline.setSmoothness(0.4);

        // Init test rect
        this.testrect = new Rect(this.renderer, this.loader.rectShader);
        this.testrect.init(0.1, 0.8, 0.4);
        this.testrect.setColor(0.0, 0.2, 0.8);
        this.testrect.setAlpha(0.5);

        // Init test sprite
        this.testsprite = new Sprite(this.renderer, this.loader.spriteShader);
        this.testsprite.init(
            this.loader.getTexture("testsprite.png"), 0.09, 0.09
        );

        // Init test procedural sprite
        this.testproc = new ProcSprite(this.renderer);
        this.testproc.init();

        // Init test ninebox
        this.testninebox = new Ninebox(
            this.renderer, this.loader.nineboxShader
        );
        this.testninebox.init(
            this.loader.getTexture("testninebox.png"), 0.4, 0.4, 15.0
        );

        // Init test anim
        this.testanim = new AnimSprite(
            this.renderer, this.loader.animSpriteShader
        );
        this.testanim.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0, 2, 2
        );
        this.testanim.setFrametime(1.0);
        this.testanim.setStart(0, 0);
        this.testanim.setEnd(1, 1);
        this.testanim.resetAnim();

        // Init test button
        this.testbutton = new GuiButton(
            this.renderer, this.loader.buttonShader
        );
        this.testbutton.init(
            this.loader.getTexture("testbutton.png"), 0.12, 0.06
        );

        // Init test toggle button
        this.testtogglebutton = new GuiToggleButton(
            this.renderer, this.loader.toggleButtonShader
        );
        this.testtogglebutton.init(
            this.loader.getTexture("testtogglebutton.png"), 0.12, 0.12
        );

        // Init test progress bar
        this.testprogressbar = new GuiProgressBar(
            this.renderer, this.loader.progressBarShader
        );
        this.testprogressbar.init(
            this.loader.getTexture("testprogressbar.png"), 0.8, 0.06, 15.0
        );

        // Init test text
        this.testtext = new GuiText(this.renderer, this.loader.textShader);
        this.testtext.init("Test text", 0.1);

        // Init test multiline text
        this.testmultitext = new GuiMultiText(
            this.renderer, this.loader.textShader,
            this.loader.backrendererShader, this.loader.scrollBarShader
        );
        this.testmultitext.init(
            "Test multi line text\nTest line 2\nAnd line 3 of text.",
            1.0, 1.0, 0.1, true, this.loader.getTexture("scrollbar.png"), 0.03
        );

        // Init test text box
        this.testtextbox = new GuiTextBox(
            this.renderer, this.loader.textShader
        );
        this.testtextbox.init(false, 1.0, 0.1, "Test");
        this.testtextbox.setSelected(true);

        // Init test pixel text
        this.testpxtext = new GuiPxText(
            this.renderer, this.loader.pxTextShader,
            this.loader.backrendererShader
        );
        this.testpxtext.init(true,
            this.loader.getTexture("wospxfont.png"), "Test pixel text", 0.08
        );
        this.testpxtext.setSmooth(0.4);

        // Init test pixel multiline text
        this.testpxmultitext = new GuiPxMultiText(
            this.renderer, this.loader.pxTextShader,
            this.loader.backrendererShader, this.loader.scrollBarShader
        );
        this.testpxmultitext.init(true,
            this.loader.getTexture("wospxfont.png"),
            "Test multi line pixel text\nTest line 2\nAnd line 3 of text.",
            1.0, 1.0, 0.1, true, this.loader.getTexture("scrollbar.png"), 0.03
        );

        // Init test pixel text box
        this.testpxtextbox = new GuiPxTextBox(
            this.renderer, this.loader.pxTextShader,
            this.loader.backrendererShader
        );
        this.testpxtextbox.init(
            this.loader.getTexture("wospxfont.png"), 1.0, 0.1, "Test"
        );

        // Init test camera
        this.camera = new Camera();
        this.camera.reset();
        this.camera.rotateX(0.0);
        this.camera.moveY(0.0);
        this.camera.moveZ(3.0);

        // Init test freefly camera
        this.freeflycam = new FreeflyCam();
        this.freeflycam.reset();
        this.freeflycam.rotateX(0.0);
        this.freeflycam.moveY(0.0);
        this.freeflycam.moveZ(2.0);

        // Init test point light
        this.pointLight = new PointLight();
        this.pointLight.setPosition(3.0, 3.0, -3.0);
        this.pointLight.setColor(1.0, 1.0, 1.0, 0.8);
        this.pointLight.setRadius(5.0);
        this.pointLight.setFalloffRadius(12.0);

        // Init test spot light
        this.spotLight = new SpotLight();
        this.spotLight.setPosition(-1.0, 1.5, 0.0);
        this.spotLight.setDirection(1.0, -1.0, 0.0);
        this.spotLight.setColor(0.0, 0.0, 1.0, 0.8);
        this.spotLight.setRadius(5.0);
        this.spotLight.setFalloffRadius(12.0);
        this.spotLight.setFocal(0.99);
        this.spotLight.setFalloffFocal(0.98);

        this.renderer.dynamicLights.clear();
        this.renderer.dynamicLights.addPointLight(this.pointLight);
        this.renderer.dynamicLights.addSpotLight(this.spotLight);
        this.renderer.dynamicLights.update();

        // Init test shadows
        this.shadows = new Shadows(this.renderer);
        this.shadows.init(512, 512);
        this.shadows.setPosition(3.0, 3.0, -3.0);
        this.shadows.setAngles(75.0, 230.0, 0.0);

        // Init test plane
        this.testplane = new Plane(this.renderer, this.loader.spriteShader);
        this.testplane.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0
        );
        this.testplane.setBillboard(0);

        // Init test anim plane
        this.testanimplane = new AnimPlane(
            this.renderer, this.loader.animSpriteShader
        );
        this.testanimplane.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0, 2, 2
        );
        this.testanimplane.setFrametime(1.0);
        this.testanimplane.setStart(0, 0);
        this.testanimplane.setEnd(1, 1);
        this.testanimplane.resetAnim();
        this.testanimplane.setBillboard(0);

        // Init test procedural plane
        this.testprocplane = new ProcPlane(this.renderer);
        this.testprocplane.init();
        this.testprocplane.setBillboard(0);

        // Init test static mesh
        this.staticmesh = new StaticMesh(
            this.renderer,
            this.loader.staticMeshShader,
            this.loader.staticMeshShaderMedium,
            this.loader.staticMeshShaderLow
        );
        this.staticmesh.init(
            this.loader.getModel("testmodel.wmsh"),
            this.loader.getTexture("testsprite.png")
        );

        // Init test skeletal mesh
        this.skeletalmesh = new SkeletalMesh(
            this.renderer,
            this.loader.skeletalMeshShader,
            this.loader.skeletalMeshShaderMedium,
            this.loader.skeletalMeshShaderLow
        );
        this.skeletalmesh.init(
            this.loader.getModel("testskeletal.wmsh"),
            this.loader.getTexture("testsprite.png")
        );
        this.skeletalmesh.setAnimation(0, 0);
        this.skeletalmesh.setAnimation(1, 0);
        this.skeletalmesh.setFrametime(0, 0.7);
        this.skeletalmesh.setFrametime(1, 1.0);

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
        //if (this.testpxtextbox) this.testpxtextbox.keyPress(key);
        /*if (this.freeflycam)
        {
            switch (key)
            {
                case "ArrowUp": case "Up": case "Z": case "z":
                    this.freeflycam.setForward(true);
                    break;
                case "ArrowDown": case "Down": case "S": case "s":
                    this.freeflycam.setBackward(true);
                    break;
                case "ArrowLeft": case "Left": case "Q": case "q":
                    this.freeflycam.setLeftward(true);
                    break;
                case "ArrowRight": case "Right": case "D": case "d":
                    this.freeflycam.setRightward(true);
                    break;
                default:
                    break;
            }
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleKeyUp : Handle key released                                     //
    //  param key : Key released                                              //
    ////////////////////////////////////////////////////////////////////////////
    handleKeyUp: function(key)
    {
        //if (this.testtextbox) this.testtextbox.keyRelease(key);
        //if (this.testpxtextbox) this.testpxtextbox.keyRelease(key);
        /*if (this.freeflycam)
        {
            switch (key)
            {
                case "ArrowUp": case "Up": case "Z": case "z":
                    this.freeflycam.setForward(false);
                    break;
                case "ArrowDown": case "Down": case "S": case "s":
                    this.freeflycam.setBackward(false);
                    break;
                case "ArrowLeft": case "Left": case "Q": case "q":
                    this.freeflycam.setLeftward(false);
                    break;
                case "ArrowRight": case "Right": case "D": case "d":
                    this.freeflycam.setRightward(false);
                    break;
                default:
                    break;
            }
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseMove : Handle mouse moved                                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseY : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseMove: function(mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        /*if (this.testbutton)
        {
            this.testbutton.mouseMove(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testtogglebutton)
        {
            this.testtogglebutton.mouseMove(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testmultitext)
        {
            this.testmultitext.mouseMove(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testtextbox)
        {
            this.testtextbox.mouseMove(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testpxmultitext)
        {
            this.testpxmultitext.mouseMove(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testpxtextbox)
        {
            this.testpxtextbox.mouseMove(this.realMouseX, this.realMouseY);
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseTrack : Handle mouse tracking                              //
    //  param mouseX : Mouse X offset position                                //
    //  param mouseY : Mouse Y offset position                                //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseTrack: function(mouseX, mouseY)
    {
        // Adjust to mouse sensitivity
        /*mouseX *= this.mouseSensitivity;
        mouseY *= this.mouseSensitivity;
        if (this.freeflycam)
        {
            this.freeflycam.mouseMove(mouseX, mouseY);
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseMove : Handle mouse button pressed                         //
    //  param button : Mouse button pressed                                   //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseY : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseDown: function(button, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        //this.renderer.setMouseLock(true);
        /*if (this.testbutton)
        {
            this.testbutton.mousePress(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testtogglebutton)
        {
            this.testtogglebutton.mousePress(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testmultitext)
        {
            this.testmultitext.mousePress(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testtextbox)
        {
            this.testtextbox.mousePress(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testpxmultitext)
        {
            this.testpxmultitext.mousePress(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testpxtextbox)
        {
            this.testpxtextbox.mousePress(this.realMouseX, this.realMouseY);
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseUp : Handle mouse button released                          //
    //  param button : Mouse button released                                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseY : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseUp: function(button, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        /*if (this.testbutton)
        {
            this.testbutton.mouseRelease(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testtogglebutton)
        {
            this.testtogglebutton.mouseRelease(
                this.realMouseX, this.realMouseY
            );
        }*/
        /*if (this.testmultitext)
        {
            this.testmultitext.mouseRelease(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testtextbox)
        {
            this.testtextbox.mouseRelease(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testpxmultitext)
        {
            this.testpxmultitext.mouseRelease(this.realMouseX, this.realMouseY);
        }*/
        /*if (this.testpxtextbox)
        {
            this.testpxtextbox.mouseRelease(this.realMouseX, this.realMouseY);
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleMouseWheel : Handle mouse wheel event                           //
    //  param mouseWheel : Mouse wheel delta                                  //
    //  param mouseX : Mouse X position relative to web navigator's window    //
    //  param mouseY : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    handleMouseWheel: function(mouseWheel, mouseX, mouseY)
    {
        this.updateMousePosition(mouseX, mouseY);
        /*if (this.testmultitext)
        {
            this.testmultitext.mouseWheel(
                mouseWheel, this.realMouseX, this.realMouseY
            );
        }*/
        /*if (this.testpxmultitext)
        {
            this.testpxmultitext.mouseWheel(
                mouseWheel, this.realMouseX, this.realMouseY
            );
        }*/
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
    //  param mouseY : Mouse Y position relative to web navigator's window    //
    ////////////////////////////////////////////////////////////////////////////
    updateMousePosition: function(mouseX, mouseY)
    {
        this.prevMouseX = this.realMouseX;
        this.prevMouseY = this.realMouseY;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.curMouseX = ((this.mouseX/this.renderer.width)*2.0*
                            this.renderer.ratio)-this.renderer.ratio;
        this.curMouseY = -((this.mouseY/this.renderer.height)*2.0)+1.0;
        this.realMouseX = ((this.mouseX-this.renderer.vpoffx)/
                            this.renderer.vpwidth*2.0*
                            this.renderer.ratio)-this.renderer.ratio;
        this.realMouseY = -((this.mouseY-this.renderer.vpoffy)/
                            this.renderer.vpheight*2.0)+1.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute all physics and UI logic                            //
    ////////////////////////////////////////////////////////////////////////////
    compute: function()
    {
        //this.skeletalmesh.compute(this.frametime);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : WOS frame rendering                                          //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Clear renderer
        this.renderer.clear();

        // Render into background renderer
        //this.backrenderer.clear();
        //this.backrenderer.setActive();

        // Set renderer as active
        //this.renderer.setActive();

        // Render background renderer texture
        //this.backrenderer.setX(-this.backrenderer.getWidth()*0.5);
        //this.backrenderer.setY(-this.backrenderer.getHeight()*0.5);
        //this.backrenderer.render();

        // Render test line
        //this.testline.setTarget(this.realMouseX, this.realMouseY);
        //this.testline.render();

        // Render test rect
        //this.testrect.setX(-this.testrect.getWidth()*0.5);
        //this.testrect.setY(-this.testrect.getHeight()*0.5);
        //this.testrect.render();

        // Render test sprite
        //this.testsprite.setX(-this.testsprite.getWidth()*0.5);
        //this.testsprite.setY(-this.testsprite.getHeight()*0.5);
        //this.testsprite.render();

        // Render test procedural sprite
        //this.testproc.setX(-this.testproc.getWidth()*0.5);
        //this.testproc.setY(-this.testproc.getHeight()*0.5);
        //this.testproc.render();

        // Render test ninebox
        //this.testninebox.setSize(this.realMouseX*2.0, this.realMouseY*2.0);
        //this.testninebox.setX(-this.testninebox.getWidth()*0.5);
        //this.testninebox.setY(-this.testninebox.getHeight()*0.5);
        //this.testninebox.render();

        // Render test anim
        //this.testanim.setX(-this.testanim.getWidth()*0.5);
        //this.testanim.setY(-this.testanim.getHeight()*0.5);
        //this.testanim.render(this.frametime);

        // Render test button
        //this.testbutton.setX(-this.testbutton.getWidth()*0.5);
        //this.testbutton.setY(-this.testbutton.getHeight()*0.5);
        //this.testbutton.render();

        // Render test toggle button
        //this.testtogglebutton.setX(-this.testtogglebutton.getWidth()*0.5);
        //this.testtogglebutton.setY(-this.testtogglebutton.getHeight()*0.5);
        //this.testtogglebutton.render();

        // Render test progress bar
        //this.testprogressbar.setValue(this.realMouseX*2.0);
        //this.testprogressbar.setX(-this.testprogressbar.getWidth()*0.5);
        //this.testprogressbar.setY(-this.testprogressbar.getHeight()*0.5);
        //this.testprogressbar.render();

        // Render test text
        //this.testtext.setX(-this.testtext.getWidth()*0.5);
        //this.testtext.setY(-this.testtext.getHeight()*0.5);
        //this.testtext.render();

        // Render test multitext
        //this.testmultitext.setX(-this.testmultitext.getWidth()*0.5);
        //this.testmultitext.setY(-this.testmultitext.getHeight()*0.5);
        //this.testmultitext.render();

        // Render test text box
        //this.testtextbox.setX(-this.testtextbox.getWidth()*0.5);
        //this.testtextbox.setY(-this.testtextbox.getHeight()*0.5);
        //this.testtextbox.render();

        // Render test pixel text
        //this.testpxtext.setX(-this.testpxtext.getWidth()*0.5);
        //this.testpxtext.setY(-this.testpxtext.getHeight()*0.5);
        //this.testpxtext.render();

        // Render test pixel multitext
        //this.testpxmultitext.setX(-this.testpxmultitext.getWidth()*0.5);
        //this.testpxmultitext.setY(-this.testpxmultitext.getHeight()*0.5);
        //this.testpxmultitext.render();

        // Render test pixel text box
        //this.testpxtextbox.setX(-this.testpxtextbox.getWidth()*0.5);
        //this.testpxtextbox.setY(-this.testpxtextbox.getHeight()*0.5);
        //this.testpxtextbox.render();

        // Render shadows
        /*if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.shadows.clear();

            // Render test static mesh shadows
            this.staticmesh.render(0);

            // Render test skeletal mesh shadows
            this.skeletalmesh.render(0);
        }*/

        // Set renderer as active
        //this.renderer.setActive();

        // Set camera
        //this.renderer.setCamera(this.camera);

        // Set freefly camera
        //this.renderer.setCamera(this.freeflycam, this.frametime);

        // Render test plane
        //this.testplane.render();

        // Render test anim plane
        //this.testanimplane.render(this.frametime);

        // Render test proc plane
        //this.testprocplane.render(this.frametime);

        // Render test static mesh
        //this.staticmesh.render(this.renderer.quality, this.shadows);

        // Render test skeletal mesh
        //this.skeletalmesh.render(this.renderer.quality, this.shadows);
    }
};
