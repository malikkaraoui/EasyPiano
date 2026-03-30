/* global Buffer */
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getEncryptionKey() {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("[Encryption] ENCRYPTION_KEY non définie");
  }
  return Buffer.from(key, "hex");
}

/**
 * Chiffre une adresse en AES-256-GCM.
 * Retourne une string base64 contenant IV + ciphertext + auth tag.
 *
 * @param {string} plaintext - L'adresse en clair
 * @returns {string} - Données chiffrées en base64
 */
export function encryptAddress(plaintext) {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plaintext, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const tag = cipher.getAuthTag();

  const combined = Buffer.concat([iv, encrypted, tag]);
  return combined.toString("base64");
}

/**
 * Déchiffre une adresse chiffrée en AES-256-GCM.
 *
 * @param {string} encryptedBase64 - Données chiffrées en base64
 * @returns {string} - L'adresse en clair
 */
export function decryptAddress(encryptedBase64) {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedBase64, "base64");

  const iv = combined.subarray(0, IV_LENGTH);
  const tag = combined.subarray(combined.length - TAG_LENGTH);
  const encrypted = combined.subarray(IV_LENGTH, combined.length - TAG_LENGTH);

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}
