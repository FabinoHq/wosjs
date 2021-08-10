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
//  Default audio engine settings                                             //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultAudioFadeGainFactor = 0.7;
const WOSDefaultAudioCrossFadeFactor = 0.2;
const WOSAudioMusicStandby = 0;
const WOSAudioMusicFadeIn = 1;
const WOSAudioMusicPlaying = 2;
const WOSAudioMusicFadeOutNext = 3;
const WOSAudioMusicFadeOut = 4;


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
    this.masterGain = null;
    // Master gain value
    this.masterValue = 0.5;
    // Master gain target
    this.masterTarget = 0.5;
    // Audio engine sound gain
    this.soundGain = null;
    // Sound gain value
    this.soundValue = 0.8;
    // Sound gain target
    this.soundTarget = 0.8;
    // Audio engine ui sound gain
    this.uisoundGain = null;
    // UI sound gain value
    this.uisoundValue = 0.5;
    // UI sound gain target
    this.uisoundTarget = 0.5;
    // Audio engine music gain
    this.musicGain = null;
    // Music gain value
    this.musicValue = 0.8;
    // Music gain target
    this.musicTarget = 0.8;

    // Music instance
    this.music = null;
    // Music source
    this.musicSource = "";
    // Music crossfader gain
    this.crossFaderGain = null;
    // Music crossfader state
    this.crossFaderState = WOSAudioMusicStandby;
    // Music crossfader value
    this.crossFaderValue = 0.0;
}

