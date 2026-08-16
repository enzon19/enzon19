const attributes = ['color', 'name', 'src', 'background-class', 'text-color'];

export default class StackItemCard extends HTMLElement {
	#src;
	get src() {
		return this.#src;
	}
	set src(value) {
		this.#src = value;
		this.#render();
	}

	#name;
	get name() {
		return this.#name;
	}
	set name(value) {
		this.#name = value;
		this.#render();
	}

	#color;
	get color() {
		return this.#color;
	}
	set color(value) {
		this.#color = value.toString().replace('#', '');
		this.#render();
	}

	#backgroundClass;
	get backgroundClass() {
		return this.#backgroundClass;
	}
	set backgroundClass(value) {
		this.#backgroundClass = value.split(' ');
		this.#render();
	}

	#textColor;
	get textColor() {
		return this.#textColor;
	}
	set textColor(value) {
		this.#textColor = value.toString();
		this.#render();
	}

	#render() {
		const template = document.querySelector('template#stack-item-card').content;
		const stackItemCard = template.cloneNode(true);

		const imageElement = stackItemCard.querySelector('img');
		imageElement.src = this.src;
		imageElement.alt = this.name;

		const spanElement = stackItemCard.querySelector('span');
		spanElement.textContent = this.name;
		spanElement.style.color = this.textColor;

		if (this.backgroundClass) {
			stackItemCard
				.querySelector('div > .blur-2xl')
				.classList.add(...this.backgroundClass);
		}

		this.innerHTML = '';
		this.append(stackItemCard);
	}

	static get observedAttributes() {
		return attributes;
	}
	constructor() {
		super();
	}
	connectedCallback() {
		this.#render();
	}
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (!attributes.includes(name)) return;

		if (name.includes('-color')) name = name.replace('-color', 'Color');
		if (name.includes('-class')) name = name.replace('-class', 'Class');
		this[name] = newValue;
	}
}

customElements.define('stack-item-card', StackItemCard);
