import * as THREE from 'three';

// A small palette keeps the first pass inexpensive and gives future assets a shared language.
export const palette = { ink: 0x10212b, teal: 0x2e7774, coral: 0xe77d62, cream: 0xf3efe7, gold: 0xf3b65b, sage: 0x82a99a };
export const makeMaterial = (color, roughness = 0.82) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0.02, flatShading: true });
