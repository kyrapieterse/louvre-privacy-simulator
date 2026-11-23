"use strict";
// Intersect one ray segment with an oriented slat using two rectangle slabs.
function firstSlatHit(origin, end, slats, length, thickness, cosine, sine) {
  let nearest=1;
  for (const cy of slats) {
    const relativeY=origin.y-cy, dx=end.x-origin.x, dy=end.y-origin.y;
    const axes=[
      [origin.x*cosine+relativeY*sine, dx*cosine+dy*sine, length/2],
      [-origin.x*sine+relativeY*cosine, -dx*sine+dy*cosine, thickness/2]
    ];
    let enter=0, leave=1;
    for (const [position,direction,half] of axes) {
      if (Math.abs(direction)<1e-12) {
        if (Math.abs(position)>half) {leave=-1; break;}
      } else {
        const a=(-half-position)/direction, b=(half-position)/direction;
        enter=Math.max(enter,Math.min(a,b));
        leave=Math.min(leave,Math.max(a,b));
      }
    }
    if (enter<=leave) nearest=Math.min(nearest,enter);
  }
  return nearest;
}
function sightlines({depth,pitch,thick,angle,distance,eye,target}) {
  const radians=angle*Math.PI/180, cosine=Math.cos(radians), sine=Math.sin(radians);
  if (pitch*cosine<thick && Math.abs(pitch*sine)<depth) throw new Error("These adjacent slats overlap. Increase the pitch or reduce the thickness or angle.");
  const low=Math.min(-300,eye)-depth, high=Math.max(300,eye)+depth;
  const centres=[];
  for (let k=Math.floor(low/pitch); k<=Math.ceil(high/pitch); k++) centres.push(k*pitch);
  const origin={x:-distance,y:eye}, rays=[];
  for(let i=0;i<=30;i++) {
    const end={x:target,y:-300+i*20};
    const t=firstSlatHit(origin,end,centres,depth,thick,cosine,sine);
    rays.push({open:t===1, x:origin.x+(end.x-origin.x)*t, y:origin.y+(end.y-origin.y)*t});
  }
  return {origin,centres,rays,cosine,sine};
}
if(typeof module!=="undefined" && module.exports) module.exports={sightlines};
