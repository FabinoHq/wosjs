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
//      renderer/uniforms.js : Renderer shader uniforms management            //
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
//  Uniforms class definition                                                 //
////////////////////////////////////////////////////////////////////////////////
function Uniforms()
{
    // Renderer pointer
    this.renderer = null;

    // Loader pointer
    this.loader = null;

    // Shadows matrix
    this.shadowsMatrix = new Matrix4x4();

    // Plane shader locations
    this.planeNormalMapLocation = null;
    this.planeSpecularMapLocation = null;
    this.planeLightsTextureLocation = null;
    this.planeLightsTextureLocationMedium = null;
    this.planeShadowsTextureLocation = null;
    this.planeShadowsMatrixUniform = null;
    this.planeCameraPosUniform = null;
    this.planeCameraPosUniformMedium = null;
    this.planeWorldLightVecUniform = null;
    this.planeWorldLightVecUniformMedium = null;
    this.planeWorldLightColorUniform = null;
    this.planeWorldLightColorUniformMedium = null;
    this.planeWorldLightAmbientUniform = null;
    this.planeWorldLightAmbientUniformMedium = null;

    // Animated plane shader locations
    this.animPlaneNormalMapLocation = null;
    this.animPlaneSpecularMapLocation = null;
    this.animPlaneLightsTextureLocation = null;
    this.animPlaneLightsTextureLocationMedium = null;
    this.animPlaneShadowsTextureLocation = null;
    this.animPlaneShadowsMatrixUniform = null;
    this.animPlaneCameraPosUniform = null;
    this.animPlaneCameraPosUniformMedium = null;
    this.animPlaneWorldLightVecUniform = null;
    this.animPlaneWorldLightVecUniformMedium = null;
    this.animPlaneWorldLightColorUniform = null;
    this.animPlaneWorldLightColorUniformMedium = null;
    this.animPlaneWorldLightAmbientUniform = null;
    this.animPlaneWorldLightAmbientUniformMedium = null;

    // Static mesh shader locations
    this.staticMeshNormalMapLocation = null;
    this.staticMeshSpecularMapLocation = null;
    this.staticMeshLightsTextureLocation = null;
    this.staticMeshLightsTextureLocationMedium = null;
    this.staticMeshShadowsTextureLocation = null;
    this.staticMeshShadowsMatrixUniform = null;
    this.staticMeshCameraPosUniform = null;
    this.staticMeshCameraPosUniformMedium = null;
    this.staticMeshWorldLightVecUniform = null;
    this.staticMeshWorldLightVecUniformMedium = null;
    this.staticMeshWorldLightColorUniform = null;
    this.staticMeshWorldLightColorUniformMedium = null;
    this.staticMeshWorldLightAmbientUniform = null;
    this.staticMeshWorldLightAmbientUniformMedium = null;
        
    // Skeletal mesh shader locations
    this.skeletalMeshBonesMatricesLocation = null;
    this.skeletalMeshBonesMatricesLocationMedium = null;
    this.skeletalMeshBonesMatricesLocationLow = null;
    this.skeletalMeshNormalMapLocation = null;
    this.skeletalMeshSpecularMapLocation = null;
    this.skeletalMeshLightsTextureLocation = null;
    this.skeletalMeshLightsTextureLocationMedium = null;
    this.skeletalMeshShadowsTextureLocation = null;
    this.skeletalMeshShadowsMatrixUniform = null;
    this.skeletalMeshCameraPosUniform = null;
    this.skeletalMeshCameraPosUniformMedium = null;
    this.skeletalMeshWorldLightVecUniform = null;
    this.skeletalMeshWorldLightVecUniformMedium = null;
    this.skeletalMeshWorldLightColorUniform = null;
    this.skeletalMeshWorldLightColorUniformMedium = null;
    this.skeletalMeshWorldLightAmbientUniform = null;
    this.skeletalMeshWorldLightAmbientUniformMedium = null;
}

