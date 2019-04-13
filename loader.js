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

    // Textures array
    this.textures = null;
    this.texturesLoaded = 0;
    this.allTexturesLoaded = false;

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
        this.textures = new Array();
        this.sounds = new Array();
        this.texturesLoaded = 0;
        this.allTexturesLoaded = false;
        this.soundsLoaded = 0;
        this.allSoundsLoaded = false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  loadFonts : Load all fonts                                            //
    ////////////////////////////////////////////////////////////////////////////
    loadFonts: function()
    {
        // Check renderer
        if (!this.renderer)
        {
            return false;
        }
        
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
        // Check renderer pointer
        if (!this.renderer)
        {
            return false;
        }
        // Check WebGL pointer
        if (!this.renderer.gl)
        {
            return false;
        }

        // Load all textures asynchronously
        var sndlen = SoundsAssets.length;
        for (var i = 0; i < sndlen; ++i)
        {
            this.textures[i] = new Texture(this.renderer);
            this.textures[i].loader = this;
            this.textures[i].onTextureLoaded = function()
            {
                this.loader.handleTexturesLoaded();
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
        ++this.texturesLoaded;
        if (this.texturesLoaded >= TexturesAssets.length)
        {
            // All textures loaded
            this.allTexturesLoaded = true;
            if (this.allTexturesLoaded && this.allSoundsLoaded)
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
        // Check audio engine pointer
        if (!this.audio)
        {
            return false;
        }
        // Check audio context pointer
        if (!this.audio.context)
        {
            return false;
        }

        // Load all sounds asynchronously
        var texlen = TexturesAssets.length;
        for (var i = 0; i < texlen; ++i)
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
            if (this.allTexturesLoaded && this.allSoundsLoaded)
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
        for (var i = 0; i < texlen; ++i)
        {
            if (TexturesAssets[i] == name)
            {
                return this.textures[i];
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
        for (var i = 0; i < sndlen; ++i)
        {
            if (SoundsAssets[i] == name)
            {
                return this.sounds[i];
            }
        }
        return null;
    }
};
