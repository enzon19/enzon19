const attributes = ['page', 'triggered'];

export default class EnzoHeader extends HTMLElement {
	#page;
	get page() {
		return this.#page;
	}
	set page(value) {
		this.#page = value;
		if (this.isConnected) this.#render();
	}

	get triggered() {
		return this.hasAttribute('triggered');
	}
	set triggered(value) {
		if (this.isConnected) this.#render();
	}

	#render() {
		const header = document.createElement('header');

		header.className = 'pointer-events-none fixed z-50 w-full p-4 md:p-6';
		if (this.triggered) header.classList.add('scale-x-0');

		header.innerHTML = `<div
			class="pointer-events-auto mx-auto flex max-w-fit flex-col overflow-hidden border border-neutral-200/40 bg-neutral-300/60 backdrop-blur-2xl sm:rounded-full dark:border-neutral-500/40 dark:bg-neutral-600/60">
			<div
				class="flex flex-col items-center justify-between px-6 py-3 sm:flex-row sm:gap-6 md:px-8 md:py-4">
				<div class="flex items-center justify-between gap-6">
					<a
						href="#"
						class="group flex items-center gap-3 text-black dark:text-white">
						<div
							class="relative size-8 duration-300 md:transition-all md:group-hover:scale-125">
							<img
								src="/assets/face/happy-enzo.png"
								alt="Enzo Face"
								class="absolute inset-0 hidden size-8 object-contain transition-all group-hover:block" />
							<img
								src="/assets/face/normal-enzo.png"
								alt="Enzo Face"
								class="absolute inset-0 block size-8 object-contain group-hover:hidden" />
						</div>
						<h1 class="text-lg font-bold">enzon19</h1>
					</a>
					<button
						class="relative flex size-6 cursor-pointer flex-col items-center justify-center sm:hidden"
						id="mobile-header-button-menu">
						<ion-icon name="menu" class="absolute inset-0 size-6"></ion-icon>
						<ion-icon
							name="close"
							class="absolute inset-0 size-6 opacity-0"></ion-icon>
					</button>
				</div>
				<div id="nav-wrapper" class="h-0 overflow-hidden sm:h-auto">
					<nav
						class="flex flex-col items-center gap-4 pt-6 pb-4 sm:flex-row sm:gap-6 sm:p-0">
						<a
							href="/about"
							class="w-full text-center transition-colors hover:text-black sm:w-auto dark:hover:text-white"
							>Sobre</a
						>
						<a
							href="/projects"
							class="w-full text-center transition-colors hover:text-black sm:w-auto dark:hover:text-white"
							>Projetos</a
						>
						<a
							href="/contact"
							class="w-full text-center transition-colors hover:text-black sm:w-auto dark:hover:text-white"
							>Contato</a
						>
					</nav>
				</div>
			</div>
		</div>
		`;

		this.innerHTML = '';
		this.append(header);

		if (this.page) {
			const currentPage = this.querySelector(`a[href="/${this.page}"]`);
			currentPage.classList.add('font-bold', 'text-black', 'dark:text-white');
		}

		const headerPill = this.querySelector('header > div');
		const headerMenuButton = this.querySelector('#mobile-header-button-menu');
		const navWrapper = this.querySelector('#nav-wrapper');
		const iconMenu = this.querySelector(
			'#mobile-header-button-menu > ion-icon[name="menu"]',
		);
		const iconClose = this.querySelector(
			'#mobile-header-button-menu > ion-icon[name="close"]',
		);

		let isHeaderMenuOpen = false;
		let closedRadius = 0;

		const headerMM = window?.mm ? window.mm : gsap.matchMedia();
		headerMM.add(
			{
				isMobile: '(max-width: 39.99rem)',
				isSm: '(min-width: 40rem) and (max-width: 47.99rem)',
				isMd: '(min-width: 48rem)',
			},
			(context) => {
				let { isMd, isMobile } = context.conditions;

				if (this.triggered) {
					gsap.fromTo(
						header,
						{
							yPercent: -150,
						},
						{
							yPercent: 0,
							scaleX: 1,
							duration: 0.8,
							ease: 'back.out(1)',
							immediateRender: true,
							scrollTrigger: {
								trigger: '#about',
								start: isMd ? 'top 30%' : 'top 20%',
								end: isMd ? 'top 10%' : 'top 10%',
								toggleActions: 'play play none reverse',
							},
						},
					);
				}

				if (isMobile) {
					gsap.set(navWrapper, { height: 0 });
					gsap.set(iconMenu, { opacity: 1, rotate: 0 });
					gsap.set(iconClose, { opacity: 0, rotate: -90 });
					isHeaderMenuOpen = false;

					closedRadius = headerPill.getBoundingClientRect().height / 2;
					gsap.set(headerPill, { borderRadius: closedRadius });
				}
			},
		);

		headerMenuButton.addEventListener('click', () => {
			isHeaderMenuOpen = !isHeaderMenuOpen;
			const tl = gsap.timeline();

			if (isHeaderMenuOpen) {
				tl.to(
					headerPill,
					{ borderRadius: 29, duration: 0.35, ease: 'power2.out' },
					0,
				)
					.to(
						navWrapper,
						{ height: 'auto', duration: 0.5, ease: 'back.out(1.4)' },
						0,
					)
					.to(
						iconMenu,
						{ opacity: 0, rotate: 90, duration: 0.2, ease: 'power2.in' },
						0,
					)
					.to(
						iconClose,
						{ opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.5)' },
						0.1,
					);
			} else {
				tl.to(
					navWrapper,
					{ height: 0, duration: 0.6, ease: 'back.in(1.25)' },
					0,
				)
					.to(
						headerPill,
						{ borderRadius: closedRadius, duration: 0.3, ease: 'power2.in' },
						0.1,
					)
					.to(header, {
						yPercent: -3.75,
						duration: 0.2,
					})
					.to(
						iconClose,
						{ opacity: 0, rotate: -90, duration: 0.2, ease: 'power2.in' },
						0,
					)
					.to(
						iconMenu,
						{ opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.5)' },
						0.1,
					)
					.to(
						header,
						{
							yPercent: 0,
							duration: 0.2,
							ease: 'power2.out',
						},
						0.8,
					);
			}
		});
	}

	static get observedAttributes() {
		return attributes;
	}
	constructor() {
		super();
	}
	connectedCallback() {
		this.#render();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (!attributes.includes(name)) return;
		this[name] = newValue;
	}
}

customElements.define('enzo-header', EnzoHeader);