AudioEngine.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init audio engine                                              //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset audio engine
        this.loaded = false;
        this.enabled = false;
        this.context = null;
        this.masterGain = null;
        this.masterValue = 0.5;
        this.masterTarget = 0.5;
        this.soundGain = null;
        this.soundValue = 0.8;
        this.soundTarget = 0.8;
        this.uisoundGain = null;
        this.uisoundValue = 0.5;
        this.uisoundTarget = 0.5;
        this.musicGain = null;
        this.musicValue = 0.8;
        this.musicTarget = 0.8;
        this.music = null;
        this.crossFaderGain = null;
        this.crossFaderState = WOSAudioMusicStandby;
        this.crossFaderValue = 0.0;

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
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        this.masterValue = 0.5;
        this.masterTarget = 0.5;
        this.masterGain.gain.value = this.masterValue*this.masterValue;

        // Create sounds gain
        this.soundGain = this.context.createGain();
        this.soundGain.connect(this.masterGain);
        this.soundValue = 0.8;
        this.soundTarget = 0.8;
        this.soundGain.gain.value = this.soundValue*this.soundValue;

        // Create ui sounds gain
        this.uisoundGain = this.context.createGain();
        this.uisoundGain.connect(this.masterGain);
        this.uisoundValue = 0.5;
        this.uisoundTarget = 0.5;
        this.uisoundGain.gain.value = this.uisoundValue*this.uisoundValue;

        // Create music gain
        this.musicGain = this.context.createGain();
        this.musicGain.connect(this.masterGain);
        this.musicValue = 0.8;
        this.musicTarget = 0.8;
        this.musicGain.gain.value = this.musicValue*this.musicValue;

        // Create music instance
        this.music = new Music(this);

        // Create music crossfader gain
        this.crossFaderGain = this.context.createGain();
        this.crossFaderGain.connect(this.musicGain);
        this.crossFaderGain.gain.value = 0.0;
        this.crossFaderValue = 0.0;

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
    //  compute : Compute audio engine                                        //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        var deltaMaster = 0.0;
        var deltaSound = 0.0;
        var deltaUISound = 0.0;
        var deltaMusic = 0.0;

        if (this.loaded)
        {
            // Update master gain
            deltaMaster = this.masterTarget-this.masterValue;
            if (deltaMaster > 0.0)
            {
                this.masterValue += frametime*WOSDefaultAudioFadeGainFactor;
                if (this.masterValue >= this.masterTarget)
                {
                    this.masterValue = this.masterTarget;
                }
                this.masterGain.gain.value = this.masterValue*this.masterValue;
            }
            else if (deltaMaster < 0.0)
            {
                this.masterValue -= frametime*WOSDefaultAudioFadeGainFactor;
                if (this.masterValue <= this.masterTarget)
                {
                    this.masterValue = this.masterTarget;
                }
                this.masterGain.gain.value = this.masterValue*this.masterValue;
            }

            // Update sound gain
            deltaSound = this.soundTarget-this.soundValue;
            if (deltaSound > 0.0)
            {
                this.soundValue += frametime*WOSDefaultAudioFadeGainFactor;
                if (this.soundValue >= this.soundTarget)
                {
                    this.soundValue = this.soundTarget;
                }
                this.soundGain.gain.value = this.soundValue*this.soundValue;
            }
            else if (deltaSound < 0.0)
            {
                this.soundValue -= frametime*WOSDefaultAudioFadeGainFactor;
                if (this.soundValue <= this.soundTarget)
                {
                    this.soundValue = this.soundTarget;
                }
                this.soundGain.gain.value = this.soundValue*this.soundValue;
            }

            // Update ui sound gain
            deltaUISound = this.uisoundTarget-this.uisoundValue;
            if (deltaUISound > 0.0)
            {
                this.uisoundValue += frametime*WOSDefaultAudioFadeGainFactor;
                if (this.uisoundValue >= this.uisoundTarget)
                {
                    this.uisoundValue = this.uisoundTarget;
                }
                this.uisoundGain.gain.value =
                    this.uisoundValue*this.uisoundValue;
            }
            else if (deltaUISound < 0.0)
            {
                this.uisoundValue -= frametime*WOSDefaultAudioFadeGainFactor;
                if (this.uisoundValue <= this.uisoundTarget)
                {
                    this.uisoundValue = this.uisoundTarget;
                }
                this.uisoundGain.gain.value =
                    this.uisoundValue*this.uisoundValue;
            }

            // Update music gain
            deltaMusic = this.musicTarget-this.musicValue;
            if (deltaMusic > 0.0)
            {
                this.musicValue += frametime*WOSDefaultAudioFadeGainFactor;
                if (this.musicValue >= this.musicTarget)
                {
                    this.musicValue = this.musicTarget;
                }
                this.musicGain.gain.value = this.musicValue*this.musicValue;
            }
            else if (deltaMusic < 0.0)
            {
                this.musicValue -= frametime*WOSDefaultAudioFadeGainFactor;
                if (this.musicValue <= this.musicTarget)
                {
                    this.musicValue = this.musicTarget;
                }
                this.musicGain.gain.value = this.musicValue*this.musicValue;
            }

            // Update music crossfader
            switch (this.crossFaderState)
            {
                // Play music
                case WOSAudioMusicFadeIn:
                    this.crossFaderValue +=
                        frametime*WOSDefaultAudioCrossFadeFactor;
                    if (this.crossFaderValue >= 1.0)
                    {
                        this.crossFaderValue = 1.0;
                        this.crossFaderGain.gain.value = 1.0;
                        this.crossFaderState = WOSAudioMusicPlaying;
                    }
                    else
                    {
                        this.crossFaderGain.gain.value =
                            this.crossFaderValue*this.crossFaderValue;
                    }
                    break;

                // Stop current music
                case WOSAudioMusicFadeOutNext:
                    this.crossFaderValue -=
                        frametime*WOSDefaultAudioCrossFadeFactor;
                    if (this.crossFaderValue <= 0.0)
                    {
                        this.crossFaderValue = 0.0;
                        this.crossFaderGain.gain.value = 0.0;
                        this.music.play(this.musicSource);
                        this.crossFaderState = WOSAudioMusicFadeIn;
                    }
                    else
                    {
                        this.crossFaderGain.gain.value =
                            this.crossFaderValue*this.crossFaderValue;
                    }
                    break;

                // Stop music
                case WOSAudioMusicFadeOut:
                    this.crossFaderValue -=
                        frametime*WOSDefaultAudioCrossFadeFactor;
                    if (this.crossFaderValue <= 0.0)
                    {
                        this.crossFaderValue = 0.0;
                        this.crossFaderGain.gain.value = 0.0;
                        this.music.stop();
                        this.crossFaderState = WOSAudioMusicStandby;
                    }
                    else
                    {
                        this.crossFaderGain.gain.value =
                            this.crossFaderValue*this.crossFaderValue;
                    }
                    break;

                default:
                    break;
            }
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
            this.masterTarget = masterGain;
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
            this.soundTarget = soundGain;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setUISoundGain : Set audio engine ui sound gain                       //
    //  param uisoundGain : UI sound gain to set                              //
    ////////////////////////////////////////////////////////////////////////////
    setUISoundGain: function(uisoundGain)
    {
        if (this.loaded)
        {
            if (uisoundGain <= 0.0) uisoundGain = 0.0;
            if (uisoundGain >= 1.0) uisoundGain = 1.0;
            this.uisoundTarget = uisoundGain;
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
            this.musicTarget = musicGain;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  playMusic : Play music                                                //
    //  param src : Music source to play                                      //
    ////////////////////////////////////////////////////////////////////////////
    playMusic: function(src)
    {
        if (this.loaded)
        {
            this.musicSource = src;
            if (this.crossFaderState == WOSAudioMusicStandby)
            {
                // Start music
                this.music.play(this.musicSource);
                this.crossFaderState = WOSAudioMusicFadeIn;
            }
            else
            {
                // Stop current music and start next music
                this.crossFaderState = WOSAudioMusicFadeOutNext;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  stopMusic : Stop music                                                //
    ////////////////////////////////////////////////////////////////////////////
    stopMusic: function()
    {
        if (this.loaded)
        {
            // Stop music
            this.crossFaderState = WOSAudioMusicFadeOut;
        }
    }
};
