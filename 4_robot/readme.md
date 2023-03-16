# 3D Robot
## Modeling a 3D cube
- each face has different color
- OOP in JavaScript (prototype)
## Affine Transformation
- Translating and Rotating 3d cube
- Matrix multiplication
## Hierarchical Structure

# Implementation
1. Hierarchy of the robot:
	- torso
		- head
		- upper arms
			- lower arms
1. Available Transformation
	- torso
		- `translation(x,y,z)`
		- `rotation(x,y)`
	- head
		- `rotation(x,y,z)`
	- upper arms
		- `rotation(y,z)`
	- lower arms
		- `rotation(z)`

1. Hierarchy of the objects: Tree structure
	- left child, right sibling
