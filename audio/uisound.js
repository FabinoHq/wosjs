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
//      audio/uisound.js : WOS user interface sound management                //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  UISound class definition                                                  //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function UISound(audio)
{
    // UISound loaded status
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // UISound buffer request
    this.request = null;

    // UISound buffer asset
    this.buffer = null;

    // UISound
    this.uisound = null;

    // UISound playing state
    this.playing = false;
    // UISound loop state
    this.loop = false;
}

UISound.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  load : Load ui sound                                                  //
    //  param src : UISound source to load                                    //
    ////////////////////////////////////////////////////////////////////////////
    load: function(src)
    {
        // Reset UISound
        this.loaded = false;
        this.request = null;
        this.buffer = null;
        this.uisound = null;
        this.playing = false;

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Check source url
        if (!src) return false;

        // Create ui sound buffer
        this.buffer = this.audio.context.createBufferSource();

        // Load ui sound buffer
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
    //  setSound : Set sound from an existing sound resource                  //
    //  param sound : Sound resource to set ui sound from                     //
    ////////////////////////////////////////////////////////////////////////////
    setSound: function(sound)
    {
        // Reset sound
        this.loaded = false;
        this.request = null;
        this.buffer = null;
        this.uisound = null;
        this.playing = false;

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Check sound resource
        if (!sound) return false;

        // Check sound buffer
        if (!sound.buffer) return false;

        // Check sound loaded state
        if (!sound.loaded) return false;

        // Set sound buffer
        this.buffer = sound.buffer;
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setLoop : Set ui sound loop state                                     //
    //  param loop : UISound loop state to set                                //
    ////////////////////////////////////////////////////////////////////////////
    setLoop: function(loop)
    {
        if (this.loaded)
        {
            this.loop = loop;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundLoaded : Called when ui sound is fully loaded                  //
    ////////////////////////////////////////////////////////////////////////////
    onSoundLoaded: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  play : Play ui sound                                                  //
    ////////////////////////////////////////////////////////////////////////////
    play: function()
    {
        if (this.loaded)
        {
            // Create uisound
            this.uisound = new AudioBufferSourceNode(this.audio.context);
            this.uisound.buffer = this.buffer.buffer;
            if (!this.uisound.start) this.uisound.start = this.uisound.noteOn;
            if (!this.uisound.stop) this.uisound.stop = this.uisound.noteOff;
            this.uisound.loop = this.loop;
            this.uisound.onended = this.onSoundEnd;

            // Play sound
            this.uisound.connect(this.audio.uisoundGain);
            this.uisound.start(0);
            this.playing = true;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  stop : Stop ui sound                                                  //
    ////////////////////////////////////////////////////////////////////////////
    stop: function()
    {
        if (this.loaded)
        {
            if (this.playing)
            {
                this.uisound.stop(0);
                this.uisound.disconnect(this.audio.uisoundGain);
                this.playing = false;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundEnd : Called when the ui sound ended                           //
    ////////////////////////////////////////////////////////////////////////////
    onSoundEnd: function()
    {

    }
};
