import * as THREE from 'three';

export function createChairInteraction(camera, player, chair) {
  const raycaster = new THREE.Raycaster();
  const center = new THREE.Vector2(0, 0);
  const prompt = document.querySelector('#interaction-prompt');
  const button = document.querySelector('#interaction-button');
  const chairPoint = new THREE.Vector3();
  let target = null; let lastCheck = 0;
  chair.userData.interactable = true; chair.userData.action = 'sit';
  function check(now) {
    if (now - lastCheck < 80) return; lastCheck = now;
    chair.getWorldPosition(chairPoint); const distance = player.getPosition().distanceTo(chairPoint);
    raycaster.setFromCamera(center, camera); const hits = raycaster.intersectObject(chair, true);
    target = !player.isSitting() && distance <= 2.4 && hits.length ? chair : (player.isSitting() ? chair : null);
    const active = player.isSitting() || target;
    prompt.textContent = active ? `[ ${player.isSitting() ? 'E' : 'E'} ] ${player.isSitting() ? 'STAND' : 'SIT'}` : '';
    prompt.classList.toggle('visible', Boolean(active));
    button.hidden = !active; button.textContent = player.isSitting() ? 'TAP · STAND' : 'TAP · SIT';
  }
  function sit() { chair.getWorldPosition(chairPoint); player.setSitting(true, new THREE.Vector3(chairPoint.x, 0, chairPoint.z + 0.15), 0); }
  function stand() { player.setSitting(false, new THREE.Vector3(chairPoint.x + 1.35, 0, chairPoint.z + 1.2), 0); }
  function activate() { if (player.isSitting()) stand(); else if (target) sit(); }
  addEventListener('keydown', e => { if (e.code === 'KeyE' && !e.repeat) activate(); }); button.addEventListener('click', activate);
  return { update(now){ check(now); } };
}