Uniforms.prototype = {
    ////////////////////////////////////////////////////////////////////////////
    //  init : Init uniforms                                                  //
    //  param renderer : Renderer pointer                                     //
    //  param loader : Loader pointer                                         //
    //  return : True if uniforms is successfully loaded                      //
    ////////////////////////////////////////////////////////////////////////////
    init: function(renderer, loader)
    {
        // Reset uniforms
        this.renderer = null;
        this.loader = null;
        this.planeNormalMapLocation = null;
        this.planeSpecularMapLocation = null;
        this.planeLightsTextureLocation = null;
        this.planeLightsTextureLocationMedium = null;
        this.planeShadowsTextureLocation = null;
        this.planeShadowsMatrixUniform = null;
        this.planeCameraPosUniform = null;
        this.planeCameraPosUniformMedium = null;
        this.planeWorldLightVecUniform = null;
        this.planeWorldLightVecUniformMedium = null;
        this.planeWorldLightColorUniform = null;
        this.planeWorldLightColorUniformMedium = null;
        this.planeWorldLightAmbientUniform = null;
        this.planeWorldLightAmbientUniformMedium = null;
        this.animPlaneNormalMapLocation = null;
        this.animPlaneSpecularMapLocation = null;
        this.animPlaneLightsTextureLocation = null;
        this.animPlaneLightsTextureLocationMedium = null;
        this.animPlaneShadowsTextureLocation = null;
        this.animPlaneShadowsMatrixUniform = null;
        this.animPlaneCameraPosUniform = null;
        this.animPlaneCameraPosUniformMedium = null;
        this.animPlaneWorldLightVecUniform = null;
        this.animPlaneWorldLightVecUniformMedium = null;
        this.animPlaneWorldLightColorUniform = null;
        this.animPlaneWorldLightColorUniformMedium = null;
        this.animPlaneWorldLightAmbientUniform = null;
        this.animPlaneWorldLightAmbientUniformMedium = null;
        this.staticMeshNormalMapLocation = null;
        this.staticMeshSpecularMapLocation = null;
        this.staticMeshLightsTextureLocation = null;
        this.staticMeshLightsTextureLocationMedium = null;
        this.staticMeshShadowsTextureLocation = null;
        this.staticMeshShadowsMatrixUniform = null;
        this.staticMeshCameraPosUniform = null;
        this.staticMeshCameraPosUniformMedium = null;
        this.staticMeshWorldLightVecUniform = null;
        this.staticMeshWorldLightVecUniformMedium = null;
        this.staticMeshWorldLightColorUniform = null;
        this.staticMeshWorldLightColorUniformMedium = null;
        this.staticMeshWorldLightAmbientUniform = null;
        this.staticMeshWorldLightAmbientUniformMedium = null;
        this.skeletalMeshBonesMatricesLocation = null;
        this.skeletalMeshBonesMatricesLocationMedium = null;
        this.skeletalMeshBonesMatricesLocationLow = null;
        this.skeletalMeshNormalMapLocation = null;
        this.skeletalMeshSpecularMapLocation = null;
        this.skeletalMeshLightsTextureLocation = null;
        this.skeletalMeshLightsTextureLocationMedium = null;
        this.skeletalMeshShadowsTextureLocation = null;
        this.skeletalMeshShadowsMatrixUniform = null;
        this.skeletalMeshCameraPosUniform = null;
        this.skeletalMeshCameraPosUniformMedium = null;
        this.skeletalMeshWorldLightVecUniform = null;
        this.skeletalMeshWorldLightVecUniformMedium = null;
        this.skeletalMeshWorldLightColorUniform = null;
        this.skeletalMeshWorldLightColorUniformMedium = null;
        this.skeletalMeshWorldLightAmbientUniform = null;
        this.skeletalMeshWorldLightAmbientUniformMedium = null;

        // Set renderer pointer
        this.renderer = renderer;
        if (!this.renderer) return false;

        // Check gl pointer
        if (!this.renderer.gl) return false;

        // Set loader pointer
        this.loader = loader;
        if (!this.loader) return false;

        // Init shadows matrix
        if (!this.shadowsMatrix) return false;
        this.shadowsMatrix.setIdentity();

        // Get plane shaders uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.loader.planeShader.bind();
            this.planeNormalMapLocation =
                this.loader.planeShader.getUniform("normalMap");
            if (!this.planeNormalMapLocation) return false;
            this.loader.planeShader.sendIntUniform(
                this.planeNormalMapLocation, 2
            );
            this.planeSpecularMapLocation =
                this.loader.planeShader.getUniform("specularMap");
            if (!this.planeSpecularMapLocation) return false;
            this.loader.planeShader.sendIntUniform(
                this.planeSpecularMapLocation, 3
            );
            this.planeLightsTextureLocation =
                this.loader.planeShader.getUniform("lightsTexture");
            if (!this.planeLightsTextureLocation) return false;
            this.loader.planeShader.sendIntUniform(
                this.planeLightsTextureLocation, 4
            );
            this.planeShadowsTextureLocation =
                this.loader.planeShader.getUniform("shadowsTexture");
            if (!this.planeShadowsTextureLocation) return false;
            this.loader.planeShader.sendIntUniform(
                this.planeShadowsTextureLocation, 5
            );
            this.planeShadowsMatrixUniform =
                this.loader.planeShader.getUniform("shadowsMatrix");
            if (!this.planeShadowsMatrixUniform) return false;
            this.planeCameraPosUniform =
                this.loader.planeShader.getUniform("cameraPos");
            if (!this.planeCameraPosUniform) return false;
            this.planeWorldLightVecUniform =
                this.loader.planeShader.getUniform("worldLightVec");
            if (!this.planeWorldLightVecUniform) return false;
            this.planeWorldLightColorUniform =
                this.loader.planeShader.getUniform("worldLightColor");
            if (!this.planeWorldLightColorUniform) return false;
            this.planeWorldLightAmbientUniform =
                this.loader.planeShader.getUniform("worldLightAmbient");
            if (!this.planeWorldLightAmbientUniform) return false;
        }

        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.loader.planeShaderMedium.bind();
            this.planeLightsTextureLocationMedium =
                this.loader.planeShaderMedium.getUniform("lightsTexture");
            if (!this.planeLightsTextureLocationMedium) return false;
            this.loader.planeShaderMedium.sendIntUniform(
                this.planeLightsTextureLocationMedium, 4
            );
            this.planeCameraPosUniformMedium =
                this.loader.planeShaderMedium.getUniform("cameraPos");
            if (!this.planeCameraPosUniformMedium) return false;
            this.planeWorldLightVecUniformMedium =
                this.loader.planeShaderMedium.getUniform("worldLightVec");
            if (!this.planeWorldLightVecUniformMedium) return false;
            this.planeWorldLightColorUniformMedium =
                this.loader.planeShaderMedium.getUniform("worldLightColor");
            if (!this.planeWorldLightColorUniformMedium) return false;
            this.planeWorldLightAmbientUniformMedium =
                this.loader.planeShaderMedium.getUniform("worldLightAmbient");
            if (!this.planeWorldLightAmbientUniformMedium) return false;
        }

        // Get animated plane shaders uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.loader.animPlaneShader.bind();
            this.animPlaneNormalMapLocation =
                this.loader.animPlaneShader.getUniform("normalMap");
            if (!this.animPlaneNormalMapLocation) return false;
            this.loader.animPlaneShader.sendIntUniform(
                this.animPlaneNormalMapLocation, 2
            );
            this.animPlaneSpecularMapLocation =
                this.loader.animPlaneShader.getUniform("specularMap");
            if (!this.animPlaneSpecularMapLocation) return false;
            this.loader.animPlaneShader.sendIntUniform(
                this.animPlaneSpecularMapLocation, 3
            );
            this.animPlaneLightsTextureLocation =
                this.loader.animPlaneShader.getUniform("lightsTexture");
            if (!this.animPlaneLightsTextureLocation) return false;
            this.loader.animPlaneShader.sendIntUniform(
                this.animPlaneLightsTextureLocation, 4
            );
            this.animPlaneShadowsTextureLocation =
                this.loader.animPlaneShader.getUniform("shadowsTexture");
            if (!this.animPlaneShadowsTextureLocation) return false;
            this.loader.animPlaneShader.sendIntUniform(
                this.animPlaneShadowsTextureLocation, 5
            );
            this.animPlaneShadowsMatrixUniform =
                this.loader.animPlaneShader.getUniform("shadowsMatrix");
            if (!this.animPlaneShadowsMatrixUniform) return false;
            this.animPlaneCameraPosUniform =
                this.loader.animPlaneShader.getUniform("cameraPos");
            if (!this.animPlaneCameraPosUniform) return false;
            this.animPlaneWorldLightVecUniform =
                this.loader.animPlaneShader.getUniform("worldLightVec");
            if (!this.animPlaneWorldLightVecUniform) return false;
            this.animPlaneWorldLightColorUniform =
                this.loader.animPlaneShader.getUniform("worldLightColor");
            if (!this.animPlaneWorldLightColorUniform) return false;
            this.animPlaneWorldLightAmbientUniform =
                this.loader.animPlaneShader.getUniform("worldLightAmbient");
            if (!this.animPlaneWorldLightAmbientUniform) return false;
        }

        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.loader.animPlaneShaderMedium.bind();
            this.animPlaneLightsTextureLocationMedium =
                this.loader.animPlaneShaderMedium.getUniform("lightsTexture");
            if (!this.animPlaneLightsTextureLocationMedium) return false;
            this.loader.animPlaneShaderMedium.sendIntUniform(
                this.animPlaneLightsTextureLocationMedium, 4
            );
            this.animPlaneCameraPosUniformMedium =
                this.loader.animPlaneShaderMedium.getUniform("cameraPos");
            if (!this.animPlaneCameraPosUniformMedium) return false;
            this.animPlaneWorldLightVecUniformMedium =
                this.loader.animPlaneShaderMedium.getUniform("worldLightVec");
            if (!this.animPlaneWorldLightVecUniformMedium) return false;
            this.animPlaneWorldLightColorUniformMedium =
                this.loader.animPlaneShaderMedium.getUniform("worldLightColor");
            if (!this.animPlaneWorldLightColorUniformMedium) return false;
            this.animPlaneWorldLightAmbientUniformMedium =
                this.loader.animPlaneShaderMedium.getUniform(
                    "worldLightAmbient"
                );
            if (!this.animPlaneWorldLightAmbientUniformMedium) return false;
        }

        // Get static mesh shaders uniforms locations
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.loader.staticMeshShader.bind();
            this.staticMeshNormalMapLocation =
                this.loader.staticMeshShader.getUniform("normalMap");
            if (!this.staticMeshNormalMapLocation) return false;
            this.loader.staticMeshShader.sendIntUniform(
                this.staticMeshNormalMapLocation, 2
            );
            this.staticMeshSpecularMapLocation =
                this.loader.staticMeshShader.getUniform("specularMap");
            if (!this.staticMeshSpecularMapLocation) return false;
            this.loader.staticMeshShader.sendIntUniform(
                this.staticMeshSpecularMapLocation, 3
            );
            this.staticMeshLightsTextureLocation =
                this.loader.staticMeshShader.getUniform("lightsTexture");
            if (!this.staticMeshLightsTextureLocation) return false;
            this.loader.staticMeshShader.sendIntUniform(
                this.staticMeshLightsTextureLocation, 4
            );
            this.staticMeshShadowsTextureLocation =
                this.loader.staticMeshShader.getUniform("shadowsTexture");
            if (!this.staticMeshShadowsTextureLocation) return false;
            this.loader.staticMeshShader.sendIntUniform(
                this.staticMeshShadowsTextureLocation, 5
            );
            this.staticMeshShadowsMatrixUniform =
                this.loader.staticMeshShader.getUniform("shadowsMatrix");
            if (!this.staticMeshShadowsMatrixUniform) return false;
            this.staticMeshCameraPosUniform =
                this.loader.staticMeshShader.getUniform("cameraPos");
            if (!this.staticMeshCameraPosUniform) return false;
            this.staticMeshWorldLightVecUniform =
                this.loader.staticMeshShader.getUniform("worldLightVec");
            if (!this.staticMeshWorldLightVecUniform) return false;
            this.staticMeshWorldLightColorUniform =
                this.loader.staticMeshShader.getUniform("worldLightColor");
            if (!this.staticMeshWorldLightColorUniform) return false;
            this.staticMeshWorldLightAmbientUniform =
                this.loader.staticMeshShader.getUniform("worldLightAmbient");
            if (!this.staticMeshWorldLightAmbientUniform) return false;
        }

        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.loader.staticMeshShaderMedium.bind();
            this.staticMeshLightsTextureLocationMedium =
                this.loader.staticMeshShaderMedium.getUniform("lightsTexture");
            if (!this.staticMeshLightsTextureLocationMedium) return false;
            this.loader.staticMeshShaderMedium.sendIntUniform(
                this.staticMeshLightsTextureLocationMedium, 4
            );
            this.staticMeshCameraPosUniformMedium =
                this.loader.staticMeshShaderMedium.getUniform("cameraPos");
            if (!this.staticMeshCameraPosUniformMedium) return false;
            this.staticMeshWorldLightVecUniformMedium =
                this.loader.staticMeshShaderMedium.getUniform("worldLightVec");
            if (!this.staticMeshWorldLightVecUniformMedium) return false;
            this.staticMeshWorldLightColorUniformMedium =
                this.loader.staticMeshShaderMedium.getUniform(
                    "worldLightColor"
                );
            if (!this.staticMeshWorldLightColorUniformMedium) return false;
            this.staticMeshWorldLightAmbientUniformMedium =
                this.loader.staticMeshShaderMedium.getUniform(
                    "worldLightAmbient"
                );
            if (!this.staticMeshWorldLightAmbientUniformMedium) return false;
        }

        // Get skeletal mesh shaders uniforms location
        if (this.renderer.maxQuality >= WOSRendererQualityHigh)
        {
            this.loader.skeletalMeshShader.bind();
            this.skeletalMeshBonesMatricesLocation =
                this.loader.skeletalMeshShader.getUniform("bonesMatrices");
            if (!this.skeletalMeshBonesMatricesLocation) return false;
            this.loader.skeletalMeshShader.sendIntUniform(
                this.skeletalMeshBonesMatricesLocation, 1
            );
            this.skeletalMeshNormalMapLocation =
                this.loader.skeletalMeshShader.getUniform("normalMap");
            if (!this.skeletalMeshNormalMapLocation) return false;
            this.loader.skeletalMeshShader.sendIntUniform(
                this.skeletalMeshNormalMapLocation, 2
            );
            this.skeletalMeshSpecularMapLocation =
                this.loader.skeletalMeshShader.getUniform("specularMap");
            if (!this.skeletalMeshSpecularMapLocation) return false;
            this.loader.skeletalMeshShader.sendIntUniform(
                this.skeletalMeshSpecularMapLocation, 3
            );
            this.skeletalMeshLightsTextureLocation =
                this.loader.skeletalMeshShader.getUniform("lightsTexture");
            if (!this.skeletalMeshLightsTextureLocation) return false;
            this.loader.skeletalMeshShader.sendIntUniform(
                this.skeletalMeshLightsTextureLocation, 4
            );
            this.skeletalMeshShadowsTextureLocation =
                this.loader.skeletalMeshShader.getUniform("shadowsTexture");
            if (!this.skeletalMeshShadowsTextureLocation) return false;
            this.loader.skeletalMeshShader.sendIntUniform(
                this.skeletalMeshShadowsTextureLocation, 5
            );
            this.skeletalMeshShadowsMatrixUniform =
                this.loader.skeletalMeshShader.getUniform("shadowsMatrix");
            if (!this.skeletalMeshShadowsMatrixUniform) return false;
            this.skeletalMeshCameraPosUniform =
                this.loader.skeletalMeshShader.getUniform("cameraPos");
            if (!this.skeletalMeshCameraPosUniform) return false;
            this.skeletalMeshWorldLightVecUniform =
                this.loader.skeletalMeshShader.getUniform("worldLightVec");
            if (!this.skeletalMeshWorldLightVecUniform) return false;
            this.skeletalMeshWorldLightColorUniform =
                this.loader.skeletalMeshShader.getUniform("worldLightColor");
            if (!this.skeletalMeshWorldLightColorUniform) return false;
            this.skeletalMeshWorldLightAmbientUniform =
                this.loader.skeletalMeshShader.getUniform("worldLightAmbient");
            if (!this.skeletalMeshWorldLightAmbientUniform) return false;
        }

        if (this.renderer.maxQuality >= WOSRendererQualityMedium)
        {
            this.loader.skeletalMeshShaderMedium.bind();
            this.skeletalMeshBonesMatricesLocationMedium =
                this.loader.skeletalMeshShaderMedium.getUniform(
                    "bonesMatrices"
                );
            if (!this.skeletalMeshBonesMatricesLocationMedium) return false;
            this.loader.skeletalMeshShaderMedium.sendIntUniform(
                this.skeletalMeshBonesMatricesLocationMedium, 1
            );
            this.skeletalMeshLightsTextureLocationMedium =
                this.loader.skeletalMeshShaderMedium.getUniform(
                    "lightsTexture"
                );
            if (!this.skeletalMeshLightsTextureLocationMedium) return false;
            this.loader.skeletalMeshShaderMedium.sendIntUniform(
                this.skeletalMeshLightsTextureLocationMedium, 4
            );
            this.skeletalMeshCameraPosUniformMedium =
                this.loader.skeletalMeshShaderMedium.getUniform("cameraPos");
            if (!this.skeletalMeshCameraPosUniformMedium) return false;
            this.skeletalMeshWorldLightVecUniformMedium =
                this.loader.skeletalMeshShaderMedium.getUniform(
                    "worldLightVec"
                );
            if (!this.skeletalMeshWorldLightVecUniformMedium) return false;
            this.skeletalMeshWorldLightColorUniformMedium =
                this.loader.skeletalMeshShaderMedium.getUniform(
                    "worldLightColor"
                );
            if (!this.skeletalMeshWorldLightColorUniformMedium) return false;
            this.skeletalMeshWorldLightAmbientUniformMedium =
                this.loader.skeletalMeshShaderMedium.getUniform(
                    "worldLightAmbient"
                );
            if (!this.skeletalMeshWorldLightAmbientUniformMedium) return false;
        }

        this.loader.skeletalMeshShaderLow.bind();
        this.skeletalMeshBonesMatricesLocationLow =
            this.loader.skeletalMeshShaderLow.getUniform("bonesMatrices");
        if (!this.skeletalMeshBonesMatricesLocationLow) return false;
        this.loader.skeletalMeshShaderLow.sendIntUniform(
            this.skeletalMeshBonesMatricesLocationLow, 1
        );

        // Unbind shader
        this.renderer.gl.useProgram(null);

        // Uniforms successfully loaded
        return true;
    },

    ////////////////////////////////////////////////////////////////////////////
    //  update2DWorldMatrix : Upload 2D world matrices to GPU                 //
    ////////////////////////////////////////////////////////////////////////////
    update2DWorldMatrix: function()
    {
        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.view.viewMatrix);

        // Send world matrix uniform
        this.renderer.shader.bind();
        this.renderer.shader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.backrendererShader.bind();
        this.loader.backrendererShader.sendWorldMatrix(
            this.renderer.worldMatrix
        );
        this.loader.lineShader.bind();
        this.loader.lineShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.rectShader.bind();
        this.loader.rectShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.spriteShader.bind();
        this.loader.spriteShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.ninepatchShader.bind();
        this.loader.ninepatchShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.animSpriteShader.bind();
        this.loader.animSpriteShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.buttonShader.bind();
        this.loader.buttonShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.textBoxShader.bind();
        this.loader.textBoxShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.textSelectionShader.bind();
        this.loader.textSelectionShader.sendWorldMatrix(
            this.renderer.worldMatrix
        );
        this.loader.textCursorShader.bind();
        this.loader.textCursorShader.sendWorldMatrix(
            this.renderer.worldMatrix
        );
        this.loader.textButtonShader.bind();
        this.loader.textButtonShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.toggleButtonShader.bind();
        this.loader.toggleButtonShader.sendWorldMatrix(
            this.renderer.worldMatrix
        );
        this.loader.scrollBarShader.bind();
        this.loader.scrollBarShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.progressBarShader.bind();
        this.loader.progressBarShader.sendWorldMatrix(
            this.renderer.worldMatrix
        );
        this.loader.sliderBarShader.bind();
        this.loader.sliderBarShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.textShader.bind();
        this.loader.textShader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.pxTextShader.bind();
        this.loader.pxTextShader.sendWorldMatrix(this.renderer.worldMatrix);

        // Unbind shader
        this.renderer.gl.useProgram(null);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateWorldMatrix : Upload world matrices to GPU                      //
    //  param quality : Renderer shader quality                               //
    ////////////////////////////////////////////////////////////////////////////
    updateWorldMatrix: function(quality)
    {
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

        // Compute world matrix
        this.renderer.worldMatrix.setMatrix(this.renderer.camera.projMatrix);
        this.renderer.worldMatrix.multiply(this.renderer.camera.viewMatrix);

        // Send world matrix uniform
        this.renderer.shader.bind();
        this.renderer.shader.sendWorldMatrix(this.renderer.worldMatrix);
        this.loader.backrendererShader.bind();
        this.loader.backrendererShader.sendWorldMatrix(
            this.renderer.worldMatrix
        );
        if (quality == WOSRendererQualityHigh)
        {
            // High quality shaders
            this.loader.planeShader.bind();
            this.loader.planeShader.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.animPlaneShader.bind();
            this.loader.animPlaneShader.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.staticMeshShader.bind();
            this.loader.staticMeshShader.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.skeletalMeshShader.bind();
            this.loader.skeletalMeshShader.sendWorldMatrix(
                this.renderer.worldMatrix
            );
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Medium quality shaders
            this.loader.planeShaderMedium.bind();
            this.loader.planeShaderMedium.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.animPlaneShaderMedium.bind();
            this.loader.animPlaneShaderMedium.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.staticMeshShaderMedium.bind();
            this.loader.staticMeshShaderMedium.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.skeletalMeshShaderMedium.bind();
            this.loader.skeletalMeshShaderMedium.sendWorldMatrix(
                this.renderer.worldMatrix
            );
        }
        else
        {
            // Low quality shaders
            this.loader.planeShaderLow.bind();
            this.loader.planeShaderLow.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.animPlaneShaderLow.bind();
            this.loader.animPlaneShaderLow.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.staticMeshShaderLow.bind();
            this.loader.staticMeshShaderLow.sendWorldMatrix(
                this.renderer.worldMatrix
            );
            this.loader.skeletalMeshShaderLow.bind();
            this.loader.skeletalMeshShaderLow.sendWorldMatrix(
                this.renderer.worldMatrix
            );
        }

        // Unbind shader
        this.renderer.gl.useProgram(null);
    },

    ////////////////////////////////////////////////////////////////////////////
    //  updateWorldLighting : Upload lighting uniforms to GPU                 //
    //  param quality : Renderer shader quality                               //
    ////////////////////////////////////////////////////////////////////////////
    updateWorldLighting: function(quality)
    {
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

        // Update lighting uniforms
        if (quality == WOSRendererQualityHigh)
        {
            // Compute shadows matrix
            this.shadowsMatrix.setMatrix(
                this.renderer.shadows.camera.projMatrix
            );
            this.shadowsMatrix.multiply(
                this.renderer.shadows.camera.viewMatrix
            );

            // Update high quality plane
            this.loader.planeShader.bind();
            this.loader.planeShader.sendUniformMat4(
                this.planeShadowsMatrixUniform,
                this.shadowsMatrix
            );
            this.loader.planeShader.sendUniformVec3(
                this.planeCameraPosUniform,
                this.renderer.camera.position
            );
            this.loader.planeShader.sendUniformVec3(
                this.planeWorldLightVecUniform,
                this.renderer.worldLight.direction
            );
            this.loader.planeShader.sendUniformVec4(
                this.planeWorldLightColorUniform,
                this.renderer.worldLight.color
            );
            this.loader.planeShader.sendUniformVec4(
                this.planeWorldLightAmbientUniform,
                this.renderer.worldLight.ambient
            );

            // Update high quality animated plane
            this.loader.animPlaneShader.bind();
            this.loader.animPlaneShader.sendUniformMat4(
                this.animPlaneShadowsMatrixUniform,
                this.shadowsMatrix
            );
            this.loader.animPlaneShader.sendUniformVec3(
                this.animPlaneCameraPosUniform,
                this.renderer.camera.position
            );
            this.loader.animPlaneShader.sendUniformVec3(
                this.animPlaneWorldLightVecUniform,
                this.renderer.worldLight.direction
            );
            this.loader.animPlaneShader.sendUniformVec4(
                this.animPlaneWorldLightColorUniform,
                this.renderer.worldLight.color
            );
            this.loader.animPlaneShader.sendUniformVec4(
                this.animPlaneWorldLightAmbientUniform,
                this.renderer.worldLight.ambient
            );

            // Update high quality static mesh
            this.loader.staticMeshShader.bind();
            this.loader.staticMeshShader.sendUniformMat4(
                this.staticMeshShadowsMatrixUniform,
                this.shadowsMatrix
            );
            this.loader.staticMeshShader.sendUniformVec3(
                this.staticMeshCameraPosUniform,
                this.renderer.camera.position
            );
            this.loader.staticMeshShader.sendUniformVec3(
                this.staticMeshWorldLightVecUniform,
                this.renderer.worldLight.direction
            );
            this.loader.staticMeshShader.sendUniformVec4(
                this.staticMeshWorldLightColorUniform,
                this.renderer.worldLight.color
            );
            this.loader.staticMeshShader.sendUniformVec4(
                this.staticMeshWorldLightAmbientUniform,
                this.renderer.worldLight.ambient
            );

            // Update high quality skeletal mesh
            this.loader.skeletalMeshShader.bind();
            this.loader.skeletalMeshShader.sendUniformMat4(
                this.skeletalMeshShadowsMatrixUniform,
                this.shadowsMatrix
            );
            this.loader.skeletalMeshShader.sendUniformVec3(
                this.skeletalMeshCameraPosUniform,
                this.renderer.camera.position
            );
            this.loader.skeletalMeshShader.sendUniformVec3(
                this.skeletalMeshWorldLightVecUniform,
                this.renderer.worldLight.direction
            );
            this.loader.skeletalMeshShader.sendUniformVec4(
                this.skeletalMeshWorldLightColorUniform,
                this.renderer.worldLight.color
            );
            this.loader.skeletalMeshShader.sendUniformVec4(
                this.skeletalMeshWorldLightAmbientUniform,
                this.renderer.worldLight.ambient
            );
        }
        else if (quality == WOSRendererQualityMedium)
        {
            // Update medium quality plane
            this.loader.planeShaderMedium.bind();
            this.loader.planeShaderMedium.sendUniformVec3(
                this.planeCameraPosUniformMedium,
                this.renderer.camera.position
            );
            this.loader.planeShaderMedium.sendUniformVec3(
                this.planeWorldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.loader.planeShaderMedium.sendUniformVec4(
                this.planeWorldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.loader.planeShaderMedium.sendUniformVec4(
                this.planeWorldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );

            // Update medium quality animated plane
            this.loader.animPlaneShaderMedium.bind();
            this.loader.animPlaneShaderMedium.sendUniformVec3(
                this.animPlaneCameraPosUniformMedium,
                this.renderer.camera.position
            );
            this.loader.animPlaneShaderMedium.sendUniformVec3(
                this.animPlaneWorldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.loader.animPlaneShaderMedium.sendUniformVec4(
                this.animPlaneWorldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.loader.animPlaneShaderMedium.sendUniformVec4(
                this.animPlaneWorldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );

            // Update medium quality static mesh
            this.loader.staticMeshShaderMedium.bind();
            this.loader.staticMeshShaderMedium.sendUniformVec3(
                this.staticMeshCameraPosUniformMedium,
                this.renderer.camera.position
            );
            this.loader.staticMeshShaderMedium.sendUniformVec3(
                this.staticMeshWorldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.loader.staticMeshShaderMedium.sendUniformVec4(
                this.staticMeshWorldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.loader.staticMeshShaderMedium.sendUniformVec4(
                this.staticMeshWorldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );

            // Update medium quality skeletal mesh
            this.loader.skeletalMeshShaderMedium.bind();
            this.loader.skeletalMeshShaderMedium.sendUniformVec3(
                this.skeletalMeshCameraPosUniformMedium,
                this.renderer.camera.position
            );
            this.loader.skeletalMeshShaderMedium.sendUniformVec3(
                this.skeletalMeshWorldLightVecUniformMedium,
                this.renderer.worldLight.direction
            );
            this.loader.skeletalMeshShaderMedium.sendUniformVec4(
                this.skeletalMeshWorldLightColorUniformMedium,
                this.renderer.worldLight.color
            );
            this.loader.skeletalMeshShaderMedium.sendUniformVec4(
                this.skeletalMeshWorldLightAmbientUniformMedium,
                this.renderer.worldLight.ambient
            );
        }

        // Unbind shader
        this.renderer.gl.useProgram(null);
    }
};
