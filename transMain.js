'use strict';

// Global variables
let gl, program;

// Global declarations of objects
var myTeapot = null;
var myCube = null;
var myCone = null;
var mySphere = null;

// Helper: convert degrees to radians
function radians(degrees) {
    return degrees * Math.PI / 180.0;
}

// ------------------------------------------------------------
// Create shapes and bind VAOs
// ------------------------------------------------------------
function createShapes() {
    // Teapot
    myTeapot = new Teapot();
    myTeapot.VAO = bindVAO(myTeapot);

    // Cube pedestal
    myCube = new Cube(3);     //from Assignment 5
    myCube.VAO = bindVAO(myCube);

    // Cone pedestal
    myCone = new Cone(20, 10);  //from Assignment 5
    myCone.VAO = bindVAO(myCone);

    //Sphere
    mySphere = new Sphere(20, 20); // from Assignment 5
    mySphere.VAO = bindVAO(mySphere);
}

// ------------------------------------------------------------
// Set up camera and projection
// ------------------------------------------------------------
function setUpCamera() {
    // Perspective projection
    let projMatrix = glMatrix.mat4.create();
    glMatrix.mat4.perspective(
        projMatrix,
        radians(45),                        // field of view
        gl.canvas.width / gl.canvas.height, // aspect ratio
        0.1,                                // near plane
        100.0                               // far plane
    );
    gl.uniformMatrix4fv(program.uProjT, false, projMatrix);

    // View matrix: move camera back and up a bit
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(
        viewMatrix,
        [0, 3, -7],   // eye/camera position
        [0, 0, 0],    // look at origin
        [0, 1, 0]     // up vector
    );
    gl.uniformMatrix4fv(program.uViewT, false, viewMatrix);
}

function drawIPedestal(baseMatrix){
    // --- Bottom base (wide and flat) ---
    // Clone the incoming base matrix so we don't overwrite it
    let bottomBase = glMatrix.mat4.clone(baseMatrix);
    // Scale: make it wider in X/Z, but short in Y (height)
    glMatrix.mat4.scale(bottomBase, bottomBase, [1.2, 0.3, 1.2]);
    // Send the transformation matrix to the shader
    gl.uniformMatrix4fv(program.uModelT, false, bottomBase);
    // Bind cube geometry and draw it
    gl.bindVertexArray(myCube.VAO);
    gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);

    // --- Middle column (narrow and tall) ---
    // Clone base matrix again for a fresh transform
    let middleColumn = glMatrix.mat4.clone(baseMatrix);
    // Translate upward so the column sits on top of the bottom base
    glMatrix.mat4.translate(middleColumn, middleColumn, [0, 0.65, 0]);
    // Scale: narrow in X/Z, taller in Y
    glMatrix.mat4.scale(middleColumn, middleColumn, [0.5, 1.0, 0.2]);
    // Apply transformation and draw cube
    gl.uniformMatrix4fv(program.uModelT, false, middleColumn);
    gl.bindVertexArray(myCube.VAO);
    gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);

    // --- Top platform (wide and flat) ---
    // Clone base matrix again for the top piece
    let topPlatform = glMatrix.mat4.clone(baseMatrix);
    // Translate further upward so it sits above the column
    glMatrix.mat4.translate(topPlatform, topPlatform, [0, 1.3, 0]);
    // Scale: wide in X/Z, short in Y (like the bottom base)
    glMatrix.mat4.scale(topPlatform, topPlatform, [1.2, 0.3, 1.2]);
    // Apply transformation and draw cube
    gl.uniformMatrix4fv(program.uModelT, false, topPlatform);
    gl.bindVertexArray(myCube.VAO);
    gl.drawElements(gl.TRIANGLES, myCube.indices.length, gl.UNSIGNED_SHORT, 0);  
}

// ------------------------------------------------------------
// Draw all shapes with model transforms
// ------------------------------------------------------------
function drawShapes() {
    // --- Clear screen before drawing ---
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // --- LEFT pedestal ---
    // Create base matrix and move it left
    let pedestal1Base = glMatrix.mat4.create();
    glMatrix.mat4.translate(pedestal1Base, pedestal1Base, [-2, 0, 0]);
    // Draw I-shaped pedestal at left
    drawIPedestal(pedestal1Base);

    // Place teapot on top of left pedestal
    let teapotMatrix = glMatrix.mat4.clone(pedestal1Base);
    glMatrix.mat4.translate(teapotMatrix, teapotMatrix, [0, 1.5, 0]); // move up
    glMatrix.mat4.scale(teapotMatrix, teapotMatrix, [0.5, 0.5, 0.5]); // shrink
    glMatrix.mat4.rotateY(teapotMatrix, teapotMatrix, radians(180)); // rotate
    gl.uniformMatrix4fv(program.uModelT, false, teapotMatrix);
    gl.bindVertexArray(myTeapot.VAO);
    gl.drawElements(gl.TRIANGLES, myTeapot.indices.length, gl.UNSIGNED_SHORT, 0);

    // --- CENTER pedestal ---
    // Create base matrix at center
    let pedestal2Base = glMatrix.mat4.create();
    glMatrix.mat4.translate(pedestal2Base, pedestal2Base, [0, 0, 0]);
    // Draw I-shaped pedestal at center
    drawIPedestal(pedestal2Base);

    // Place sphere on top of center pedestal
    let sphereMatrix = glMatrix.mat4.clone(pedestal2Base);
    glMatrix.mat4.translate(sphereMatrix, sphereMatrix, [0, 2, 0]); // move up
    gl.uniformMatrix4fv(program.uModelT, false, sphereMatrix);
    gl.bindVertexArray(mySphere.VAO);
    gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);

    // --- RIGHT pedestal ---
    // Create base matrix and move it right
    let pedestal3Base = glMatrix.mat4.create();
    glMatrix.mat4.translate(pedestal3Base, pedestal3Base, [2, 0, 0]);
    // Draw I-shaped pedestal at right
    drawIPedestal(pedestal3Base);

    // Place cone on top of right pedestal
    let coneMatrix = glMatrix.mat4.clone(pedestal3Base);
    glMatrix.mat4.translate(coneMatrix, coneMatrix, [0, 2, 0]); // move up
    gl.uniformMatrix4fv(program.uModelT, false, coneMatrix);
    gl.bindVertexArray(myCone.VAO);
    gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);
}


///////////////////////////////////////////////////////////////////
//
//   You shouldn't have to edit below this line
//
///////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram() {
    const vertexShader = getShader('vertex-shader');
    const fragmentShader = getShader('fragment-shader');

    // Create a program
    program = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      let myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
    
  }

  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }


    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initProgram();
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera();
    
    // do a draw
    draw();
  }
