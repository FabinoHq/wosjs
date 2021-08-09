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
//      audio/audioengine.js : WOS Audio engine management                    //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  AudioEngine class definition                                              //
////////////////////////////////////////////////////////////////////////////////
function AudioEngine()
{
    // Audio engine loaded status
    this.loaded = false;

    // Audio engine enabled status
    this.enabled = false;

    // Audio engine context
    this.context = null;

    // Audio engine master gain
    this.master = null;
    // Audio engine sound gain
    this.soundGain = null;
    // Audio engine music gain
    this.musicGain = null;
}

AudioEngine.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init audio engine                                              //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset audio engine
        this.loaded = false;

        // Create audio context
        try
        {
            this.context = new AudioContext();
        }
        catch(e)
        {
            this.context = null;
        }

        // Check context
        if (!this.context) return false;

        // Suspend audio context
        this.context.suspend();

        // Create master gain
        this.master = this.context.createGain();
        this.master.connect(this.context.destination);

        // Create sounds gain
        this.soundGain = this.context.createGain();
        this.soundGain.connect(this.master);

        // Create music gain
        this.musicGain = this.context.createGain();
        this.musicGain.connect(this.master);

        // Audio engine successfully loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  enable : Enable audio engine                                          //
    ////////////////////////////////////////////////////////////////////////////
    enable: function()
    {
        if (this.loaded)
        {
            // Enable audio context
            if (this.context.state == "suspended")
            {
                this.context.resume();
            }
            this.enabled = true;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  disable : Disable audio engine                                        //
    ////////////////////////////////////////////////////////////////////////////
    disable: function()
    {
        if (this.loaded)
        {
            // Disable audio engine
            if (this.context.state == "running")
            {
                this.context.suspend();
            }
            this.enabled = false;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMasterGain : Set audio engine master gain                          //
    //  param masterGain : Master gain to set                                 //
    ////////////////////////////////////////////////////////////////////////////
    setMasterGain: function(masterGain)
    {
        if (this.loaded)
        {
            if (masterGain <= 0.0) masterGain = 0.0;
            if (masterGain >= 1.0) masterGain = 1.0;
            this.master.gain.value = (masterGain*masterGain);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSoundGain : Set audio engine sound gain                            //
    //  param soundGain : Sound gain to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSoundGain: function(soundGain)
    {
        if (this.loaded)
        {
            if (soundGain <= 0.0) soundGain = 0.0;
            if (soundGain >= 1.0) soundGain = 1.0;
            this.soundGain.gain.value = (soundGain*soundGain);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMusicGain : Set audio engine music gain                            //
    //  param musicGain : Music gain to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setMusicGain: function(musicGain)
    {
        if (this.loaded)
        {
            if (musicGain <= 0.0) musicGain = 0.0;
            if (musicGain >= 1.0) musicGain = 1.0;
            this.musicGain.gain.value = (musicGain*musicGain);
        }
    }
};
