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
//      renderer/modeldata.js : Model data management                         //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Model data class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function ModelData()
{
    // Model data loaded state
    this.loaded = false;

    // Model data request
    this.request = null;

    // Skeletal model
    this.skeletalModel = false;

    // Faces count
    this.facesCount = 0;
    // Vertices
    this.vertices = null;
    // Texture coordinates
    this.texCoords = null;
    // Normals
    this.normals = null;
    // Indices
    this.indices = null;
    // Bones count
    this.bonesCount = 0;
    // Bones parents
    this.bonesParents = null;
    // Bones positions
    this.bonesPositions = null;
    // Bones rotations
    this.bonesAngles = null;
    // Bones indices
    this.bonesIndices = null;
    // Bones weights
    this.bonesWeights = null;
    // Anim bones
    this.animBones = null;
    // Anim keyframes
    this.animFrames = null;
    // Animations
    this.animations = null;
}

ModelData.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  load : Load model data                                                //
    //  param src : URL of the source model file                              //
    //  return : True if model data is now loading                            //
    ////////////////////////////////////////////////////////////////////////////
    load: function(src)
    {
        // Reset model data
        this.loaded = false;
        this.request = null;
        this.skeletalModel = false;
        this.facesCount = 0;
        this.vertices = null;
        this.texCoords = null;
        this.normals = null;
        this.indices = null;
        this.bonesCount = 0;
        this.bonesParents = null;
        this.bonesPositions = null;
        this.bonesAngles = null;
        this.bonesIndices = null;
        this.bonesWeights = null;
        this.animBones = null;
        this.animFrames = null;
        this.animations = null;

        // Check source url
        if (!src) return false;

        // Load model data
        this.request = new XMLHttpRequest();
        if (!this.request) return false;
        this.request.open('GET', src);
        this.request.staticmesh = this;
        this.request.onload = function()
        {
            if (this.status == 200)
            {
                this.staticmesh.handleModelLoaded();
                if (this.staticmesh.loaded) this.staticmesh.onModelLoaded();
            }
            else
            {
                this.staticmesh.onModelError();
            }
        }
        this.request.send();

        // Model data is now loading
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleModelLoaded : Model data is successfully loaded                 //
    ////////////////////////////////////////////////////////////////////////////
    handleModelLoaded: function()
    {
        var i = 0;
        var majorVersion = 0;
        var minorVersion = 0;
        var skeletalModel = 0;
        var vertCount = 0;
        var texCoordsCount = 0;
        var normalsCount = 0;
        var bonesMaxInfluence = 0;
        var bonesPositionsCount = 0;
        var bonesAnglesCount = 0;
        var bonesIndicesCount = 0;
        var bonesWeightsCount = 0;
        var animGroupsCount = 0;
        var animGroupBones = 0;
        var animCount = 0;
        var keyFrames = 0;
        var animValues = 0;
        var currentRead = 0;
        var currentIndex = 0;
        var modelData = this.request.responseText.split(' ');
        var modelDataLen = modelData.length;

        if (modelDataLen >= 8)
        {
            // Check model file version
            majorVersion = parseInt(modelData[1]);
            minorVersion = parseInt(modelData[2]);
            if ((modelData[0] == "WMSH") &&
                (majorVersion == 1) && (minorVersion == 0))
            {
                // Check if this is a static mesh
                skeletalModel = parseInt(modelData[3]);
                if (skeletalModel) this.skeletalModel = true;

                // Read model data count
                vertCount = parseInt(modelData[4]);
                texCoordsCount = parseInt(modelData[5]);
                normalsCount = parseInt(modelData[6]);
                this.facesCount = parseInt(modelData[7]);

                currentRead = 8;
                if (this.skeletalModel)
                {
                    this.bonesCount = parseInt(modelData[8]);
                    bonesPositionsCount = parseInt(modelData[9]);
                    bonesAnglesCount = parseInt(modelData[10]);
                    bonesMaxInfluence = parseInt(modelData[11]);
                    bonesIndicesCount = parseInt(modelData[12]);
                    bonesWeightsCount = parseInt(modelData[13]);
                    animGroupsCount = parseInt(modelData[14]);
                    currentRead = 15;
                }

                // Check model data count
                if ((vertCount > 0) && (texCoordsCount > 0) &&
                    (normalsCount >= 0) && (this.facesCount > 0))
                {
                    // Create model data arrays
                    this.vertices = new GLArrayDataType(vertCount);
                    this.texCoords = new GLArrayDataType(texCoordsCount);
                    this.normals = new GLArrayDataType(normalsCount);
                    this.indices = new GLIndexDataType(this.facesCount);
                    if (this.skeletalModel)
                    {
                        this.bonesParents = new Array(this.bonesCount);
                        this.bonesPositions = new GLArrayDataType(
                            bonesPositionsCount
                        );
                        this.bonesAngles = new GLArrayDataType(
                            bonesAnglesCount
                        );
                        this.bonesIndices = new GLIndexDataType(
                            bonesIndicesCount
                        );
                        this.bonesWeights = new GLArrayDataType(
                            bonesWeightsCount
                        );
                        this.animBones = new Array(animGroupsCount);
                        this.animFrames = new Array(animGroupsCount);
                        this.animations = new Array(animGroupsCount);
                    }

                    // Read vertices
                    currentIndex = 0;
                    for (i = currentRead; i < (currentRead+vertCount); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.vertices[currentIndex++] =
                                parseFloat(modelData[i]);
                        }
                    }
                    currentRead += vertCount;

                    // Read texture coordinates
                    currentIndex = 0;
                    for (i = currentRead; i < (currentRead+texCoordsCount); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.texCoords[currentIndex++] =
                                parseFloat(modelData[i]);
                        }
                    }
                    currentRead += texCoordsCount;

                    // Read normals
                    currentIndex = 0;
                    for (i = currentRead; i < (currentRead+normalsCount); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.normals[currentIndex++] =
                                parseFloat(modelData[i]);
                        }
                    }
                    currentRead += normalsCount;

                    // Read indices
                    currentIndex = 0;
                    for (i = currentRead;
                        i < (currentRead+this.facesCount); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.indices[currentIndex++] =
                                parseFloat(modelData[i]);
                        }
                    }
                    currentRead += this.facesCount;

                    if (this.skeletalModel && (bonesMaxInfluence == 4))
                    {
                        // Read bones hierarchy
                        currentIndex = 0;
                        for (i = currentRead;
                            i < (currentRead+(this.bonesCount)); ++i)
                        {
                            if (i < modelDataLen)
                            {
                                this.bonesParents[currentIndex++] =
                                    parseInt(modelData[i]);
                            }
                        }
                        currentRead += this.bonesCount;

                        // Read bones positions
                        currentIndex = 0;
                        for (i = currentRead;
                            i < (currentRead+bonesPositionsCount); ++i)
                        {
                            if (i < modelDataLen)
                            {
                                this.bonesPositions[currentIndex++] =
                                    parseFloat(modelData[i]);
                            }
                        }
                        currentRead += bonesPositionsCount;

                        // Read bones angles
                        currentIndex = 0;
                        for (i = currentRead;
                            i < (currentRead+bonesAnglesCount); ++i)
                        {
                            if (i < modelDataLen)
                            {
                                this.bonesAngles[currentIndex++] =
                                    parseFloat(modelData[i]);
                            }
                        }
                        currentRead += bonesAnglesCount;

                        // Read bones indices
                        currentIndex = 0;
                        for (i = currentRead;
                            i < (currentRead+bonesIndicesCount); ++i)
                        {
                            if (i < modelDataLen)
                            {
                                this.bonesIndices[currentIndex++] =
                                    parseFloat(modelData[i]);
                            }
                        }
                        currentRead += bonesIndicesCount;

                        // Read bones weights
                        currentIndex = 0;
                        for (i = currentRead;
                            i < (currentRead+bonesWeightsCount); ++i)
                        {
                            if (i < modelDataLen)
                            {
                                this.bonesWeights[currentIndex++] =
                                    parseFloat(modelData[i]);
                            }
                        }
                        currentRead += bonesWeightsCount;

                        // Read all animations
                        for (var curAnim = 0;
                            curAnim < animGroupsCount; ++curAnim)
                        {
                            // Read anim group
                            animGroupBones = parseInt(modelData[currentRead++]);
                            this.animBones[curAnim] = new Array(animGroupBones);
                            currentIndex = 0;
                            for (i = currentRead;
                                i < (currentRead+animGroupBones); ++i)
                            {
                                if (i < modelDataLen)
                                {
                                    this.animBones[curAnim][currentIndex++] =
                                        parseInt(modelData[i]);
                                }
                            }
                            currentRead += animGroupBones;
                            animCount = parseInt(modelData[currentRead++]);

                            // Read current group animations
                            this.animFrames[curAnim] = new Array(animCount);
                            this.animations[curAnim] = new Array(animCount);
                            for (var j = 0; j < animCount; ++j)
                            {
                                keyFrames = parseInt(modelData[currentRead++]);
                                animValues = keyFrames*animGroupBones*6;
                                this.animFrames[curAnim][j] = keyFrames;
                                this.animations[curAnim][j] =
                                    new GLArrayDataType(animValues);
                                currentIndex = 0;
                                for (i = currentRead;
                                    i < (currentRead+animValues); ++i)
                                {
                                    if (i < modelDataLen)
                                    {
                                        this.animations
                                            [curAnim][j][currentIndex++] =
                                            parseFloat(modelData[i]);
                                    }
                                }
                                currentRead += animValues;
                            }
                        }
                    }

                    // Mesh data successfully loaded
                    this.loaded = true;
                }
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onModelLoaded : Called when model is fully loaded                     //
    ////////////////////////////////////////////////////////////////////////////
    onModelLoaded: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  onModelError : Called when model is not loaded                        //
    ////////////////////////////////////////////////////////////////////////////
    onModelError: function()
    {

    }
};
