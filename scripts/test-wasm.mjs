import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const wasm = await readFile(new URL('../public/wasm/trail_core.wasm', import.meta.url));
const { instance } = await WebAssembly.instantiate(wasm, {});
const core = instance.exports;
for (const name of ['reset', 'visit_camp', 'tick', 'set_bob', 'get_x', 'get_y', 'get_z', 'get_yaw', 'get_pitch', 'get_distance']) {
  assert.equal(typeof core[name], 'function', `Missing WebAssembly export: ${name}`);
}
const step = (frames, forward, strafe, sprint = 0) => {
  for (let i = 0; i < frames; i++) core.tick(1 / 60, forward, strafe, sprint, 0, 0);
};
core.reset(); core.set_bob(0);
assert.equal(core.get_x(), 0); assert.equal(core.get_z(), 2);
step(60, 1, 0);
assert.ok(Math.abs(core.get_z() + 0.4) < 0.001);
assert.ok(Math.abs(core.get_distance() - 2.4) < 0.001);
assert.ok(Math.abs(core.get_y() - 1.7) < 0.001);
step(1200, 1, 0, 1);
assert.ok(core.get_z() >= -6.65, 'Player tunneled through the trail register');
core.tick(NaN, Infinity, NaN, 0, Infinity, NaN);
assert.ok(Number.isFinite(core.get_x()) && Number.isFinite(core.get_yaw()));
core.reset(); assert.equal(core.get_z(), 2); assert.equal(core.get_distance(), 0);
step(125, 0, -1); step(240, 1, 0);
assert.ok(core.get_z() >= -3.35 && core.get_z() < -3.25, 'Experience board collider missing');
core.reset(); step(120, 0, 1);
assert.ok(core.get_x() <= 3.45 && core.get_x() > 3.35, 'Rotated outside sign collider missing');
core.reset(); step(50, 1, 0); step(125, 0, 1); step(240, 1, 0);
assert.ok(core.get_z() >= -2.05 && core.get_z() < -1.95, 'Projects bench collider missing');

core.visit_camp();
assert.ok(Math.abs(core.get_x()-3.1)<.001 && Math.abs(core.get_z()+8.2)<.001, 'Camp shortcut failed');
const beforeCampWalk=core.get_distance();
for(let i=0;i<120;i++){
  step(1,1,0);
  const x=core.get_x(),z=core.get_z();
  assert.ok(!(x>3.45 && x<5.55 && z> -11.85 && z< -9.75), 'Player entered the fire pit');
}
assert.ok(core.get_distance()>beforeCampWalk, 'Camp arrival cannot move');
core.reset(); assert.equal(core.get_z(),2);

console.log('WebAssembly clearing checks passed: movement, collision, reset, and reduced motion.');
