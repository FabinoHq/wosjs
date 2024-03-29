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
//           \\__/      \\_/    //______________/ //_____________/  JS        //
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
//    WOSjs : Web Operating System (javascript version)                       //
//      audio/loopsound.js : WOS loop sound management                        //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default loop sound settings                                               //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultLoopSoundFadeFactor = 0.7;
const WOSAudioLoopSoundStandby = 0;
const WOSAudioLoopSoundPlayingA = 1;
const WOSAudioLoopSoundCrossFadeAB = 2;
const WOSAudioLoopSoundPlayingB = 3;
const WOSAudioLoopSoundCrossFadeBA = 4;
const WOSAudioLoopSoundFadeOutA = 5;
const WOSAudioLoopSoundFadeOutB = 6;


////////////////////////////////////////////////////////////////////////////////
//  LoopSound class definition                                                //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function LoopSound(audio)
{
    // LoopSound loaded state
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // LoopSound buffers array
    this.buffers = new Array();

    // LoopSound A
    this.soundA = null;
    // LoopSound B
    this.soundB = null;
    // LoopSound A gain
    this.soundAGain = null;
    // LoopSound B gain
    this.soundBGain = null;
    // CrossFade gain value
    this.crossFadeValue = 0.0;
    // LoopSound fade factor
    this.fadeFactor = WOSDefaultLoopSoundFadeFactor;

    // LoopSound panner
    this.panner = null;
    // Panner value
    this.pannerValue = 0.0;
    // Panner target
    this.pannerTarget = 0.0;
    // LoopSound distance
    this.distance = null;
    // Distance value
    this.distanceValue = 0.0;
    // Distance target
    this.distanceTarget = 0.0;
    // LoopSound position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // LoopSound distance factor
    this.distanceFactor = WOSDefaultAudioDistanceFactor;

    // LoopSound state
    this.soundState = WOSAudioLoopSoundStandby;
    // LoopSound playing index
    this.index = 0;

    // Temp vectors
    this.delta = new Vector3();
    this.cross = new Vector3();
}

