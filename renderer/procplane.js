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
//      renderer/procplane.js : Procedural plane management                   //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  ProcPlane class definition                                                //
//  param renderer : Renderer pointer                                         //
////////////////////////////////////////////////////////////////////////////////
function ProcPlane(renderer)
{
    // Renderer pointer
    this.renderer = renderer;

    // Procedural plane shader
    this.shader = null;
    this.shaderMedium = null;
    this.shaderLow = null;
    // Procedural plane model matrix
    this.modelMatrix = new Matrix4x4();
    // Procedural plane shadows matrix
    this.shadowsMatrix = new Matrix4x4();

    // Procedural plane shader uniforms locations
    this.shadowsTextureLocation = -1;
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
    this.timeUniform = -1;
    this.timeUniformMedium = -1;
    this.timeUniformLow = -1;
    this.offsetUniform = -1;
    this.offsetUniformMedium = -1;
    this.offsetUniformLow = -1;

    // Procedural plane billboard mode
    this.billboard = 0;
    // Procedural plane position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Procedural plane size
    this.size = new Vector2(1.0, 1.0);
    // Procedural plane rotation angle
    this.angles = new Vector3(0.0, 0.0, 0.0);
    // Procedural plane offset
    this.offset = new Vector2(0.0, 0.0);
    // Procedural plane time
    this.time = 0.0;
    // Procedural plane alpha
    this.alpha = 1.0;
    // Procedural plane specularity
    this.specularity = 0.0;
}

