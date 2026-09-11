export const tags = [
	'website',
	'extension',
	'bot',
	'platform',
	'tool',
	'client',
];

export const anchors = {
	website: {
		field: 'name',
		value: 'globe-outline',
	},
	telegram: {
		field: 'src',
		value: 'https://api.iconify.design/fa6-brands:telegram.svg',
	},
	github: {
		field: 'name',
		value: 'logo-github',
	},
	cws: {
		field: 'name',
		value: 'logo-chrome',
	},
};

export const projects = [
	{
		id: 'dicionariobot',
		name: 'Dicionário Bot',
		logo: '/assets/projects/dicionario-bot/logo502.png',
		color: '239 68 68',
		tags: ['bot'],
		period: ['2021', 'present'],
		urls: [
			{ type: 'telegram', href: 'https://t.me/dicionariobot' },
			{ type: 'website', href: 'https://dicionariobot.enzon19.com' },
			{ type: 'github', href: 'https://github.com/enzon19/dicionariobot' },
		],
	},
	{
		id: 'quick-reply-meet',
		name: 'Quick Reply Meet',
		logo: '/assets/projects/quick-reply-meet/logo512.png',
		color: '13 143 129',
		tags: ['extension'],
		period: ['2022', 'present'],
		urls: [
			{ type: 'website', href: 'https://quickreplymeet.enzon19.com' },
			{
				type: 'cws',
				href: 'https://chromewebstore.google.com/detail/quick-reply-meet/dodpcgfhomjldnenagdibjcoofheocfc',
			},
			{ type: 'github', href: 'https://github.com/enzon19/quick-reply-meet' },
		],
	},
	{
		id: 'reversetv',
		name: 'ReverseTV',
		logo: '/assets/projects/trakt-tools/reversetv/logo512.png',
		color: '217 58 61',
		tags: ['website', 'tool'],
		period: ['2024', 'present'],
		urls: [
			{ type: 'website', href: 'https://reversetv.enzon19.com' },
			{ type: 'github', href: 'https://github.com/enzon19/reversetv' },
		],
	},
	{
		id: 'mapa-de-sala',
		name: 'Mapa de Sala',
		logo: '/assets/projects/mapa-de-sala/logo563.png',
		color: '49 116 223',
		tags: ['website'],
		period: ['2023', '2025'],
		urls: [
			{ type: 'website', href: 'https://mapadesala.enzon19.com' },
			{ type: 'github', href: 'https://github.com/enzon19/mapa-de-sala' },
		],
	},
	{
		id: 'lookhere',
		name: 'LookHere!',
		logo: '/assets/projects/look-here/logo512.png',
		color: '0 164 118',
		tags: ['website'],
		period: ['2022'],
		urls: [
			{ type: 'website', href: 'https://lookhere.enzon19.com' },
			{ type: 'github', href: 'https://github.com/enzon19/lookhere' },
		],
	},
	{
		id: 'randomtv',
		name: 'RandomTV',
		logo: '/assets/projects/trakt-tools/randomtv/logo512.png',
		color: '217 58 61',
		tags: ['extension'],
		period: ['2022', '2025'],
		urls: [
			{ type: 'website', href: 'https://randomtv.enzon19.com' },
			{
				type: 'cws',
				href: 'https://chromewebstore.google.com/detail/randomtv-for-trakt/pfpgceagljbjijjfbhafopadmhdifoaa',
			},
			{ type: 'github', href: 'https://github.com/enzon19/randomtv' },
		],
	},
	{
		id: 'rebrandtv',
		name: 'RebrandTV',
		logo: '/assets/projects/trakt-tools/rebrandtv/logo.png',
		color: '217 58 61',
		tags: ['tool'],
		period: ['2024', '2026'],
		urls: [
			{
				type: 'website',
				href: 'https://greasyfork.org/scripts/513086-old-trakt-brand',
			},
		],
	},
	{
		id: 'dever-generator',
		name: 'Dever Generator',
		logo: '/assets/projects/other/mochila.svg',
		color: '35 160 229',
		tags: ['website', 'tool'],
		period: ['2022', '2023'],
		urls: [
			{ type: 'website', href: 'https://devergenerator.enzon19.com' },
			{ type: 'github', href: 'https://github.com/enzon19/dever-generator' },
		],
	},
	{
		id: 'mochila-do-enzo',
		name: 'Mochila do Enzo',
		logo: '/assets/projects/other/mochila.svg',
		color: '35 160 229',
		tags: ['website'],
		period: ['2022'],
		urls: [],
	},
	{
		id: 'copypasta-bot',
		name: 'Copypasta Bot',
		logo: '/assets/projects/other/copypasta.png',
		color: '43 85 12',
		tags: ['bot'],
		period: ['2021'],
		urls: [],
	},
	{
		id: 'yukimaru-bot',
		name: 'Yukimaru',
		logo: '/assets/projects/other/yukimaru.webp',
		color: '116 116 139',
		tags: ['client', 'bot'],
		period: ['2021', 'present'],
		urls: [],
	},
];
