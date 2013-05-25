about_webgl
===========

About WebGL Talk.

Outline:
1) WebGL
	A highly portable, low-level graphics library for the web
2) Introduction: 
	About me (R&D Ventures + Background)
3) What is it?
	Based on OpenGL ES 2.0, maps closely to the GPU
4) Not a talk about …
	… 3D content creation or 3D js libraries, like Threee.js
5) Overview:
	* Introducing the WebGL DOM API (library)
 	* some GLSL examples
 	* simple usage of vectors & matrices
 	* what next?
 	* links


6) ***Intro to the DOM API***
	"lightning history"
7) some concepts
	Stuff I wish I knew win I began messing around
8) It's NOT simple like <canvas>
	ex: context.drawThis(); // done.
9) an understanding of OpenGL ES 2.0 is helpful
	    • buffers, switches, state, load-compile-link-use, etc …
10) better debugging tools

11) The graphics pipeline 
	(diagram) - “more later”
12) basic workflow
	get a context / create *shaders & program / *VBOs / draw


13) ***some GLSL examples***

14) what is? like c / c++ but with helpers for CG 
	(built-in matrices / vectors / functions)
	gl_Position & gl_FragColor
15) (pipeline) 
	vertex + fragment shaders
16) lighting, normals, texture coords (?)

17) poor error feedback
	ex: does not like to mix ints & floats


18) ***simple usage of vectors & matrices***
19) Vectors:
	"Arrows:" can be points or displacements (direction / magnitude)
20) Unit Circle: 
	x --“... a circle with a radius of 1.0 is also a form of 1. It’s a rotating 1. So you can multiply something by this unit circle and in a way it’s kind of like multiplying by 1 except magic happens and things rotate.”
21) 4x4 matrix magic: types & operations
       model, projection & perspective (also identity)
22) model
	translate + rotate + scale + multiply
23) projection
	from pixels to clipspace ( could be to many other (x: curved) spaces.
24) perspective
	fit visible world (frustum) into clip space (tangent)?


25) ***what next?***
	“WebGL can make graphics & interactive and introspective by default.” - acko.net
26) Storytelling: 
	visualisations, image processing
27) games:
	ray casting / clickable objects, physics
28) art / demos, 
	particle effects,
29) presentation


30) ***links***
   - github repo of examples
   - watch these: https://www.udacity.com/course/cs291
   - and this: http://games.greggman.com/game/webgl-how-it-works/
   - http://learningwebgl.com/blog/?page_id=1217
   - https://www.shadertoy.com/
   - http://acko.net/blog/making-mathbox/ (webgl usage)
   
31) stuff to explore:
	post-processing (images effects) w/ FBOs
	shadows
	more shader programming
	clickable stuff - ray-casting
	particle effects
	optimisations 









