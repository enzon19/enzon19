const nameElement = document.querySelector('#name');
const canvas = document.querySelector('#enzo-face');
const containerX = canvas.width / 2;
const containerY = canvas.height / 2;
const ctx = canvas.getContext('2d');

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
		x: (208 * containerX) / 241.5,
		y: (437 * containerY) / 304,
		img: new Image(),
	},
	bigSmile: {
		x: (218 * containerX) / 241.5,
		y: (427 * containerY) / 304,
		img: new Image(),
	},
	love: {
		x: (230 * containerX) / 241.5,
		y: (427 * containerY) / 304,
		img: new Image(),
	},
	dizzy: {
		x: (180 * containerX) / 241.5,
		y: (449 * containerY) / 304,
		img: new Image(),
	},
	yummy: {
		x: (174 * containerX) / 241.5,
		y: (428 * containerY) / 304,
		img: new Image(),
	},
};

smileVariants.default.img.src = '/assets/face/smile.png';
smileVariants.bigSmile.img.src = '/assets/face/smile-big.png';
smileVariants.love.img.src = '/assets/face/smile-love.png';
smileVariants.dizzy.img.src = '/assets/face/smile-dizzy.png';
smileVariants.yummy.img.src = '/assets/face/smile-yummy.png';

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
			x: (326.5 * containerX) / 241.5,
			y: (242 * containerY) / 304,
			plusWidth: (54 * containerX) / 241.5,
			img: new Image(),
		},
		love: {
			x: (299 * containerX) / 241.5,
			y: (227 * containerY) / 304,
			plusWidth: (18 * containerX) / 241.5,
			img: new Image(),
		},
		dizzy: {
			x: (307 * containerX) / 241.5,
			y: (229 * containerY) / 304,
			plusWidth: (8 * containerX) / 241.5,
			img: new Image(),
		},
		yummy: {
			x: (316 * containerX) / 241.5,
			y: (233 * containerY) / 304,
			plusWidth: (33 * containerX) / 241.5,
			img: new Image(),
		},
	},
	left: {
		default: {
			x: (155 * containerX) / 241.5,
			y: (256 * containerY) / 304,
			plusWidth: (54 * containerX) / 241.5,
			img: new Image(),
		},
		love: {
			x: (122 * containerX) / 241.5,
			y: (238 * containerY) / 304,
			plusWidth: (16 * containerX) / 241.5,
			img: new Image(),
		},
		dizzy: {
			x: (140 * containerX) / 241.5,
			y: (242.5 * containerY) / 304,
			plusWidth: (8 * containerX) / 241.5,
			img: new Image(),
		},
		yummy: {
			x: (138 * containerX) / 241.5,
			y: (248 * containerY) / 304,
			plusWidth: (33 * containerX) / 241.5,
			img: new Image(),
		},
	},
};

eyesVariants.right.default.img.src = '/assets/face/eye-right.png';
eyesVariants.right.love.img.src = '/assets/face/eye-right-love.png';
eyesVariants.right.yummy.img.src = '/assets/face/eye-right-yummy.png';
eyesVariants.right.dizzy.img.src = '/assets/face/eye-right-dizzy.png';

eyesVariants.left.default.img.src = '/assets/face/eye-left.png';
eyesVariants.left.love.img.src = '/assets/face/eye-left-love.png';
eyesVariants.left.yummy.img.src = '/assets/face/eye-left-yummy.png';
eyesVariants.left.dizzy.img.src = '/assets/face/eye-left-dizzy.png';

function drawEye(targetX, targetY, side, variant = 'default') {
	const eyeSide = eyesVariants[side];
	if (!eyeSide) throw 'Invalid eye side.';
	const currentVariant = eyeSide[variant];
	if (!currentVariant) throw 'Invalid eye variant.';

	const { img, x: eyeX, y: eyeY, plusWidth } = currentVariant;
	const { width: eyeWidth, height: eyeHeight } = img;

	const eyeCenterX = eyeX + eyeWidth / 2;
	const eyeCenterY = eyeY + eyeHeight / 2;
	const eyeAngle = Math.atan2(targetY - eyeCenterY, targetX - eyeCenterX);
	const travelDistance = plusWidth / 2;

	ctx.save();
	ctx.translate(eyeCenterX, eyeCenterY);
	ctx.rotate(eyeAngle);
	ctx.translate(travelDistance, 0);
	ctx.rotate(-eyeAngle);

	ctx.drawImage(img, -eyeWidth / 2, -eyeHeight / 2, eyeWidth, eyeHeight);
	ctx.restore();
}

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

// ---- MAIN RENDERER ----
let faceVariant = 'default';
function draw(mouseX, mouseY, blink, love) {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	const targetY = mouseY ?? nameElement.getBoundingClientRect().y;
	const targetX = mouseX ?? nameElement.getBoundingClientRect().x;

	drawFace();
	drawSmile(faceVariant);

	if (blink) return;

	const eyeVariant = faceVariant == 'bigSmile' ? 'default' : faceVariant;
	drawEye(targetX, targetY, 'left', eyeVariant);
	drawEye(targetX, targetY, 'right', eyeVariant);
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
