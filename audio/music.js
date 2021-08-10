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
//      audio/music.js : WOS music management                                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Music class definition                                                    //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function Music(audio)
{
    // Music loaded status
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // Music buffer asset
    this.buffer = new Audio();

    // Music
    this.music = null;
}

Music.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  play : Play music                                                     //
    //  param src : Music source to play                                      //
    ////////////////////////////////////////////////////////////////////////////
    play: function(src)
    {
        // Reset music
        this.music = null;
        this.playing = false;

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Check source url
        if (!src) return false;

        // Play music
        if (!this.loaded)
        {
            this.loaded = true;
            this.buffer.pause();
            this.buffer.src = "";
            this.music = this.audio.context.createMediaElementSource(
                this.buffer
            );
            this.music.connect(this.audio.crossFaderGain);
            this.buffer.src = src;
            this.buffer.addEventListener("canplaythrough", this.startPlay());
            this.buffer.onended = this.onMusicEnd;
        }
        else
        {
            this.buffer.pause();
            this.buffer.src = src;
            this.buffer.addEventListener("canplaythrough", this.startPlay());
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  startPlay : Start music when buffer is ready                          //
    ////////////////////////////////////////////////////////////////////////////
    startPlay: function()
    {
        if (this.loaded)
        {
            this.buffer.play();
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  stop : Stop music                                                     //
    ////////////////////////////////////////////////////////////////////////////
    stop: function()
    {
        if (this.loaded)
        {
            this.buffer.pause();
            this.buffer.src = "";
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onMusicEnd : Called when the music ended                              //
    ////////////////////////////////////////////////////////////////////////////
    onMusicEnd: function()
    {

    }
};
