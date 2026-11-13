// A rotating, projected particle sphere. All motion represents synthetic traffic.
export function startNetwork(canvas: HTMLCanvasElement, running:()=>boolean) {
 const ctx=canvas.getContext('2d')!;
 let w=0,h=0,frame=0,time=0,last=0,dirty=true;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const points=Array.from({length:420},(_,i)=>{const y=1-i/419*2;const r=Math.sqrt(1-y*y);const phi=i*2.399963;return {x:Math.cos(phi)*r,y,z:Math.sin(phi)*r};});
 const resize=new ResizeObserver(()=>{const b=canvas.getBoundingClientRect();w=b.width;h=b.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;});resize.observe(canvas);
 function draw(now:number) {
 frame=requestAnimationFrame(draw);if(now-last<32)return;const dt=Math.min(now-last,60);last=now;
 const animate=running()&&!reduced.matches&&!document.hidden&&!document.querySelector('dialog[open]');
 if(!animate&&!dirty)return;if(animate)time+=dt*.00017;dirty=false;
 ctx.clearRect(0,0,w,h);const cx=w*.5,cy=h*.47,r=Math.min(w*.215,h*.43);
 const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.7);glow.addColorStop(0,'rgba(140,173,215,.07)');glow.addColorStop(.6,'rgba(95,128,169,.035)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 ctx.save();ctx.translate(cx,cy);ctx.rotate(-.25);[1.15,1.45,1.72].forEach((k,i)=>{ctx.beginPath();ctx.ellipse(0,0,r*k,r*k*.34,0,0,Math.PI*2);ctx.strokeStyle=`rgba(130,154,185,${.15-i*.025})`;ctx.lineWidth=1;ctx.stroke();const angle=time*(i%2?-4:3)+i*2;ctx.beginPath();ctx.ellipse(0,0,r*k,r*k*.34,0,angle,angle+.55);ctx.strokeStyle=i===1?'rgba(215,185,130,.8)':'rgba(174,203,242,.8)';ctx.lineWidth=2;ctx.stroke();});ctx.restore();
 const projected=points.map(p=>{const x=p.x*Math.cos(time)+p.z*Math.sin(time),z=-p.x*Math.sin(time)+p.z*Math.cos(time);return {x:cx+x*r,y:cy+(p.y*.97+z*.14)*r,z};});
 for(let i=0;i<projected.length;i++){const p=projected[i];if(p.z<-.65)continue;for(let j=i+1;j<Math.min(projected.length,i+26);j++){const q=projected[j];const dist=Math.hypot(p.x-q.x,p.y-q.y);if(dist<r*.19&&Math.abs(p.z-q.z)<.35){ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(128,159,199,${(.025+(p.z+1)*.045)*(1-dist/(r*.22))})`;ctx.stroke();}}ctx.beginPath();ctx.arc(p.x,p.y,p.z>.4?1.5:.85,0,Math.PI*2);ctx.fillStyle=`rgba(155,184,222,${.18+(p.z+1)*.29})`;ctx.fill();}
 const destinations=[[.18,.22],[.18,.52],[.28,.83],[.72,.83],[.82,.52],[.82,.22],[.5,.08],[.07,.75],[.93,.75],[.5,.94]];
 destinations.forEach(([dx,dy],i)=>{const ex=dx*w,ey=dy*h;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+(ex-cx)*.3,ey,ex,ey);ctx.strokeStyle=i%3===0?'rgba(215,185,130,.25)':'rgba(140,173,215,.2)';ctx.stroke();for(let packet=0;packet<2;packet++){const direction=packet? -1:1,phase=(time*1.5+i*.173+packet*.5)%1,t=packet?1-phase:phase;for(let trail=7;trail>=0;trail--){const at=t-direction*trail*.012;if(at<0||at>1)continue;const px=(1-at)**2*cx+2*(1-at)*at*(cx+(ex-cx)*.3)+at*at*ex,py=(1-at)**2*cy+2*(1-at)*at*ey+at*at*ey;ctx.beginPath();ctx.arc(px,py,2.5*(1-trail/10),0,Math.PI*2);ctx.fillStyle=`rgba(${i%3===0?'215,185,130':'182,204,235'},${(1-trail/8)*.9})`;ctx.fill();}}});
 }
 frame=requestAnimationFrame(draw);return ()=>{cancelAnimationFrame(frame);resize.disconnect();};
}
