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

gsap.to('#hero', {
	opacity: 0,
	scrollTrigger: {
		trigger: '#about',
		start: 'top center',
		end: 'top 25%',
		scrub: true,
	},
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

const mm = gsap.matchMedia();
mm.add(
	{
		isDesktop: '(min-width: 48rem)',
		isMobile: '(max-width: 47.99rem)',
	},
	(context) => {
		let { isDesktop } = context.conditions;

		gsap.from('#about', {
			scale: isDesktop ? 0.95 : 0.925,
			borderRadius: '1.5rem',
			scrollTrigger: {
				trigger: '#about',
				start: 'center bottom',
				end: 'bottom bottom',
				scrub: true,
			},
		});
	},
);
