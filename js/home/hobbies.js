async function loadTopAlbumsFromPeriod(period) {
	try {
		const res = await fetch(
			'https://gist.githubusercontent.com/enzon19/66e4659e3ddae3ea4428706f1d11100b/raw/' +
				period +
				'.json',
		);
		const data = await res.json();
		return data?.topalbums?.album;
	} catch (err) {
		console.error(err);
	}
}

async function getDeduplicatedTopAlbumsOverallAndSeven() {
	const sevenDays = (await loadTopAlbumsFromPeriod('7days')).map((e) => ({
		...e,
		source: '7days',
	}));
	const overall = (await loadTopAlbumsFromPeriod('overall')).map((e) => ({
		...e,
		source: 'overall',
	}));
	const topAlbumsWithDuplicates = [...sevenDays, ...overall];

	const topAlbums = topAlbumsWithDuplicates.filter(
		(obj1, i, arr) => arr.findIndex((obj2) => obj2.url === obj1.url) === i,
	);
	return topAlbums;
}

async function addAlbumsToHobbies(template) {
	const albums = await getDeduplicatedTopAlbumsOverallAndSeven();
	for (const album of albums) {
		const image = album.image.at(-1)['#text'];
		const rank = album['@attr'].rank;
		const key =
			album.source == '7days' ? 'hobbies.albumRecent' : 'hobbies.albumOverall';

		addHobby(template, image, key, false, { rank });
	}
}

let hobbyRotationSign = 1;
function addHobby(template, imageURL, key, last = false, options = {}) {
	const hobbyCard = template.cloneNode(true);
	hobbyCard.removeAttribute('id');

	const div = hobbyCard.querySelector('div');
	div.style.setProperty(
		'--card-rotate',
		randomIntFromInterval(2, 5) * hobbyRotationSign + 'deg',
	);
	div.style.backgroundImage = "url('" + imageURL + "')";

	const span = hobbyCard.querySelector('span');
	span.dataset.i18n = key;
	span.dataset.i18nOptions = JSON.stringify(options);
	span.textContent = i18next.t(key, options);

	if (last) hobbyCard.classList.remove('md:hover:mr-26');

	template.parentNode.appendChild(hobbyCard);
	hobbyRotationSign *= -1;
}

async function loadWatched(type, period = 'last') {
	// type = 'movie' or 'show'
	try {
		const res = await fetch(
			'https://gist.githubusercontent.com/enzon19/66e4659e3ddae3ea4428706f1d11100b/raw/' +
				period +
				'-' +
				type +
				'.json',
		);
		const data = await res.json();

		if (period == 'current' && type == 'show') {
			return 'https://image.tmdb.org/t/p/w300/' + data?.[0]?.show.poster_path;
		} else {
			return 'https://image.tmdb.org/t/p/w300/' + data?.[0]?.poster_path;
		}
	} catch (err) {
		console.error(err);
	}
}

const template = document.querySelector('#hobby-reference');
(async () => {
	await window.siteI18n.ready;
	addHobby(template, await loadWatched('movie', 'last'), 'hobbies.lastMovie');
	addHobby(
		template,
		await loadWatched('show', 'current'),
		'hobbies.currentShow',
	);
	addHobby(template, await loadWatched('show', 'last'), 'hobbies.lastShow');
	await addAlbumsToHobbies(template);
	addHobby(
		template,
		'/assets/hobbies/trip-' + randomIntFromInterval(1, 6) + '.jpg',
		'hobbies.travel',
		true,
	);
})();

// Source - https://stackoverflow.com/a/7228322
// Posted by Francisc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-20, License - CC BY-SA 4.0
function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
