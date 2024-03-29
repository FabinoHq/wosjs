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
//           \\__/      \\_/    //______________/ //_____________/  JS        //
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
//    WOSjs : Web Operating System (javascript version)                       //
//      loader.js : WOS Loader management                                     //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Loader class definition                                                   //
////////////////////////////////////////////////////////////////////////////////
function Loader(renderer, audio)
{
    // Loader loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;
    // Audio engine pointer
    this.audio = audio;

    // Shaders
    this.backrendererShader = null;
    this.lineShader = null;
    this.rectShader = null;
    this.spriteShader = null;
    this.ninepatchShader = null;
    this.animSpriteShader = null;
    this.buttonShader = null;
    this.textBoxShader = null;
    this.textSelectionShader = null;
    this.textCursorShader = null;
    this.textButtonShader = null;
    this.toggleButtonShader = null;
    this.scrollBarShader = null;
    this.progressBarShader = null;
    this.sliderBarShader = null;
    this.textShader = null;
    this.pxTextShader = null;
    this.planeShader = null;
    this.planeShaderMedium = null;
    this.planeShaderLow = null;
    this.animPlaneShader = null;
    this.animPlaneShaderMedium = null;
    this.animPlaneShaderLow = null;
    this.staticMeshShader = null;
    this.staticMeshShaderMedium = null;
    this.staticMeshShaderLow = null;
    this.skeletalMeshShader = null;
    this.skeletalMeshShaderMedium = null;
    this.skeletalMeshShaderLow = null;
    this.allShadersLoaded = false;

    // Textures array
    this.textures = null;
    this.texturesLoaded = 0;
    this.allTexturesLoaded = false;

    // Models array
    this.models = null;
    this.modelsLoaded = 0;
    this.allModelsLoaded = false;

    // Sounds array
    this.sounds = null;
    this.soundsLoaded = 0;
    this.allSoundsLoaded = false;
}

