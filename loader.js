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


function Loader(renderer, audio)
{
    this.loaded = false;
    this.renderer = renderer;
    this.audio = audio;

    this.textures = null;
    this.texturesLoaded = 0;
    this.allTexturesLoaded = false;

    this.sounds = null;
    this.soundsLoaded = 0;
    this.allSoundsLoaded = false;
}

Loader.prototype = {
    init: function()
    {
        this.loaded = false;

        // Create assets array
        this.textures = new Array();
        this.sounds = new Array();

        this.texturesLoaded = 0;
        this.allTexturesLoaded = false;
        this.soundsLoaded = 0;
        this.allSoundsLoaded = false;
    },

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

    loadTextures: function()
    {
        // Check renderer
        if (!this.renderer)
        {
            this.allTexturesLoaded = true;
            return false;
        }
        if (!this.renderer.gl)
        {
            this.allTexturesLoaded = true;
            return false;
        }

        var texlen = TexturesAssets.length;
        for (var i = 0; i < texlen; ++i)
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

    handleTexturesLoaded: function()
    {
        ++this.texturesLoaded;
        if (this.texturesLoaded >= TexturesAssets.length)
        {
            // All assets loaded
            this.allTexturesLoaded = true;
            if (this.allTexturesLoaded && this.allSoundsLoaded)
            {
                this.onAssetsLoaded();
            }
        }
    },

    loadSounds: function()
    {
        // Check audio
        if (!this.audio)
        {
            this.allSoundsLoaded = true;
            return false;
        }
        if (!this.audio.context)
        {
            this.allSoundsLoaded = true;
            return false;
        }

        var sndlen = SoundsAssets.length;
        for (var i = 0; i < sndlen; ++i)
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

    handleSoundLoaded: function()
    {
        ++this.soundsLoaded;
        if (this.soundsLoaded >= SoundsAssets.length)
        {
            // All assets loaded
            this.allSoundsLoaded = true;
            if (this.allTexturesLoaded && this.allSoundsLoaded)
            {
                this.onAssetsLoaded();
            }
        }
    },

    onAssetsLoaded: function()
    {

    },

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

