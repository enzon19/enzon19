gsap.fromTo(
	'footer',
	{
		backgroundColor: () =>
			document.documentElement.classList.contains('dark')
				? '#525252'
				: '#a1a1a1',
	},
	{
		backgroundColor: () =>
			document.documentElement.classList.contains('dark')
				? '#1b1b1b'
				: '#ededed',
		scrollTrigger: {
			trigger: 'footer',
			start: 'top bottom',
			end: 'bottom bottom',
			scrub: true,
			invalidateOnRefresh: true,
		},
	},
);

gsap
	.timeline({
		defaults: { ease: 'none' },
		scrollTrigger: {
			trigger: 'footer',
			start: 'top bottom',
			end: 'bottom bottom',
			scrub: true,
		},
	})
	.fromTo('footer > div', { y: -250 }, { y: 0, duration: 1 }, 0)
	.fromTo(
		'footer > div',
		{ filter: 'blur(10px)' },
		{ filter: 'blur(0px)', duration: 0.85 },
		0,
	);

// [IA NOTICE] MADE WITH GPT
// Keep the decorative walker in the same moving layer as the footer name.
const stage = document.querySelector('#footer-name');
const canvas = document.querySelector('#footer-cockroach');
if (stage && canvas) {
	const container = stage;

	let initialized = false;
	let visible = false;
	let render;
	const observer = new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting;
		if (visible && !initialized) {
			initialized = true;
			createFooterCockroach().catch((error) => {
				console.error('Não foi possível carregar a barata do footer:', error);
			});
		}
		render?.();
	});
	observer.observe(stage);

	async function createFooterCockroach() {
		const [THREE, { GLTFLoader }] = await Promise.all([
			import('three'),
			import('three/addons/loaders/GLTFLoader.js'),
		]);
		const scene = new THREE.Scene();
		const camera = new THREE.OrthographicCamera(-3, 3, 1, -1, 0.01, 100);
		camera.position.set(0, 0, 8);
		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setClearColor(0x000000, 0);
		scene.add(new THREE.HemisphereLight(0xffffff, 0x9c8570, 2));
		const light = new THREE.DirectionalLight(0xffffff, 3);
		light.position.set(3, 5, 4);
		scene.add(light);
		const walker = new THREE.Group();
		walker.rotation.y = Math.PI / 2;
		scene.add(walker);

		const gltf = await new GLTFLoader().loadAsync(
			'/assets/cockroach/cockroach.glb',
		);
		const root = gltf.scene;
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
		const responsiveModel = new THREE.Group();
		// The translated model is centered inside this pivot. Rotating the model
		// itself would still use the original GLTF origin and make it orbit.
		const deathPivot = new THREE.Group();
		deathPivot.add(model);
		responsiveModel.add(deathPivot);
		walker.add(responsiveModel);
		walker.updateMatrixWorld(true);
		// Overlay the walker on the letters, with its feet at the SVG baseline.
		walker.position.y = -1 - new THREE.Box3().setFromObject(walker).min.y;
		const clip =
			THREE.AnimationClip.findByName(gltf.animations, 'Walk') ??
			gltf.animations[0];
		const mixer = new THREE.AnimationMixer(root);
		if (clip) mixer.clipAction(clip).play();
		let elapsed = 0;
		let previousTime;
		let travelLimit = 4;
		let dead = false;
		let deathX = 0;
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
		const belowMd = window.matchMedia('(width < 48rem)');
		const raycaster = new THREE.Raycaster();
		const pointer = new THREE.Vector2();
		function hitsCockroach(event) {
			const rect = canvas.getBoundingClientRect();
			if (!rect.width || !rect.height) return false;
			pointer.set(
				((event.clientX - rect.left) / rect.width) * 2 - 1,
				-((event.clientY - rect.top) / rect.height) * 2 + 1,
			);
			scene.updateMatrixWorld(true);
			camera.updateMatrixWorld(true);
			root.traverse((object) => {
				if (object.isSkinnedMesh) {
					object.computeBoundingBox();
					object.computeBoundingSphere();
				}
			});
			raycaster.setFromCamera(pointer, camera);
			return raycaster.intersectObject(root, true).length > 0;
		}
		canvas.addEventListener('pointermove', (event) => {
			canvas.classList.toggle('cursor-pointer', !dead && hitsCockroach(event));
		});
		canvas.addEventListener('pointerleave', () =>
			canvas.classList.remove('cursor-pointer'),
		);
		canvas.addEventListener('click', (event) => {
			if (dead || !hitsCockroach(event)) return;
			dead = true;
			deathX = walker.position.x / travelLimit;
			mixer.timeScale = 0;
			canvas.classList.remove('cursor-pointer');
			renderer.setAnimationLoop(null);
			const deathAnimation = gsap.timeline({
				onUpdate: () => {
					// Keep the overturned model on its original ground line.
					walker.updateMatrixWorld(true);
					walker.position.y +=
						-1 - new THREE.Box3().setFromObject(walker).min.y;
					renderer.render(scene, camera);
				},
			});
			if (!reducedMotion.matches) {
				deathAnimation.to(deathPivot.scale, {
					y: 0.6,
					duration: 0.12,
					ease: 'power2.in',
				});
			}
			deathAnimation.to(deathPivot.rotation, {
				z: Math.PI,
				duration: reducedMotion.matches ? 0 : 0.45,
				ease: 'power2.out',
				delay: 0.08,
			});
		});

		function resize() {
			const width = canvas.clientWidth;
			const height = canvas.clientHeight;
			if (!width || !height) return;
			responsiveModel.scale.setScalar(belowMd.matches ? 1.5 : 1);
			walker.updateMatrixWorld(true);
			walker.position.y += -1 - new THREE.Box3().setFromObject(walker).min.y;
			renderer.setSize(width, height, false);
			camera.left = -width / height;
			camera.right = width / height;
			camera.updateProjectionMatrix();
			travelLimit = camera.right + (belowMd.matches ? 1.65 : 1.1);
			walker.position.x = dead
				? deathX * travelLimit
				: reducedMotion.matches
					? 0
					: THREE.MathUtils.lerp(-travelLimit, travelLimit, elapsed / 12);
			renderer.render(scene, camera);
		}
		function animate(time) {
			if (dead) return;
			const delta =
				previousTime === undefined
					? 0
					: Math.min((time - previousTime) / 1000, 0.1);
			previousTime = time;
			elapsed = (elapsed + delta) % 12;
			mixer.update(delta);
			walker.position.x = THREE.MathUtils.lerp(
				-travelLimit,
				travelLimit,
				elapsed / 12,
			);
			renderer.render(scene, camera);
		}
		render = () => {
			previousTime = undefined;
			renderer.setAnimationLoop(
				visible && !document.hidden && !reducedMotion.matches && !dead
					? animate
					: null,
			);
			if (reducedMotion.matches && !dead) walker.position.x = 0;
			renderer.render(scene, camera);
		};
		new ResizeObserver(resize).observe(container);
		window.addEventListener('resize', resize);
		belowMd.addEventListener('change', resize);
		document.addEventListener('visibilitychange', render);
		reducedMotion.addEventListener('change', render);
		resize();
		render();
	}
}
