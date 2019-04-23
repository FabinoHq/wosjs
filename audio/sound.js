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
//      sound.js : WOS sound management                                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Sound class definition                                                    //
////////////////////////////////////////////////////////////////////////////////
function Sound(audioContext)
{
    // Sound loaded status
    this.loaded = false;

    // Audio context pointer
    this.audioContext = audioContext;

    // Sound asset
    this.sound = null;
}

Sound.prototype = {
    load: function(src)
    {
        this.loaded = false;
        this.sound = null;

        // Check audio context
        if (!this.audioContext)
        {
            return false;
        }

        // Create sound
        this.sound = this.audioContext.createBufferSource();
        this.sound.loop = false;

        // Load sound
        var req = new XMLHttpRequest();
        req.open("GET", src, true);
        req.responseType = "arraybuffer";
        req.snd = this;
        req.onload = function()
        {
            this.snd.audioContext.decodeAudioData(req.response,
            function(buffer) {
                req.snd.sound.buffer = buffer;
                req.snd.handleSoundLoaded();
            });
        }
        req.send();
        return true;
    },

    handleSoundLoaded: function()
    {
        this.sound.connect(this.audioContext.destination);

        // Sound loaded
        this.loaded = true;
        this.onSoundLoaded();
    },

    onSoundLoaded: function()
    {

    },

    play: function()
    {
        if (this.loaded)
        {
            this.sound.start(0);
        }
    }
};


