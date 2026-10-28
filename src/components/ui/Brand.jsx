import BrandMark from "./BrandMark";
export default function Brand({ compact = false }) {
	return (
		<span className="nexus-brand">
			<BrandMark />
			{!compact && (
				<span>
					nexus<span className="brand-dot"></span>
				</span>
			)}
		</span>
	);
}
