// Section 1 a textured, rotating 'T'

function section1 () {
    // Get A WebGL context
    var canvas = document.getElementById("1");
    var gl = getWebGLContext(canvas); // , {preserveDrawingBuffer: true});
	var model_verts = [];
	var num_tris = 0;
    var num_verts = 0;
    var tex_coords = [];
    var tex;

    if (!gl) {
        return;
    } 
    // else {
    //     console.log('got it');
    // }

    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.enable(gl.CULL_FACE); // 'switch' to enable backface culling
    gl.enable(gl.DEPTH_TEST); // another 'switch'
    // gl.clearColor(0.0, 0.0, 0.0, 0.1);

    // setup GLSL program
    vertexShader = createShaderFromScriptElement(gl, "s1-vertex-shader");
    fragmentShader = createShaderFromScriptElement(gl, "s1-fragment-shader");
    program = createProgram(gl, [vertexShader, fragmentShader]);
    gl.useProgram(program);

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    
    var textureLocation = gl.getAttribLocation(program, "a_tex_coord");
    // var colorLocation = gl.getAttribLocation(program, "a_color");

    // lookup uniforms
    var matrixLocation = gl.getUniformLocation(program, "u_matrix");
    var samplerLocation = gl.getUniformLocation(program, "u_sampler");

    function createGeo () {
	    // Create a buffer.
	    var buffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	    gl.enableVertexAttribArray(positionLocation);
	    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

	    // Set Geometry.
	    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(model_verts), gl.STATIC_DRAW);

	    // doGeoColors();
        initTexture();
	}

	function doGeoColors () {
	    // Create a buffer for colors.
	    var buffer = gl.createBuffer();
	    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	    gl.enableVertexAttribArray(colorLocation);
	    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0); // We'll supply RGB as bytes.

	    // Set Colors.
	    // setColors();
	}

	function setColors () {
		var colors = [255, 192, 128, 64, 0];
		var model_colors = [];
		var random_r = random_g = random_b = 0,
			rand_val = 0;

		for (var i = 0; i < num_tris; i++) {
			if (i % 3 === 0 && Math.random() < 0.11) {
				// from palet
				// random_r = colors[Math.floor(Math.random() * colors.length)];
				// random_g = colors[Math.floor(Math.random() * colors.length)];
				// random_b = colors[Math.floor(Math.random() * colors.length)];

				// straight-up random
				random_r = Math.floor(Math.floor(Math.random() * 255));
				random_g = Math.floor(Math.floor(Math.random() * 255));
				random_b = Math.floor(Math.floor(Math.random() * 255));

				rand_val = Math.floor(Math.random() * 255);
			}

			model_colors.push(random_r);
			model_colors.push(random_g);
			model_colors.push(random_b);

			// // grayscale
			// model_colors.push(rand_val);
			// model_colors.push(rand_val);
			// model_colors.push(rand_val);

		}

		// console.log(model_verts, num_tris, model_colors);

		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(model_colors), gl.STATIC_DRAW);

		drawLoop();
	}


	function initTexture () {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		gl.enableVertexAttribArray(textureLocation);
		gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tex_coords), gl.STATIC_DRAW);

		tex = gl.createTexture();
		tex.image = new Image();
		tex.image.onload = function() {
			handleLoadedTexture(tex);
		};

		tex.image.src = "textures/t_ao.png";
	}

	function handleLoadedTexture (texture) {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);

        drawLoop();
	}

	function loadModel () {
		var ajax = new XMLHttpRequest();

		ajax.onreadystatechange = function () {
			if (ajax.readyState === 4 && ajax.status === 200) {

				// Parse Model Data
				var script = ajax.responseText.split("\n"),
					line = '',
					row = [],
					f_values = [],
					f_index = 0.0,
					vertices = [],
					vertex_map = [],
					triangles = [],
					textures = [],
					texture_map = [],
				// var normals = [];
				// var normal_map = [];
					counter = 0;

				for (var l in script) {
					line = script[l];

					// vertex Line
					if (line.substring(0,2) == "v ") {

						row = line.substring(2).split(" ");
						vertices.push({ x: parseFloat(row[0]), y: parseFloat(row[1]), z: parseFloat(row[2]) });

					} else if (line.substring(0,2) == "vt") {
					 	// texture line
						row = line.substring(3).split(" ");
						textures.push({x:parseFloat(row[0]), y:parseFloat(row[1])});

					// } else if(line.substring(0,2) == "vn") {
					// 	// normal line
					// 	row = line.substring(3).split(" ");
					// 	normals.push({X : parseFloat(row[0]), Y : parseFloat(row[1]), Z : parseFloat(row[2]) });

					} else if(line.substring(0,2) == "f ") {
						// 'face' line
						row = line.substring(2).split(" ");

						for (var t in row) {
							// Remove Blank Entries
							if(row[t] !== "") {
								// If this is a multi-value entry
								if(row[t].indexOf("/") != -1) {

									f_values = row[t].split("/"); //Split the different values
									triangles.push(counter); //Increment the triangles Array
									counter++;

									// insert vertices
									f_index = parseInt(f_values[0]) - 1;
									vertex_map.push(vertices[f_index].x);
									vertex_map.push(vertices[f_index].y);
									vertex_map.push(vertices[f_index].z);

									// insert textures
									f_index = parseInt(f_values[1]) - 1;
									texture_map.push(textures[f_index].x);
									texture_map.push(textures[f_index].y);

									//If this Entry Has normals Data
									// if(f_values.length>2) {
									// 	//Insert normals
									// 	f_index = parseInt(f_values[2]) - 1;
									// 	normal_map.push(normals[f_index].x);
									// 	normal_map.push(normals[f_index].y);
									// 	normal_map.push(normals[f_index].z);
									// }
								}
								// else { //For single value entries
								// 	triangles.push(counter); //Increment the triangles Array
								// 	counter++;

								// 	f_index = parseInt(row[t]) - 1;
								// 	vertex_map.push(vertices[f_index].x);
								// 	vertex_map.push(vertices[f_index].y);
								// 	vertex_map.push(vertices[f_index].z);
								// }
							}
						}
					}

				}
				model_verts = vertex_map;
				num_tris = model_verts.length / 3;
				tex_coords = texture_map;
				// console.log(num_tris, tex_coords.length / 2);

				createGeo();
			}
		};

		ajax.open("GET", "obj/T.obj", true);
		// ajax.open("GET", "obj/asaro_03.obj", true);
		// ajax.open("GET", "obj/ball.obj", true);
		// ajax.open("GET", "obj/box0.obj", true);
		// ajax.open("GET", "obj/box2.obj", true);
		// ajax.open("GET", "obj/bunny_high.obj", true);
		// ajax.open("GET", "obj/tri.obj", true);

		//   ajax.open("GET", "obj/R.obj", true); // messed up!
		//   ajax.open("GET", "obj/ball2.obj", true); // messed up!
		//   ajax.open("GET", "obj/box.obj", true); // messed up
		//   ajax.open("GET", "obj/bunny_low.obj", true); // ???
		//   ajax.open("GET", "obj/duck.obj", true); // ???
		//   ajax.open("GET", "obj/teapot.obj", true); // ???

		ajax.send();
	}

    var translation = [0, -150, -360];
    //var rotation = [degreesToRadians(190), degreesToRadians(40), degreesToRadians(320)];
    var rotation = [0, degreesToRadians(40), 0];
    var scale = [200, 200, 200];
    var fieldOfViewRadians = degreesToRadians(60);
    var angleInDegrees = 0, angleInRadians = 0;

    // drawLoop();
    loadModel();

    function drawLoop () {
        requestAnimationFrame(drawLoop);
        drawScene();
    }
    // Draw the scene.
    function drawScene() {
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        //angleInDegrees -= 2;
        rotation[1] = degreesToRadians(angleInDegrees*0.5);
        // rotation[2] = degreesToRadians(angleInDegrees);

        // Clear the canvas AND the depth buffer.
        /// gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Compute the matrices
        var aspect = canvas.width / canvas.height;
        var projectionMatrix = makePerspective(fieldOfViewRadians, aspect, 1, 2000); // fovRad, aspect, near, far
        var translationMatrix = makeTranslation(translation[0], translation[1], translation[2]);
        var rotationXMatrix = makeXRotation(rotation[0]);
        var rotationYMatrix = makeYRotation(rotation[1]);
        var rotationZMatrix = makeZRotation(rotation[2]);
        var scaleMatrix = makeScale(scale[0], scale[1], scale[2]);



        // Multiply the matrices.
        var matrix = matrixMultiply(scaleMatrix, rotationZMatrix);
        matrix = matrixMultiply(matrix, rotationYMatrix);
        matrix = matrixMultiply(matrix, rotationXMatrix);
        matrix = matrixMultiply(matrix, translationMatrix);
        matrix = matrixMultiply(matrix, projectionMatrix); // what does this do again?
        //matrix = matrixMultiply(matrix, zToWMatrix); // for persp

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        // texture
        gl.activeTexture(gl.TEXTURE0); // say that this texture is texture 0 (of 32 possible textures OpenGL can handle)
        gl.bindTexture(gl.TEXTURE_2D, tex);
        // gl.uniform1i(samplerLocation, 0); // tell the shader to user texture '0'

        // Draw the geometry.
        gl.drawArrays(gl.TRIANGLES, 0, num_tris);
        console.log('drawing ...');
    }
} // end main()