LoopSound.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init LoopSound                                                 //
    //  return : True if LoopSound is successfully loaded                     //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset sound
        this.loaded = false;
        if (!this.buffers) return false;
        this.soundA = null;
        this.soundB = null;
        this.soundAGain = null;
        this.soundBGain = null;
        this.crossFadeValue = 0.0;
        this.fadeFactor = WOSDefaultLoopSoundFadeFactor;
        this.panner = null;
        this.pannerValue = 0.0;
        this.pannerTarget = 0.0;
        this.distance = null;
        this.distanceValue = 0.0;
        this.distanceTarget = 0.0;
        if (!this.position) return false;
        this.position.reset();
        this.distanceFactor = WOSDefaultAudioDistanceFactor;
        this.soundState = WOSAudioLoopSoundStandby;
        this.index = 0;
        if (!this.delta) return false;
        this.delta.reset();
        if (!this.cross) return false;
        this.cross.reset();

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Create panner
        this.panner = this.audio.context.createStereoPanner();
        if (!this.panner) return false;
        this.panner.connect(this.audio.soundGain);
        this.panner.pan.value = this.pannerValue;

        // Create distance gain
        this.distance = this.audio.context.createGain();
        if (!this.distance) return false;
        this.distance.connect(this.panner);
        this.distance.gain.value = this.distanceValue*this.distanceValue;

        // Create sound A gain
        this.soundAGain = this.audio.context.createGain();
        if (!this.soundAGain) return false;
        this.soundAGain.connect(this.distance);
        this.soundAGain.gain.value = 1.0;

        // Create sound AB gain
        this.soundBGain = this.audio.context.createGain();
        if (!this.soundBGain) return false;
        this.soundBGain.connect(this.distance);
        this.soundBGain.gain.value = 0.0;

        // LoopSound successfully loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addSoundBuffer : Add a sound buffer                                   //
    //  param soundBuffer : Sound buffer to add                               //
    //  return : True if the sound buffer has been added to the buffers array //
    ////////////////////////////////////////////////////////////////////////////
    addSoundBuffer: function(soundBuffer)
    {
        if (!this.loaded) return false;

        // Check sound buffer
        if (!soundBuffer) return false;

        // Check sound buffer resource
        if (!soundBuffer.buffer) return false;

        // Check sound buffer loaded state
        if (!soundBuffer.loaded) return false;

        // Add sound buffer to buffers array
        this.buffers.push(soundBuffer.buffer);
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFadeFactor : Set loop sound fade gain factor                       //
    //  param fadeFactor : Fade gain factor to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setFadeFactor: function(fadeFactor)
    {
        if (this.loaded)
        {
            this.fadeFactor = fadeFactor;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDistanceFactor : Set loop sound distance gain factor               //
    //  param distanceFactor : Distance gain factor to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setDistanceFactor: function(distanceFactor)
    {
        if (this.loaded)
        {
            this.distanceFactor = distanceFactor;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set loop sound position                                 //
    //  param x : X position of the loop sound                                //
    //  param y : Y position of the loop sound                                //
    //  param z : Z position of the loop sound                                //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        if (this.loaded)
        {
            this.position.setXYZ(x, y, z);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set loop sound position from a 3 component vector   //
    //  param vector : 3 component vector to set loop sound position from     //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        if (this.loaded)
        {
            this.position.setVector(vector);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPlaying : Get loop sound playing state                              //
    //  return : True if the loop sound is playing                            //
    ////////////////////////////////////////////////////////////////////////////
    isPlaying: function()
    {
        return (this.soundState != WOSAudioLoopSoundStandby);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getPlayingIndex : Get loop sound playing index                        //
    //  return : Index of the loop sound buffer index playing                 //
    ////////////////////////////////////////////////////////////////////////////
    getPlayingIndex: function()
    {
        return this.index;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute loop sound                                          //
    //  param frametime : Frametime to compute loop sound                     //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        var delta = 0.0;

        // Compute loop sound audio
        if (this.loaded)
        {
            // Compute loop sound state
            if (this.soundState == WOSAudioLoopSoundCrossFadeAB)
            {
                // Crossfade from A to B
                this.crossFadeValue += frametime*this.fadeFactor;
                if (this.crossFadeValue >= 1.0)
                {
                    // Crossfade end
                    this.crossFadeValue = 1.0;
                    this.soundAGain.gain.value = 0.0;
                    this.soundBGain.gain.value = 1.0;
                    this.soundState = WOSAudioLoopSoundPlayingB;

                    // Stop sound A
                    this.soundA.stop(0);
                    this.soundA.disconnect();
                }
                else
                {
                    this.soundAGain.gain.value =
                        (1.0-this.crossFadeValue)*(1.0-this.crossFadeValue);
                    this.soundBGain.gain.value =
                        this.crossFadeValue*this.crossFadeValue;
                }
            }
            else if (this.soundState == WOSAudioLoopSoundCrossFadeBA)
            {
                // Crossfade from B to A
                this.crossFadeValue -= frametime*this.fadeFactor;
                if (this.crossFadeValue <= 0.0)
                {
                    // Crossfade end
                    this.crossFadeValue = 0.0;
                    this.soundAGain.gain.value = 1.0;
                    this.soundBGain.gain.value = 0.0;
                    this.soundState = WOSAudioLoopSoundPlayingA;

                    // Stop sound B
                    this.soundB.stop(0);
                    this.soundB.disconnect();
                }
                else
                {
                    this.soundAGain.gain.value =
                        (1.0-this.crossFadeValue)*(1.0-this.crossFadeValue);
                    this.soundBGain.gain.value =
                        this.crossFadeValue*this.crossFadeValue;
                }
            }
            else if (this.soundState == WOSAudioLoopSoundFadeOutA)
            {
                // Sound A fade out
                this.crossFadeValue += frametime*this.fadeFactor;
                if (this.crossFadeValue >= 1.0)
                {
                    // Fade out end
                    this.crossFadeValue = 1.0;
                    this.soundAGain.gain.value = 0.0;
                    this.soundState = WOSAudioLoopSoundStandby;

                    // Stop sound A
                    this.soundA.stop(0);
                    this.soundA.disconnect();
                    this.crossFadeValue = 0.0;
                    this.soundState = WOSAudioLoopSoundStandby;
                    this.onSoundEnd();
                }
                else
                {
                    this.soundAGain.gain.value =
                        (1.0-this.crossFadeValue)*(1.0-this.crossFadeValue);
                }
            }
            else if (this.soundState == WOSAudioLoopSoundFadeOutB)
            {
                // Sound B fade out
                this.crossFadeValue -= frametime*this.fadeFactor;
                if (this.crossFadeValue <= 0.0)
                {
                    // Fade out end
                    this.crossFadeValue = 0.0;
                    this.soundAGain.gain.value = 0.0;
                    this.soundState = WOSAudioLoopSoundStandby;

                    // Stop sound B
                    this.soundB.stop(0);
                    this.soundB.disconnect();
                    this.crossFadeValue = 0.0;
                    this.soundState = WOSAudioLoopSoundStandby;
                    this.onSoundEnd();
                }
                else
                {
                    this.soundBGain.gain.value =
                        this.crossFadeValue*this.crossFadeValue;
                }
            }

            // Compute loop sound spatialization
            this.cross.crossProduct(this.audio.target, this.audio.upward);
            this.delta.setXYZ(
                this.position.vec[0] - this.audio.position.vec[0],
                this.position.vec[1] - this.audio.position.vec[1],
                this.position.vec[2] - this.audio.position.vec[2]
            );

            // Set loop sound distance
            this.distanceTarget = 1.0-(this.delta.length()*this.distanceFactor);
            if (this.distanceTarget <= 0.0) this.distanceTarget = 0.0;
            if (this.distanceTarget >= 1.0) this.distanceTarget = 1.0;

            // Set loop sound panning
            this.delta.normalize();
            dotProduct = this.cross.dotProduct(this.delta);
            this.pannerTarget = dotProduct;
            if (this.pannerTarget <= -1.0) this.pannerTarget = -1.0;
            if (this.pannerTarget >= 1.0) this.pannerTarget = 1.0;

            // Compute distance gain
            delta = this.distanceTarget-this.distanceValue;
            if (delta > 0.0)
            {
                this.distanceValue += frametime*WOSDefaultAudioDistanceFade;
                if (this.distanceValue >= this.distanceTarget)
                {
                    this.distanceValue = this.distanceTarget;
                }
                this.distance.gain.value =
                    this.distanceValue*this.distanceValue;
            }
            else if (delta < 0.0)
            {
                this.distanceValue -= frametime*WOSDefaultAudioDistanceFade;
                if (this.distanceValue <= this.distanceTarget)
                {
                    this.distanceValue = this.distanceTarget;
                }
                this.distance.gain.value =
                    this.distanceValue*this.distanceValue;
            }

            // Compute panner
            delta = this.pannerTarget-this.pannerValue;
            if (delta > 0.0)
            {
                this.pannerValue += frametime*WOSDefaultAudioPanningFade;
                if (this.pannerValue >= this.pannerTarget)
                {
                    this.pannerValue = this.pannerTarget;
                }
                this.panner.pan.value = this.pannerValue;
            }
            else if (delta < 0.0)
            {
                this.pannerValue -= frametime*WOSDefaultAudioPanningFade;
                if (this.pannerValue <= this.pannerTarget)
                {
                    this.pannerValue = this.pannerTarget;
                }
                this.panner.pan.value = this.pannerValue;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  play : Play loop sound                                                //
    //  param index : Index of the sound buffer to play                       //
    ////////////////////////////////////////////////////////////////////////////
    play: function(index)
    {
        if (this.loaded)
        {
            // Clamp index
            if (index <= 0) index = 0;
            if (index >= (this.buffers.length-1)) index = this.buffers.length-1;

            // Check if the sound is already playing
            if (this.soundState != WOSAudioLoopSoundStandby)
            {
                if (index == this.index) return;
            }

            // Play indexed sound
            if (this.soundState == WOSAudioLoopSoundStandby)
            {
                // Create loop sound A
                this.soundA = new AudioBufferSourceNode(this.audio.context);
                this.soundA.buffer = this.buffers[index].buffer;
                if (!this.soundA.start) this.soundA.start = this.soundA.noteOn;
                if (!this.soundA.stop) this.soundA.stop = this.soundA.noteOff;
                this.soundA.loop = true;

                // Play loop sound A
                this.soundA.connect(this.soundAGain);
                this.soundA.start(0);
                this.crossFadeValue = 0.0;
                this.soundAGain.gain.value = 1.0;
                this.soundBGain.gain.value = 0.0;
                this.soundState = WOSAudioLoopSoundPlayingA;
                this.index = index;
            }
            else if (this.soundState == WOSAudioLoopSoundPlayingA)
            {
                // Create loop sound B
                this.soundB = new AudioBufferSourceNode(this.audio.context);
                this.soundB.buffer = this.buffers[index].buffer;
                if (!this.soundB.start) this.soundB.start = this.soundB.noteOn;
                if (!this.soundB.stop) this.soundB.stop = this.soundB.noteOff;
                this.soundB.loop = true;

                // Play loop sound B
                this.soundB.connect(this.soundBGain);
                this.soundB.start(0);
                this.soundState = WOSAudioLoopSoundCrossFadeAB;
                this.index = index;
            }
            else if (this.soundState == WOSAudioLoopSoundPlayingB)
            {
                // Create loop sound A
                this.soundA = new AudioBufferSourceNode(this.audio.context);
                this.soundA.buffer = this.buffers[index].buffer;
                if (!this.soundA.start) this.soundA.start = this.soundA.noteOn;
                if (!this.soundA.stop) this.soundA.stop = this.soundA.noteOff;
                this.soundA.loop = true;

                // Play loop sound A
                this.soundA.connect(this.soundAGain);
                this.soundA.start(0);
                this.soundState = WOSAudioLoopSoundCrossFadeBA;
                this.index = index;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  stop : Stop loop sound                                                //
    ////////////////////////////////////////////////////////////////////////////
    stop: function()
    {
        if (this.loaded)
        {
            if (this.soundState == WOSAudioLoopSoundPlayingA)
            {
                this.soundState = WOSAudioLoopSoundFadeOutA;
            }
            else if (this.soundState == WOSAudioLoopSoundPlayingB)
            {
                this.soundState = WOSAudioLoopSoundFadeOutB;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundEnd : Called when the loop sound ended                         //
    ////////////////////////////////////////////////////////////////////////////
    onSoundEnd: function()
    {

    }
};
