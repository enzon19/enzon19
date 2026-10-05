import { test, expect } from 'bun:test';
import { Window } from 'happy-dom';
import { readFileSync } from 'node:fs';
import { createContext, runInContext } from 'node:vm';
import { projects, tags, anchors } from '../projects/data.js';

const read = (path) =>
	readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const resources = Object.fromEntries(
	['pt-BR', 'en-GB', 'es'].map((lng) => [
		lng,
		JSON.parse(read(`locales/${lng}/translation.json`)),
	]),
);
const pages = [
	'index.html',
	'about/index.html',
	'projects/index.html',
	'contact/index.html',
	'donate/index.html',
];
const normalize = (text) => text.replace(/\s+/g, ' ').trim();

async function setup(
	page = 'index.html',
	{
		url = 'https://enzon19.com/?lng=en-GB',
		stored,
		browser = ['pt-BR'],
		fail,
	} = {},
) {
	const window = new Window({
		url,
		settings: {
			disableCSSFileLoading: true,
			disableJavaScriptFileLoading: true,
		},
	});
	window.document.write(
		read(page)
			.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
			.replace(/<link\b[^>]*>/g, ''),
	);
	Object.defineProperty(window.navigator, 'languages', { value: browser });
	if (stored) window.localStorage.setItem('i18nextLng', stored);
	window.fetch = async (url) => {
		const lng = url.split('/')[2];
		return {
			ok: fail !== lng,
			status: fail === lng ? 503 : 200,
			json: async () => resources[lng],
		};
	};
	const context = createContext({
		window,
		document: window.document,
		navigator: window.navigator,
		location: window.location,
		history: window.history,
		localStorage: window.localStorage,
		fetch: window.fetch,
		MutationObserver: window.MutationObserver,
		CustomEvent: window.CustomEvent,
		URL,
		URLSearchParams,
		console,
		setTimeout,
		clearTimeout,
	});
	runInContext(read('node_modules/i18next/dist/umd/i18next.min.js'), context);
	window.i18next = context.i18next;
	runInContext(read('js/translation.js'), context);
	await window.siteI18n.ready;
	window.testContext = context;
	return window;
}

test('all three dictionaries cover every static and project description key', () => {
	const languages = ['pt-BR', 'en-GB', 'es'];
	const keys = Object.keys(resources['pt-BR']).sort();
	for (const language of languages) {
		expect(Object.keys(resources[language]).sort()).toEqual(keys);
		for (const key of keys) {
			expect(resources[language][key]).toBeString();
			expect(resources[language][key].trim().length).toBeGreaterThan(0);
		}
	}
	for (const page of pages) {
		expect([
			...read(page).matchAll(/src="\/js\/translation.js"/g),
		]).toHaveLength(1);
		expect([
			...read(page).matchAll(
				/src="https:\/\/unpkg\.com\/i18next@26\.4\.2\/dist\/umd\/i18next\.min\.js"/g,
			),
		]).toHaveLength(1);
		const keys = [
			...read(page).matchAll(
				/data-i18n(?:-html|-alt|-title|-aria-label|-placeholder|-content)?="([^"]+)"/g,
			),
		].map((match) => match[1]);
		for (const key of keys)
			for (const lng of languages) expect(resources[lng][key]).toBeString();
	}
	for (const project of projects)
		for (const lng of languages)
			expect(resources[lng]['description.' + project.id]).toBeString();
});

