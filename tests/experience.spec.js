import { test, expect } from "@playwright/test";

async function openExperience(page) {
	await page.goto("/");
	await expect(page.locator(".experience-scroll")).toHaveAttribute(
		"data-prepared",
		"true",
		{ timeout: 20000 },
	);
	await expect(page.locator(".experience-boot")).toHaveCount(0);
}

test("blur acompanha velocidade, desaparece em repouso e não afeta os controles", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 900 });
	await openExperience(page);
	const peak = await page.evaluate(async () => {
		const container = document.querySelector(".experience-scroll");
		const scene = document.querySelector(".experience-object");
		container.style.scrollBehavior = "auto";
		let max = 0;
		const start = performance.now();
		await new Promise((resolve) => {
			const frame = (now) => {
				container.scrollTop = (now - start) * 1.1;
				max = Math.max(
					max,
					parseFloat(getComputedStyle(scene).filter.match(/blur\((.*?)px/)[1]),
				);
				if (now - start < 800) requestAnimationFrame(frame);
				else resolve();
			};
			requestAnimationFrame(frame);
		});
		return max;
	});
	expect(peak).toBeGreaterThan(0.2);
	await expect
		.poll(() =>
			page
				.locator(".experience-object")
				.evaluate((el) =>
					parseFloat(getComputedStyle(el).filter.match(/blur\((.*?)px/)[1]),
				),
		)
		.toBeLessThan(0.03);
	await expect(page.locator(".experience-login")).toHaveCSS("filter", "none");
	await page.getByRole("button", { name: "Acessar conta" }).click();
	await expect(page.getByRole("dialog")).toBeVisible();
});

test("os quatro momentos respondem ao scroll e a cena continua viva em repouso", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1280, height: 720 });
	await openExperience(page);
	const canvas = page.locator(".financial-sculpture canvas");
	const first = await canvas.screenshot();
	await page.waitForTimeout(500);
	expect((await canvas.screenshot()).equals(first)).toBe(false);
	for (const [progress, act] of [
		[0.31, "1"],
		[0.61, "2"],
		[0.93, "3"],
		[0, "0"],
	]) {
		await page.locator(".experience-scroll").evaluate((el, p) => {
			el.style.scrollBehavior = "auto";
			el.scrollTop =
				(el.querySelector(".experience-journey").offsetHeight -
					el.clientHeight) *
				p;
		}, progress);
		await expect(page.locator(".experience-scroll")).toHaveAttribute(
			"data-act",
			act,
		);
	}
	await expect(
		page.getByRole("button", { name: "Organizar minhas finanças" }),
	).toBeInViewport();
});

test("cena 3D abre, acompanha a rolagem e permite inverter o percurso", async ({
	page,
}) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	const errors = [];
	page.on("pageerror", (error) => errors.push(error.message));
	await openExperience(page);
	await expect(page.locator(".financial-sculpture")).toHaveAttribute(
		"data-ready",
		"true",
	);
	await expect(page.locator(".financial-sculpture canvas")).toBeVisible();
	await page.screenshot({
		path: test.info().outputPath("abertura-desktop.png"),
	});
	await page
		.locator(".experience-scroll")
		.evaluate(
			(el) =>
				(el.scrollTop =
					(el.querySelector(".experience-journey").offsetHeight -
						el.clientHeight) *
					0.6),
		);
	await expect(page.locator(".experience-hero-copy")).toHaveCSS("opacity", "0");
	await expect(page.locator(".experience-hero-copy")).toHaveAttribute(
		"inert",
		"",
	);
	await expect(page.locator(".experience-second-copy")).toHaveCSS(
		"opacity",
		"1",
	);
	await page.screenshot({ path: test.info().outputPath("cofre-aberto.png") });
	await page.locator(".experience-scroll").evaluate((el) => (el.scrollTop = 0));
	await expect(page.locator(".experience-hero-copy")).toHaveCSS("opacity", "1");
	await expect(
		page.getByRole("button", { name: "Organizar minhas finanças" }),
	).toBeVisible();
	await page.getByRole("link", { name: "Uma nova perspectiva" }).click();
	await expect(page.locator("#perspectivas")).toBeInViewport();
	expect(errors).toEqual([]);
});

