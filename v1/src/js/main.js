import * as THREE from './three.module.js';
let container;

let camera, scene, renderer;

init();
animate();

function init() {

	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10 );
	camera.position.z = 2;

	scene = new THREE.Scene();

	const vector = new THREE.Vector4();

	const instances = 10000;

	const positions = [];
	const offsets = [];
	const colors = [];
	const orientationsStart = [];
	const orientationsEnd = [];

	positions.push( 0.025, - 0.025, 0 );
	positions.push( - 0.025, 0.025, 0 );
	positions.push( 0, 0, 0.025 );

	for ( let i = 0; i < instances; i ++ ) {

		offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		// colors.push(0.2,0.4,0.3,0.2)
  		colors.push(0.3,0.4,0.5,0.2)

		vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
		vector.normalize();
		orientationsStart.push( vector.x, vector.y, vector.z, vector.w );
		vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
		vector.normalize();
		orientationsEnd.push( vector.x, vector.y, vector.z, vector.w );
	}

	const geometry = new THREE.InstancedBufferGeometry();
	geometry.instanceCount = instances;

	geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 2 ) ); // If below 3 throw THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.

	geometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3 ) );
	geometry.setAttribute( 'color', new THREE.InstancedBufferAttribute( new Float32Array( colors ), 4 ) );
	geometry.setAttribute( 'orientationStart', new THREE.InstancedBufferAttribute( new Float32Array( orientationsStart ), 4 ) );
	geometry.setAttribute( 'orientationEnd', new THREE.InstancedBufferAttribute( new Float32Array( orientationsEnd ), 4 ) );

	const material = new THREE.RawShaderMaterial( {

		uniforms: {
			"time": { value: 1.0 },
			"sineTime": { value: 1.0 }
		},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		side: THREE.DoubleSide,
		transparent: true
	} );

	const mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	renderer = new THREE.WebGLRenderer({alpha:true});
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	if ( renderer.capabilities.isWebGL2 === false && renderer.extensions.has( 'ANGLE_instanced_arrays' ) === false ) {

		document.getElementById( 'notSupported' ).style.display = '';
		return;
	}

	window.addEventListener( 'resize', onWindowResize );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	render();
}

function render() {

	const time = performance.now();
	const object = scene.children[ 0 ];

	object.rotation.y = time * 0.0004;
	object.material.uniforms[ "time" ].value = time * 0.005;
	object.material.uniforms[ "sineTime" ].value = Math.sin( object.material.uniforms[ "time" ].value * 0.05 );

	renderer.render( scene, camera );

}
