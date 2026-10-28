import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Observability is optional. A placeholder DSN must never delay or record a session.
if (import.meta.env.VITE_SENTRY_DSN) {
	import("@sentry/react")
		.then((Sentry) => {
			Sentry.init({
				dsn: import.meta.env.VITE_SENTRY_DSN,
				integrations: [Sentry.browserTracingIntegration()],
				tracesSampleRate: 0.1,
			});
		})
		.catch(() => {});
}

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
