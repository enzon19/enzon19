// GSAP
gsap.registerPlugin(Draggable, InertiaPlugin);
const container = document.querySelector('.gallery-container');

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
			additionalStack.innerHTML = stack.innerHTML;
		}

		const isVertical = isMd || isLg;
		const axis = isVertical ? 'y' : 'x';
		const dimension = isVertical ? 'offsetHeight' : 'offsetWidth';

		const tracks = document.querySelectorAll('.gallery-track');
		let activeTrackData = [];
		const proxy = document.createElement('div');

		tracks.forEach((track, index) => {
			if (isMobile || isMd) return;

			const items = gsap.utils.toArray(track.children);
			if (items.length === 0) return;

			// Trava as dimensões da coluna para segurar os itens absolutos
			gsap.set(track, {
				width: track.offsetWidth,
				height: track.offsetHeight,
				position: 'relative',
			});

			const gap = 12; // gap-3 = 12px
			const itemSize = items[0][dimension] + gap;
			const totalSize = itemSize * items.length;
			const wrap = gsap.utils.wrap(-itemSize, totalSize - itemSize);

			// Posiciona os itens no absoluto
			gsap.set(items, {
				position: 'absolute',
				top: 0,
				left: 0,
				[axis]: (i) => i * itemSize,
				[isVertical ? 'x' : 'y']: 0, // Zera o eixo oposto
			});

			// Se for a 2ª coluna (index 1), inverte a direção
			const direction = index % 2 === 0 ? 1 : -1;

			activeTrackData.push({ items, itemSize, wrap, direction });
		});

		// Função de atualização
		function updateProgress() {
			const currentPos = gsap.getProperty(proxy, axis);

			activeTrackData.forEach((trackData) => {
				const pos = currentPos * trackData.direction;
				gsap.set(trackData.items, {
					[axis]: (i) => trackData.wrap(i * trackData.itemSize + pos),
				});
			});
		}

		// Cria o Draggable. O GSAP vai matar ele sozinho se o breakpoint mudar!
		Draggable.create(proxy, {
			trigger: container,
			type: axis,
			inertia: true,
			onDrag: updateProgress,
			onThrowUpdate: updateProgress,
		});

		// Scroll do Mouse
		function onWheelEvent(e) {
			e.preventDefault();
			const delta = isVertical ? e.deltaY : e.deltaX;
			const currentPos = gsap.getProperty(proxy, axis);

			gsap.to(proxy, {
				[axis]: currentPos - delta,
				duration: 0.5,
				ease: 'power2.out',
				onUpdate: updateProgress,
			});
		}

		container.addEventListener('wheel', onWheelEvent, { passive: false });

		// Cleanup: Só precisamos mandar o JS remover o evento de wheel quando o breakpoint mudar.
		// Todo o resto (estilos CSS injetados, Draggable, etc) o GSAP limpa sozinho!
		return () => {
			container.removeEventListener('wheel', onWheelEvent);
		};
	},
);