Loader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init loader                                                    //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset loader
        this.loaded = false;

        this.backrendererShader = null;
        this.lineShader = null;
        this.rectShader = null;
        this.spriteShader = null;
        this.ninepatchShader = null;
        this.animSpriteShader = null;
        this.buttonShader = null;
        this.textBoxShader = null;
        this.textSelectionShader = null;
        this.textCursorShader = null;
        this.textButtonShader = null;
        this.toggleButtonShader = null;
        this.scrollBarShader = null;
        this.progressBarShader = null;
        this.sliderBarShader = null;
        this.textShader = null;
        this.pxTextShader = null;
        this.planeShader = null;
        this.planeShaderMedium = null;
        this.planeShaderLow = null;
        this.animPlaneShader = null;
        this.animPlaneShaderMedium = null;
        this.animPlaneShaderLow = null;
        this.staticMeshShader = null;
        this.staticMeshShaderMedium = null;
        this.staticMeshShaderLow = null;
        this.skeletalMeshShader = null;
        this.skeletalMeshShaderMedium = null;
        this.skeletalMeshShaderLow = null;
        this.allShadersLoaded = false;

        this.textures = new Array();
        this.texturesLoaded = 0;
        this.allTexturesLoaded = false;
        this.models = new Array();
        this.modelsLoaded = 0;
        this.allModelsLoaded = false;
        this.sounds = new Array();
        this.soundsLoaded = 0;
        this.allSoundsLoaded = false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadShaders : Load all global shaders                                 //
    ////////////////////////////////////////////////////////////////////////////
    loadShaders: function()
    {
        // Check renderer
        if (!this.renderer) return false;

        // Check WebGL pointer
        if (!this.renderer.gl) return false;

        // Init background renderer shader
        this.backrendererShader = new Shader(this.renderer.gl);
        if (!this.backrendererShader.init(
            defaultVertexShaderSrc, backrendererFragmentShaderSrc))
        {
            return false;
        }

        // Init line shader
        this.lineShader = new Shader(this.renderer.gl);
        if (!this.lineShader.init(
            defaultVertexShaderSrc, lineFragmentShaderSrc))
        {
            return false;
        }

        // Init rect shader
        this.rectShader = new Shader(this.renderer.gl);
        if (!this.rectShader.init(
            defaultVertexShaderSrc, rectFragmentShaderSrc)) 
        {
            return false;
        }

        // Init sprite shader
        this.spriteShader = new Shader(this.renderer.gl);
        if (!this.spriteShader.init(
            defaultVertexShaderSrc, spriteFragmentShaderSrc))
        {
            return false;
        }

        // Init ninepatch shader
        this.ninepatchShader = new Shader(this.renderer.gl);
        if (!this.ninepatchShader.init(
            defaultVertexShaderSrc, ninepatchFragmentShaderSrc))
        {
            return false;
        }

        // Init animated sprite shader
        this.animSpriteShader = new Shader(this.renderer.gl);
        if (!this.animSpriteShader.init(
            defaultVertexShaderSrc, animspriteFragmentShaderSrc))
        {
            return false;
        }

        // Init button shader
        this.buttonShader = new Shader(this.renderer.gl);
        if (!this.buttonShader.init(
            defaultVertexShaderSrc, buttonFragmentShaderSrc))
        {
            return false;
        }

        // Init text box shader
        this.textBoxShader = new Shader(this.renderer.gl);
        if (!this.textBoxShader.init(
            defaultVertexShaderSrc, textBoxFragmentShaderSrc))
        {
            return false;
        }

        // Init text selection shader
        this.textSelectionShader = new Shader(this.renderer.gl);
        if (!this.textSelectionShader.init(
            defaultVertexShaderSrc, textSelectionFragmentShaderSrc))
        {
            return false;
        }

        // Init text cursor shader
        this.textCursorShader = new Shader(this.renderer.gl);
        if (!this.textCursorShader.init(
            defaultVertexShaderSrc, textCursorFragmentShaderSrc))
        {
            return false;
        }

        // Init text button shader
        this.textButtonShader = new Shader(this.renderer.gl);
        if (!this.textButtonShader.init(
            defaultVertexShaderSrc, textButtonFragmentShaderSrc))
        {
            return false;
        }

        // Init toggle button shader
        this.toggleButtonShader = new Shader(this.renderer.gl);
        if (!this.toggleButtonShader.init(
            defaultVertexShaderSrc, toggleButtonFragmentShaderSrc))
        {
            return false;
        }

        // Init scrollbar shader
        this.scrollBarShader = new Shader(this.renderer.gl);
        if (!this.scrollBarShader.init(
            defaultVertexShaderSrc, scrollBarFragmentShaderSrc))
        {
            return false;
        }

        // Init progressbar shader
        this.progressBarShader = new Shader(this.renderer.gl);
        if (!this.progressBarShader.init(
            defaultVertexShaderSrc, progressBarFragmentShaderSrc))
        {
            return false;
        }

        // Init slidersbar shader
        this.sliderBarShader = new Shader(this.renderer.gl);
        if (!this.sliderBarShader.init(
            defaultVertexShaderSrc, sliderBarFragmentShaderSrc))
        {
            return false;
        }

        // Init text shader
        this.textShader = new Shader(this.renderer.gl);
        if (!this.textShader.init(
            defaultVertexShaderSrc, textFragmentShaderSrc))
        {
            return false;
        }

        // Init pixel text shader
        this.pxTextShader = new Shader(this.renderer.gl);
        if (!this.pxTextShader.init(
            defaultVertexShaderSrc, pxTextFragmentShaderSrc))
        {
            return false;
        }

        // Init plane shader
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.planeShader = new Shader(this.renderer.gl);
            if (!this.planeShader.init(
                planeVertexShaderSrc, planeFragmentShaderSrc))
            {
                return false;
            }
        }

        // Init medium plane shader
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.planeShaderMedium = new Shader(this.renderer.gl);
            if (!this.planeShaderMedium.init(
                planeVertexShaderMediumSrc, planeFragmentShaderMediumSrc))
            {
                return false;
            }
        }

        // Init low plane shader
        this.planeShaderLow = new Shader(this.renderer.gl);
        if (!this.planeShaderLow.init(
            planeVertexShaderLowSrc, planeFragmentShaderLowSrc))
        {
            return false;
        }

        // Init anim plane shader
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.animPlaneShader = new Shader(this.renderer.gl);
            if (!this.animPlaneShader.init(
                planeVertexShaderSrc, animPlaneFragmentShaderSrc))
            {
                return false;
            }
        }

        // Init medium anim plane shader
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.animPlaneShaderMedium = new Shader(this.renderer.gl);
            if (!this.animPlaneShaderMedium.init(
                planeVertexShaderMediumSrc, animPlaneFragmentShaderMediumSrc))
            {
                return false;
            }
        }

        // Init low anim plane shader
        this.animPlaneShaderLow = new Shader(this.renderer.gl);
        if (!this.animPlaneShaderLow.init(
            planeVertexShaderLowSrc, animPlaneFragmentShaderLowSrc))
        {
            return false;
        }

        // Init static mesh shader
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.staticMeshShader = new Shader(this.renderer.gl);
            if (!this.staticMeshShader.init(
                staticMeshVertexShaderSrc, staticMeshFragmentShaderSrc))
            {
                return false;
            }
        }

        // Init medium static mesh shader
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.staticMeshShaderMedium = new Shader(this.renderer.gl);
            if (!this.staticMeshShaderMedium.init(
                staticMeshVertexShaderMediumSrc,
                staticMeshFragmentShaderMediumSrc))
            {
                return false;
            }
        }

        // Init low static mesh shader
        this.staticMeshShaderLow = new Shader(this.renderer.gl);
        if (!this.staticMeshShaderLow.init(
            staticMeshVertexShaderLowSrc, staticMeshFragmentShaderLowSrc))
        {
            return false;
        }

        // Init skeletal mesh shader
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.skeletalMeshShader = new Shader(this.renderer.gl);
            if (!this.skeletalMeshShader.init(
                skeletalMeshVertexShaderSrc, skeletalMeshFragmentShaderSrc))
            {
                return false;
            }
        }

        // Init medium skeletal mesh shader
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.skeletalMeshShaderMedium = new Shader(this.renderer.gl);
            if (!this.skeletalMeshShaderMedium.init(
                skeletalMeshVertexShaderMediumSrc,
                skeletalMeshFragmentShaderMediumSrc))
            {
                return false;
            }
        }

        // Init low skeletal mesh shader
        this.skeletalMeshShaderLow = new Shader(this.renderer.gl);
        if (!this.skeletalMeshShaderLow.init(
            skeletalMeshVertexShaderLowSrc, skeletalMeshFragmentShaderLowSrc))
        {
            return false;
        }

        // All global shaders loaded
        this.allShadersLoaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadCursors : Load all cursors                                        //
    ////////////////////////////////////////////////////////////////////////////
    loadCursors: function()
    {
        // Check renderer
        if (!this.renderer) return false;

        // Preload cursors
        this.renderer.setDefaultCursor();
        this.renderer.setCrosshairCursor();
        this.renderer.setTextCursor();
        this.renderer.setGrabCursor();
        this.renderer.setGrabbingCursor();
        this.renderer.setEWResizeCursor();
        this.renderer.setNSResizeCursor();
        this.renderer.setNESWResizeCursor();
        this.renderer.setNWSEResizeCursor();

        // Set default cursor
        this.renderer.setDefaultCursor();
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadFonts : Load all fonts                                            //
    ////////////////////////////////////////////////////////////////////////////
    loadFonts: function()
    {
        // Check renderer
        if (!this.renderer) return false;

        // Prerender text
        var textWidth = this.renderer.getTextWidth("TextWidth", 20.0);
        var textPixels = this.renderer.renderTextData(
            "TextWidth", textWidth, 22.0, 20.0
        );
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadTextures : Load all textures                                      //
    ////////////////////////////////////////////////////////////////////////////
    loadTextures: function()
    {
        var texlen = 0;
        var i = 0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check WebGL pointer
        if (!this.renderer.gl) return false;

        // Load all textures asynchronously
        texlen = TexturesAssets.length;
        for (i = 0; i < texlen; ++i)
        {
            this.textures[i] = new Texture(this.renderer);
            this.textures[i].loader = this;
            this.textures[i].onTextureLoaded = function()
            {
                this.loader.handleTexturesLoaded();
            }
            this.textures[i].onTextureError = function()
            {
                // Could not load texture
                messageBoxText = "[0x0105] Could not load texture";
                this.loader.onAssetsError();
            }
            this.textures[i].load("textures/" + TexturesAssets[i], true);
        }
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleTexturesLoaded : Called when a texture is loaded                //
    ////////////////////////////////////////////////////////////////////////////
    handleTexturesLoaded: function()
    {
        var allSoundsReady = this.allSoundsLoaded;

        // Check audio pointer
        if (this.audio)
        {
            // Skip all sounds if audio engine is not loaded
            if (!this.audio.context || !this.audio.loaded)
            {
                allSoundsReady = true;
            }
        }
        else
        {
            allSoundsReady = true;
        }

        ++this.texturesLoaded;
        if (this.texturesLoaded >= TexturesAssets.length)
        {
            // All textures loaded
            this.allTexturesLoaded = true;
            if (this.allShadersLoaded && this.allTexturesLoaded &&
                this.allModelsLoaded && allSoundsReady)
            {
                // All assets loaded
                this.onAssetsLoaded();
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadModels : Load all models                                          //
    ////////////////////////////////////////////////////////////////////////////
    loadModels: function()
    {
        var modlen = 0;
        var i = 0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check WebGL pointer
        if (!this.renderer.gl) return false;

        // Load all models asynchronously
        modlen = ModelsAssets.length;
        for (i = 0; i < modlen; ++i)
        {
            this.models[i] = new ModelData();
            this.models[i].loader = this;
            this.models[i].onModelLoaded = function()
            {
                this.loader.handleModelsLoaded();
            }
            this.models[i].onModelError = function()
            {
                // Could not load model
                messageBoxText = "[0x0106] Could not load model";
                this.loader.onAssetsError();
            }
            this.models[i].load("models/" + ModelsAssets[i]);
        }
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleModelsLoaded : Called when a model is loaded                    //
    ////////////////////////////////////////////////////////////////////////////
    handleModelsLoaded: function()
    {
        var allSoundsReady = this.allSoundsLoaded;

        // Check audio pointer
        if (this.audio)
        {
            // Skip all sounds if audio engine is not loaded
            if (!this.audio.context || !this.audio.loaded)
            {
                allSoundsReady = true;
            }
        }
        else
        {
            allSoundsReady = true;
        }

        ++this.modelsLoaded;
        if (this.modelsLoaded >= ModelsAssets.length)
        {
            // All models loaded
            this.allModelsLoaded = true;
            if (this.allShadersLoaded && this.allTexturesLoaded &&
                this.allModelsLoaded && allSoundsReady)
            {
                // All assets loaded
                this.onAssetsLoaded();
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadSounds : Load all sounds                                          //
    ////////////////////////////////////////////////////////////////////////////
    loadSounds: function()
    {
        var sndlen = 0;
        var i = 0;

        // Check audio engine pointer
        if (!this.audio) return false;

        // Check audio context pointer
        if (!this.audio.context) return false;

        // Check audio engine loaded state
        if (!this.audio.loaded) return false;

        // Load all sounds asynchronously
        sndlen = SoundsAssets.length;
        for (i = 0; i < sndlen; ++i)
        {
            this.sounds[i] = new SoundBuffer(this.audio);
            this.sounds[i].loader = this;
            this.sounds[i].onSoundLoaded = function()
            {
                this.loader.handleSoundLoaded();
            }
            this.sounds[i].onSoundError = function()
            {
                // Could not load sound
                messageBoxText = "[0x0107] Could not load sound";
                this.loader.onAssetsError();
            }
            this.sounds[i].load("sounds/" + SoundsAssets[i]);
        }
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleSoundLoaded : Called when a sound is loaded                     //
    ////////////////////////////////////////////////////////////////////////////
    handleSoundLoaded: function()
    {
        ++this.soundsLoaded;
        if (this.soundsLoaded >= SoundsAssets.length)
        {
            // All sounds loaded
            this.allSoundsLoaded = true;
            if (this.allShadersLoaded && this.allTexturesLoaded &&
                this.allModelsLoaded && this.allSoundsLoaded)
            {
                // All assets loaded
                this.onAssetsLoaded();
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onAssetsLoaded : Called when all assets are loaded                    //
    ////////////////////////////////////////////////////////////////////////////
    onAssetsLoaded: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  onAssetsError : Called when an asset is missing                       //
    ////////////////////////////////////////////////////////////////////////////
    onAssetsError: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTexture : Get a texture resource previously loaded                 //
    //  param name : Name of the texture to get                               //
    //  return : Texture data pointer                                         //
    ////////////////////////////////////////////////////////////////////////////
    getTexture: function(name)
    {
        var texlen = TexturesAssets.length;
        var i = 0;
        for (i = 0; i < texlen; ++i)
        {
            if (TexturesAssets[i] == name)
            {
                return this.textures[i];
            }
        }
        return null;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getModel : Get a model resource previously loaded                     //
    //  param name : Name of the model to get                                 //
    //  return : Model data pointer                                           //
    ////////////////////////////////////////////////////////////////////////////
    getModel: function(name)
    {
        var modlen = ModelsAssets.length;
        var i = 0;
        for (i = 0; i < modlen; ++i)
        {
            if (ModelsAssets[i] == name)
            {
                return this.models[i];
            }
        }
        return null;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getSound : Get a sound resource previously loaded                     //
    //  param name : Name of the sound to get                                 //
    //  return : Sound data pointer                                           //
    ////////////////////////////////////////////////////////////////////////////
    getSound: function(name)
    {
        var sndlen = SoundsAssets.length;
        var i = 0;
        for (i = 0; i < sndlen; ++i)
        {
            if (SoundsAssets[i] == name)
            {
                return this.sounds[i];
            }
        }
        return null;
    }
};
