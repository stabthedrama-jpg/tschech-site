
(() => {
const map=document.querySelector('.growth-map'),svg=map.querySelector('svg');
function draw(){
 const box=map.getBoundingClientRect(), trunk=map.querySelector('.trunk-space').getBoundingClientRect(),soil=map.querySelector('.soil').getBoundingClientRect();
 const cx=box.width/2,ground=soil.top-box.top,join=trunk.top-box.top+trunk.height*.48,stem=Math.min(22,box.width*.025);
 let shapes='';
 function path(d,width=stem){shapes+='<path d="'+d+'" fill="none" stroke="#064b33" stroke-width="'+width+'" stroke-linecap="round" stroke-linejoin="round"/>';}
 path('M '+cx+' '+(join-48)+' V '+(ground+35),stem*2.3);
 // Every card grows its own shoot; the layout can gain cards without hand-positioning.
 const cards=[...map.querySelectorAll('.project')];
 cards.forEach((card,i)=>{
  const r=card.getBoundingClientRect(),x=r.left-box.left+r.width/2,y=r.bottom-box.top+12;
  const bend=join-(cards.length-i)*9;
  path('M '+cx+' '+join+' C '+cx+' '+bend+' '+x+' '+(y+85)+' '+x+' '+y);
  shapes+='<path d="M '+x+' '+(y+47)+' Q '+(x-35)+' '+(y+28)+' '+(x-32)+' '+(y+4)+' Q '+(x+2)+' '+(y+7)+' '+x+' '+(y+47)+' Z" fill="#064b33"/>';
 });
 const cross=44;path('M '+(cx-cross)+' '+(join-47)+' H '+(cx+cross),stem);
 const roots=[...map.querySelectorAll('.root')];
 roots.forEach((card)=>{
  const r=card.getBoundingClientRect(),x=r.left-box.left+r.width/2,y=r.top-box.top-12;
  path('M '+cx+' '+ground+' C '+cx+' '+(ground+65)+' '+x+' '+(y-70)+' '+x+' '+y,stem*.85);
  const side=x<cx?-1:1;
  path('M '+x+' '+(y-32)+' q '+(side*24)+' -18 '+(side*38)+' -14',stem*.35);
 });
 svg.setAttribute('viewBox','0 0 '+box.width+' '+box.height);svg.innerHTML=shapes;
}
new ResizeObserver(draw).observe(map);
new MutationObserver(draw).observe(map.querySelector('.projects'),{childList:true});
new MutationObserver(draw).observe(map.querySelector('.roots'),{childList:true});
draw();
})();
