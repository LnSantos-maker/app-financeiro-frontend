import { test, expect } from "@playwright/test";

async function mockServices(page) {
	await page.route("**/*", (route) => {
		const url = new URL(route.request().url());
		if (url.origin === "http://localhost:5173") return route.continue();
		const path = url.pathname;
		let body = {};
		if (path.includes("configurar")) body = { id_conta: "teste-visual" };
		else if (path.includes("/perfil/"))
			body = { nome_usuario: "Marina", avatar_usuario: "avatar-1" };
		else if (path.includes("/saldo/")) body = { saldo_atual: 12480.5 };
		else if (path.includes("/balanco/"))
			body = { receitas: 8500, despesas: 2360, guardado: 2500, balanco: 6140 };
		else if (path.includes("/evolucao/"))
			body = {
				evolucao: [
					{ name: "Mai", saldo: 5200 },
					{ name: "Jun", saldo: 7100 },
					{ name: "Jul", saldo: 6800 },
					{ name: "Ago", saldo: 9200 },
					{ name: "Set", saldo: 10800 },
					{ name: "Out", saldo: 12480.5 },
				],
			};
		else if (path.includes("/graficos/"))
			body = {
				categorias: [
					{ name: "Moradia", value: 1800, color: "#cad9a4" },
					{ name: "Alimentação", value: 560, color: "#d6b38c" },
				],
			};
		else if (path.includes("/listar_transacoes/"))
			body = {
				transacoes: [
					{
						id: 1,
						tipo: "Receita",
						categoria: "Salário",
						valor: 8500,
						data: "2026-10-05",
					},
					{
						id: 2,
						tipo: "Despesa",
						categoria: "Alimentação",
						valor: 560,
						data: "2026-10-12",
					},
				],
			};
		else if (path.includes("/listar_agendamentos/"))
			body = {
				agendamentos: [
					{
						id: 1,
						descricao: "Internet",
						valor: 120,
						data_vencimento: "2026-10-30",
						categoria: "Moradia",
					},
				],
			};
		else if (path.includes("/inteligencia/"))
			body = {
				essenciais: { valor: 2360, porcentagem: 27.8, itens: [] },
				estilo_vida: { valor: 0, porcentagem: 0, itens: [] },
				futuro: { valor: 2500, porcentagem: 29.4, itens: [] },
			};
		return route.fulfill({ json: body });
	});
}
async function openDashboard(page) {
	await mockServices(page);
	await page.addInitScript(() => {
		localStorage.setItem("isAutenticado", "true");
		localStorage.setItem("emailLogin", "teste@example.com");
	});
	await page.goto("/");
	await expect(page.getByRole("heading", { name: "O agora." })).toBeVisible();
	await expect(page.locator(".balance-value strong")).toHaveText(
		"R$ 12.480,50",
	);
}

test("entrada, login, cadastro e retorno do foco funcionam por teclado", async ({
	page,
}) => {
	await mockServices(page);
	await page.goto("/");
	await expect(page.getByRole("heading", { level: 1 })).toContainText(
		"Seu próximo",
	);
	const enter = page.getByRole("button", {
		name: "Acessar conta",
		exact: true,
	});
	await enter.click();
	const dialog = page.getByRole("dialog", { name: "Entrar na conta" });
	await expect(dialog).toBeVisible();
	await dialog
		.getByRole("textbox", { name: "E-mail", exact: true })
		.fill("teste@example.com");
	await page.getByLabel("Senha", { exact: true }).fill("exemplo");
	await page.getByRole("button", { name: "Mostrar senha" }).click();
	await expect(page.getByLabel("Senha", { exact: true })).toHaveAttribute(
		"type",
		"text",
	);
	await page.keyboard.press("Escape");
	await expect(dialog).not.toBeVisible();
	await expect(enter).toBeFocused();
	await page.getByRole("button", { name: "Organizar minhas finanças" }).click();
	await expect(page.getByRole("dialog", { name: "Criar conta" })).toBeVisible();
	await expect(page.getByLabel("Nome", { exact: true })).toBeVisible();
	await expect(
		page.getByLabel("Confirmar senha", { exact: true }),
	).toBeVisible();
});

test("painel mantém navegação, período e ações de receita e despesa", async ({
	page,
}) => {
	await openDashboard(page);
	await expect(
		page.getByText("R$ 12.480,50", { exact: true }).first(),
	).toBeVisible();
	const period = page.locator(".period-control span");
	const original = await period.textContent();
	await page.getByRole("button", { name: "Mês anterior" }).click();
	await expect(period).not.toHaveText(original);
	await page.getByRole("button", { name: "Próximo mês" }).click();
	await expect(period).toHaveText(original);
	await page.getByRole("button", { name: "Receita", exact: true }).click();
	await expect(
		page.getByRole("heading", { name: /Nova Receita/ }),
	).toBeVisible();
});

for (const width of [390, 768, 1440]) {
	test(`todas as seções ficam acessíveis sem corte em ${width}px`, async ({
		page,
	}) => {
		await page.setViewportSize({ width, height: 900 });
		await page.emulateMedia({ reducedMotion: "reduce" });
		const errors = [];
		page.on("pageerror", (e) => errors.push(e.message));
		await openDashboard(page);
		for (const label of [
			"Movimentações",
			"Cartões",
			"Cofres",
			"Benefícios",
			"Planejamento",
			"Calculadoras",
			"Configurações",
			"Visão geral",
		]) {
			const item = page
				.getByRole("navigation")
				.getByRole("button", { name: label, exact: true });
			await item.click();
			await expect(item).toHaveAttribute("aria-current", "page");
			const headings = {
				Movimentações: "Extrato",
				Cartões: "Cartões",
				Cofres: "Cofres",
				Benefícios: "Benefícios",
				Planejamento: "Planejamento",
				Calculadoras: "Utilitários",
				Configurações: "Configurações",
				"Visão geral": "O agora",
			};
			await expect(page.locator(".dashboard-content h1")).toContainText(
				headings[label],
			);
			await expect(page.locator(".dashboard-view")).toHaveCSS("opacity", "1");
			const sizes = await page.locator(".dashboard-content").evaluate((el) => ({
				content: el.scrollWidth,
				viewport: el.clientWidth,
			}));
			expect(sizes.content, label).toBeLessThanOrEqual(sizes.viewport + 1);
		}
		await page.screenshot({
			path: test.info().outputPath(`dashboard-${width}.png`),
		});
		expect(errors).toEqual([]);
	});
}
