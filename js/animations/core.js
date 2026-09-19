gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({ anchors: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const flyUpElements = gsap.utils.toArray('.gsap-fly-up');
flyUpElements.forEach((e) => {
	gsap.from(e, {
		y: 50,
		opacity: 0,
		duration: 0.8,
		filter: 'blur(0.5rem)',
		ease: 'power3.out',
		scrollTrigger: {
			trigger: e,
			start: 'top 96.7%',
			toggleActions: 'play play none reverse', // [START] [QUICK START] [END TO START] [END]
		},
	});
});
