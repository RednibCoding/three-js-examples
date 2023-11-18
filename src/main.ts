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


const ambient = new THREE.AmbientLight();
ambient.intensity = 0.2;
scene.add(ambient);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

document.addEventListener('mousemove', onDocumentMouseMove, false);

function onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    render()
}

function render() {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube, true);

    if (intersects.length > 0) {
        const intersect = intersects[0];
        highlightVertex(intersect.point);
    }

    renderer.render(scene, camera);
}

function getUniqueVertices(geometry: THREE.BufferGeometry) {
    const vertices = [];
    const positionAttribute = geometry.attributes.position;

    for (let i = 0; i < positionAttribute.count; i += 3) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);
        vertices.push(vertex);
    }

    return vertices;
}

function deduplicateVertices(vertices) {
    const uniqueVertices = [];
    vertices.forEach((vertex) => {
      const exists = uniqueVertices.some((uniqueVertex) => uniqueVertex.equals(vertex));
      if (!exists) {
        uniqueVertices.push(vertex);
      }
    });
    return uniqueVertices;
  }
  

let highlightedVertex: THREE.Object3D; // To keep track of the currently highlighted vertex

function highlightVertex(intersectPoint: THREE.Vector3) {
    const vertices = getUniqueVertices(cube.geometry);
    let closestVertex = null;
    let minDistance = Infinity;

    vertices.forEach(vertex => {
        const distance = vertex.distanceTo(intersectPoint);
        if (distance < minDistance) {
            minDistance = distance;
            closestVertex = vertex;
        }
    });

    // Remove previous highlight
    if (highlightedVertex) {
        scene.remove(highlightedVertex);
    }

    // Add new highlight
    if (closestVertex) {
        const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffa500 });
        highlightedVertex = new THREE.Mesh(sphereGeometry, sphereMaterial);
        highlightedVertex.position.copy(closestVertex);
        scene.add(highlightedVertex);
    }
}

animate()