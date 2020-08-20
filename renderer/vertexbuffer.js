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
//      renderer/vertexbuffer.js : VBO (Vertex Buffer Object) management      //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default vertex buffer vertices                                            //
////////////////////////////////////////////////////////////////////////////////
var defaultVertices = new GLArrayDataType([
    0.0, 0.0, 0.0,
    1.0, 0.0, 0.0,
    1.0, 1.0, 0.0,
    0.0, 1.0, 0.0
]);

////////////////////////////////////////////////////////////////////////////////
//  Default vertex buffer texture coordinates                                 //
////////////////////////////////////////////////////////////////////////////////
var defaultTexCoords = new GLArrayDataType([
    0.0, 1.0,
    1.0, 1.0,
    1.0, 0.0,
    0.0, 0.0
]);

////////////////////////////////////////////////////////////////////////////////
//  Default vertex buffer indices                                             //
////////////////////////////////////////////////////////////////////////////////
var defaultIndices = new GLIndexDataType([
    0, 1, 2,
    2, 3, 0
]);


////////////////////////////////////////////////////////////////////////////////
//  VertexBuffer class definition                                             //
////////////////////////////////////////////////////////////////////////////////
function VertexBuffer(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Vertex buffer object
    this.vertexBuffer = null;
    // Element buffer object
    this.elementBuffer = null;

    // Textures coordinates offset
    this.texCoordsOffset = 0;

    // Geometry data
    this.verticesData = null;
    this.texCoordsData = null;
    this.indicesData = null;
    this.vertCount = 0;
}

VertexBuffer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init vertex buffer object                                      //
    ////////////////////////////////////////////////////////////////////////////
    init: function()
    {
        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Set default data
        this.verticesData = defaultVertices;
        this.texCoordsData = defaultTexCoords;
        this.indicesData = defaultIndices;
        this.vertCount = 6;

        // Create VBO
        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer)
        {
            // Could not create VBO
            return false;
        }

        // Create EBO
        this.elementBuffer = this.gl.createBuffer();
        if (!this.elementBuffer)
        {
            // Could not create EBO
            return false;
        }

        // Update VBO
        this.updateBuffer();

        // VBO successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  bind : Bind vertex buffer object to renderer                          //
    ////////////////////////////////////////////////////////////////////////////
    bind: function()
    {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(
            this.gl.ELEMENT_ARRAY_BUFFER,
            this.elementBuffer
        );
    },

    ////////////////////////////////////////////////////////////////////////////
    //  unbind : Unbind vertex buffer object                                  //
    ////////////////////////////////////////////////////////////////////////////
    unbind: function()
    {
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateBuffer : Update vertex buffer object                            //
    ////////////////////////////////////////////////////////////////////////////
    updateBuffer: function()
    {
        // Send data to GPU
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.texCoordsOffset = this.verticesData.byteLength;
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            this.texCoordsOffset+this.texCoordsData.byteLength,
            this.gl.STATIC_DRAW
        );
        
        // Send vertices data
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, this.verticesData);

        // Send texcoords data
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            this.texCoordsOffset,
            this.texCoordsData
        );

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        // Send indexes data
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            this.indicesData,
            this.gl.STATIC_DRAW
        );

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    },
    
    ////////////////////////////////////////////////////////////////////////////
    //  render : Render the vertex buffer object                              //
    //  param shader : Shader program to render with                          //
    ////////////////////////////////////////////////////////////////////////////
    render: function(shader)
    {
        // Enable vertices array
        this.gl.enableVertexAttribArray(shader.vertexLocation);
        this.gl.vertexAttribPointer(
            shader.vertexLocation, 3,
            this.gl.FLOAT, this.gl.FALSE,
            0, 0
        );

        // Enable texcoords array
        this.gl.enableVertexAttribArray(shader.texCoordsLocation);
        this.gl.vertexAttribPointer(
            shader.texCoordsLocation, 2,
            this.gl.FLOAT, this.gl.FALSE,
            0, this.texCoordsOffset
        );

        // Draw triangles
        this.gl.drawElements(
            this.gl.TRIANGLES,
            this.vertCount,
            this.gl.UNSIGNED_SHORT, 0
        );
    }
};

