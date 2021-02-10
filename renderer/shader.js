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
//  Default vertex shader                                                     //
////////////////////////////////////////////////////////////////////////////////
const defaultVertexShaderSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexColor;",
    "uniform mat4 projMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat4 modelMatrix;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "    texCoord = vertexColor;",
    "    gl_Position = projMatrix*viewMatrix*modelMatrix*vec4(vertexPos, 1.0);",
    "}"
].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Default fragment shader                                                   //
////////////////////////////////////////////////////////////////////////////////
const defaultFragmentShaderSrc = [
    "precision mediump float;",
    "precision mediump int;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "    vec4 texColor = texture2D(texture, texCoord);",
    "    gl_FragColor = vec4(texColor.rgb, texColor.a);",
    "}"
].join("\n");


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
    this.bonesIndicesLocation = -1;
    this.bonesWeightsLocation = -1;

    // Shader uniforms locations
    this.textureLocation = -1;
    this.bonesMatricesLocation = -1;
    this.projMatrixLocation = -1;
    this.viewMatrixLocation = -1;
    this.modelMatrixLocation = -1;
}

Shader.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init shader                                                    //
    //  param vertexSrc: Vertex shader source                                 //
    //  param fragmentSrc : Fragment shader source                            //
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
        this.textureLocation = -1;
        this.projMatrixLocation = -1;
        this.viewMatrixLocation = -1;
        this.modelMatrixLocation = -1;

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
            this.gl.COMPILE_STATUS
        ))
        {
            // Compiler status
            console.log("Vert shader error : ");
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
            this.gl.COMPILE_STATUS
        ))
        {
            // Compiler status
            console.log("Frag shader error: ");
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
            this.gl.LINK_STATUS
        ))
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
        if (this.vertexLocation == -1) return false;

        // Get texture coords attribute location
        this.texCoordsLocation = this.gl.getAttribLocation(
            this.shaderProgram, "vertexColor"
        );
        if (this.texCoordsLocation == -1) return false;

        // Get bones indices attribute location
        this.bonesIndicesLocation = this.gl.getAttribLocation(
            this.shaderProgram, "bonesIndices"
        );
        //if (this.bonesIndicesLocation == -1) return false;

        // Get bones weights attribute location
        this.bonesWeightsLocation = this.gl.getAttribLocation(
            this.shaderProgram, "bonesWeights"
        );
        //if (this.bonesWeightsLocation == -1) return false;

        // Get texture location
        this.textureLocation = this.gl.getUniformLocation(
            this.shaderProgram, "texture"
        );
        if (this.textureLocation == -1) return false;
        this.gl.uniform1i(this.textureLocation, 0);

        // Get bones matrices location
        this.bonesMatricesLocation = this.gl.getUniformLocation(
            this.shaderProgram, "bonesMatrices"
        );
        //if (this.bonesMatricesLocation == -1) return false;
        if (this.bonesMatricesLocation != -1)
        {
            this.gl.uniform1i(this.bonesMatricesLocation, 1);
        }

        // Get projection matrix location
        this.projMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram, "projMatrix"
        );
        if (this.projMatrixLocation == -1) return false;

        // Get view matrix location
        this.viewMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram, "viewMatrix"
        );
        if (this.viewMatrixLocation == -1) return false;

        // Get model matrix location
        this.modelMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram, "modelMatrix"
        );
        if (this.modelMatrixLocation == -1) return false;

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
    //  sendProjectionMatrix : Send projection matrix to use with this shader //
    //  param projectionMatrix : 4x4 Projection matrix to use                 //
    ////////////////////////////////////////////////////////////////////////////
    sendProjectionMatrix: function(projectionMatrix)
    {
        this.gl.uniformMatrix4fv(
            this.projMatrixLocation,
            false, projectionMatrix.matrix
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendViewMatrix : Send view matrix to use with this shader             //
    //  param viewMatrix : 4x4 View matrix to use                             //
    ////////////////////////////////////////////////////////////////////////////
    sendViewMatrix: function(viewMatrix)
    {
        this.gl.uniformMatrix4fv(
            this.viewMatrixLocation,
            false, viewMatrix.matrix
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelMatrix : Send model matrix to use with this shader           //
    //  param modelMatrix : 4x4 Model matrix to use                           //
    ////////////////////////////////////////////////////////////////////////////
    sendModelMatrix: function(modelMatrix)
    {
        this.gl.uniformMatrix4fv(
            this.modelMatrixLocation,
            false, modelMatrix.matrix
        );
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
    }
};
