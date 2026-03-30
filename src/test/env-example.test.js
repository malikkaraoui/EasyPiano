import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

describe(".env.example", () => {
  const envExample = readFileSync(
    resolve(process.cwd(), ".env.example"),
    "utf-8",
  );

  const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_DATABASE_URL",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_SECRET_KEY",
    "FIREBASE_ADMIN_CREDENTIAL",
    "NEXT_PUBLIC_SENTRY_DSN",
    "SENTRY_AUTH_TOKEN",
  ];

  it.each(requiredVars)("contient la variable %s", (varName) => {
    expect(envExample).toContain(varName);
  });

  it("ne contient aucune valeur secrète (lignes non-commentées vides après =)", () => {
    const lines = envExample
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("#"));

    for (const line of lines) {
      const [key, ...valueParts] = line.split("=");
      const value = valueParts.join("=").trim();
      expect(value).toBe(
        "",
        `La variable ${key.trim()} ne doit pas contenir de valeur dans .env.example`,
      );
    }
  });
});
