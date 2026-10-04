// [IA NOTICE] MADE WITH GPT
(() => {
	const languages = ['pt-BR', 'en-GB'];
	const attributes = ['alt', 'title', 'aria-label', 'placeholder', 'content'];
	const selector = [
		'[data-i18n]',
		'[data-i18n-html]',
		...attributes.map((attr) => `[data-i18n-${attr}]`),
	].join(',');
	function normalizeLanguage(language) {
		const base = language?.toLowerCase().split(/[-_]/)[0];
		return { pt: 'pt-BR', en: 'en-GB' }[base];
	}
	function detectLanguage() {
		let stored;
		try {
			stored = normalizeLanguage(localStorage.getItem('i18nextLng'));
		} catch {}
		return (
			normalizeLanguage(new URLSearchParams(location.search).get('lng')) ||
			stored ||
			(navigator.languages || [navigator.language])
				.map(normalizeLanguage)
				.find(Boolean) ||
			'pt-BR'
		);
	}
	// Translate in place: inline elements retain listeners and dynamic values.
	function translateMarkup(element, markup) {
		const template = document.createElement('template');
		template.innerHTML = markup;
		function update(target, source) {
			const targets = [...target.children],
				sources = [...source.children];
			if (
				targets.length !== sources.length ||
				targets.some((node, index) => node.tagName !== sources[index].tagName)
			)
				return;
			// Each text slot sits before, between or after the inline elements.
			const textSlots = [];
			let slot = 0;
			for (const node of target.childNodes) {
				if (node.nodeType === 1) slot++;
				else if (node.nodeType === 3 && !textSlots[slot])
					textSlots[slot] = node;
			}
			const result = [];
			slot = 0;
			for (const translated of source.childNodes) {
				if (translated.nodeType === 3) {
					const text = textSlots[slot] || document.createTextNode('');
					if (text.textContent !== translated.textContent)
						text.textContent = translated.textContent;
					result.push(text);
				} else if (translated.nodeType === 1) {
					const current = targets[slot++];
					if (!current.hasAttribute('data-i18n-preserve'))
						update(current, translated);
					result.push(current);
				}
			}
			const currentNodes = [...target.childNodes];
			if (
				currentNodes.length !== result.length ||
				result.some((node, index) => node !== currentNodes[index])
			)
				target.replaceChildren(...result);
		}
		update(element, template.content);
	}
	function translateElement(element) {
		const options = element.dataset.i18nOptions
			? JSON.parse(element.dataset.i18nOptions)
			: {};
		const key = element.dataset.i18n || element.dataset.i18nHtml;
		if (key && i18next.exists(key)) {
			const value = i18next.t(key, options);
			if (element.hasAttribute('data-i18n-html'))
				translateMarkup(element, value);
			else if (element.textContent !== value) element.textContent = value;
		}
		for (const attr of attributes) {
			const key = element.getAttribute(`data-i18n-${attr}`);
			if (key && i18next.exists(key)) {
				const value = i18next.t(key, options);
				if (element.getAttribute(attr) !== value)
					element.setAttribute(attr, value);
			}
		}
	}
	function translateRoot(root = document) {
		if (!i18next.isInitialized) return;
		if (root.nodeType === 1 && root.matches(selector)) translateElement(root);
		root.querySelectorAll?.(selector).forEach(translateElement);
	}
	function updateLanguage() {
		const language = i18next.resolvedLanguage || i18next.language;
		try {
			localStorage.setItem('i18nextLng', language);
		} catch {}
		document.documentElement.lang = language;
		translateRoot();
		document.querySelectorAll('[data-language-select]').forEach((select) => {
			select.value = language;
		});
		document.dispatchEvent(
			new CustomEvent('site:languagechanged', { detail: { language } }),
		);
		window.ScrollTrigger?.refresh();
	}
	async function changeLanguage(language) {
		const normalized = normalizeLanguage(language);
		if (!normalized) return;
		await ready;
		await i18next.changeLanguage(normalized);
		const url = new URL(location.href);
		url.searchParams.set('lng', normalized);
		history.replaceState(null, '', url);
	}
	const ready = (async () => {
		const bundles = await Promise.all(
			languages.map(async (language) => {
				try {
					const response = await fetch(`/locales/${language}/translation.json`);
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					return [language, { translation: await response.json() }];
				} catch (error) {
					console.error(`Could not load ${language} translations`, error);
					return [language, { translation: {} }];
				}
			}),
		);
		await i18next.init({
			lng: detectLanguage(),
			fallbackLng: 'pt-BR',
			load: 'currentOnly',
			supportedLngs: languages,
			resources: Object.fromEntries(bundles),
			keySeparator: false,
			nsSeparator: false,
			interpolation: { escapeValue: true },
		});
		i18next.on('languageChanged', updateLanguage);
		updateLanguage();
		const observer = new MutationObserver((records) => {
			for (const record of records) {
				if (record.type === 'attributes') translateRoot(record.target);
				else
					for (const node of record.addedNodes)
						if (node.nodeType === 1) translateRoot(node);
			}
			document.querySelectorAll('[data-language-select]').forEach((select) => {
				select.value = i18next.resolvedLanguage;
			});
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [
				'data-i18n',
				'data-i18n-html',
				'data-i18n-options',
				...attributes.map((attr) => `data-i18n-${attr}`),
			],
		});
		document.addEventListener('change', (event) => {
			if (event.target.matches('[data-language-select]'))
				changeLanguage(event.target.value).catch(console.error);
		});
		return i18next;
	})();
	window.siteI18n = { ready, changeLanguage, translateRoot };
})();
