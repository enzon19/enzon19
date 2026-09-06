export const tags = [
	'bot',
	'extension',
	'website',
	'tool',
	'platform',
	'client',
];

export const anchors = {
	website: {
		field: 'name',
		value: 'globe-outline',
	},
	telegram: {
		field: 'src',
		value: '/assets/icons/telegram.svg',
	},
	github: {
		field: 'name',
		value: 'logo-github',
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
			{
				type: 'website',
				href: 'https://dicionariobot.enzon19.com',
			},
			{
				type: 'telegram',
				href: 'https://t.me/dicionariobot',
			},
			{
				type: 'github',
				href: 'https://github.com/enzon19/dicionariobot',
			},
		],
	},
];