test('original HTML content matches the pt-BR dictionary before translation', async () => {
	const differences = [];
	for (const page of pages) {
		const window = new Window({
			settings: {
				disableJavaScriptFileLoading: true,
				disableCSSFileLoading: true,
			},
		});
		try {
			window.document.write(
				read(page)
					.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')
					.replace(/<link\b[^>]*>/g, ''),
			);
			const { document } = window;
			const canonicalMarkup = (root) =>
				[...root.childNodes].flatMap((node) => {
					if (node.nodeType === 3)
						return normalize(node.textContent)
							? [normalize(node.textContent)]
							: [];
					if (node.nodeType !== 1) return [];
					return [
						{
							tag: node.tagName,
							attributes: [...node.attributes]
								.filter((attr) => !attr.name.startsWith('data-i18n'))
								.map((attr) => [attr.name, attr.value])
								.sort(),
							children: canonicalMarkup(node),
						},
					];
				});
			const roots = [
				document,
				...[...document.querySelectorAll('template')].map(
					(template) => template.content,
				),
			];
			for (const root of roots) {
				for (const element of root.querySelectorAll(
					'[data-i18n], [data-i18n-html]',
				)) {
					const key = element.dataset.i18n || element.dataset.i18nHtml;
					const expected = resources['pt-BR'][key];
					if (element.hasAttribute('data-i18n-html')) {
						const template = document.createElement('template');
						template.innerHTML = expected;
						if (
							JSON.stringify(canonicalMarkup(element)) !==
							JSON.stringify(canonicalMarkup(template.content))
						)
							differences.push({
								page,
								key,
								actual: normalize(element.innerHTML),
								expected,
							});
					} else if (normalize(element.textContent) !== normalize(expected))
						differences.push({
							page,
							key,
							actual: normalize(element.textContent),
							expected,
						});
				}
				for (const attr of [
					'alt',
					'title',
					'aria-label',
					'placeholder',
					'content',
				]) {
					for (const element of root.querySelectorAll(`[data-i18n-${attr}]`)) {
						const key = element.getAttribute(`data-i18n-${attr}`);
						const actual = element.getAttribute(attr);
						const expected = resources['pt-BR'][key];
						if (normalize(actual || '') !== normalize(expected))
							differences.push({
								page,
								key,
								attribute: attr,
								actual,
								expected,
							});
					}
				}
			}
		} finally {
			await window.happyDOM.close();
		}
	}
	expect(differences).toEqual([]);
});

for (const page of pages)
	test(`translates ${page} across all three languages, keeping inline DOM`, async () => {
		const window = await setup(page);
		const { document } = window;
		const strong = document.querySelector('p[data-i18n-html] strong');
		for (const lng of ['en-GB', 'es', 'pt-BR']) {
			await window.siteI18n.changeLanguage(lng);
			expect(document.documentElement.lang).toBe(lng);
			for (const element of document.querySelectorAll(
				'[data-i18n], [data-i18n-html]',
			)) {
				const key = element.dataset.i18n || element.dataset.i18nHtml;
				const expected = document.createElement('template');
				expected.innerHTML = resources[lng][key];
				expect(normalize(element.textContent)).toBe(
					normalize(expected.content.textContent),
				);
			}
			for (const attr of ['alt', 'title', 'aria-label', 'content'])
				for (const element of document.querySelectorAll(
					`[data-i18n-${attr}]`,
				)) {
					expect(element.getAttribute(attr)).toBe(
						resources[lng][element.getAttribute(`data-i18n-${attr}`)],
					);
				}
			if (strong)
				expect(document.querySelector('p[data-i18n-html] strong')).toBe(strong);
		}
		await window.happyDOM.close();
	});

test('surname adds and removes trailing text while preserving inline elements and listeners', async () => {
	const window = await setup('about/index.html', {
		url: 'https://enzon19.com/about?lng=pt-BR',
	});
	try {
		const surname = window.document.querySelector(
			'[data-i18n-html="about.surname"]',
		);
		const strong = [...surname.querySelectorAll('strong')];
		let clicks = 0;
		strong[1].addEventListener('click', () => clicks++);
		for (const language of ['en-GB', 'pt-BR', 'en-GB']) {
			await window.siteI18n.changeLanguage(language);
			const expected = window.document.createElement('template');
			expected.innerHTML = resources[language]['about.surname'];
			expect(normalize(surname.textContent)).toBe(
				normalize(expected.content.textContent),
			);
			expect([...surname.querySelectorAll('strong')]).toEqual(strong);
			strong[1].click();
		}
		expect(clicks).toBe(3);
	} finally {
		await window.happyDOM.close();
	}
});

