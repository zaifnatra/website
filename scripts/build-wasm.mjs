import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const isolatedCargo = '/tmp/adirondack-cargo/bin/cargo';
let cargo = process.env.CARGO || 'cargo';
const env = { ...process.env };
if (!process.env.CARGO && spawnSync(cargo, ['--version'], { env }).error && existsSync(isolatedCargo)) {
  cargo = isolatedCargo;
  env.CARGO_HOME = '/tmp/adirondack-cargo';
  env.RUSTUP_HOME = '/tmp/adirondack-rustup';
}
const result = spawnSync(cargo, [
  'build', '--manifest-path', join(root, 'rust/trail-core/Cargo.toml'),
  '--target-dir', join(root, 'rust/trail-core/target'),
  '--target', 'wasm32-unknown-unknown', '--release', '--locked',
], { cwd: root, env, stdio: 'inherit' });
if (result.error || result.status !== 0) {
  console.error('Rust build failed. Install Rust, then run: rustup target add wasm32-unknown-unknown');
  if (result.error) console.error(result.error.message);
  process.exit(1);
}
const destination = join(root, 'public/wasm');
mkdirSync(destination, { recursive: true });
copyFileSync(join(root, 'rust/trail-core/target/wasm32-unknown-unknown/release/trail_core.wasm'), join(destination, 'trail_core.wasm'));
console.log('Built public/wasm/trail_core.wasm');
