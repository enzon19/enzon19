function handleThemeChange(themeValue) {
	if (themeValue === 'system') {
		// Whenever the user explicitly chooses to respect the OS preference
		localStorage.removeItem('theme');
		loadTheme();
		return;
	}

	// Whenever the user explicitly chooses light or dark mode
	localStorage.theme = themeValue;
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
		window.loadHeroBackground?.('dark');
	} else {
		documentElement.classList.remove('dark');
		window.loadHeroBackground?.('light');
	}
}

loadTheme();
document.addEventListener('DOMContentLoaded', () => {
	const themeRadios = document.querySelectorAll('input[name="theme"]');
	const currentTheme = 'theme' in localStorage ? localStorage.theme : 'system';
	document.querySelector('#theme-' + currentTheme).checked = true;

	themeRadios.forEach((radio) => {
		radio.addEventListener('change', () => {
			if (radio.checked) {
				handleThemeChange(radio.value);
			}
		});
	});
});
