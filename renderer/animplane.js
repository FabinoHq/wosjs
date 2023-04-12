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
//           \\__/      \\_/    //______________/ //_____________/  JS        //
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
//    WOSjs : Web Operating System (javascript version)                       //
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
    this.specularityUniform = null;
    this.specularityUniformMedium = null;
    this.alphaUniform = null;
    this.alphaUniformMedium = null;
    this.alphaUniformLow = null;
    this.countUniform = null;
    this.countUniformMedium = null;
    this.countUniformLow = null;
    this.currentUniform = null;
    this.currentUniformMedium = null;
    this.currentUniformLow = null;
    this.nextUniform = null;
    this.nextUniformMedium = null;
    this.nextUniformLow = null;
    this.interpUniform = null;
    this.interpUniformMedium = null;
    this.interpUniformLow = null;

    // Animated plane texture
    this.texture = null;
    // Animated plane normal map
    this.normalMap = null;
    // Animated plane specular map
    this.specularMap = null;
    // Plane model matrix
    this.modelMatrix = new Matrix4x4();

    // Animated plane billboard mode
    this.billboard = WOSPlaneBillboardNone;
    // Animated plane position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Animated plane size
    this.size = new Vector2(1.0, 1.0);
    // Animated plane rotation angle
    this.angles = new Vector4(0.0, 0.0, 0.0, 0.0);
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

    // VecMat 4x4 model matrix
    this.vecmat = new VecMat4x4();

    // Temp vectors
    this.lookAtVec = new Vector3();
    this.rotVec = new Vector3();
    this.delta = new Vector3();
    this.delta2 = new Vector3();
}

