// Duplicate stack
const additionalStack = document.querySelector('#additional-stack-column');
const isAdditionalStackVisible =
	window.getComputedStyle(additionalStack).display === 'none';
const stack = document.querySelector('#stack-column');
additionalStack.innerHTML = stack.innerHTML;

// GSAP
gsap.registerPlugin(Draggable, InertiaPlugin);

const container = document.querySelector('.gallery-container');

mm.add(
	{
		isDesktop: '(min-width: 48rem)',
		isMobile: '(max-width: 47.99rem)',
	},
	(context) => {
		let { isDesktop } = context.conditions;
		console.log(isDesktop);

		// Configurações do eixo atual
		const axis = isDesktop ? 'y' : 'x';
		const dimension = isDesktop ? 'offsetHeight' : 'offsetWidth';

		const tracks = document.querySelectorAll('.gallery-track');
		let activeTrackData = [];

		// Criamos o proxy específico para este contexto de tela
		const proxy = document.createElement('div');

		tracks.forEach((track, index) => {
			// Pula a coluna se ela estiver invisível no CSS (ex: 2ª coluna no mobile)
			if (isAdditionalStackVisible) return;

			const items = gsap.utils.toArray(track.children);
			if (items.length === 0) return;

			// Trava as dimensões da coluna e segura os filhos
			gsap.set(track, {
				width: track.offsetWidth,
				height: track.offsetHeight,
				position: 'relative',
			});

			const gap = 12; // gap-3 = 12px
			const itemSize = items[0][dimension] + gap;
			const totalSize = itemSize * items.length;

			const wrap = gsap.utils.wrap(-itemSize, totalSize - itemSize);

			// Posiciona os itens em absolute
			gsap.set(items, {
				position: 'absolute',
				top: 0,
				left: 0,
				[axis]: (i) => i * itemSize,
				[isDesktop ? 'x' : 'y']: 0,
			});

			// 🔥 O SEGREDO DA DIREÇÃO INVERTIDA:
			// Se o index for par (0), direction é 1. Se for ímpar (1), direction é -1.
			const direction = index % 2 === 0 ? 1 : -1;

			activeTrackData.push({ items, itemSize, wrap, direction });
		});

		// Função central de atualização
		function updateProgress() {
			const currentPos = gsap.getProperty(proxy, axis);

			activeTrackData.forEach((trackData) => {
				// Multiplica a posição pela direção. Se for -1, ela roda ao contrário!
				const pos = currentPos * trackData.direction;

				gsap.set(trackData.items, {
					[axis]: (i) => trackData.wrap(i * trackData.itemSize + pos),
				});
			});
		}

		// O GSAP MatchMedia automaticamente destrói esse Draggable quando a tela mudar
		Draggable.create(proxy, {
			trigger: container,
			type: axis,
			inertia: true,
			onDrag: updateProgress,
			onThrowUpdate: updateProgress,
		});

		// Função do Scroll
		function onWheelEvent(e) {
			e.preventDefault();
			const delta = isDesktop ? e.deltaY : e.deltaX;
			const currentPos = gsap.getProperty(proxy, axis);

			gsap.to(proxy, {
				[axis]: currentPos - delta,
				duration: 0.5,
				ease: 'power2.out',
				onUpdate: updateProgress,
			});
		}

		container.addEventListener('wheel', onWheelEvent, { passive: false });

		// CLEANUP DO MATCHMEDIA:
		// Essa função roda sozinha quando o breakpoint quebra.
		// O GSAP já limpa os gsap.set() e os Draggables sozinhos, nós só precisamos limpar o event listener nativo!
		return () => {
			container.removeEventListener('wheel', onWheelEvent);
		};
	},
);
