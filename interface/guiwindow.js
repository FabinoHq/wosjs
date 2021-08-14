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
//      interface/guiwindow.js : GUI Window management                        //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  GuiWindow class definition                                                //
//  param renderer : Renderer pointer                                         //
//  param ninepatchShader : Ninepatch shader pointer                          //
////////////////////////////////////////////////////////////////////////////////
function GuiWindow(renderer, ninepatchShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Window ninepatch
    this.ninepatch = new Ninepatch(this.renderer, ninepatchShader);

    // Window position
    this.position = new Vector2(0.0, 0.0);
    // Window size
    this.size = new Vector2(1.0, 1.0);
    // Window alpha
    this.alpha = 1.0;

    // Window min size
    this.minSize = new Vector2(0.2, 0.2);
    // Window max size
    this.maxSize = new Vector2(3.8, 1.9);

    // Window movable state
    this.movable = true;
    // Window resizable state
    this.resizable = true;
    // Window top bar size
    this.topBarSize = 0.05;
    // Window resize bar size
    this.resizeBarSize = 0.01;
    // Window grabbed states
    this.grabWindow = false;
    this.grabTopWindow = false;
    this.grabBottomWindow = false;
    this.grabLeftWindow = false;
    this.grabRightWindow = false;
    // Window grab position
    this.grabPosition = new Vector2(0.0, 0.0);
}

