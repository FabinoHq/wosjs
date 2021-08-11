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
//      audio/soundbuffer.js : WOS sound buffer management                    //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  SoundBuffer class definition                                              //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function SoundBuffer(audio)
{
    // Sound loaded status
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // Sound buffer request
    this.request = null;

    // Sound buffer asset
    this.buffer = null;
}

SoundBuffer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  load : Load sound buffer                                              //
    //  param src : Sound buffer source to load                               //
    ////////////////////////////////////////////////////////////////////////////
    load: function(src)
    {
        // Reset sound
        this.loaded = false;
        this.request = null;
        this.buffer = null;

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Check source url
        if (!src) return false;

        // Create sound buffer
        this.buffer = this.audio.context.createBufferSource();

        // Load sound buffer
        this.request = new XMLHttpRequest();
        this.request.open("GET", src, true);
        this.request.responseType = "arraybuffer";
        this.request.snd = this;
        this.request.onload = function()
        {
            if (this.status == 200)
            {
                var snd = this.snd;
                snd.audio.context.decodeAudioData(this.response,
                function(buffer) {
                    snd.buffer.buffer = buffer;
                    snd.loaded = true;
                    snd.onSoundLoaded();
                });
            }
        }
        this.request.send();
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundLoaded : Called when sound buffer is fully loaded              //
    ////////////////////////////////////////////////////////////////////////////
    onSoundLoaded: function()
    {

    }
};
