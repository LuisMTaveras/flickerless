# Windows 10/11 (PowerShell como administrador). Ejecutar desde la raíz del repo:
#   powershell -ExecutionPolicy Bypass -File video\setup\setup.ps1
$ErrorActionPreference = "Stop"
winget install -e --id OpenJS.NodeJS.LTS
winget install -e --id Python.Python.3.12
winget install -e --id Gyan.FFmpeg
winget install -e --id Git.Git
winget install -e --id Audacity.Audacity
# Recarga el PATH en esta sesión
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
corepack enable
pnpm install
npx playwright install chromium
python -m venv video\.venv
& video\.venv\Scripts\python.exe -m pip install --upgrade pip
& video\.venv\Scripts\python.exe -m pip install -r video\setup\requirements.txt
Write-Host "`nComprobación:"; node -v; pnpm -v; ffmpeg -version | Select-Object -First 1
& video\.venv\Scripts\python.exe -c "import edge_tts, faster_whisper; print('voz + whisper OK')"
Write-Host "Fuentes (manual, 1 minuto): instala Inter (rsms.me/inter) y JetBrains Mono (jetbrains.com/lp/mono)."
Write-Host "Listo. Activa el entorno con:  video\.venv\Scripts\Activate.ps1"
