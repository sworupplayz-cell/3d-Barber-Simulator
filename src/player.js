import * as THREE from 'three';

export function createPlayer(camera, shop) {
  const player = { position: new THREE.Vector3(0, 1.72, 2.9), yaw: 0, pitch: 0, speed: 2.8 };
  const keys = new Set(); const joystick = { x: 0, y: 0 }; let lookTouch = null;
  const solids = [
    { minX: -4.5, maxX: 4.5, minZ: -5.2, maxZ: -5.0 }, { minX: -4.5, maxX: -4.35, minZ: -5.1, maxZ: 2.8 }, { minX: 4.35, maxX: 4.5, minZ: -5.1, maxZ: 2.8 },
    { minX: -2.15, maxX: 2.15, minZ: -4.85, maxZ: -3.85 }, { minX: -3.95, maxX: -2.55, minZ: -4.8, maxZ: -4.15 }, { minX: 2.7, maxX: 4.0, minZ: -5.0, maxZ: -4.85 },
    { minX: -.85, maxX: .85, minZ: -2.95, maxZ: -1.75 }, { minX: -4.15, maxX: -2.35, minZ: -4.8, maxZ: -4.1 }
  ];
  const collides = (x,z) => solids.some(s => x > s.minX-.28 && x < s.maxX+.28 && z > s.minZ-.28 && z < s.maxZ+.28);
  const onKey = e => { if (['KeyW','KeyA','KeyS','KeyD'].includes(e.code)) { keys[e.code] = e.type === 'keydown'; e.preventDefault(); } };
  addEventListener('keydown', onKey); addEventListener('keyup', onKey);
  const joyEl=document.querySelector('#joystick'), lookEl=document.querySelector('.controls');
  const setJoy=e=>{const r=joyEl.getBoundingClientRect(), dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),max=r.width*.34;joystick.x=Math.max(-1,Math.min(1,dx/max));joystick.y=Math.max(-1,Math.min(1,dy/max));joyEl.querySelector('i').style.transform=`translate(${joystick.x*max}px,${joystick.y*max}px)`};
  joyEl.addEventListener('pointerdown',e=>{joyEl.setPointerCapture(e.pointerId);setJoy(e)}); joyEl.addEventListener('pointermove',e=>{if(e.buttons)setJoy(e)}); ['pointerup','pointercancel'].forEach(t=>joyEl.addEventListener(t,()=>{joystick.x=joystick.y=0;joyEl.querySelector('i').style.transform='translate(0,0)'}));
  lookEl.addEventListener('pointerdown',e=>{if(e.target===joyEl||joyEl.contains(e.target))return;lookTouch={x:e.clientX,y:e.clientY};lookEl.setPointerCapture(e.pointerId)});lookEl.addEventListener('pointermove',e=>{if(!lookTouch)return;player.yaw-= (e.clientX-lookTouch.x)*.006;player.pitch-= (e.clientY-lookTouch.y)*.004;lookTouch={x:e.clientX,y:e.clientY}});['pointerup','pointercancel'].forEach(t=>lookEl.addEventListener(t,()=>lookTouch=null));
  camera.rotation.order='YXZ'; let locked=false; document.querySelector('#scene-canvas').addEventListener('click',()=>{if(!('ontouchstart' in window))document.querySelector('#scene-canvas').requestPointerLock?.()});document.addEventListener('pointerlockchange',()=>locked=document.pointerLockElement===document.querySelector('#scene-canvas'));addEventListener('mousemove',e=>{if(locked){player.yaw-=e.movementX*.0025;player.pitch-=e.movementY*.0025}});
  return { update(dt){let x=(keys.KeyD?1:0)-(keys.KeyA?1:0)+joystick.x,y=(keys.KeyS?1:0)-(keys.KeyW?1:0)+joystick.y;const len=Math.hypot(x,y);if(len>1){x/=len;y/=len}const c=Math.cos(player.yaw),s=Math.sin(player.yaw),dx=(x*c+y*s)*player.speed*dt,dz=(-x*s+y*c)*player.speed*dt;if(!collides(player.position.x+dx,player.position.z))player.position.x+=dx;if(!collides(player.position.x,player.position.z+dz))player.position.z+=dz;player.position.x=Math.max(-4.05,Math.min(4.05,player.position.x));player.position.z=Math.max(-4.65,Math.min(2.5,player.position.z));player.pitch=Math.max(-1.35,Math.min(1.35,player.pitch));camera.position.copy(player.position);camera.rotation.set(player.pitch,player.yaw,0)},reset(){player.position.set(0,1.72,2.9);player.yaw=0;player.pitch=0}};
}
