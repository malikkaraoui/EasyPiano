import { test, expect } from "@playwright/test";

test.describe("Navigation & Pages", () => {
  test("page login accessible et affiche le bouton Google", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /continuer avec google/i })).toBeVisible();
  });

  test("page search accessible", async ({ page }) => {
    await page.goto("/search");
    await expect(page.getByText(/trouver un accordeur/i).first()).toBeVisible();
  });

  test("page become-pro redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/become-pro");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("page dashboard redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("page profile redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/profile");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("page admin redirige vers login si non connecté", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL("**/login");
    expect(page.url()).toContain("/login");
  });

  test("clic sur logo ramène à la home", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("EasyPiano").first().click();
    await expect(page).toHaveURL("/");
  });

  test("clic sur Connexion depuis le header", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Connexion").first().click();
    await expect(page).toHaveURL(/\/login/);
  });
});
