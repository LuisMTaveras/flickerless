const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(); const out=[];
 for(const below of [false,true]) for(const mode of ['skeleton','flickerless']) for(const action of ['reload','cold']) for(let rep=0;rep<3;rep++){
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  await p.addInitScript(()=>{window.__ls=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__ls.push(e.value)}).observe({type:'layout-shift',buffered:true});});
  await p.goto('http://localhost:3111/'); await p.waitForTimeout(800);
  await p.getByRole('button',{name:/Facturación/}).click(); await p.waitForTimeout(600);
  await p.getByRole('button',{name:new RegExp(mode==='skeleton'?'Skeleton Tradicional':'Modo Flickerless')}).click();
  await p.getByRole('button',{name:/^800ms$/}).click(); await p.waitForTimeout(600);
  if(below) await p.evaluate(()=>{const m=document.querySelector('main');const d=document.createElement('div');d.style.cssText='height:380px;margin-top:20px;border:1px solid #444;padding:20px;font-size:18px';d.textContent='Contenido debajo de la tabla (resumen, gráficos, pie de página…)';m.after(d);});
  await p.evaluate(()=>{window.__ls.length=0});
  await p.getByRole('button',{name:action==='reload'?/Simular Recarga/:/Carga en Frío/}).click();
  await p.waitForTimeout(2200);
  const v=await p.evaluate(()=>window.__ls.reduce((a,b)=>a+b,0));
  out.push({below,mode,action,v}); await p.close();
 }
 await b.close();
 const g={};for(const o of out){const k=`${o.below?'con contenido debajo':'playground tal cual'} | ${o.mode} | ${o.action}`;(g[k]=g[k]||[]).push(o.v)}
 const res={};for(const k in g){res[k]=+(g[k].reduce((a,b)=>a+b,0)/g[k].length).toFixed(4)}
 console.log(JSON.stringify(res,null,1)); require('fs').writeFileSync(__dirname+'/below.json',JSON.stringify(res,null,1));
})();
