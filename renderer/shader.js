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
//      renderer/shader.js : Renderer shader management                       //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Shader class definition                                                   //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function Shader(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Shader sources
    this.vertexShaderSrc = null;
    this.fragmentShaderSrc = null;

    // Shader programs
    this.vertexShader = null;
    this.fragmentShader = null;
    this.shaderProgram = null;

    // Shader attributes locations
    this.vertexLocation = -1;
    this.texCoordsLocation = -1;
    this.normalsLocation = -1;
    this.tangentsLocation = -1;
    this.bonesIndicesLocation = -1;
    this.bonesWeightsLocation = -1;

    // Shader uniforms locations
    this.textureLocation = null;
    this.worldMatrixLocation = null;
    this.modelCol0Location = null;
    this.modelCol1Location = null;
    this.modelCol2Location = null;
    this.modelCol3Location = null;
}

Shader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init shader                                                    //
    //  param vertexSrc: Vertex shader source                                 //
    //  param fragmentSrc : Fragment shader source                            //
    //  return : True if shader is successfully loaded                        //
    ////////////////////////////////////////////////////////////////////////////
    init: function(vertexSrc, fragmentSrc)
    {
        // Reset shader
        this.vertexShaderSrc = null;
        this.fragmentShaderSrc = null;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.shaderProgram = null;
        this.vertexLocation = -1;
        this.texCoordsLocation = -1;
        this.normalsLocation = -1;
        this.tangentsLocation = -1;
        this.bonesIndicesLocation = -1;
        this.bonesWeightsLocation = -1;
        this.textureLocation = null;
        this.worldMatrixLocation = null;
        this.modelCol0Location = null;
        this.modelCol1Location = null;
        this.modelCol2Location = null;
        this.modelCol3Location = null;

        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Set shader sources
        if (vertexSrc !== undefined) this.vertexShaderSrc = vertexSrc;
        if (fragmentSrc !== undefined) this.fragmentShaderSrc = fragmentSrc;

        // Init vertex shader
        if (!this.vertexShaderSrc)
        {
            this.vertexShaderSrc = defaultVertexShaderSrc;
        }
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        if (!this.vertexShader)
        {
            // Could not create vertex shader
            return false;
        }

        // Compile vertex shader
        this.gl.shaderSource(this.vertexShader, this.vertexShaderSrc);
        this.gl.compileShader(this.vertexShader);
        if (!this.gl.getShaderParameter(
            this.vertexShader,
            this.gl.COMPILE_STATUS))
        {
            // Compiler status
            console.log("Vertex shader error : ");
            console.log(this.gl.getShaderInfoLog(this.vertexShader));

            // Could not compile vertex shader
            this.gl.deleteShader(this.vertexShader);
            return false;
        }

        // Init fragment shader
        if (!this.fragmentShaderSrc)
        {
            this.fragmentShaderSrc = defaultFragmentShaderSrc;
        }
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        if (!this.fragmentShader)
        {
            // Could not create fragment shader
            return false;
        }

        // Compile fragment shader
        this.gl.shaderSource(this.fragmentShader, this.fragmentShaderSrc);
        this.gl.compileShader(this.fragmentShader);
        if (!this.gl.getShaderParameter(
            this.fragmentShader,
            this.gl.COMPILE_STATUS))
        {
            // Compiler status
            console.log("Fragment shader error: ");
            console.log(this.gl.getShaderInfoLog(this.fragmentShader));

            // Could not compile fragment shader
            this.gl.deleteShader(this.fragmentShader);
            return false;
        }

        // Create shader program
        this.shaderProgram = this.gl.createProgram();
        if (!this.shaderProgram)
        {
            // Could not create shader program
            return false;
        }
        this.gl.attachShader(this.shaderProgram, this.vertexShader);
        this.gl.attachShader(this.shaderProgram, this.fragmentShader);

        // Bind vertex and texcoord attributes
        this.gl.bindAttribLocation(this.shaderProgram, 0, "vertexPos");
        this.gl.bindAttribLocation(this.shaderProgram, 1, "vertexColor");
        this.gl.bindAttribLocation(this.shaderProgram, 2, "bonesIndices");
        this.gl.bindAttribLocation(this.shaderProgram, 3, "bonesWeights");

        // Link shader program
        this.gl.linkProgram(this.shaderProgram);
        if (!this.gl.getProgramParameter(
            this.shaderProgram,
            this.gl.LINK_STATUS))
        {
            // Could not link shader program
            return false;
        }

        // Use shader program
        this.gl.useProgram(this.shaderProgram);

        // Get vertex attribute location
        this.vertexLocation = this.gl.getAttribLocation(
            this.shaderProgram, "vertexPos"
        );
        if (this.vertexLocation < 0) return false;

        // Get texture coords attribute location
        this.texCoordsLocation = this.gl.getAttribLocation(
            this.shaderProgram, "vertexCoord"
        );
        if (this.texCoordsLocation < 0) return false;

        // Get normals attribute location
        this.normalsLocation = this.gl.getAttribLocation(
            this.shaderProgram, "vertexNorm"
        );

        // Get tangents attribute location
        this.tangentsLocation = this.gl.getAttribLocation(
            this.shaderProgram, "vertexTan"
        );

        // Get bones indices attribute location
        this.bonesIndicesLocation = this.gl.getAttribLocation(
            this.shaderProgram, "bonesIndices"
        );

        // Get bones weights attribute location
        this.bonesWeightsLocation = this.gl.getAttribLocation(
            this.shaderProgram, "bonesWeights"
        );

        // Get texture location
        this.textureLocation = this.gl.getUniformLocation(
            this.shaderProgram, "texture"
        );
        if (this.textureLocation)
        {
            this.gl.uniform1i(this.textureLocation, 0);
        }

        // Get world matrix location
        this.worldMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram, "worldMatrix"
        );
        if (!this.worldMatrixLocation) return false;

        // Get model matrix column 0 location
        this.modelCol0Location = this.gl.getUniformLocation(
            this.shaderProgram, "modelCol0"
        );
        if (!this.modelCol0Location) return false;

        // Get model matrix column 1 location
        this.modelCol1Location = this.gl.getUniformLocation(
            this.shaderProgram, "modelCol1"
        );
        if (!this.modelCol1Location) return false;

        // Get model matrix column 2 location
        this.modelCol2Location = this.gl.getUniformLocation(
            this.shaderProgram, "modelCol2"
        );
        if (!this.modelCol2Location) return false;

        // Get model matrix column 3 location
        this.modelCol3Location = this.gl.getUniformLocation(
            this.shaderProgram, "modelCol3"
        );
        if (!this.modelCol3Location) return false;

        this.gl.useProgram(null);

        // Shader successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  bind : Bind shader to renderer                                        //
    ////////////////////////////////////////////////////////////////////////////
    bind: function()
    {
        this.gl.useProgram(this.shaderProgram);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  unbind : Unbind shader                                                //
    ////////////////////////////////////////////////////////////////////////////
    unbind: function()
    {
        this.gl.useProgram(null);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendWorldMatrix : Send world matrix to use with this shader           //
    //  param worldMatrix : 4x4 World matrix to use                           //
    ////////////////////////////////////////////////////////////////////////////
    sendWorldMatrix: function(worldMatrix)
    {
        this.gl.uniformMatrix4fv(
            this.worldMatrixLocation,
            false, worldMatrix.matrix
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelVecmat : Send model matrix 4 components vectors              //
    //  param modelVecmat : 4x4 model matrix 4 components vectors             //
    ////////////////////////////////////////////////////////////////////////////
    sendModelVecmat: function(modelVecmat)
    {
        // Send model matrix
        this.gl.uniform4fv(this.modelCol0Location, modelVecmat.col0);
        this.gl.uniform4fv(this.modelCol1Location, modelVecmat.col1);
        this.gl.uniform4fv(this.modelCol2Location, modelVecmat.col2);
        this.gl.uniform4fv(this.modelCol3Location, modelVecmat.col3);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelCol0 : Send model matrix column 0 vector                     //
    //  param modelVecmat : 4x4 model matrix 4 components vectors             //
    ////////////////////////////////////////////////////////////////////////////
    sendModelCol0: function(modelVecmat)
    {
        this.gl.uniform4fv(this.modelCol0Location, modelVecmat.col0);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelCol1 : Send model matrix column 1 vector                     //
    //  param modelVecmat : 4x4 model matrix 4 components vectors             //
    ////////////////////////////////////////////////////////////////////////////
    sendModelCol1: function(modelVecmat)
    {
        this.gl.uniform4fv(this.modelCol1Location, modelVecmat.col1);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelCol2 : Send model matrix column 2 vector                     //
    //  param modelVecmat : 4x4 model matrix 4 components vectors             //
    ////////////////////////////////////////////////////////////////////////////
    sendModelCol2: function(modelVecmat)
    {
        this.gl.uniform4fv(this.modelCol2Location, modelVecmat.col2);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelCol3 : Send model matrix column 3 vector                     //
    //  param modelVecmat : 4x4 model matrix 4 components vectors             //
    ////////////////////////////////////////////////////////////////////////////
    sendModelCol3: function(modelVecmat)
    {
        this.gl.uniform4fv(this.modelCol3Location, modelVecmat.col3);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUniform : Get shader uniform location index by uniform name        //
    //  param uniformName : Name of the shader uniform                        //
    //  return : Location index of the shader uniform                         //
    ////////////////////////////////////////////////////////////////////////////
    getUniform: function(uniformName)
    {
        return this.gl.getUniformLocation(this.shaderProgram, uniformName);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendUniform : Send shader uniform single data                         //
    //  param uniformLoc : Location index of the shader uniform               //
    //  param uniformData : Uniform single data to upload                     //
    ////////////////////////////////////////////////////////////////////////////
    sendUniform: function(uniformLoc, uniformData)
    {
        this.gl.uniform1f(uniformLoc, uniformData);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendIntUniform : Send shader integer uniform single data              //
    //  param uniformLoc : Location index of the shader uniform               //
    //  param uniformData : Uniform integer single data to upload             //
    ////////////////////////////////////////////////////////////////////////////
    sendIntUniform: function(uniformLoc, uniformData)
    {
        this.gl.uniform1i(uniformLoc, uniformData);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendUniformVec2 : Send shader uniform 2 components vector             //
    //  param uniformLoc : Location index of the shader uniform               //
    //  param uniformVec2 : Uniform 2 components vector to upload             //
    ////////////////////////////////////////////////////////////////////////////
    sendUniformVec2: function(uniformLoc, uniformVec2)
    {
        this.gl.uniform2fv(uniformLoc, uniformVec2.vec);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendUniformVec3 : Send shader uniform 3 components vector             //
    //  param uniformLoc : Location index of the shader uniform               //
    //  param uniformVec3 : Uniform 3 components vector to upload             //
    ////////////////////////////////////////////////////////////////////////////
    sendUniformVec3: function(uniformLoc, uniformVec3)
    {
        this.gl.uniform3fv(uniformLoc, uniformVec3.vec);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendUniformVec4 : Send shader uniform 4 components vector             //
    //  param uniformLoc : Location index of the shader uniform               //
    //  param uniformVec4 : Uniform 4 components vector to upload             //
    ////////////////////////////////////////////////////////////////////////////
    sendUniformVec4: function(uniformLoc, uniformVec4)
    {
        this.gl.uniform4fv(uniformLoc, uniformVec4.vec);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendUniformMat4 : Send shader matrix 4x4 uniform                      //
    //  param matrix : 4x4 matrix to send                                     //
    ////////////////////////////////////////////////////////////////////////////
    sendUniformMat4: function(uniformLoc, matrix)
    {
        this.gl.uniformMatrix4fv(uniformLoc, false, matrix.matrix);
    }
};
