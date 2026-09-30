// Source - https://stackoverflow.com/a/2450976
// Posted by ChristopheD, modified by community. See post 'Timeline' for change history
// Retrieved 2026-07-25, License - CC BY-SA 4.0
function shuffleArray(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex != 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

// Source adapted from https://css-tricks.com/snippets/css/typewriter-effect/
export class TxtType {
	constructor(el, toRotate, period) {
		this.el = el;
		this.toRotate = toRotate;
		this.period = parseInt(period) || 2000; // waiting time until erase word

		this.loopNum = 0;
		this.txt = '';
		this.isDeleting = false;
		this.finished = false;
	}

	tick() {
		const i = this.loopNum % this.toRotate.length;
		const fullTxt = this.toRotate[i];

		if (this.isDeleting) {
			this.txt = fullTxt.substring(0, this.txt.length - 1);
		} else {
			this.txt = fullTxt.substring(0, this.txt.length + 1);
		}

		this.el.textContent = this.txt;

		let that = this;
		let delta = 200 - Math.random() * 100;

		if (this.isDeleting) delta /= 2;

		if (!this.isDeleting && this.txt === fullTxt) {
			if (this.loopNum == this.toRotate.length - 1) {
				this.finished = true;
				return;
			}
			this.isDeleting = true;
			delta = this.period;
		} else if (this.isDeleting && this.txt === '') {
			this.isDeleting = false;
			this.loopNum++;
			delta = 500; // waiting time until type next word
		}

		setTimeout(function () {
			that.tick();
		}, delta);
	}
}

const nicknames = ['Enzão', 'Barata', 'Baratinha'];
const shuffledNicknames = shuffleArray(nicknames);
shuffledNicknames.push('Enzo', 'enzon19');
shuffledNicknames.unshift('enzon19');
const nameElement = document.querySelector('#name');
let nameTxtType = new TxtType(nameElement, shuffledNicknames, 2000);

export function typewriteName() {
	if (!nameTxtType.finished) return;

	nameTxtType = new TxtType(nameElement, shuffledNicknames, 2000);
	nameTxtType.txt = nicknames[0];
	nameTxtType.isDeleting = true;
	nameTxtType.tick();
}
nameElement.addEventListener('click', typewriteName);
nameTxtType.tick();
