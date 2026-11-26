import './styles/theme.css';
import { mountPortfolio, setPortfolioPage } from './portfolio.js';
import { mountMinimap } from './minimap.js';
mountPortfolio();

const $ = (selector) => document.querySelector(selector);
const canvas = $('#world');
let scene;
let engine;
let walking = false;
let busy = false;
let noticeTimer;
let hudFrame;
let audioContext;
let audioGain;
let soundEnabled = false;
let birdTimer;
let lastHudUpdate = 0;
const minimap = mountMinimap({ onOpen: id => openDialog(`${id}-dialog`) });
document.addEventListener('portfolio-page-change', event => scene?.setPage?.(event.detail.kind,event.detail.index));
const motion = $('#motion-toggle');
motion.checked = !matchMedia('(prefers-reduced-motion: reduce)').matches;

function notify(message) {
  $('#notice').textContent = message;
  $('#notice').classList.add('show');
  clearTimeout(noticeTimer);
  noticeTimer = setTimeout(() => $('#notice').classList.remove('show'), 5500);
}
function openDialog(id) {
  const dialog = document.getElementById(id);
  if (!dialog) return;
  document.querySelectorAll('dialog[open]').forEach(open => { if (open !== dialog) open.close(); });
  scene?.setLookEnabled(false);
  if (document.pointerLockElement) document.exitPointerLock();
  if (!dialog.open) dialog.showModal();
}
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openDialog(button.dataset.open)));
document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('close', () => { const anotherOpen = Boolean(document.querySelector('dialog[open]')); scene?.setLookEnabled(!anotherOpen); if (walking && !anotherOpen) canvas.focus({ preventScroll: true }); });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
});

const contourPaths = Array.from({ length: 15 }, (_, i) => {
  const r = 35 + i * 16;
  return `<ellipse cx="130" cy="310" rx="${r * .62}" ry="${r}" transform="rotate(-28 130 310)"/>`;
}).join('');
$('#trail-map').innerHTML = `<svg viewBox="0 0 460 510" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustrated trail overview: Adirondak Loj to a shared junction, west toward Algonquin Peak or east toward Marcy Dam, then south through Avalanche Pass, Avalanche Lake and Lake Colden. Not to scale.">
<rect width="460" height="510" fill="#e4e7d9"/><g fill="none" stroke="#cbd1ba" stroke-width=".65">${contourPaths}<ellipse cx="390" cy="300" rx="90" ry="155"/><ellipse cx="390" cy="300" rx="72" ry="135"/><ellipse cx="390" cy="300" rx="54" ry="115"/><ellipse cx="390" cy="300" rx="36" ry="95"/></g>
<path d="M65 112 Q82 105 91 125 Q99 149 81 155 Q58 146 65 112Z" fill="#a8bdba"/><path d="M291 328 Q311 335 302 363 Q291 370 285 350Z" fill="#9eb8b5"/><path d="M270 402 Q285 391 294 414 Q298 438 281 442 Q265 433 270 402Z" fill="#9eb8b5"/>
<g stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M127 95 144 137 164 164" stroke="#667b69" stroke-width="3"/><path d="M164 164 150 209 127 248 115 286 97 325" stroke="#587b96" stroke-width="3"/><path d="M127 248 87 259 63 289" stroke="#587b96" stroke-width="2" stroke-dasharray="4 5"/><path d="M164 164 204 176 224 213 268 230" stroke="#667b69" stroke-width="3"/><path d="M268 230 292 265 287 299 278 330 275 362 280 405" stroke="#ba9657" stroke-width="3"/></g>
<g fill="#e7eadd" stroke="#65775c" stroke-width="2"><circle cx="164" cy="164" r="4"/><circle cx="268" cy="230" r="5"/><circle cx="280" cy="405" r="5"/></g><circle cx="127" cy="95" r="10" fill="#ac7047" fill-opacity=".15"/><circle cx="127" cy="95" r="5" fill="#ac7047" stroke="#fff7e6" stroke-width="2"/>
<g font-family="sans-serif" fill="#40513e"><text x="148" y="87" font-size="14" font-weight="600">Adirondak Loj</text><text x="148" y="103" font-size="8" letter-spacing="1.4">YOU ARE HERE</text><text x="36" y="176" font-size="9" fill="#7c8a75">Heart Lake</text><text x="179" y="151" font-size="8" fill="#7c8a75">Trail junction</text><text x="281" y="229" font-size="12">Marcy Dam</text><text x="300" y="290" font-size="10">Avalanche Pass</text><text x="313" y="350" font-size="10">Avalanche Lake</text><text x="301" y="421" font-size="12">Lake Colden</text><text x="46" y="349" font-size="12">Algonquin Peak</text><text x="24" y="278" font-size="9">Wright Peak</text><text x="310" y="188" font-size="8" letter-spacing="1.5" fill="#9ba48c">HIGH PEAKS</text><text x="310" y="201" font-size="8" letter-spacing="1.5" fill="#9ba48c">WILDERNESS</text></g>
<path d="m97 317-5 9h10Zm-34-35-4 7h8Z" fill="#5c7055"/><g transform="translate(401 47)" fill="#60735b"><text x="0" y="0" font-size="9" text-anchor="middle">N</text><path d="m0 10-5 19 5-4 5 4Z"/></g><path d="M25 471h410" stroke="#bcc6ad"/><text x="25" y="492" font-family="sans-serif" font-size="8" fill="#7c8771" letter-spacing="1">ILLUSTRATED OVERVIEW · NOT TO SCALE</text></svg>`;

