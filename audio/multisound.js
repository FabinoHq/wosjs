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
//      audio/multisound.js : WOS multi sound management                      //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default multi sound  settings                                             //
////////////////////////////////////////////////////////////////////////////////
const WOSDefaultMultiSoundFadeFactor = 0.7;
const WOSAudioMultiSoundStandby = 0;
const WOSAudioMultiSoundPlayingA = 1;
const WOSAudioMultiSoundCrossFadeAB = 2;
const WOSAudioMultiSoundPlayingB = 3;
const WOSAudioMultiSoundCrossFadeBA = 4;
const WOSAudioMultiSoundFadeOutA = 5;
const WOSAudioMultiSoundFadeOutB = 6;


////////////////////////////////////////////////////////////////////////////////
//  MultiSound class definition                                               //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function MultiSound(audio)
{
    // MultiSound loaded status
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // MultiSound buffers array
    this.buffers = new Array();

    // MultiSound A
    this.soundA = null;
    // MultiSound B
    this.soundB = null;
    // MultiSound A gain
    this.soundAGain = null;
    // MultiSound B gain
    this.soundBGain = null;
    // CrossFade gain value
    this.crossFadeValue = 0.0;
    // MultiSound fade factor
    this.fadeFactor = WOSDefaultMultiSoundFadeFactor;

    // MultiSound panner
    this.panner = null;
    // Panner value
    this.pannerValue = 0.0;
    // Panner target
    this.pannerTarget = 0.0;
    // MultiSound distance
    this.distance = null;
    // Distance value
    this.distanceValue = 0.0;
    // Distance target
    this.distanceTarget = 0.0;
    // MultiSound position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // MultiSound distance factor
    this.distanceFactor = WOSDefaultAudioDistanceFactor;

    // MultiSound state
    this.soundState = WOSAudioMultiSoundStandby;
    // MultiSound playing index
    this.index = 0;
    // MultiSound loop state
    this.loop = true;

    // Temp vectors
    this.delta = new Vector3();
    this.cross = new Vector3();
}

