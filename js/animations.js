// [ELEMENT] [SCREEN]

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
	wrapper: '#smooth-wrapper',
	content: '#smooth-content',
	smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
	smoothTouch: 0.2, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

ScrollTrigger.create({
	trigger: '#hero',
	start: 'bottom bottom',
	end: 'bottom top',
	pin: true,
	pinSpacing: false,
});

gsap.to('#hero-content', {
	scale: 0.75,
	yPercent: 50,
	immediateRender: false,
	scrollTrigger: {
		trigger: '#about',
		start: 'top bottom',
		end: 'top top',
		scrub: true,
	},
});

const flyUpElements = gsap.utils.toArray('.gsap-fly-up');
flyUpElements.forEach((elemento) => {
	gsap.from(elemento, {
		y: 50,
		opacity: 0,
		duration: 0.8,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: elemento,
			start: 'top 96.7%',
			toggleActions: 'play play none reverse', // [START] [QUICK START] [END TO START] [END]
		},
	});
});

const mm = gsap.matchMedia();
mm.add(
	{
		isDesktop: '(min-width: 48rem)',
		isMobile: '(max-width: 47.99rem)',
	},
	(context) => {
		let { isDesktop, isMobile } = context.conditions;

		gsap.from('#about', {
			scale: isDesktop ? 0.95 : 0.925,
			borderRadius: '1.5rem',
			scrollTrigger: {
				trigger: '#about',
				start: isDesktop ? 'center bottom' : '30% bottom',
				end: isDesktop ? 'bottom bottom' : 'top 35%',
				scrub: true,
			},
		});

		gsap.to('#hero', {
			opacity: 0,
			scrollTrigger: {
				trigger: '#about',
				start: isDesktop ? 'top center' : 'top 30%',
				end: isDesktop ? 'top 25%' : 'top 10%',
				scrub: true,
			},
		});

		if (isMobile) {
			const projectCards = gsap.utils.toArray(
				'#main-projects a.group, #other-projects a.group',
			);

			projectCards.forEach((card) => {
				ScrollTrigger.create({
					trigger: card,
					start: 'top 60%',
					end: '50% 40%',
					toggleClass: 'is-active',
				});
			});
		}
	},
);
