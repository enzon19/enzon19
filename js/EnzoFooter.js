export default class EnzoFooter extends HTMLElement {
	#footer;
	#animations;
	#cleanupCockroach;

	#build() {
		const footer = document.createElement('footer');
		footer.className =
			'z-10 flex flex-col overflow-hidden bg-neutral-400 p-8 pb-0 md:p-18 md:pb-0 dark:bg-neutral-700';

		footer.innerHTML = `<div class="mx-auto mt-auto flex w-full max-w-6xl flex-col gap-8">
			<div
				class="grid grid-cols-2 grid-rows-[auto_auto] gap-8 md:grid-cols-4 md:grid-rows-1 lg:gap-18">
				<div class="col-span-2 flex flex-col gap-2">
					<a class="mb-1 w-fit font-bold text-black dark:text-white" href="/">
						Enzo Neves Barata
					</a>
					<p data-i18n="footer.tagline">Desde 2021 criando para a web.</p>
					<p data-i18n="footer.credits" class="my-2 text-sm">
						Site feito com HTML, CSS (Tailwind) e JavaScript (Vanilla).
					</p>
					<div class="flex gap-3">
						<a
							href="https://linkedin.com/in/enzon19"
							target="_blank"
							aria-label="LinkedIn">
							<ion-icon
								name="logo-linkedin"
								class="text-xl transition-colors hover:text-black dark:hover:text-white"></ion-icon>
						</a>
						<a
							href="https://github.com/enzon19"
							target="_blank"
							aria-label="GitHub">
							<ion-icon
								name="logo-github"
								class="text-xl transition-colors hover:text-black dark:hover:text-white"></ion-icon>
						</a>
					</div>
				</div>
				<nav class="flex flex-col gap-2">
					<h2
						data-i18n="footer.pages"
						class="mb-1 font-medium text-black dark:text-white">
						Páginas
					</h2>
					<ul class="flex flex-col gap-2">
						<li>
							<a
								href="/"
								data-i18n="nav.home"
								class="transition-colors hover:text-black dark:hover:text-white"
								>Início</a
							>
						</li>
						<li>
							<a
								href="/about"
								data-i18n="nav.about"
								class="transition-colors hover:text-black dark:hover:text-white"
								>Sobre</a
							>
						</li>
						<li>
							<a
								href="/projects"
								data-i18n="nav.projects"
								class="transition-colors hover:text-black dark:hover:text-white"
								>Projetos</a
							>
						</li>
						<li>
							<a
								href="/contact"
								data-i18n="nav.contact"
								class="transition-colors hover:text-black dark:hover:text-white"
								>Contato</a
							>
						</li>
					</ul>
				</nav>
				<nav class="flex flex-col gap-2">
					<h2
						data-i18n="footer.previousVersions"
						class="mb-1 font-medium text-black dark:text-white">
						Versões Anteriores
					</h2>
					<ul class="flex flex-col gap-2">
						<li>
							<a
								href="/v2"
								class="transition-colors hover:text-black dark:hover:text-white"
								>2023</a
							>
						</li>
						<li>
							<a
								href="/v1"
								class="transition-colors hover:text-black dark:hover:text-white"
								>2022</a
							>
						</li>
					</ul>
				</nav>
			</div>
			<div
				class="flex flex-col-reverse items-center justify-center gap-6 md:flex-row md:justify-between">
				<p class="text-xs text-neutral-600 dark:text-neutral-400">
					© 2026 Enzo Neves Barata
				</p>
				<div class="flex w-full justify-between gap-3 md:w-fit">
					<div
						class="flex flex-row items-center gap-1 rounded-full bg-neutral-300 p-1 dark:bg-neutral-700">
						<input
							type="radio"
							name="language"
							data-language-radio
							id="language-system"
							value="en-GB"
							class="peer/system sr-only" />
						<label
							for="language-system"
							title="English"
							aria-label="English"
							class="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-500 transition-colors peer-checked/system:bg-white peer-checked/system:text-neutral-800 hover:bg-white hover:text-neutral-800 peer-checked/system:hover:bg-white peer-checked/system:hover:text-neutral-800 dark:peer-checked/system:bg-neutral-500/65 dark:peer-checked/system:text-white dark:hover:bg-neutral-600 dark:hover:text-white dark:peer-checked/system:hover:bg-neutral-500/65 dark:peer-checked/system:hover:text-white">
							<ion-icon
								src="https://api.iconify.design/twemoji:flag-united-kingdom.svg"
								class="text-lg grayscale"></ion-icon>
						</label>
						<input
							type="radio"
							name="language"
							data-language-radio
							id="language-light"
							value="pt-BR"
							class="peer/light sr-only" />
						<label
							for="language-light"
							title="Português"
							aria-label="Português"
							class="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-500 transition-colors peer-checked/light:bg-white peer-checked/light:text-neutral-800 hover:bg-white hover:text-neutral-800 peer-checked/light:hover:bg-white peer-checked/light:hover:text-neutral-800 dark:peer-checked/light:bg-neutral-500/65 dark:peer-checked/light:text-white dark:hover:bg-neutral-600 dark:hover:text-white dark:peer-checked/light:hover:bg-neutral-500/65 dark:peer-checked/light:hover:text-white">
							<ion-icon
								src="https://api.iconify.design/twemoji:flag-brazil.svg"
								class="text-lg grayscale"></ion-icon>
						</label>
						<input
							type="radio"
							name="language"
							data-language-radio
							id="language-dark"
							value="es"
							class="peer/dark sr-only" />
						<label
							for="language-dark"
							title="Español"
							aria-label="Español"
							class="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-500 transition-colors peer-checked/dark:bg-white peer-checked/dark:text-neutral-800 hover:bg-white hover:text-neutral-800 peer-checked/dark:hover:bg-white peer-checked/dark:hover:text-neutral-800 dark:peer-checked/dark:bg-neutral-500/65 dark:peer-checked/dark:text-white dark:hover:bg-neutral-600 dark:hover:text-white dark:peer-checked/dark:hover:bg-neutral-500/65 dark:peer-checked/dark:hover:text-white">
							<ion-icon
								src="https://api.iconify.design/twemoji:flag-spain.svg"
								class="text-lg grayscale"></ion-icon>
						</label>
					</div>
					<div
						class="flex flex-row items-center gap-1 rounded-full bg-neutral-300 p-1 dark:bg-neutral-700">
						<input
							type="radio"
							name="theme"
							id="theme-system"
							value="system"
							class="peer/system sr-only" />
						<label
							data-i18n-title="theme.system"
							for="theme-system"
							title="Sistema"
							class="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-500 transition-colors peer-checked/system:bg-white peer-checked/system:text-neutral-800 hover:bg-white hover:text-neutral-800 peer-checked/system:hover:bg-white peer-checked/system:hover:text-neutral-800 dark:peer-checked/system:bg-neutral-500/65 dark:peer-checked/system:text-white dark:hover:bg-neutral-600 dark:hover:text-white dark:peer-checked/system:hover:bg-neutral-500/65 dark:peer-checked/system:hover:text-white">
							<ion-icon name="desktop" class="text-lg"></ion-icon>
						</label>
						<input
							type="radio"
							name="theme"
							id="theme-light"
							value="light"
							class="peer/light sr-only" />
						<label
							data-i18n-title="theme.light"
							for="theme-light"
							title="Claro"
							class="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-500 transition-colors peer-checked/light:bg-white peer-checked/light:text-neutral-800 hover:bg-white hover:text-neutral-800 peer-checked/light:hover:bg-white peer-checked/light:hover:text-neutral-800 dark:peer-checked/light:bg-neutral-500/65 dark:peer-checked/light:text-white dark:hover:bg-neutral-600 dark:hover:text-white dark:peer-checked/light:hover:bg-neutral-500/65 dark:peer-checked/light:hover:text-white">
							<ion-icon name="sunny" class="text-lg"></ion-icon>
						</label>
						<input
							type="radio"
							name="theme"
							id="theme-dark"
							value="dark"
							class="peer/dark sr-only" />
						<label
							data-i18n-title="theme.dark"
							for="theme-dark"
							title="Escuro"
							class="flex cursor-pointer items-center justify-center rounded-full p-1.5 text-neutral-500 transition-colors peer-checked/dark:bg-white peer-checked/dark:text-neutral-800 hover:bg-white hover:text-neutral-800 peer-checked/dark:hover:bg-white peer-checked/dark:hover:text-neutral-800 dark:peer-checked/dark:bg-neutral-500/65 dark:peer-checked/dark:text-white dark:hover:bg-neutral-600 dark:hover:text-white dark:peer-checked/dark:hover:bg-neutral-500/65 dark:peer-checked/dark:hover:text-white">
							<ion-icon name="moon" class="text-lg"></ion-icon>
						</label>
					</div>
				</div>
			</div>
			<div id="footer-name" class="relative w-full md:mt-18">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 994.64 171.2"
					class="block w-full fill-neutral-300 dark:fill-neutral-950/60">
					<title>enzon19</title>
					<path
						d="M147.54,163.22H104.65a21.18,21.18,0,0,1-5.16,8h46A54,54,0,0,0,147.54,163.22Z" />
					<path
						d="M55,170.85q-8-8.17-8.4-22.2h102V135.74q0-22.2-9.44-39.21a68.66,68.66,0,0,0-26.16-26.65q-16.72-9.64-38.8-9.64-21.64,0-38.44,9.85A69.88,69.88,0,0,0,9.51,97.23Q0,114.49,0,136.85q0,19,6.89,34.35H55.38Zm.9-68.84q7.5-6.51,19.57-6.52T94.94,102q7.49,6.52,9.16,18H46.91Q48.44,108.54,55.93,102Z" />
					<path
						d="M200.75,130.47q0-15,6.8-22.14t18-7.15q11.39,0,17.63,6.87T249.46,128V171.2h47.75V118q0-27.06-13.26-42.33T246.83,60.38q-16.53,0-27.9,7.21A57.16,57.16,0,0,0,200.19,87.3V63.57H153V171.2h47.75Z" />
					<polygon
						points="426.86 96.74 426.86 63.57 301.25 63.57 301.25 100.76 370.79 100.76 370.79 101.04 308.03 171.2 360.41 171.2 426.86 96.74" />
					<path
						d="M486.81,165.44q-8.06-10-8.05-28.59t8.12-28.59q8.12-10,20.61-10t20.61,10q8.11,10,8.12,28.59t-8.12,28.59a28.88,28.88,0,0,1-6.21,5.76h56q6.6-15.07,6.61-34.35,0-23-9.65-40.32a67.35,67.35,0,0,0-27.06-26.79q-17.43-9.49-40.32-9.5t-40.39,9.5A67.94,67.94,0,0,0,440,96.53q-9.72,17.28-9.71,40.32,0,19.26,6.63,34.35h56A28.3,28.3,0,0,1,486.81,165.44Z" />
					<path
						d="M637.17,130.47q0-15,6.8-22.14t18-7.15q11.38,0,17.63,6.87T685.89,128V171.2h47.74V118q0-27.06-13.25-42.33T683.25,60.38q-16.51,0-27.9,7.21A57.25,57.25,0,0,0,636.61,87.3V63.57H589.42V171.2h47.75Z" />
					<polygon
						points="824.84 3.33 780.15 3.33 729.21 35.25 729.21 77.58 776.54 48.02 776.82 48.02 776.82 171.2 824.84 171.2 824.84 3.33" />
					<path
						d="M984.5,161.42q10.14-24.85,10.14-58.57,0-48.72-22.49-75.79T909.14,0Q886,0,868.06,9A69.58,69.58,0,0,0,840,34.14q-10.2,16.11-10.2,37.48,0,20,9.16,35.67a65.72,65.72,0,0,0,25.19,24.63q16,9,36.57,9,15.69,0,27.9-5.7a47.89,47.89,0,0,0,20-17.48h.27q0,26.64-9.64,42.54a32.32,32.32,0,0,1-10.64,11h51.37A106,106,0,0,0,984.5,161.42ZM932.67,95.28a31.34,31.34,0,0,1-23.25,9.51q-14,0-23.25-9.44t-9.23-23.73q0-14.43,9.3-23.87t23.45-9.44a31,31,0,0,1,23,9.44q9.3,9.44,9.3,23.73T932.67,95.28Z" />
					<path
						d="M888.32,169.54A28,28,0,0,1,878.19,152H832a66.43,66.43,0,0,0,4.91,19.22h53.75C889.83,170.68,889.06,170.13,888.32,169.54Z" />
				</svg>
				<canvas
					id="footer-cockroach"
					class="absolute top-0 left-1/2 block h-full w-screen -translate-x-1/2"
					aria-hidden="true"></canvas>
			</div>
		</div>
		`;

		this.innerHTML = '';
		this.append(footer);

		this.#footer = footer;
		this.#setupCockroach();
		this.#animations = gsap.context(() => this.#setupAnimations(), this);
	}

	#setupAnimations() {
		gsap.fromTo(
			'footer',
			{
				backgroundColor: () =>
					document.documentElement.classList.contains('dark')
						? '#323232'
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
	}

	#setupCockroach() {
		// [IA NOTICE] MADE WITH GPT
		// Keep the decorative walker in the same moving layer as the footer name.
		const stage = this.#footer.querySelector('#footer-name');
		const canvas = this.#footer.querySelector('#footer-cockroach');
		if (stage && canvas) {
			const container = stage;
			const controller = new AbortController();
			const { signal } = controller;
			let cleanupResources;
			this.#cleanupCockroach = () => {
				controller.abort();
				observer.disconnect();
				render = undefined;
				cleanupResources?.();
			};
			function disposeModel(root) {
				const resources = new Set();
				root.traverse((object) => {
					if (object.geometry) resources.add(object.geometry);
					if (object.skeleton) resources.add(object.skeleton);
					const materials = Array.isArray(object.material)
						? object.material
						: [object.material];
					for (const material of materials) {
						if (!material) continue;
						resources.add(material);
						for (const value of Object.values(material)) {
							if (value?.isTexture) resources.add(value);
						}
					}
				});
				for (const resource of resources) resource.dispose();
			}

			let initialized = false;
			let visible = false;
			let render;
			const observer = new IntersectionObserver(([entry]) => {
				visible = entry.isIntersecting;
				if (visible && !initialized) {
					initialized = true;
					createFooterCockroach().catch((error) => {
						console.error(
							'Não foi possível carregar a barata do footer:',
							error,
						);
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
				if (signal.aborted) return;
				const scene = new THREE.Scene();
				const camera = new THREE.OrthographicCamera(-3, 3, 1, -1, 0.01, 100);
				camera.position.set(0, 0, 8);
				const renderer = new THREE.WebGLRenderer({
					canvas,
					alpha: true,
					antialias: true,
				});
				cleanupResources = () => {
					renderer.setAnimationLoop(null);
					renderer.dispose();
				};
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
				renderer.setClearColor(0x000000, 0);
				scene.add(new THREE.HemisphereLight(0xffffff, 0x9c8570, 2));
				const light = new THREE.DirectionalLight(0xffffff, 3);
				light.position.set(3, 5, 4);
				scene.add(light);
				const walker = new THREE.Group();
				walker.rotation.y = Math.PI / 2;
				scene.add(walker);

				let gltf;
				try {
					gltf = await new GLTFLoader().loadAsync(
						'/assets/cockroach/cockroach.glb',
					);
				} catch (error) {
					if (!signal.aborted) cleanupResources();
					throw error;
				}
				if (signal.aborted) {
					disposeModel(gltf.scene);
					return;
				}
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
				let deathAnimation;
				let sound = new Audio('/assets/audios/kill_cockroach.mp3');
				let resizeObserver;
				cleanupResources = () => {
					resizeObserver?.disconnect();
					deathAnimation?.kill();
					sound?.pause();
					canvas.classList.remove('cursor-pointer');
					renderer.setAnimationLoop(null);
					mixer.stopAllAction();
					mixer.uncacheRoot(root);
					disposeModel(root);
					renderer.dispose();
				};
				if (clip) mixer.clipAction(clip).play();
				let elapsed = 0;
				let previousTime;
				let travelLimit = 4;
				let dead = false;
				let deathX = 0;
				const reducedMotion = window.matchMedia(
					'(prefers-reduced-motion: reduce)',
				);
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
				canvas.addEventListener(
					'pointermove',
					(event) => {
						canvas.classList.toggle(
							'cursor-pointer',
							!dead && hitsCockroach(event),
						);
					},
					{ signal },
				);
				canvas.addEventListener(
					'pointerleave',
					() => canvas.classList.remove('cursor-pointer'),
					{ signal },
				);
				canvas.addEventListener(
					'click',
					(event) => {
						if (dead || !hitsCockroach(event)) return;

						sound.play();

						dead = true;
						deathX = walker.position.x / travelLimit;
						mixer.timeScale = 0;
						canvas.classList.remove('cursor-pointer');
						renderer.setAnimationLoop(null);
						deathAnimation = gsap.timeline({
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
					},
					{ signal },
				);

				function resize() {
					const width = canvas.clientWidth;
					const height = canvas.clientHeight;
					if (!width || !height) return;
					responsiveModel.scale.setScalar(belowMd.matches ? 1.5 : 1);
					walker.updateMatrixWorld(true);
					walker.position.y +=
						-1 - new THREE.Box3().setFromObject(walker).min.y;
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
				resizeObserver = new ResizeObserver(resize);
				resizeObserver.observe(container);
				window.addEventListener('resize', resize, { signal });
				belowMd.addEventListener('change', resize, { signal });
				document.addEventListener('visibilitychange', render, { signal });
				reducedMotion.addEventListener('change', render, { signal });
				resize();
				render();
			}
		}
	}

	constructor() {
		super();
	}
	connectedCallback() {
		this.#build();
	}
	disconnectedCallback() {
		this.#animations?.revert();
		this.#animations = undefined;
		this.#cleanupCockroach?.();
		this.#cleanupCockroach = undefined;
	}
}

customElements.define('enzo-footer', EnzoFooter);