async function enterTrail() {
  if (busy || walking) return;
  busy = true;
  $('#loading').hidden = false;
  $('#enter-button').disabled = true;
  try {
    if (!scene) {
      const [response, { createTrailScene }] = await Promise.all([
        fetch(`${import.meta.env.BASE_URL}wasm/trail_core.wasm`), import('./scene.js'),
      ]);
      if (!response.ok) throw new Error('The movement engine could not be loaded.');
      const { instance } = await WebAssembly.instantiate(await response.arrayBuffer(), {});
      engine = instance.exports;
      engine.reset();
      scene = await createTrailScene({ canvas, engine, onInteract: (id,index) => { if(index!==undefined)setPortfolioPage(id,index); openDialog(`${id}-dialog`); }, onPageChange: (kind,index) => setPortfolioPage(kind,index) });

    }
    engine.set_bob(Number(motion.checked));
    walking = true;
    canvas.inert = false; canvas.tabIndex = 0;
    document.body.classList.add('walking');
    $('.scene-hud').hidden = false;
    $('#footer-location').textContent = 'My favorite starting point.';
    $('#footer-note').textContent = 'Adirondak Loj · a personal interpretation';
    window.scrollTo(0, 0);
    scene.start(); scene.resize(); scene.setLookEnabled(!document.querySelector('dialog[open]'));
    canvas.focus({ preventScroll: true });
    updateHud();
  } catch (error) {
    console.error(error);
    notify('The 3D trail could not start on this browser. Try a browser with WebGL 2 enabled; the trail map and photos are still available.');
  } finally {
    document.body.classList.remove('booting');
    $('#loading').hidden = true;
    $('#enter-button').disabled = false;
    busy = false;
  }
}
canvas.addEventListener('webglcontextlost', event => {
  event.preventDefault();
  exitTrail();
  scene?.dispose(); scene = null;
  notify('The graphics connection was interrupted. You can enter the trail again.');
});

