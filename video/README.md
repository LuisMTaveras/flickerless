# Video: Flickerless vs Skeleton

- `flickerless-vs-skeleton.mp4` — 159 s, 1080p, voz en español (Kokoro `em_alex`, TTS local) + música ambiental.
- `scenes.html` + `timing.js` + `render.js` — animación determinista (HTML) renderizada cuadro a cuadro con Playwright; ffmpeg la une con el audio.
- `tts/narrate.py` — guion, síntesis de voz y línea de tiempo (las escenas se sincronizan con la duración real de cada frase).
- `cls/` — medición real de CLS (Playwright + `PerformanceObserver('layout-shift')`) sobre `playground/`, con skeleton y Flickerless. Resultados en `cls.json` / `below.json`.

Resultado (latencia 800 ms, media de 3 corridas): recarga Skeleton 0.006 vs Flickerless 0.000; primera carga Skeleton 0.006 vs Flickerless 0.0145.

## Versión vertical (Reels / TikTok)

`vertical/flickerless-vertical.mp4` — 1080×1920, 73 s. Guion propio más corto; subtítulos dentro de la zona segura de las apps. Fuente: `vertical/vertical.html`, `timing_v.js`, `narrate_v.py`, `render_v.js`.
