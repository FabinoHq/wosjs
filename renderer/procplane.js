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

    // Procedural plane shader uniforms locations
    this.specularityUniform = null;
    this.specularityUniformMedium = null;
    this.alphaUniform = null;
    this.alphaUniformMedium = null;
    this.alphaUniformLow = null;
    this.timeUniform = null;
    this.timeUniformMedium = null;
    this.timeUniformLow = null;
    this.offsetUniform = null;
    this.offsetUniformMedium = null;
    this.offsetUniformLow = null;

    // Procedural plane billboard mode
    this.billboard = WOSPlaneBillboardNone;
    // Procedural plane position
    this.position = new Vector3(0.0, 0.0, 0.0);
    // Procedural plane size
    this.size = new Vector2(1.0, 1.0);
    // Procedural plane rotation angle
    this.angles = new Vector4(0.0, 0.0, 0.0, 0.0);
    // Procedural plane offset
    this.offset = new Vector2(0.0, 0.0);
    // Procedural plane time
    this.time = 0.0;
    // Procedural plane alpha
    this.alpha = 1.0;
    // Procedural plane specularity
    this.specularity = 0.0;

    // VecMat 4x4 model matrix
    this.vecmat = new VecMat4x4();

    // Temp vectors
    this.lookAtVec = new Vector3();
    this.rotVec = new Vector3();
    this.delta = new Vector3();
    this.delta2 = new Vector3();
}

