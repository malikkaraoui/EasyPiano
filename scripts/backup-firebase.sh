#!/bin/bash
# Backup Firebase Realtime Database
# Usage: ./scripts/backup-firebase.sh
# Prérequis: firebase-tools installé, authentifié (firebase login)
#
# Ce script exporte la base RTDB dans un fichier JSON horodaté.
# À exécuter quotidiennement (cron ou CI) pour NFR-R4.

set -euo pipefail

PROJECT_ID="${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-easypiano-1c50c}"
BACKUP_DIR="backups"
DATE=$(date +%Y-%m-%d_%H-%M)
FILENAME="${BACKUP_DIR}/firebase-rtdb-${DATE}.json"

mkdir -p "$BACKUP_DIR"

echo "Export Firebase RTDB du projet ${PROJECT_ID}..."
npx firebase-tools database:get / \
  --project "$PROJECT_ID" \
  > "$FILENAME"

echo "Backup sauvegardé : ${FILENAME}"
echo "Taille : $(wc -c < "$FILENAME") octets"
