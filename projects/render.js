import { projects, anchors, tags } from './data.js';

function getCard({ id, name, logo, color, tags, period, urls }) {
	const template = document.querySelector('template#project-card').content;
	const projectCard = template.cloneNode(true).firstElementChild;

	projectCard.querySelector('h3').textContent = name;
	projectCard.querySelector('p').dataset.i18n = 'description.' + id;
	projectCard.querySelector('p').textContent = i18next.t('description.' + id);
	projectCard.id = 'project-' + id;

	const periodElement = projectCard.querySelector('.period');
	periodElement.replaceChildren();
	period.forEach((value, index) => {
		if (index) periodElement.append(' - ');
		const span = document.createElement('span');
		if (value === 'present') span.dataset.i18n = 'projects.present';
		span.textContent =
			value === 'present' ? i18next.t('projects.present') : value;
		periodElement.append(span);
	});

	const img = projectCard.querySelector('img');
	img.src = logo;
	img.alt = name + ' Logo';

	projectCard.querySelector('div').style.setProperty('--accent', color);

	const tagsElement = projectCard.querySelector('.tags');
	for (const tag of tags) {
		const tagElement = document.createElement('span');

		tagElement.className =
			'rounded-full bg-neutral-200 px-3 py-1.5 text-xs font-medium whitespace-nowrap text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400';
		tagElement.dataset.i18n = 'tags.' + tag;
		tagElement.textContent = i18next.t('tags.' + tag);

		tagsElement.appendChild(tagElement);
	}

	const urlsElement = projectCard.querySelector('.urls');
	if (urls.length > 0) {
		let firstURL = true;

		for (const url of urls) {
			const urlType = anchors[url.type];

			const aElement = document.createElement('a');
			aElement.className = `btn btn-sm ${firstURL ? 'btn-primary' : 'btn-secondary'}`;
			aElement.target = '_blank';
			aElement.href = url.href;
			aElement.innerHTML = `<ion-icon ${urlType.field}="${urlType.value}" class="text-base"></ion-icon><span data-i18n="anchors.${url.type}">${i18next.t('anchors.' + url.type)}</span>`;

			urlsElement.appendChild(aElement);
			firstURL = false;
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
			'cursor-pointer rounded-xl border border-neutral-300 px-3 py-2 text-sm transition-all duration-300 ease-in-out hover:bg-neutral-200/50 active:scale-95 dark:border-neutral-700 dark:hover:bg-neutral-800';
		buttonElement.id = 'tags-filter-' + tag;
		const label = document.createElement('span');
		label.dataset.i18n = 'tags.' + tag;
		label.textContent = i18next.t('tags.' + tag);
		buttonElement.append(label, ` (${projectsTaggedCount})`);
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
}

function changeFilter(newFilter) {
	if (currentFilter == newFilter) return;

	toggleFilterButton(currentFilter);
	currentFilter = newFilter;
	toggleFilterButton(currentFilter);

	filterProjects(currentFilter);
}

function renderAllProjects() {
	const projectsGrid = document.querySelector('#projects-grid');
	projectsGrid.innerHTML = '';

	for (const project of projects) {
		projectsGrid.appendChild(getCard(project));
	}
}

function filterProjects(filter) {
	for (const project of projects) {
		const card = document.querySelector(`#project-${project.id}`);
		const shouldShow = filter === 'all' || project.tags.includes(filter);
		card.classList.toggle('hidden', !shouldShow);
	}
}

function initializeAllProjectsButton() {
	const allProjectsButton = document.querySelector('#tags-filter-all');
	allProjectsButton.dataset.i18n = 'projects.all';
	allProjectsButton.dataset.i18nOptions = JSON.stringify({
		count: projects.length,
	});
	allProjectsButton.textContent = i18next.t('projects.all', {
		count: projects.length,
	});
	allProjectsButton.addEventListener('click', () => changeFilter('all'));
}

function main() {
	renderTagsFilter();
	renderAllProjects();
	initializeAllProjectsButton();
	filterProjects(currentFilter);
	toggleFilterButton(currentFilter);
}

window.siteI18n.ready.then(main);
