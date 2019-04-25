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
//      renderer/animsprite.js : Animated sprite management                   //
////////////////////////////////////////////////////////////////////////////////


function AnimSprite(renderer)
{
    this.loaded = false;
    this.renderer = renderer;
    this.vertexBuffer = null;
    this.texture = null;
    this.modelMatrix = null;
    this.usize = 1.0;
    this.vsize = 1.0;
    this.countX = 1;
    this.countY = 1;
    this.timing = 0.1;
    this.currentX = 0;
    this.currentY = 0;
    this.currentTime = 0.0;
}

AnimSprite.prototype = {
    init: function(tex, usize, vsize, countX, countY, timing)
    {
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        if (usize !== undefined) { this.usize = usize; }
        if (vsize !== undefined) { this.vsize = vsize; }
        if (countX !== undefined) { this.countX = countX; }
        if (countY !== undefined) { this.countY = countY; }
        if (timing !== undefined) { this.timing = timing; }
        this.currentX = 0;
        this.currentY = 0;
        this.currentTime = 0.0;

        // Check gl pointer
        if (!this.renderer.gl)
        {
            return false;
        }

        // Create model matrix
        this.modelMatrix = new Matrix4x4();

        // Create vbo
        this.vertexBuffer = new VertexBuffer(this.renderer.gl);
        if (!this.vertexBuffer)
        {
            // Could not create vbo
            return false;
        }
        if (!this.vertexBuffer.init())
        {
            // Could not init vbo
            return false;
        }

        // Set texture
        this.texture = tex;
        if (!this.texture)
        {
            // Could not set texture
            return false;
        }

        // Update vertex buffer     
        this.vertexBuffer.setPlane(
            this.texture.width*this.usize, this.texture.height*this.vsize
        );
        this.vertexBuffer.updateTexcoords(
            0.0, 1.0-this.vsize, this.usize, 1.0
        );

        // Sprite loaded
        this.loaded = true;
        return true;
    },

    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
    },

    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    compute: function(frametime)
    {
        this.currentTime += frametime;
        if (this.currentTime >= this.timing)
        {
            // Compute frame offset
            if (this.currentX < (this.countX-1))
            {
                ++this.currentX;
            }
            else
            {
                if (this.currentY < (this.countY-1))
                {
                    this.currentX = 0;
                    ++this.currentY;
                }
                else
                {
                    this.currentX = 0;
                    this.currentY = 0;
                }
            }

            // Update vertex buffer     
            this.vertexBuffer.updateTexcoords(
                this.currentX*this.usize, 1.0-((this.currentY+1)*this.vsize),
                (this.currentX+1)*this.usize, 1.0-(this.currentY*this.vsize)
            );

            // Reset timer
            this.currentTime = 0.0;
        }
    },

    render: function()
    {
        if (this.loaded)
        {
            // Bind shader
            this.renderer.shader.bind();

            // Send shader uniforms
            this.renderer.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.renderer.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.renderer.shader.sendModelMatrix(this.modelMatrix);

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.draw();
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind shader
            this.renderer.shader.unbind();
        }
    }
};

