import json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
# (scene, [ (subtitle html, spoken text) ... ], tail seconds)
SCRIPT=[
 ('title',[("Flickerless frente a Skeleton.<br>¿Por qué tus datos no deberían <mark>parpadear</mark>?","Flickerless frente a Skeleton. Dos formas de cargar datos, y una diferencia que el usuario siente: el parpadeo.")],1.2),
 ('reload',[
  ("Una tabla de facturas. El usuario <mark>cambia el filtro</mark>.","Tomemos una tabla de facturas. El usuario cambia el filtro."),
  ("<r>Skeleton</r>: lo que mirabas desaparece y salen cajas grises.<br><g>Flickerless</g>: las filas se quedan, atenuadas, con una barra de 2 px.","Con un skeleton, lo que estaba mirando desaparece, y es reemplazado por cajas grises. Con Flickerless, las filas permanecen en pantalla, atenuadas, con una barra de dos píxeles en la parte superior."),
  ("Llegan los datos. <r>El skeleton cambia de tamaño y la pantalla salta.</r><br><g>Flickerless: no se mueve nada.</g>","Cuando llegan los datos nuevos, la tabla del skeleton cambia de tamaño, y la pantalla salta. En Flickerless, nada se mueve."),
 ],1.0),
 ('fast',[
  ("Una respuesta <mark>rápida</mark>: apenas 150 ms.","Ahora, una respuesta rápida: apenas ciento cincuenta milisegundos."),
  ("En cámara lenta: <r>el skeleton borra todo y pinta cajas grises.</r><br>Un parpadeo que el usuario sí percibe.","En cámara lenta se aprecia el problema: el skeleton borra el contenido y pinta cajas grises por un instante. Es un parpadeo que el usuario sí percibe."),
  ("<g>Flickerless aplica un umbral de 180 ms.</g><br>Si la respuesta llega antes, no muestra nada.","Flickerless aplica un umbral de ciento ochenta milisegundos. Si la respuesta llega antes, simplemente no muestra nada."),
 ],1.0),
 ('cold',[
  ("La <mark>primera carga</mark>: todavía no hay datos.","Veamos ahora la primera carga, cuando todavía no hay datos."),
  ("<r>Skeleton: $0.00 y “0 registros”. Cifras falsas.</r><br><g>Flickerless: “—”. El dato aún no se conoce.</g>","El skeleton muestra cero pesos y cero registros: cifras falsas. Flickerless muestra un guion, porque el dato aún no se conoce."),
  ("En finanzas, un cero no es un espacio vacío: <mark>es un dato incorrecto</mark>.","En una pantalla financiera, un cero no es un espacio vacío. Es un dato incorrecto."),
 ],1.0),
 ('maint',[
  ("Con skeleton, cada pantalla tiene <mark>dos versiones</mark>: la real y la maqueta gris.","Pasemos al mantenimiento. Con un skeleton, cada pantalla tiene dos versiones que mantener: la real, y la maqueta gris."),
  ("Producto pide una columna nueva: <mark>IVA</mark>.<br><r>La maqueta queda desfasada.</r>","Producto pide una columna nueva, el IVA. La pantalla se actualiza, pero la maqueta queda desfasada."),
  ("<g>En Flickerless la estructura real es la maqueta.</g><br>Basta una propiedad: <mark>cols</mark>.","Con Flickerless, la estructura real es la maqueta. Basta con indicar el número de columnas."),
 ],1.0),
 ('measured',[
  ("Ahora, los números <mark>medidos de verdad</mark> con Playwright en el entorno de demostración del repositorio.","Ahora, los números reales, medidos con Playwright en el entorno de demostración del repositorio."),
  ("<b>Recargas</b>: Flickerless <g>0.000</g> · Skeleton <r>0.006</r>","En recargas, Flickerless obtiene cero de desplazamiento de diseño, el famoso ce ele ese. El skeleton, cero coma cero cero seis."),
  ("<b>Primera carga</b>: Flickerless <r>0.015</r> · Skeleton <g>0.006</g>","En la primera carga ocurre lo contrario: Flickerless marca cero coma cero quince, y el skeleton, cero coma cero cero seis."),
  ("Ambos están muy por debajo del umbral recomendado, <mark>0.1</mark>.<br>La diferencia real está en lo que el usuario ve.","Ambos están muy por debajo del umbral recomendado, de cero coma uno. La diferencia real está en lo que el usuario ve."),
 ],1.0),
 ('score',[
  ("Cinco diferencias que el usuario <mark>sí percibe</mark>.","En resumen, cinco diferencias que el usuario sí percibe."),
  ("Para <mark>tablas y paneles de negocio</mark>, Flickerless evita el parpadeo, conserva lo que había, no inventa ceros y no exige una maqueta aparte.","Para tablas y paneles de negocio, Flickerless evita el parpadeo, conserva lo que ya estaba en pantalla, no inventa ceros, y no exige mantener una maqueta aparte."),
 ],1.0),
 ('outro',[
  ("<g>Flickerless</g>: lo que ya estaba se queda; lo que aún no existe es “—”.","Flickerless. Lo que ya estaba, se queda. Lo que aún no existe, se muestra como un guion."),
  ("Disponible para <mark>Vue, React y React Native</mark>.","Disponible para Vue, React y React Native."),
 ],2.5),
]
import re
PHON=[(r'Flickerless','Flíkerles'),(r'[Ss]keleton','eskéleton'),(r'Playwright','Pleirait'),(r'React Native','Riáct Néitiv'),(r'React','Riáct'),(r'Vue','Viu')]
def phon(t):
    for a,b in PHON: t=re.sub(a,b,t)
    return t
k=Kokoro('kokoro.onnx','voices.bin'); SR=24000
GAP=0.45; PRE=0.5
t=0.0; timing={'scenes':[]}; chunks=[]
for sid,segs,tail in SCRIPT:
    t0=t; local=PRE; out=[]
    for sub,spoken in segs:
        parts=[p.strip() for p in re.split(r'(?<=[.:?!])\s+',phon(spoken)) if p.strip()]
        pieces=[]
        for p in parts:
            a_,_=k.create(p,voice='em_alex',speed=0.96,lang='es'); pieces.append(np.asarray(a_,dtype=np.float32)); pieces.append(np.zeros(int(.22*SR),dtype=np.float32))
        s=np.concatenate(pieces[:-1]); d=len(s)/SR
        out.append({'sub':sub,'a':round(local,3),'b':round(local+d,3)})
        chunks.append((t0+local,s)); local+=d+GAP
    dur=round(local-GAP+tail,3)
    timing['scenes'].append({'id':sid,'t0':round(t0,3),'d':dur,'segs':out}); t+=dur
timing['total']=round(t,3)
buf=np.zeros(int((t+1)*SR),dtype=np.float32)
for st,s in chunks:
    i=int(st*SR); buf[i:i+len(s)]+=s
sf.write('narration.wav',buf,SR)
open('../video/timing.js','w').write('window.TIMING='+json.dumps(timing,ensure_ascii=False)+';')
print(json.dumps({s['id']:(s['t0'],s['d']) for s in timing['scenes']}), timing['total'])
