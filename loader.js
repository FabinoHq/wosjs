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

    // Line shader
    this.lineShader = null;
    // Rect shader
    this.rectShader = null;
    // Sprite shader
    this.spriteShader = null;
    // Ninebox shader
    this.nineboxShader = null;
    // Animated sprite shader
    this.animSpriteShader = null;
    // Button shader
    this.buttonShader = null;
    // Text shader
    this.textShader = null;
    // Static mesh shader
    this.staticMeshShader = null;
    // Skeletal mesh shader
    this.skeletalMeshShader = null;
    // Shaders loaded state
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
        this.lineShader = null;
        this.rectShader = null;
        this.spriteShader = null;
        this.nineboxShader = null;
        this.animSpriteShader = null;
        this.buttonShader = null;
        this.textShader = null;
        this.staticMeshShader = null;
        this.skeletalMeshShader = null;
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

        // Init line shader
        this.lineShader = new LineShader(this.renderer.gl);
        if (!this.lineShader.init()) return false;

        // Init rect shader
        this.rectShader = new RectShader(this.renderer.gl);
        if (!this.rectShader.init()) return false;

        // Init sprite shader
        this.spriteShader = new SpriteShader(this.renderer.gl);
        if (!this.spriteShader.init()) return false;

        // Init ninebox shader
        this.nineboxShader = new NineboxShader(this.renderer.gl);
        if (!this.nineboxShader.init()) return false;

        // Init animated sprite shader
        this.animSpriteShader = new AnimSpriteShader(this.renderer.gl);
        if (!this.animSpriteShader.init()) return false;

        // Init button shader
        this.buttonShader = new ButtonShader(this.renderer.gl);
        if (!this.buttonShader.init()) return false;

        // Init text shader
        this.textShader = new TextShader(this.renderer.gl);
        if (!this.textShader.init()) return false;

        // Init static mesh shader
        this.staticMeshShader = new StaticMeshShader(this.renderer.gl);
        if (!this.staticMeshShader.init()) return false;

        // Init skeletal mesh shader
        this.skeletalMeshShader = new SkeletalMeshShader(this.renderer.gl);
        if (!this.skeletalMeshShader.init()) return false;

        // All global shaders loaded
        this.allShadersLoaded = true;
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
        var textPixels = this.renderer.renderText(
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
            this.textures[i].load("textures/" + TexturesAssets[i], false);
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
            this.sounds[i] = new Sound(this.audio.context);
            this.sounds[i].loader = this;
            this.sounds[i].onSoundLoaded = function()
            {
                this.loader.handleSoundLoaded();
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

