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

    // Line VBO
    this.vertexBuffer = null;
    // Line model matrix
    this.modelMatrix = null;
    // Line alpha
    this.alpha = 1.0;

    // Line origin position
    this.origin = null;
    // Line target position
    this.target = null;
    // Line length
    this.length = 0.0;
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
        var dx = 0.0;
        var dy = 0.0;

        // Reset line
        this.vertexBuffer = null;
        this.texture = null;
        this.modelMatrix = null;
        this.alpha = 1.0;
        this.origin = new Vector2(0.0, 0.0);
        this.target = new Vector2(0.0, 0.0);
        if (originX !== undefined) { this.origin.setX(originX); }
        if (originY !== undefined) { this.origin.setY(originY); }
        if (targetX !== undefined) { this.target.setX(targetX); }
        if (targetY !== undefined) { this.target.setY(targetY); }
        dx = this.target.getX()-this.origin.getX();
        dy = this.target.getY()-this.origin.getY();
        this.length = Math.sqrt(dx*dx+dy*dy);
        this.thickness = 0.01;
        if (thickness !== undefined) { this.thickness = thickness; }

        // Check gl pointer
        if (!this.renderer.gl)
        {
            return false;
        }

        // Check line shader pointer
        if (!this.lineShader)
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

        // Update vbo
        this.vertexBuffer.setPlane2D(1.0, 1.0);

        // Line loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getLength : Get line length                                           //
    //  return : Line length                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getLength: function()
    {
        return this.length;
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
    //  setOrigin : Set line origin position                                  //
    ////////////////////////////////////////////////////////////////////////////
    setOrigin: function(originX, originY)
    {
        this.origin.setXY(originX, originY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTarget : Set line target position                                  //
    ////////////////////////////////////////////////////////////////////////////
    setTarget: function(targetX, targetY)
    {
        this.target.setXY(targetX, targetY);
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
        this.origin.addXY(x, y);
        this.target.addXY(x, y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate line on X axis                                      //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.origin.addX(x);
        this.target.addX(x);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate line on Y axis                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.origin.addY(y);
        this.target.addY(y);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render line                                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Compute line length and angle
        var dx = this.target.getX()-this.origin.getX();
        var dy = this.target.getY()-this.origin.getY();
        var angle = Math.atan2(dy, dx);
        var degAngle = -((angle/Math.PI)*180.0);
        var crossX = Math.sin(angle)*this.thickness*0.5;
        var crossY = -Math.cos(angle)*this.thickness*0.5;
        var offsetX = Math.cos(angle)*this.smoothness*0.5*this.thickness;
        var offsetY = Math.sin(angle)*this.smoothness*0.5*this.thickness;
        var ratio = this.length+this.smoothness*this.thickness;
        if (this.thickness > 0.0)
        {
            ratio = (this.length+this.smoothness*this.thickness)/this.thickness;
        }
        this.length = Math.sqrt(dx*dx+dy*dy);

        // Set line model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translate(
            this.origin.getX()+crossX-offsetX,
            this.origin.getY()+crossY-offsetY, 0.0
        );
        this.modelMatrix.rotateZ(degAngle);
        this.modelMatrix.scale(
            this.length+this.smoothness*this.thickness,
            this.thickness, 0.0
        );

        // Bind line shader
        this.lineShader.shader.bind();

        // Send line shader uniforms
        this.lineShader.shader.sendProjectionMatrix(this.renderer.projMatrix);
        this.lineShader.shader.sendViewMatrix(this.renderer.view.viewMatrix);
        this.lineShader.shader.sendModelMatrix(this.modelMatrix);
        this.lineShader.shader.sendUniform(
            this.lineShader.alphaUniform, this.alpha
        );
        this.lineShader.shader.sendUniform(
            this.lineShader.ratioUniform, ratio
        );
        this.lineShader.shader.sendUniform(
            this.lineShader.smoothUniform, this.smoothness
        );
        
        // Render VBO
        this.vertexBuffer.bind();
        this.vertexBuffer.render(this.lineShader.shader);
        this.vertexBuffer.unbind();

        // Unbind line shader
        this.lineShader.shader.unbind();
    }
};

