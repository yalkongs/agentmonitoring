// A rotating, projected particle sphere. All motion represents synthetic traffic.
export function startNetwork(canvas: HTMLCanvasElement, running:()=>boolean) {
 const ctx=canvas.getContext('2d')!;
 let w=0,h=0,frame=0,time=0,last=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const points=Array.from({length:420},(_,i)=>{const y=1-i/419*2;const r=Math.sqrt(1-y*y);const phi=i*2.399963;return {x:Math.cos(phi)*r,y,z:Math.sin(phi)*r};});
 const resize=new ResizeObserver(()=>{const b=canvas.getBoundingClientRect();w=b.width;h=b.height;const dpr=Math.min(devicePixelRatio,2);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);});resize.observe(canvas);
 function draw(now:number) {
 frame=requestAnimationFrame(draw);if(now-last<32)return;const dt=Math.min(now-last,60);last=now;if(running()&&!reduced)time+=dt*.00009;
 ctx.clearRect(0,0,w,h);const cx=w*.5,cy=h*.47,r=Math.min(w*.215,h*.43);
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.7);glow.addColorStop(0,'rgba(38,218,185,.09)');glow.addColorStop(.6,'rgba(21,139,132,.04)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(cx,cy);ctx.rotate(-.25);[1.15,1.45,1.72].forEach((k,i)=>{ctx.beginPath();ctx.ellipse(0,0,r*k,r*k*.34,0,0,Math.PI*2);ctx.strokeStyle=`rgba(67,185,178,${.15-i*.025})`;ctx.lineWidth=1;ctx.stroke();});ctx.restore();
 const projected=points.map(p=>{const x=p.x*Math.cos(time)+p.z*Math.sin(time),z=-p.x*Math.sin(time)+p.z*Math.cos(time);return {x:cx+x*r,y:cy+(p.y*.97+z*.14)*r,z};});
 for(let i=0;i<projected.length;i++){const p=projected[i];if(p.z<-.65)continue;for(let j=i+1;j<Math.min(projected.length,i+26);j++){const q=projected[j];const dist=Math.hypot(p.x-q.x,p.y-q.y);if(dist<r*.19&&Math.abs(p.z-q.z)<.35){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(48,206,181,${(.025+(p.z+1)*.045)*(1-dist/(r*.22))})`;ctx.stroke();}}ctx.beginPath();ctx.arc(p.x,p.y,p.z>.4?1.5:.85,0,Math.PI*2);ctx.fillStyle=`rgba(78,237,206,${.18+(p.z+1)*.29})`;ctx.fill();}
 const destinations=[[.18,.22],[.18,.52],[.28,.83],[.72,.83],[.82,.52],[.82,.22],[.5,.08],[.07,.75],[.93,.75],[.5,.94]];
 destinations.forEach(([dx,dy],i)=>{const ex=dx*w,ey=dy*h;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+(ex-cx)*.3,ey,ex,ey);ctx.strokeStyle=i%3===0?'rgba(115,153,251,.22)':'rgba(66,222,191,.16)';ctx.stroke();let t=(time*.7+i*.173)%1;const px=(1-t)**2*cx+2*(1-t)*t*(cx+(ex-cx)*.3)+t*t*ex;const py=(1-t)**2*cy+2*(1-t)*t*ey+t*t*ey;ctx.beginPath();ctx.arc(px,py,2.4,0,Math.PI*2);ctx.fillStyle=i%3===0?'#88a8ff':'#7fffe0';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;});
 }
 frame=requestAnimationFrame(draw);return ()=>{cancelAnimationFrame(frame);resize.disconnect();};
}
