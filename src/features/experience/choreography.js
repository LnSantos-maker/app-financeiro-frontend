/** One scroll clock for typography, optics and physical pieces. */
export const clamp01 = (value) => Math.max(0, Math.min(1, value));
export const easeRange = (value, start, end) => {
	const t = clamp01((value - start) / (end - start));
	return t * t * (3 - 2 * t);
};
export const windowOpacity = (value, start, end, feather = 0.06) =>
	easeRange(value, start, start + feather) *
	(1 - easeRange(value, end - feather, end));
