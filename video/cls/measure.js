const {chromium}=require('playwright');
const URL='http://localhost:3111/';
const scenarios=[];
for(const mode of ['skeleton','flickerless']) for(const action of ['reload','cold']) for(const lat of [150,400,800,1500]) scenarios.push({mode,action,lat});
(async()=>{
 const b=await chromium.launch(); const out=[];
 for(const sc of scenarios){
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  await p.addInitScript(()=>{window.__ls=[];new PerformanceObserver(l=>{for(const e of l.getEntries())window.__ls.push({v:e.value,inp:e.hadRecentInput,t:e.startTime})}).observe({type:'layout-shift',buffered:true});});
  await p.goto(URL); await p.waitForTimeout(800);
  await p.getByRole('button',{name:/Facturación/}).click(); await p.waitForTimeout(800);
  await p.getByRole('button',{name:new RegExp(sc.mode==='skeleton'?'Skeleton Tradicional':'Modo Flickerless')}).click();
  await p.getByRole('button',{name:new RegExp(`^${sc.lat}ms$`)}).click(); await p.waitForTimeout(800);
  await p.evaluate(()=>{window.__ls.length=0});
  const label=sc.action==='reload'?/Simular Recarga/:/Carga en Frío/;
  await p.getByRole('button',{name:label}).click();
  await p.waitForTimeout(sc.lat+1200);
  const ls=await p.evaluate(()=>window.__ls);
  const sum=(a)=>+a.reduce((s,e)=>s+e.v,0).toFixed(4);
  out.push({...sc,shifts:ls.length,clsAll:sum(ls),clsCounted:sum(ls.filter(e=>!e.inp))});
  await p.close();
 }
 await b.close();
 console.log(JSON.stringify(out,null,1));
 require('fs').writeFileSync(__dirname+'/cls.json',JSON.stringify(out,null,1));
 console.table(out);
})();
