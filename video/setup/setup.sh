#!/usr/bin/env bash
# macOS (Homebrew) y Linux (apt). Ejecutar desde la raíz del repo:  bash video/setup/setup.sh
set -euo pipefail
OS="$(uname -s)"
if [ "$OS" = "Darwin" ]; then
  command -v brew >/dev/null || { echo "Instala Homebrew primero: https://brew.sh"; exit 1; }
  brew install node@22 python@3.12 ffmpeg git
  brew install --cask audacity font-inter font-jetbrains-mono
else
  sudo apt-get update
  sudo apt-get install -y ffmpeg git python3 python3-venv python3-pip fonts-inter fonts-jetbrains-mono audacity curl
  command -v node >/dev/null || { curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt-get install -y nodejs; }
fi
corepack enable
pnpm install
npx playwright install --with-deps chromium
python3 -m venv video/.venv
# shellcheck disable=SC1091
source video/.venv/bin/activate
pip install --upgrade pip
pip install -r video/setup/requirements.txt
echo; echo "Comprobación:"; node -v; pnpm -v; ffmpeg -version | head -1; python -c "import edge_tts, faster_whisper; print('voz + whisper OK')"
echo "Listo. Activa el entorno con:  source video/.venv/bin/activate"
