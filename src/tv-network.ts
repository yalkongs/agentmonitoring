/** Synthetic network scenery; geometry is cached and motion is capped at 30fps. */
export const tvNodePositions = [[.13,.20],[.09,.46],[.17,.73],[.31,.89],[.69,.89],[.87,.20],[.91,.46],[.83,.73],[.5,.96],[.5,.055]];
export function startTVNetwork(canvas:HTMLCanvasElement,active:()=>number,moving:()=>boolean,reduced:()=>boolean){
 const ctx=canvas.getContext('2d');if(!ctx)return ()=>{};
 const points=Array.from({length:580},(_,i)=>{const y=1-i/579*2,r=Math.sqrt(1-y*y),a=i*2.399963;return {x:Math.cos(a)*r,y,z:Math.sin(a)*r};});
 const edges:number[][]=[];
 for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){const p=points[i],q=points[j];if(Math.hypot(p.x-q.x,p.y-q.y,p.z-q.z)<.205)edges.push([i,j]);}
 let w=0,h=0,frame=0,last=0,time=2,dirty=true,priorActive=-1;
 const observer=new ResizeObserver(()=>{const box=canvas.getBoundingClientRect();w=box.width;h=box.height;const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);dirty=true;});observer.observe(canvas);
 const pointOn=(t:number,cx:number,cy:number,ex:number,ey:number)=>({x:(1-t)**2*cx+2*(1-t)*t*(cx+(ex-cx)*.44)+t*t*ex,y:(1-t)**2*cy+2*(1-t)*t*(cy+(ey-cy)*1.17)+t*t*ey});
 const render=(now:number)=>{
  frame=requestAnimationFrame(render);if(now-last<32)return;const dt=Math.min(now-last,64);last=now;
  const animate=moving()&&!reduced()&&!document.hidden;
  if(!animate&&!dirty&&active()===priorActive)return;
  if(animate)time+=dt/1000;dirty=false;priorActive=active();if(!w||!h)return;
  ctx.clearRect(0,0,w,h);const cx=w/2,cy=h*.49,r=Math.min(w*.255,h*.405);
  const glow=ctx.createRadialGradient(cx,cy,r*.25,cx,cy,r*1.7);glow.addColorStop(0,'rgba(71,99,139,.04)');glow.addColorStop(.58,'rgba(108,142,190,.11)');glow.addColorStop(1,'rgba(13,17,23,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
  // Stable backdrop; activity is concentrated on meaningful connections.
  for(let i=0;i<75;i++){const x=((i*193)%1000)/1000*w,y=((i*373)%1000)/1000*h;ctx.fillStyle=`rgba(148,160,179,${.08+((i*7)%4)*.035})`;ctx.fillRect(x,y,1,1);}
  tvNodePositions.forEach(([dx,dy],i)=>{
   const ex=dx*w,ey=dy*h,selected=i===active(),rgb=i%3===0?'215,185,130':'174,203,242';
   ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo(cx+(ex-cx)*.44,cy+(ey-cy)*1.17,ex,ey);
   ctx.strokeStyle=selected?'rgba(188,211,242,.55)':'rgba(117,141,173,.24)';ctx.lineWidth=selected?1.5:.8;ctx.stroke();
   // Each path has an outbound and a returning stream, with a tapered wake.
   for(let packet=0;packet<(selected?4:2);packet++){
    const direction=packet%2===0?1:-1,phase=(time*(selected?.25:.19)+packet*.27+i*.177)%1,t=direction===1?phase:1-phase;
    for(let trail=10;trail>=0;trail--){
     const at=t-direction*trail*.009;if(at<0||at>1)continue;
     const p=pointOn(at,cx,cy,ex,ey),strength=1-trail/11;
     ctx.beginPath();ctx.arc(p.x,p.y,(selected?2.8:2)*(.35+strength*.65),0,Math.PI*2);
     ctx.fillStyle=`rgba(${rgb},${strength*(selected?.95:.7)})`;ctx.fill();
    }
    const head=pointOn(t,cx,cy,ex,ey);ctx.beginPath();ctx.arc(head.x,head.y,selected?1.5:1,0,Math.PI*2);ctx.fillStyle='#edf4ff';ctx.fill();
   }
   if(selected)for(let pulse=0;pulse<2;pulse++){
    const beat=(time*.55+pulse*.5)%1;ctx.beginPath();ctx.arc(ex,ey,5+beat*28,0,Math.PI*2);ctx.strokeStyle=`rgba(150,182,225,${(1-beat)*.5})`;ctx.lineWidth=1.3;ctx.stroke();
   }
  });
  const yaw=time*.16,tilt=-.13+Math.sin(time*.2)*.07;
  const projected=points.map(p=>{const x=p.x*Math.cos(yaw)+p.z*Math.sin(yaw),z=-p.x*Math.sin(yaw)+p.z*Math.cos(yaw);return {x:cx+x*r,y:cy+(p.y*Math.cos(tilt)-z*Math.sin(tilt))*r,z:p.y*Math.sin(tilt)+z*Math.cos(tilt)};});
  ctx.lineWidth=.65;
  for(const [a,b] of edges){const p=projected[a],q=projected[b];if(p.z<-.55||q.z<-.55)continue;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=`rgba(103,134,173,${.04+(p.z+1)*.09})`;ctx.stroke();}
  for(const p of projected){ctx.beginPath();ctx.arc(p.x,p.y,p.z>.35?1.7:.9,0,Math.PI*2);ctx.fillStyle=`rgba(155,182,218,${.14+(p.z+1)*.34})`;ctx.fill();}
  // Counter-rotating orbit comets have explicit heads and fading arc tails.
  [1.2,1.48].forEach((scale,i)=>{
   const rgb=i?'215,185,130':'159,198,244',direction=i?-1:1,start=time*(i?-.65:.8)+i*2.2;
   ctx.save();ctx.translate(cx,cy);ctx.rotate(i===0?-.35:.31);
   ctx.beginPath();ctx.ellipse(0,0,r*scale,r*scale*.38,0,0,Math.PI*2);ctx.strokeStyle=`rgba(${rgb},.25)`;ctx.lineWidth=1;ctx.stroke();
   for(let comet=0;comet<2;comet++){
    const head=start+comet*Math.PI;
    for(let tail=0;tail<20;tail++){
     const angle=head-direction*tail*.035;ctx.beginPath();ctx.ellipse(0,0,r*scale,r*scale*.38,0,angle,angle+direction*.038,direction<0);ctx.strokeStyle=`rgba(${rgb},${(1-tail/20)*.9})`;ctx.lineWidth=2.6;ctx.stroke();
    }
    const x=Math.cos(head)*r*scale,y=Math.sin(head)*r*scale*.38;
    ctx.beginPath();ctx.arc(x,y,3.3,0,Math.PI*2);ctx.fillStyle=`rgb(${rgb})`;ctx.fill();ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fillStyle='#f3f6fc';ctx.fill();
   }
   ctx.restore();
  });
  // Broken perimeter sweep keeps the silhouette active without pulsing the text.
  for(let arc=0;arc<3;arc++){const start=time*.38+arc*Math.PI*2/3;ctx.beginPath();ctx.arc(cx,cy,r*1.07,start,start+.72);ctx.strokeStyle='rgba(140,173,215,.4)';ctx.lineWidth=1.2;ctx.stroke();}
  const veil=ctx.createRadialGradient(cx,cy,r*.1,cx,cy,r*.78);veil.addColorStop(0,'rgba(13,17,23,.72)');veil.addColorStop(.65,'rgba(13,17,23,.38)');veil.addColorStop(1,'rgba(13,17,23,0)');ctx.fillStyle=veil;ctx.fillRect(cx-r,cy-r,r*2,r*2);
 };
 frame=requestAnimationFrame(render);return ()=>{cancelAnimationFrame(frame);observer.disconnect();};
}
