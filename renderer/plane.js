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
//  param planeShaderMedium : Medium plane shader pointer                     //
//  param planeShaderLow : Low plane shader pointer                           //
////////////////////////////////////////////////////////////////////////////////
function Plane(renderer, planeShader, planeShaderMedium, planeShaderLow)
{
    // Renderer pointer
    this.renderer = renderer;

    // Plane shader pointer
    this.planeShader = planeShader;
    this.planeShaderMedium = planeShaderMedium;
    this.planeShaderLow = planeShaderLow;

    // Plane shader uniforms locations
    this.shadowsTextureLocation = -1;
    this.normalMapLocation = -1;
    this.specularMapLocation = -1;
    this.cameraPosLocation = -1;
    this.cameraPosLocationMedium = -1;
    this.lightsTextureLocation = -1;
    this.lightsTextureLocationMedium = -1;
    this.shadowsMatrixLocation = -1;
    this.worldLightVecUniform = -1;
    this.worldLightVecUniformMedium = -1;
    this.worldLightColorUniform = -1;
    this.worldLightColorUniformMedium = -1;
    this.worldLightAmbientUniform = -1;
    this.worldLightAmbientUniformMedium = -1;
    this.specularityUniform = -1;
    this.specularityUniformMedium = -1;
    this.alphaUniform = -1;
    this.alphaUniformMedium = -1;
    this.alphaUniformLow = -1;
    this.uvSizeUniform = -1;
    this.uvSizeUniformMedium = -1;
    this.uvSizeUniformLow = -1;
    this.uvOffsetUniform = -1;
    this.uvOffsetUniformMedium = -1;
    this.uvOffsetUniformLow = -1;

    // Plane texture
    this.texture = null;
    // Plane normal map
    this.normalMap = null;
    // Plane specular map
    this.specularMap = null;
    // Plane model matrix
    this.modelMatrix = new Matrix4x4();
    // Plane shadows matrix
    this.shadowsMatrix = new Matrix4x4();

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
    // Plane specularity
    this.specularity = 0.0;
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
        this.shadowsTextureLocation = -1;
        this.normalMapLocation = -1;
        this.specularMapLocation = -1;
        this.cameraPosLocation = -1;
        this.cameraPosLocationMedium = -1;
        this.lightsTextureLocation = -1;
        this.lightsTextureLocationMedium = -1;
        this.shadowsMatrixLocation = -1;
        this.worldLightVecUniform = -1;
        this.worldLightVecUniformMedium = -1;
        this.worldLightColorUniform = -1;
        this.worldLightColorUniformMedium = -1;
        this.worldLightAmbientUniform = -1;
        this.worldLightAmbientUniformMedium = -1;
        this.specularityUniform = -1;
        this.specularityUniformMedium = -1;
        this.alphaUniform = -1;
        this.alphaUniformMedium = -1;
        this.alphaUniformLow = -1;
        this.uvSizeUniform = -1;
        this.uvSizeUniformMedium = -1;
        this.uvSizeUniformLow = -1;
        this.uvOffsetUniform = -1;
        this.uvOffsetUniformMedium = -1;
        this.uvOffsetUniformLow = -1;
        this.texture = null;
        this.normalMap = null;
        this.specularMap = null;
        this.modelMatrix.setIdentity();
        this.shadowsMatrix.setIdentity();
        this.billboard = 0;
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angles.reset();
        this.uvSize.setXY(1.0, 1.0);
        this.uvOffset.reset();
        this.alpha = 1.0;
        this.specularity = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check low plane shader pointer
        if (!this.planeShaderLow) return false;

        // Get plane shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            // Check plane shader pointer
            if (!this.planeShader) return false;

            this.planeShader.bind();
            this.shadowsMatrixLocation = this.planeShader.getUniform(
                "shadowsMatrix"
            );
            this.cameraPosLocation = this.planeShader.getUniform("cameraPos");
            this.lightsTextureLocation = this.planeShader.getUniform(
                "lightsTexture"
            );
            this.planeShader.sendIntUniform(this.lightsTextureLocation, 1);
            this.shadowsTextureLocation = this.planeShader.getUniform(
                "shadowsTexture"
            );
            this.planeShader.sendIntUniform(this.shadowsTextureLocation, 2);
            this.normalMapLocation = this.planeShader.getUniform("normalMap");
            this.planeShader.sendIntUniform(this.normalMapLocation, 3);
            this.specularMapLocation = this.planeShader.getUniform(
                "specularMap"
            );
            this.planeShader.sendIntUniform(this.specularMapLocation, 4);
            this.worldLightVecUniform =
                this.planeShader.getUniform("worldLightVec");
            this.worldLightColorUniform =
                this.planeShader.getUniform("worldLightColor");
            this.worldLightAmbientUniform =
                this.planeShader.getUniform("worldLightAmbient");
            this.specularityUniform = this.planeShader.getUniform(
                "specularity"
            );
            this.alphaUniform = this.planeShader.getUniform("alpha");
            this.uvOffsetUniform = this.planeShader.getUniform("uvOffset");
            this.uvSizeUniform = this.planeShader.getUniform("uvSize");
            this.planeShader.unbind();
        }

        // Get medium plane shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            // Check medium plane shader pointer
            if (!this.planeShaderMedium) return false;

            this.planeShaderMedium.bind();
            this.cameraPosLocationMedium = this.planeShaderMedium.getUniform(
                "cameraPos"
            );
            this.lightsTextureLocationMedium =
                this.planeShaderMedium.getUniform("lightsTexture");
            this.planeShaderMedium.sendIntUniform(
                this.lightsTextureLocationMedium, 1
            );
            this.worldLightVecUniformMedium =
                this.planeShaderMedium.getUniform("worldLightVec");
            this.worldLightColorUniformMedium =
                this.planeShaderMedium.getUniform("worldLightColor");
            this.worldLightAmbientUniformMedium =
                this.planeShaderMedium.getUniform("worldLightAmbient");
            this.specularityUniformMedium = this.planeShaderMedium.getUniform(
                "specularity"
            );
            this.alphaUniformMedium = this.planeShaderMedium.getUniform(
                "alpha"
            );
            this.uvOffsetUniformMedium = this.planeShaderMedium.getUniform(
                "uvOffset"
            );
            this.uvSizeUniformMedium = this.planeShaderMedium.getUniform(
                "uvSize"
            );
            this.planeShaderMedium.unbind();
        }

        // Get low plane shader uniforms locations
        this.planeShaderLow.bind();
        this.alphaUniformLow = this.planeShaderLow.getUniform("alpha");
        this.uvOffsetUniformLow = this.planeShaderLow.getUniform("uvOffset");
        this.uvSizeUniformLow = this.planeShaderLow.getUniform("uvSize");
        this.planeShaderLow.unbind();

        // Set texture
        this.texture = texture;
        if (!this.texture) return false;

        // Set default normal map
        this.normalMap = this.renderer.normalMap;

        // Set default specular map
        this.specularMap = this.renderer.specularMap;

        // Plane loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTexture : Set plane texture                                        //
    //  param texture : Plane texture                                         //
    ////////////////////////////////////////////////////////////////////////////
    setTexture: function(texture)
    {
        if (texture)
        {
            this.texture = texture;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalMap : Set plane normal map                                   //
    //  param normalMap : Plane normal map                                    //
    ////////////////////////////////////////////////////////////////////////////
    setNormalMap: function(normalMap)
    {
        if (normalMap)
        {
            this.normalMap = normalMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularMap : Set plane specular map                               //
    //  param specularMap : Plane specular map                                //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularMap: function(specularMap)
    {
        if (specularMap)
        {
            this.specularMap = specularMap;
        }
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
    //  setSpecularity : Set plane specularity                                //
    //  param specularity : Plane specularity to set                          //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularity: function(specularity)
    {
        this.specularity = specularity;
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
    //  param quality : Plane shader quality                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality)
    {
        var lookAtVec = new Vector3();
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
            lookAtVec.setXYZ(0.0, 0.0, 1.0);
            delta.setXYZ(
                this.renderer.camera.position.vec[0] + this.position.vec[0],
                0.0,
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta.normalize();
            rotVec.crossProduct(lookAtVec, delta);
            dotProduct = lookAtVec.dotProduct(delta);
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
            lookAtVec.setXYZ(0.0, 0.0, 1.0);
            delta.setXYZ(
                0.0,
                this.renderer.camera.position.vec[1] + this.position.vec[1],
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta.normalize();
            rotVec.crossProduct(lookAtVec, delta);
            dotProduct = lookAtVec.dotProduct(delta);
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
            lookAtVec.setXYZ(0.0, 0.0, 1.0);
            delta.setXYZ(
                this.renderer.camera.position.vec[0] + this.position.vec[0],
                0.0,
                this.renderer.camera.position.vec[2] + this.position.vec[2]
            );
            delta.normalize();
            rotVec.crossProduct(lookAtVec, delta);
            dotProduct = lookAtVec.dotProduct(delta);
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

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.camera.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.camera.viewMatrix);
        this.renderer.worldMatrix.multiply(this.modelMatrix);

        // Set maximum quality
        if (this.renderer.shadowsQuality <= WOSRendererShadowsQualityLow)
        {
            if (this.renderer.maxQuality >= WOSRendererQualityMedium)
            {
                if (quality >= WOSRendererQualityMedium)
                {
                    quality = WOSRendererQualityMedium;
                }
                else
                {
                    quality = WOSRendererQualityLow;
                }
            }
            else
            {
                quality = WOSRendererQualityLow;
            }
        }
        if (quality >= this.renderer.quality)
        {
            quality = this.renderer.quality;
        }
        if (quality >= this.renderer.maxQuality)
        {
            quality = this.renderer.maxQuality;
        }

        // Render plane
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.planeShader.bind();

            // Send high quality shader uniforms
            this.shadowsMatrix.setMatrix(this.renderer.shadows.projMatrix);
            this.shadowsMatrix.multiply(this.renderer.shadows.viewMatrix);

            this.planeShader.sendWorldMatrix(this.renderer.worldMatrix);
            this.planeShader.sendModelMatrix(this.modelMatrix);
            this.planeShader.sendUniformMat4(
                this.shadowsMatrixLocation, this.shadowsMatrix
            );
            this.planeShader.sendUniformVec3(
                this.cameraPosLocation, this.renderer.camera.position
            );
            this.planeShader.sendUniformVec3(
                this.worldLightVecUniform, this.renderer.worldLight.direction
            );
            this.planeShader.sendUniformVec4(
                this.worldLightColorUniform, this.renderer.worldLight.color
            );
            this.planeShader.sendUniformVec4(
                this.worldLightAmbientUniform, this.renderer.worldLight.ambient
            );
            this.planeShader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.planeShader.sendUniform(this.alphaUniform, this.alpha);
            this.planeShader.sendUniformVec2(
                this.uvOffsetUniform, this.uvOffset
            );
            this.planeShader.sendUniformVec2(this.uvSizeUniform, this.uvSize);

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.dynamicLights.lightsTexture
            );
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.shadows.depthTexture
            );
            if (this.normalMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
                this.normalMap.bind();
            }
            if (this.specularMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE4);
                this.specularMap.bind();
            }

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.planeShader, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE4);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind plane shader
            this.planeShader.unbind();
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality
            this.planeShaderMedium.bind();

            // Send medium quality shader uniforms
            this.planeShaderMedium.sendWorldMatrix(this.renderer.worldMatrix);
            this.planeShaderMedium.sendModelMatrix(this.modelMatrix);
            this.planeShaderMedium.sendUniformVec3(
                this.cameraPosLocationMedium, this.renderer.camera.position
            );
            this.planeShaderMedium.sendUniformVec3(
                this.worldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.planeShaderMedium.sendUniformVec4(
                this.worldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.planeShaderMedium.sendUniformVec4(
                this.worldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );
            this.planeShaderMedium.sendUniform(
                this.specularityUniformMedium, this.specularity
            );
            this.planeShaderMedium.sendUniform(
                this.alphaUniformMedium, this.alpha
            );
            this.planeShaderMedium.sendUniformVec2(
                this.uvOffsetUniformMedium, this.uvOffset
            );
            this.planeShaderMedium.sendUniformVec2(
                this.uvSizeUniformMedium, this.uvSize
            );

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.dynamicLights.lightsTexture
            );

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(
                this.planeShaderMedium, quality
            );
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind plane shader
            this.planeShaderMedium.unbind();
        }
        else
        {
            // Low quality
            this.planeShaderLow.bind();

            // Send low quality shader uniforms
            this.planeShaderLow.sendWorldMatrix(this.renderer.worldMatrix);
            this.planeShaderLow.sendUniform(this.alphaUniformLow, this.alpha);
            this.planeShaderLow.sendUniformVec2(
                this.uvOffsetUniformLow, this.uvOffset
            );
            this.planeShaderLow.sendUniformVec2(
                this.uvSizeUniformLow, this.uvSize
            );

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(
                this.planeShaderLow, quality
            );
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind plane shader
            this.planeShaderLow.unbind();
        }
    }
};
