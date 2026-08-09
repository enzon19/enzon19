// ----- PROFILE-BUTTONS -----
document
	.querySelector('#profile-buttons')
	.addEventListener('mouseover', (event) => {
		const { target } = event;

		if (
			(target.tagName == 'a' || target.closest('a')) &&
			faceVariant != 'bigSmile' &&
			faceVariant != 'dizzy'
		) {
			faceVariant = 'bigSmile';
		}
	});

document
	.querySelector('#profile-buttons')
	.addEventListener('mouseleave', (event) => {
		if (faceVariant != 'dizzy') faceVariant = 'default';
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
