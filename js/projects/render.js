import { projects, anchors } from '../../projects/data.js';

function getCard({ id, name, logo, color, tags, period, urls }) {
	const template = document.querySelector('template#project-card').content;
	const projectCard = template.cloneNode(true);

	projectCard.querySelector('h3').textContent = name;
	projectCard.querySelector('p').textContent = 'description.' + id; // i18n

	const presentIndex = period.indexOf('present');
	if (presentIndex > -1) {
		period[presentIndex] = 'presente'; // i18n
	}
	projectCard.querySelector('.period').textContent = period.join(' - ');

	const img = projectCard.querySelector('img');
	img.src = logo;
	img.alt = name + ' Logo';

	projectCard.querySelector('div').style.setProperty('--accent', color);

	const tagsElement = projectCard.querySelector('.tags');
	for (const tag of tags) {
		const tagElement = document.createElement('span');
		tagElement.className =
			'rounded-full bg-neutral-200 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
		tagElement.textContent = tag; // i18n

		tagsElement.appendChild(tagElement);
	}

	const urlsElement = projectCard.querySelector('.urls');
	if (urls.length > 0) {
		for (const url of urls) {
			const urlType = anchors[url.type];

			const aElement = document.createElement('a');
			aElement.className = 'btn btn-sm btn-tertiary';
			aElement.target = '_blank';
			aElement.href = url.href;
			aElement.innerHTML = `<ion-icon ${urlType.field}="${urlType.value}" class="text-base"></ion-icon>${url.type}`; // i18n

			urlsElement.appendChild(aElement);
		}
	} else {
		urlsElement.remove();
	}

	return projectCard;
}

function main() {
	const projectsGrid = document.querySelector('#projects-grid');
	for (const project of projects) {
		projectsGrid.appendChild(getCard(project));
	}
}

main();
