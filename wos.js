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
                    (WebGLFloatArray) : (Array)));

MapArrayDataType = Array;


////////////////////////////////////////////////////////////////////////////////
//  AudioContext definition                                                   //
////////////////////////////////////////////////////////////////////////////////
const AudioContext = (window.AudioContext || window.webKitAudioContext);


////////////////////////////////////////////////////////////////////////////////
//  messageBox : Display WOS error message                                    //
////////////////////////////////////////////////////////////////////////////////
var messageBoxText = "";
function messageBox()
{
    // Hide canvas
    document.getElementById("woscreen").style.display = "none";
    document.getElementById("woscreen").hidden = true;

    // Display default WOS message
    var message = document.createElement('p');
    message.innerHTML = "Unfortunately, WOS is not working on your browser.";
    message.style.color = "rgb(255, 127, 0)";
    message.style.fontSize = "1.8em";
    message.style.textAlign = "center";
    message.style.verticalAlign = "middle";
    message.style.position = "relative";
    message.style.width = "100%";
    message.style.top = "42%";
    message.style.display = "block";
    message.hidden = false;
    document.body.appendChild(message);

    var message2 = document.createElement('p');
    message2.innerHTML = "Please try again with a different one.";
    message2.style.color = "rgb(255, 127, 0)";
    message2.style.fontSize = "1.8em";
    message2.style.textAlign = "center";
    message2.style.verticalAlign = "middle";
    message2.style.position = "relative";
    message2.style.width = "100%";
    message2.style.top = "42%";
    message2.style.display = "block";
    message2.hidden = false;
    document.body.appendChild(message2);

    // Display error message
    var error = document.createElement('p');
    error.innerHTML = messageBoxText;
    error.style.color = "rgb(127, 127, 127)";
    error.style.fontSize = "1.2em";
    error.style.textAlign = "center";
    error.style.verticalAlign = "middle";
    error.style.position = "relative";
    error.style.width = "100%";
    error.style.top = "48%";
    error.style.display = "block";
    error.hidden = false;
    document.body.appendChild(error);
}


////////////////////////////////////////////////////////////////////////////////
//  window.onload : WOS Entry point                                           //
////////////////////////////////////////////////////////////////////////////////
window.onload = function()
{
    // Start WOS
    wos = new Wos();
    if (wos)
    {
        // Init WOS
        if (!wos.init())
        {
            // Could not init WOS
            messageBox();
        }
    }
    else
    {
        // Could not create WOS
        messageBoxText = "[0x0000] Could not create WOS";
        messageBox();
    }
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
    if (wos)
    {
        if (wos.loaded) wos.handleOnResize();
    }
}

////////////////////////////////////////////////////////////////////////////////
//  window.onkeydown : Triggered when a key is pressed                        //
////////////////////////////////////////////////////////////////////////////////
window.onkeydown = function(event)
{
    if (wos)
    {
        if (wos.loaded) wos.handleKeyDown(event.key);
    }
}