function exitTrail() {
  walking = false;
  canvas.inert = true; canvas.tabIndex = -1;
  scene?.stop();
  cancelAnimationFrame(hudFrame);
  document.body.classList.remove('walking');
  $('.scene-hud').hidden = true;
  $('#footer-location').textContent = 'Lake Colden, looking toward Avalanche Pass';
  $('#footer-note').textContent = 'A real photograph from the trail beyond.';
  $('#enter-button').focus({ preventScroll: true });
}
function updateHud() {
  if (!walking) return;
  $('#walk-distance').textContent = Math.floor(engine.get_distance());
  const interaction = scene.getInteraction?.();
  $('#interact-button').hidden = !interaction;
  if (interaction) $('#interaction-label').textContent = interaction.label;
  if (engine.get_distance() > 1.5) $('#welcome-note').classList.add('dismissed');
  const bearing = ((-engine.get_yaw() * 180 / Math.PI) % 360 + 360) % 360;
  $('#heading').textContent = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(bearing / 45) % 8];
  if (performance.now() - lastHudUpdate > 80) {
    lastHudUpdate = performance.now();
    minimap.update({ x: engine.get_x(), z: engine.get_z(), yaw: engine.get_yaw() });
  }
  hudFrame = requestAnimationFrame(updateHud);
}
$('#enter-button').addEventListener('click', enterTrail);
$('#exit-button').addEventListener('click', exitTrail);
$('#experience-button').addEventListener('click', () => { if (!walking) enterTrail(); else { scene.reset(); $('#welcome-note').classList.remove('dismissed'); } });
$('#wander-button').addEventListener('click', () => { $('#welcome-note').classList.add('dismissed'); canvas.focus({ preventScroll: true }); });
$('#reset-button').addEventListener('click', () => { scene?.reset(); engine?.set_bob(Number(motion.checked)); $('#welcome-note').classList.remove('dismissed'); notify('Back in the clearing. Your next story is a few steps away.'); });
$('#interact-button').addEventListener('click', () => scene?.interact());
motion.addEventListener('change', () => { engine?.set_bob(Number(motion.checked)); scene?.setReducedMotion?.(!motion.checked); });
$('#register-map').addEventListener('click', () => { $('#register-dialog').close(); openDialog('map-dialog'); });

const touchKeys = new Set();
function moveTouch() {
  scene?.setMovement(Number(touchKeys.has('forward')) - Number(touchKeys.has('back')), Number(touchKeys.has('right')) - Number(touchKeys.has('left')));
}
document.querySelectorAll('[data-move]').forEach(button => {
  button.addEventListener('pointerdown', event => { event.preventDefault(); button.setPointerCapture(event.pointerId); touchKeys.add(button.dataset.move); moveTouch(); });
  const release = () => { touchKeys.delete(button.dataset.move); moveTouch(); };
  button.addEventListener('pointerup', release); button.addEventListener('pointercancel', release); button.addEventListener('lostpointercapture', release);
});
window.addEventListener('blur', () => { touchKeys.clear(); moveTouch(); });

