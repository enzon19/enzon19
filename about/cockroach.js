// [IA NOTICE] MADE WITH GPT
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- SETUP ---

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-3, 3, 2, -2, 0.01, 100);
const walker = new THREE.Group();
walker.rotation.y = Math.PI / 2;
scene.add(walker);
let travelLimit = 0;
let walkingTime = 0;
const crossingDuration = 8;

const container = document.querySelector('#cockroach-preview');
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);
renderer.domElement.style.cssText =
	'display: block; position: absolute; inset: 0;';
renderer.domElement.setAttribute('role', 'img');
renderer.domElement.setAttribute(
	'aria-label',
	'Barata 3D vista pelo lado esquerdo, andando da esquerda para a direita sob a neve',
);
container.appendChild(renderer.domElement);

// --- LIGHTS ---

scene.add(new THREE.HemisphereLight(0xffffff, 0x9c8570, 2));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(3, 5, 4);
scene.add(light);

// --- SNOW ---

const snowCount = 180;
const snowPositions = new Float32Array(snowCount * 3);
const snowSpeeds = new Float32Array(snowCount);
let snowWidth = 6;
let snowHeight = 4;
const snowCanvas = document.createElement('canvas');
snowCanvas.width = snowCanvas.height = 32;
const snowContext = snowCanvas.getContext('2d');
const snowGradient = snowContext.createRadialGradient(16, 16, 0, 16, 16, 16);
snowGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
snowGradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.9)');
snowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
snowContext.fillStyle = snowGradient;
snowContext.fillRect(0, 0, 32, 32);

const snowGeometry = new THREE.BufferGeometry();
snowGeometry.setAttribute(
	'position',
	new THREE.BufferAttribute(snowPositions, 3),
);
const snow = new THREE.Points(
	snowGeometry,
	new THREE.PointsMaterial({
		map: new THREE.CanvasTexture(snowCanvas),
		color: 0xffffff,
		size: 3,
		transparent: true,
		opacity: 0.8,
		depthWrite: false,
	}),
);
snow.frustumCulled = false;
scene.add(snow);

function updateSnowColor() {
	snow.material.color.set(
		document.documentElement.classList.contains('dark') ? 0xffffff : 0x0284c7,
	);
}

updateSnowColor();
new MutationObserver(updateSnowColor).observe(document.documentElement, {
	attributes: true,
	attributeFilter: ['class'],
});

function resetSnow(width, height) {
	snowWidth = width + 0.2;
	snowHeight = height + 0.2;
	for (let i = 0; i < snowCount; i++) {
		snowPositions[i * 3] = (Math.random() - 0.5) * snowWidth;
		snowPositions[i * 3 + 1] = (Math.random() - 0.5) * snowHeight;
		snowPositions[i * 3 + 2] = Math.random() * 2;
		snowSpeeds[i] = 0.15 + Math.random() * 0.3;
	}
	snowGeometry.attributes.position.needsUpdate = true;
}

// --- COCKROACH MODEL ---

let mixer;
const collisionMeshes = [];
const collisionBounds = new THREE.Box3();
const snowRaycaster = new THREE.Raycaster();
const snowScreenPosition = new THREE.Vector2();
const snowWorldPosition = new THREE.Vector3();
const snowHits = [];
const loader = new GLTFLoader();
loader.load(
	'/assets/cockroach/cockroach.glb',
	(gltf) => {
		const root = gltf.scene;
		// Transform a wrapper so animation tracks keep their original coordinates.
		const model = new THREE.Group();
		model.add(root);
		root.updateMatrixWorld(true);
		const bounds = new THREE.Box3().setFromObject(root);
		const size = bounds.getSize(new THREE.Vector3());
		const scale = 1.8 / Math.max(size.x, size.y, size.z);
		model.scale.setScalar(scale);
		model.position
			.copy(bounds.getCenter(new THREE.Vector3()))
			.multiplyScalar(-scale);
		walker.add(model);
		root.traverse((object) => {
			if (object.isMesh) collisionMeshes.push(object);
		});
		walkingTime = 0;
		walker.position.x = -travelLimit;

		const clip =
			THREE.AnimationClip.findByName(gltf.animations, 'Walk') ??
			gltf.animations[0];
		if (clip) {
			mixer = new THREE.AnimationMixer(root);
			mixer.clipAction(clip).setLoop(THREE.LoopRepeat, Infinity).play();
		}
	},
	undefined,
	(error) => {
		console.error(error);
	},
);

// --- ANIMATION ---

let previousTime;
function animate(time) {
	const delta =
		previousTime === undefined
			? 0
			: Math.min((time - previousTime) / 1000, 0.1);
	previousTime = time;
	mixer?.update(delta);
	if (mixer) {
		walkingTime = (walkingTime + delta) % crossingDuration;
		walker.position.x = THREE.MathUtils.lerp(
			-travelLimit,
			travelLimit,
			walkingTime / crossingDuration,
		);
	}
	// Raycast against the current animated silhouette, including legs and antennae.
	walker.updateWorldMatrix(true, true);
	for (const mesh of collisionMeshes) {
		if (mesh.isSkinnedMesh) {
			mesh.computeBoundingBox();
			mesh.computeBoundingSphere();
		}
	}
	collisionBounds.setFromObject(walker);
	snow.updateWorldMatrix(true, false);
	camera.updateWorldMatrix(true, false);
	for (let i = 0; i < snowCount; i++) {
		const offset = i * 3;
		snowPositions[offset] += Math.sin(time / 1800 + i) * delta * 0.06;
		snowPositions[offset + 1] -= snowSpeeds[i] * delta;
		let touchingCockroach = false;
		if (collisionMeshes.length && delta > 0) {
			snowWorldPosition
				.fromArray(snowPositions, offset)
				.applyMatrix4(snow.matrixWorld)
				.project(camera);
			snowScreenPosition.set(snowWorldPosition.x, snowWorldPosition.y);
			snowRaycaster.setFromCamera(snowScreenPosition, camera);
			if (snowRaycaster.ray.intersectsBox(collisionBounds)) {
				snowHits.length = 0;
				snowRaycaster.intersectObjects(collisionMeshes, false, snowHits);
				touchingCockroach = snowHits.length > 0;
			}
		}
		// Remove a touching flake by recycling it above the visible scene.
		if (touchingCockroach || snowPositions[offset + 1] < -snowHeight / 2) {
			snowPositions[offset] = (Math.random() - 0.5) * snowWidth;
			snowPositions[offset + 1] = snowHeight / 2;
		}
	}
	snowGeometry.attributes.position.needsUpdate = true;

	renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// --- RESIZE ---

function resize() {
	const width = container.clientWidth;
	const height = container.clientHeight;
	if (!width || !height) return;
	renderer.setSize(width, height);
	// Frame the low side profile; the path extends beyond both screen edges.
	const viewHeight = Math.max(0.9, 3 / (width / height));
	const viewWidth = viewHeight * (width / height);
	camera.left = -viewWidth / 2;
	camera.right = viewWidth / 2;
	camera.top = viewHeight / 2;
	camera.bottom = -viewHeight / 2;
	travelLimit = viewWidth / 2 + 1.1;
	walker.position.x = THREE.MathUtils.lerp(
		-travelLimit,
		travelLimit,
		walkingTime / crossingDuration,
	);
	camera.position.set(1, 5, 8);
	camera.lookAt(0, 0, 0);
	camera.updateProjectionMatrix();
	// Keep snowfall aligned with the screen despite the tilted camera.
	snow.quaternion.copy(camera.quaternion);
	resetSnow(viewWidth, viewHeight);
}

new ResizeObserver(resize).observe(container);
resize();
