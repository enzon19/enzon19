const header = document.querySelector('header');
const headerPill = document.querySelector('header > div');
const headerMenuButton = document.querySelector('#mobile-header-button-menu');
const navWrapper = document.querySelector('#nav-wrapper');
const iconMenu = document.querySelector(
	'#mobile-header-button-menu > ion-icon[name="menu"]',
);
const iconClose = document.querySelector(
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
		let { isSm, isMd, isMobile } = context.conditions;
		console.log(isSm, isMd, isMobile);
		gsap.fromTo(
			'header',
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
		tl.to(navWrapper, { height: 0, duration: 0.6, ease: 'back.in(1.25)' }, 0)
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
