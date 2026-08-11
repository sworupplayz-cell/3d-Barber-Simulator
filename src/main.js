import * as THREE from 'three';
import { createRenderer, fitViewport } from './core/renderer.js';
import { makeMaterial, palette } from './assets/materials.js';
import './styles.css';
const canvas=document.querySelector('#scene-canvas'),renderer=createRenderer(canvas),scene=new THREE.Scene();scene.background=new THREE.Color(palette.ink);scene.fog=new THREE.Fog(palette.ink,8,20);
const camera=new THREE.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.set(6,4.2,8);camera.lookAt(0,1.5,0);
const mat=(c,r)=>makeMaterial(c,r);const stage=new THREE.Group();scene.add(stage);
const floor=new THREE.Mesh(new THREE.PlaneGeometry(18,18),mat(0x183943));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;stage.add(floor);
// Compact menu-only shop vignette: recognizable silhouettes, deliberately no gameplay.
function box(name,size,pos,color){const m=new THREE.Mesh(new THREE.BoxGeometry(...size),mat(color));m.name=name;m.position.set(...pos);m.castShadow=m.receiveShadow=true;stage.add(m);return m}
box('counter',[4.8,.65,1.05],[1.1,.45,-1.5],0x2e7774);box('counter top',[5.05,.12,1.18],[1.1,.83,-1.5],palette.cream);
box('mirror',[3.7,2.7,.12],[1.2,2.55,-2.12],0x214e58);box('mirror glass',[3.2,2.15,.04],[1.2,2.55,-2.2],0x6caaa4);
box('shelf',[3.8,.18,.5],[1.2,3.9,-2],palette.gold);box('shelf lower',[3.2,.15,.4],[1.2,4.55,-2],palette.gold);
// Chair silhouette
const chair=new THREE.Group();chair.position.set(-2.1,0,0);stage.add(chair);let c=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.35,.95),mat(palette.coral));c.position.y=1.25;c.castShadow=true;chair.add(c);c=new THREE.Mesh(new THREE.BoxGeometry(1.38,.22,1.05),mat(palette.coral));c.position.y=.58;c.castShadow=true;chair.add(c);c=new THREE.Mesh(new THREE.CylinderGeometry(.1,.16,1.6,8),mat(palette.gold));c.position.y=.2;c.castShadow=true;chair.add(c);
// Small readable counter props
const bottle=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,.55,8),mat(palette.gold));bottle.position.set(.25,1.15,-1.5);bottle.castShadow=true;stage.add(bottle);const clippers=box('clippers',[.55,.14,.25],[1.4,1.02,-1.5],palette.cream);clippers.rotation.z=-.2;const scissors=new THREE.Mesh(new THREE.TorusGeometry(.18,.035,6,12,Math.PI*1.6),mat(palette.coral));scissors.position.set(2.2,1.03,-1.5);scissors.rotation.x=Math.PI/2;stage.add(scissors);
const hemi=new THREE.HemisphereLight(0xb9d8d0,0x10212b,2.2);scene.add(hemi);const key=new THREE.DirectionalLight(0xffd29b,3);key.position.set(-4,7,5);key.castShadow=true;key.shadow.mapSize.set(512,512);scene.add(key);const warm=new THREE.PointLight(0xf3b65b,2,8);warm.position.set(1,4,-1);scene.add(warm);
const modal=document.querySelector('#modal'),content=document.querySelector('#panel-content');const copy={play:['Game Starting','The shop is getting ready. Gameplay will arrive in the next phase.'],settings:['Settings','Audio, graphics, and controls will be available here.'],about:['About Barber','A stylized first-person barber simulator foundation. Crafted for small screens and big style.']};function openPanel(key){content.innerHTML=`<h2>${copy[key][0]}</h2><p>${copy[key][1]}</p>${key==='play'?'<button class="modal-action close-action">BACK TO MENU</button>':''}`;modal.classList.add('open');modal.setAttribute('aria-hidden','false');content.querySelector('.close-action')?.addEventListener('click',closePanel)}function closePanel(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true')}document.querySelectorAll('[data-panel]').forEach(b=>b.addEventListener('click',()=>openPanel(b.dataset.panel)));document.querySelector('.close').addEventListener('click',closePanel);modal.addEventListener('click',e=>{if(e.target===modal)closePanel()});
const clock=new THREE.Clock();function render(){const t=clock.getElapsedTime();stage.position.y=Math.sin(t*.35)*.015;renderer.render(scene,camera);requestAnimationFrame(render)}addEventListener('resize',()=>fitViewport(camera,renderer),{passive:true});fitViewport(camera,renderer);render();
