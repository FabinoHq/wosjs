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
//      audio/sound.js : WOS sound management                                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Sound class definition                                                    //
//  param audio : Audio engine pointer                                        //
////////////////////////////////////////////////////////////////////////////////
function Sound(audio)
{
    // Sound loaded state
    this.loaded = false;

    // Audio engine pointer
    this.audio = audio;

    // Sound buffer asset
    this.buffer = null;

    // Sound
    this.sound = null;

    // Sound panner
    this.panner = null;
    // Panner value
    this.pannerValue = 0.0;
    // Panner target
    this.pannerTarget = 0.0;
    // Sound distance
    this.distance = null;
    // Distance value
    this.distanceValue = 0.0;
    // Distance target
    this.distanceTarget = 0.0;
    // Sound position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Sound distance factor
    this.distanceFactor = WOSDefaultAudioDistanceFactor;

    // Sound playing count
    this.playingCount = 0;

    // Temp vectors
    this.delta = new Vector3();
    this.cross = new Vector3();
}

Sound.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init sound                                                     //
    //  param soundBuffer : Sound buffer to set sound from                    //
    //  return : True if sound is successfully loaded                         //
    ////////////////////////////////////////////////////////////////////////////
    init: function(soundBuffer)
    {
        // Reset sound
        this.loaded = false;
        this.buffer = null;
        this.sound = null;
        this.panner = null;
        this.pannerValue = 0.0;
        this.pannerTarget = 0.0;
        this.distance = null;
        this.distanceValue = 0.0;
        this.distanceTarget = 0.0;
        if (!this.position) return false;
        this.position.reset();
        this.distanceFactor = WOSDefaultAudioDistanceFactor;
        this.playingCount = 0;
        if (!this.delta) return false;
        this.delta.reset();
        if (!this.cross) return false;
        this.cross.reset();

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

        // Sound successfully loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setDistanceFactor : Set sound distance gain factor                    //
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
    //  setPosition : Set sound position                                      //
    //  param x : X position of the sound                                     //
    //  param y : Y position of the sound                                     //
    //  param z : Z position of the sound                                     //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        if (this.loaded)
        {
            this.position.setXYZ(x, y, z);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set sound position from a 3 component vector        //
    //  param vector : 3 component vector to set sound position from          //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        if (this.loaded)
        {
            this.position.setVector(vector);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPlaying : Get sound playing state                                   //
    //  return : True if the sound is playing                                 //
    ////////////////////////////////////////////////////////////////////////////
    isPlaying: function()
    {
        return (this.playingCount <= 0);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute sound                                               //
    //  param frametime : Frametime to compute sound                          //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        var delta = 0.0;

        // Compute sound audio
        if (this.loaded)
        {
            // Compute sound spatialization
            this.cross.crossProduct(this.audio.target, this.audio.upward);
            this.delta.setXYZ(
                this.position.vec[0] - this.audio.position.vec[0],
                this.position.vec[1] - this.audio.position.vec[1],
                this.position.vec[2] - this.audio.position.vec[2]
            );

            // Set sound distance
            this.distanceTarget = 1.0-(this.delta.length()*this.distanceFactor);
            if (this.distanceTarget <= 0.0) this.distanceTarget = 0.0;
            if (this.distanceTarget >= 1.0) this.distanceTarget = 1.0;

            // Set sound panning
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
            this.sound.loop = false;
            this.sound.snd = this;
            this.sound.onended = function()
            {
                // UI sound ended
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
            this.sound.connect(this.distance);
            this.sound.start(0);
            ++this.playingCount;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onSoundEnd : Called when the sound ended                              //
    ////////////////////////////////////////////////////////////////////////////
    onSoundEnd: function()
    {

    }
};
