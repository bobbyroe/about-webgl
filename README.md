#About WebGL


About WebGL Talk.
[Presentation](http://bobbyroe.com/wgl/about)

* Intro to the WebGL DOM API
* 2D / 3D; Whatever
* Bring your own matrices 
* GLSL examples 
* do stuff
* references

###Init WebGL example

```js
initWGL: function () {
    canvas = document.getElementById('main');
    try {
        gl = canvas.getContext("experimental-webgl");
    } catch (e) {
        console.log(e);
    }

    if (gl) {
        this.setSize();
        // gl.enable(gl.CULL_FACE); // 'switch' to enable backface culling
        // gl.enable(gl.DEPTH_TEST); // another 'switch'
    } else {
        alert("Could not initialise WebGL, try here: get.webgl.org");
    }
}

```
