import { easeRange } from "./choreography";
export async function createArtifact(host, { index, progress, reduced }) {
	const T = await import("three");
	const { RoundedBoxGeometry } = await import(
		"three/addons/geometries/RoundedBoxGeometry.js"
	);
	const { RoomEnvironment } = await import(
		"three/addons/environments/RoomEnvironment.js"
	);
	const renderer = new T.WebGLRenderer({
		alpha: true,
		antialias: true,
		powerPreference: "low-power",
	});
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
	renderer.toneMapping = T.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 0.85;
	host.appendChild(renderer.domElement);
	const scene = new T.Scene(),
		camera = new T.PerspectiveCamera(32, 1, 0.1, 50);
	camera.position.set(0, 0, 10);
	const pm = new T.PMREMGenerator(renderer),
		room = new RoomEnvironment(),
		env = pm.fromScene(room, 0.03);
	scene.environment = env.texture;
	room.dispose();
	pm.dispose();
	const metal = new T.MeshPhysicalMaterial({
		color: index === 2 ? 0xa2afbf : 0xa2afbf,
		metalness: 1,
		roughness: 0.28,
		clearcoat: 0.35,
		clearcoatRoughness: 0.12,
	});
	const dark = new T.MeshStandardMaterial({
		color: 0x19201c,
		metalness: 0.8,
		roughness: 0.23,
	});
	const accent = new T.MeshPhysicalMaterial({
		color: 0xe26435,
		metalness: 0.25,
		roughness: 0.2,
		clearcoat: 0.35,
	});
	scene.add(new T.HemisphereLight(0xf8ffe9, 0x252e20, 0.6));
	const light = new T.DirectionalLight(0xffffff, 1.2);
	light.position.set(-4, 5, 5);
	scene.add(light);
	const object = new T.Group();
	scene.add(object);
	const geos = [],
		parts = [];
	function box(w, h, d, mat, x = 0, y = 0, z = 0) {
		const geo = new RoundedBoxGeometry(w, h, d, 6, Math.min(0.09, d * 0.45));
		geos.push(geo);
		const m = new T.Mesh(geo, mat);
		m.position.set(x, y, z);
		object.add(m);
		return m;
	}
	// Product studies use legible illustrative financial data, rather than abstract props.
	box(4.5, 3.1, 0.1, metal);
	const label = document.createElement("canvas");
	label.width = 1800;
	label.height = 1240;
	const ctx = label.getContext("2d");
	ctx.fillStyle = "#111b29";
	ctx.fillRect(0, 0, 1800, 1240);
	ctx.fillStyle = "#97a9bf";
	ctx.font = "30px sans-serif";
	ctx.fillText(
		["VISÃO DO MÊS", "DISTRIBUIÇÃO DO ORÇAMENTO", "OBJETIVO · RESERVA"][index],
		100,
		120,
	);
	ctx.fillStyle = "#f2f5f7";
	ctx.font = "84px sans-serif";
	ctx.fillText(
		["R$ 2.450,00", "Cada parte, um destino.", "R$ 6.000 de R$ 10.000"][index],
		100,
		270,
	);
	ctx.fillStyle = "#97a9bf";
	ctx.font = "30px sans-serif";
	ctx.fillText(
		[
			"Disponível depois das despesas",
			"Um exemplo. As proporções são suas.",
			"60% do objetivo alcançado",
		][index],
		100,
		345,
	);
	const rows =
		index === 0
			? [
					["Receitas", "R$ 6.200", 1],
					["Despesas", "R$ 3.750", 0.6],
					["Disponível", "R$ 2.450", 0.4],
				]
			: index === 1
				? [
						["Essencial", "50%", 0.5],
						["Estilo de vida", "30%", 0.3],
						["Futuro", "20%", 0.2],
					]
				: [
						["Guardado", "R$ 6.000", 0.6],
						["Próximo aporte", "R$ 500", 0.05],
						["Meta", "R$ 10.000", 1],
					];
	rows.forEach(([name, value, amount], i) => {
		const y = 490 + i * 205;
		ctx.font = "36px sans-serif";
		ctx.fillStyle = "#c5d0dc";
		ctx.fillText(name, 100, y);
		ctx.textAlign = "right";
		ctx.fillStyle = "#f5f7f9";
		ctx.fillText(value, 1700, y);
		ctx.textAlign = "left";
		ctx.fillStyle = "#253448";
		ctx.fillRect(100, y + 45, 1600, 12);
		ctx.fillStyle = i === 2 ? "#d88559" : "#91abc7";
		ctx.fillRect(100, y + 45, 1600 * amount, 12);
	});
	ctx.fillStyle = "#71849b";
	ctx.font = "25px sans-serif";
	ctx.fillText("NEXUS / DADOS ILUSTRATIVOS", 100, 1150);
	const tex = new T.CanvasTexture(label);
	tex.colorSpace = T.SRGBColorSpace;
	tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
	const faceMaterial = new T.MeshBasicMaterial({ map: tex });
	const faceGeo = new T.PlaneGeometry(4.42, 3.02);
	geos.push(faceGeo);
	const face = new T.Mesh(faceGeo, faceMaterial);
	face.position.z = 0.056;
	object.add(face);
	object.userData.faceMaterial = faceMaterial;
	object.userData.faceTexture = tex;

	let velocity = 0,
		lastTime = 0;
	let yaw = -0.35,
		pitch = 0.12,
		drag = false,
		startX = 0,
		lastX = 0,
		frame = 0,
		visible = true,
		disposed = false;
	const down = (e) => {
		drag = true;
		velocity = 0;
		startX = lastX = e.clientX;
	};
	const move = (e) => {
		if (!drag) return;
		velocity = (e.clientX - lastX) * 0.006;
		yaw = Math.max(-1.2, Math.min(1.2, yaw + velocity));
		lastX = e.clientX;
		if (e.pointerType !== "touch")
			pitch = Math.max(-0.6, Math.min(0.6, pitch + e.movementY * 0.005));
		if (Math.abs(lastX - startX) > 8 && e.cancelable) e.preventDefault();
	};
	const up = () => {
		drag = false;
	};
	const key = (e) => {
		if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
			e.preventDefault();
			yaw += e.key === "ArrowLeft" ? -0.15 : e.key === "ArrowRight" ? 0.15 : 0;
			pitch += e.key === "ArrowUp" ? -0.1 : e.key === "ArrowDown" ? 0.1 : 0;
			render();
		}
	};
	host.addEventListener("pointerdown", down);
	host.addEventListener("pointermove", move);
	window.addEventListener("pointerup", up);
	host.addEventListener("pointercancel", up);
	host.addEventListener("keydown", key);
	function render() {
		const p = progress.get(),
			assembly = reduced ? 1 : easeRange(p, 0.12, 0.48);
		const travel = reduced ? 0 : easeRange(p, 0.08, 0.8);
		object.rotation.set(
			pitch,
			yaw + (reduced ? 0 : (travel - 0.5) * 0.65),
			-0.035,
		);
		camera.position.z = reduced ? 9 : 10.2 - easeRange(p, 0.12, 0.58) * 1.5;
		parts.forEach((m, i) => {
			m.position.z = 0.2 + (1 - assembly) * (i + 1) * 0.65;
		});
		renderer.render(scene, camera);
	}
	function loop(time = performance.now()) {
		const dt = Math.min((time - lastTime) / 16.667, 2);
		lastTime = time;
		if (!drag && !reduced) {
			yaw = Math.max(-1.2, Math.min(1.2, yaw + velocity * dt));
			velocity *= Math.pow(0.9, dt);
		}
		frame = 0;
		if (disposed || !visible || document.hidden) return;
		render();
		frame = requestAnimationFrame(loop);
	}
	const resize = new ResizeObserver(() => {
		renderer.setSize(host.clientWidth, host.clientHeight);
		camera.aspect = host.clientWidth / host.clientHeight;
		camera.updateProjectionMatrix();
		render();
	});
	resize.observe(host);
	const observer = new IntersectionObserver(([e]) => {
		visible = e.isIntersecting;
		if (visible && !frame) loop();
		else if (!visible) {
			cancelAnimationFrame(frame);
			frame = 0;
		}
	});
	observer.observe(host);
	const visibility = () => {
		if (document.hidden) {
			cancelAnimationFrame(frame);
			frame = 0;
		} else if (visible && !frame) loop();
	};
	document.addEventListener("visibilitychange", visibility);
	const unsub = progress.on("change", render);
	render();
	return () => {
		disposed = true;
		cancelAnimationFrame(frame);
		resize.disconnect();
		observer.disconnect();
		unsub();
		host.removeEventListener("pointerdown", down);
		host.removeEventListener("pointermove", move);
		window.removeEventListener("pointerup", up);
		host.removeEventListener("pointercancel", up);
		host.removeEventListener("keydown", key);
		document.removeEventListener("visibilitychange", visibility);
		geos.forEach((g) => g.dispose());
		[metal, dark, accent].forEach((m) => m.dispose());
		object.userData.faceMaterial?.dispose();
		object.userData.faceTexture?.dispose();
		env.dispose();
		renderer.dispose();
		renderer.domElement.remove();
	};
}
