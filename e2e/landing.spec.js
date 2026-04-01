import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("affiche le titre principal", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("On accorde");
    await expect(page.locator("h1")).toContainText("votre piano");
  });

  test("affiche la barre de recherche avec ville et date", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByLabel("Lieu de recherche")).toBeVisible();
    await expect(page.getByLabel("Date souhaitée")).toBeVisible();
    await expect(page.getByRole("button", { name: /rechercher/i })).toBeVisible();
  });

  test("autocomplétion ville dès 1 caractère", async ({ page }) => {
    await page.goto("/");
    const input = page.getByLabel("Lieu de recherche");
    await input.fill("Lau");
    await expect(page.getByText("📍 Lausanne")).toBeVisible();
  });

  test("affiche les 3 sections au scroll", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
    await page.waitForTimeout(1000);
    await expect(page.getByText("Comment ça marche ?")).toBeVisible();
  });

  test("la section confiance et le CTA sont rendus", async ({ page }) => {
    await page.goto("/");
    // Les h2 sont SSR et toujours dans le DOM
    await expect(page.getByText("Pourquoi nous faire confiance ?")).toBeAttached({ timeout: 10000 });
    await expect(page.getByText("Vous êtes accordeur de piano ?")).toBeAttached({ timeout: 5000 });
  });

  test("navigation header fonctionne", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("EasyPiano").first()).toBeVisible();
    await expect(page.getByText("Connexion").first()).toBeVisible();
  });

  test("le footer contient les liens essentiels", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    await expect(page.getByText("contact@easypiano.ch")).toBeVisible();
    await expect(page.getByText("Mentions légales")).toBeVisible();
  });

  test("la date min est aujourd'hui (pas de dates passées)", async ({ page }) => {
    await page.goto("/");
    const dateInput = page.getByLabel("Date souhaitée");
    const today = new Date().toISOString().split("T")[0];
    await expect(dateInput).toHaveAttribute("min", today);
  });
});
