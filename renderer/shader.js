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
    "attribute vec3 vertexPos;",
    "attribute vec2 vertexColor;",
    "uniform mat4 projMatrix;",
    "uniform mat4 viewMatrix;",
    "uniform mat4 modelMatrix;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "   texCoord = vertexColor;",
    "   gl_Position = projMatrix*viewMatrix*modelMatrix*vec4(vertexPos, 1.0);",
    "}" ].join("\n");

////////////////////////////////////////////////////////////////////////////////
//  Default fragment shader                                                   //
////////////////////////////////////////////////////////////////////////////////
const defaultFragmentShaderSrc = [
    "precision mediump float;",
    "uniform sampler2D texture;",
    "varying vec2 texCoord;",
    "void main()",
    "{",
    "   gl_FragColor = texture2D(texture, texCoord);",
    "}" ].join("\n");


////////////////////////////////////////////////////////////////////////////////
//  Shader class definition                                                   //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function Shader(glPointer)
{
    // Shader loaded status
    this.loaded = false;

    // WebGL functions pointer
    this.gl = glPointer;

    // Shader sources
    this.vertexShaderSrc = null;
    this.fragmentShaderSrc = null;

    // Shader programs
    this.vertexShader = null;
    this.fragmentShader = null;
    this.shaderProgram = null;

    // Shader uniforms locations
    this.textureLocation = -1;
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
        this.loaded = false;
        this.vertexShaderSrc = null;
        this.fragmentShaderSrc = null;
        this.vertexShader = null;
        this.fragmentShader = null;
        this.shaderProgram = null;
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
        this.vertexShaderSrc = vertexSrc;
        this.fragmentShaderSrc = fragmentSrc;

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

        // Get texture location
        this.textureLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            "texture"
        );
        if (this.textureLocation == -1) return false;

        // Get projection matrix location
        this.projMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            "projMatrix"
        );
        if (this.projMatrixLocation == -1) return false;

        // Get view matrix location
        this.viewMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            "viewMatrix"
        );
        if (this.viewMatrixLocation == -1) return false;

        // Get model matrix location
        this.modelMatrixLocation = this.gl.getUniformLocation(
            this.shaderProgram,
            "modelMatrix"
        );
        if (this.modelMatrixLocation == -1) return false;

        this.gl.useProgram(null);

        // Shader successfully loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  bind : Bind shader for rendering                                      //
    ////////////////////////////////////////////////////////////////////////////
    bind: function()
    {
        if (this.loaded)
        {
            this.gl.useProgram(this.shaderProgram);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  unbind : Unbind shader                                                //
    ////////////////////////////////////////////////////////////////////////////
    unbind: function()
    {
        if (this.loaded)
        {
            this.gl.useProgram(null);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendProjectionMatrix : Send projection matrix to use with this shader //
    //  param projectionMatrix : 4x4 Projection matrix to use                 //
    ////////////////////////////////////////////////////////////////////////////
    sendProjectionMatrix: function(projectionMatrix)
    {
        if (this.loaded)
        {
            this.gl.uniformMatrix4fv(
                this.projMatrixLocation,
                false, projectionMatrix.matrix
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendViewMatrix : Send view matrix to use with this shader             //
    //  param viewMatrix : 4x4 View matrix to use                             //
    ////////////////////////////////////////////////////////////////////////////
    sendViewMatrix: function(viewMatrix)
    {
        if (this.loaded)
        {
            this.gl.uniformMatrix4fv(
                this.viewMatrixLocation,
                false, viewMatrix.matrix
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendModelMatrix : Send model matrix to use with this shader           //
    //  param modelMatrix : 4x4 Model matrix to use                           //
    ////////////////////////////////////////////////////////////////////////////
    sendModelMatrix: function(modelMatrix)
    {
        if (this.loaded)
        {
            this.gl.uniformMatrix4fv(
                this.modelMatrixLocation,
                false, modelMatrix.matrix
            );
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUniform : Get shader uniform location index by uniform name        //
    //  param uniformName : Name of the shader uniform                        //
    //  return : Location index of the shader uniform                         //
    ////////////////////////////////////////////////////////////////////////////
    getUniform: function(uniformName)
    {
        if (this.loaded)
        {
            return this.gl.getUniformLocation(this.shaderProgram, uniformName);
        }
        else
        {
            return -1;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  sendUniform : Send shader uniform data                                //
    //  param uniformLoc : Location index of the shader uniform               //
    //  param uniformData : Uniform data to upload                            //
    ////////////////////////////////////////////////////////////////////////////
    sendUniform: function(uniformLoc, uniformData)
    {
        if (this.loaded)
        {
            this.gl.uniform1f(uniformLoc, uniformData);
        }
    }
};