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
//      interface/guitogglebutton.js : GUI Toggle button management           //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GuiToggleButton class definition                                          //
//  param renderer : Renderer pointer                                         //
//  param toggleButtonShader : Toggle button shader pointer                   //
////////////////////////////////////////////////////////////////////////////////
function GuiToggleButton(renderer, toggleButtonShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Toggle button shader pointer
    this.toggleButtonShader = toggleButtonShader;

    // Toggle button shader uniforms locations
    this.alphaUniform = null;
    this.stateUniform = null;

    // Toggle button texture
    this.texture = null;
    // Toggle button model matrix
    this.modelMatrix = new Matrix4x4();

    // Toggle button position
    this.position = new Vector2(0.0, 0.0);
    // Toggle button size
    this.size = new Vector2(1.0, 1.0);
    // Toggle button alpha
    this.alpha = 1.0;
    // Toggle button state
    this.buttonState = 0;

    // Round button
    this.isRound = false;

    // VecMat 4x4 model matrix
    this.vecmat = new VecMat4x4();
}

GuiToggleButton.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI Toggle button                                         //
    //  param texture : Texture pointer                                       //
    //  param width : Toggle button width                                     //
    //  param height : Toggle button height                                   //
    //  param round : Round button                                            //
    //  return : True if GUI Toggle button is successfully loaded             //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, round)
    {
        // Reset toggle button
        this.alphaUniform = null;
        this.stateUniform = null;
        this.texture = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        if (round !== undefined) { if (round) this.isRound = true; }
        this.alpha = 1.0;
        this.buttonState = 0;
        if (!this.vecmat) return false;
        this.vecmat.setIdentity();

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check toggle button shader pointer
        if (!this.toggleButtonShader) return false;

        // Get toggle button shader uniforms locations
        this.toggleButtonShader.bind();
        this.alphaUniform = this.toggleButtonShader.getUniform("alpha");
        if (!this.alphaUniform) return false;
        this.stateUniform = this.toggleButtonShader.getUniform("buttonState");
        if (!this.stateUniform) return false;
        this.toggleButtonShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // GUI Toggle button successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set toggle button position                              //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set button position from a 2 components vector      //
    //  param vector : 2 components vector to set button position from        //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set toggle button X position                                   //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set toggle button Y position                                   //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate toggle button                                        //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate toggle button by a 2 components vector           //
    //  param vector : 2 components vector to translate toggle button by      //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate toggle button on X axis                             //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate toggle button on Y axis                             //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set toggle button size                                      //
    //  param width : Toggle toggle button width to set                       //
    //  param height : Toggle toggle button height to set                     //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set toggle button size from a 2 components vector       //
    //  param vector : 2 components vector to set toggle button size from     //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set toggle button width                                    //
    //  param width : Toggle toggle button width to set                       //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set toggle button height                                  //
    //  param height : Toggle toggle button height to set                     //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set toggle button alpha                                    //
    //  param alpha : Toggle toggle button alpha to set                       //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mousePress : Handle mouse press event                                 //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is pressed                                //
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            switch (this.buttonState)
            {
                case 0: case 1: case 2: case 3:
                    this.buttonState = 3;
                    return true;

                case 4: case 5: case 6: case 7:
                    this.buttonState = 7;
                    return true;

                default:
                    this.buttonState = 3;
                    break;
            }
        }
        else
        {
            switch (this.buttonState)
            {
                case 0: case 1: case 2: case 3:
                    this.buttonState = 0;
                    break;

                case 4: case 5: case 6: case 7:
                    this.buttonState = 4;
                    break;

                default:
                    this.buttonState = 0;
                    break;
            }
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is released                               //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            switch (this.buttonState)
            {
                case 0: case 1:
                    this.buttonState = 1;
                    break;

                 case 2: case 3:
                    this.buttonState = 5;
                    return true;

                case 4: case 5:
                    this.buttonState = 5;
                    break;

                 case 6: case 7:
                    this.buttonState = 1;
                    return true;

                default:
                    this.buttonState = 1;
                    break;
            }
        }
        else
        {
            switch (this.buttonState)
            {
                case 0: case 1: case 2: case 3:
                    this.buttonState = 0;
                    break;

                case 4: case 5: case 6: case 7:
                    this.buttonState = 4;
                    break;

                default:
                    this.buttonState = 0;
                    break;
            }
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the button is pressed                                //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        if (this.isPicking(mouseX, mouseY))
        {
            switch (this.buttonState)
            {
                case 0: case 1:
                    this.buttonState = 1;
                    break;

                case 2: case 3:
                    this.buttonState = 3;
                    return true;

                case 4: case 5:
                    this.buttonState = 5;
                    break;

                case 6: case 7:
                    this.buttonState = 7;
                    return true;

                default:
                    this.buttonState = 1;
                    break;
            }
        }
        else
        {
            switch (this.buttonState)
            {
                case 0: case 1:
                    this.buttonState = 0;
                    break;

                case 2: case 3:
                    this.buttonState = 2;
                    return true;

                case 4: case 5:
                    this.buttonState = 4;
                    break;

                case 6: case 7:
                    this.buttonState = 6;
                    return true;

                default:
                    this.buttonState = 0;
                    break;
            }
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPicking : Get toggle button picking state                           //
    //  return : True if the toggle button is picking                         //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            if (this.isRound)
            {
                var rayx = this.size.vec[0]*0.5;
                var rayy = this.size.vec[1]*0.5;
                var dx = (mouseX - (this.position.vec[0] + rayx));
                var dy = (mouseY - (this.position.vec[1] + rayy));
                if (((dx*dx)/(rayx*rayx) + (dy*dy)/(rayy*rayy)) < 1.0)
                {
                    // Toggle button is picking
                    return true;
                }
            }
            else
            {
                // Toggle button is picking
                return true;
            }
        }

        // Toggle button is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get toggle button X position                                   //
    //  return : Toggle button X position                                     //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get toggle button Y position                                   //
    //  return : Toggle button Y position                                     //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get toggle button width                                    //
    //  return : Toggle button width                                          //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get toggle button height                                  //
    //  return : Toggle button height                                         //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get toggle button alpha                                    //
    //  return : Toggle button alpha                                          //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getState : Get toggle button state                                    //
    //  return : Toggle button state                                          //
    ////////////////////////////////////////////////////////////////////////////
    getState: function()
    {
        return (this.buttonState >= 4);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render toggle button                                         //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Set toggle button model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec2(this.position);
        this.modelMatrix.scaleVec2(this.size);
        this.vecmat.setMatrix(this.modelMatrix);

        // Bind toggle button shader
        this.toggleButtonShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);

        // Send shader uniforms
        this.toggleButtonShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.toggleButtonShader.sendModelVecmat(this.vecmat);
        this.toggleButtonShader.sendUniform(this.alphaUniform, this.alpha);
        this.toggleButtonShader.sendIntUniform(
            this.stateUniform, this.buttonState
        );

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.toggleButtonShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind toggle button shader
        this.toggleButtonShader.unbind();
    }
};