function degreesToRadians (d) {
    return d * Math.PI / 180;
}

function radiansToDegrees (r) {
    return r * 180 / Math.PI;
}

function make2DProjection(width, height, depth) {
  // Note: This matrix flips the Y axis so 0 is at the top.
  return [
     2 / width, 0, 0, 0,
     0, -2 / height, 0, 0,
     0, 0, 2 / depth, 0,
    -1, 1, 0, 1,
  ];
}

function makeTranslation(tx, ty, tz) {
  return [
     1,  0,  0,  0,
     0,  1,  0,  0,
     0,  0,  1,  0,
     tx, ty, tz, 1
  ];
}

function makeXRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    1, 0, 0, 0,
    0, c, s, 0,
    0, -s, c, 0,
    0, 0, 0, 1
  ];
}

function makeYRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);

  return [
    c, 0, -s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1
  ];
}

function makeZRotation(angleInRadians) {
  var c = Math.cos(angleInRadians);
  var s = Math.sin(angleInRadians);
  return [
     c, s, 0, 0,
    -s, c, 0, 0,
     0, 0, 1, 0,
     0, 0, 0, 1,
  ];
}

function makeScale(sx, sy, sz) {
  return [
    sx, 0,  0,  0,
    0, sy,  0,  0,
    0,  0, sz,  0,
    0,  0,  0,  1,
  ];
}