ProcPlane.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init procedural plane                                          //
    //  param shader : Procedural plane shader                                //
    //  param shaderMedium : Procedural plane medium shader                   //
    //  param shaderLow : Procedural plane low shader                         //
    //  param width : Procedural plane width                                  //
    //  param height : Procedural plane height                                //
    //  return : True if procedural plane is successfully loaded              //
    ////////////////////////////////////////////////////////////////////////////
    init: function(shader, shaderMedium, shaderLow, width, height)
    {
        // Reset procedural plane
        this.shader = null;
        this.shaderMedium = null;
        this.shaderLow = null;
        if (!this.modelMatrix) return false;
        this.modelMatrix.setIdentity();
        this.specularityUniform = null;
        this.specularityUniformMedium = null;
        this.alphaUniform = null;
        this.alphaUniformMedium = null;
        this.alphaUniformLow = null;
        this.timeUniform = null;
        this.timeUniformMedium = null;
        this.timeUniformLow = null;
        this.offsetUniform = null;
        this.offsetUniformMedium = null;
        this.offsetUniformLow = null;
        this.billboard = WOSPlaneBillboardNone;
        if (!this.position) return false;
        this.position.reset();
        if (!this.size) return false;
        this.size.setXY(1.0, 1.0);
        if (width !== undefined) this.size.vec[0] = width;
        if (height !== undefined) this.size.vec[1] = height;
        if (!this.angles) return false;
        this.angles.reset();
        if (!this.offset) return false;
        this.offset.reset();
        this.time = 0.0;
        this.alpha = 1.0;
        this.specularity = 0.0;
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

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Init shader
        this.shaderLow = shaderLow;
        if (!this.shaderLow) return false;

        // Init high quality shader
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.shader = shader;
            if (!this.shader) return false;
            this.shader.bind();

            // Get plane shader uniforms locations
            this.specularityUniform = this.shader.getUniform("specularity");
            this.alphaUniform = this.shader.getUniform("alpha");
            this.timeUniform = this.shader.getUniform("time");
            this.offsetUniform = this.shader.getUniform("offset");
            this.shader.unbind();
        }

        // Init medium quality shader
        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.shaderMedium = shaderMedium;
            if (!this.shaderMedium) return false;
            this.shaderMedium.bind();

            // Get medium plane shader uniforms locations
            this.shaderMedium.bind();
            this.specularityUniformMedium =
                this.shaderMedium.getUniform("specularity");
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

        // Procedural plane successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setBillboard : Set procedural plane billboard mode                    //
    //  param billboard : Procedural plane billboard mode                     //
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
    //  setAngles : Set procedural plane rotation angles                      //
    //  param angleX : Procedural plane X rotation angle to set in radians    //
    //  param angleY : Procedural plane Y rotation angle to set in radians    //
    //  param angleZ : Procedural plane Z rotation angle to set in radians    //
    ////////////////////////////////////////////////////////////////////////////
    setAngles: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] = angleX;
        this.angles.vec[1] = angleY;
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAnglesVec3 : Set procedural plane rotation angles from a vector    //
    //  param angles : 3 component angles vector to rotate procedural plane   //
    ////////////////////////////////////////////////////////////////////////////
    setAnglesVec3: function(angles)
    {
        this.angles.vec[0] = angles.vec[0];
        this.angles.vec[1] = angles.vec[1];
        this.angles.vec[2] = angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleX : Set procedural plane rotation X angle                     //
    //  param angleX : Procedural plane rotation X angle to set in radians    //
    ////////////////////////////////////////////////////////////////////////////
    setAngleX: function(angleX)
    {
        this.angles.vec[0] = angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleY : Set procedural plane rotation Y angle                     //
    //  param angleY : Procedural plane rotation Y angle to set in radians    //
    ////////////////////////////////////////////////////////////////////////////
    setAngleY: function(angleY)
    {
        this.angles.vec[1] = angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  setAngleZ : Set procedural plane rotation Z angle                     //
    //  param angleZ : Procedural plane rotation Z angle to set in radians    //
    ////////////////////////////////////////////////////////////////////////////
    setAngleZ: function(angleZ)
    {
        this.angles.vec[2] = angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotate : Rotate procedural plane                                      //
    //  param angleX : X angle to rotate procedural plane by in radians       //
    //  param angleY : Y angle to rotate procedural plane by in radians       //
    //  param angleZ : Z angle to rotate procedural plane by in radians       //
    ////////////////////////////////////////////////////////////////////////////
    rotate: function(angleX, angleY, angleZ)
    {
        this.angles.vec[0] += angleX;
        this.angles.vec[1] += angleY;
        this.angles.vec[2] += angleZ;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateVec3 : Rotate procedural plane with a vector                    //
    //  param angles : 3 component angles vector to rotate procedural plane   //
    ////////////////////////////////////////////////////////////////////////////
    rotateVec3: function(angles)
    {
        this.angles.vec[0] += angles.vec[0];
        this.angles.vec[1] += angles.vec[1];
        this.angles.vec[2] += angles.vec[2];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateX : Rotate procedural plane around the X axis                   //
    //  param angleX : X angle to rotate procedural plane by in radians       //
    ////////////////////////////////////////////////////////////////////////////
    rotateX: function(angleX)
    {
        this.angles.vec[0] += angleX;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateY : Rotate procedural plane around the Y axis                   //
    //  param angleY : Y angle to rotate procedural plane by in radians       //
    ////////////////////////////////////////////////////////////////////////////
    rotateY: function(angleY)
    {
        this.angles.vec[1] += angleY;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  rotateZ : Rotate procedural plane around the Z axis                   //
    //  param angleZ : Z angle to rotate procedural plane by in radians       //
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
    //  getAngleX : Get procedural plane rotation X angle                     //
    //  return : Procedural plane rotation X angle in radians                 //
    ////////////////////////////////////////////////////////////////////////////
    getAngleX: function()
    {
        return this.angles.vec[0];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleY : Get procedural plane rotation Y angle                     //
    //  return : Procedural plane rotation Y angle in radians                 //
    ////////////////////////////////////////////////////////////////////////////
    getAngleY: function()
    {
        return this.angles.vec[1];
    },

    ////////////////////////////////////////////////////////////////////////////
    //  getAngleZ : Get procedural plane rotation Z angle                     //
    //  return : Procedural plane rotation Z angle in radians                 //
    ////////////////////////////////////////////////////////////////////////////
    getAngleZ: function()
    {
        return this.angles.vec[2];
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
        var dotProduct = 0.0;
        var angle = 0.0;

        // Set procedural plane model matrix
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

        // Render procedural plane
        if (quality == WOSRendererQualityHigh)
        {
            // High quality
            this.shader.bind();

            // Send high quality shader uniforms
            this.shader.sendModelVecmat(this.vecmat);
            if (this.specularityUniform)
            {
                this.shader.sendUniform(
                    this.specularityUniform, this.specularity
                );
            }
            if (this.alphaUniform)
            {
                this.shader.sendUniform(this.alphaUniform, this.alpha);
            }
            if (this.timeUniform)
            {
                this.shader.sendUniform(this.timeUniform, this.time);
            }
            if (this.offsetUniform)
            {
                this.shader.sendUniformVec2(this.offsetUniform, this.offset);
            }

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.shader, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind plane shader
            this.shader.unbind();
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality
            this.shaderMedium.bind();

            // Send medium quality shader uniforms
            this.shaderMedium.sendModelVecmat(this.vecmat);
            if (this.specularityUniformMedium)
            {
                this.shaderMedium.sendUniform(
                    this.specularityUniformMedium, this.specularity
                );
            }
            if (this.alphaUniformMedium)
            {
                this.shaderMedium.sendUniform(
                    this.alphaUniformMedium, this.alpha
                );
            }
            if (this.timeUniformMedium)
            {
                this.shaderMedium.sendUniform(
                    this.timeUniformMedium, this.time
                );
            }
            if (this.offsetUniformMedium)
            {
                this.shaderMedium.sendUniformVec2(
                    this.offsetUniformMedium, this.offset
                );
            }

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.shaderMedium, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind procedural shader
            this.shaderMedium.unbind();
        }
        else
        {
            // Low quality
            this.shaderLow.bind();

            // Send low quality shader uniforms
            this.shaderLow.sendModelVecmat(this.vecmat);
            if (this.alphaUniformLow)
            {
                this.shaderLow.sendUniform(this.alphaUniformLow, this.alpha);
            }
            if (this.timeUniformLow)
            {
                this.shaderLow.sendUniform(this.timeUniformLow, this.time);
            }
            if (this.offsetUniformLow)
            {
                this.shaderLow.sendUniformVec2(
                    this.offsetUniformLow, this.offset
                );
            }

            // Render VBO
            this.renderer.planeVertexBuffer.bind();
            this.renderer.planeVertexBuffer.render(this.shaderLow, quality);
            this.renderer.planeVertexBuffer.unbind();

            // Unbind procedural shader
            this.shaderLow.unbind();
        }
    }
};
