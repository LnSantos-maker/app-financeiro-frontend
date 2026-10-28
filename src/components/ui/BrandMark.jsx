import { BRAND_PATH } from "./brandGeometry";
export default function BrandMark(props) {
	return (
		<svg viewBox="12 10 30 30" aria-hidden="true" {...props}>
			<path d={BRAND_PATH} fill="currentColor" stroke="none" />
		</svg>
	);
}
