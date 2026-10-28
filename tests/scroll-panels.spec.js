import { test, expect } from "@playwright/test";
test("painéis avançam apenas com scroll e não têm replay", async ({ page }) => {
	await page.goto("/"); await expect(page.locator(".experience-scroll")).toBeVisible();
	await expect(page.locator(".experience-boot")).toHaveCount(0, {
		timeout: 20000,
	});
	await expect(page.getByRole("button", { name: /Rever/ })).toHaveCount(0);
	const number = page.locator(".chapter-2 .study-goal strong");
	const setProgress = async (p) =>
		page.evaluate((p) => {
			const c = document.querySelector(".experience-scroll"),
				s = document.querySelector(".chapter-2");
			c.style.scrollBehavior = "auto";
			c.scrollTop =
				s.offsetTop - c.clientHeight + p * (s.offsetHeight + c.clientHeight);
		}, p);
	await setProgress(0.4);
	await page.waitForTimeout(200);
	const before = await number.textContent();
	await page.waitForTimeout(600);
	expect(await number.textContent()).toBe(before);
	await setProgress(0.65);
	await expect(number).toHaveText("60%");
	await setProgress(0.3);
	await expect(number).not.toHaveText("60%");
});

