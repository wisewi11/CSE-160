import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'




const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 2, 8)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.innerHTML = ''
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 0, 0)

const textureLoader = new THREE.TextureLoader()
const brickTexture = textureLoader.load('/textures/brick.jpg')
brickTexture.wrapS = THREE.RepeatWrapping
brickTexture.wrapT = THREE.RepeatWrapping
brickTexture.repeat.set(1, 1)


//sky box

const backgroundTexture = textureLoader.load('/textures/istockphoto-697120006-612x612.jpg')
scene.background = backgroundTexture

// lights
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(5, 10, 7)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 200, 50)
pointLight.position.set(0, 5, 3)
scene.add(pointLight)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.3)
scene.add(pointLightHelper)

// floor
const floorGeometry = new THREE.PlaneGeometry(20, 20)
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 })
const floor = new THREE.Mesh(floorGeometry, floorMaterial)
floor.rotation.x = -Math.PI / 2
floor.position.y = -1.5
scene.add(floor)

// cube 1 (textured)
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ map: brickTexture })
)
cube1.position.set(-2, 0, 0)
scene.add(cube1)

// cube 2
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x44ff44 })
)
cube2.position.set(0, 0, 0)
scene.add(cube2)

// cube 3
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x4444ff })
)
cube3.position.set(2, 0, 0)
scene.add(cube3)

// sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xffff44 })
)
sphere.position.set(-1.5, 1.5, -2)
scene.add(sphere)

// cylinder
const cylinder = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.5, 1.5, 32),
  new THREE.MeshStandardMaterial({ color: 0xff88ff })
)
cylinder.position.set(1.5, 0.25, -2)
scene.add(cylinder)

//spam some shapes
const smallCubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const smallCubeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 })

for (let x = -4; x <= 4; x += 2) {
  for (let z = -4; z <= 4; z += 2) {
    const cube = new THREE.Mesh(smallCubeGeometry, smallCubeMaterial)
    cube.position.set(x, -1.25, z)
    cube.castShadow = true
    cube.receiveShadow = true
    scene.add(cube)
  }
}
function animate() {
  requestAnimationFrame(animate)

  cube1.rotation.x += 0.01
  cube1.rotation.y += 0.01

  cube2.rotation.y += 0.02

  cube3.rotation.x += 0.015

  sphere.position.y = 1.5 + Math.sin(Date.now() * 0.002) * 0.3

  cylinder.rotation.z += 0.01

  controls.update()
  renderer.render(scene, camera)
}




const loader = new GLTFLoader()

loader.load(
  '/models/Blocks Skyline.glb',
  function (gltf) {
    const model = gltf.scene
    model.scale.set(0.5, 0.5, 0.5)
    model.position.set(0, 0, -3)
    scene.add(model)
  },
  undefined,
  function (error) {
    console.error(error)
  }
)


animate()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})