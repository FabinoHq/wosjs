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

    // UISound buffer
    this.buffer = null;

    // UISound
    this.uisound = null;

    // UISound playing count
    this.playingCount = 0;
}

UISound.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init ui sound                                                  //
    //  param soundBuffer : Sound buffer to set ui sound from                 //
    //  return : True if the ui sound is successfully loaded                  //
    ////////////////////////////////////////////////////////////////////////////
    init: function(soundBuffer)
    {
        // Reset sound
        this.loaded = false;
        this.buffer = null;
        this.uisound = null;
        this.playingCount = 0;

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Check sound buffer
        if (!soundBuffer) return false;

        // Check sound buffer resource
        if (!soundBuffer.buffer) return false;

        // Check sound buffer loaded state
        if (!soundBuffer.loaded) return false;

        // Set sound buffer
        this.buffer = soundBuffer.buffer;
        if (!this.buffer) return false;

        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPlaying : Get ui sound playing state                                //
    //  return : True if the ui sound is playing                              //
    ////////////////////////////////////////////////////////////////////////////
    isPlaying: function()
    {
        return (this.playingCount <= 0);
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
            this.uisound.loop = false;
            this.uisound.snd = this;
            this.uisound.onended = function()
            {
                // Sound ended
                --this.snd.playingCount;
                if (this.snd.playingCount <= 0)
                {
                    // All ui sound instances ended
                    this.snd.playingCount = 0;
                    this.snd.onSoundEnd();
                }
                this.disconnect();
            };

            // Play sound
            this.uisound.connect(this.audio.uisoundGain);
            this.uisound.start(0);
            ++this.playingCount;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundEnd : Called when the ui sound ended                           //
    ////////////////////////////////////////////////////////////////////////////
    onSoundEnd: function()
    {

    }
};
