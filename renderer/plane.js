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
//      renderer/plane.js : Plane management                                  //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Plane class definition                                                    //
//  param renderer : Renderer pointer                                         //
//  param planeShader : Plane shader pointer                                  //
////////////////////////////////////////////////////////////////////////////////
function Plane(renderer, planeShader)
{
    // Renderer pointer
    this.renderer = renderer;

    // Plane shader pointer
    this.planeShader = planeShader;

    // Plane shader uniforms locations
    this.alphaUniform = -1;
    this.uvSizeUniform = -1;
    this.uvOffsetUniform = -1;

    // Plane texture
    this.texture = null;
    // Plane model matrix
    this.modelMatrix = new Matrix4x4();

    // Plane billboard mode
    this.billboard = 0;
    // Plane position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Plane size
    this.size = new Vector2(1.0, 1.0);
    // Plane rotation angles
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Plane texture UV size
    this.uvSize = new Vector2(1.0, 1.0);
    // Plane texture UV offset
    this.uvOffset = new Vector2(0.0, 0.0);
    // Plane alpha
    this.alpha = 1.0;
}

Plane.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init plane                                                     //
    //  param texture : Texture pointer                                       //
    //  param width : Plane width                                             //
    //  param height : Plane height                                           //
    ////////////////////////////////////////////////////////////////////////////
    init: function(texture, width, height)
    {
        // Reset Plane
        this.alphaUniform = -1;
        this.uvSizeUniform = -1;
        this.uvOffsetUniform = -1;
        this.texture = null;
        this.modelMatrix.setIdentity();
        this.billboard = 0;
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angles.reset();
        this.uvSize.setXY(1.0, 1.0);
        this.uvOffset.reset();
        this.alpha = 1.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check plane shader pointer
        if (!this.planeShader) return false;

        // Get plane shader uniforms locations
        this.planeShader.bind();
        this.alphaUniform = this.planeShader.getUniform("alpha");
        this.uvOffsetUniform = this.planeShader.getUniform("uvOffset");
        this.uvSizeUniform = this.planeShader.getUniform("uvSize");
        this.planeShader.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Plane loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBillboard : Set plane billboard mode                               //
    //  param billboard : Plane billboard mode                                //
    ////////////////////////////////////////////////////////////////////////////
    setBillboard: function(billboard)
    {
        if (billboard <= 0) { billboard = 0; }
        if (billboard >= 3) { billboard = 3; }
        this.billboard = billboard;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set plane position                                      //
    //  param x : Plane X position                                            //
    //  param y : Plane Y position                                            //
    //  param z : Plane Z position                                            //
    ////////////////////////////////////////////////////////////////////////////
    setPosition: function(x, y, z)
    {
        this.position.vec[0] = x;
        this.position.vec[1] = y;
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPositionVec3 : Set plane position from a 3 components vector       //
    //  param vector : 3 components vector to set plane position from         //
    ////////////////////////////////////////////////////////////////////////////
    setPositionVec3: function(vector)
    {
        this.position.vec[0] = vector.vec[0];
        this.position.vec[1] = vector.vec[1];
        this.position.vec[2] = vector.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setX : Set plane X position                                           //
    //  param x : Plane X position                                            //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set plane Y position                                           //
    //  param y : Plane Y position                                            //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set plane Z position                                           //
    //  param z : Plane Z position                                            //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate plane                                                //
    //  param x : X axis translate value                                      //
    //  param y : Y axis translate value                                      //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    move: function(x, y, z)
    {
        this.position.vec[0] += x;
        this.position.vec[1] += y;
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveVec3 : Translate plane by a 3 components vector                   //
    //  param vector : 3 components vector to translate plane by              //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.position.vec[2] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate plane on X axis                                     //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate plane on Y axis                                     //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Translate plane on Z axis                                     //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set plane size                                              //
    //  param width : Plane width to set                                      //
    //  param height : Plane height to set                                    //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set plane size from a 2 components vector               //
    //  param vector : 2 components vector to set plane size from             //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set plane width                                            //
    //  param width : Plane width to set                                      //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set plane height                                          //
    //  param height : Plane height to set                                    //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set plane rotation angle                                   //
    //  param angleX : Plane rotation X angle to set in degrees               //
    //  param angleY : Plane rotation Y angle to set in degrees               //
    //  param angleZ : Plane rotation Z angle to set in degrees               //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set plane rotation X angle                                //
    //  param angleX : Plane rotation X angle to set in degrees               //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set plane rotation Y angle                                //
    //  param angleY : Plane rotation Y angle to set in degrees               //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set plane rotation Z angle                                //
    //  param angleZ : Plane rotation Z angle to set in degrees               //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate plane                                                 //
    //  param angleX : X angle to rotate plane by in degrees                  //
    //  param angleY : Y angle to rotate plane by in degrees                  //
    //  param angleZ : Z angle to rotate plane by in degrees                  //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate plane on X axis                                      //
    //  param angleX : X angle to rotate plane by in degrees                  //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate plane on Y axis                                      //
    //  param angleY : Y angle to rotate plane by in degrees                  //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate plane on Z axis                                      //
    //  param angleZ : Z angle to rotate plane by in degrees                  //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setUVSize : Set plane render subrectangle size                        //
    //  param usize : Plane texture U size                                    //
    //  param vsize : Plane texture V size                                    //
    ////////////////////////////////////////////////////////////////////////////
    setUVSize: function(usize, vsize)
    {
        this.uvSize.vec[0] = usize;
        this.uvSize.vec[1] = vsize;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSubrect : Set plane render subrectangle offset                     //
    //  param uoffset : Plane texture U offset                                //
    //  param voffset : Plane texture V offset                                //
    ////////////////////////////////////////////////////////////////////////////
    setUVOffset: function(uoffset, voffset)
    {
        this.uvOffset.vec[0] = uoffset;
        this.uvOffset.vec[1] = voffset;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSubrect : Set plane render subrectangle                            //
    //  param usize : Plane texture U size                                    //
    //  param vsize : Plane texture V size                                    //
    //  param uoffset : Plane texture U offset                                //
    //  param voffset : Plane texture V offset                                //
    ////////////////////////////////////////////////////////////////////////////
    setSubrect: function(usize, vsize, uoffset, voffset)
    {
        this.uvSize.vec[0] = usize;
        this.uvSize.vec[1] = vsize;
        this.uvOffset.vec[0] = uoffset;
        this.uvOffset.vec[1] = voffset;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set plane alpha                                            //
    //  param alpha : Plane alpha to set                                      //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get plane X position                                           //
    //  return : Plane X position                                             //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get plane Y position                                           //
    //  return : Plane Y position                                             //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get plane Z position                                           //
    //  return : Plane Z position                                             //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.position.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get plane width                                            //
    //  return : Plane width                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get plane height                                          //
    //  return : Plane height                                                 //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleX : Get plane rotation X angle                                //
    //  return : Plane rotation X angle in degrees                            //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get plane rotation Y angle                                //
    //  return : Plane rotation Y angle in degrees                            //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get plane rotation Z angle                                //
    //  return : Plane rotation Z angle in degrees                            //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVWidth : Get plane render subrectangle width                      //
    //  return : Plane render subrectangle width                              //
    ////////////////////////////////////////////////////////////////////////////
    getUVWidth: function()
    {
        return this.uvSize.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVHeight : Get plane render subrectangle height                    //
    //  return : Plane render subrectangle height                             //
    ////////////////////////////////////////////////////////////////////////////
    getUVHeight: function()
    {
        return this.uvSize.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVWidth : Get plane render subrectangle X offset                   //
    //  return : Plane render subrectangle X offset                           //
    ////////////////////////////////////////////////////////////////////////////
    getUVOffsetX: function()
    {
        return this.uvOffset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getUVHeight : Get plane render subrectangle Y offset                  //
    //  return : Plane render subrectangle Y offset                           //
    ////////////////////////////////////////////////////////////////////////////
    getUVOffsetY: function()
    {
        return this.uvOffset.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get plane alpha                                            //
    //  return : Plane alpha                                                  //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render plane                                                 //
    ////////////////////////////////////////////////////////////////////////////
    render: function()
    {
        var upVec = new Vector3();
        var rotVec = new Vector3();
        var delta = new Vector3();
        var delta2 = new Vector3();
        var dotProduct = 0.0;
        var angle = 0.0;

        // Set plane model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec3(this.position);
        if (this.billboard == 1)
        {
            // Cylindrical billboard (Y)
            upVec.setXYZ(0.0, 0.0, 1.0);
            delta.setXYZ(
                this.renderer.camera.position.vec[0] + this.position.vec[0],
                0.0,
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta.normalize();
            rotVec.crossProduct(upVec, delta);
            dotProduct = upVec.dotProduct(delta);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = 180.0+Math.acos(dotProduct)*180.0/Math.PI;
            this.modelMatrix.rotate(
                angle, rotVec.vec[0], rotVec.vec[1], rotVec.vec[2]
            );
            this.modelMatrix.rotateZ(this.angles.vec[2]);
        }
        else if (this.billboard == 2)
        {
            // Cylindrical billboard (X)
            upVec.setXYZ(0.0, 0.0, 1.0);
            delta.setXYZ(
                0.0,
                this.renderer.camera.position.vec[1] + this.position.vec[1],
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta.normalize();
            rotVec.crossProduct(upVec, delta);
            dotProduct = upVec.dotProduct(delta);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = 180.0+Math.acos(dotProduct)*180.0/Math.PI;
            this.modelMatrix.rotate(
                angle, rotVec.vec[0], rotVec.vec[1], rotVec.vec[2]
            );
            this.modelMatrix.rotateZ(this.angles.vec[2]);
        }
        else if (this.billboard == 3)
        {
            // Spherical billboard
            upVec.setXYZ(0.0, 0.0, 1.0);
            delta.setXYZ(
                this.renderer.camera.position.vec[0] + this.position.vec[0],
                0.0,
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta.normalize();
            rotVec.crossProduct(upVec, delta);
            dotProduct = upVec.dotProduct(delta);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = 180.0+Math.acos(dotProduct)*180.0/Math.PI;
            this.modelMatrix.rotate(
                angle, rotVec.vec[0], rotVec.vec[1], rotVec.vec[2]
            );
            delta2.setXYZ(
                this.renderer.camera.position.vec[0] + this.position.vec[0],
                this.renderer.camera.position.vec[1] + this.position.vec[1],
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta2.normalize();
            dotProduct = delta.dotProduct(delta2);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = Math.acos(dotProduct)*180.0/Math.PI;
            if (delta2.vec[1] < 0.0) { this.modelMatrix.rotateX(angle); }
            else { this.modelMatrix.rotateX(-angle); }
            this.modelMatrix.rotateZ(this.angles.vec[2]);
        }
        else
        {
            // No billboard mode
            this.modelMatrix.rotateVec3(this.angles);
        }
        this.modelMatrix.translate(
            -this.size.vec[0]*0.5, -this.size.vec[1]*0.5, 0.0
        );
        this.modelMatrix.scaleVec2(this.size);

        // Bind plane shader
        this.planeShader.bind();

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.camera.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.camera.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Send shader uniforms
        this.planeShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.planeShader.sendUniform(this.alphaUniform, this.alpha);
        this.planeShader.sendUniformVec2(this.uvOffsetUniform, this.uvOffset);
        this.planeShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);

        // Bind texture
        this.texture.bind();

        // Render VBO
        this.renderer.vertexBuffer.bind();
        this.renderer.vertexBuffer.render(this.planeShader);
        this.renderer.vertexBuffer.unbind();

        // Unbind texture
        this.texture.unbind();

        // Unbind plane shader
        this.planeShader.unbind();
    }
};