test('URL overrides stored language and regional browser languages are normalized', async () => {
	for (const [options, expected] of [
		[{ stored: 'pt-BR', browser: ['pt-BR'] }, 'en-GB'],
		[
			{ url: 'https://enzon19.com/', stored: 'en-GB', browser: ['pt-BR'] },
			'en-GB',
		],
		[
			{ url: 'https://enzon19.com/?lng=invalid', browser: ['es', 'en-US'] },
			'es',
		],
		[{ url: 'https://enzon19.com/', browser: ['pt-BR'] }, 'pt-BR'],
		[{ url: 'https://enzon19.com/', browser: ['fr'] }, 'pt-BR'],
	]) {
		const window = await setup('index.html', options);
		expect(window.i18next.language).toBe(expected);
		await window.happyDOM.close();
	}
});

test('footer language radios switch languages and reflect the active language', async () => {
	const window = await setup('index.html');
	try {
		const radios = [
			...window.document.querySelectorAll('[data-language-radio]'),
		];
		expect(radios).toHaveLength(3);
		expect(radios.find((radio) => radio.checked).value).toBe('en-GB');
		const spanish = radios.find((radio) => radio.value === 'es');
		spanish.checked = true;
		spanish.dispatchEvent(new window.Event('change', { bubbles: true }));
		await new Promise((resolve) => setTimeout(resolve, 10));
		expect(window.document.documentElement.lang).toBe('es');
		expect(
			window.document.querySelector('[data-i18n="home.aboutTitle"]')
				.textContent,
		).toBe('Sobre mí');
		expect(window.localStorage.getItem('i18nextLng')).toBe('es');
		await window.siteI18n.changeLanguage('pt-BR');
		expect(radios.find((radio) => radio.checked).value).toBe('pt-BR');
	} finally {
		await window.happyDOM.close();
	}
});

test('switching persists language and preserves other URL parameters and the hash', async () => {
	const window = await setup('contact/index.html', {
		url: 'https://enzon19.com/contact?source=test&lng=en-GB#footer',
	});
	await window.siteI18n.changeLanguage('pt-BR');
	expect(window.localStorage.getItem('i18nextLng')).toBe('pt-BR');
	expect(window.location.search).toBe('?source=test&lng=pt-BR');
	expect(window.location.hash).toBe('#footer');
	await window.happyDOM.close();
});

test('dynamic content translates and map distance survives language changes', async () => {
	const window = await setup('about/index.html');
	const distance = window.document.querySelector('#distance');
	distance.textContent = '123 km';
	const label = window.document.createElement('span');
	label.dataset.i18n = 'projects.all';
	label.dataset.i18nOptions = JSON.stringify({ count: 11 });
	window.document.body.append(label);
	await new Promise((resolve) => setTimeout(resolve, 10));
	expect(label.textContent).toBe('All (11)');
	await window.siteI18n.changeLanguage('pt-BR');
	expect(label.textContent).toBe('Todos (11)');
	expect(window.document.querySelector('#distance')).toBe(distance);
	expect(distance.textContent).toBe('123 km');
	await window.happyDOM.close();
});

test('a failed English dictionary uses Portuguese fallback', async () => {
	const window = await setup('contact/index.html', { fail: 'en-GB' });
	expect(window.document.title).toBe('Contato - enzon19');
	await window.happyDOM.close();
});

test('project cards switch language without mutating periods or losing the active filter', async () => {
	const window = await setup('projects/index.html');
	Object.assign(window.testContext, {
		projects: structuredClone(projects),
		tags,
		anchors,
	});
	const before = JSON.stringify(window.testContext.projects);
	runInContext(
		read('projects/render.js').replace(/^import .*;\s*/, ''),
		window.testContext,
	);
	await new Promise((resolve) => setTimeout(resolve, 10));
	const cards = window.document.querySelectorAll('#projects-grid > div');
	expect(cards.length).toBe(projects.length);
	expect(cards[0].querySelector('p').textContent).toBe(
		resources['en-GB']['description.dicionariobot'],
	);
	window.document.querySelector('#tags-filter-extension').click();
	await window.siteI18n.changeLanguage('pt-BR');
	expect(cards[0].querySelector('p').textContent).toBe(
		resources['pt-BR']['description.dicionariobot'],
	);
	expect(cards[0].classList.contains('hidden')).toBe(true);
	expect(
		window.document
			.querySelector('#project-quick-reply-meet')
			.classList.contains('hidden'),
	).toBe(false);
	expect(JSON.stringify(window.testContext.projects)).toBe(before);
	await window.happyDOM.close();
});
