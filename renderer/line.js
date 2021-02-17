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
//      renderer/line.js : Line rendering management                          //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Line class definition                                                     //
//  param renderer : Renderer pointer                                         //
//  param lineShader : Line shader pointer                                    //
////////////////////////////////////////////////////////////////////////////////
function Line(renderer, lineShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Line shader pointer
    this.lineShader = lineShader;

    // Line shader uniforms locations
    this.colorUniform = -1;
    this.alphaUniform = -1;
    this.ratioUniform = -1;
    this.smoothUniform = -1;

    // Line model matrix
    this.modelMatrix = new Matrix4x4();

    // Line origin position
    this.origin = new Vector2(0.0, 0.0);
    // Line target position
    this.target = new Vector2(1.0, 1.0);
     // Line color
    this.color = new Vector3(1.0, 1.0, 1.0);
    // Line alpha
    this.alpha = 1.0;
    // Line thickness
    this.thickness = 0.01;
    // Line smoothness
    this.smoothness = 0.0;
}

Line.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init line                                                      //
    //  param originX : Line origin X position                                //
    //  param originY : Line origin Y position                                //
    //  param targetX : Line target X position                                //
    //  param targetY : Line target Y position                                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(thickness, originX, originY, targetX, targetY)
    {
        // Reset line
        var dx = 0.0;
        var dy = 0.0;
        var length = 0.0;
        this.colorUniform = -1;
        this.alphaUniform = -1;
        this.ratioUniform = -1;
        this.smoothUniform = -1;
        this.modelMatrix.setIdentity();
        this.origin.reset();
        this.target.setXY(1.0, 1.0);
        if (originX !== undefined) this.origin.vec[0] = originX;
        if (originY !== undefined) this.origin.vec[1] = originY;
        if (targetX !== undefined) this.target.vec[0] = targetX;
        if (targetY !== undefined) this.target.vec[1] = targetY;
        dx = this.target.vec[0]-this.origin.vec[0];
        dy = this.target.vec[1]-this.origin.vec[1];
        length = Math.sqrt(dx*dx+dy*dy);
        this.color.setXYZ(1.0, 1.0, 1.0);
        this.alpha = 1.0;
        this.thickness = 0.01;
        if (thickness !== undefined) this.thickness = thickness;
        this.smoothness = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check line shader pointer
        if (!this.lineShader) return false;

        // Get line shader uniforms locations
        this.lineShader.bind();
        this.colorUniform = this.lineShader.getUniform("color");
        this.alphaUniform = this.lineShader.getUniform("alpha");
        this.ratioUniform = this.lineShader.getUniform("ratio");
        this.smoothUniform = this.lineShader.getUniform("smooth");
        this.lineShader.unbind();

        // Line loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOrigin : Set line origin position                                  //
    //  param originX : Line origin X position                                //
    //  param originY : Line origin Y position                                //
    ////////////////////////////////////////////////////////////////////////////
    setOrigin: function(originX, originY)
    {
        this.origin.vec[0] = originX;
        this.origin.vec[1] = originY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOriginVec2 : Set line origin position from a 2 components vector   //
    //  param vector : Line origin position vector                            //
    ////////////////////////////////////////////////////////////////////////////
    setOriginVec2: function(vector)
    {
        this.origin.vec[0] = vector.vec[0];
        this.origin.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOriginX : Set line origin X position                               //
    //  param originX : Line origin X position                                //
    ////////////////////////////////////////////////////////////////////////////
    setOriginX: function(originX)
    {
        this.origin.vec[0] = originX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOriginY : Set line origin Y position                               //
    //  param originX : Line origin Y position                                //
    ////////////////////////////////////////////////////////////////////////////
    setOriginY: function(originY)
    {
        this.origin.vec[1] = originY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTarget : Set line target position                                  //
    //  param targetX : Line target X position                                //
    //  param targetY : Line target Y position                                //
    ////////////////////////////////////////////////////////////////////////////
    setTarget: function(targetX, targetY)
    {
        this.target.vec[0] = targetX;
        this.target.vec[1] = targetY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTargetVec2 : Set line target position from a 2 components vector   //
    //  param vector : Line target position vector                            //
    ////////////////////////////////////////////////////////////////////////////
    setTargetVec2: function(vector)
    {
        this.target.vec[0] = vector.vec[0];
        this.target.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTargetX : Set line target X position                               //
    //  param targetX : Line target X position                                //
    ////////////////////////////////////////////////////////////////////////////
    setTargetX: function(targetX)
    {
        this.target.vec[0] = targetX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTargetY : Set line target Y position                               //
    //  param originX : Line target Y position                                //
    ////////////////////////////////////////////////////////////////////////////
    setTargetY: function(targetY)
    {
        this.target.vec[1] = targetY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColor : Set line color                                             //
    //  param r : Line red color channel to set                               //
    //  param g : Line blue color channel to set                              //
    //  param b : Line green color channel to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setColor: function(r, g, b)
    {
        this.color.vec[0] = r;
        this.color.vec[1] = g;
        this.color.vec[2] = b;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setColorVec3 : Set line color from a 3 components vector              //
    //  param color : 3 components vector to set line color from              //
    ////////////////////////////////////////////////////////////////////////////
    setColorVec3: function(color)
    {
        this.color.vec[0] = color.vec[0];
        this.color.vec[1] = color.vec[1];
        this.color.vec[2] = color.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set line alpha                                             //
    //  param alpha : Line alpha to set                                       //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setThickness : Set line thickness                                     //
    //  param thickness : Line thickness to set                               //
    ////////////////////////////////////////////////////////////////////////////
    setThickness: function(thickness)
    {
        this.thickness = thickness;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSmoothness : Set line smoothness                                   //
    //  param smoothness : Line smoothness to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setSmoothness: function(smoothness)
    {
        this.smoothness = smoothness;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate line                                                 //
    //  param x : X axis translate value                                      //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.origin.vec[0] += x;
        this.origin.vec[1] += y;
        this.target.vec[0] += x;
        this.target.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate line by a 2 components vector                    //
    //  param vector : 2 components vector to translate line by               //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.origin.vec[0] += vector.vec[0];
        this.origin.vec[1] += vector.vec[1];
        this.target.vec[0] += vector.vec[0];
        this.target.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate line on X axis                                      //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.origin.vec[0] += x;
        this.target.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate line on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.origin.vec[1] += y;
        this.target.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOriginX : Get line origin X position                               //
    //  return : Line origin X position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getOriginX: function()
    {
        return this.origin.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOriginY : Get line origin Y position                               //
    //  return : Line origin Y position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getOriginY: function()
    {
        return this.origin.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTargetX : Get line target X position                               //
    //  return : Line target X position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getTargetX: function()
    {
        return this.target.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTargetY : Get line target Y position                               //
    //  return : Line target Y position                                       //
    ////////////////////////////////////////////////////////////////////////////
    getTargetY: function()
    {
        return this.target.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getLength : Get line length                                           //
    //  return : Line length                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getLength: function()
    {
        var dx = this.target.vec[0]-this.origin.vec[0];
        var dy = this.target.vec[1]-this.origin.vec[1];
        return Math.sqrt(dx*dx+dy*dy);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get line rotation angle                                    //
    //  return : Line rotation angle                                          //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        var dx = this.target.vec[0]-this.origin.vec[0];
        var dy = this.target.vec[1]-this.origin.vec[1];
        return -((Math.atan2(dy, dx)/Math.PI)*180.0);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get line alpha                                             //
    //  return : Line alpha                                                   //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getThickness : Get line thickness                                     //
    //  return : Line thickness                                               //
    ////////////////////////////////////////////////////////////////////////////
    getThickness: function()
    {
        return this.thickness;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getSmoothness : Get line smoothness                                   //
    //  return : Line smoothness                                              //
    ////////////////////////////////////////////////////////////////////////////
    getSmoothness: function()
    {
        return this.smoothness;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render line                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Compute line length and angle
        var dx = this.target.vec[0]-this.origin.vec[0];
        var dy = this.target.vec[1]-this.origin.vec[1];
        var length = Math.sqrt(dx*dx+dy*dy);
        var angle = Math.atan2(dy, dx);
        var degAngle = -((angle/Math.PI)*180.0);
        var crossX = Math.sin(angle)*this.thickness*0.5;
        var crossY = -Math.cos(angle)*this.thickness*0.5;
        var offsetX = Math.cos(angle)*this.smoothness*0.5*this.thickness;
        var offsetY = Math.sin(angle)*this.smoothness*0.5*this.thickness;
        var ratio = 1.0;
        if (this.thickness > 0.0)
        {
            ratio = (length+this.smoothness*this.thickness)/this.thickness;
        }

        // Set line model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translate(
            this.origin.vec[0]+crossX-offsetX,
            this.origin.vec[1]+crossY-offsetY, 0.0
        );
        this.modelMatrix.rotateZ(degAngle);
        this.modelMatrix.scale(
            length+this.smoothness*this.thickness,
            this.thickness, 0.0
        );

        // Bind line shader
        this.lineShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send line shader uniforms
        this.lineShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.lineShader.sendUniformVec3(this.colorUniform, this.color);
        this.lineShader.sendUniform(this.alphaUniform, this.alpha);
        this.lineShader.sendUniform(this.ratioUniform, ratio);
        this.lineShader.sendUniform(this.smoothUniform, this.smoothness);

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.lineShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind line shader
        this.lineShader.unbind();
    }
};
