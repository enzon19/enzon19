const latJF = -21.761594;
const lngJF = -43.351041;
const jfCoordinates = L.latLng(latJF, lngJF);

async function main() {
	await window.siteI18n.ready;
	const { cityName, latitude, longitude } = await getUserLocation();
	const userCoordinates = L.latLng(latitude, longitude);

	renderMap(userCoordinates);
	changeMapLabel(cityName, userCoordinates);
}
main();

async function getUserLocation() {
	const response = await fetch('https://free.freeipapi.com/api/v1/json');
	const data = await response.json();

	return {
		countryName: data.countryName,
		regionName: data.regionName,
		cityName: data.cityName,
		latitude: data.latitude,
		longitude: data.longitude,
	};
}

function renderMap(userCoordinates) {
	const bounds = [jfCoordinates, userCoordinates];

	const map = L.map('map').setView(userCoordinates, 13);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	L.polyline(bounds, {
		color: '#0180B7',
		weight: 5,
	}).addTo(map);

	const enzoMarker = L.icon({
		iconUrl: '/assets/face/happy-enzo.png',
		iconSize: [48.3, 60.8],
	});
	L.marker(jfCoordinates, { icon: enzoMarker, zIndexOffset: 1000 }).addTo(map);

	const userMarker = L.icon({
		iconUrl: '/assets/marker.png',
		iconSize: [32.06, 48.09],
	});
	L.marker(userCoordinates, { icon: userMarker }).addTo(map);

	flyToBoundsWhenVisible(map, bounds);
}

function flyToBoundsWhenVisible(map, bounds) {
	const mapElement = map.getContainer();

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;

			observer.disconnect();

			map.invalidateSize();
			setTimeout(() => {
				map.flyToBounds(bounds, {
					duration: 1.5,
					padding: [25, 25],
				});
			}, 1000);
		},
		{ threshold: 0.25 },
	);

	observer.observe(mapElement);
}

function changeMapLabel(cityName, userCoordinates) {
	if (cityName == 'Juiz de Fora') {
		const label = document.querySelector('#juiz-de-fora-label');
		label.dataset.i18nHtml = 'about.sameCity';
		label.innerHTML = i18next.t('about.sameCity');
		return;
	}

	const distanceMeters = parseInt(jfCoordinates.distanceTo(userCoordinates));
	document.querySelector('#distance').textContent =
		formatDistance(distanceMeters);
}

function formatDistance(meters) {
	if (meters >= 1000) return parseInt(meters / 1000) + ' km';
	return meters + ' m';
}
