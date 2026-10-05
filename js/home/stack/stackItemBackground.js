if (this.color) {
	const colors = generateThemeColors(this.color);

	console.log(
		`from-[${colors.light.from}]/60 via-[${colors.light.via}]/35 to-[${colors.light.to}]/50 dark:from-[${colors.dark.from}]/55 dark:via-[${colors.dark.via}]/35 dark:to-[${colors.dark.to}]/50`,
	);
}

function hexToOklch(hex) {
	const { r, g, b } = hexToRgb(hex);

	const rLin = srgbToLinear(r);
	const gLin = srgbToLinear(g);
	const bLin = srgbToLinear(b);

	const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin;
	const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin;
	const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin;

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
	const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
	const b2 = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

	const C = Math.sqrt(a ** 2 + b2 ** 2);
	const H = Math.atan2(b2, a) * (180 / Math.PI);

	return {
		l: L,
		c: C,
		h: H < 0 ? H + 360 : H,
	};
}

function oklchToHex(l, c, h) {
	const H = h * (Math.PI / 180);

	const a = c * Math.cos(H);
	const b = c * Math.sin(H);

	const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = l - 0.0894841775 * a - 1.291485548 * b;

	const l3 = l_ ** 3;
	const m3 = m_ ** 3;
	const s3 = s_ ** 3;

	const r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
	const g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
	const b2 = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

	return rgbToHex(linearToSrgb(r), linearToSrgb(g), linearToSrgb(b2));
}

function generateThemeColors(hex) {
	const { l, c, h } = hexToOklch(hex);

	return {
		base: hex,

		light: {
			from: oklchToHex(Math.min(l + 0.08, 1), c * 0.95, h),

			via: oklchToHex(Math.min(l + 0.02, 1), c * 0.9, h),

			to: oklchToHex(Math.max(l - 0.06, 0), c * 0.9, h),
		},

		dark: {
			from: oklchToHex(Math.min(l + 0.18, 1), c * 0.7, h),

			via: oklchToHex(Math.min(l + 0.12, 1), c * 0.6, h),

			to: oklchToHex(Math.min(l + 0.06, 1), c * 0.65, h),
		},
	};
}

function hexToRgb(hex) {
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((x) => x + x)
			.join('');
	}

	return {
		r: parseInt(hex.slice(0, 2), 16) / 255,
		g: parseInt(hex.slice(2, 4), 16) / 255,
		b: parseInt(hex.slice(4, 6), 16) / 255,
	};
}

function srgbToLinear(value) {
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(value) {
	value = Math.max(0, Math.min(1, value));

	return value <= 0.0031308
		? value * 12.92
		: 1.055 * value ** (1 / 2.4) - 0.055;
}

function rgbToHex(r, g, b) {
	return (
		'#' +
		[r, g, b]
			.map((value) =>
				Math.round(value * 255)
					.toString(16)
					.padStart(2, '0'),
			)
			.join('')
	);
}
