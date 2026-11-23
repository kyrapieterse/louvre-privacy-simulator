"use strict";

const el = id => document.getElementById(id);

const fmt = (number, digits = 2) => number.toLocaleString("en-ZA", { maximumFractionDigits: digits });

function list(id, values) {
  el(id).replaceChildren(...values.map(value => {
    const line = document.createElement("li");
    line.textContent = value;
    return line;
  }));
}

function number(id) {
  const input = el(id);
  if (!input.validity.valid || !Number.isFinite(input.valueAsNumber)) {
    throw new Error("Check " + input.labels[0].textContent.trim().toLowerCase() + " and its allowed range.");
  }
  return input.valueAsNumber;
}

function refresh(draw) {
  try {
    draw();
    el("message").textContent = "";
    el("result").hidden = false;
  } catch (error) {
    el("message").textContent = error.message;
    el("result").hidden = true;
  }
}

function draw() {
  const options=Object.fromEntries(["depth","pitch","thick","angle","distance","eye","target"].map(id=>[id,number(id)]));
  const {origin,centres,rays,cosine,sine}=sightlines(options);
  const open=rays.filter(r=>r.open).length;
  el("summary").textContent=open+" of "+rays.length+" sightlines open";
  list("details",["Sampled open sightlines "+fmt(open/rays.length*100,1)+"%","Eye "+options.distance+" mm outside the slat centres · target "+options.target+" mm inside"]);
  const view=el("view"), ctx=view.getContext("2d");
  ctx.clearRect(0,0,view.width,view.height);
  const low=Math.min(-360,options.eye-60), high=Math.max(360,options.eye+60);
  const scale=Math.min((view.width-48)/(options.distance+options.target),(view.height-34)/(high-low));
  const px=x=>(view.width-(options.distance+options.target)*scale)/2+(x+options.distance)*scale;
  const py=y=>view.height/2-(y-(high+low)/2)*scale;
  for(const ray of rays) {
    ctx.strokeStyle=ray.open?"#007668":"#a95549"; ctx.lineWidth=ray.open?1.9:1.3;
    ctx.setLineDash(ray.open?[]:[3,4]);
    ctx.beginPath(); ctx.moveTo(px(origin.x),py(origin.y)); ctx.lineTo(px(ray.x),py(ray.y)); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.fillStyle="#183754";
  for(const cy of centres) {
    const vertices=[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>[px(a*options.depth/2*cosine-b*options.thick/2*sine),py(cy+a*options.depth/2*sine+b*options.thick/2*cosine)]);
    ctx.beginPath(); vertices.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y)); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle="#173754"; ctx.beginPath(); ctx.arc(px(origin.x),py(origin.y),5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="#173754"; ctx.beginPath(); ctx.moveTo(px(options.target),py(-300)); ctx.lineTo(px(options.target),py(300)); ctx.stroke();
}
el("controls").oninput=()=>refresh(draw);
refresh(draw);
