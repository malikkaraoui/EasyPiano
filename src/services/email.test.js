import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  sendEmail,
  buildConfirmationEmail,
  buildReminderEmail,
  buildReviewInvitationEmail,
  buildAnnualReminderEmail,
} from "./email";

describe("sendEmail", () => {
  let originalProvider;

  beforeEach(() => {
    originalProvider = process.env.EMAIL_PROVIDER;
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalProvider) {
      process.env.EMAIL_PROVIDER = originalProvider;
    } else {
      delete process.env.EMAIL_PROVIDER;
    }
  });

  it("simule l'envoi si pas de provider configuré", async () => {
    delete process.env.EMAIL_PROVIDER;
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });

    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
    consoleSpy.mockRestore();
  });

  it("retourne une erreur si provider non supporté", async () => {
    process.env.EMAIL_PROVIDER = "unknown";
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });

    expect(result.success).toBe(false);
    consoleSpy.mockRestore();
  });
});

describe("buildConfirmationEmail", () => {
  it("contient le nom du client et du pro", () => {
    const email = buildConfirmationEmail({
      clientName: "Sophie",
      proName: "Tomasz",
      date: "2026-04-15",
      slot: "morning",
    });

    expect(email.subject).toContain("Réservation confirmée");
    expect(email.html).toContain("Sophie");
    expect(email.html).toContain("Tomasz");
    expect(email.html).toContain("2026-04-15");
    expect(email.html).toContain("matin");
    expect(email.html).toContain("150 CHF");
  });

  it("gère le créneau après-midi", () => {
    const email = buildConfirmationEmail({
      clientName: "Sophie",
      proName: "Tomasz",
      date: "2026-04-15",
      slot: "afternoon",
    });

    expect(email.html).toContain("après-midi");
  });
});

describe("buildReminderEmail", () => {
  it("contient le nombre de jours", () => {
    const email = buildReminderEmail({
      clientName: "Sophie",
      proName: "Tomasz",
      date: "2026-04-15",
      slot: "morning",
      daysUntil: 2,
    });

    expect(email.subject).toContain("2 jours");
    expect(email.html).toContain("2 jours");
  });

  it("gère le singulier (1 jour)", () => {
    const email = buildReminderEmail({
      clientName: "Sophie",
      proName: "Tomasz",
      date: "2026-04-15",
      slot: "morning",
      daysUntil: 1,
    });

    expect(email.subject).toContain("1 jour");
    expect(email.subject).not.toContain("jours");
  });
});

describe("buildReviewInvitationEmail", () => {
  it("contient le lien vers la page d'avis", () => {
    const email = buildReviewInvitationEmail({
      clientName: "Sophie",
      proName: "Tomasz",
      bookingId: "b123",
    });

    expect(email.subject).toContain("accordage");
    expect(email.html).toContain("/review/b123");
    expect(email.html).toContain("Sophie");
  });
});

describe("buildAnnualReminderEmail", () => {
  it("contient le rappel 11 mois", () => {
    const email = buildAnnualReminderEmail({ clientName: "Sophie" });

    expect(email.subject).toContain("11 mois");
    expect(email.html).toContain("11 mois");
    expect(email.html).toContain("/search");
  });
});
