const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch(); const out={};
 for(const mode of ['skeleton','flickerless']){
  const p=await b.newPage({viewport:{width:1440,height:1000}});
  await p.addInitScript(()=>{window.__ls=0;new PerformanceObserver(l=>{for(const e of l.getEntries())window.__ls+=e.value}).observe({type:'layout-shift'});});
  await p.goto('http://localhost:3111/'); await p.waitForTimeout(800);
  await p.getByRole('button',{name:/Facturación/}).click(); await p.waitForTimeout(500);
  await p.getByRole('button',{name:new RegExp(mode==='skeleton'?'Skeleton Tradicional':'Modo Flickerless')}).click();
  await p.getByRole('button',{name:/^800ms$/}).click(); await p.waitForTimeout(500);
  const before=await p.evaluate(()=>window.__ls);
  for(let i=0;i<3;i++){await p.getByRole('button',{name:/Simular Recarga/}).click(); await p.waitForTimeout(2000);}
  await p.getByRole('button',{name:/Carga en Frío/}).click(); await p.waitForTimeout(2000);
  const hud=await p.locator('section').first().innerText();
  const ind=(await p.evaluate(()=>window.__ls))-before;
  out[mode]={hud:hud.replace(/\n+/g,' | '),independientePerformanceObserver:+ind.toFixed(4)};
  await p.screenshot({path:`hud_${mode}.png`,clip:{x:0,y:0,width:1440,height:300}});
  await p.close();
 }
 await b.close(); console.log(JSON.stringify(out,null,1));
})();
