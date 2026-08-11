import * as THREE from 'three';
import { createRenderer, fitViewport } from './core/renderer.js';
import { makeMaterial, palette } from './assets/materials.js';
import './styles.css';

const canvas = document.querySelector('#scene-canvas');
const renderer = createRenderer(canvas);
const scene = new THREE.Scene();
scene.background = new THREE.Color(palette.ink);
scene.fog = new THREE.Fog(palette.ink, 10, 24);

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(6.4, 4.5, 8.4);
camera.lookAt(0, 1.15, 0);

// Minimal test composition: deliberately not a game environment.
const stage = new THREE.Group();
scene.add(stage);
const ground = new THREE.Mesh(new THREE.CircleGeometry(7, 48), makeMaterial(0x183943));
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
stage.add(ground);

const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.5, 0.42, 12), makeMaterial(palette.teal));
pedestal.position.y = 0.22; pedestal.castShadow = true; pedestal.receiveShadow = true; stage.add(pedestal);
const accent = new THREE.Mesh(new THREE.CylinderGeometry(.82, .82, .06, 12), makeMaterial(palette.gold));
accent.position.y = .46; accent.castShadow = true; stage.add(accent);
const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(.78, 1), makeMaterial(palette.coral));
orb.position.set(0, 1.38, 0); orb.castShadow = true; stage.add(orb);
const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, .055, 8, 32), makeMaterial(palette.cream));
ring.rotation.x = Math.PI / 2.7; ring.position.set(0, 1.4, 0); ring.castShadow = true; stage.add(ring);

const hemi = new THREE.HemisphereLight(0xb9d8d0, 0x10212b, 2.2);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xffe0b2, 3.2);
key.position.set(-4, 7, 5); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); key.shadow.camera.near = 1; key.shadow.camera.far = 20;
scene.add(key);
const fill = new THREE.DirectionalLight(0x74b7bf, 1.1); fill.position.set(5, 3, -4); scene.add(fill);

let elapsed = 0;
const clock = new THREE.Clock();
function render() {
  elapsed += clock.getDelta();
  orb.rotation.y = elapsed * 0.28;
  ring.rotation.z = elapsed * 0.16;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
window.addEventListener('resize', () => fitViewport(camera, renderer), { passive: true });
fitViewport(camera, renderer);
render();
