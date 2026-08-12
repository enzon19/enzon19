gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
	wrapper: '#smooth-wrapper',
	content: '#smooth-content',
	smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
	effects: true, // looks for data-speed and data-lag attributes on elements
	smoothTouch: 0.1, // much shorter smoothing time on touch devices (default is NO smoothing on touch devices)
});

ScrollTrigger.create({
	trigger: '#hero',
	start: 'bottom bottom',
	end: 'bottom top',
	pin: true,
	pinSpacing: false,
});

let tween = gsap.to('#hero-content', {
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
