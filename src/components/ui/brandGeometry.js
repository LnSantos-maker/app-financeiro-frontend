export const BRAND_POINTS = [
	[16, 36],
	[16, 14],
	[21, 14],
	[35, 31],
	[35, 14],
	[38, 14],
	[38, 36],
	[34, 36],
	[19, 18],
	[19, 36],
];
export const BRAND_PATH =
	"M" + BRAND_POINTS.map((p) => p.join(",")).join("L") + "Z";
