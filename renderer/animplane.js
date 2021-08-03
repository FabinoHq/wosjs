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
//      renderer/animplane.js : Animated plane management                     //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  AnimPlane class definition                                                //
//  param renderer : Renderer pointer                                         //
//  param animShader : Animated plane shader pointer                          //
////////////////////////////////////////////////////////////////////////////////
function AnimPlane(renderer, animPlaneShader,
    animPlaneShaderMedium, animPlaneShaderLow)
{
    // Renderer pointer
    this.renderer = renderer;

    // Animated plane shader pointer
    this.animPlaneShader = animPlaneShader;
    this.animPlaneShaderMedium = animPlaneShaderMedium;
    this.animPlaneShaderLow = animPlaneShaderLow;

    // Animated plane shader uniforms locations
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
    this.countUniform = -1;
    this.countUniformMedium = -1;
    this.countUniformLow = -1;
    this.currentUniform = -1;
    this.currentUniformMedium = -1;
    this.currentUniformLow = -1;
    this.nextUniform = -1;
    this.nextUniformMedium = -1;
    this.nextUniformLow = -1;
    this.interpUniform = -1;
    this.interpUniformMedium = -1;
    this.interpUniformLow = -1;

    // Animated plane texture
    this.texture = null;
    // Animated plane normal map
    this.normalMap = null;
    // Animated plane specular map
    this.specularMap = null;
    // Animated plane model matrix
    this.modelMatrix = new Matrix4x4();
    // Animated plane shadows matrix
    this.shadowsMatrix = new Matrix4x4();

    // Animated plane billboard mode
    this.billboard = 0;
    // Animated plane position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Animated plane size
    this.size = new Vector2(1.0, 1.0);
    // Animated plane rotation angle
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Animated plane frame count
    this.count = new Vector2(1, 1);
    // Animated plane start frame
    this.start = new Vector2(0, 0);
    // Animated plane end frame
    this.end = new Vector2(0, 0);
    // Animated plane frametime in seconds
    this.frametime = 1.0;
    // Animated plane alpha
    this.alpha = 1.0;
    // Animated plane specularity
    this.specularity = 0.0;

    // Animated plane current states
    this.current = new Vector2(0, 0);
    this.next = new Vector2(0, 0);
    this.currentTime = 0.0;
    this.interpOffset = 0.0;
    this.interp = 0.0;
}

