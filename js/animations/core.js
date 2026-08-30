gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
	wrapper: '#smooth-wrapper',
	content: '#smooth-content',
	smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
	smoothTouch: 0.2, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

const flyUpElements = gsap.utils.toArray('.gsap-fly-up');
flyUpElements.forEach((e) => {
	gsap.from(e, {
		y: 50,
		opacity: 0,
		duration: 0.8,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: e,
			start: 'top 96.7%',
			toggleActions: 'play play none reverse', // [START] [QUICK START] [END TO START] [END]
		},
	});
});