function makePerspective (fieldOfViewInRadians, aspect, near, far) {

    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians),
        rangeInv = 1.0 / (near - far);

    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ];
}

function matrixMultiply(a, b) {
  var a00 = a[0*4+0];
  var a01 = a[0*4+1];
  var a02 = a[0*4+2];
  var a03 = a[0*4+3];
  var a10 = a[1*4+0];
  var a11 = a[1*4+1];
  var a12 = a[1*4+2];
  var a13 = a[1*4+3];
  var a20 = a[2*4+0];
  var a21 = a[2*4+1];
  var a22 = a[2*4+2];
  var a23 = a[2*4+3];
  var a30 = a[3*4+0];
  var a31 = a[3*4+1];
  var a32 = a[3*4+2];
  var a33 = a[3*4+3];
  var b00 = b[0*4+0];
  var b01 = b[0*4+1];
  var b02 = b[0*4+2];
  var b03 = b[0*4+3];
  var b10 = b[1*4+0];
  var b11 = b[1*4+1];
  var b12 = b[1*4+2];
  var b13 = b[1*4+3];
  var b20 = b[2*4+0];
  var b21 = b[2*4+1];
  var b22 = b[2*4+2];
  var b23 = b[2*4+3];
  var b30 = b[3*4+0];
  var b31 = b[3*4+1];
  var b32 = b[3*4+2];
  var b33 = b[3*4+3];
  return [a00 * b00 + a01 * b10 + a02 * b20 + a03 * b30,
          a00 * b01 + a01 * b11 + a02 * b21 + a03 * b31,
          a00 * b02 + a01 * b12 + a02 * b22 + a03 * b32,
          a00 * b03 + a01 * b13 + a02 * b23 + a03 * b33,
          a10 * b00 + a11 * b10 + a12 * b20 + a13 * b30,
          a10 * b01 + a11 * b11 + a12 * b21 + a13 * b31,
          a10 * b02 + a11 * b12 + a12 * b22 + a13 * b32,
          a10 * b03 + a11 * b13 + a12 * b23 + a13 * b33,
          a20 * b00 + a21 * b10 + a22 * b20 + a23 * b30,
          a20 * b01 + a21 * b11 + a22 * b21 + a23 * b31,
          a20 * b02 + a21 * b12 + a22 * b22 + a23 * b32,
          a20 * b03 + a21 * b13 + a22 * b23 + a23 * b33,
          a30 * b00 + a31 * b10 + a32 * b20 + a33 * b30,
          a30 * b01 + a31 * b11 + a32 * b21 + a33 * b31,
          a30 * b02 + a31 * b12 + a32 * b22 + a33 * b32,
          a30 * b03 + a31 * b13 + a32 * b23 + a33 * b33];
}
