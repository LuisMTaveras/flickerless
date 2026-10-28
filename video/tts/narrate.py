import json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
# (scene, [ (subtitle html, spoken text) ... ], tail seconds)
SCRIPT=[
 ('title',[("Flickerless contra Skeleton.<br>¿Por qué tus datos no deberían <mark>parpadear</mark>?","Flickerless contra Skeleton. ¿Por qué tus datos no deberían parpadear?")],1.2),
 ('reload',[
  ("Una tabla de facturas. El usuario <mark>cambia el filtro</mark>.","Imagina una tabla de facturas. El usuario cambia el filtro."),
  ("<r>Skeleton</r>: lo que mirabas desaparece y salen cajas grises.<br><g>Flickerless</g>: las filas se quedan, atenuadas, con una barra de 2 px.","Con un skeleton, lo que estabas mirando desaparece, y salen cajas grises. Con Flickerless, las filas se quedan ahí, solo atenuadas, con una barra fina de dos píxeles arriba."),
  ("Llegan los datos. <r>El skeleton cambia de tamaño y la pantalla salta.</r><br><g>Flickerless: no se mueve nada.</g>","Llegan los datos nuevos. En el skeleton, la tabla cambia de tamaño y la pantalla salta. En Flickerless, no se mueve nada."),
 ],1.0),
 ('fast',[
  ("Una respuesta <mark>rápida</mark>: solo 150 ms.","Ahora, una respuesta rápida: solo ciento cincuenta milisegundos."),
  ("En cámara lenta: <r>el skeleton borra todo y pinta cajas grises.</r><br>Un parpadeo que el usuario sí nota.","Míralo en cámara lenta. El skeleton borra todo y pinta cajas grises durante un instante. Es un parpadeo que el usuario sí nota."),
  ("<g>Flickerless espera 180 ms.</g><br>Si la respuesta llega antes, no enseña nada.","Flickerless espera ciento ochenta milisegundos antes de mostrar nada. Si la respuesta llega antes, no enseña nada."),
 ],1.0),
 ('cold',[
  ("La <mark>primera carga</mark>. Todavía no hay datos.","La primera carga. Todavía no hay datos."),
  ("<r>Skeleton: $0.00 y “0 registros”. Cifras falsas.</r><br><g>Flickerless: “—”. Aún no se sabe.</g>","El skeleton enseña cero pesos, y cero registros. Son cifras falsas. Flickerless enseña una raya: todavía no se sabe."),
  ("En finanzas, un cero no es un hueco: <mark>es un dato falso</mark>.","En una pantalla de finanzas, un cero no es un hueco. Es un dato falso."),
 ],1.0),
 ('maint',[
  ("Con skeleton, cada pantalla tiene <mark>dos versiones</mark>: la real y la maqueta gris.","Mantenimiento. Con un skeleton, cada pantalla tiene dos versiones que mantener: la real, y la maqueta gris."),
  ("Producto pide una columna nueva: <mark>IVA</mark>.<br><r>La maqueta se queda vieja.</r>","Producto pide una columna nueva: IVA. Se actualiza la pantalla, pero la maqueta se queda vieja."),
  ("<g>En Flickerless la estructura real es la maqueta.</g><br>Una sola propiedad: <mark>cols</mark>.","Con Flickerless, la estructura real es la maqueta. Basta una propiedad: columnas."),
 ],1.0),
 ('measured',[
  ("Ahora, <mark>medido de verdad</mark> con Playwright en el playground del repositorio.","Ahora lo medido de verdad, con Pleirait, en el playground del repositorio."),
  ("<b>Recargas</b>: Flickerless <g>0.000</g> · Skeleton <r>0.006</r>","En recargas, Flickerless da cero de ce ele ese. El skeleton, cero coma cero cero seis."),
  ("<b>Primera carga</b>: Flickerless <r>0.015</r> · Skeleton <g>0.006</g>","En la primera carga, es al revés: Flickerless da cero coma cero quince, y el skeleton, cero coma cero cero seis."),
  ("Los dos están muy por debajo del umbral <mark>0.1</mark>.<br>La diferencia real está en lo que el usuario ve.","Los dos están muy por debajo del umbral bueno, de cero coma uno. La diferencia real está en lo que el usuario ve."),
 ],1.0),
 ('score',[
  ("Cinco diferencias que el usuario <mark>sí siente</mark>.","En resumen: cinco diferencias que el usuario sí siente."),
  ("Para <mark>tablas y paneles de negocio</mark>, Flickerless evita el parpadeo, conserva lo que había, no inventa ceros y no pide una maqueta aparte.","Para tablas y paneles de negocio, Flickerless evita el parpadeo, conserva lo que había, no inventa ceros, y no pide una maqueta aparte."),
 ],1.0),
 ('outro',[
  ("<g>Flickerless</g>: lo que ya estaba se queda; lo que aún no existe es “—”.","Flickerless. Lo que ya estaba se queda. Lo que aún no existe, es una raya."),
  ("Para <mark>Vue, React y React Native</mark>.","Disponible para Vue, React y React Native."),
 ],2.5),
]
k=Kokoro('kokoro.onnx','voices.bin'); SR=24000
GAP=0.45; PRE=0.5
t=0.0; timing={'scenes':[]}; chunks=[]
for sid,segs,tail in SCRIPT:
    t0=t; local=PRE; out=[]
    for sub,spoken in segs:
        s,_=k.create(spoken,voice='em_alex',speed=1.0,lang='es')
        s=np.asarray(s,dtype=np.float32); d=len(s)/SR
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