MultiSound.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init multi sound                                               //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Reset sound
        this.loaded = false;
        this.soundA = null;
        this.soundB = null;
        this.soundAGain = null;
        this.soundBGain = null;
        this.crossFadeValue = 0.0;
        this.fadeFactor = WOSDefaultMultiSoundFadeFactor;
        this.panner = null;
        this.pannerValue = 0.0;
        this.pannerTarget = 0.0;
        this.distance = null;
        this.distanceValue = 0.0;
        this.distanceTarget = 0.0;
        this.position.reset();
        this.distanceFactor = WOSDefaultAudioDistanceFactor;
        this.soundState = WOSAudioMultiSoundStandby;
        this.index = 0;
        this.loop = true;
        this.delta.reset();
        this.cross.reset();

        // Check audio engine
        if (!this.audio) return false;

        // Check audio context
        if (!this.audio.context) return false;

        // Create panner
        this.panner = this.audio.context.createStereoPanner();
        this.panner.connect(this.audio.soundGain);
        this.panner.pan.value = this.pannerValue;

        // Create distance gain
        this.distance = this.audio.context.createGain();
        this.distance.connect(this.panner);
        this.distance.gain.value = this.distanceValue*this.distanceValue;

        // Create sound A gain
        this.soundAGain = this.audio.context.createGain();
        this.soundAGain.connect(this.distance);
        this.soundAGain.gain.value = 1.0;

        // Create sound AB gain
        this.soundBGain = this.audio.context.createGain();
        this.soundBGain.connect(this.distance);
        this.soundBGain.gain.value = 0.0;

        // MultiSound loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  addSoundBuffer : Add a sound buffer                                   //
    //  param soundBuffer : Sound buffer to add                               //
    ////////////////////////////////////////////////////////////////////////////
    addSoundBuffer: function(soundBuffer)
    {
        if (this.loaded)
        {
            // Check sound buffer
            if (!soundBuffer) return false;

            // Check sound buffer resource
            if (!soundBuffer.buffer) return false;

            // Check sound buffer loaded state
            if (!soundBuffer.loaded) return false;

            // Add sound buffer to buffers array
            this.buffers.push(soundBuffer.buffer);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setLoop : Set multi sound loop state                                  //
    //  param loop : MultiSound loop state to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setLoop: function(loop)
    {
        if (this.loaded)
        {
            this.loop = loop;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFadeFactor : Set multi sound fade gain factor                      //
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
    //  setDistanceFactor : Set multi sound distance gain factor              //
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
    //  compute : Compute multi sound                                         //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        var delta = 0.0;

        // Check frametime
        if (!frametime) return;

        // Compute multi sound audio
        if (this.loaded)
        {
            // Compute multi sound state
            if (this.soundState == WOSAudioMultiSoundCrossFadeAB)
            {
                // Crossfade from A to B
                this.crossFadeValue += frametime*this.fadeFactor;
                if (this.crossFadeValue >= 1.0)
                {
                    // Crossfade end
                    this.crossFadeValue = 1.0;
                    this.soundAGain.gain.value = 0.0;
                    this.soundBGain.gain.value = 1.0;
                    this.soundState = WOSAudioMultiSoundPlayingB;

                    // Stop sound A
                    this.soundA.stop(0);
                    this.soundA.disconnect(this.soundAGain);
                }
                else
                {
                    this.soundAGain.gain.value =
                        (1.0-this.crossFadeValue)*(1.0-this.crossFadeValue);
                    this.soundBGain.gain.value =
                        this.crossFadeValue*this.crossFadeValue;
                }
            }
            else if (this.soundState == WOSAudioMultiSoundCrossFadeBA)
            {
                // Crossfade from B to A
                this.crossFadeValue -= frametime*this.fadeFactor;
                if (this.crossFadeValue <= 0.0)
                {
                    // Crossfade end
                    this.crossFadeValue = 0.0;
                    this.soundAGain.gain.value = 1.0;
                    this.soundBGain.gain.value = 0.0;
                    this.soundState = WOSAudioMultiSoundPlayingA;

                    // Stop sound B
                    this.soundB.stop(0);
                    this.soundB.disconnect(this.soundBGain);
                }
                else
                {
                    this.soundAGain.gain.value =
                        (1.0-this.crossFadeValue)*(1.0-this.crossFadeValue);
                    this.soundBGain.gain.value =
                        this.crossFadeValue*this.crossFadeValue;
                }
            }
            else if (this.soundState == WOSAudioMultiSoundFadeOutA)
            {
                // Sound A fade out
                this.crossFadeValue += frametime*this.fadeFactor;
                if (this.crossFadeValue >= 1.0)
                {
                    // Fade out end
                    this.crossFadeValue = 1.0;
                    this.soundAGain.gain.value = 0.0;
                    this.soundState = WOSAudioMultiSoundStandby;

                    // Stop sound A
                    this.soundA.stop(0);
                    this.soundA.disconnect(this.soundAGain);
                    this.crossFadeValue = 0.0;
                    this.soundState = WOSAudioMultiSoundStandby;
                }
                else
                {
                    this.soundAGain.gain.value =
                        (1.0-this.crossFadeValue)*(1.0-this.crossFadeValue);
                }
            }
            else if (this.soundState == WOSAudioMultiSoundFadeOutB)
            {
                // Sound B fade out
                this.crossFadeValue -= frametime*this.fadeFactor;
                if (this.crossFadeValue <= 0.0)
                {
                    // Fade out end
                    this.crossFadeValue = 0.0;
                    this.soundAGain.gain.value = 0.0;
                    this.soundState = WOSAudioMultiSoundStandby;

                    // Stop sound B
                    this.soundB.stop(0);
                    this.soundB.disconnect(this.soundBGain);
                    this.crossFadeValue = 0.0;
                    this.soundState = WOSAudioMultiSoundStandby;
                }
                else
                {
                    this.soundBGain.gain.value =
                        this.crossFadeValue*this.crossFadeValue;
                }
            }

            // Compute multi sound spatialization
            this.cross.crossProduct(this.audio.target, this.audio.upward);
            this.delta.setXYZ(
                this.audio.position.vec[0] + this.position.vec[0],
                this.audio.position.vec[1] + this.position.vec[1],
                this.audio.position.vec[2] + this.position.vec[2]
            );

            // Set multi sound distance
            this.distanceTarget = 1.0-(this.delta.length()*this.distanceFactor);
            if (this.distanceTarget <= 0.0) this.distanceTarget = 0.0;
            if (this.distanceTarget >= 1.0) this.distanceTarget = 1.0;

            // Set multi sound panning
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
    //  play : Play multi sound                                               //
    //  param index : Index of the sound buffer to play                       //
    ////////////////////////////////////////////////////////////////////////////
    play: function(index)
    {
        if (this.loaded)
        {
            // Clamp index
            if (index <= 0) index = 0;
            if (index >= (this.buffers.length-1)) index = this.buffers.length-1;

            // Check if sound is already playing
            if (this.soundState != WOSAudioMultiSoundStandby)
            {
                if (index == this.index) return;
            }

            // Play indexed sound
            if (this.soundState == WOSAudioMultiSoundStandby)
            {
                // Create multi sound A
                this.soundA = new AudioBufferSourceNode(this.audio.context);
                this.soundA.buffer = this.buffers[index].buffer;
                if (!this.soundA.start) this.soundA.start = this.soundA.noteOn;
                if (!this.soundA.stop) this.soundA.stop = this.soundA.noteOff;
                this.soundA.loop = this.loop;
                this.soundA.onended = this.onSoundEnd;

                // Play multi sound A
                this.soundA.connect(this.soundAGain);
                this.soundA.start(0);
                this.crossFadeValue = 0.0;
                this.soundAGain.gain.value = 1.0;
                this.soundBGain.gain.value = 0.0;
                this.soundState = WOSAudioMultiSoundPlayingA;
                this.index = index;
            }
            else if (this.soundState == WOSAudioMultiSoundPlayingA)
            {
                // Create multi sound B
                this.soundB = new AudioBufferSourceNode(this.audio.context);
                this.soundB.buffer = this.buffers[index].buffer;
                if (!this.soundB.start) this.soundB.start = this.soundB.noteOn;
                if (!this.soundB.stop) this.soundB.stop = this.soundB.noteOff;
                this.soundB.loop = this.loop;
                this.soundB.onended = this.onSoundEnd;

                // Play multi sound B
                this.soundB.connect(this.soundBGain);
                this.soundB.start(0);
                this.soundState = WOSAudioMultiSoundCrossFadeAB;
                this.index = index;
            }
            else if (this.soundState == WOSAudioMultiSoundPlayingB)
            {
                // Create multi sound A
                this.soundA = new AudioBufferSourceNode(this.audio.context);
                this.soundA.buffer = this.buffers[index].buffer;
                if (!this.soundA.start) this.soundA.start = this.soundA.noteOn;
                if (!this.soundA.stop) this.soundA.stop = this.soundA.noteOff;
                this.soundA.loop = this.loop;
                this.soundA.onended = this.onSoundEnd;

                // Play multi sound A
                this.soundA.connect(this.soundAGain);
                this.soundA.start(0);
                this.soundState = WOSAudioMultiSoundCrossFadeBA;
                this.index = index;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  stop : Stop multi sound                                               //
    ////////////////////////////////////////////////////////////////////////////
    stop: function()
    {
        if (this.loaded)
        {
            if (this.soundState == WOSAudioMultiSoundPlayingA)
            {
                this.soundState = WOSAudioMultiSoundFadeOutA;
            }
            else if (this.soundState == WOSAudioMultiSoundPlayingB)
            {
                this.soundState = WOSAudioMultiSoundFadeOutB;
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundEnd : Called when the multi sound ended                        //
    ////////////////////////////////////////////////////////////////////////////
    onSoundEnd: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set multi sound position                                //
    //  param x : X position of the multi sound                               //
    //  param y : Y position of the multi sound                               //
    //  param z : Z position of the multi sound                               //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        if (this.loaded && x && y && z)
        {
            this.position.setXYZ(x, y, z);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set multi sound position from a 3 component vector  //
    //  param vector : 3 component vector to set multi sound position from    //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        if (this.loaded && vector)
        {
            this.position.setVector(vector);
        }
    }
};
