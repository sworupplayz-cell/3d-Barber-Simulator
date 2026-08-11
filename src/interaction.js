import * as THREE from 'three';

export function createChairInteraction(camera, player, chair) {
  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0);
  const prompt = document.querySelector('#interaction-prompt');
  const button = document.querySelector('#interaction-button');
  const status = document.querySelector('#interaction-status');
  const chairPoint = new THREE.Vector3();
  let target = false; let lastCheck = -Infinity; let interacted = false;
  chair.userData.interactable = true; chair.userData.action = 'sit';
  function check(now) {
    if (now - lastCheck < 80) return; lastCheck = now;
    chair.getWorldPosition(chairPoint);
    const distance = player.getPosition().distanceTo(chairPoint);
    raycaster.setFromCamera(center, camera);
    const hits = raycaster.intersectObject(chair, true);
    target = distance <= 2.4 && hits.length > 0;
    const active = target || interacted;
    status.textContent = interacted ? 'CHAIR INTERACTED' : target ? 'CHAIR TARGETED' : 'INTERACTION TEST';
    prompt.textContent = target ? '[ E ] SIT' : '';
    prompt.classList.toggle('visible', target);
    button.hidden = !target; button.textContent = 'SIT';
  }
  function activate() {
    if (!target) return;
    interacted = true; chair.rotation.z = chair.rotation.z ? 0 : -0.12;
    status.textContent = 'CHAIR INTERACTED'; prompt.textContent = 'CHAIR INTERACTED';
  }
  addEventListener('keydown', e => { if (e.code === 'KeyE' && !e.repeat) activate(); });
  button.addEventListener('click', activate);
  return { update(now){ check(now); } };
}
