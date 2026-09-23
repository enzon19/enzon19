gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
	lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

ScrollTrigger.batch('.gsap-fly-up', {
	start: 'top bottom',
	interval: 0.3,
	onEnter: (batch) =>
		gsap.to(batch, {
			y: 0,
			opacity: 1,
			filter: 'blur(0rem)',
			duration: 1.2,
			stagger: 0.2,
			ease: 'power3.out',
		}),
	onLeaveBack: (batch) =>
		gsap.to(batch, {
			y: 50,
			opacity: 0,
			filter: 'blur(0.4rem)',
			duration: 0.6,
			stagger: 0.1,
			ease: 'power3.out',
		}),
});
