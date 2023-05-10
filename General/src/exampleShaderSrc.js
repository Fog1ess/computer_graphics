// Dictionaries for both vertex shader and fragment shader.
let vertexShaderInfo = {
    uniformNames :  ["projMatrix", "modelToWorldMatrix", "viewMatrix"], // the name of uniform variables in the shader program
    attributeNames : ["vertPosition", "textureCoord", "vertNormal"], // the name of attributes in the shader program
    dataFieldNames : ["vertices", "texturecoords", "normals"], // field of the model data, used in interpreting the attributes data
    // Would need the data types of the attributes to 
    attributeDims : [3, 2, 3], // Suppose all the attributes are vectors.  
    attributeSizes : [4, 4, 4], // Number of bytes every attribute takes in JavaScript. For float32, it would be Float32Array.BYTES_PER_ELEMENT = 4.
    // the source code
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
    uniformNames : ["ambientLightColor", "lightDirection", "diffuseLightColor", "textureImage"],
    // no attributes for fragment shader
    source : `#version 300 es
    precision highp float;
    uniform vec4 ambientLightColor;
    uniform vec3 lightDirection;
    uniform vec4 diffuseLightColor;
    uniform sampler2D textureImage;

    in vec2 vTextureCoord;
    in vec3 vNormal;
    in vec4 vFragmentPosition;
    out vec4 fColor;

    void main(){
        // I ambient
        vec4 Ia = ambientLightColor * texture(textureImage, vTextureCoord).rgba;
        // I diffuse
        vec3 diffuseLightDirection = normalize(lightDirection - vFragmentPosition.xyz);
        float diffuseFactor = max(dot(vNormal, diffuseLightDirection), 0.0);
        // add them together
        fColor = diffuseLightColor * texture(textureImage, vTextureCoord).rgba * diffuseFactor + Ia;
    }
`};

export { vertexShaderInfo, fragmentShaderInfo };