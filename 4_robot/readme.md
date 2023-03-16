# 3D Robot
## Demos
1. A 3D cube 
2. each face has different colors
	3. #TO test the  prototype
	4. #TO review GLSL and webGL programs
3. Rotating 3D cube
4. Translating and Rotating 3d cube
## High-level Concepts
1. Hierarchy of the robot:
	- torso
		- head
		- upper (l/r) arms
			- lower (l/r) arms
1. Available Transformation
	- torso
		- `translation(x,y,z)`
		- `rotation(x,y)`
	- head
		- `rotation(x,y,z)`
	- upper arms
		- `rotation(y,z)`

## Data Structure
1. Hierarchy of the objects: Tree structure
	- ![[Pasted image 20230307205633.png]]
2. Tree: left child, right sibling
