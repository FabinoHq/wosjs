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

    // Model data
    this.model = null;

    // Skeletal model
    this.skeletalModel = false;

    // Faces count
    this.facesCount = 0;
    // Vertices
    this.vertices = null;
    // Texture coordinates
    this.texCoords = null;
    // Indices
    this.indices = null;
}

ModelData.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  load : Load model data                                                //
    //  param src : URL of the source model file                              //
    ////////////////////////////////////////////////////////////////////////////
    load: function(src)
    {
        // Check source url
        if (!src) return false;

        // Load model data
        this.model = new XMLHttpRequest();
        this.model.open('GET', src);
        this.model.staticmesh = this;
        this.model.onloadend = function()
        {
            this.staticmesh.handleModelLoaded();
            if (this.staticmesh.loaded) this.staticmesh.onModelLoaded();
        }
        this.model.send();

        // Mesh data loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleModelLoaded : Source model is loaded                            //
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
        var currentIndex = 0;
        var modelData = this.model.responseText.split(' ');
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

                // Check model data count
                if ((vertCount > 0) && (texCoordsCount > 0) &&
                    (normalsCount == 0) && (this.facesCount > 0))
                {
                    // Create model data arrays
                    this.vertices = new GLArrayDataType(vertCount);
                    this.texCoords = new GLArrayDataType(texCoordsCount);
                    this.indices = new GLIndexDataType(this.facesCount);

                    // Read vertices
                    currentIndex = 0;
                    for (i = 8; i < (vertCount+8); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.vertices[currentIndex++] =
                                parseFloat(modelData[i]);
                        }
                    }

                    // Read texture coordinates
                    currentIndex = 0;
                    for (i = (vertCount+8);
                        i < (vertCount+texCoordsCount+8); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.texCoords[currentIndex++] =
                                parseFloat(modelData[i]);
                        }
                    }

                    // Read indices
                    currentIndex = 0;
                    for (i = (vertCount+texCoordsCount+8);
                        i < (vertCount+texCoordsCount+this.facesCount+8); ++i)
                    {
                        if (i < modelDataLen)
                        {
                            this.indices[currentIndex++] =
                                parseFloat(modelData[i]);
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

    }
};
