// ----- PROFILE-BUTTONS -----
document
	.querySelector('#profile-buttons')
	.addEventListener('mouseover', (event) => {
		const { target } = event;

		if (
			(target.tagName == 'a' || target.closest('a')) &&
			faceVariant == 'default'
		) {
			faceVariant = 'bigSmile';
		}
	});

document
	.querySelector('#profile-buttons')
	.addEventListener('mouseleave', (event) => {
		if (faceVariant == 'bigSmile') faceVariant = 'default';
	});

// ----- MOBILE DIZZY -----
import Shake from 'shake.js';
async function setShakeListener() {
	const shake = new Shake({ threshold: 20, timeout: 2000 });

	window.addEventListener('shake', () => {
		makeHimDizzy();
	});

	shake.start();
}

if (
	typeof DeviceMotionEvent !== 'undefined' &&
	typeof DeviceMotionEvent.requestPermission === 'function'
) {
	window.addEventListener('click', async () => {
		const permission = await DeviceMotionEvent.requestPermission();
		if (permission !== 'granted') return;
		setShakeListener();
	});
} else {
	setShakeListener();
}

// ----- FOOD -----
const hasTouchscreen = 'ontouchstart' in window;
let currentObjectCursor = null;
if (!hasTouchscreen) {
	const bg = document.querySelector('main > section#hero');
	const face = document.querySelector('#enzo-face');

	face.parentElement.addEventListener('mouseover', (event) => {
		if (faceVariant != 'default') return;

		const chance = Math.random();
		if (chance > 0.03) return;

		const objectOptions = [
			'pizza',
			'burger',
			'chocolate',
			'money',
			'javascript',
		];
		const randomObjectIndex = Math.floor(Math.random() * objectOptions.length);

		currentObjectCursor = objectOptions[randomObjectIndex];
		faceVariant = randomObjectIndex >= 3 ? 'love' : 'yummy';
		bg.style.cursor = `url(/assets/cursor/${currentObjectCursor}.png), auto`;
	});

	function resetCursor() {
		if (faceVariant == 'dizzy') return;

		bg.style.cursor = 'default';
		faceVariant = 'default';
		currentObjectCursor = null;
	}

	bg.addEventListener('mouseleave', resetCursor);
	face.addEventListener('click', resetCursor);
}
