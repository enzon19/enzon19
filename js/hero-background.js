import {
	ShaderMount,
	meshGradientFragmentShader,
	getShaderColorFromString,
} from '@paper-design/shaders';

let meshGradient;

function getColorsAsShaderColors(colors) {
	return colors.map((e) => getShaderColorFromString(e));
}

function initHeroBackground(colors) {
	const container = document.querySelector('#hero-bg');
	const u_colors = getColorsAsShaderColors(colors);

	const shaderParams = {
		u_colors,
		u_colorsCount: u_colors.length,
		u_distortion: 0.4,
		u_swirl: 0.15,
		u_grainMixer: 0.125,
		u_scale: 1,
		u_rotation: 0,
		u_offsetX: 0.5,
		u_offsetY: 0,
	};

	const speed = 0.7;
	meshGradient = new ShaderMount(
		container,
		meshGradientFragmentShader,
		shaderParams,
		undefined,
		speed,
	);
}

function changeColors(colors) {
	if (!meshGradient) return;

	const u_colors = getColorsAsShaderColors(colors);
	meshGradient.setUniforms({
		u_colors,
		u_colorsCount: u_colors.length,
	});
}

function loadHeroBackground(theme) {
	if (theme !== 'dark' && theme !== 'light') throw 'Invalid theme';

	const colors =
		theme == 'dark'
			? ['#09102a', '#0b1860', '#133786']
			// : ['#1286eb', '#8ec9fc', '#2771E4'];
			: ['#0D6FD6', '#6DB7F7', '#1553E6'] // '#2771E4'
			// : ['#006aff', '#74b7ff', '#c2e1ff']

	if (meshGradient) {
		changeColors(colors);
	} else {
		initHeroBackground(colors);
	}
}
loadHeroBackground(
	document.documentElement.classList.contains('dark') ? 'dark' : 'light',
);

window.loadHeroBackground = loadHeroBackground;
