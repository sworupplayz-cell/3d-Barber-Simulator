import * as THREE from 'three';

export function createPlayer(camera, scene, renderer) {
  const root = new THREE.Group(); root.name = 'Player'; scene.add(root); root.add(camera);
  camera.position.set(0, 1.72, 0); camera.rotation.order = 'YXZ';
  const state = { yaw: 0, pitch: 0, speed: 2.8, position: root.position };
  const held = Object.create(null), stick = { x: 0, y: 0 }; let lookId = null, lastX = 0, lastY = 0;
  const solids = [
    [-4.5,4.5,-5.2,-5.0], [-4.5,-4.35,-5.1,2.8], [4.35,4.5,-5.1,2.8],
    [-2.15,2.15,-4.85,-3.85], [-3.95,-2.55,-4.8,-4.15], [2.7,4,-5,-4.85], [-.85,.85,-2.95,-1.75]
  ];
  const blocked = (x,z) => solids.some(([a,b,c,d]) => x > a-.28 && x < b+.28 && z > c-.28 && z < d+.28);
  const key = e => { if (/^Key[WASD]$/.test(e.code)) { held[e.code] = e.type === 'keydown'; e.preventDefault(); } };
  addEventListener('keydown', key); addEventListener('keyup', key); addEventListener('blur', () => Object.keys(held).forEach(k => held[k] = false));
  const joystick = document.querySelector('#joystick'), lookRegion = document.querySelector('#look-region'), debug = document.querySelector('#camera-debug'), canvas = renderer.domElement;
  const updateStick = e => { const r=joystick.getBoundingClientRect(), max=r.width*.34; stick.x=Math.max(-1,Math.min(1,(e.clientX-(r.left+r.width/2))/max)); stick.y=Math.max(-1,Math.min(1,(e.clientY-(r.top+r.height/2))/max)); joystick.querySelector('i').style.transform=`translate(${stick.x*max}px,${stick.y*max}px)`; };
  joystick.addEventListener('pointerdown', e => { e.stopPropagation(); joystick.setPointerCapture(e.pointerId); updateStick(e); });
  joystick.addEventListener('pointermove', e => { if (e.pointerId === joystick.getPointerId?.(0) || e.buttons) updateStick(e); });
  const releaseStick=()=>{stick.x=stick.y=0;joystick.querySelector('i').style.transform='translate(0,0)'}; joystick.addEventListener('pointerup',releaseStick); joystick.addEventListener('pointercancel',releaseStick);
  function moveLook(e){if(e.pointerId!==lookId)return;state.yaw-=(e.clientX-lastX)*.006;state.pitch=THREE.MathUtils.clamp(state.pitch-(e.clientY-lastY)*.004,-1.396,1.396);lastX=e.clientX;lastY=e.clientY;applyPose();debug.textContent=`YAW: ${Math.round(THREE.MathUtils.radToDeg(state.yaw))}° · PITCH: ${Math.round(THREE.MathUtils.radToDeg(state.pitch))}°`;console.log('log: look movement')}
  function startLook(e){lookId=e.pointerId;lastX=e.clientX;lastY=e.clientY;e.currentTarget.setPointerCapture(e.pointerId);console.log('log: look start')}
  function endLook(e){if(e.pointerId===lookId){lookId=null;console.log('log: look end')}}
  canvas.addEventListener('pointerdown',startLook);canvas.addEventListener('pointermove',moveLook);canvas.addEventListener('pointerup',endLook);canvas.addEventListener('pointercancel',endLook);
  lookRegion.addEventListener('pointerdown',startLook);lookRegion.addEventListener('pointermove',moveLook);lookRegion.addEventListener('pointerup',endLook);lookRegion.addEventListener('pointercancel',endLook);
  function applyPose(){ root.rotation.y=state.yaw; camera.rotation.x=state.pitch; }
  return { reset(){root.position.set(0,0,2.9);state.yaw=0;state.pitch=0;applyPose()}, update(dt){let x=(held.KeyD?1:0)-(held.KeyA?1:0)+stick.x, z=(held.KeyS?1:0)-(held.KeyW?1:0)+stick.y;const n=Math.hypot(x,z);if(n>1){x/=n;z/=n}const c=Math.cos(state.yaw),s=Math.sin(state.yaw),dx=(x*c+z*s)*state.speed*dt,dz=(-x*s+z*c)*state.speed*dt;if(!blocked(root.position.x+dx,root.position.z))root.position.x+=dx;if(!blocked(root.position.x,root.position.z+dz))root.position.z+=dz;root.position.x=THREE.MathUtils.clamp(root.position.x,-4.05,4.05);root.position.z=THREE.MathUtils.clamp(root.position.z,-4.65,2.75);state.pitch=THREE.MathUtils.clamp(state.pitch,-1.3,1.3);applyPose()} };
}
