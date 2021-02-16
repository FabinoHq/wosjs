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
//      renderer/rect.js : Rect rendering management                          //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Rect class definition                                                     //
//  param renderer : Renderer pointer                                         //
//  param rectShader : Rect shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function Rect(renderer, rectShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Rect shader pointer
    this.rectShader = rectShader;

    // Rect shader uniforms locations
    this.colorUniform = -1;
    this.alphaUniform = -1;
    this.widthUniform = -1;
    this.heightUniform = -1;
    this.thicknessUniform = -1;

    // Rect model matrix
    this.modelMatrix = null;

    // Rect position
    this.position = null;
    // Rect size
    this.size = null;
    // Rect rotation angle
    this.angle = 0.0;
    // Rect color
    this.color = null;
    // Rect alpha
    this.alpha = 1.0;
    // Rect thickness
    this.thickness = 0.01;
}

Rect.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init rect                                                      //
    //  param thickness : Rect borders thickness                              //
    //  param width : Rect width                                              //
    //  param height : Rect height                                            //
    ////////////////////////////////////////////////////////////////////////////
    init: function(thickness, width, height)
    {
        // Reset rect
        this.colorUniform = -1;
        this.alphaUniform = -1;
        this.widthUniform = -1;
        this.heightUniform = -1;
        this.thicknessUniform = -1;
        this.modelMatrix = null;
        this.position = new Vector2(0.0, 0.0);
        this.size = new Vector2(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angle = 0.0;
        this.color = new Vector3(1.0, 1.0, 1.0);
        this.alpha = 1.0;
        this.thickness = 0.01;
        if (thickness !== undefined) this.thickness = thickness;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check rect shader pointer
        if (!this.rectShader) return false;

        // Get rect shader uniforms locations
        this.rectShader.bind();
        this.colorUniform = this.rectShader.getUniform("color");
        this.alphaUniform = this.rectShader.getUniform("alpha");
        this.widthUniform = this.rectShader.getUniform("width");
        this.heightUniform = this.rectShader.getUniform("height");
        this.thicknessUniform = this.rectShader.getUniform("thickness");
        this.rectShader.unbind();

        // Create model matrix
        this.modelMatrix = new Matrix4x4();
        if (!this.modelMatrix) return false;

        // Rect loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set rect position                                       //
    //  param x : Rect X position                                             //
    //  param y : Rect Y position                                             //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set rect position from a 2 components vector        //
    //  param vector : 2 components vector to set rect position from          //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set rect X position                                            //
    //  param x : Rect X position                                             //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set rect Y position                                            //
    //  param y : Rect Y position                                             //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate rect                                                 //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate rect with a 2 components vector                      //
    //  param vector : 2 components vector to translate rect with             //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate rect on X axis                                      //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate rect on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set rect size                                               //
    //  param width : Rect width to set                                       //
    //  param height : Rect height to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set rect size from a 2 components vector                    //
    //  param vector : Vector to set rect size from                           //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set rect width                                             //
    //  param width : Rect width to set                                       //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set rect height                                           //
    //  param height : Rect height to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set rect rotation angle                                    //
    //  param angle : Rect rotation angle                                     //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angle)
    {
        this.angle = angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate rect                                                  //
    //  param angle : Angle to rotate rect by in degrees                      //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angle)
    {
        this.angle += angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColor : Set rect color                                             //
    //  param r : Rect red color channel to set                               //
    //  param g : Rect blue color channel to set                              //
    //  param b : Rect green color channel to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b)
    {
        this.color.vec[0] = r;
        this.color.vec[1] = g;
        this.color.vec[2] = b;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec3 : Set rect color from a 3 components vector              //
    //  param color : 3 components vector to set rect color from              //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec3: function(color)
    {
        this.color.vec[0] = color.vec[0];
        this.color.vec[1] = color.vec[1];
        this.color.vec[2] = color.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set rect alpha                                             //
    //  param alpha : Rect alpha to set                                       //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setThickness : Set rect thickness                                     //
    //  param thickness : Rect thickness to set                               //
    ////////////////////////////////////////////////////////////////////////////
    setThickness: function(thickness)
    {
        this.thickness = thickness;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get rect X position                                            //
    //  return : Rect X position                                              //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get rect Y position                                            //
    //  return : Rect Y position                                              //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get rect width                                             //
    //  return : Rect width                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get rect height                                           //
    //  return : Rect height                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get rect rotation angle                                    //
    //  return : Rect rotation angle in degrees                               //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angle;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get rect alpha                                             //
    //  return : Rect alpha                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getThickness : Get rect thickness                                     //
    //  return : Rect thickness                                               //
    ////////////////////////////////////////////////////////////////////////////
    getThickness: function()
    {
        return this.thickness;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render rect                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set rect model matrix
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

        // Bind rect shader
        this.rectShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setIdentity();
        this.renderer.worldMatrix.multiply(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send rect shader uniforms
        this.rectShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.rectShader.sendUniformVec3(this.colorUniform, this.color);
        this.rectShader.sendUniform(this.alphaUniform, this.alpha);
        this.rectShader.sendUniform(this.widthUniform, this.size.vec[0]);
        this.rectShader.sendUniform(this.heightUniform, this.size.vec[1]);
        this.rectShader.sendUniform(this.thicknessUniform, this.thickness);

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.rectShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind rect shader
        this.rectShader.unbind();
    }
};

