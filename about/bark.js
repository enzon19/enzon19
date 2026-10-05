const lolla = new Audio('/assets/audios/lolla.mp3');
const tutti = new Audio('/assets/audios/tutti.mp3');

document.querySelector('#tutti-lolla').addEventListener('click', () => {
	const r = Math.random();
	if (r >= 0.5) {
		lolla.play();
	} else {
		tutti.play();
	}
});
