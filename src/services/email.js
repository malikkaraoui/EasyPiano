/**
 * Service d'emails transactionnels EasyPiano.
 * Compatible Firebase Extensions (Trigger Email) ou Resend.
 * En dev sans provider configuré, les emails sont loggés en console.
 */

const EMAIL_FROM = "EasyPiano <noreply@easypiano.ch>";

export async function sendEmail({ to, subject, html }) {
  const provider = process.env.EMAIL_PROVIDER; // "resend" ou "firebase"

  if (!provider) {
    console.error(
      `[Email] Provider non configuré — email simulé : to=${to}, subject=${subject}`,
    );
    return { success: true, simulated: true };
  }

  try {
    if (provider === "resend") {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) throw new Error("RESEND_API_KEY manquante");

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
      });

      if (!res.ok) throw new Error(`Resend error: ${res.status}`);
      return { success: true };
    }

    console.error(`[Email] Provider "${provider}" non supporté`);
    return { success: false, error: "Provider non supporté" };
  } catch (error) {
    console.error("[Email] Erreur envoi:", error.message);
    return { success: false, error: error.message };
  }
}

export function buildConfirmationEmail({ clientName, proName, date, slot }) {
  const slotLabel =
    slot === "morning" ? "matin (9h-12h)" : "après-midi (14h-17h)";
  return {
    subject: `Réservation confirmée — ${date}`,
    html: `<h2>Réservation confirmée</h2>
<p>Bonjour ${clientName},</p>
<p>Votre accordage est confirmé avec <strong>${proName}</strong> le <strong>${date}</strong> (${slotLabel}).</p>
<p>Prix : <strong>150 CHF</strong></p>
<p>À bientôt,<br>L'équipe EasyPiano</p>`,
  };
}

export function buildReminderEmail({
  clientName,
  proName,
  date,
  slot,
  daysUntil,
}) {
  const slotLabel = slot === "morning" ? "matin" : "après-midi";
  return {
    subject: `Rappel — Accordage dans ${daysUntil} jour${daysUntil > 1 ? "s" : ""}`,
    html: `<h2>Rappel de votre rendez-vous</h2>
<p>Bonjour ${clientName},</p>
<p>Votre accordage avec <strong>${proName}</strong> est dans <strong>${daysUntil} jour${daysUntil > 1 ? "s" : ""}</strong> (${date}, ${slotLabel}).</p>
<p>À bientôt,<br>L'équipe EasyPiano</p>`,
  };
}

export function buildReviewInvitationEmail({ clientName, proName, bookingId }) {
  return {
    subject: "Comment s'est passé votre accordage ?",
    html: `<h2>Votre avis compte</h2>
<p>Bonjour ${clientName},</p>
<p>Votre accordage avec <strong>${proName}</strong> est terminé. Qu'en avez-vous pensé ?</p>
<p><a href="https://easypiano.ch/review/${bookingId}">Laisser un avis</a></p>
<p>Merci,<br>L'équipe EasyPiano</p>`,
  };
}

export function buildAnnualReminderEmail({ clientName }) {
  return {
    subject: "Votre piano a été accordé il y a 11 mois",
    html: `<h2>Il est temps d'accorder votre piano</h2>
<p>Bonjour ${clientName},</p>
<p>Votre dernier accordage remonte à <strong>11 mois</strong>. Les experts recommandent un accordage annuel.</p>
<p><a href="https://easypiano.ch/search">Réserver un accordeur</a></p>
<p>À bientôt,<br>L'équipe EasyPiano</p>`,
  };
}
