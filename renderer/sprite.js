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
//      renderer/sprite.js : Sprite management                                //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Sprite class definition                                                   //
//  param renderer : Renderer pointer                                         //
//  param spriteShader : Sprite shader pointer                                //
////////////////////////////////////////////////////////////////////////////////
function Sprite(renderer, spriteShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Sprite shader pointer
    this.spriteShader = spriteShader;

    // Sprite shader uniforms locations
    this.alphaUniform = -1;
    this.uvSizeUniform = -1;
    this.uvOffsetUniform = -1;

    // Sprite texture
    this.texture = null;
    // Sprite model matrix
    this.modelMatrix = null;

    // Sprite position
    this.position = null;
    // Sprite size
    this.size = null;
    // Sprite rotation angle
    this.angle = 0.0;
    // Sprite texture UV size
    this.uvSize = null;
    // Sprite texture UV offset
    this.uvOffset = null;
    // Sprite alpha
    this.alpha = 1.0;
}

Sprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init sprite                                                    //
    //  param texture : Texture pointer                                       //
    //  param width : Sprite width                                            //
    //  param height : Sprite height                                          //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height)
    {
        // Reset sprite
        this.alphaUniform = -1;
        this.uvSizeUniform = -1;
        this.uvOffsetUniform = -1;
        this.texture = null;
        this.modelMatrix = null;
        this.position = new Vector2(0.0, 0.0);
        this.size = new Vector2(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angle = 0.0;
        this.uvSize = new Vector2(1.0, 1.0);
        this.uvOffset = new Vector2(0.0, 0.0);
        this.alpha = 1.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check sprite shader pointer
        if (!this.spriteShader) return false;

        // Get sprite shader uniforms locations
        this.spriteShader.bind();
        this.alphaUniform = this.spriteShader.getUniform("alpha");
        this.uvOffsetUniform = this.spriteShader.getUniform("uvOffset");
        this.uvSizeUniform = this.spriteShader.getUniform("uvSize");
        this.spriteShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Create model matrix
        this.modelMatrix = new Matrix4x4();
        if (!this.modelMatrix) return false;

        // Sprite loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set sprite position                                     //
    //  param x : Sprite X position                                           //
    //  param y : Sprite Y position                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set sprite position from a 2 components vector      //
    //  param vector : 2 components vector to set sprite position from        //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set sprite X position                                          //
    //  param x : Sprite X position                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set sprite Y position                                          //
    //  param y : Sprite Y position                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate sprite                                               //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate sprite by a 2 components vector                  //
    //  param vector : 2 components vector to translate sprite by             //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate sprite on X axis                                    //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate sprite on Y axis                                    //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set sprite size                                             //
    //  param width : Sprite width to set                                     //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set sprite size from a 2 components vector              //
    //  param vector : 2 components vector to set sprite size from            //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set sprite width                                           //
    //  param width : Sprite width to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set sprite height                                         //
    //  param height : Sprite height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set sprite rotation angle                                  //
    //  param angle : Sprite rotation angle to set in degrees                 //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate sprite                                                //
    //  param angle : Angle to rotate sprite by in degrees                    //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setUVSize : Set sprite render subrectangle size                       //
    //  param usize : Sprite texture U size                                   //
    //  param vsize : Sprite texture V size                                   //
    ////////////////////////////////////////////////////////////////////////////
    setUVSize: function(usize, vsize)
    {
        this.uvSize.vec[0] = usize;
        this.uvSize.vec[1] = vsize;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSubrect : Set sprite render subrectangle offset                    //
    //  param uoffset : Sprite texture U offset                               //
    //  param voffset : Sprite texture V offset                               //
    ////////////////////////////////////////////////////////////////////////////
    setUVOffset: function(uoffset, voffset)
    {
        this.uvOffset.vec[0] = uoffset;
        this.uvOffset.vec[1] = voffset;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSubrect : Set sprite render subrectangle                           //
    //  param usize : Sprite texture U size                                   //
    //  param vsize : Sprite texture V size                                   //
    //  param uoffset : Sprite texture U offset                               //
    //  param voffset : Sprite texture V offset                               //
    ////////////////////////////////////////////////////////////////////////////
    setSubrect: function(usize, vsize, uoffset, voffset)
    {
        this.uvSize.vec[0] = usize;
        this.uvSize.vec[1] = vsize;
        this.uvOffset.vec[0] = uoffset;
        this.uvOffset.vec[1] = voffset;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set sprite alpha                                           //
    //  param alpha : Sprite alpha to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get sprite X position                                          //
    //  return : Sprite X position                                            //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get sprite Y position                                          //
    //  return : Sprite Y position                                            //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get sprite width                                           //
    //  return : Sprite width                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get sprite height                                         //
    //  return : Sprite height                                                //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get sprite rotation angle                                  //
    //  return : Sprite rotation angle in degrees                             //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVWidth : Get sprite render subrectangle width                     //
    //  return : Sprite render subrectangle width                             //
    ////////////////////////////////////////////////////////////////////////////
    getUVWidth: function()
    {
        return this.uvSize.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVHeight : Get sprite render subrectangle height                   //
    //  return : Sprite render subrectangle height                            //
    ////////////////////////////////////////////////////////////////////////////
    getUVHeight: function()
    {
        return this.uvSize.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVWidth : Get sprite render subrectangle X offset                  //
    //  return : Sprite render subrectangle X offset                          //
    ////////////////////////////////////////////////////////////////////////////
    getUVOffsetX: function()
    {
        return this.uvOffset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVHeight : Get sprite render subrectangle Y offset                 //
    //  return : Sprite render subrectangle Y offset                          //
    ////////////////////////////////////////////////////////////////////////////
    getUVOffsetY: function()
    {
        return this.uvOffset.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get sprite alpha                                           //
    //  return : Sprite alpha                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render sprite                                                //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set sprite model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.translate(
            this.size.vec[0]*0.5, this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.rotateZ(this.angle);
        this.modelMatrix.translate(
            -this.size.vec[0]*0.5, -this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.scaleVec2(this.size);

        // Bind sprite shader
        this.spriteShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setIdentity();
        this.renderer.worldMatrix.multiply(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.spriteShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.spriteShader.sendUniform(this.alphaUniform, this.alpha);
        this.spriteShader.sendUniformVec2(this.uvOffsetUniform, this.uvOffset);
        this.spriteShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.spriteShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind sprite shader
        this.spriteShader.unbind();
    }
};