test("movimento reduzido e botão de cena estática preservam conteúdo e acesso", async ({
	page,
}) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await openExperience(page);
	await expect(page.locator(".experience-scroll")).toHaveAttribute(
		"data-motion",
		"reduced",
	);
	await page
		.getByRole("button", { name: "Ativar experiência completa" })
		.click();
	await expect(page.locator(".experience-scroll")).toHaveAttribute(
		"data-motion",
		"full",
	);
	await expect(page.locator(".experience-boot")).toHaveCount(0);
	await page.reload();
	await openExperience(page);
	await expect(page.locator(".experience-scroll")).toHaveAttribute(
		"data-motion",
		"full",
	);
	await page.getByRole("button", { name: "Reduzir movimento" }).click();
	await expect(page.locator(".financial-sculpture canvas")).toHaveCount(0);
	await expect(page.locator(".vault-fallback")).toHaveCSS("opacity", "1");
	const login = page.getByRole("button", { name: "Acessar conta" });
	await login.click();
	await expect(
		page.getByRole("dialog", { name: "Entrar na conta" }),
	).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(login).toBeFocused();
});

test("sem WebGL, a alternativa aparece e a conta continua acessível", async ({
	page,
}) => {
	await page.addInitScript(() => {
		const getContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = function (type, ...args) {
			return ["webgl", "webgl2", "experimental-webgl"].includes(type)
				? null
				: getContext.call(this, type, ...args);
		};
	});
	await openExperience(page);
	await expect(page.locator(".financial-sculpture")).toHaveAttribute(
		"data-failed",
		"true",
	);
	await expect(page.locator(".vault-fallback")).toHaveCSS("opacity", "1");
	await page.getByRole("button", { name: "Acessar conta" }).click();
	await expect(page.getByRole("dialog")).toBeVisible();
});

test("perder o contexto gráfico mantém a ilustração e o conteúdo", async ({
	page,
}) => {
	await openExperience(page);
	await expect(page.locator(".financial-sculpture")).toHaveAttribute(
		"data-ready",
		"true",
	);
	await page
		.locator(".financial-sculpture canvas")
		.evaluate((canvas) =>
			canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
		);
	await expect(page.locator(".financial-sculpture")).toHaveAttribute(
		"data-failed",
		"true",
	);
	await expect(page.locator(".vault-fallback")).toHaveCSS("opacity", "1");
	await expect(
		page.getByRole("button", { name: "Organizar minhas finanças" }),
	).toBeVisible();
});

for (const width of [360, 768]) {
	test(`experiência completa em ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: "reduce" });
		await openExperience(page);
		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		await expect(
			page.getByRole("button", { name: "Organizar minhas finanças" }),
		).toBeVisible();
		const overflow = await page
			.locator(".experience-scroll")
			.evaluate((el) => el.scrollWidth - el.clientWidth);
		expect(overflow).toBeLessThanOrEqual(1);
		await page.screenshot({
			path: test.info().outputPath(`abertura-${width}.png`),
		});
		await page
			.locator(".experience-scroll")
			.evaluate(
				(el) =>
					(el.scrollTop = el.querySelector(".perspective-chapters").offsetTop),
			);
		await expect(
			page.getByRole("heading", { name: /O mês tem muitas partes/ }),
		).toBeInViewport();
		await page.screenshot({
			path: test.info().outputPath(`capitulo-${width}.png`),
		});
		await page
			.getByRole("button", { name: "Criar minha conta", exact: true })
			.scrollIntoViewIfNeeded();
		await page
			.getByRole("button", { name: "Criar minha conta", exact: true })
			.click();
		await expect(
			page.getByRole("dialog", { name: "Criar conta" }),
		).toBeVisible();
	});
}
test("peças metálicas respondem ao arraste e ao teclado", async ({ page }) => {
	await page.setViewportSize({ width: 1440, height: 1000 });
	await openExperience(page);
	const chapter = page.locator(".chapter-2");
	await chapter.scrollIntoViewIfNeeded();
	const artifact = chapter.locator(".physical-artifact");
	await expect(artifact).toHaveAttribute("data-ready", "true", {
		timeout: 20000,
	});
	const canvas = artifact.locator("canvas");
	const before = await canvas.screenshot();
	const bounds = await canvas.boundingBox();
	await page.mouse.move(
		bounds.x + bounds.width * 0.4,
		bounds.y + bounds.height * 0.5,
	);
	await page.mouse.down();
	await page.mouse.move(
		bounds.x + bounds.width * 0.65,
		bounds.y + bounds.height * 0.52,
		{ steps: 12 },
	);
	await page.mouse.up();
	await expect
		.poll(async () => !(await canvas.screenshot()).equals(before))
		.toBe(true);
	const after = await canvas.screenshot();
	await artifact.locator(".artifact-render").focus();
	await page.keyboard.press("ArrowLeft");
	await expect
		.poll(async () => !(await canvas.screenshot()).equals(after))
		.toBe(true);
	await page.screenshot({
		path: test.info().outputPath("cofre-interativo.png"),
	});
});
