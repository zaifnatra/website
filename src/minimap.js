import './styles/minimap.css';

const points = [
  { id: 'campsite', label: 'Camp', x: 6.5, z: -11.3 },
  { id: 'register', label: 'Register', x: 0, z: -8 },
  { id: 'experience', label: 'Work', x: -5, z: -4 },
  { id: 'projects', label: 'Projects', x: 5, z: -3 },
  { id: 'outside', label: 'Photos', x: 4, z: 3 },
];
const mapX = x => 100 + x * 7;
const mapY = z => 100 + z * 7;
export function mountMinimap({ onOpen, onTime }) {
  const card = document.createElement('aside');
  card.className = 'radar-map'; card.setAttribute('aria-label', 'Trail minimap');
  card.innerHTML = `<div class="radar-title"><span id="radar-title">THE CLEARING</span><span>N ↑</span></div>
    <div class="radar-drawing"><svg viewBox="0 0 200 200" aria-hidden="true">
      <defs><radialGradient id="radar-light"><stop stop-color="#698786" stop-opacity=".25"/><stop offset="1" stop-color="#142c32" stop-opacity="0"/></radialGradient></defs>
      <circle cx="100" cy="100" r="94" fill="url(#radar-light)"/><g fill="none" stroke="#c6dedb" stroke-opacity=".13"><circle cx="100" cy="100" r="35"/><circle cx="100" cy="100" r="70"/><path d="M100 6v188M6 100h188"/></g>
      <g class="radar-clearing"><path d="M98 166 Q80 115 100 60 L100 30" fill="none" stroke="#cce2d3" stroke-opacity=".3" stroke-width="13" stroke-linecap="round"/><rect x="53" y="118" width="13" height="27" rx="3" fill="#7c9aab"/><path d="M85 34h30" stroke="#e4bf8b" stroke-width="5"/></g>
      <g id="radar-player"><circle r="8" fill="#f1c998" fill-opacity=".15"/><path d="M0-6 4 5 0 3-4 5Z" fill="#ffd4a0" stroke="#14313a" stroke-width="1"/></g>
    </svg>${points.map(point => `<button class="radar-waypoint radar-clearing" data-waypoint="${point.id}" style="left:${mapX(point.x)/2}%;top:${mapY(point.z)/2}%" aria-label="Open ${point.label}"><i></i><span>${point.label}</span></button>`).join('')}</div>
    <div class="camp-map-actions"><button type="button" data-camp-visit>Visit camp</button><button type="button" data-camp-time aria-pressed="false">Dusk</button></div><p class="radar-tip">Tap a marker to explore</p>`;
  document.body.append(card);
  card.querySelectorAll('[data-waypoint]').forEach(button => button.addEventListener('click', () => onOpen(button.dataset.waypoint)));
  card.querySelector('[data-camp-visit]').addEventListener('click',()=>onOpen('campsite'));
  const timeButton=card.querySelector('[data-camp-time]');
  timeButton.addEventListener('click',()=>{const dusk=timeButton.getAttribute('aria-pressed')!=='true';timeButton.setAttribute('aria-pressed',String(dusk));timeButton.textContent=dusk?'Daylight':'Dusk';onTime(dusk?'evening':'day');});
  const arrow = card.querySelector('#radar-player');
  return {
    update({ x, z, yaw }) {
      const px=mapX(x),py=mapY(z);
      arrow.setAttribute('transform',`translate(${px},${py}) rotate(${-yaw*180/Math.PI})`);
    },
  };
}
