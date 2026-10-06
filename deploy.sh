#!/usr/bin/env bash
# Update server dengan satu perintah:  ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Ambil kode terbaru"
git fetch origin
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "    Ada perubahan lokal di server -> disimpan ke stash"
  git stash push -m "server-lokal-$(date +%F-%H%M)" >/dev/null
fi
git pull --ff-only origin master
echo "    Commit: $(git log --oneline -1)"

mkdir -p frontend/public/cv
if [ ! -f frontend/public/cv/ZAKY_APRILIAN_CV.pdf ]; then
  echo "!!  PERINGATAN: CV belum ada di frontend/public/cv/ZAKY_APRILIAN_CV.pdf (tombol Download CV akan 404)"
fi

echo "==> Build & jalankan"
docker compose up -d --build --remove-orphans

echo "==> Tunggu server siap"
for i in $(seq 1 20); do
  if curl -fsS "http://127.0.0.1:${PORT:-3001}/api/health" >/dev/null 2>&1; then
    echo "    OK: server sehat"
    docker compose ps
    exit 0
  fi
  sleep 2
done

echo "!!  Server tidak merespons. Log terakhir:"
docker compose logs --tail 30 app
exit 1