AnimPlane.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init animated plane                                            //
    //  param tex : Texture pointer                                           //
    //  param width : Animated plane width                                    //
    //  param height : Animated plane height                                  //
    //  param countX : Animated plane frames count in U texture axis          //
    //  param countY : Animated plane frames count in V texture axis          //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, width, height, countX, countY)
    {
        // Reset animated plane
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
        this.countUniform = -1;
        this.countUniformMedium = -1;
        this.countUniformLow = -1;
        this.currentUniform = -1;
        this.currentUniformMedium = -1;
        this.currentUniformLow = -1;
        this.nextUniform = -1;
        this.nextUniformMedium = -1;
        this.nextUniformLow = -1;
        this.interpUniform = -1;
        this.interpUniformMedium = -1;
        this.interpUniformLow = -1;
        this.texture = null;
        this.modelMatrix.setIdentity();
        this.shadowsMatrix.setIdentity();
        this.billboard = 0;
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angles.reset();
        this.count.setXY(1, 1);
        if (countX !== undefined) this.count.vec[0] = countX;
        if (countY !== undefined) this.count.vec[1] = countY;
        this.start.setXY(0, 0);
        this.end.setXY(0, 0);
        this.frametime = 1.0;
        this.alpha = 1.0;
        this.specularity = 0.0;
        this.current.setXY(0, 0);
        this.next.setXY(0, 0);
        this.currentTime = 0.0;
        this.interpOffset = 0.0;
        this.interp = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check animated plane shader pointer
        if (!this.animPlaneShaderLow) return false;

        // Get animated plane shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            // Check animated plane shader pointer
            if (!this.animPlaneShader) return false;

            this.animPlaneShader.bind();
            this.shadowsMatrixLocation = this.animPlaneShader.getUniform(
                "shadowsMatrix"
            );
            this.cameraPosLocation = this.animPlaneShader.getUniform(
                "cameraPos"
            );
            this.lightsTextureLocation = this.animPlaneShader.getUniform(
                "lightsTexture"
            );
            this.animPlaneShader.sendIntUniform(this.lightsTextureLocation, 1);
            this.shadowsTextureLocation = this.animPlaneShader.getUniform(
                "shadowsTexture"
            );
            this.animPlaneShader.sendIntUniform(this.shadowsTextureLocation, 2);
            this.normalMapLocation = this.animPlaneShader.getUniform(
                "normalMap"
            );
            this.animPlaneShader.sendIntUniform(this.normalMapLocation, 3);
            this.specularMapLocation = this.animPlaneShader.getUniform(
                "specularMap"
            );
            this.animPlaneShader.sendIntUniform(this.specularMapLocation, 4);
            this.worldLightVecUniform =
                this.animPlaneShader.getUniform("worldLightVec");
            this.worldLightColorUniform =
                this.animPlaneShader.getUniform("worldLightColor");
            this.worldLightAmbientUniform =
                this.animPlaneShader.getUniform("worldLightAmbient");
            this.specularityUniform = this.animPlaneShader.getUniform(
                "specularity"
            );
            this.alphaUniform = this.animPlaneShader.getUniform("alpha");
            this.countUniform = this.animPlaneShader.getUniform("count");
            this.currentUniform = this.animPlaneShader.getUniform("current");
            this.nextUniform = this.animPlaneShader.getUniform("next");
            this.interpUniform = this.animPlaneShader.getUniform("interp");
            this.animPlaneShader.unbind();
        }

        // Get medium animated plane shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            // Check medium animated plane shader pointer
            if (!this.animPlaneShaderMedium) return false;

            this.animPlaneShaderMedium.bind();
            this.cameraPosLocationMedium =
                this.animPlaneShaderMedium.getUniform("cameraPos");
            this.lightsTextureLocationMedium =
                this.animPlaneShaderMedium.getUniform("lightsTexture");
            this.animPlaneShaderMedium.sendIntUniform(
                this.lightsTextureLocationMedium, 1
            );
            this.worldLightVecUniformMedium =
                this.animPlaneShaderMedium.getUniform("worldLightVec");
            this.worldLightColorUniformMedium =
                this.animPlaneShaderMedium.getUniform("worldLightColor");
            this.worldLightAmbientUniformMedium =
                this.animPlaneShaderMedium.getUniform("worldLightAmbient");
            this.specularityUniformMedium =
                this.animPlaneShaderMedium.getUniform("specularity");
            this.alphaUniformMedium = this.animPlaneShaderMedium.getUniform(
                "alpha"
            );
            this.countUniformMedium = this.animPlaneShaderMedium.getUniform(
                "count"
            );
            this.currentUniformMedium = this.animPlaneShaderMedium.getUniform(
                "current"
            );
            this.nextUniformMedium = this.animPlaneShaderMedium.getUniform(
                "next"
            );
            this.interpUniformMedium = this.animPlaneShaderMedium.getUniform(
                "interp"
            );
            this.animPlaneShaderMedium.unbind();
        }

        // Get low animated plane shader uniforms locations
        this.animPlaneShaderLow.bind();
        this.alphaUniformLow = this.animPlaneShaderLow.getUniform("alpha");
        this.countUniformLow = this.animPlaneShaderLow.getUniform("count");
        this.currentUniformLow = this.animPlaneShaderLow.getUniform("current");
        this.nextUniformLow = this.animPlaneShaderLow.getUniform("next");
        this.interpUniformLow = this.animPlaneShaderLow.getUniform("interp");
        this.animPlaneShaderLow.unbind();

        // Set texture
        this.texture = tex;
        if (!this.texture) return false;

        // Set default normal map
        this.normalMap = this.renderer.normalMap;

        // Set default specular map
        this.specularMap = this.renderer.specularMap;

        // Compute initial frame
        this.compute(0.0);

        // Sprite loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTexture : Set animated plane texture                               //
    //  param texture : Animated plane texture                                //
    ////////////////////////////////////////////////////////////////////////////
    setTexture: function(texture)
    {
        if (texture)
        {
            this.texture = texture;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setNormalMap : Set animated plane normal map                          //
    //  param normalMap : Animated plane normal map                           //
    ////////////////////////////////////////////////////////////////////////////
    setNormalMap: function(normalMap)
    {
        if (normalMap)
        {
            this.normalMap = normalMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularMap : Set animated plane specular map                      //
    //  param specularMap : Animated plane specular map                       //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularMap: function(specularMap)
    {
        if (specularMap)
        {
            this.specularMap = specularMap;
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBillboard : Set animated plane billboard mode                      //
    //  param billboard : Animated plane billboard mode                       //
    ////////////////////////////////////////////////////////////////////////////
    setBillboard: function(billboard)
    {
        if (billboard <= 0) { billboard = 0; }
        if (billboard >= 3) { billboard = 3; }
        this.billboard = billboard;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set animated plane position                             //
    //  param x : Animated plane X position                                   //
    //  param y : Animated plane Y position                                   //
    //  param z : Animated plane Z position                                   //
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
    //  setX : Set animated plane X position                                  //
    //  param x : Animated animated plane X position                          //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set animated plane Y position                                  //
    //  param y : Animated animated plane Y position                          //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set animated plane Z position                                  //
    //  param z : Animated animated plane Z position                          //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate animated plane                                       //
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
    //  moveVec3 : Translate animated plane by a 3 components vector          //
    //  param vector : 3 components vector to translate animated plane by     //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.position.vec[2] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate animated plane on X axis                            //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate animated plane on Y axis                            //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Translate animated plane on Z axis                            //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set animated plane size                                     //
    //  param width : Animated plane width to set                             //
    //  param height : Animated plane height to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set animated plane size from a 2 components vector      //
    //  param vector : 2 components vector to set animated plane size from    //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set animated plane width                                   //
    //  param width : Animated plane width to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set animated plane height                                 //
    //  param height : Animated plane height to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set animated plane rotation angle                          //
    //  param angleX : Animated plane rotation X angle to set in degrees      //
    //  param angleY : Animated plane rotation Y angle to set in degrees      //
    //  param angleZ : Animated plane rotation Z angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set animated plane rotation X angle                       //
    //  param angleX : Animated plane rotation X angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set animated plane rotation Y angle                       //
    //  param angleY : Animated plane rotation Y angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set animated plane rotation Z angle                       //
    //  param angleZ : Animated plane rotation Z angle to set in degrees      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate animated plane                                        //
    //  param angleX : X angle to rotate animated plane by in degrees         //
    //  param angleY : Y angle to rotate animated plane by in degrees         //
    //  param angleZ : Z angle to rotate animated plane by in degrees         //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate animated plane on X axis                             //
    //  param angleX : X angle to rotate animated plane by in degrees         //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate animated plane on Y axis                             //
    //  param angleY : Y angle to rotate animated plane by in degrees         //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate animated plane on Z axis                             //
    //  param angleZ : Z angle to rotate animated plane by in degrees         //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setCount : Set animation frame count                                  //
    //  param countX : Animation X frames total count                         //
    //  param countY : Animation Y frames total count                         //
    ////////////////////////////////////////////////////////////////////////////
    setCount: function(countX, countY)
    {
        this.count.setXY(countX, countY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setStart : Set animation start frame                                  //
    //  param startX : Animation start frame X position to set                //
    //  param startY : Animation start frame Y position to set                //
    ////////////////////////////////////////////////////////////////////////////
    setStart: function(startX, startY)
    {
        this.start.setXY(startX, startY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setEnd : Set animation end frame                                      //
    //  param endX : Animation end frame X position to set                    //
    //  param endY : Animation end frame Y position to set                    //
    ////////////////////////////////////////////////////////////////////////////
    setEnd: function(endX, endY)
    {
        this.end.setXY(endX, endY);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setFrametime : Set animated plane frametime                           //
    //  param frametime : Animated plane frametime to set                     //
    ////////////////////////////////////////////////////////////////////////////
    setFrametime: function(frametime)
    {
        this.frametime = frametime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set animated plane alpha                                   //
    //  param alpha : Animated plane alpha to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularity : Set animated plane specularity                       //
    //  param specularity : Animated plane specularity to set                 //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularity: function(specularity)
    {
        this.specularity = specularity;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get animated plane X position                                  //
    //  return : Animated plane X position                                    //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get animated plane Y position                                  //
    //  return : Animated plane Y position                                    //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getZ : Get animated plane Z position                                  //
    //  return : Animated plane Z position                                    //
    ////////////////////////////////////////////////////////////////////////////
    getZ: function()
    {
        return this.position.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get animated plane width                                   //
    //  return : Animated plane width                                         //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get animated plane height                                 //
    //  return : Animated plane height                                        //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleX : Get animated plane rotation X angle                       //
    //  return : Animated plane rotation X angle in degrees                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get animated plane rotation Y angle                       //
    //  return : Animated plane rotation Y angle in degrees                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get animated plane rotation Z angle                       //
    //  return : Animated plane rotation Z angle in degrees                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCountX : Get animated plane X frames count                         //
    //  return : Animated plane X frames count                                //
    ////////////////////////////////////////////////////////////////////////////
    getCountX: function()
    {
        return this.count.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCountY : Get animated plane Y frames count                         //
    //  return : Animated plane Y frames count                                //
    ////////////////////////////////////////////////////////////////////////////
    getCountY: function()
    {
        return this.count.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getStartX : Get animated plane X start frame                          //
    //  return : Animated plane X start frame                                 //
    ////////////////////////////////////////////////////////////////////////////
    getStartX: function()
    {
        return this.start.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getStartY : Get animated plane Y start frame                          //
    //  return : Animated plane Y start frame                                 //
    ////////////////////////////////////////////////////////////////////////////
    getStartY: function()
    {
        return this.start.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getEndX : Get animated plane X end frame                              //
    //  return : Animated plane X end frame                                   //
    ////////////////////////////////////////////////////////////////////////////
    getEndX: function()
    {
        return this.end.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getEndY : Get animated plane Y end frame                              //
    //  return : Animated plane Y end frame                                   //
    ////////////////////////////////////////////////////////////////////////////
    getEndY: function()
    {
        return this.end.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getFrametime : Get animated plane frametime                           //
    //  return : Animated plane frametime                                     //
    ////////////////////////////////////////////////////////////////////////////
    getFrametime: function()
    {
        return this.frametime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get animated plane alpha                                   //
    //  return : Animated plane alpha                                         //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCurrentX : Get animated plane X current frame                      //
    //  return : Animated plane X current frame                               //
    ////////////////////////////////////////////////////////////////////////////
    getCurrentX: function()
    {
        return this.current.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCurrentY : Get animated plane Y current frame                      //
    //  return : Animated plane Y current frame                               //
    ////////////////////////////////////////////////////////////////////////////
    getCurrentY: function()
    {
        return this.current.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextX : Get animated plane X next frame                            //
    //  return : Animated plane X next frame                                  //
    ////////////////////////////////////////////////////////////////////////////
    getNextX: function()
    {
        return this.next.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getNextY : Get animated plane Y next frame                            //
    //  return : Animated plane Y next frame                                  //
    ////////////////////////////////////////////////////////////////////////////
    getNextY: function()
    {
        return this.next.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getCurrentTime : Get animated plane current time                      //
    //  return : Animated plane current time                                  //
    ////////////////////////////////////////////////////////////////////////////
    getCurrentTime: function()
    {
        return this.currentTime;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  resetAnim : Reset current animation                                   //
    ////////////////////////////////////////////////////////////////////////////
    resetAnim: function()
    {
        this.currentTime = 0.0;
        this.interpOffset = 0.0;
        this.next.set(this.start);
        this.computeFrame();
    },

    ////////////////////////////////////////////////////////////////////////////
    //  computeFrame : Compute current and next frame offsets                 //
    ////////////////////////////////////////////////////////////////////////////
    computeFrame: function()
    {
        // Compute next frame offset
        this.current.set(this.next);
        if (this.next.vec[0] < (this.count.vec[0]-1))
        {
            // Check end frame
            if ((this.next.vec[0] >= this.end.vec[0]) &&
                (this.next.vec[1] >= this.end.vec[1]))
            {
                // End frame reached
                this.next.set(this.start);
            }
            else
            {
                ++this.next.vec[0];
            }
        }
        else
        {
            if (this.next.vec[1] < (this.count.vec[1]-1))
            {
                // Check end frame
                if ((this.next.vec[0] >= this.end.vec[0]) &&
                    (this.next.vec[1] >= this.end.vec[1]))
                {
                    // End frame reached
                    this.next.set(this.start);
                }
                else
                {
                    this.next.vec[0] = 0;
                    ++this.next.vec[1];
                }
            }
            else
            {
                // Last frame reached
                this.next.set(this.start);
            }
        }
    },

    ////////////////////////////////////////////////////////////////////////////
    //  compute : Compute animated plane                                      //
    //  param frametime : Frametime for animation update                      //
    ////////////////////////////////////////////////////////////////////////////
    compute: function(frametime)
    {
        // Update current animation time
        this.currentTime += frametime;
        if (this.frametime > 0.0)
        {
            this.interpOffset += frametime/this.frametime;
        }
        else
        {
            this.interpOffset += frametime;
        }

        if (this.currentTime >= this.frametime)
        {
            // Reset interpolation timer
            this.interpOffset = 0.0;

            // Compute frame offets
            this.computeFrame();

            // Reset timer
            this.currentTime = 0.0;
        }

        // Compute cubic interpolation
        this.interp = this.interpOffset + (this.interpOffset - 
            this.interpOffset*this.interpOffset*(3.0-2.0*this.interpOffset));
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render animated plane                                        //
    //  param quality : Animated plane shader quality                         //
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality)
    {
        var upVec = new Vector3();
        var rotVec = new Vector3();
        var delta = new Vector3();
        var delta2 = new Vector3();
        var dotProduct = 0.0;
        var angle = 0.0;

        // Set animated plane model matrix
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

        // Render animated plane
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.animPlaneShader.bind();

            // Send high quality shader uniforms
            this.shadowsMatrix.setMatrix(this.renderer.shadows.projMatrix);
            this.shadowsMatrix.multiply(this.renderer.shadows.viewMatrix);

            this.animPlaneShader.sendWorldMatrix(this.renderer.worldMatrix);
            this.animPlaneShader.sendModelMatrix(this.modelMatrix);
            this.animPlaneShader.sendUniformMat4(
                this.shadowsMatrixLocation, this.shadowsMatrix
            );
            this.animPlaneShader.sendUniformVec3(
                this.cameraPosLocation, this.renderer.camera.position
            );
            this.animPlaneShader.sendUniformVec3(
                this.worldLightVecUniform, this.renderer.worldLight.direction
            );
            this.animPlaneShader.sendUniformVec4(
                this.worldLightColorUniform, this.renderer.worldLight.color
            );
            this.animPlaneShader.sendUniformVec4(
                this.worldLightAmbientUniform, this.renderer.worldLight.ambient
            );
            this.animPlaneShader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.animPlaneShader.sendUniform(this.alphaUniform, this.alpha);
            this.animPlaneShader.sendUniformVec2(this.countUniform, this.count);
            this.animPlaneShader.sendUniformVec2(
                this.currentUniform, this.current
            );
            this.animPlaneShader.sendUniformVec2(this.nextUniform, this.next);
            this.animPlaneShader.sendUniform(this.interpUniform, this.interp);

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
            this.renderer.planeVertexBuffer.render(
                this.animPlaneShader, quality
            );
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

            // Unbind animated plane shader
            this.animPlaneShader.unbind();
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality
            this.animPlaneShaderMedium.bind();

            // Send medium quality shader uniforms
            this.animPlaneShaderMedium.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.animPlaneShaderMedium.sendModelMatrix(this.modelMatrix);
            this.animPlaneShaderMedium.sendUniformVec3(
                this.cameraPosLocationMedium, this.renderer.camera.position
            );
            this.animPlaneShaderMedium.sendUniformVec3(
                this.worldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.animPlaneShaderMedium.sendUniformVec4(
                this.worldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.animPlaneShaderMedium.sendUniformVec4(
                this.worldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );
            this.animPlaneShaderMedium.sendUniform(
                this.specularityUniformMedium, this.specularity
            );
            this.animPlaneShaderMedium.sendUniform(
                this.alphaUniformMedium, this.alpha
            );
            this.animPlaneShaderMedium.sendUniformVec2(
                this.countUniformMedium, this.count
            );
            this.animPlaneShaderMedium.sendUniformVec2(
                this.currentUniformMedium, this.current
            );
            this.animPlaneShaderMedium.sendUniformVec2(
                this.nextUniformMedium, this.next
            );
            this.animPlaneShaderMedium.sendUniform(
                this.interpUniformMedium, this.interp
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
                this.animPlaneShaderMedium, quality
            );
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.unbind();

            // Unbind animated plane shader
            this.animPlaneShaderMedium.unbind();
        }
        else
        {
            // Low quality
            this.animPlaneShaderLow.bind();

            // Send low quality shader uniforms
            this.animPlaneShaderLow.sendWorldMatrix(this.renderer.worldMatrix);
            this.animPlaneShaderLow.sendUniform(
                this.alphaUniformLow, this.alpha
            );
            this.animPlaneShaderLow.sendUniformVec2(
                this.countUniformLow, this.count
            );
            this.animPlaneShaderLow.sendUniformVec2(
                this.currentUniformLow, this.current
            );
            this.animPlaneShaderLow.sendUniformVec2(
                this.nextUniformLow, this.next
            );
            this.animPlaneShaderLow.sendUniform(
                this.interpUniformLow, this.interp
            );

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.texture.bind();

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(
                this.animPlaneShaderLow, quality
            );
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind animated plane shader
            this.animPlaneShaderLow.unbind();
        }
    }
};