GuiWindow.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init GUI Window                                                //
    //  param texture : Texture pointer                                       //
    //  param width : Window width                                            //
    //  param height : Window height                                          //
    //  param factor : Window UV factor                                       //
    //  return : True if GUI Window is successfully loaded                    //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height, factor)
    {
        // Reset window
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.alpha = 1.0;
        if (!this.minSize) return false;
        this.minSize.setXY(0.2, 0.2);
        if (!this.maxSize) return false;
        this.maxSize.setXY(3.8, 1.9);
        this.movable = true;
        this.resizable = true;
        this.topBarSize = 0.05;
        this.resizeBarSize = 0.01;
        this.grabWindow = false;
        this.grabTopWindow = false;
        this.grabBottomWindow = false;
        this.grabLeftWindow = false;
        this.grabRightWindow = false;
        if (!this.grabPosition) return false;
        this.grabPosition.reset();

        // Check renderer pointer
        if (!this.renderer) return false;

        // Init ninepatch
        if (!this.ninepatch) return false;
        if (!this.ninepatch.init(texture, width, height, factor)) return false;

        // GUI Window successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set window position                                     //
    //  param x : X position to set                                           //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec2 : Set window position from a 2 components vector      //
    //  param vector : 2 components vector to set window position from        //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec2: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set window X position                                          //
    //  param x : X position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set window Y position                                          //
    //  param y : Y position to set                                           //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate window                                               //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec2 : Translate window by a 2 components vector                  //
    //  param vector : 2 components vector to translate window by             //
    ////////////////////////////////////////////////////////////////////////////
    moveVec2: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate window on X axis                                    //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate window on Y axis                                    //
    //  param x : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
        this.clampWindowPosition();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set window size                                             //
    //  param width : Window width to set                                     //
    //  param height : Window height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set window size from a 2 components vector              //
    //  param vector : 2 components vector to set window size from            //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set window width                                           //
    //  param width : Window width to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set window height                                         //
    //  param height : Window height to set                                   //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set window alpha                                           //
    //  param alpha : Window alpha to set                                     //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMinSize : Set window minimum size                                  //
    //  param minWidth : Window minimum width                                 //
    //  param minHeight : Window minimum width                                //
    ////////////////////////////////////////////////////////////////////////////
    setMinSize: function(minWidth, minHeight)
    {
        if (minWidth <= 0.0) minWidth = 0.0;
        if (minHeight <= 0.0) minHeight = 0.0;
        this.minSize.vec[0] = minWidth;
        this.minSize.vec[1] = minHeight;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMinSizeVec2 : Set window minimum size from a 2 component vector    //
    //  param minSize : 2 component vector to set window minimum size from    //
    ////////////////////////////////////////////////////////////////////////////
    setMinSizeVec2: function(minSize)
    {
        this.minSize.vec[0] = minSize.vec[0];
        this.minSize.vec[1] = minSize.vec[1];
        if (this.minSize.vec[0] <= 0.0) this.minSize.vec[0] = 0.0;
        if (this.minSize.vec[1] <= 0.0) this.minSize.vec[1] = 0.0;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMinWidth : Set window minimum width                                //
    //  param minWidth : Window minimum width                                 //
    ////////////////////////////////////////////////////////////////////////////
    setMinWidth: function(minWidth)
    {
        if (minWidth <= 0.0) minWidth = 0.0;
        this.minSize.vec[0] = minWidth;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMaxWidth : Set window minimum height                               //
    //  param maxHeight : Window minimum height                               //
    ////////////////////////////////////////////////////////////////////////////
    setMinHeight: function(minHeight)
    {
        if (minHeight <= 0.0) minHeight = 0.0;
        this.minSize.vec[1] = minHeight;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMaxSize : Set window maximum size                                  //
    //  param maxWidth : Window maximum width                                 //
    //  param maxHeight : Window maximum width                                //
    ////////////////////////////////////////////////////////////////////////////
    setMaxSize: function(maxWidth, maxHeight)
    {
        if (maxWidth <= 0.0) maxWidth = 0.0;
        if (maxHeight <= 0.0) maxHeight = 0.0;
        this.maxSize.vec[0] = maxWidth;
        this.maxSize.vec[1] = maxHeight;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMaxSizeVec2 : Set window maximum size from a 2 component vector    //
    //  param maxSize : 2 component vector to set window maximum size from    //
    ////////////////////////////////////////////////////////////////////////////
    setMaxSizeVec2: function(maxSize)
    {
        this.maxSize.vec[0] = maxSize.vec[0];
        this.maxSize.vec[1] = maxSize.vec[1];
        if (this.maxSize.vec[0] <= 0.0) this.maxSize.vec[0] = 0.0;
        if (this.maxSize.vec[1] <= 0.0) this.maxSize.vec[1] = 0.0;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMaxWidth : Set window maximum width                                //
    //  param maxWidth : Window maximum width                                 //
    ////////////////////////////////////////////////////////////////////////////
    setMaxWidth: function(maxWidth)
    {
        if (maxWidth <= 0.0) maxWidth = 0.0;
        this.maxSize.vec[0] = maxWidth;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMaxWidth : Set window maximum height                               //
    //  param maxHeight : Window maximum height                               //
    ////////////////////////////////////////////////////////////////////////////
    setMaxHeight: function(maxHeight)
    {
        if (maxHeight <= 0.0) maxHeight = 0.0;
        this.maxSize.vec[1] = maxHeight;
        // Clamp window size
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setMovable : Set window movable state                                 //
    //  param movable : Window movable state to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setMovable: function(movable)
    {
        this.movable = movable;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setResizable : Set window resizable state                             //
    //  param resizable : Window resizable state to set                       //
    ////////////////////////////////////////////////////////////////////////////
    setResizable: function(resizable)
    {
        this.resizable = resizable;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTopBarSize : Set window top bar size                               //
    //  param topBarSize : Window top bar size to set                         //
    ////////////////////////////////////////////////////////////////////////////
    setTopBarSize: function(topBarSize)
    {
        if (topBarSize <= 0.0) topBarSize = 0.0;
        this.topBarSize = topBarSize;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setResizeBarSize : Set window resize bar size                         //
    //  param resizeBarSize : Window resize bar size to set                   //
    ////////////////////////////////////////////////////////////////////////////
    setResizeBarSize: function(resizeBarSize)
    {
        if (resizeBarSize <= 0.0) resizeBarSize = 0.0;
        this.resizeBarSize = resizeBarSize;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleOnResize : Handle canvas window resizing                        //
    ////////////////////////////////////////////////////////////////////////////
    handleOnResize: function()
    {
        this.clampWindowPosition();
        this.clampWindowSize();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mousePress : Handle mouse press event                                 //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the window is moved or resized                       //
    ////////////////////////////////////////////////////////////////////////////
    mousePress: function(mouseX, mouseY)
    {
        if (this.resizable)
        {
            if (this.isTopResizePicking(mouseX, mouseY) &&
                this.isLeftResizePicking(mouseX, mouseY))
            {
                // Top Left resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabTopWindow = true;
                this.grabLeftWindow = true;
                this.grabWindow = false;
                this.grabBottomWindow = false;
                this.grabRightWindow = false;
                return true;
            }

            if (this.isTopResizePicking(mouseX, mouseY) &&
                this.isRightResizePicking(mouseX, mouseY))
            {
                // Top Right resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabTopWindow = true;
                this.grabRightWindow = true;
                this.grabWindow = false;
                this.grabBottomWindow = false;
                this.grabLeftWindow = false;
                return true;
            }

            if (this.isBottomResizePicking(mouseX, mouseY) &&
                this.isLeftResizePicking(mouseX, mouseY))
            {
                // Bottom Left resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabBottomWindow = true;
                this.grabLeftWindow = true;
                this.grabWindow = false;
                this.grabTopWindow = false;
                this.grabRightWindow = false;
                return true;
            }

            if (this.isBottomResizePicking(mouseX, mouseY) &&
                this.isRightResizePicking(mouseX, mouseY))
            {
                // Bottom Right resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabBottomWindow = true;
                this.grabRightWindow = true;
                this.grabWindow = false;
                this.grabTopWindow = false;
                this.grabLeftWindow = false;
                return true;
            }

            if (this.isTopResizePicking(mouseX, mouseY))
            {
                // Top resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabTopWindow = true;
                this.grabWindow = false;
                this.grabBottomWindow = false;
                this.grabLeftWindow = false;
                this.grabRightWindow = false;
                return true;
            }

            if (this.isBottomResizePicking(mouseX, mouseY))
            {
                // Bottom resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabBottomWindow = true;
                this.grabWindow = false;
                this.grabTopWindow = false;
                this.grabLeftWindow = false;
                this.grabRightWindow = false;
                return true;
            }

            if (this.isLeftResizePicking(mouseX, mouseY))
            {
                // Left resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabLeftWindow = true;
                this.grabWindow = false;
                this.grabTopWindow = false;
                this.grabBottomWindow = false;
                this.grabRightWindow = false;
                return true;
            }

            if (this.isRightResizePicking(mouseX, mouseY))
            {
                // Right resize
                this.grabPosition.vec[0] = mouseX;
                this.grabPosition.vec[1] = mouseY;
                this.grabRightWindow = true;
                this.grabWindow = false;
                this.grabTopWindow = false;
                this.grabBottomWindow = false;
                this.grabLeftWindow = false;
                return true;
            }
        }

        if (this.movable && this.isTopBarPicking(mouseX, mouseY))
        {
            // Move window
            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            this.grabWindow = true;
            this.grabTopWindow = false;
            this.grabBottomWindow = false;
            this.grabLeftWindow = false;
            this.grabRightWindow = false;
            return true;
        }

        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseRelease : Handle mouse release event                             //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    ////////////////////////////////////////////////////////////////////////////
    mouseRelease: function(mouseX, mouseY)
    {
        this.grabWindow = false;
        this.grabTopWindow = false;
        this.grabBottomWindow = false;
        this.grabLeftWindow = false;
        this.grabRightWindow = false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  mouseMove : Handle mouse move event                                   //
    //  param mouseX : Cursor X position                                      //
    //  param mouseY : Cursor Y position                                      //
    //  return : True if the window is moved or resized                       //
    ////////////////////////////////////////////////////////////////////////////
    mouseMove: function(mouseX, mouseY)
    {
        var offset = 0.0;
        var offset2 = 0.0;

        // Set window resize cursors
        this.updateCursors(mouseX, mouseY);

        if (this.grabTopWindow && this.grabLeftWindow)
        {
            // Resize top window
            this.size.vec[1] += (mouseY-this.grabPosition.vec[1]);
            this.clampWindowSize();

            // Resize left window
            if (mouseX-this.grabPosition.vec[0] >= 0.0)
            {
                offset = this.size.vec[0];
                this.size.vec[0] -= (mouseX-this.grabPosition.vec[0]);
                this.clampWindowSize();
                this.position.vec[0] -= (this.size.vec[0]-offset);
            }
            else
            {
                offset = this.position.vec[0];
                offset2 = this.size.vec[0];
                this.position.vec[0] += (mouseX-this.grabPosition.vec[0]);
                this.clampWindowPosition();
                this.size.vec[0] -= (this.position.vec[0]-offset);
                this.clampWindowSize();
                this.position.vec[0] -= (this.position.vec[0]-offset);
                this.position.vec[0] -= (this.size.vec[0]-offset2);
            }

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabTopWindow && this.grabRightWindow)
        {
            // Resize top window
            this.size.vec[1] += (mouseY-this.grabPosition.vec[1]);
            this.clampWindowSize();

            // Resize right
            this.size.vec[0] += (mouseX-this.grabPosition.vec[0]);
            this.clampWindowSize();

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabBottomWindow && this.grabLeftWindow)
        {
            // Resize bottom window
            if (mouseY-this.grabPosition.vec[1] >= 0.0)
            {
                offset = this.size.vec[1];
                this.size.vec[1] -= (mouseY-this.grabPosition.vec[1]);
                this.clampWindowSize();
                this.position.vec[1] -= (this.size.vec[1]-offset);
                this.clampWindowPosition();
            }
            else
            {
                offset = this.position.vec[1];
                offset2 = this.size.vec[1];
                this.position.vec[1] += (mouseY-this.grabPosition.vec[1]);
                this.clampWindowPosition();
                this.size.vec[1] -= (this.position.vec[1]-offset);
                this.clampWindowSize();
                this.position.vec[1] -= (this.position.vec[1]-offset);
                this.position.vec[1] -= (this.size.vec[1]-offset2);
            }

            // Resize left window
            if (mouseX-this.grabPosition.vec[0] >= 0.0)
            {
                offset = this.size.vec[0];
                this.size.vec[0] -= (mouseX-this.grabPosition.vec[0]);
                this.clampWindowSize();
                this.position.vec[0] -= (this.size.vec[0]-offset);
            }
            else
            {
                offset = this.position.vec[0];
                offset2 = this.size.vec[0];
                this.position.vec[0] += (mouseX-this.grabPosition.vec[0]);
                this.clampWindowPosition();
                this.size.vec[0] -= (this.position.vec[0]-offset);
                this.clampWindowSize();
                this.position.vec[0] -= (this.position.vec[0]-offset);
                this.position.vec[0] -= (this.size.vec[0]-offset2);
            }

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabBottomWindow && this.grabRightWindow)
        {
            // Resize bottom window
            if (mouseY-this.grabPosition.vec[1] >= 0.0)
            {
                offset = this.size.vec[1];
                this.size.vec[1] -= (mouseY-this.grabPosition.vec[1]);
                this.clampWindowSize();
                this.position.vec[1] -= (this.size.vec[1]-offset);
                this.clampWindowPosition();
            }
            else
            {
                offset = this.position.vec[1];
                offset2 = this.size.vec[1];
                this.position.vec[1] += (mouseY-this.grabPosition.vec[1]);
                this.clampWindowPosition();
                this.size.vec[1] -= (this.position.vec[1]-offset);
                this.clampWindowSize();
                this.position.vec[1] -= (this.position.vec[1]-offset);
                this.position.vec[1] -= (this.size.vec[1]-offset2);
            }

            // Resize right window
            this.size.vec[0] += (mouseX-this.grabPosition.vec[0]);
            this.clampWindowSize();

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabTopWindow)
        {
            // Resize top window
            this.size.vec[1] += (mouseY-this.grabPosition.vec[1]);
            this.clampWindowSize();

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabBottomWindow)
        {
            // Resize bottom window
            if (mouseY-this.grabPosition.vec[1] >= 0.0)
            {
                offset = this.size.vec[1];
                this.size.vec[1] -= (mouseY-this.grabPosition.vec[1]);
                this.clampWindowSize();
                this.position.vec[1] -= (this.size.vec[1]-offset);
                this.clampWindowPosition();
            }
            else
            {
                offset = this.position.vec[1];
                offset2 = this.size.vec[1];
                this.position.vec[1] += (mouseY-this.grabPosition.vec[1]);
                this.clampWindowPosition();
                this.size.vec[1] -= (this.position.vec[1]-offset);
                this.clampWindowSize();
                this.position.vec[1] -= (this.position.vec[1]-offset);
                this.position.vec[1] -= (this.size.vec[1]-offset2);
            }

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabLeftWindow)
        {
            // Resize left window
            if (mouseX-this.grabPosition.vec[0] >= 0.0)
            {
                offset = this.size.vec[0];
                this.size.vec[0] -= (mouseX-this.grabPosition.vec[0]);
                this.clampWindowSize();
                this.position.vec[0] -= (this.size.vec[0]-offset);
            }
            else
            {
                offset = this.position.vec[0];
                offset2 = this.size.vec[0];
                this.position.vec[0] += (mouseX-this.grabPosition.vec[0]);
                this.clampWindowPosition();
                this.size.vec[0] -= (this.position.vec[0]-offset);
                this.clampWindowSize();
                this.position.vec[0] -= (this.position.vec[0]-offset);
                this.position.vec[0] -= (this.size.vec[0]-offset2);
            }

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }

        if (this.grabRightWindow)
        {
            // Resize right window
            this.size.vec[0] += (mouseX-this.grabPosition.vec[0]);
            this.clampWindowSize();

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return;
        }

        if (this.grabWindow)
        {
            // Move window
            this.position.vec[0] += (mouseX-this.grabPosition.vec[0]);
            this.position.vec[1] += (mouseY-this.grabPosition.vec[1]);
            this.clampWindowPosition();

            this.grabPosition.vec[0] = mouseX;
            this.grabPosition.vec[1] = mouseY;
            return true;
        }
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isPicking : Get window picking state                                  //
    //  return : True if the window is picking                                //
    ////////////////////////////////////////////////////////////////////////////
    isPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // Window is picking
            return true;
        }

        // Window is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isTopBarPicking : Get window top bar picking state                    //
    //  return : True if the window top bar is picking                        //
    ////////////////////////////////////////////////////////////////////////////
    isTopBarPicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= (this.position.vec[1] +
                this.size.vec[1] - this.topBarSize)) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // Window top bar is picking
            return true;
        }

        // Window top bar is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isTopResizePicking : Get window top resize bar picking state          //
    //  return : True if the window top resize bar is picking                 //
    ////////////////////////////////////////////////////////////////////////////
    isTopResizePicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= (this.position.vec[1] +
                this.size.vec[1] - this.resizeBarSize)) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // Window top resize bar is picking
            return true;
        }

        // Window top resize bar is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isBottomResizePicking : Get window bottom resize bar picking state    //
    //  return : True if the window bottom resize bar is picking              //
    ////////////////////////////////////////////////////////////////////////////
    isBottomResizePicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.resizeBarSize)))
        {
            // Window bottom resize bar is picking
            return true;
        }

        // Window bottom resize bar is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isLeftResizePicking : Get window left resize bar picking state        //
    //  return : True if the window left resize bar is picking                //
    ////////////////////////////////////////////////////////////////////////////
    isLeftResizePicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0]) &&
            (mouseX <= (this.position.vec[0] + this.resizeBarSize)) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // Window left resize bar is picking
            return true;
        }

        // Window left resize bar is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isRightResizePicking : Get window right resize bar picking state      //
    //  return : True if the window right resize bar is picking               //
    ////////////////////////////////////////////////////////////////////////////
    isRightResizePicking: function(mouseX, mouseY)
    {
        if ((mouseX >= this.position.vec[0] +
                this.size.vec[0] - this.resizeBarSize) &&
            (mouseX <= (this.position.vec[0] + this.size.vec[0])) &&
            (mouseY >= this.position.vec[1]) &&
            (mouseY <= (this.position.vec[1] + this.size.vec[1])))
        {
            // Window right resize bar is picking
            return true;
        }

        // Window right resize bar is not picking
        return false;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateCursors : Update current window cursor                          //
    ////////////////////////////////////////////////////////////////////////////
    updateCursors: function(mouseX, mouseY)
    {
        if (this.resizable)
        {
            if (this.grabTopWindow && this.grabLeftWindow)
            {
                this.renderer.setNWSEResizeCursor();
                return;
            }

            if (this.grabTopWindow && this.grabRightWindow)
            {
                this.renderer.setNESWResizeCursor();
                return;
            }

            if (this.grabBottomWindow && this.grabLeftWindow)
            {
                this.renderer.setNESWResizeCursor();
                return;
            }

            if (this.grabBottomWindow && this.grabRightWindow)
            {
                this.renderer.setNWSEResizeCursor();
                return;
            }

            if (this.grabTopWindow)
            {
                this.renderer.setNSResizeCursor();
                return;
            }

            if (this.grabBottomWindow)
            {
                this.renderer.setNSResizeCursor();
                return;
            }

            if (this.grabLeftWindow)
            {
                this.renderer.setEWResizeCursor();
                return;
            }

            if (this.grabRightWindow)
            {
                this.renderer.setEWResizeCursor();
                return;
            }

            if (this.grabWindow)
            {
                this.renderer.setDefaultCursor();
                return;
            }

            if (this.isTopResizePicking(mouseX, mouseY) &&
                this.isLeftResizePicking(mouseX, mouseY))
            {
                this.renderer.setNWSEResizeCursor();
                return;
            }

            if (this.isTopResizePicking(mouseX, mouseY) &&
                this.isRightResizePicking(mouseX, mouseY))
            {
                this.renderer.setNESWResizeCursor();
                return;
            }

            if (this.isBottomResizePicking(mouseX, mouseY) &&
                this.isLeftResizePicking(mouseX, mouseY))
            {
                this.renderer.setNESWResizeCursor();
                return;
            }

            if (this.isBottomResizePicking(mouseX, mouseY) &&
                this.isRightResizePicking(mouseX, mouseY))
            {
                this.renderer.setNWSEResizeCursor();
                return;
            }

            if (this.isTopResizePicking(mouseX, mouseY))
            {
                this.renderer.setNSResizeCursor();
                return;
            }

            if (this.isBottomResizePicking(mouseX, mouseY))
            {
                this.renderer.setNSResizeCursor();
                return;
            }

            if (this.isLeftResizePicking(mouseX, mouseY))
            {
                this.renderer.setEWResizeCursor();
                return;
            }

            if (this.isRightResizePicking(mouseX, mouseY))
            {
                this.renderer.setEWResizeCursor();
                return;
            }
        }
        this.renderer.setDefaultCursor();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clampWindowPosition : Clamp window position                           //
    ////////////////////////////////////////////////////////////////////////////
    clampWindowPosition: function()
    {
        // Clamp window position
        if (this.position.vec[0] >= (this.renderer.ratio-this.size.vec[0]))
        {
            this.position.vec[0] = (this.renderer.ratio-this.size.vec[0]);
        }
        if (this.position.vec[0] <= -this.renderer.ratio)
        {
            this.position.vec[0] = -this.renderer.ratio;
        }
        if (this.position.vec[1] >= (1.0-this.size.vec[1]))
        {
            this.position.vec[1] = (1.0-this.size.vec[1]);
        }
        if (this.position.vec[1] <= -1.0)
        {
            this.position.vec[1] = -1.0;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  clampWindowSize : Clamp window size                                   //
    ////////////////////////////////////////////////////////////////////////////
    clampWindowSize: function()
    {
        // Clamp window size
        if (this.size.vec[0] <= this.minSize.vec[0])
        {
            this.size.vec[0] = this.minSize.vec[0];
        }
        if (this.size.vec[0] <= 0.0)
        {
            this.size.vec[0] = 0.0;
        }
        if (this.size.vec[0] >= this.maxSize.vec[0])
        {
            this.size.vec[0] = this.maxSize.vec[0];
        }
        if (this.size.vec[0] >= (this.renderer.ratio-this.position.vec[0]))
        {
            this.size.vec[0] = (this.renderer.ratio-this.position.vec[0]);
        }
        if (this.size.vec[1] <= this.minSize.vec[1])
        {
            this.size.vec[1] = this.minSize.vec[1];
        }
        if (this.size.vec[1] <= 0.0)
        {
            this.size.vec[1] = 0.0;
        }
        if (this.size.vec[1] >= this.maxSize.vec[1])
        {
            this.size.vec[1] = this.maxSize.vec[1];
        }
        if (this.size.vec[1] >= (1.0-this.position.vec[1]))
        {
            this.size.vec[1] = (1.0-this.position.vec[1]);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get window X position                                          //
    //  return : Window X position                                            //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get window Y position                                          //
    //  return : Window Y position                                            //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get window width                                           //
    //  return : Window width                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get window height                                         //
    //  return : Window height                                                //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getRatio : Get window ratio                                           //
    //  return : Window ratio                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getRatio: function()
    {
        if (this.size.vec[1] > 0.0)
        {
            return (this.size.vec[0]/this.size.vec[1])
        }
        return 1.0;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get window alpha                                           //
    //  return : Window alpha                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render window                                                //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        // Render ninepatch
        this.ninepatch.setPositionVec2(this.position);
        this.ninepatch.setSizeVec2(this.size);
        this.ninepatch.setAlpha(this.alpha);
        this.ninepatch.render();
    }
};
