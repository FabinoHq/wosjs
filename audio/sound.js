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
//      audio/sound.js : WOS sound management                                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Sound class definition                                                    //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function Sound(audio)
{
    // Sound loaded status
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // Sound buffer request
    this.req = null;

    // Sound buffer asset
    this.buffer = null;

    // Sound
    this.sound = null;

    // Sound playing state
    this.playing = false;
    // Sound loop state
    this.loop = false;
}

Sound.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  load : Load sound                                                     //
    //  param src : Sound source to load                                      //
    ////////////////////////////////////////////////////////////////////////////
    load: function(src)
    {
        // Reset sound
        this.loaded = false;
        this.buffer = null;
        this.sound = null;
        this.playing = false;

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Check source url
        if (!src) return false;

        // Create sound buffer
        this.buffer = this.audio.context.createBufferSource();

        // Load sound buffer
        this.req = new XMLHttpRequest();
        this.req.open("GET", src, true);
        this.req.responseType = "arraybuffer";
        this.req.snd = this;
        this.req.onload = function()
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
        this.req.send();
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setLoop : Set sound loop state                                        //
    //  param loop : Sound loop state to set                                  //
    ////////////////////////////////////////////////////////////////////////////
    setLoop: function(loop)
    {
        if (this.loaded)
        {
            this.loop = loop;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundLoaded : Called when sound is fully loaded                     //
    ////////////////////////////////////////////////////////////////////////////
    onSoundLoaded: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  play : Play sound                                                     //
    ////////////////////////////////////////////////////////////////////////////
    play: function()
    {
        if (this.loaded)
        {
            // Create sound
            this.sound = new AudioBufferSourceNode(this.audio.context);
            this.sound.buffer = this.buffer.buffer;
            if (!this.sound.start) this.sound.start = this.sound.noteOn;
            if (!this.sound.stop) this.sound.stop = this.sound.noteOff;
            this.sound.loop = this.loop;
            this.sound.onended = this.onSoundEnd;

            // Play sound
            this.sound.connect(this.audio.soundGain);
            this.sound.start(0);
            this.playing = true;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  stop : Stop sound                                                     //
    ////////////////////////////////////////////////////////////////////////////
    stop: function()
    {
        if (this.loaded)
        {
            if (this.playing)
            {
                this.sound.stop(0);
                this.sound.disconnect(this.audio.soundGain);
                this.playing = false;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundEnd : Called when the sound ended                              //
    ////////////////////////////////////////////////////////////////////////////
    onSoundEnd: function()
    {

    }
};
