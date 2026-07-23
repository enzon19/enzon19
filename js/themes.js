function handleThemeChange(selectThemeElement) {
	if (selectThemeElement?.value === 'system') {
		// Whenever the user explicitly chooses to respect the OS preference
		localStorage.removeItem('theme');
		loadTheme();
		return;
	}

	// Whenever the user explicitly chooses light or dark mode
	localStorage.theme = selectThemeElement?.value;
	loadTheme();
}

function loadTheme() {
	if ('theme' in localStorage) {
		applyTheme(localStorage.theme);
	} else {
		const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
			.matches
			? 'dark'
			: 'light';
		applyTheme(systemTheme);
	}
}

function setTheme(theme) {
	if (theme !== 'dark' && theme !== 'light') throw 'Invalid theme';
	localStorage.theme = theme;
}

function applyTheme(theme) {
	const documentElement = document.documentElement;

	if (theme !== 'dark' && theme !== 'light') {
		throw 'Invalid theme';
	} else if (theme === 'dark') {
		documentElement.classList.add('dark');
		documentElement.style.setProperty('--caret-color', 'rgb(225, 225, 225)');
		window.loadHeroBackground?.('dark');
	} else {
		documentElement.classList.remove('dark');
		documentElement.style.setProperty('--caret-color', 'rgb(44, 44, 44)');
		window.loadHeroBackground?.('light');
	}
}

loadTheme();
document.addEventListener('DOMContentLoaded', () => {
	const selectThemeElement = document.querySelector('#selectTheme');
	selectThemeElement?.addEventListener('change', () =>
		handleThemeChange(selectThemeElement),
	);
});
