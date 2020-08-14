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
//      renderer/procsprite.js : Procedural sprite management                 //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  ProcSprite class definition                                               //
////////////////////////////////////////////////////////////////////////////////
function ProcSprite(renderer)
{
    // Renderer pointer
    this.renderer = renderer;

    // Procedural sprite shader
    this.shader = null;
    // Procedural sprite model matrix
    this.modelMatrix = null;

    // Procedural sprite shader uniforms locations
    this.alphaUniform = -1;
    this.timeUniform = -1;
    this.offsetUniform = -1;

    // Procedural sprite position
    this.position = null;
    // Procedural sprite size
    this.size = null;
    // Procedural sprite rotation angle
    this.angle = 0.0;
    // Procedural sprite offset
    this.offset = null;
    // Procedural sprite time
    this.time = 0.0;
    // Procedural sprite alpha
    this.alpha = 1.0;
}

ProcSprite.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init procedural sprite                                         //
    //  param shaderSrc : Procedural sprite fragment shader source            //
    //  param width : Procedural sprite width                                 //
    //  param height : Procedural sprite height                               //
    ////////////////////////////////////////////////////////////////////////////
    init: function(shaderSrc, width, height)
    {
        // Reset procedural sprite
        this.shader = null;
        this.modelMatrix = null;
        this.alphaUniform = -1;
        this.timeUniform = -1;
        this.offsetUniform = -1;
        this.position = new Vector2(0.0, 0.0);
        this.size = new Vector2(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angle = 0.0;
        this.offset = new Vector2(0.0, 0.0);
        this.time = 0.0;
        this.alpha = 1.0;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Create model matrix
        this.modelMatrix = new Matrix4x4();

        // Init shader
        this.shader = new Shader(this.renderer.gl);
        if (!this.shader) return false;
        if (!this.shader.init(defaultVertexShaderSrc, shaderSrc)) return false;

        // Get uniforms locations
        this.shader.bind();
        this.alphaUniform = this.shader.getUniform("alpha");
        this.timeUniform = this.shader.getUniform("time");
        this.offsetUniform = this.shader.getUniform("offset");
        this.shader.unbind();

        // Procedural sprite loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set procedural sprite position                          //
    //  param x : Procedural sprite X position                                //
    //  param y : Procedural sprite Y position                                //
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
    //  setX : Set procedural sprite X position                               //
    //  param x : Procedural sprite X position                                //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set procedural sprite Y position                               //
    //  param y : Procedural sprite Y position                                //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate procedural sprite                                    //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate procedural sprite by a 2 components vector       //
    //  param vector : 2 components vector to translate procedural sprite by  //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate procedural sprite on X axis                         //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate procedural sprite on Y axis                         //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set procedural sprite size                                  //
    //  param width : Procedural sprite width to set                          //
    //  param height : Procedural sprite height to set                        //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set procedural sprite size from a 2 components vector   //
    //  param vector : 2 components vector to set procedural sprite size from //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set procedural sprite width                                //
    //  param width : Procedural sprite width to set                          //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set procedural sprite height                              //
    //  param height : Procedural sprite height to set                        //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set procedural sprite rotation angle                       //
    //  param angle : Procedural sprite rotation angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate procedural sprite                                     //
    //  param angle : Angle to rotate procedural sprite by in degrees         //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffset : Set procedural sprite offset                              //
    //  param x : Procedural sprite X offset to set                           //
    //  param y : Procedural sprite Y offset to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setOffset: function(x, y)
    {
        this.offset.vec[0] = x;
        this.offset.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetVec2 : Set procedural offset from a 2 components vector      //
    //  param vector : 2 components vector to set procedural offset from      //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetVec2: function(vector)
    {
        this.offset.vec[0] = vector.vec[0];
        this.offset.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetX : Set procedural sprite X offset                           //
    //  param x : Procedural sprite X offset to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetX: function(x)
    {
        this.offset.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetY : Set procedural sprite Y offset                           //
    //  param y : Procedural sprite Y offset to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetY: function(y)
    {
        this.offset.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTime : Set procedural sprite time                                  //
    //  param time : Procedural sprite time to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setTime: function(time)
    {
        this.time = time;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set procedural sprite alpha                                //
    //  param alpha : Procedural sprite alpha to set                          //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get procedural sprite X position                               //
    //  return : Procedural sprite X position                                 //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get procedural sprite Y position                               //
    //  return : Procedural sprite Y position                                 //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get procedural sprite width                                //
    //  return : Procedural sprite width                                      //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get procedural sprite height                              //
    //  return : Procedural sprite height                                     //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get procedural sprite rotation angle                       //
    //  return : Procedural sprite rotation angle in degrees                  //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOffsetX : Get procedural sprite offset X position                  //
    //  return : Procedural sprite offset X position                          //
    ////////////////////////////////////////////////////////////////////////////
    getOffsetX: function()
    {
        return this.offset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOffsetY : Get procedural sprite offset Y position                  //
    //  return : Procedural sprite offset Y position                          //
    ////////////////////////////////////////////////////////////////////////////
    getOffsetY: function()
    {
        return this.offset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTime : Get procedural sprite time                                  //
    //  return : Procedural sprite time                                       //
    ////////////////////////////////////////////////////////////////////////////
    getTime: function()
    {
        return this.time;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get procedural sprite alpha                                //
    //  return : Procedural sprite alpha                                      //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render procedural sprite                                     //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set procedural sprite model matrix
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

        // Bind procedural shader
        this.shader.bind();

        // Send shader uniforms
        this.shader.sendProjectionMatrix(this.renderer.projMatrix);
        this.shader.sendViewMatrix(this.renderer.view.viewMatrix);
        this.shader.sendModelMatrix(this.modelMatrix);
        this.shader.sendUniform(this.alphaUniform, this.alpha);
        this.shader.sendUniform(this.timeUniform, this.time);
        this.shader.sendUniformVec2(this.offsetUniform, this.offset);
        
        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.shader);
        this.renderer.vertexBuffer.unbind();

        // Unbind procedural shader
        this.shader.unbind();
    }
};

