import {
	ShaderMount,
	meshGradientFragmentShader,
	getShaderColorFromString,
} from '@paper-design/shaders';

const container = document.querySelector('#hero');
const shaderParams = {
	u_colors: [
		getShaderColorFromString('#28aefc'),
		getShaderColorFromString('#286cff'),
		getShaderColorFromString('#39aeec'),
		getShaderColorFromString('#001c80'),
	],
	u_colorsCount: 4,
	u_distortion: 0.4,
	u_swirl: 0.15,
	u_grainMixer: 0.1,
	u_scale: 1,
	u_rotation: 0,
	u_offsetX: 0.5,
	u_offsetY: 0,
};

const speed = 1;
const meshGradient = new ShaderMount(
	container,
	meshGradientFragmentShader,
	shaderParams,
	undefined,
	speed,
);
