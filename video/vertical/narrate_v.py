import json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
# (scene, [(spoken, [subtitle chunks])...], tail)
SCRIPT=[
 ('hook',[("¿Tu tabla parpadea cada vez que filtras? Tiene arreglo.",["¿Tu tabla <mark>parpadea</mark>","cada vez que filtras?","Tiene <mark>arreglo</mark>."])],0.8),
 ('reload',[
  ("Un usuario cambia el filtro.",["El usuario <mark>cambia el filtro</mark>"]),
  ("Con un skeleton, lo que mirabas desaparece y salen cajas grises. Con Flickerless, las filas se quedan, solo atenuadas.",["<r>Skeleton</r>: lo que mirabas desaparece","y salen cajas grises","<g>Flickerless</g>: las filas se quedan,","solo atenuadas"]),
  ("Llegan los datos. El skeleton salta. Flickerless no se mueve.",["Llegan los datos…","<r>Skeleton: salta</r>","<g>Flickerless: no se mueve</g>"]),
 ],0.8),
 ('fast',[
  ("Ahora, una respuesta rápida: ciento cincuenta milisegundos.",["Respuesta rápida:","<mark>150 ms</mark>"]),
  ("En cámara lenta, el skeleton borra todo por un instante. Es un parpadeo que se nota.",["En cámara lenta,","<r>el skeleton borra todo</r>","un parpadeo que se nota"]),
  ("Flickerless espera ciento ochenta milisegundos. Si la respuesta llega antes, no muestra nada.",["<g>Flickerless espera 180 ms</g>","Si llega antes,","no muestra nada"]),
 ],0.8),
 ('cold',[
  ("Primera carga: todavía no hay datos.",["Primera carga:","todavía no hay datos"]),
  ("El skeleton muestra cero pesos: una cifra falsa. Flickerless muestra un marcador neutro: el dato aún está pendiente.",["<r>Skeleton: $0.00</r>","¡una cifra falsa!","<g>Flickerless: marcador neutro</g>","el dato está pendiente"]),
 ],2.2),
 ('measured',[
  ("Medido con Playwright, en recargas: Flickerless, cero. Skeleton, cero coma cero cero seis.",["Medido con <mark>Playwright</mark>","Recargas:","Flickerless <g>0.000</g>","Skeleton <r>0.006</r>"]),
  ("En la primera carga, el skeleton gana por poco. Ambos están muy por debajo del umbral. Lo que cambia es lo que el usuario ve.",["Primera carga:","Skeleton gana por poco","Ambos, bajo el umbral de <mark>0.1</mark>","Lo que cambia es lo que se ve"]),
 ],0.8),
 ('outro',[
  ("Flickerless. Código abierto, para Vue, React y React Native. El enlace, en la bio.",["<g>Flickerless</g>","Código abierto","Vue · React · React Native","Link en la bio"])],2.0),
]
PHON=[(r'Flickerless','Flíkerles'),(r'[Ss]keleton','eskéleton'),(r'Playwright','Pleirait'),(r'React Native','Riáct Néitiv'),(r'React','Riáct'),(r'Vue','Viu')]
def phon(t):
    for a,b in PHON: t=re.sub(a,b,t)
    return t
plain=lambda h: re.sub(r'<[^>]+>','',h)
k=Kokoro('kokoro.onnx','voices.bin'); SR=24000
GAP=0.35; PRE=0.3
t=0.0; timing={'scenes':[]}; chunks=[]
for sid,segs,tail in SCRIPT:
    t0=t; local=PRE; out=[]
    for spoken,subs in segs:
        parts=[p.strip() for p in re.split(r'(?<=[.:?!])\s+',phon(spoken)) if p.strip()]
        pieces=[]
        for p in parts:
            a_,_=k.create(p,voice='em_alex',speed=1.0,lang='es'); pieces.append(np.asarray(a_,dtype=np.float32)); pieces.append(np.zeros(int(.18*SR),dtype=np.float32))
        s=np.concatenate(pieces[:-1]); d=len(s)/SR
        w=[max(4,len(plain(c))) for c in subs]; tot=sum(w); acc=0; ch=[]
        for c,wi in zip(subs,w):
            acc+=wi; ch.append({'t':c,'b':round(local+d*acc/tot,3)})
        out.append({'a':round(local,3),'b':round(local+d,3),'chunks':ch})
        chunks.append((t0+local,s)); local+=d+GAP
    dur=round(local-GAP+tail,3)
    timing['scenes'].append({'id':sid,'t0':round(t0,3),'d':dur,'segs':out}); t+=dur
timing['total']=round(t,3)
buf=np.zeros(int((t+1)*SR),dtype=np.float32)
for st,s in chunks:
    i=int(st*SR); buf[i:i+len(s)]+=s
sf.write('narration_v.wav',buf,SR)
import os; os.makedirs('../video_v',exist_ok=True)
open('../video_v/timing_v.js','w').write('window.TIMING='+json.dumps(timing,ensure_ascii=False)+';')
print(json.dumps({s['id']:(s['t0'],s['d']) for s in timing['scenes']}), timing['total'])
