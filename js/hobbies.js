async function loadTopAlbumsFromPeriod(period) {
	try {
		const res = await fetch('/data/' + period + '.json');
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
		const text =
			album.source == '7days'
				? rank + 'º Álbum mais ouvido no momento'
				: rank + 'º Álbum mais ouvido';

		addHobby(template, image, text);
	}
}

let hobbyRotationSign = 1;
function addHobby(template, imageURL, text, last = false) {
	const hobbyCard = template.cloneNode(true);
	hobbyCard.removeAttribute('id');

	const div = hobbyCard.querySelector('div');
	div.style.setProperty(
		'--card-rotate',
		randomIntFromInterval(2, 5) * hobbyRotationSign + 'deg',
	);
	div.style.backgroundImage = "url('" + imageURL + "')";

	const span = hobbyCard.querySelector('span');
	span.innerText = text;

	if (last) {
		hobbyCard.classList.remove('md:hover:mr-26');
	}

	template.parentNode.appendChild(hobbyCard);
	hobbyRotationSign *= -1;
}

const template = document.querySelector('#hobby-reference');
(async () => {
	addHobby(
		template,
		'/assets/hobbies/last-movie.webp',
		'Último filme assistido',
	);
	addHobby(
		template,
		'/assets/hobbies/current-show.webp',
		'Assistindo atualmente',
	);
	addHobby(
		template,
		'/assets/hobbies/last-show.webp',
		'Última série finalizada',
	);
	await addAlbumsToHobbies(template);
	addHobby(
		template,
		'/assets/hobbies/trip-' + randomIntFromInterval(1, 5),
		'Viajar',
		true,
	);
})();

// Source - https://stackoverflow.com/a/7228322
// Posted by Francisc, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-20, License - CC BY-SA 4.0
function randomIntFromInterval(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
