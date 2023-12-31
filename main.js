import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x606060,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

function animate() {
    requestAnimationFrame(animate)
    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;
    render()
}

function render() {
    renderer.render(scene, camera);
}

animate()