ProcPlane.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init procedural plane                                          //
    //  param shaderSrc : Procedural plane fragment shader source             //
    //  param mediumShaderSrc : Procedural plane medium shader source         //
    //  param lowShaderSrc : Procedural plane low shader source               //
    //  param width : Procedural plane width                                  //
    //  param height : Procedural plane height                                //
    ////////////////////////////////////////////////////////////////////////////
    init: function(shaderSrc, mediumShaderSrc, lowShaderSrc, width, height)
    {
        // Reset procedural plane
        this.shader = null;
        this.shaderMedium = null;
        this.shaderLow = null;
        this.modelMatrix.setIdentity();
        this.shadowsMatrix.setIdentity();
        this.shadowsTextureLocation = -1;
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
        this.timeUniform = -1;
        this.timeUniformMedium = -1;
        this.timeUniformLow = -1;
        this.offsetUniform = -1;
        this.offsetUniformMedium = -1;
        this.offsetUniformLow = -1;
        this.billboard = 0;
        this.position.reset();
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        this.angles.reset();
        this.offset.reset();
        this.time = 0.0;
        this.alpha = 1.0;
        this.specularity = 0.0;

        // Check renderer pointer
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Init shader
        this.shaderLow = new Shader(this.renderer.gl);
        if (!this.shaderLow) return false;
        if (!this.shaderLow.init(planeVertexShaderLowSrc, lowShaderSrc))
        {
            return false;
        }

        // Init high quality shader
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.shader = new Shader(this.renderer.gl);
            if (!this.shader) return false;
            if (!this.shader.init(planeVertexShaderSrc, shaderSrc))
            {
                return false;
            }
            this.shader.bind();

            // Get plane shader uniforms locations
            this.shadowsMatrixLocation = this.shader.getUniform(
                "shadowsMatrix"
            );
            this.cameraPosLocation = this.shader.getUniform("cameraPos");
            this.lightsTextureLocation = this.shader.getUniform(
                "lightsTexture"
            );
            this.shader.sendIntUniform(this.lightsTextureLocation, 0);
            this.shadowsTextureLocation = this.shader.getUniform(
                "shadowsTexture"
            );
            this.shader.sendIntUniform(this.shadowsTextureLocation, 1);
            this.worldLightVecUniform = this.shader.getUniform(
                "worldLightVec"
            );
            this.worldLightColorUniform = this.shader.getUniform(
                "worldLightColor"
            );
            this.worldLightAmbientUniform = this.shader.getUniform(
                "worldLightAmbient"
            );
            this.specularityUniform = this.shader.getUniform("specularity");
            this.alphaUniform = this.shader.getUniform("alpha");
            this.timeUniform = this.shader.getUniform("time");
            this.offsetUniform = this.shader.getUniform("offset");
            this.shader.unbind();
        }

        // Init medium quality shader
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.shaderMedium = new Shader(this.renderer.gl);
            if (!this.shaderMedium) return false;
            if (!this.shaderMedium.init(
                planeVertexShaderMediumSrc, mediumShaderSrc))
            {
                return false;
            }
            this.shaderMedium.bind();

            // Get medium plane shader uniforms locations
            this.shaderMedium.bind();
            this.cameraPosLocationMedium = this.shaderMedium.getUniform(
                "cameraPos"
            );
            this.lightsTextureLocationMedium = this.shaderMedium.getUniform(
                "lightsTexture"
            );
            this.shaderMedium.sendIntUniform(
                this.lightsTextureLocationMedium, 0
            );
            this.worldLightVecUniformMedium = this.shaderMedium.getUniform(
                "worldLightVec"
            );
            this.worldLightColorUniformMedium = this.shaderMedium.getUniform(
                "worldLightColor"
            );
            this.worldLightAmbientUniformMedium = this.shaderMedium.getUniform(
                "worldLightAmbient"
            );
            this.specularityUniformMedium = this.shaderMedium.getUniform(
                "specularity"
            );
            this.alphaUniformMedium = this.shaderMedium.getUniform("alpha");
            this.timeUniformMedium = this.shaderMedium.getUniform("time");
            this.offsetUniformMedium = this.shaderMedium.getUniform("offset");
            this.shaderMedium.unbind();
        }

        // Get low plane shader uniforms locations
        this.shaderLow.bind();
        this.alphaUniformLow = this.shaderLow.getUniform("alpha");
        this.timeUniformLow = this.shaderLow.getUniform("time");
        this.offsetUniformLow = this.shaderLow.getUniform("offset");
        this.shaderLow.unbind();

        // Procedural plane loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBillboard : Set procedural plane billboard mode                    //
    //  param billboard : Procedural plane billboard mode                     //
    ////////////////////////////////////////////////////////////////////////////
    setBillboard: function(billboard)
    {
        if (billboard <= 0) { billboard = 0; }
        if (billboard >= 3) { billboard = 3; }
        this.billboard = billboard;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setPosition : Set procedural plane position                           //
    //  param x : Procedural plane X position                                 //
    //  param y : Procedural plane Y position                                 //
    //  param z : Procedural plane Z position                                 //
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
    //  setX : Set procedural plane X position                                //
    //  param x : Procedural plane X position                                 //
    ////////////////////////////////////////////////////////////////////////////
    setX: function(x)
    {
        this.position.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setY : Set procedural plane Y position                                //
    //  param y : Procedural plane Y position                                 //
    ////////////////////////////////////////////////////////////////////////////
    setY: function(y)
    {
        this.position.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setZ : Set procedural plane Z position                                //
    //  param z : Procedural plane Z position                                 //
    ////////////////////////////////////////////////////////////////////////////
    setZ: function(z)
    {
        this.position.vec[2] = z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  move : Translate procedural plane                                     //
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
    //  moveVec3 : Translate procedural plane by a 3 components vector        //
    //  param vector : 3 components vector to translate procedural plane by   //
    ////////////////////////////////////////////////////////////////////////////
    moveVec3: function(vector)
    {
        this.position.vec[0] += vector.vec[0];
        this.position.vec[1] += vector.vec[1];
        this.position.vec[2] += vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveX : Translate procedural plane on X axis                          //
    //  param x : X axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveX: function(x)
    {
        this.position.vec[0] += x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveY : Translate procedural plane on Y axis                          //
    //  param y : Y axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveY: function(y)
    {
        this.position.vec[1] += y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  moveZ : Translate procedural plane on Z axis                          //
    //  param z : Z axis translate value                                      //
    ////////////////////////////////////////////////////////////////////////////
    moveZ: function(z)
    {
        this.position.vec[2] += z;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSize : Set procedural plane size                                   //
    //  param width : Procedural plane width to set                           //
    //  param height : Procedural plane height to set                         //
    ////////////////////////////////////////////////////////////////////////////
    setSize: function(width, height)
    {
        this.size.vec[0] = width;
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSizeVec2 : Set procedural plane size from a 2 components vector    //
    //  param vector : 2 components vector to set procedural plane size from  //
    ////////////////////////////////////////////////////////////////////////////
    setSizeVec2: function(vector)
    {
        this.size.vec[0] = vector.vec[0];
        this.size.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setWidth : Set procedural plane width                                 //
    //  param width : Procedural plane width to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setWidth: function(width)
    {
        this.size.vec[0] = width;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setHeight : Set procedural plane height                               //
    //  param height : Procedural plane height to set                         //
    ////////////////////////////////////////////////////////////////////////////
    setHeight: function(height)
    {
        this.size.vec[1] = height;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngle : Set procedural plane rotation angle                        //
    //  param angleX : Procedural plane rotation X angle to set in degrees    //
    //  param angleY : Procedural plane rotation Y angle to set in degrees    //
    //  param angleZ : Procedural plane rotation Z angle to set in degrees    //
    ////////////////////////////////////////////////////////////////////////////
    setAngle: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set procedural plane rotation X angle                     //
    //  param angleX : Procedural plane rotation X angle to set in degrees    //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set procedural plane rotation Y angle                     //
    //  param angleY : Procedural plane rotation Y angle to set in degrees    //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set procedural plane rotation Z angle                     //
    //  param angleZ : Procedural plane rotation Z angle to set in degrees    //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate procedural plane                                      //
    //  param angleX : X angle to rotate procedural plane by in degrees       //
    //  param angleY : Y angle to rotate procedural plane by in degrees       //
    //  param angleZ : Z angle to rotate procedural plane by in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate procedural plane on X axis                           //
    //  param angleX : X angle to rotate procedural plane by in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate procedural plane on Y axis                           //
    //  param angleY : Y angle to rotate procedural plane by in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate procedural plane on Z axis                           //
    //  param angleZ : Z angle to rotate procedural plane by in degrees       //
    ////////////////////////////////////////////////////////////////////////////
    rotateZ: function(angleZ)
    {
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffset : Set procedural plane offset                               //
    //  param x : Procedural plane X offset to set                            //
    //  param y : Procedural plane Y offset to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setOffset: function(x, y)
    {
        this.offset.vec[0] = x;
        this.offset.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetVec2 : Set procedural offset from a 2 components vector      //
    //  param vector : 2 components vector to set procedural offset from      //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetVec2: function(vector)
    {
        this.offset.vec[0] = vector.vec[0];
        this.offset.vec[1] = vector.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetX : Set procedural plane X offset                            //
    //  param x : Procedural plane X offset to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetX: function(x)
    {
        this.offset.vec[0] = x;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setOffsetY : Set procedural plane Y offset                            //
    //  param y : Procedural plane Y offset to set                            //
    ////////////////////////////////////////////////////////////////////////////
    setOffsetY: function(y)
    {
        this.offset.vec[1] = y;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setTime : Set procedural plane time                                   //
    //  param time : Procedural plane time to set                             //
    ////////////////////////////////////////////////////////////////////////////
    setTime: function(time)
    {
        this.time = time;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAlpha : Set procedural plane alpha                                 //
    //  param alpha : Procedural plane alpha to set                           //
    ////////////////////////////////////////////////////////////////////////////
    setAlpha: function(alpha)
    {
        this.alpha = alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setSpecularity : Set procedural plane specularity                     //
    //  param specularity : Procedural plane specularity to set               //
    ////////////////////////////////////////////////////////////////////////////
    setSpecularity: function(specularity)
    {
        this.specularity = specularity;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getX : Get procedural plane X position                                //
    //  return : Procedural plane X position                                  //
    ////////////////////////////////////////////////////////////////////////////
    getX: function()
    {
        return this.position.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getY : Get procedural plane Y position                                //
    //  return : Procedural plane Y position                                  //
    ////////////////////////////////////////////////////////////////////////////
    getY: function()
    {
        return this.position.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getWidth : Get procedural plane width                                 //
    //  return : Procedural plane width                                       //
    ////////////////////////////////////////////////////////////////////////////
    getWidth: function()
    {
        return this.size.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getHeight : Get procedural plane height                               //
    //  return : Procedural plane height                                      //
    ////////////////////////////////////////////////////////////////////////////
    getHeight: function()
    {
        return this.size.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngle : Get procedural plane rotation angle                        //
    //  return : Procedural plane rotation angle in degrees                   //
    ////////////////////////////////////////////////////////////////////////////
    getAngle: function()
    {
        return this.angles;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOffsetX : Get procedural plane offset X position                   //
    //  return : Procedural plane offset X position                           //
    ////////////////////////////////////////////////////////////////////////////
    getOffsetX: function()
    {
        return this.offset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getOffsetY : Get procedural plane offset Y position                   //
    //  return : Procedural plane offset Y position                           //
    ////////////////////////////////////////////////////////////////////////////
    getOffsetY: function()
    {
        return this.offset.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getTime : Get procedural plane time                                   //
    //  return : Procedural plane time                                        //
    ////////////////////////////////////////////////////////////////////////////
    getTime: function()
    {
        return this.time;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAlpha : Get procedural plane alpha                                 //
    //  return : Procedural plane alpha                                       //
    ////////////////////////////////////////////////////////////////////////////
    getAlpha: function()
    {
        return this.alpha;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  render : Render procedural plane                                      //
    //  param quality : Plane shader quality                                  //
    ////////////////////////////////////////////////////////////////////////////
    render: function(quality)
    {
        var upVec = new Vector3();
        var rotVec = new Vector3();
        var delta = new Vector3();
        var delta2 = new Vector3();
        var dotProduct = 0.0;

        // Set procedural plane model matrix
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

        // Render procedural plane
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.shader.bind();

            // Send high quality shader uniforms
            this.shadowsMatrix.setMatrix(this.renderer.shadows.projMatrix);
            this.shadowsMatrix.multiply(this.renderer.shadows.viewMatrix);

            this.shader.sendWorldMatrix(this.renderer.worldMatrix);
            this.shader.sendModelMatrix(this.modelMatrix);
            this.shader.sendUniformMat4(
                this.shadowsMatrixLocation, this.shadowsMatrix
            );
            this.shader.sendUniformVec3(
                this.cameraPosLocation, this.renderer.camera.position
            );
            this.shader.sendUniformVec3(
                this.worldLightVecUniform, this.renderer.worldLight.direction
            );
            this.shader.sendUniformVec4(
                this.worldLightColorUniform, this.renderer.worldLight.color
            );
            this.shader.sendUniformVec4(
                this.worldLightAmbientUniform, this.renderer.worldLight.ambient
            );
            this.shader.sendUniform(
                this.specularityUniform, this.specularity
            );
            this.shader.sendUniform(this.alphaUniform, this.alpha);
            this.shader.sendUniform(this.timeUniform, this.time);
            this.shader.sendUniformVec2(this.offsetUniform, this.offset);

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.dynamicLights.lightsTexture
            );
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.shadows.depthTexture
            );

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.shader, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE1);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

            // Unbind plane shader
            this.shader.unbind();
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality
            this.shaderMedium.bind();

            // Send medium quality shader uniforms
            this.shaderMedium.sendWorldMatrix(this.renderer.worldMatrix);
            this.shaderMedium.sendModelMatrix(this.modelMatrix);
            this.shaderMedium.sendUniformVec3(
                this.cameraPosLocationMedium, this.renderer.camera.position
            );
            this.shaderMedium.sendUniformVec3(
                this.worldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.shaderMedium.sendUniformVec4(
                this.worldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.shaderMedium.sendUniformVec4(
                this.worldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );
            this.shaderMedium.sendUniform(
                this.specularityUniformMedium, this.specularity
            );
            this.shaderMedium.sendUniform(
                this.alphaUniformMedium, this.alpha
            );
            this.shaderMedium.sendUniform(this.timeUniformMedium, this.time);
            this.shaderMedium.sendUniformVec2(
                this.offsetUniformMedium, this.offset
            );

            // Bind texture
            this.renderer.gl.activeTexture(this.renderer.gl.TEXTURE0);
            this.renderer.gl.bindTexture(
                this.renderer.gl.TEXTURE_2D,
                this.renderer.dynamicLights.lightsTexture
            );

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.shaderMedium, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind texture
            this.renderer.gl.bindTexture(this.renderer.gl.TEXTURE_2D, null);

            // Unbind procedural shader
            this.shaderMedium.unbind();
        }
        else
        {
            // Low quality
            this.shaderLow.bind();

            // Send low quality shader uniforms
            this.shaderLow.sendWorldMatrix(this.renderer.worldMatrix);
            this.shaderLow.sendUniform(this.alphaUniformLow, this.alpha);
            this.shaderLow.sendUniform(this.timeUniformLow, this.time);
            this.shaderLow.sendUniformVec2(this.offsetUniformLow, this.offset);

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.shaderLow, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind procedural shader
            this.shaderLow.unbind();
        }
    }
};
