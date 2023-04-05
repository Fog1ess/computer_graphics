let vertexShaderSrc = 
`#version 300 es
// attributes
in vec3 vertPosition;
in vec3 vertColor;
in vec3 vertNormal;

uniform mat4 projMatrix;
uniform mat4 modelToWorldMatrix;
uniform mat4 viewMatrix;  

uniform vec3 ambientLightColor;

uniform vec3 lightLocation;

uniform vec3 diffuseLightColor;

out vec4 passToFragColor;

void main(){
    
    gl_Position = projMatrix * viewMatrix * modelToWorldMatrix * vec4(vertPosition,1.0);


    
    // Iambient
    vec3 Ia = ambientLightColor * vertColor;

    // calculate Idiffuse = IdiffuseColor * vertColor * ( N* L) 
    // need unit vectors and 
    // transpose(inverse(viewMatrix * modelMatrix)). The Transpose-Inverse matrix is used to orientate normals
    mat4 normalMatrix = transpose(inverse( viewMatrix * modelToWorldMatrix));

    // get normal after it was moved to world space, multiply it by the normalMatrix and normlize
    vec3 N = normalize(vec3( normalMatrix * vec4(vertNormal, 0.0)));
   
    // Now calcuate L by
    // 1. get vertex position in world space
    vec3 fragPosition = vec3(modelToWorldMatrix * vec4(vertPosition, 1.0)) ; 
    vec3 lightDirection = lightLocation - fragPosition;

    // 2. subtract to get vector to light from vertex position. this gives us L
    vec3 diffuseLightDirection = normalize( lightDirection - fragPosition); // get a vector from point to light source
    

    vec3 L = diffuseLightDirection ; 
    float lambert = max(0.0, dot(N, L));
    passToFragColor = vec4(diffuseLightColor.xyz * vertColor  * lambert + Ia, 1.0);
    
}`;

let fragmentShaderSrc = 
`#version 300 es
precision highp float;
in vec4 passToFragColor;
out vec4 f_color;

void main(){
    f_color = passToFragColor;
}
`; 
export { vertexShaderSrc, fragmentShaderSrc };