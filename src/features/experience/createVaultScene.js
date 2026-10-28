import { BRAND_POINTS } from "../../components/ui/brandGeometry";
import { easeRange } from "./choreography";
/** Procedural NEXUS vault. No external model, texture, or per-frame React state. */
export async function createVaultScene(
	host,
	{ progress, pointer, reduced, onPhase, paused },
) {
	const THREE = await import("three");
	const { RoomEnvironment } = await import(
		"three/addons/environments/RoomEnvironment.js"
	);
	onPhase("Compondo materiais");
	const mobile = host.clientWidth < 700;
	const renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true,
		powerPreference: "low-power",
	});
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
	renderer.setClearColor(0x000000, 0);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1.5;
	renderer.domElement.setAttribute("aria-hidden", "true");
	host.appendChild(renderer.domElement);
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60);
	camera.position.set(0, 0.2, 12);
	const pmrem = new THREE.PMREMGenerator(renderer);
	const room = new RoomEnvironment();
	const environment = pmrem.fromScene(room, 0.04);
	scene.environment = environment.texture;
	room.dispose();
	pmrem.dispose();
	scene.add(new THREE.HemisphereLight(0xffe4cc, 0x171520, 2));
	const key = new THREE.DirectionalLight(0xffffff, 4);
	key.position.set(-4, 7, 5);
	scene.add(key);
	const rim = new THREE.DirectionalLight(0xff6d2b, 5);
	rim.position.set(5, 1, -2);
	scene.add(rim);
	const materials = {
		graphite: new THREE.MeshStandardMaterial({
			color: 0x171c25,
			metalness: 0.9,
			roughness: 0.22,
		}),
		silver: new THREE.MeshStandardMaterial({
			color: 0xc5d2df,
			metalness: 1,
			roughness: 0.19,
		}),
		glass: new THREE.MeshPhysicalMaterial({
			color: 0xf4d7bd,
			metalness: 0.08,
			roughness: 0.14,
			transmission: 0.35,
			thickness: 0.75,
			ior: 1.45,
			transparent: true,
			opacity: 1,
		}),
		orange: new THREE.MeshStandardMaterial({
			color: 0xff5827,
			metalness: 0.35,
			roughness: 0.28,
		}),
		ink: new THREE.MeshStandardMaterial({
			color: 0x101722,
			metalness: 0.6,
			roughness: 0.28,
		}),
	};
	const geometries = [];
	function contour(Path, w, h, r) {
		const p = new Path();
		const x = -w / 2;
		const y = -h / 2;
		p.moveTo(x + r, y);
		p.lineTo(x + w - r, y);
		p.quadraticCurveTo(x + w, y, x + w, y + r);
		p.lineTo(x + w, y + h - r);
		p.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		p.lineTo(x + r, y + h);
		p.quadraticCurveTo(x, y + h, x, y + h - r);
		p.lineTo(x, y + r);
		p.quadraticCurveTo(x, y, x + r, y);
		return p;
	}
	function ring(w, h, thickness, depth, material) {
		const shape = contour(THREE.Shape, w, h, 0.22);
		const hole = contour(
			THREE.Path,
			w - thickness * 2,
			h - thickness * 2,
			0.12,
		);
		shape.holes.push(hole);
		const geo = new THREE.ExtrudeGeometry(shape, {
			depth,
			bevelEnabled: true,
			bevelSegments: 3,
			steps: 1,
			bevelSize: 0.055,
			bevelThickness: 0.055,
			curveSegments: 10,
		});
		geo.translate(0, 0, -depth / 2);
		geometries.push(geo);
		return new THREE.Mesh(geo, material);
	}
	function box(w, h, d, material) {
		const geo = new THREE.BoxGeometry(w, h, d);
		geometries.push(geo);
		return new THREE.Mesh(geo, material);
	}
	let dragActive = false,
		dragX = 0,
		offsetX = 0,
		velocityX = 0;
	const dragDown = (e) => {
		if (e.button !== 0 || paused.current) return;
		dragActive = true;
		dragX = e.clientX;
		velocityX = 0;
	};
	const dragMove = (e) => {
		if (!dragActive) return;
		const delta = (e.clientX - dragX) * 0.004;
		dragX = e.clientX;
		offsetX = Math.max(-0.8, Math.min(0.8, offsetX + delta));
		velocityX = delta;
	};
	const dragUp = () => {
		dragActive = false;
	};
	host.addEventListener("pointerdown", dragDown);
	host.addEventListener("pointermove", dragMove);
	window.addEventListener("pointerup", dragUp);
	host.addEventListener("pointercancel", dragUp);
	const vault = new THREE.Group();
	scene.add(vault);
	const layers = [];
	// The three volumes translate along the same axis as the story progresses.
	const specifications = [
		[3.1, 3.65, 0.45, 0.5, materials.graphite, -0.8],
		[2.95, 3.5, 0.23, 0.22, materials.silver, -0.1],
		[2.8, 3.35, 0.34, 0.3, materials.glass, 0.6],
	];
	for (const [w, h, t, d, material, z] of specifications) {
		const layer = new THREE.Group();
		layer.userData.baseZ = z;
		layer.add(ring(w, h, t, d, material));
		vault.add(layer);
		layers.push(layer);
	}
	const back = box(2.3, 2.85, 0.1, materials.ink);
	back.position.z = -1.02;
	layers[0].add(back);
	const inner = ring(1.72, 2.23, 0.09, 0.12, materials.orange);
	inner.position.z = -0.89;
	layers[0].add(inner);
	const centre = box(1.48, 1.97, 0.075, materials.graphite);
	centre.position.z = -0.75;
	layers[0].add(centre);
	const brandShape = new THREE.Shape();
	BRAND_POINTS.forEach(([x, y], i) => {
		brandShape[i ? "lineTo" : "moveTo"]((x - 27) * 0.05, (25 - y) * 0.05);
	});
	brandShape.closePath();
	const brandGeo = new THREE.ExtrudeGeometry(brandShape, {
		depth: 0.08,
		bevelEnabled: false,
	});
	geometries.push(brandGeo);
	const brandMesh = new THREE.Mesh(brandGeo, materials.silver);
	brandMesh.position.z = -0.66;
	layers[0].add(brandMesh);
	const railGeometry = new THREE.CylinderGeometry(0.035, 0.035, 2.1, 12);
	geometries.push(railGeometry);
	for (const x of [-1.2, 1.2])
		for (const y of [-1.44, 1.44]) {
			const rail = new THREE.Mesh(railGeometry, materials.silver);
			rail.rotation.x = Math.PI / 2;
			rail.position.set(x, y, 0);
			vault.add(rail);
		}
	// Four fasteners on the front glass frame.
	const screwGeometry = new THREE.CylinderGeometry(0.065, 0.065, 0.09, 16);
	geometries.push(screwGeometry);
	for (const x of [-1.19, 1.19])
		for (const y of [-1.46, 1.46]) {
			const screw = new THREE.Mesh(screwGeometry, materials.silver);
			screw.rotation.x = Math.PI / 2;
			screw.position.set(x, y, 0.21);
			layers[2].add(screw);
		}
	const stripe = box(0.065, 0.8, 0.08, materials.orange);
	stripe.position.set(1.4, 0, 0.15);
	layers[1].add(stripe);
	let contextFailed = false;
	let disposed = false,
		frame = 0,
		inView = true;
	// Orbital hardware: one continuous instrument around the three financial layers.
	const orbit = new THREE.Group();
	vault.add(orbit);
	const orbitGeometry = new THREE.TorusGeometry(3.05, 0.035, 8, 160);
	geometries.push(orbitGeometry);
	for (let i = 0; i < 3; i++) {
		const hoop = new THREE.Mesh(
			orbitGeometry,
			i === 1 ? materials.orange : materials.silver,
		);
		hoop.rotation.set(i * 0.8, 0.65 + i * 0.55, i * 0.3);
		hoop.scale.setScalar(1 + i * 0.08);
		orbit.add(hoop);
	}
	const ticksGeometry = new THREE.BoxGeometry(0.018, 0.16, 0.04);
	geometries.push(ticksGeometry);
	const ticks = new THREE.InstancedMesh(ticksGeometry, materials.silver, 96);
	const dummy = new THREE.Object3D();
	for (let i = 0; i < 96; i++) {
		const a = (i / 96) * Math.PI * 2;
		dummy.position.set(Math.cos(a) * 3.2, Math.sin(a) * 3.2, 0);
		dummy.rotation.set(0, 0, a - Math.PI / 2);
		dummy.updateMatrix();
		ticks.setMatrixAt(i, dummy.matrix);
	}
	orbit.add(ticks);
	const satellites = new THREE.Group();
	vault.add(satellites);
	const chipGeometry = new THREE.BoxGeometry(0.28, 0.7, 0.08);
	geometries.push(chipGeometry);
	const chips = new THREE.InstancedMesh(chipGeometry, materials.graphite, 32);
	satellites.add(chips);
	const target = { x: 0.2, y: -0.5, z: -0.16 };
	let previousTime = 0;
	let introStart;
	let smoothedProgress = progress.get();
	function size() {
		const width = host.clientWidth,
			height = host.clientHeight;
		if (!width || !height) return;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.position.z = width < 600 ? 12.5 : 11;
		camera.updateProjectionMatrix();
		draw(0);
	}
	function draw(time) {
		if (disposed || contextFailed) return;
		if (introStart === undefined && time > 0) introStart = time;
		const elapsed = reduced
			? 10
			: Math.max(0, (time - (introStart ?? time)) / 1000);
		const intro = easeRange(elapsed, 0, 1.8);
		const dt = Math.min(0.05, Math.max(0.001, (time - previousTime) / 1000));
		previousTime = time;
		const ease = reduced ? 1 : 1 - Math.exp(-dt * 13);
		smoothedProgress += (progress.get() - smoothedProgress) * ease;
		const p = reduced ? 0 : smoothedProgress;
		const approach = easeRange(p, 0.1, 0.34),
			open = easeRange(p, 0.37, 0.58),
			resolve = easeRange(p, 0.76, 0.96);
		const mouse = pointer.current;
		target.y =
			-0.55 +
			approach * 1.9 -
			open * 1.15 +
			resolve * 2.25 +
			(reduced ? 0 : mouse.x * 0.35);
		target.x =
			0.25 +
			approach * 0.4 -
			open * 0.9 +
			resolve * 0.4 +
			(reduced ? 0 : mouse.y * 0.2);
		target.z = -0.22 + approach * 0.5 - open * 0.55 + resolve * 0.5;
		if (!dragActive && !reduced) {
			offsetX = Math.max(-0.8, Math.min(0.8, offsetX + velocityX));
			velocityX *= 0.9;
		}
		vault.rotation.set(
			target.x,
			target.y + offsetX + (reduced ? 0 : Math.sin(time * 0.0003) * 0.12),
			target.z,
		);
		const narrow = host.clientWidth < 1000;
		vault.position.x = narrow
			? 0
			: 1.65 * (1 - approach) - open * 1.8 * (1 - resolve);
		vault.position.y =
			(narrow ? -0.6 : 0) + (reduced ? 0 : Math.sin(time * 0.0007) * 0.14);
		vault.scale.setScalar((narrow ? 0.68 : 0.88) * (0.7 + intro * 0.3));
		camera.position.z =
			(narrow ? 14 : 12) - approach * 5.2 + open * 4.8 - resolve * 1.6;
		camera.position.x = Math.sin(p * Math.PI) * 0.6;
		camera.lookAt(0, narrow ? 0.3 : 0, 0);
		orbit.rotation.set(
			time * (reduced ? 0 : 0.00008),
			p * 1.7,
			time * (reduced ? 0 : 0.00012),
		);
		orbit.scale.setScalar(1 + open * 0.4 - resolve * 0.25);
		satellites.rotation.z = reduced ? 0 : time * 0.000055 + p * 1.5;
		for (let i = 0; i < 32; i++) {
			const angle = (i / 32) * Math.PI * 2;
			const radius = 4.1 + Math.sin(i * 2.4) * 0.4 + open * 0.75;
			dummy.position.set(
				Math.cos(angle) * radius,
				Math.sin(angle) * radius,
				Math.sin(angle * 3) * 0.5,
			);
			dummy.rotation.set(angle * 0.2, angle, angle);
			dummy.updateMatrix();
			chips.setMatrixAt(i, dummy.matrix);
		}
		chips.instanceMatrix.needsUpdate = true;
		layers.forEach((layer, i) => {
			const spread = open * (1 - resolve * 0.85);
			layer.position.z =
				layer.userData.baseZ +
				(i - 1) * (0.25 + spread * 2.8) +
				(1 - intro) * (i - 1) * 2;
			layer.position.x = (i - 1) * spread * 0.85;
			layer.rotation.y = (i - 1) * spread * 0.28;
		});
		renderer.render(scene, camera);
	}
	function loop(time) {
		frame = 0;
		if (disposed || contextFailed || !inView || document.hidden || reduced)
			return;
		if (!paused.current) draw(time);
		frame = requestAnimationFrame(loop);
	}
	function start() {
		if (
			!frame &&
			!disposed &&
			!contextFailed &&
			inView &&
			!document.hidden &&
			!reduced
		)
			frame = requestAnimationFrame(loop);
	}
	const observer = new IntersectionObserver(
		([entry]) => {
			inView = entry.isIntersecting;
			if (inView) {
				draw(performance.now());
				start();
			} else {
				cancelAnimationFrame(frame);
				frame = 0;
			}
		},
		{ rootMargin: "80px" },
	);
	observer.observe(host);
	const resize = new ResizeObserver(size);
	resize.observe(host);
	const unsubscribe = progress.on("change", () => {
		if (reduced) draw(0);
	});
	const visibility = () => {
		if (document.hidden) {
			cancelAnimationFrame(frame);
			frame = 0;
		} else {
			draw(performance.now());
			start();
		}
	};
	const contextLost = (event) => {
		event.preventDefault();
		host.dataset.failed = "true";
		contextFailed = true;
		cancelAnimationFrame(frame);
		frame = 0;
	};
	document.addEventListener("visibilitychange", visibility);
	renderer.domElement.addEventListener("webglcontextlost", contextLost);
	onPhase("Preparando a primeira cena");
	size();
	draw(0);
	start();
	host.dataset.ready = "true";
	return () => {
		disposed = true;
		host.removeEventListener("pointerdown", dragDown);
		host.removeEventListener("pointermove", dragMove);
		window.removeEventListener("pointerup", dragUp);
		host.removeEventListener("pointercancel", dragUp);
		cancelAnimationFrame(frame);
		observer.disconnect();
		resize.disconnect();
		unsubscribe();
		document.removeEventListener("visibilitychange", visibility);
		renderer.domElement.removeEventListener("webglcontextlost", contextLost);
		for (const geo of geometries) geo.dispose();
		Object.values(materials).forEach((m) => m.dispose());
		environment.dispose();
		renderer.dispose();
		renderer.domElement.remove();
	};
}
