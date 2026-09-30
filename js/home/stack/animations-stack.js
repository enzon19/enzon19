// [IA NOTICE] MADE WITH CLAUDE AND GEMINI
gsap.registerPlugin(Draggable, InertiaPlugin);
const container = document.querySelector('.gallery-container');
let originalStackHTML;

mm.add(
	{
		isMobile: '(max-width: 47.99rem)',
		isMd: '(min-width: 48rem) and (max-width: 63.99rem)',
		isLg: '(min-width: 64rem)',
	},
	(context) => {
		let { isMobile, isMd, isLg } = context.conditions;

		if (isLg) {
			const additionalStack = document.querySelector(
				'#additional-stack-column',
			);
			const stack = document.querySelector('#stack-column');
			const items = Array.from(stack.children);
			const halfIndex = Math.floor(items.length / 2);

			if (!originalStackHTML) {
				originalStackHTML = stack.innerHTML;
				additionalStack.innerHTML = '';
				items.slice(0, halfIndex).forEach((item) => {
					additionalStack.appendChild(item.cloneNode(true));
				});
			}

			stack.innerHTML = '';
			items.slice(halfIndex, items.length).forEach((item) => {
				stack.appendChild(item.cloneNode(true));
			});
		} else if (originalStackHTML) {
			document.querySelector('#stack-column').innerHTML = originalStackHTML;
		}

		const isVertical = isMd || isLg;
		const axis = isVertical ? 'y' : 'x';
		const dimension = isVertical ? 'offsetHeight' : 'offsetWidth';

		const tracks = document.querySelectorAll('.gallery-track');
		let activeTrackData = [];
		const proxy = document.createElement('div');

		tracks.forEach((track, index) => {
			if (window.getComputedStyle(track).display === 'none') return;

			const items = gsap.utils.toArray(track.children);
			if (items.length === 0) return;

			gsap.set(track, {
				width: track.offsetWidth,
				height: track.offsetHeight,
				position: 'relative',
			});

			const gap = 12; // gap-3 = 12px
			const itemSize = items[0][dimension] + gap;
			const totalSize = itemSize * items.length;
			const wrap = gsap.utils.wrap(-itemSize, totalSize - itemSize);

			gsap.set(items, {
				position: 'absolute',
				top: 0,
				left: 0,
				[axis]: (i) => i * itemSize,
				[isVertical ? 'x' : 'y']: 0,
			});

			const direction = index % 2 === 0 ? 1 : -1;
			activeTrackData.push({ items, itemSize, wrap, direction });
		});

		function updateProgress() {
			const currentPos = gsap.getProperty(proxy, axis);

			activeTrackData.forEach((trackData) => {
				const pos = currentPos * trackData.direction;
				gsap.set(trackData.items, {
					[axis]: (i) => trackData.wrap(i * trackData.itemSize + pos),
				});
			});
		}

		const AUTO_SPEED = 0.5;
		let autoPlayActive = true;

		function autoTick() {
			if (!autoPlayActive) return;
			const currentPos = gsap.getProperty(proxy, axis);
			gsap.set(proxy, { [axis]: currentPos + AUTO_SPEED });
			updateProgress();
		}
		gsap.ticker.add(autoTick);

		function onMouseEnter() {
			autoPlayActive = false;
		}

		function onMouseLeave() {
			if (!draggableInstance.isDragging && !draggableInstance.isThrowing) {
				autoPlayActive = true;
			}
		}

		container.addEventListener('mouseenter', onMouseEnter);
		container.addEventListener('mouseleave', onMouseLeave);

		const [draggableInstance] = Draggable.create(proxy, {
			trigger: container,
			type: axis,
			inertia: true,
			onDrag: updateProgress,
			onThrowUpdate: updateProgress,
			onThrowComplete: () => {
				if (!container.matches(':hover')) {
					autoPlayActive = true;
				}
			},
		});

		function onWheelEvent(e) {
			e.preventDefault();
			const delta =
				Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
			const currentPos = gsap.getProperty(proxy, axis);

			gsap.to(proxy, {
				[axis]: currentPos - delta,
				duration: 0.6,
				ease: 'circ.out',
				onUpdate: updateProgress,
			});
		}

		container.addEventListener('wheel', onWheelEvent, { passive: false });

		return () => {
			container.removeEventListener('wheel', onWheelEvent);
			container.removeEventListener('mouseenter', onMouseEnter);
			container.removeEventListener('mouseleave', onMouseLeave);
			gsap.ticker.remove(autoTick);
		};
	},
);
