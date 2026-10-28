import { useEffect, useRef } from "react";

export default function Dialog({ children, onClose, label }) {
	const ref = useRef(null);
	useEffect(() => {
		const dialog = ref.current;
		const previousFocus = document.activeElement;
		dialog.showModal();
		return () => {
			dialog.close();
			previousFocus?.focus();
		};
	}, []);
	return (
		<dialog
			ref={ref}
			className="nexus-dialog"
			aria-label={label}
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			{children}
		</dialog>
	);
}
