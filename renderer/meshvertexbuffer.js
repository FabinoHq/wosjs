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
//      renderer/meshvertexbuffer.js : Static mesh VBO management             //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Default vertex buffer normals                                             //
////////////////////////////////////////////////////////////////////////////////
var defaultNormals = new GLArrayDataType([
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0,
    0.0, 0.0, 1.0
]);


////////////////////////////////////////////////////////////////////////////////
//  MeshVertexBuffer class definition                                         //
//  param glPointer : WebGL functions pointer                                 //
////////////////////////////////////////////////////////////////////////////////
function MeshVertexBuffer(glPointer)
{
    // WebGL functions pointer
    this.gl = glPointer;

    // Vertex buffer object
    this.vertexBuffer = null;
    // Element buffer object
    this.elementBuffer = null;

    // Texture coordinates offset
    this.texCoordsOffset = 0;
    // Normals offset
    this.normalsOffset = 0;
    // Tangents offset
    this.tangentsOffset = 0;

    // Geometry data
    this.verticesData = null;
    this.texCoordsData = null;
    this.normalsData = null;
    this.tangentsData = null;
    this.indicesData = null;
    this.vertCount = 0;
}

MeshVertexBuffer.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init vertex buffer object                                      //
    //  param vertCount : Vertices count                                      //
    //  param vertices : Vertices                                             //
    //  param texcoords : Texture coordinates                                 //
    //  param normals : Normals                                               //
    //  param indices : Triangles indices                                     //
    ////////////////////////////////////////////////////////////////////////////
    init: function(vertCount, vertices, texcoords, normals, indices)
    {
        // Check gl pointer
        if (!this.gl)
        {
            return false;
        }

        // Check vertex buffer data
        if ((vertCount > 0) && vertices && texcoords && normals && indices)
        {
            // Set vertex buffer data
            this.vertCount = vertCount;
            this.verticesData = vertices;
            this.texCoordsData = texcoords;
            this.normalsData = normals;
            this.indicesData = indices;
        }
        else
        {
            // Set default data
            this.vertCount = 6;
            this.verticesData = defaultVertices;
            this.texCoordsData = defaultTexCoords;
            this.normalsData = defaultNormals;
            this.indicesData = defaultIndices;
        }

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

        // Compute tangents
        this.computeTangents();

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
    //  computeTangents : Compute faces tangents                              //
    ////////////////////////////////////////////////////////////////////////////
    computeTangents: function()
    {
        var i = 0;
        this.tangentsData = new GLArrayDataType(this.verticesData.length);
        for (i = 0; i < this.indicesData.length; i += 3)
        {
            var edge1x = this.verticesData[(this.indicesData[i+1]*3)] -
                this.verticesData[(this.indicesData[i]*3)];
            var edge1y = this.verticesData[(this.indicesData[i+1]*3)+1] -
                this.verticesData[(this.indicesData[i]*3)+1];
            var edge1z = this.verticesData[(this.indicesData[i+1]*3)+2] -
                this.verticesData[(this.indicesData[i]*3)+2];
            var edge2x = this.verticesData[(this.indicesData[i+2]*3)] -
                this.verticesData[(this.indicesData[i]*3)];
            var edge2y = this.verticesData[(this.indicesData[i+2]*3)+1] -
                this.verticesData[(this.indicesData[i]*3)+1];
            var edge2z = this.verticesData[(this.indicesData[i+2]*3)+2] -
                this.verticesData[(this.indicesData[i]*3)+2];
            var uv1x = this.texCoordsData[(this.indicesData[i+1]*2)] -
                this.texCoordsData[(this.indicesData[i]*2)];
            var uv1y = this.texCoordsData[(this.indicesData[i+1]*2)+1] -
                this.texCoordsData[(this.indicesData[i]*2)+1];
            var uv2x = this.texCoordsData[(this.indicesData[i+2]*2)] -
                this.texCoordsData[(this.indicesData[i]*2)];
            var uv2y = this.texCoordsData[(this.indicesData[i+2]*2)+1] -
                this.texCoordsData[(this.indicesData[i]*2)+1];
            var det = ((uv1x * uv2y) - (uv2x * uv1y));
            var inv = 0.0;
            if (det != 0.0) inv = 1.0/det;
            this.tangentsData[(i*3)] = inv * ((uv2y*edge1x) - (uv1y*edge2x));
            this.tangentsData[(i*3)+1] = inv * ((uv2y*edge1y) - (uv1y*edge2y));
            this.tangentsData[(i*3)+2] = inv * ((uv2y*edge1z) - (uv1y*edge2z));
            this.tangentsData[(i*3)+3] = this.tangentsData[(i*3)];
            this.tangentsData[(i*3)+4] = this.tangentsData[(i*3)+1];
            this.tangentsData[(i*3)+5] = this.tangentsData[(i*3)+2];
            this.tangentsData[(i*3)+6] = this.tangentsData[(i*3)];
            this.tangentsData[(i*3)+7] = this.tangentsData[(i*3)+1];
            this.tangentsData[(i*3)+8] = this.tangentsData[(i*3)+2];
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateBuffer : Update vertex buffer object                            //
    ////////////////////////////////////////////////////////////////////////////
    updateBuffer: function()
    {
        // Send data to GPU
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.texCoordsOffset = this.verticesData.byteLength;
        this.normalsOffset = this.texCoordsOffset+this.texCoordsData.byteLength;
        this.tangentsOffset = this.normalsOffset+this.normalsData.byteLength;
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            this.tangentsOffset+this.tangentsData.byteLength,
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

        // Send normals data
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            this.normalsOffset,
            this.normalsData
        );

        // Send tangents data
        this.gl.bufferSubData(
            this.gl.ARRAY_BUFFER,
            this.tangentsOffset,
            this.tangentsData
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
    //  param quality : Shader program quality                                //
    ////////////////////////////////////////////////////////////////////////////
    render: function(shader, quality)
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

        // High quality
        if (quality >= WOSRendererQualityHigh)
        {
            // Enable normals array
            this.gl.enableVertexAttribArray(shader.normalsLocation);
            this.gl.vertexAttribPointer(
                shader.normalsLocation, 3,
                this.gl.FLOAT, this.gl.FALSE,
                0, this.normalsOffset
            );

            // Enable tangents array
            this.gl.enableVertexAttribArray(shader.tangentsLocation);
            this.gl.vertexAttribPointer(
                shader.tangentsLocation, 3,
                this.gl.FLOAT, this.gl.FALSE,
                0, this.tangentsOffset
            );
        }

        // Draw triangles
        this.gl.drawElements(
            this.gl.TRIANGLES,
            this.vertCount,
            this.gl.UNSIGNED_SHORT, 0
        );
    }
};
