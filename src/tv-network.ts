/** Synthetic network scenery. Precomputed geometry keeps the TV renderer bounded. */
export const tvNodePositions = [[.13,.20],[.09,.46],[.17,.73],[.31,.89],[.69,.89],[.87,.20],[.91,.46],[.83,.73],[.5,.96],[.5,.055]];
export function startTVNetwork(canvas:HTMLCanvasElement,active:()=>number,moving:()=>boolean,reduced:()=>boolean){
 const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const points=Array.from({length:580},(_,i)=>{const y=1-i/579*2,r=Math.sqrt(1-y*y),a=i*2.399963;return {x:Math.cos(a)*r,y,z:Math.sin(a)*r};});
 const edges:number[][]=[];
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const p=points[i],q=points[j];if(Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)<.205)edges.push([i,j]);}
 let w=0,h=0,frame=0,last=0,time=1.2,dirty=true,priorActive=-1;
 const observer=new ResizeObserver(()=>{const box=canvas.getBoundingClientRect();w=box.width;h=box.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;});observer.observe(canvas);
 const pointOn=(t:number,cx:number,cy:number,ex:number,ey:number)=>({x:(1-t)**2*cx+2*(1-t)*t*(cx+(ex-cx)*.44)+t*t*ex,y:(1-t)**2*cy+2*(1-t)*t*(cy+(ey-cy)*1.17)+t*t*ey});
 const render=(now:number)=>{
  frame=requestAnimationFrame(render);if(now-last<32)return;const dt=Math.min(now-last,64);last=now;
  const animate=moving()&&!reduced()&&!document.hidden;
  if(!animate&&!dirty&&active()===priorActive)return;
  if(animate)time+=dt*.000105;dirty=false;priorActive=active();if(!w||!h)return;
  ctx.clearRect(0,0,w,h);const cx=w/2,cy=h*.49,r=Math.min(w*.255,h*.405);
  const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.6);glow.addColorStop(0,'rgba(19,101,105,.16)');glow.addColorStop(.55,'rgba(25,207,177,.06)');glow.addColorStop(1,'rgba(8,15,25,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  for(let i=0;i<75;i++){const x=((i*193)%1000)/1000*w,y=((i*373)%1000)/1000*h;ctx.fillStyle=`rgba(107,176,193,${.11+((i*7)%4)*.06})`;ctx.fillRect(x,y,1,1);}
  // Two energy orbits carry the internal and external inference traffic.
  [1.19,1.43].forEach((scale,i)=>{ctx.save();ctx.translate(cx,cy);ctx.rotate(i===0?-.31:.28);ctx.beginPath();ctx.ellipse(0,0,r*scale,r*scale*.38,0,0,Math.PI*2);ctx.strokeStyle=i?'rgba(112,153,251,.25)':'rgba(60,223,189,.3)';ctx.lineWidth=1;ctx.stroke();const start=time*(i?-.55:.7)+i*2.2;ctx.beginPath();ctx.ellipse(0,0,r*scale,r*scale*.38,0,start,start+.64);ctx.strokeStyle=i?'#8aafff':'#79ffe1';ctx.lineWidth=2.5;ctx.shadowColor=ctx.strokeStyle;ctx.shadowBlur=12;ctx.stroke();ctx.restore();});
  const yaw=time*.27,tilt=-.13;
  const projected=points.map(p=>{const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw);return {x:cx+x*r,y:cy+(p.y*Math.cos(tilt)-z*Math.sin(tilt))*r,z:p.y*Math.sin(tilt)+z*Math.cos(tilt)};});
  ctx.lineWidth=.6;
  for(const [a,b] of edges){const p=projected[a],q=projected[b];if(p.z<-.55||q.z<-.55)continue;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(49,217,185,${.03+(p.z+1)*.07})`;ctx.stroke();}
  for(const p of projected){ctx.beginPath();ctx.arc(p.x,p.y,p.z>.35?1.6:.9,0,Math.PI*2);ctx.fillStyle=`rgba(99,249,215,${.14+(p.z+1)*.34})`;ctx.fill();}
  // A gradual circular sweep reads as activity without flashing the entire screen.
  ctx.beginPath();ctx.arc(cx,cy,r*1.08,time*.5,time*.5+Math.PI*.7);ctx.strokeStyle='rgba(62,228,193,.25)';ctx.lineWidth=1;ctx.stroke();
  tvNodePositions.forEach(([dx,dy],i)=>{const ex=dx*w,ey=dy*h,selected=i===active();ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+(ex-cx)*.44,cy+(ey-cy)*1.17,ex,ey);ctx.strokeStyle=selected?'rgba(108,255,217,.6)':'rgba(67,180,172,.16)';ctx.lineWidth=selected?1.4:.8;ctx.stroke();
   for(let packet=0;packet<(selected?4:2);packet++){const t=(time*.4+packet*.28+i*.177)%1;for(let trail=7;trail>=0;trail--){const at=t-trail*.006;if(at<0)continue;const p=pointOn(at,cx,cy,ex,ey);ctx.beginPath();ctx.arc(p.x,p.y,selected?2.4:1.5,0,Math.PI*2);ctx.fillStyle=i%3===0?`rgba(134,173,255,${(1-trail/8)*.9})`:`rgba(120,255,214,${(1-trail/8)*.95})`;ctx.fill();}}
   if(selected){const beat=(time*.8)%1;ctx.beginPath();ctx.arc(ex,ey,5+beat*19,0,Math.PI*2);ctx.strokeStyle=`rgba(91,248,199,${(1-beat)*.55})`;ctx.lineWidth=1;ctx.stroke();}
  });
 };
 frame=requestAnimationFrame(render);return ()=>{cancelAnimationFrame(frame);observer.disconnect();};
}
