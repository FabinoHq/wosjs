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
//      renderer/texture.js : Texture management                              //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Texture class definition                                                  //
////////////////////////////////////////////////////////////////////////////////
function Texture(renderer)
{
    // Texture loaded state
    this.loaded = false;

    // Renderer pointer
    this.renderer = renderer;

    // Image data
    this.image = null;
    // Texture data
    this.tex = null;

    // Texture width
    this.width = 0;
    // Texture height
    this.height = 0;
    // Texture smooth attribute
    this.smooth = true;
}

Texture.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  load : Load texture                                                   //
    //  param src : URL of the source image                                   //
    //  param smooth : Texture smooth attribute                               //
    ////////////////////////////////////////////////////////////////////////////
    load: function(src, smooth)
    {
        // Reset texture
        this.loaded = false;
        this.image = null;
        this.tex = null;
        this.width = 0;
        this.height = 0;
        this.smooth = true;

        // Check renderer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Check source url
        if (!src) return false;

        // Create texture
        this.tex = this.renderer.gl.createTexture();
        if (!this.tex)
        {
            // Could not create texture
            return false;
        }
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.tex);
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            1, 1, 0, this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE,
            new Uint8Array([0, 0, 0, 0])
        );
        this.width = 1;
        this.height = 1;
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Load image
        this.image = new Image();
        this.image.crossOrigin = "Anonymous";
        if (!this.image)
        {
            // Could not create image
            return false;
        }

        // Set texture smoothness
        if (smooth !== undefined)
        {
            this.smooth = smooth;
        }

        // On image loaded
        this.image.texture = this;
        this.image.onload = function()
        {
            this.texture.handleImageLoaded();
            if (this.texture.loaded) { this.texture.onTextureLoaded(); }
        }

        // Start loading image
        this.image.src = src;
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  handleImageLoaded : Source image is loaded                            //
    ////////////////////////////////////////////////////////////////////////////
    handleImageLoaded: function()
    {
        var pixelsData = null;

        // Bind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.tex);

        // Set texture size
        this.width = this.image.width;
        this.height = this.image.height;

        // Render image
        pixelsData = this.renderer.renderImage(
            this.image, this.width, this.height
        );

        // Set texture data
        this.renderer.gl.texImage2D(
            this.renderer.gl.TEXTURE_2D, 0, this.renderer.gl.RGBA,
            this.width, this.height, 0,
            this.renderer.gl.RGBA, this.renderer.gl.UNSIGNED_BYTE, pixelsData
        );

        // Set texture wrap mode
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_S,
            this.renderer.gl.REPEAT
        );
        this.renderer.gl.texParameteri(
            this.renderer.gl.TEXTURE_2D,
            this.renderer.gl.TEXTURE_WRAP_T,
            this.renderer.gl.REPEAT
        );

        // Set texture min and mag filters
        if (this.smooth)
        {
            this.renderer.gl.texParameteri(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.gl.TEXTURE_MIN_FILTER,
                this.renderer.gl.LINEAR
            );
            this.renderer.gl.texParameteri(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.gl.TEXTURE_MAG_FILTER,
                this.renderer.gl.LINEAR
            );
        }
        else
        {
            this.renderer.gl.texParameteri(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.gl.TEXTURE_MIN_FILTER,
                this.renderer.gl.NEAREST
            );
            this.renderer.gl.texParameteri(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.gl.TEXTURE_MAG_FILTER,
                this.renderer.gl.NEAREST
            );
        }

        // Unbind texture
        this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

        // Texture successfully loaded
        this.loaded = true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  onTextureLoaded : Called when texture is fully loaded                 //
    ////////////////////////////////////////////////////////////////////////////
    onTextureLoaded: function()
    {

    },

    ////////////////////////////////////////////////////////////////////////////
    //  bind : Bind texture to renderer                                       //
    ////////////////////////////////////////////////////////////////////////////
    bind: function()
    {
        if (this.loaded)
        {
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.tex);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  unbind : Unbind texture                                               //
    ////////////////////////////////////////////////////////////////////////////
    unbind: function()
    {
        if (this.loaded)
        {
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSmooth : Set texture smooth attribute                              //
    //  param smooth : Texture smooth attribute                               //
    ////////////////////////////////////////////////////////////////////////////
    setSmooth: function(smooth)
    {        
        if (this.loaded)
        {
            // Bind texture
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, this.tex);

            // Set texture min and mag filters
            if (this.smooth)
            {
                this.renderer.gl.texParameteri(
                    this.renderer.gl.TEXTURE_2D,
                    this.renderer.gl.TEXTURE_MIN_FILTER,
                    this.renderer.gl.LINEAR
                );
                this.renderer.gl.texParameteri(
                    this.renderer.gl.TEXTURE_2D,
                    this.renderer.gl.TEXTURE_MAG_FILTER,
                    this.renderer.gl.LINEAR
                );
            }
            else
            {
                this.renderer.gl.texParameteri(
                    this.renderer.gl.TEXTURE_2D,
                    this.renderer.gl.TEXTURE_MIN_FILTER,
                    this.renderer.gl.NEAREST
                );
                this.renderer.gl.texParameteri(
                    this.renderer.gl.TEXTURE_2D,
                    this.renderer.gl.TEXTURE_MAG_FILTER,
                    this.renderer.gl.NEAREST
                );
            }

            // Unbind texture
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get texture width                                          //
    //  return : Width of the texture                                         //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get texture height                                        //
    //  return : Height of the texture                                        //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  isSmooth : Get the texture smooth attribute                           //
    //  return : True if the texture is smoothed, false otherwise             //
    ////////////////////////////////////////////////////////////////////////////
    isSmooth: function()
    {
        return this.smooth;
    }
};

