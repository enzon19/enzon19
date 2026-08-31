const ATTRIBUTES = ['page', 'triggered'];
const NAV_LINKS = [
	{ href: '/about', label: 'Sobre' },
	{ href: '/projects', label: 'Projetos' },
	{ href: '/contact', label: 'Contato' },
];

export default class EnzoHeader extends HTMLElement {
	#page;

	#header;
	#headerPill;
	#headerMenuButton;
	#navWrapper;
	#iconMenu;
	#iconClose;

	#isMenuOpen = false;
	#closedRadius = 0;
	#headerMM = null;
	#ownsMatchMedia = false;

	#onMenuButtonClick = () => this.#toggleMenu();

	get page() {
		return this.#page;
	}
	set page(value) {
		this.#page = value;
		this.#updatePage();
	}

	get triggered() {
		return this.hasAttribute('triggered');
	}
	set triggered(value) {
		this.#updateTriggered();
	}

	#build() {
		const header = document.createElement('header');

		header.className =
			'pointer-events-none sticky top-0 z-50 w-full p-4 md:p-6';

		const navLinksHtml = NAV_LINKS.map(
			({ href, label }) => `
						<a
							href="${href}"
							class="w-full text-center transition-colors hover:text-black sm:w-auto dark:hover:text-white"
							>${label}</a
						>`,
		).join('');

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
						id="mobile-header-button-menu"
						aria-label="Open menu"
						aria-expanded="false"
						aria-controls="nav-wrapper">
						<ion-icon name="menu" class="absolute inset-0 size-6"></ion-icon>
						<ion-icon
							name="close"
							class="absolute inset-0 size-6 opacity-0"></ion-icon>
					</button>
				</div>
				<div id="nav-wrapper" class="h-0 overflow-hidden sm:h-auto">
					<nav
						class="flex flex-col items-center gap-4 pt-6 pb-4 sm:flex-row sm:gap-6 sm:p-0">${navLinksHtml}
					</nav>
				</div>
			</div>
		</div>
		`;

		this.innerHTML = '';
		this.append(header);

		this.#header = header;
		this.#headerPill = header.querySelector(':scope > div');
		this.#headerMenuButton = header.querySelector('#mobile-header-button-menu');
		this.#navWrapper = header.querySelector('#nav-wrapper');
		this.#iconMenu = header.querySelector(
			'#mobile-header-button-menu > ion-icon[name="menu"]',
		);
		this.#iconClose = header.querySelector(
			'#mobile-header-button-menu > ion-icon[name="close"]',
		);

		this.#updatePage();
		this.#updateTriggered();
		this.#setupResponsiveBehavior();

		this.#headerMenuButton.addEventListener('click', this.#onMenuButtonClick);
	}

	#updatePage() {
		if (!this.#header) return;

		this.#header
			.querySelectorAll('nav a.font-bold')
			.forEach((a) =>
				a.classList.remove('font-bold', 'text-black', 'dark:text-white'),
			);

		if (this.page) {
			const currentPage = this.#header.querySelector(`a[href="/${this.page}"]`);
			currentPage.classList.add('font-bold', 'text-black', 'dark:text-white');

			const homepageAnchor = this.#header.querySelector('a[href="#"]');
			homepageAnchor.href = '/';
		} else {
			const homepageAnchor = this.#header.querySelector('a[href="/"]');
			if (homepageAnchor) homepageAnchor.href = '#';
		}
	}

	#updateTriggered() {
		if (!this.#header) return;
		this.#header.classList.toggle('scale-x-0', this.triggered);
	}

	#setupResponsiveBehavior() {
		this.#ownsMatchMedia = !window?.mm;
		const headerMM = window?.mm ? window.mm : gsap.matchMedia();
		this.#headerMM = headerMM;

		headerMM.add(
			{
				isMobile: '(max-width: 39.99rem)',
				isSm: '(min-width: 40rem) and (max-width: 47.99rem)',
				isMd: '(min-width: 48rem)',
			},
			(context) => {
				const { isMd, isMobile } = context.conditions;

				if (this.triggered) {
					gsap.fromTo(
						this.#header,
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
					gsap.set(this.#navWrapper, { height: 0 });
					gsap.set(this.#iconMenu, { opacity: 1, rotate: 0 });
					gsap.set(this.#iconClose, { opacity: 0, rotate: -90 });
					this.#isMenuOpen = false;

					this.#closedRadius =
						this.#headerPill.getBoundingClientRect().height / 2;
					gsap.set(this.#headerPill, { borderRadius: this.#closedRadius });
				}
			},
		);
	}

	#toggleMenu() {
		this.#isMenuOpen = !this.#isMenuOpen;
		const tl = gsap.timeline();

		if (this.#isMenuOpen) {
			tl.to(
				this.#headerPill,
				{ borderRadius: 29, duration: 0.35, ease: 'power2.out' },
				0,
			)
				.to(
					this.#navWrapper,
					{ height: 'auto', duration: 0.5, ease: 'back.out(1.4)' },
					0,
				)
				.to(
					this.#iconMenu,
					{ opacity: 0, rotate: 90, duration: 0.2, ease: 'power2.in' },
					0,
				)
				.to(
					this.#iconClose,
					{ opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.5)' },
					0.1,
				);
		} else {
			tl.to(
				this.#navWrapper,
				{ height: 0, duration: 0.6, ease: 'back.in(1.25)' },
				0,
			)
				.to(
					this.#headerPill,
					{
						borderRadius: this.#closedRadius,
						duration: 0.3,
						ease: 'power2.in',
					},
					0.1,
				)
				.to(this.#header, {
					yPercent: -3.75,
					duration: 0.2,
				})
				.to(
					this.#iconClose,
					{ opacity: 0, rotate: -90, duration: 0.2, ease: 'power2.in' },
					0,
				)
				.to(
					this.#iconMenu,
					{ opacity: 1, rotate: 0, duration: 0.4, ease: 'back.out(1.5)' },
					0.1,
				)
				.to(
					this.#header,
					{
						yPercent: 0,
						duration: 0.2,
						ease: 'power2.out',
					},
					0.8,
				);
		}

		this.#headerMenuButton.setAttribute(
			'aria-expanded',
			String(this.#isMenuOpen),
		);
		this.#headerMenuButton.setAttribute(
			'aria-label',
			this.#isMenuOpen ? 'Close menu' : 'Open menu',
		);
	}

	static get observedAttributes() {
		return ATTRIBUTES;
	}
	constructor() {
		super();
	}
	connectedCallback() {
		this.#build();
	}
	disconnectedCallback() {
		if (this.#ownsMatchMedia) {
			this.#headerMM?.revert();
		}
		this.#headerMenuButton?.removeEventListener(
			'click',
			this.#onMenuButtonClick,
		);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (!ATTRIBUTES.includes(name)) return;
		this[name] = newValue;
	}
}

customElements.define('enzo-header', EnzoHeader);
