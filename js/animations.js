gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
	wrapper: '#smooth-wrapper',
	content: '#smooth-content',
	smooth: 1.5, // how long (in seconds) it takes to "catch up" to the native scroll position
	effects: true, // looks for data-speed and data-lag attributes on elements
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

const expandAboutSection = gsap.from('#about', {
	scale: 0.975,
	borderRadius: '1.5rem',
	scrollTrigger: {
		trigger: '#about',
		start: 'center bottom',
		end: 'bottom bottom',
		scrub: true,
	},
});
