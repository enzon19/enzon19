const nameElement = document.querySelector('#name');
const canvas = document.querySelector('#enzo-face');
const ctx = canvas.getContext('2d');

const faceImg = new Image(),
	eyeLeftImg = new Image(),
	eyeRightImg = new Image();
faceImg.src = '/assets/face/face.png';
eyeLeftImg.src = '/assets/face/eye-left.png';
eyeRightImg.src = '/assets/face/eye-right.png';

let mouseX, mouseY, blinking;
document.addEventListener('mousemove', (event) => {
	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	mouseX = (event.clientX - rect.left) * scaleX;
	mouseY = (event.clientY - rect.top) * scaleY;

	if (!blinking) requestAnimationFrame(() => draw(mouseX, mouseY, false));
});

const wait = (t) => new Promise((resolve, reject) => setTimeout(resolve, t));
setInterval(async () => {
	blinking = true;
	requestAnimationFrame(() => draw(mouseX, mouseY, true));
	await wait(300);
	blinking = false;
	requestAnimationFrame(() => draw(mouseX, mouseY, false));
}, 6000);

function draw(mouseX, mouseY, blink, love) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const containerX = canvas.width / 2;
	const containerY = canvas.height / 2;
	const { width: faceWidth, height: faceHeight } = faceImg;
	const targetY = mouseY ?? nameElement.getBoundingClientRect().y;
	const targetX = mouseX ?? nameElement.getBoundingClientRect().x;

	const { width: eyeLeftWidth, height: eyeLeftHeight } = eyeLeftImg;
	const eyeLeftWidthWithSpace = eyeLeftWidth + 9;
	const eyeLeftX = containerX - 75;
	const eyeLeftY = containerY - 48;
	const eyeLeftCenterX = eyeLeftX + eyeLeftWidth / 2;
	const eyeLeftCenterY = eyeLeftY + eyeLeftHeight / 2;
	const eyeLeftAngle = Math.atan2(
		targetY - eyeLeftCenterY,
		targetX - eyeLeftCenterX,
	);

	const { width: eyeRightWidth, height: eyeRightHeight } = eyeRightImg;
	const eyeRightWidthWithSpace = eyeRightWidth + 12;
	const eyeRightX = containerX + 85;
	const eyeRightY = containerY - 62;
	const eyeRightCenterX = eyeRightX + eyeRightWidth / 2;
	const eyeRightCenterY = eyeRightY + eyeRightHeight / 2;
	const eyeRightAngle = Math.atan2(
		targetY - eyeRightCenterY,
		targetX - eyeRightCenterX,
	);

	ctx.drawImage(
		faceImg,
		containerX - faceWidth / 2,
		containerY - faceHeight / 2,
		faceWidth,
		faceHeight,
	);

	if (blink) return;

	ctx.save();
	ctx.translate(eyeLeftCenterX, eyeLeftCenterY);
	ctx.rotate(eyeLeftAngle);
	ctx.drawImage(
		eyeLeftImg,
		0,
		0,
		eyeLeftWidthWithSpace,
		eyeLeftHeight,
		eyeLeftWidthWithSpace / 2,
		-eyeLeftHeight / 2,
		eyeLeftWidthWithSpace,
		eyeLeftHeight,
	);
	ctx.restore();

	ctx.save();
	ctx.translate(eyeRightCenterX, eyeRightCenterY);
	ctx.rotate(eyeRightAngle);
	ctx.drawImage(
		eyeRightImg,
		0,
		0,
		eyeRightWidthWithSpace,
		eyeRightHeight,
		eyeRightWidthWithSpace / 2,
		-eyeRightHeight / 2,
		eyeRightWidthWithSpace,
		eyeRightHeight,
	);
	ctx.restore();
}

(async () => {
	Promise.all([
		new Promise((resolve) => (faceImg.onload = resolve)),
		new Promise((resolve) => (eyeRightImg.onload = resolve)),
		new Promise((resolve) => (eyeLeftImg.onload = resolve)),
	]).then(() => {
		draw(); // Call draw() after all images are loaded
	});
})();