AnimPlane.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init animated plane                                            //
    //  param tex : Texture pointer                                           //
    //  param width : Animated plane width                                    //
    //  param height : Animated plane height                                  //
    //  param countX : Animated plane frames count in U texture axis          //
    //  param countY : Animated plane frames count in V texture axis          //
    //  return : True if animated plane is successfully loaded                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(tex, width, height, countX, countY)
    {
        // Reset animated plane
        this.specularityUniform = null;
        this.specularityUniformMedium = null;
        this.alphaUniform = null;
        this.alphaUniformMedium = null;
        this.alphaUniformLow = null;
        this.countUniform = null;
        this.countUniformMedium = null;
        this.countUniformLow = null;
        this.currentUniform = null;
        this.currentUniformMedium = null;
        this.currentUniformLow = null;
        this.nextUniform = null;
        this.nextUniformMedium = null;
        this.nextUniformLow = null;
        this.interpUniform = null;
        this.interpUniformMedium = null;
        this.interpUniformLow = null;
        this.texture = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        this.billboard = WOSPlaneBillboardNone;
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        if (!this.angles) return false;
        this.angles.reset();
        if (!this.count) return false;
        this.count.setXY(1, 1);
        if (countX !== undefined) this.count.vec[0] = countX;
        if (countY !== undefined) this.count.vec[1] = countY;
        if (!this.start) return false;
        this.start.setXY(0, 0);
        if (!this.end) return false;
        this.end.setXY(0, 0);
        this.frametime = 1.0;
        this.alpha = 1.0;
        this.specularity = 0.0;
        if (!this.current) return false;
        this.current.setXY(0, 0);
        if (!this.next) return false;
        this.next.setXY(0, 0);
        this.currentTime = 0.0;
        this.interpOffset = 0.0;
        this.interp = 0.0;
        if (!this.vecmat) return false;
        this.vecmat.setIdentity();
        if (!this.lookAtVec) return false;
        this.lookAtVec.reset();
        if (!this.rotVec) return false;
        this.rotVec.reset();
        if (!this.delta) return false;
        this.delta.reset();
        if (!this.delta2) return false;
        this.delta2.reset();

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
            this.specularityUniform = this.animPlaneShader.getUniform(
                "specularity"
            );
            if (!this.specularityUniform) return false;
            this.alphaUniform = this.animPlaneShader.getUniform("alpha");
            if (!this.alphaUniform) return false;
            this.countUniform = this.animPlaneShader.getUniform("count");
            if (!this.countUniform) return false;
            this.currentUniform = this.animPlaneShader.getUniform("current");
            if (!this.currentUniform) return false;
            this.nextUniform = this.animPlaneShader.getUniform("next");
            if (!this.nextUniform) return false;
            this.interpUniform = this.animPlaneShader.getUniform("interp");
            if (!this.interpUniform) return false;
            this.animPlaneShader.unbind();
        }

        // Get medium animated plane shader uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            // Check medium animated plane shader pointer
            if (!this.animPlaneShaderMedium) return false;

            this.animPlaneShaderMedium.bind();
            this.specularityUniformMedium =
                this.animPlaneShaderMedium.getUniform("specularity");
            if (!this.specularityUniformMedium) return false;
            this.alphaUniformMedium =
                this.animPlaneShaderMedium.getUniform("alpha");
            if (!this.alphaUniformMedium) return false;
            this.countUniformMedium =
                this.animPlaneShaderMedium.getUniform("count");
            if (!this.countUniformMedium) return false;
            this.currentUniformMedium =
                this.animPlaneShaderMedium.getUniform("current");
            if (!this.currentUniformMedium) return false;
            this.nextUniformMedium =
                this.animPlaneShaderMedium.getUniform("next");
            if (!this.nextUniformMedium) return false;
            this.interpUniformMedium =
                this.animPlaneShaderMedium.getUniform("interp");
            if (!this.interpUniformMedium) return false;
            this.animPlaneShaderMedium.unbind();
        }

        // Get low animated plane shader uniforms locations
        this.animPlaneShaderLow.bind();
        this.alphaUniformLow = this.animPlaneShaderLow.getUniform("alpha");
        if (!this.alphaUniformLow) return false;
        this.countUniformLow = this.animPlaneShaderLow.getUniform("count");
        if (!this.countUniformLow) return false;
        this.currentUniformLow = this.animPlaneShaderLow.getUniform("current");
        if (!this.currentUniformLow) return false;
        this.nextUniformLow = this.animPlaneShaderLow.getUniform("next");
        if (!this.nextUniformLow) return false;
        this.interpUniformLow = this.animPlaneShaderLow.getUniform("interp");
        if (!this.interpUniformLow) return false;
        this.animPlaneShaderLow.unbind();

        // Set texture
        this.texture = tex;
        if (!this.texture) return false;

        // Set default normal map
        this.normalMap = this.renderer.normalMap;
        if (!this.normalMap) return false;

        // Set default specular map
        this.specularMap = this.renderer.specularMap;
        if (!this.specularMap) return false;

        // Compute initial frame
        this.compute(0.0);

        // Animated plane successfully loaded
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
        if (billboard <= WOSPlaneBillboardNone)
        {
            billboard = WOSPlaneBillboardNone;
        }
        if (billboard >= WOSPlaneBillboardSpherical)
        {
            billboard = WOSPlaneBillboardSpherical;
        }
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
    //  setAngles : Set animated plane rotation angles                        //
    //  param angleX : Animated plane X rotation angle to set in radians      //
    //  param angleY : Animated plane Y rotation angle to set in radians      //
    //  param angleZ : Animated plane Z rotation angle to set in radians      //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set animated plane rotation angles from a vector      //
    //  param angles : 3 component angles vector to rotate animated plane     //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(angles)
    {
        this.angles.vec[0] = angles.vec[0];
        this.angles.vec[1] = angles.vec[1];
        this.angles.vec[2] = angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set animated plane rotation X angle                       //
    //  param angleX : Animated plane rotation X angle to set in radians      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set animated plane rotation Y angle                       //
    //  param angleY : Animated plane rotation Y angle to set in radians      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set animated plane rotation Z angle                       //
    //  param angleZ : Animated plane rotation Z angle to set in radians      //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate animated plane                                        //
    //  param angleX : X angle to rotate animated plane by in radians         //
    //  param angleY : Y angle to rotate animated plane by in radians         //
    //  param angleZ : Z angle to rotate animated plane by in radians         //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateVec3 : Rotate animated plane with a vector                      //
    //  param angles : 3 component angles vector to rotate animated plane     //
    ////////////////////////////////////////////////////////////////////////////
    rotateVec3: function(angles)
    {
        this.angles.vec[0] += angles.vec[0];
        this.angles.vec[1] += angles.vec[1];
        this.angles.vec[2] += angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate animated plane around the X axis                     //
    //  param angleX : X angle to rotate animated plane by in radians         //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate animated plane around the Y axis                     //
    //  param angleY : Y angle to rotate animated plane by in radians         //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate animated plane around the Z axis                     //
    //  param angleZ : Z angle to rotate animated plane by in radians         //
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
    //  return : Animated plane rotation X angle in radians                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get animated plane rotation Y angle                       //
    //  return : Animated plane rotation Y angle in radians                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get animated plane rotation Z angle                       //
    //  return : Animated plane rotation Z angle in radians                   //
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
        var dotProduct = 0.0;
        var angle = 0.0;

        // Set animated plane model matrix
        this.modelMatrix.setIdentity();
        this.modelMatrix.translateVec3(this.position);
        if (this.billboard == WOSPlaneBillboardCylindricalY)
        {
            // Cylindrical billboard (Y)
            this.lookAtVec.setXYZ(0.0, 0.0, 1.0);
            this.delta.setXYZ(
                this.position.vec[0] - this.renderer.camera.position.vec[0],
                0.0,
                this.position.vec[2] - this.renderer.camera.position.vec[2]
            );
            this.delta.normalize();
            this.rotVec.crossProduct(this.lookAtVec, this.delta);
            dotProduct = this.lookAtVec.dotProduct(this.delta);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = WOSPi-Math.acos(dotProduct);
            this.modelMatrix.rotate(
                angle,
                this.rotVec.vec[0],
                this.rotVec.vec[1],
                this.rotVec.vec[2]
            );
            this.modelMatrix.rotateZ(this.angles.vec[2]);
        }
        else if (this.billboard == WOSPlaneBillboardCylindricalX)
        {
            // Cylindrical billboard (X)
            this.lookAtVec.setXYZ(0.0, 0.0, 1.0);
            this.delta.setXYZ(
                0.0,
                this.position.vec[1] - this.renderer.camera.position.vec[1],
                this.position.vec[2] - this.renderer.camera.position.vec[2]
            );
            this.delta.normalize();
            this.rotVec.crossProduct(this.lookAtVec, this.delta);
            dotProduct = this.lookAtVec.dotProduct(this.delta);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = WOSPi-Math.acos(dotProduct);
            this.modelMatrix.rotate(
                angle,
                this.rotVec.vec[0],
                this.rotVec.vec[1],
                this.rotVec.vec[2]
            );
            this.modelMatrix.rotateZ(this.angles.vec[2]);
        }
        else if (this.billboard == WOSPlaneBillboardSpherical)
        {
            // Spherical billboard
            this.lookAtVec.setXYZ(0.0, 0.0, 1.0);
            this.delta.setXYZ(
                this.position.vec[0] - this.renderer.camera.position.vec[0],
                0.0,
                this.position.vec[2] - this.renderer.camera.position.vec[2]
            );
            this.delta.normalize();
            this.rotVec.crossProduct(this.lookAtVec, this.delta);
            dotProduct = this.lookAtVec.dotProduct(this.delta);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = WOSPi-Math.acos(dotProduct);
            this.modelMatrix.rotate(
                angle,
                this.rotVec.vec[0],
                this.rotVec.vec[1],
                this.rotVec.vec[2]
            );
            this.delta2.setXYZ(
                this.position.vec[0] - this.renderer.camera.position.vec[0],
                this.position.vec[1] - this.renderer.camera.position.vec[1],
                this.position.vec[2] - this.renderer.camera.position.vec[2]
            );
            this.delta2.normalize();
            dotProduct = this.delta.dotProduct(this.delta2);
            if (dotProduct <= -1.0) { dotProduct = -1.0; }
            if (dotProduct >= 1.0) { dotProduct = 1.0; }
            angle = Math.acos(dotProduct)*sign(this.delta2.vec[1]);
            this.modelMatrix.rotateX(angle);
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
        this.vecmat.setMatrix(this.modelMatrix);

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
            this.animPlaneShader.sendModelVecmat(this.vecmat);
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
            if (this.normalMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
                this.normalMap.bind();
            }
            if (this.specularMap)
            {
                this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
                this.specularMap.bind();
            }

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(
                this.animPlaneShader, quality
            );
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE3);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE2);
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
            this.animPlaneShaderMedium.sendModelVecmat(this.vecmat);
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
            this.texture.bind();

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(
                this.animPlaneShaderMedium, quality
            );
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.texture.unbind();

            // Unbind animated plane shader
            this.animPlaneShaderMedium.unbind();
        }
        else
        {
            // Low quality
            this.animPlaneShaderLow.bind();

            // Send low quality shader uniforms
            this.animPlaneShaderLow.sendModelVecmat(this.vecmat);
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