function showEntry(entry) {
  const saved = $('#saved-entry');
  saved.replaceChildren();
  const heading = document.createElement('h3'); heading.textContent = `Good to see you, ${entry.name}.`;
  const destination = document.createElement('p'); destination.textContent = `${entry.destination} · ${new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const note = document.createElement('p'); note.textContent = entry.note;
  const edit = document.createElement('button'); edit.className = 'text-link'; edit.textContent = 'Write a new entry ↗';
  edit.addEventListener('click', () => { saved.hidden = true; $('#register-form').hidden = false; $('#visitor-name').focus(); });
  const clear = document.createElement('button'); clear.className = 'text-link clear-entry'; clear.textContent = 'Clear this entry';
  clear.addEventListener('click', () => { try { localStorage.removeItem('loj-trail-register'); } catch { /* In-memory entry can still be cleared. */ } saved.hidden = true; saved.replaceChildren(); $('#register-form').hidden = false; $('#register-form').reset(); notify('Your local register entry has been cleared.'); });
  saved.append(heading, destination, note, edit, clear); saved.hidden = false; $('#register-form').hidden = true;
}
try { const entry = JSON.parse(localStorage.getItem('loj-trail-register')); if (entry && typeof entry.name === 'string' && typeof entry.note === 'string' && typeof entry.destination === 'string' && Number.isFinite(Date.parse(entry.date))) showEntry(entry); } catch { /* Storage may be unavailable in private browsers. */ }
$('#register-form').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('#visitor-name').value.trim();
  if (!name) { $('#visitor-name').setCustomValidity('Please leave a name for your entry.'); $('#visitor-name').reportValidity(); return; }
  const entry = { name, destination: $('#destination').value, note: $('#visitor-note').value.trim(), date: new Date().toISOString() };
  let stored = true;
  try { localStorage.setItem('loj-trail-register', JSON.stringify(entry)); } catch { stored = false; }
  showEntry(entry);
  notify(stored ? 'Your note is saved in this browser. Happy wandering.' : 'Your note is here for this visit. Browser storage is unavailable.');
});
$('#visitor-name').addEventListener('input', () => $('#visitor-name').setCustomValidity(''));

// Quiet synthesized wind and birds. Audio starts only in response to a click.
function bird() {
  if (!audioContext || !soundEnabled || document.hidden) return;
  const t = audioContext.currentTime;
  const voice = audioContext.createOscillator(), envelope = audioContext.createGain();
  voice.type = 'sine'; voice.frequency.setValueAtTime(1950 + Math.random() * 800, t);
  voice.frequency.exponentialRampToValueAtTime(3100, t + .09); voice.frequency.exponentialRampToValueAtTime(1800, t + .21);
  envelope.gain.setValueAtTime(0, t); envelope.gain.linearRampToValueAtTime(.018, t + .025); envelope.gain.exponentialRampToValueAtTime(.0001, t + .3);
  voice.connect(envelope); envelope.connect(audioGain); voice.start(t); voice.stop(t + .32);
  voice.onended = () => { voice.disconnect(); envelope.disconnect(); };
}
async function toggleSound() {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
      audioGain = audioContext.createGain(); audioGain.gain.value = 0; audioGain.connect(audioContext.destination);
      const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate), data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < data.length; i++) { last = (last + (Math.random() * 2 - 1) * .02) / 1.02; data[i] = last * 3.5; }
      const wind = audioContext.createBufferSource(), filter = audioContext.createBiquadFilter();
      wind.buffer = buffer; wind.loop = true; filter.type = 'lowpass'; filter.frequency.value = 650;
      wind.connect(filter); filter.connect(audioGain); wind.start();
    }
    await audioContext.resume(); soundEnabled = !soundEnabled;
    audioGain.gain.setTargetAtTime(soundEnabled ? .3 : 0, audioContext.currentTime, .3);
    $('#sound-button').setAttribute('aria-pressed', String(soundEnabled));
    $('#sound-button').setAttribute('aria-label', soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound');
    $('#sound-waves').setAttribute('d', soundEnabled ? 'M17 8q4 4 0 8m3-11q7 7 0 14' : 'm17 9 5 6m0-6-5 6');
    clearInterval(birdTimer); if (soundEnabled) { bird(); birdTimer = setInterval(bird, 4300); }
  } catch { notify('Sound is unavailable in this browser. You can still explore the trail.'); }
}
$('#sound-button').addEventListener('click', toggleSound);
document.addEventListener('visibilitychange', () => {
  if (!audioContext) return;
  if (document.hidden) audioContext.suspend().catch(() => {});
  else if (soundEnabled) audioContext.resume().catch(() => {});
});

window.addEventListener('pagehide', event => {
  scene?.stop(); cancelAnimationFrame(hudFrame); clearInterval(birdTimer);
  if (event.persisted) audioContext?.suspend().catch(() => {});
  else audioContext?.close().catch(() => {});
});
window.addEventListener('pageshow', event => {
  if (!event.persisted) return;
  if (walking) { scene?.start(); updateHud(); }
  if (soundEnabled) {
    audioContext?.resume().catch(() => {});
    birdTimer = setInterval(bird, 4300);
  }
});

// The personal trailhead is the home page; the photographic view is optional.
enterTrail();