////////////////////////////////////////////////////////////////////////////////
//  window.onkeyup : Triggered when a key is released                         //
////////////////////////////////////////////////////////////////////////////////
window.onkeyup = function(event)
{
    if (wos)
    {
        if (wos.loaded) wos.handleKeyUp(event.key);
    }
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmousemove : Triggered when the mouse is moved                    //
////////////////////////////////////////////////////////////////////////////////
window.onmousemove = function(event)
{
    if (wos)
    {
        if (wos.loaded) wos.handleMouseMove(event.clientX, event.clientY);
    }
}

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
    if (wos)
    {
        if (wos.loaded)
        {
            wos.handleMouseTrack(event.movementX, event.movementY);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmousedown : Triggered when a mouse button is pressed             //
////////////////////////////////////////////////////////////////////////////////
window.onmousedown = function(event)
{
    if (wos)
    {
        if (wos.loaded)
        {
            wos.handleMouseDown(event.button, event.clientX, event.clientY);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//  window.onmouseup : Triggered when a mouse button is released              //
////////////////////////////////////////////////////////////////////////////////
window.onmouseup = function(event)
{
    if (wos)
    {
        if (wos.loaded)
        {
            wos.handleMouseUp(event.button, event.clientX, event.clientY);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
//  window wheel event : Triggered by the mouse wheel                         //
////////////////////////////////////////////////////////////////////////////////
window.addEventListener('wheel', function(event)
{
    if (wos)
    {
        if (wos.loaded)
        {
            wos.handleMouseWheel(event.deltaY, event.clientX, event.clientY);
        }
    }
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
    // Test ninepatch
    this.testninepatch = null;
    // Test anim
    this.testanim = null;
    // Test button
    this.testbutton = null;
    // Test toggle button
    this.testtogglebutton = null;
    // Test progress bar
    this.testprogressbar = null;
    // Test slider bar
    this.testsliderbar = null;
    // Test text
    this.testtext = null;
    // Test multitext
    this.testmultitext = null;
    // Test text box
    this.testtextbox = null;
    // Test text button
    this.testtextbutton = null;
    // Test pixel text
    this.testpxtext = null;
    // Test pixel multi text
    this.testpxmultitext = null;
    // Test pixel text box
    this.testpxtextbox = null;
    // Test pixel text button
    this.testpxtextbutton = null;
    // Test window
    this.testwindow = null;

    // Test camera
    this.camera = null;
    // Test freefly camera
    this.freeflycam = null;

    // Test point light
    this.pointLight = null;
    // Test spot light
    this.spotLight = null;

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
        if (!this.renderer) return false;
        if (!this.renderer.init("woscreen")) return false;
        this.renderer.clear();

        // Init audio engine
        this.audio = new AudioEngine();
        this.audio.init();

        // Init assets loader
        this.loader = new Loader(this.renderer, this.audio);
        if (!this.loader) return false;
        this.loader.init();

        // Load basic system
        this.loader.wos = this;
        this.loader.onAssetsLoaded = function()
        {
            if (!this.wos.initDone())
            {
                // Could not load basic system
                messageBox();
            }
        }
        this.loader.onAssetsError = function()
        {
            // Could not load basic system assets
            messageBox();
        }
        if (!this.loader.loadCursors())
        {
            // Could not load cursors
            messageBoxText = "[0x0100] Could not load cursors";
            return false;
        }
        if (!this.loader.loadFonts())
        {
            // Could not load fonts
            messageBoxText = "[0x0101] Could not load fonts";
            return false;
        }
        if (!this.loader.loadShaders())
        {
            // Could not load shaders
            messageBoxText = "[0x0102] Could not load shaders";
            return false;
        }
        if (!this.loader.loadTextures())
        {
            // Could not load textures
            messageBoxText = "[0x0103] Could not load shaders";
            return false;
        }
        if (!this.loader.loadModels())
        {
            // Could not load textures
            messageBoxText = "[0x0104] Could not load models";
            return false;
        }
        this.loader.loadSounds();

        // WOS basic system ready
        return true;
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
        if (!this.backrenderer)
        {
            // Could not create backrenderer
            messageBoxText = "[0x0200] Could not create backrenderer";
            return false;
        }
        if (!this.backrenderer.init(1024, 1024))
        {
            // Could not init backrenderer
            messageBoxText = "[0x0201] Could not init backrenderer";
            return false;
        }
        this.backrenderer.clear();

        // Init test line
        this.testline = new Line(this.renderer, this.loader.lineShader);
        if (!this.testline)
        {
            // Could not create test line
            messageBoxText = "[0x0202] Could not create test line";
            return false;
        }
        if (!this.testline.init(0.1, -0.5, -0.5, 0.5, 0.5))
        {
            // Could not init test line
            messageBoxText = "[0x0203] Could not init test line";
            return false;
        }
        this.testline.setColor(0.4, 0.0, 0.8);
        this.testline.setAlpha(0.7);
        this.testline.setSmoothness(0.4);

        // Init test rect
        this.testrect = new Rect(this.renderer, this.loader.rectShader);
        if (!this.testrect)
        {
            // Could not create test rect
            messageBoxText = "[0x0204] Could not create test rect";
            return false;
        }
        if (!this.testrect.init(0.1, 0.8, 0.4))
        {
            // Could not init test rect
            messageBoxText = "[0x0205] Could not init test rect";
            return false;
        }
        this.testrect.setColor(0.0, 0.2, 0.8);
        this.testrect.setAlpha(0.5);

        // Init test sprite
        this.loader.getTexture("testsprite.png").setSmooth(false);
        this.testsprite = new Sprite(this.renderer, this.loader.spriteShader);
        if (!this.testsprite)
        {
            // Could not create test sprite
            messageBoxText = "[0x0206] Could not create test sprite";
            return false;
        }
        if (!this.testsprite.init(
            this.loader.getTexture("testsprite.png"), 0.09, 0.09))
        {
            // Could not init test sprite
            messageBoxText = "[0x0207] Could not init test sprite";
            return false;
        }

        // Init test procedural sprite
        this.testproc = new ProcSprite(this.renderer);
        if (!this.testproc)
        {
            // Could not create test procedural sprite
            messageBoxText = "[0x0208] Could not create test procedural sprite";
            return false;
        }
        if (!this.testproc.init())
        {
            // Could not init test procedural sprite
            messageBoxText = "[0x0209] Could not init test procedural sprite";
            return false;
        }

        // Init test ninepatch
        this.testninepatch = new Ninepatch(
            this.renderer, this.loader.ninepatchShader
        );
        if (!this.testninepatch)
        {
            // Could not create test ninepatch
            messageBoxText = "[0x020A] Could not create test ninepatch";
            return false;
        }
        if (!this.testninepatch.init(
            this.loader.getTexture("testninepatch.png"), 0.4, 0.4, 15.0))
        {
            // Could not init test ninepatch
            messageBoxText = "[0x020B] Could not init test ninepatch";
            return false;
        }

        // Init test anim
        this.testanim = new AnimSprite(
            this.renderer, this.loader.animSpriteShader
        );
        if (!this.testanim)
        {
            // Could not create test anim
            messageBoxText = "[0x020C] Could not create test anim";
            return false;
        }
        if (!this.testanim.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0, 2, 2))
        {
            // Could not init test anim
            messageBoxText = "[0x020D] Could not init test anim";
            return false;
        }
        this.testanim.setFrametime(1.0);
        this.testanim.setStart(0, 0);
        this.testanim.setEnd(1, 1);
        this.testanim.resetAnim();

        // Init test button
        this.testbutton = new GuiButton(
            this.renderer, this.loader.buttonShader
        );
        if (!this.testbutton)
        {
            // Could not create test button
            messageBoxText = "[0x020E] Could not create test button";
            return false;
        }
        if (!this.testbutton.init(
            this.loader.getTexture("testbutton.png"), 0.12, 0.06))
        {
            // Could not init test button
            messageBoxText = "[0x020F] Could not init test button";
            return false;
        }

        // Init test toggle button
        this.testtogglebutton = new GuiToggleButton(
            this.renderer, this.loader.toggleButtonShader
        );
        if (!this.testtogglebutton)
        {
            // Could not create test toggle button
            messageBoxText = "[0x0210] Could not create test toggle button";
            return false;
        }
        if (!this.testtogglebutton.init(
            this.loader.getTexture("testtogglebutton.png"), 0.12, 0.12))
        {
            // Could not init test toggle button
            messageBoxText = "[0x0211] Could not init test toggle button";
            return false;
        }

        // Init test progress bar
        this.testprogressbar = new GuiProgressBar(
            this.renderer, this.loader.progressBarShader
        );
        if (!this.testprogressbar)
        {
            // Could not create test progress bar
            messageBoxText = "[0x0212] Could not create test progress bar";
            return false;
        }
        if (!this.testprogressbar.init(
            this.loader.getTexture("testprogressbar.png"), 0.8, 0.06, 15.0))
        {
            // Could not init test progress bar
            messageBoxText = "[0x0213] Could not init test progress bar";
            return false;
        }

        // Init test slider bar
        this.testsliderbar = new GuiSliderBar(
            this.renderer, this.loader.sliderBarShader
        );
        if (!this.testsliderbar)
        {
            // Could not create test slider bar
            messageBoxText = "[0x0214] Could not create test slider bar";
            return false;
        }
        if (!this.testsliderbar.init(
            this.loader.getTexture("testsliderbar.png"), 0.8, 0.06, 15.0))
        {
            // Could not init test slider bar
            messageBoxText = "[0x0215] Could not init test slider bar";
            return false;
        }
        this.testsliderbar.setCursorOffset(0.013);

        // Init test text
        this.testtext = new GuiText(this.renderer, this.loader.textShader);
        if (!this.testtext)
        {
            // Could not create test text
            messageBoxText = "[0x0216] Could not create test text";
            return false;
        }
        if (!this.testtext.init("Test text", 0.1))
        {
            // Could not init test text
            messageBoxText = "[0x0217] Could not init test text";
            return false;
        }

        // Init test multiline text
        this.testmultitext = new GuiMultiText(
            this.renderer, this.loader.textShader,
            this.loader.backrendererShader, this.loader.scrollBarShader
        );
        if (!this.testmultitext)
        {
            // Could not create test multiline text
            messageBoxText = "[0x0218] Could not create test multiline text";
            return false;
        }
        if (!this.testmultitext.init(
            "Test multi line text\nTest line 2\nAnd line 3 of text.",
            1.0, 1.0, 0.1, true, this.loader.getTexture("scrollbar.png"), 0.03))
        {
            // Could not init test multiline text
            messageBoxText = "[0x0219] Could not init test multiline text";
            return false;
        }

        // Init test text box
        this.testtextbox = new GuiTextBox(
            this.renderer, this.loader.textShader
        );
        if (!this.testtextbox)
        {
            // Could not create test text box
            messageBoxText = "[0x021A] Could not create test text box";
            return false;
        }
        if (!this.testtextbox.init(false, 1.0, 0.1, "Test"))
        {
            // Could not init test text box
            messageBoxText = "[0x021B] Could not init test text box";
            return false;
        }
        this.testtextbox.setSelected(true);

        // Init test text button
        this.testtextbutton = new GuiTextButton(
            this.renderer, this.loader.textButtonShader, this.loader.textShader
        );
        if (!this.testtextbutton)
        {
            // Could not create test text button
            messageBoxText = "[0x021C] Could not create test text button";
            return false;
        }
        if (!this.testtextbutton.init(
            this.loader.getTexture("testtextbutton.png"), "Test", 0.1, 15.0))
        {
            // Could not init test text button
            messageBoxText = "[0x021D] Could not init test text button";
            return false;
        }
        this.testtextbutton.setTextOffset(-0.004, -0.005);
        this.testtextbutton.setColor(0.1, 0.1, 0.1);
        this.testtextbutton.setHoverColor(0.2, 0.2, 0.2);

        // Init test pixel text
        this.testpxtext = new GuiPxText(
            this.renderer, this.loader.pxTextShader,
            this.loader.backrendererShader
        );
        if (!this.testpxtext)
        {
            // Could not create test pixel text
            messageBoxText = "[0x021E] Could not create test pixel text";
            return false;
        }
        if (!this.testpxtext.init(true,
            this.loader.getTexture("wospxfont.png"), "Test pixel text", 0.1))
        {
            // Could not init test pixel text
            messageBoxText = "[0x021F] Could not init test pixel text";
            return false;
        }
        this.testpxtext.setSmooth(0.15);

        // Init test pixel multiline text
        this.testpxmultitext = new GuiPxMultiText(
            this.renderer, this.loader.pxTextShader,
            this.loader.backrendererShader, this.loader.scrollBarShader
        );
        if (!this.testpxmultitext)
        {
            // Could not create test pixel multi text
            messageBoxText = "[0x0220] Could not create test pixel multi text";
            return false;
        }
        if (!this.testpxmultitext.init(true,
            this.loader.getTexture("wospxfont.png"),
            "Test multi line pixel text\nTest line 2\nAnd line 3 of text.",
            1.0, 1.0, 0.1, true, this.loader.getTexture("scrollbar.png"), 0.03))
        {
            // Could not init test pixel multi text
            messageBoxText = "[0x0221] Could not init test pixel multi text";
            return false;
        }
        this.testpxmultitext.setSmooth(0.1);

        // Init test pixel text box
        this.testpxtextbox = new GuiPxTextBox(
            this.renderer, this.loader.pxTextShader,
            this.loader.backrendererShader
        );
        if (!this.testpxtextbox)
        {
            // Could not create test pixel text box
            messageBoxText = "[0x0222] Could not create test pixel text box";
            return false;
        }
        if (!this.testpxtextbox.init(
            this.loader.getTexture("wospxfont.png"), 1.0, 0.1, "Test"))
        {
            // Could not init test pixel text box
            messageBoxText = "[0x0223] Could not init test pixel text box";
            return false;
        }
        this.testpxtextbox.setSmooth(0.1);

        // Init test pixel text button
        this.testpxtextbutton = new GuiPxTextButton(
            this.renderer, this.loader.textButtonShader,
            this.loader.pxTextShader, this.loader.backrendererShader
        );
        if (!this.testpxtextbutton)
        {
            // Could not create test pixel text button
            messageBoxText = "[0x0224] Could not create test pixel text button";
            return false;
        }
        if (!this.testpxtextbutton.init(
            this.loader.getTexture("testtextbutton.png"),
            this.loader.getTexture("wospxfont.png"), "Test", 0.1, 15.0))
        {
            // Could not init test pixel text button
            messageBoxText = "[0x0225] Could not init test pixel text button";
            return false;
        }
        this.testpxtextbutton.setSmooth(0.1);
        this.testpxtextbutton.setTextOffset(0.0, -0.002);
        this.testpxtextbutton.setColor(0.1, 0.1, 0.1);
        this.testpxtextbutton.setHoverColor(0.2, 0.2, 0.2);

        // Init test window
        this.testwindow = new GuiWindow(
            this.renderer, this.loader.ninepatchShader
        );
        if (!this.testwindow)
        {
            // Could not create test window
            messageBoxText = "[0x0226] Could not create test window";
            return false;
        }
        if (!this.testwindow.init(
            this.loader.getTexture("testwindow.png"), 1.0, 1.0, 3.75))
        {
            // Could not init test window
            messageBoxText = "[0x0227] Could not init test window";
            return false;
        }
        this.testwindow.setPosition(
            -this.testwindow.getWidth()*0.5, -this.testwindow.getHeight()*0.5
        );
        this.testwindow.setTopBarSize(0.06);
        this.testwindow.setResizeBarSize(0.014);

        // Init test camera
        this.camera = new Camera();
        if (!this.camera)
        {
            // Could not create test camera
            messageBoxText = "[0x0228] Could not create test camera";
            return false;
        }
        if (!this.camera.reset())
        {
            // Could not reset test camera
            messageBoxText = "[0x0229] Could not reset test camera";
            return false;
        }
        this.camera.rotateX(0.0);
        this.camera.moveY(0.0);
        this.camera.moveZ(3.0);

        // Init test freefly camera
        this.freeflycam = new FreeflyCam();
        if (!this.freeflycam)
        {
            // Could not create test freefly camera
            messageBoxText = "[0x022A] Could not create test freefly camera";
            return false;
        }
        if (!this.freeflycam.reset())
        {
            // Could not reset test freefly camera
            messageBoxText = "[0x022B] Could not reset test freefly camera";
            return false;
        }
        this.freeflycam.rotateX(0.0);
        this.freeflycam.moveY(0.0);
        this.freeflycam.moveZ(2.0);

        // Init test point light
        this.pointLight = new PointLight();
        if (!this.pointLight)
        {
            // Could not create test point light
            messageBoxText = "[0x022C] Could not create test point light";
            return false;
        }
        if (!this.pointLight.init())
        {
            // Could not init test point light
            messageBoxText = "[0x022D] Could not init test point light";
            return false;
        }
        this.pointLight.setPosition(3.0, 3.0, -3.0);
        this.pointLight.setColor(1.0, 1.0, 1.0, 0.8);
        this.pointLight.setRadius(5.0);
        this.pointLight.setFalloffRadius(12.0);

        // Init test spot light
        this.spotLight = new SpotLight();
        if (!this.spotLight)
        {
            // Could not create test spot light
            messageBoxText = "[0x022E] Could not create test spot light";
            return false;
        }
        if (!this.spotLight.init())
        {
            // Could not init test spot light
            messageBoxText = "[0x022F] Could not init test spot light";
            return false;
        }
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

        // Clear renderer shadows
        this.renderer.shadows.clear();

        // Init test plane
        this.testplane = new Plane(
            this.renderer,
            this.loader.planeShader,
            this.loader.planeShaderMedium,
            this.loader.planeShaderLow
        );
        if (!this.testplane)
        {
            // Could not create test plane
            messageBoxText = "[0x0230] Could not create test plane";
            return false;
        }
        if (!this.testplane.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0))
        {
            // Could not init test plane
            messageBoxText = "[0x0231] Could not init test plane";
            return false;
        }
        this.testplane.setBillboard(WOSPlaneBillboardNone);

        // Init test anim plane
        this.testanimplane = new AnimPlane(
            this.renderer,
            this.loader.animPlaneShader,
            this.loader.animPlaneShaderMedium,
            this.loader.animPlaneShaderLow
        );
        if (!this.testanimplane)
        {
            // Could not create test anim plane
            messageBoxText = "[0x0232] Could not create test anim plane";
            return false;
        }
        if (!this.testanimplane.init(
            this.loader.getTexture("testsprite.png"), 1.0, 1.0, 2, 2))
        {
            // Could not init test anim plane
            messageBoxText = "[0x0233] Could not init test anim plane";
            return false;
        }
        this.testanimplane.setFrametime(1.0);
        this.testanimplane.setStart(0, 0);
        this.testanimplane.setEnd(1, 1);
        this.testanimplane.resetAnim();
        this.testanimplane.setBillboard(WOSAnimPlaneBillboardSpherical);

        // Init test procedural plane
        this.testprocplane = new ProcPlane(this.renderer);
        if (!this.testprocplane)
        {
            // Could not create test procedural plane
            messageBoxText = "[0x0234] Could not create test procedural plane";
            return false;
        }
        if (!this.testprocplane.init())
        {
            // Could not init test procedural plane
            messageBoxText = "[0x0235] Could not init test procedural plane";
            return false;
        }
        this.testprocplane.setBillboard(WOSProcPlaneBillboardNone);

        // Init test static mesh
        this.staticmesh = new StaticMesh(
            this.renderer,
            this.loader.staticMeshShader,
            this.loader.staticMeshShaderMedium,
            this.loader.staticMeshShaderLow
        );
        if (!this.staticmesh)
        {
            // Could not create test static mesh
            messageBoxText = "[0x0236] Could not create test static mesh";
            return false;
        }
        if (!this.staticmesh.init(
            this.loader.getModel("testmodel.wmsh"),
            this.loader.getTexture("testsprite.png")))
        {
            // Could not init test static mesh
            messageBoxText = "[0x0237] Could not init test static mesh";
            return false;
        }

        // Init test skeletal mesh
        this.skeletalmesh = new SkeletalMesh(
            this.renderer,
            this.loader.skeletalMeshShader,
            this.loader.skeletalMeshShaderMedium,
            this.loader.skeletalMeshShaderLow
        );
        if (!this.skeletalmesh)
        {
            // Could not create test skeletal mesh
            messageBoxText = "[0x0238] Could not create test skeletal mesh";
            return false;
        }
        if (!this.skeletalmesh.init(
            this.loader.getModel("testskeletal.wmsh"),
            this.loader.getTexture("testsprite.png")))
        {
            // Could not init test skeletal mesh
            messageBoxText = "[0x0239] Could not init test skeletal mesh";
            return false;
        }
        this.skeletalmesh.setAnimation(0, 0);
        this.skeletalmesh.setAnimation(1, 0);
        this.skeletalmesh.setFrametime(0, 0.7);
        this.skeletalmesh.setFrametime(1, 1.0);

        // Clear renderer
        this.renderer.clear();

        // Run WOS
        this.lastTime = window.performance.now()*0.001;
        this.loaded = true;
        this.run();
        return true;
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
        //this.testwindow.handleOnResize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleKeyDown : Handle key pressed                                    //
    //  param key : Key pressed                                               //
    ////////////////////////////////////////////////////////////////////////////
    handleKeyDown: function(key)
    {
        //this.testtextbox.keyPress(key);
        //this.testpxtextbox.keyPress(key);
        /*switch (key)
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
        }*/
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleKeyUp : Handle key released                                     //
    //  param key : Key released                                              //
    ////////////////////////////////////////////////////////////////////////////
    handleKeyUp: function(key)
    {
        //this.testtextbox.keyRelease(key);
        //this.testpxtextbox.keyRelease(key);
        /*switch (key)
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
        //this.testbutton.mouseMove(this.realMouseX, this.realMouseY);
        //this.testtogglebutton.mouseMove(this.realMouseX, this.realMouseY);
        //this.testsliderbar.mouseMove(this.realMouseX, this.realMouseY);
        //this.testmultitext.mouseMove(this.realMouseX, this.realMouseY);
        //this.testtextbox.mouseMove(this.realMouseX, this.realMouseY);
        //this.testtextbutton.mouseMove(this.realMouseX, this.realMouseY);
        //this.testpxmultitext.mouseMove(this.realMouseX, this.realMouseY);
        //this.testpxtextbox.mouseMove(this.realMouseX, this.realMouseY);
        //this.testpxtextbutton.mouseMove(this.realMouseX, this.realMouseY);
        //this.testwindow.mouseMove(this.realMouseX, this.realMouseY);
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
        this.freeflycam.mouseMove(mouseX, mouseY);*/
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
        //this.testbutton.mousePress(this.realMouseX, this.realMouseY);
        //this.testtogglebutton.mousePress(this.realMouseX, this.realMouseY);
        //this.testsliderbar.mousePress(this.realMouseX, this.realMouseY);
        //this.testmultitext.mousePress(this.realMouseX, this.realMouseY);
        //this.testtextbox.mousePress(this.realMouseX, this.realMouseY);
        //this.testtextbutton.mousePress(this.realMouseX, this.realMouseY);
        //this.testpxmultitext.mousePress(this.realMouseX, this.realMouseY);
        //this.testpxtextbox.mousePress(this.realMouseX, this.realMouseY);
        //this.testpxtextbutton.mousePress(this.realMouseX, this.realMouseY);
        //this.testwindow.mousePress(this.realMouseX, this.realMouseY);
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
        //this.testbutton.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testtogglebutton.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testsliderbar.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testmultitext.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testtextbox.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testtextbutton.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testpxmultitext.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testpxtextbox.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testpxtextbutton.mouseRelease(this.realMouseX, this.realMouseY);
        //this.testwindow.mouseRelease(this.realMouseX, this.realMouseY);
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
        /*this.testmultitext.mouseWheel(
            mouseWheel, this.realMouseX, this.realMouseY
        );*/
        /*this.testpxmultitext.mouseWheel(
            mouseWheel, this.realMouseX, this.realMouseY
        );*/
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
        this.audio.compute(this.frametime);
        //this.testanim.compute(this.frametime);
        //this.testtextbox.compute(this.frametime);
        //this.testpxtextbox.compute(this.frametime);
        //this.testanimplane.compute(this.frametime);
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

        // Render test ninepatch
        //this.testninepatch.setSize(this.realMouseX*2.0, this.realMouseY*2.0);
        //this.testninepatch.setX(-this.testninepatch.getWidth()*0.5);
        //this.testninepatch.setY(-this.testninepatch.getHeight()*0.5);
        //this.testninepatch.render();

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

        // Render test slider bar
        //this.testsliderbar.setX(-this.testsliderbar.getWidth()*0.5);
        //this.testsliderbar.setY(-this.testsliderbar.getHeight()*0.5);
        //this.testsliderbar.render();

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

        // Render test text button
        //this.testtextbutton.setX(-this.testtextbutton.getWidth()*0.5);
        //this.testtextbutton.setY(-this.testtextbutton.getHeight()*0.5);
        //this.testtextbutton.render();

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

        // Render test pixel text button
        //this.testpxtextbutton.setX(-this.testpxtextbutton.getWidth()*0.5);
        //this.testpxtextbutton.setY(-this.testpxtextbutton.getHeight()*0.5);
        //this.testpxtextbutton.render();

        // Render test window
        //this.testwindow.render();

        // Compute shadows
        /*if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.renderer.shadows.clear();

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
        //this.testplane.render(this.renderer.quality);

        // Render test anim plane
        //this.testanimplane.render(this.renderer.quality);

        // Render test proc plane
        //this.testprocplane.render(this.renderer.quality);

        // Render test static mesh
        //this.staticmesh.render(this.renderer.quality);

        // Render test skeletal mesh
        //this.skeletalmesh.render(this.renderer.quality);
    }
};
