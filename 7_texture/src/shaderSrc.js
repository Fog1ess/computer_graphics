let vertexShaderInfo = {
    uniformNames :  ["projMatrix", "modelToWorldMatrix", "viewMatrix"],
    attributeNames : ["vertPosition", "textureCoord", "vertNormal"],
    attributeDims : [3, 2, 3],
    source : `#version 300 es

    in vec3 vertPosition;
    in vec2 textureCoord;
    in vec3 vertNormal;
    
    uniform mat4 projMatrix;
    uniform mat4 modelToWorldMatrix;
    uniform mat4 viewMatrix;  
    
    out vec2 vTextureCoord;
    out vec3 vNormal;
    out vec4 vFragmentPosition;
    
    void main(){
        
        vTextureCoord = textureCoord;
        
        mat4 normalMatrix = transpose(inverse( viewMatrix * modelToWorldMatrix));
        vNormal = normalize(vec3( normalMatrix * vec4(vertNormal, 0.0)));
        vFragmentPosition = viewMatrix * modelToWorldMatrix * vec4(vertPosition, 1.0); // vertex position in world space
        gl_Position = projMatrix * viewMatrix * modelToWorldMatrix * vec4(vertPosition,1.0);
    }`,
};

let fragmentShaderInfo = {
    uniformNames : ["ambientLightColor", "lightDirection", "diffuseLightColor", "texture"],
    source : `#version 300 es
    precision highp float;
    uniform vec3 ambientLightColor;
    uniform vec3 lightDirection;
    uniform vec3 diffuseLightColor;
    uniform sampler2D texture;

    in vec2 vTextureCoord;
    in vec3 vNormal;
    in vec4 vFragmentPosition;
    out vec4 fColor;

    void main(){
        // I ambient
        vec3 Ia = ambientLightColor * texture2D(texture, vTextureCoord).rgb;
        // I diffuse
        vec3 diffuseLightDirection = normalize(lightDirection - vFragmentPosition.xyz);
        float diffuseFactor = max(dot(vNormal, diffuseLightDirection), 0.0);
        // add them together
        fColor = vec4(diffuseLightColor * texture2D(texture, vTextureCoord).rgb * diffuseFactor + Ia, 1.0);
    }
`};

export { vertexShaderInfo, fragmentShaderInfo };