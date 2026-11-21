import { expect, test } from "@playwright/test";

const sections = ["inicio", "servicios", "proceso", "proyectos", "nosotras", "contacto"];

test.beforeEach(async ({ page }) => {
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
});

test("permite saltar al contenido y recorrer los enlaces internos", async ({ page }) => {
  await page.keyboard.press("Tab");
  const skipLink = page.getByRole("link", { name: "Saltar al contenido" });
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();

  const navigation = page.getByRole("navigation", { name: "Navegación principal" });
  await expect(navigation.getByRole("link")).toHaveCount(sections.length);
  for (const id of sections) {
    const link = navigation.locator(`a[href="#${id}"]`);
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }

  for (const link of await page.locator('a[href^="#"]').all()) {
    const target = await link.getAttribute("href");
    await expect(page.locator(target)).toHaveCount(1);
  }
});

test("abre y cierra el menú móvil con el teclado y conserva el foco", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const menu = page.getByRole("button", { name: /menú/ });
  const navigation = page.locator("#primary-navigation");
  await expect(navigation).toBeHidden();
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(navigation.getByRole("link", { name: "Inicio" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();

  await page.keyboard.press("Space");
  await navigation.getByRole("link", { name: "Proyectos" }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#proyectos$/);
  await expect(page.locator("#proyectos")).toBeFocused();
  await expect(navigation).toBeHidden();
});

test("prepara una consulta local con teclado, sin envíos ni persistencia", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const menu = page.getByRole("button", { name: /menú/ });
  await menu.focus();
  await page.keyboard.press("Enter");
  const trigger = page.getByRole("navigation").getByRole("button", { name: "Hablemos de tu proyecto" });
  await trigger.focus();

  const requests = [];
  page.on("request", (request) => requests.push(request.url()));
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Prepará una consulta" });
  await expect(dialog).toBeVisible();
  const type = dialog.getByLabel("Tipo de proyecto");
  await expect(type).toBeFocused();
  await type.selectOption({ index: 1 });
  await page.keyboard.press("Tab");
  const goal = dialog.getByLabel("Objetivo");
  await expect(goal).toBeFocused();
  await goal.selectOption({ label: "Explorar una idea" });
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");

  await expect(dialog.getByRole("heading", { name: "Vista previa de la consulta" })).toBeFocused();
  await expect(dialog.getByText("Objetivo: Explorar una idea.")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(menu).toBeFocused();
  expect(requests).toEqual([]);
  expect(await page.evaluate(async () => [
    localStorage.length,
    sessionStorage.length,
    (await indexedDB.databases()).length,
  ])).toEqual([0, 0, 0]);
  expect(await page.context().cookies()).toEqual([]);

  await page.reload();
  await page.locator(".hero").getByRole("button", { name: "Hablemos de tu proyecto" }).click();
  await expect(type).toHaveValue("");
  await expect(goal).toHaveValue("");
  await expect(dialog.getByRole("heading", { name: "Vista previa de la consulta" })).toHaveCount(0);
});

for (const width of [320, 375, 760, 761, 1000, 1001, 1440]) {
  test(`conserva el contenido y la distribución a ${width} px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    const cards = page.locator("#proyectos article");
    await expect(cards).toHaveCount(3);
    const first = await cards.nth(0).boundingBox();
    const second = await cards.nth(1).boundingBox();
    const third = await cards.nth(2).boundingBox();
    if (width <= 760) {
      expect(first.x).toBe(second.x);
      expect(second.x).toBe(third.x);
      expect(second.y).toBeGreaterThan(first.y);
      expect(third.y).toBeGreaterThan(second.y);
    } else {
      expect(first.y).toBe(second.y);
      expect(second.x).toBeGreaterThan(first.x);
      expect(third.width).toBeGreaterThan(first.width);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
    await expect(page.getByRole("button", { name: /abrir menú/i })).toBeVisible({ visible: width <= 1000 });
    for (const name of ["Valentina Torres", "Camila Fernández"]) {
      await expect(page.locator("#nosotras")).toContainText(name);
      await expect(page.locator("footer")).toContainText(name);
    }
    await expect(page.getByRole("img", { name: /Doble Código/ })).toBeVisible();
  });
}
