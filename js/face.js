const canvas = document.querySelector('#enzoFace');
const ctx = canvas.getContext('2d');

const face = new Image();
face.src = '/assets/face/enzo.png';
const faceWidth = 619;
const faceHeight = 687;

const eyeLeft = new Image();
eyeLeft.src = '/assets/face/eyeLeft.png';
const eyeLeftWidth = 72;
const eyeLeftHeight = 24;

const eyeRight = new Image();
eyeRight.src = '/assets/face/eyeRight.png';
const eyeRightWidth = 82;
const eyeRightHeight = 28;

let mouseX, mouseY;
document.addEventListener('mousemove', handleMouseMove);

let angle = Math.atan2(nameElement.getBoundingClientRect().y, nameElement.getBoundingClientRect().x);

function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  mouseX = event.clientX - rect.left;
  mouseY = event.clientY - rect.top;
  requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const containerX = canvas.width / 2;
    const containerY = canvas.height / 2;

    if (mouseX && mouseY) angle = Math.atan2(mouseY - containerY, mouseX - containerX);
    
    const eyeLeftX = containerX - 173;
    const eyeLeftY = containerY - 87;
    const eyeRightX = containerX - 20;
    const eyeRightY = containerY - 102;

    ctx.drawImage(face, containerX - faceWidth / 2, containerY - faceHeight / 2, faceWidth, faceHeight);

    ctx.save();
    ctx.translate(eyeLeftX + eyeLeftWidth / 2, eyeLeftY + eyeLeftHeight / 2);
    ctx.rotate(angle);
    ctx.drawImage(eyeLeft, -eyeLeftWidth / 2, -eyeLeftHeight / 2, eyeLeftWidth, eyeLeftHeight);
    ctx.restore();

    ctx.save();
    ctx.translate(eyeRightX + eyeRightWidth / 2, eyeRightY + eyeRightHeight / 2);
    ctx.rotate(angle);
    ctx.drawImage(eyeRight, -eyeRightWidth / 2, -eyeRightHeight / 2, eyeRightWidth, eyeRightHeight);
    ctx.restore();
}

(async () => {
  Promise.all([
    new Promise((resolve) => (face.onload = resolve)),
    new Promise((resolve) => (eyeRight.onload = resolve)),
    new Promise((resolve) => (eyeLeft.onload = resolve)),
  ]).then(() => {
    draw(); // Call draw() after all images are loaded
  });
})();