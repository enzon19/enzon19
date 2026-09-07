import { projects, anchors, tags } from '../../projects/data.js';

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

let currentFilter = 'all';
function renderTagsFilter() {
	const tagsFilter = document.querySelector('#tags-filter');

	for (const tag of tags) {
		const projectsTaggedCount = projects.reduce(
			(acc, currentValue) => acc + Number(currentValue.tags.includes(tag)),
			0,
		);
		if (projectsTaggedCount == 0) continue;

		const buttonElement = document.createElement('button');
		buttonElement.className =
			'rounded-lg border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors duration-300';
		buttonElement.id = 'tags-filter-' + tag; // i18n
		buttonElement.textContent = `${tag} (${projectsTaggedCount})`;
		buttonElement.addEventListener('click', () => changeFilter(tag));

		tagsFilter.appendChild(buttonElement);
	}
}

function toggleFilterButton(tag) {
	const oldTagButton = document.querySelector('#tags-filter-' + tag);
	oldTagButton.classList.toggle('dark:bg-neutral-700');
	oldTagButton.classList.toggle('bg-neutral-300');
	oldTagButton.classList.toggle('hover:bg-neutral-200/50');
	oldTagButton.classList.toggle('dark:hover:bg-neutral-800');
	oldTagButton.classList.toggle('text-black');
	oldTagButton.classList.toggle('dark:text-white');
	oldTagButton.classList.toggle('font-medium');
}

function changeFilter(newFilter) {
	if (currentFilter == newFilter) return;

	toggleFilterButton(currentFilter);
	currentFilter = newFilter;
	toggleFilterButton(currentFilter);

	renderProjectsFiltered(currentFilter);
}

function renderProjectsFiltered(filter) {
	const projectsGrid = document.querySelector('#projects-grid');
	projectsGrid.innerHTML = '';

	for (const project of projects) {
		if (filter == 'all' || project.tags.includes(filter)) {
			projectsGrid.appendChild(getCard(project));
		}
	}
}

function main() {
	renderTagsFilter();
	renderProjectsFiltered(currentFilter);

	const allProjectsButton = document.querySelector('#tags-filter-all');
	allProjectsButton.textContent = `all (${projects.length})`; // i18n
	allProjectsButton.addEventListener('click', () => changeFilter('all'));
	toggleFilterButton('all');
}

main();
