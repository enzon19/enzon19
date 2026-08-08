const nameElement = document.querySelector('#name');
const canvas = document.querySelector('#enzo-face');
const containerX = canvas.width / 2;
const containerY = canvas.height / 2;
const ctx = canvas.getContext('2d');

// ---- FOLLOW MOUSE ----
let mouseX, mouseY;
document.addEventListener('mousemove', (event) => {
	const rect = canvas.getBoundingClientRect();

	const scaleX = canvas.width / rect.width;
	const scaleY = canvas.height / rect.height;
	mouseX = (event.clientX - rect.left) * scaleX;
	mouseY = (event.clientY - rect.top) * scaleY;

	if (!blinking) requestAnimationFrame(() => draw(mouseX, mouseY, false));
});

// ---- BLINKING ----
let blinking;
const wait = (t) => new Promise((resolve, reject) => setTimeout(resolve, t));
setInterval(async () => {
	blinking = true;
	requestAnimationFrame(() => draw(mouseX, mouseY, true));
	await wait(300);
	blinking = false;
	requestAnimationFrame(() => draw(mouseX, mouseY, false));
}, 6000);

// ---- FACE ----
const faceImg = new Image();
faceImg.src = '/assets/face/face.png';

function drawFace() {
	const { width: faceWidth, height: faceHeight } = faceImg;

	ctx.drawImage(
		faceImg,
		containerX - faceWidth / 2,
		containerY - faceHeight / 2,
		faceWidth,
		faceHeight,
	);
}

// ---- SMILE ----
const smileVariants = {
	default: {
		x: 208,
		y: 437,
		img: new Image(),
	},
	bigSmile: {
		x: 208,
		y: 437,
		img: new Image(),
	},
	dizzy: {
		x: 208,
		y: 437,
		img: new Image(),
	},
	yummy: {
		x: 208,
		y: 437,
		img: new Image(),
	},
};

smileVariants.default.img.src = '/assets/face/smile.png';
smileVariants.bigSmile.img.src = '/assets/face/big-smile.png';
smileVariants.dizzy.img.src = '/assets/face/dizzy.png';
smileVariants.yummy.img.src = '/assets/face/yummy.png';

function drawSmile(variant = 'default') {
	const currentVariant = smileVariants[variant];
	if (!currentVariant) throw 'Invalid smile variant.';

	ctx.drawImage(
		currentVariant.img,
		currentVariant.x,
		currentVariant.y,
		currentVariant.img.width,
		currentVariant.img.height,
	);
}

// ---- EYES ----
const eyesVariants = {
	right: {
		default: {
			x: containerX + 85,
			y: containerY - 62,
			plusWidth: 12,
			img: new Image(),
		},
		love: {
			x: 208,
			y: 437,
			plusWidth: 9,
			img: new Image(),
		},
		dizzy: {
			x: 208,
			y: 437,
			plusWidth: 9,
			img: new Image(),
		},
	},
	left: {
		default: {
			x: containerX - 75,
			y: containerY - 48,
			plusWidth: 9,
			img: new Image(),
		},
		love: {
			x: 208,
			y: 437,
			plusWidth: 9,
			img: new Image(),
		},
		dizzy: {
			x: 208,
			y: 437,
			plusWidth: 9,
			img: new Image(),
		},
	},
};

eyesVariants.right.default.img.src = '/assets/face/eye-right.png';
eyesVariants.right.love.img.src = '/assets/face/eye-right-love.png';
eyesVariants.right.dizzy.img.src = '/assets/face/eye-right-dizzy.png';

eyesVariants.left.default.img.src = '/assets/face/eye-left.png';
eyesVariants.left.love.img.src = '/assets/face/eye-left-love.png';
eyesVariants.left.dizzy.img.src = '/assets/face/eye-left-dizzy.png';

function drawEye(targetX, targetY, side, variant = 'default') {
	const eyeSide = eyesVariants[side];
	if (!eyeSide) throw 'Invalid eye side.';
	const currentVariant = eyeSide[variant];
	if (!currentVariant) throw 'Invalid eye variant.';

	const { img, x: eyeX, y: eyeY, plusWidth } = currentVariant;
	const { width: eyeWidth, height: eyeHeight } = img;
	const eyeWidthWithSpace = eyeWidth + plusWidth;

	const eyeCenterX = eyeX + eyeWidth / 2;
	const eyeCenterY = eyeY + eyeHeight / 2;
	const eyeAngle = Math.atan2(targetY - eyeCenterY, targetX - eyeCenterX);

	ctx.save();
	ctx.translate(eyeCenterX, eyeCenterY);
	ctx.rotate(eyeAngle);
	ctx.drawImage(
		img,
		0,
		0,
		eyeWidthWithSpace,
		eyeHeight,
		eyeWidthWithSpace / 2,
		-eyeHeight / 2,
		eyeWidthWithSpace,
		eyeHeight,
	);
	ctx.restore();
}

function draw(mouseX, mouseY, blink, love) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const targetY = mouseY ?? nameElement.getBoundingClientRect().y;
	const targetX = mouseX ?? nameElement.getBoundingClientRect().x;

	drawFace();
	drawSmile();

	if (blink) return;

	drawEye(targetX, targetY, 'left');
	drawEye(targetX, targetY, 'right');
}

(async () => {
	Promise.all([
		new Promise((resolve) => (faceImg.onload = resolve)),
		new Promise((resolve) => (smileVariants.default.img.onload = resolve)),
		new Promise((resolve) => (eyesVariants.right.default.img.onload = resolve)),
		new Promise((resolve) => (eyesVariants.left.default.img.onload = resolve)),
	]).then(() => {
		draw(); // Call draw() after all images are loaded
	});
})();
