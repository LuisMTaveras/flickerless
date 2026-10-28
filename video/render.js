const {chromium}=require('playwright'); const fs=require('fs');
const FPS=30, W=4;
(async()=>{
 fs.mkdirSync(__dirname+'/frames',{recursive:true});
 const b=await chromium.launch();
 const probe=await b.newPage({viewport:{width:1920,height:1080}});
 await probe.goto('file://'+__dirname+'/scenes.html');
 const total=await probe.evaluate(()=>TOTAL); const N=Math.round(total*FPS); await probe.close();
 console.log('frames',N,'dur',total);
 await Promise.all([...Array(W)].map(async(_,w)=>{
  const p=await b.newPage({viewport:{width:1920,height:1080}});
  await p.goto('file://'+__dirname+'/scenes.html');
  for(let i=w;i<N;i+=W){
   await p.evaluate(t=>render(t),i/FPS);
   await p.screenshot({path:`${__dirname}/frames/f${String(i).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});
  }
 }));
 await b.close();
})();
