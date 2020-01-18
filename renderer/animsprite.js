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


////////////////////////////////////////////////////////////////////////////////
//  AnimSprite class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function AnimSprite(renderer)
{
    // Animated sprite loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Animated sprite VBO
    this.vertexBuffer = null;
    // Animated sprite texture
    this.texture = null;
    // Animated sprite model matrix
    this.modelMatrix = null;
    // Animated sprite alpha
    this.alpha = 1.0;

    // Animated sprite size
    this.width = 1.0;
    this.height = 1.0;
    // Animated sprite frame count
    this.countX = 1;
    this.countY = 1;
    // Animated sprite frametime in seconds
    this.frametime = 1.0;

    // Animated sprite current states
    this.currentX = 0;
    this.currentY = 0;
    this.currentTime = 0.0;
    this.interTime = 0.0;
    this.interpolation = true;
}

AnimSprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init animated sprite                                           //
    //  param tex : Texture pointer                                           //
    //  param width : Animated sprite width                                   //
    //  param height : Animated sprite height                                 //
    //  param countX : Animated sprite frames count in U texture axis         //
    //  param countY : Animated sprite frames count in V texture axis         //
    //  param frametime : Animated sprite frametime in seconds                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, width, height, countX, countY, frametime, interpolation)
    {
        // Reset animated sprite
        this.loaded = false;
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        if (width !== undefined) { this.width = width; }
        if (height !== undefined) { this.height = height; }
        if (countX !== undefined) { this.countX = countX; }
        if (countY !== undefined) { this.countY = countY; }
        if (frametime !== undefined) { this.frametime = frametime; }
        if (interpolation !== undefined) { this.interpolation = interpolation; }
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
        this.vertexBuffer.setPlane(this.width, this.height);

        // Sprite loaded
        this.loaded = true;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set sprite size                                             //
    //  param width : Sprite width to set                                     //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        // Update vertex buffer
        if (width !== undefined) { this.width = width; }
        if (height !== undefined) { this.height = height; }
        this.vertexBuffer.setPlane(this.width, this.height);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get sprite width                                           //
    //  return : Sprite width                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get sprite height                                         //
    //  return : Sprite height                                                //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetMatrix : Reset animated sprite model matrix                      //
    ////////////////////////////////////////////////////////////////////////////
    resetMatrix: function()
    {
        this.modelMatrix.setIdentity();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMatrix : Set animated sprite model matrix                          //
    //  param modelMatrix : Animated sprite model matrix                      //
    ////////////////////////////////////////////////////////////////////////////
    setMatrix: function(modelMatrix)
    {
        this.modelMatrix = modelMatrix;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set animated sprite alpha                                  //
    //  param alpha : Animated sprite alpha to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate animated sprite on X axis                           //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.modelMatrix.translateX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate animated sprite on Y axis                           //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.modelMatrix.translateY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate animated sprite                                       //
    //  param angle : Angle to rotate in degrees                              //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.modelMatrix.rotateZ(-angle);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleX : Scale animated sprite along the X axis                       //
    //  param scaleX : X factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleX: function(scaleX)
    {
        this.modelMatrix.scaleX(scaleX);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  scaleY : Scale animated sprite along the Y axis                       //
    //  param scaleY : Y factor to scale to                                   //
    ////////////////////////////////////////////////////////////////////////////
    scaleY: function(scaleY)
    {
        this.modelMatrix.scaleY(scaleY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render animated sprite                                       //
    //  param frametime : Frametime for animation update                      //
    ////////////////////////////////////////////////////////////////////////////
    render: function(frametime)
    {
        if (this.loaded)
        {
            // Bind default shader
            this.renderer.shader.bind();

            // Send shader uniforms
            this.renderer.shader.sendProjectionMatrix(this.renderer.projMatrix);
            this.renderer.shader.sendViewMatrix(this.renderer.view.viewMatrix);
            this.renderer.shader.sendModelMatrix(this.modelMatrix);
            this.renderer.shader.sendAlphaValue(this.alpha);

            // Bind texture
            this.texture.bind();

            // Render VBO
            this.vertexBuffer.bind();
            this.vertexBuffer.render(this.renderer.shader);
            this.vertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind default shader
            this.renderer.shader.unbind();
        }
    }
};

