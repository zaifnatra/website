import * as THREE from 'three';

/** Original campsite models. All GPU resources belong to the parent scene. */
export function addCampsite({ scene, assets, coarse, interactive, onInteract, onNotice }) {
  const camp = new THREE.Group(); camp.name = 'Coffee at camp'; scene.add(camp);
  const own = resource => { assets.add(resource); return resource; };
  const mat = options => own(new THREE.MeshStandardMaterial(options));
  const mesh = (geometry, material, position = [0, 0, 0], parent = camp) => {
    const object = new THREE.Mesh(own(geometry), material); object.position.set(...position);
    object.castShadow = object.receiveShadow = true; parent.add(object); return object;
  };
  const box = (w, h, d, material, position, parent) => mesh(new THREE.BoxGeometry(w, h, d), material, position, parent);
  const group = (name, position, parent = camp) => { const g = new THREE.Group(); g.name = name; g.position.set(...position); parent.add(g); return g; };
  const tube = (points, radius, material, parent = camp) => mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p))), points.length * 5, radius, 5, false), material, [0, 0, 0], parent);
  const canvasTexture = (w, h, paint) => { const c = document.createElement('canvas'); c.width = w; c.height = h; paint(c.getContext('2d'), w, h); const t = own(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; return t; };
  let seed = 716; const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const fabricTexture = canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = '#ddd5bd'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 11000; i++) { c.fillStyle = `rgba(85,65,40,${random() * .12})`; c.fillRect(random() * w, random() * h, 1, 2); }
    c.strokeStyle = '#bfb7a5'; c.lineWidth = .6;
    for (let i = 0; i < 256; i += 16) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, 256); c.moveTo(0, i); c.lineTo(256, i); c.stroke(); }
  }); fabricTexture.wrapS = fabricTexture.wrapT = THREE.RepeatWrapping; fabricTexture.repeat.set(3, 3);
  const fly = mat({ color: '#d87836', map: fabricTexture, bumpMap: fabricTexture, bumpScale: .009, roughness: .87, side: THREE.DoubleSide });
  const seam = mat({ color: '#eaa75f', roughness: .8 });
  const dark = mat({ color: '#242d2c', roughness: .9 });
  const metal = mat({ color: '#aeb4ab', metalness: .8, roughness: .34 });
  const cord = mat({ color: '#c4c858', roughness: .8 });
  const barkTexture = canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = '#5c4837'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 1100; i++) { c.strokeStyle = random() > .5 ? '#78634b' : '#3e342b'; c.lineWidth = .5 + random() * 2; const x = random() * w, y = random() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + random() * 5, y + random() * 60); c.stroke(); }
  });
  const wood = mat({ map: barkTexture, roughness: .98 });
  const rings = canvasTexture(256, 256, (c, w, h) => {
    c.fillStyle = '#ba9670'; c.fillRect(0, 0, w, h); c.strokeStyle = '#8a6847'; c.lineWidth = 2;
    for (let r = 8; r < 150; r += 5 + random() * 8) { c.beginPath(); c.ellipse(124, 131, r, r * .93, .2, 0, Math.PI * 2); c.stroke(); }
    for (let a = 0; a < 3; a++) { c.beginPath(); c.moveTo(128, 128); c.lineTo(128 + Math.cos(a * 2.2) * 128, 128 + Math.sin(a * 2.2) * 128); c.stroke(); }
  });
  const cutWood = mat({ map: rings, roughness: .94 });
  const log = (position, length, radius, rotation = [0, 0, 0], parent = camp, material = wood) => {
    const g = group('Split wood', position, parent); g.rotation.set(...rotation);
    mesh(new THREE.CylinderGeometry(radius * .9, radius, length, 11), material, [0, 0, 0], g);
    for (const side of [-1, 1]) { const end = mesh(new THREE.CircleGeometry(radius * .89, 16), cutWood, [0, side * (length / 2 + .001), 0], g); end.rotation.x = -side * Math.PI / 2; }
    return g;
  };
  const label = (text, width, height, position, parent, color = '#eee3c9') => {
    const texture = canvasTexture(768, 192, (c, w) => { c.fillStyle = color; c.font = '700 64px Cabin'; c.textAlign = 'center'; c.fillText(text, w / 2, 122); });
    return mesh(new THREE.PlaneGeometry(width, height), mat({ map: texture, transparent: true, roughness: .8, depthWrite: false }), position, parent);
  };
  const hitMat = own(new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false }));
  function target(parent, id, text, position, size, action) {
    const hit = box(...size, hitMat, position, parent); hit.castShadow = hit.receiveShadow = false;
    parent.updateWorldMatrix(true, true);
    interactive(hit, id, text, hit.getWorldPosition(new THREE.Vector3()).toArray(), action);
  }

  // A low two-person dome: tensioned panels, external crossed poles and an open vestibule.
  const tent = group('Ripstop dome tent', [6.1, .03, -14]); tent.rotation.y = -.18;
  box(2.12, .045, 2.85, dark, [0, .015, 0], tent);
  const roof = (theta, z) => {
    const taper = .84 + .16 * Math.cos(z / 1.4 * Math.PI / 2);
    return [1.08 * Math.cos(theta) * taper, .07 + 1.42 * Math.sin(theta) * taper + Math.sin(theta * 11 + z * 5) * .016 * Math.sin(theta), z];
  };
  const vertices = [], uvs = [], indices = [], across = 40, along = 20;
  for (let j = 0; j <= along; j++) for (let i = 0; i <= across; i++) {
    vertices.push(...roof(i / across * Math.PI, -1.4 + j / along * 2.8)); uvs.push(i / across, j / along);
    if (i < across && j < along) { const a = j * (across + 1) + i; indices.push(a, a + across + 1, a + 1, a + 1, a + across + 1, a + across + 2); }
  }
  const roofGeometry = new THREE.BufferGeometry(); roofGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); roofGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2)); roofGeometry.setIndex(indices); roofGeometry.computeVertexNormals(); mesh(roofGeometry, fly, [0, 0, 0], tent);
  // End panels leave a real doorway rather than painting an opening on solid fabric.
  function panel(points, material, parent = tent) { const shape = new THREE.Shape(points.map(p => new THREE.Vector2(...p))); return mesh(new THREE.ShapeGeometry(shape), material, [0, 0, 1.405], parent); }
  const doorOutline = [[-.87, .07], [-.81, .58], [-.56, 1.04], [0, 1.27], [.56, 1.04], [.81, .58], [.87, .07]];
  const back = panel(doorOutline, fly); back.position.z = -1.405;
  panel([[-.9, .07], [-.83, .64], [-.56, 1.05], [0, 1.27], [-.43, .92], [-.57, .07]], fly);
  panel([[.9, .07], [.57, .07], [.43, .92], [0, 1.27], [.56, 1.05], [.83, .64]], fly);
  tube([[-.57, .07, 1.42], [-.5, .7, 1.42], [0, 1.26, 1.42], [.5, .7, 1.42], [.57, .07, 1.42]], .012, dark, tent);
  const closedDoor = panel([[-.57, .07], [-.5, .7], [0, 1.26], [.5, .7], [.57, .07]], fly); closedDoor.visible = false;
  const rolledDoor = mesh(new THREE.CapsuleGeometry(.045, .58, 3, 12), fly, [-.69, .42, 1.45], tent); rolledDoor.rotation.z = -.18;
  for (const s of [-1, 1]) {
    tube([[s * 1.08, .07, -1.4], [s * .76, 1.02, -.85], [0, 1.52, 0], [-s * .76, 1.02, .85], [-s * 1.08, .07, 1.4]], .017, metal, tent);
    tube([[s * .9, .08, -1.4], [s * 1.06, .09, 0], [s * .9, .08, 1.4]], .011, seam, tent);
    for (const z of [-1.1, 1.1]) { tube([[s * .86, .54, z], [s * 1.48, .035, z * 1.48]], .004, cord, tent); tube([[s * 1.48, .03, z * 1.48], [s * 1.51, .12, z * 1.48]], .01, metal, tent); }
  }
  const pad = mat({ color: '#a2a46b', roughness: .94 });
  box(.59, .055, 1.85, pad, [-.18, .075, -.06], tent);
  for (let i = 0; i < 19; i++) { const ridge = mesh(new THREE.CapsuleGeometry(.028, .49, 2, 8), pad, [-.18, .11, -.9 + i * .094], tent); ridge.rotation.z = Math.PI / 2; }
  const sleepingBag = mesh(new THREE.CapsuleGeometry(.23, .99, 6, 20), mat({ color: '#214d53', roughness: .9, map: fabricTexture }), [-.16, .24, -.2], tent); sleepingBag.rotation.x = Math.PI / 2; sleepingBag.scale.z = .48;
  label('CAMP', .36, .09, [.67, .32, 1.43], tent);
  target(tent, 'camp-tent', 'Open / close the tent', [0, .65, 1.42], [1.35, 1.3, .12], () => { closedDoor.visible = !closedDoor.visible; rolledDoor.visible = !closedDoor.visible; onNotice(closedDoor.visible ? 'Tent zipped up.' : 'Tent open.'); });

  // Ash bowl, irregular stones, charred logs and an ember bed.
  const fire = group('Stone fire pit', [4.5, .02, -10.8]);
  const ash = mat({ color: '#262824', roughness: 1 });
  const ashDisk = mesh(new THREE.CircleGeometry(.66, 40), ash, [0, .004, 0], fire); ashDisk.rotation.x = -Math.PI / 2;
  const stone = mat({ color: '#78786c', roughness: 1, bumpMap: barkTexture, bumpScale: .035 });
  const rockGeometry = own(new THREE.DodecahedronGeometry(1, 1));
  for (let i = 0; i < 13; i++) { const a = i / 13 * Math.PI * 2; const rock = mesh(rockGeometry, stone, [Math.cos(a) * .61, .105, Math.sin(a) * .61], fire); rock.scale.set(.16 + random() * .05, .12 + random() * .04, .18 + random() * .04); rock.rotation.set(random(), random() * 3, random()); }
  const charred = mat({ color: '#2e221b', map: barkTexture, roughness: 1 });
  for (let i = 0; i < 5; i++) log([(i % 2 - .5) * .19, .13 + (i % 2) * .075, (i - 2) * .1], .72, .075, [Math.PI / 2, 0, i * 1.6], fire, charred);
  const emberMaterial = mat({ color: '#b23d0e', emissive: '#ff5a0b', emissiveIntensity: 2, roughness: 1 });
  const emberGeometry = own(new THREE.IcosahedronGeometry(.035, 0));
  const coals = new THREE.InstancedMesh(emberGeometry, emberMaterial, 45); fire.add(coals); const dummy = new THREE.Object3D();
  for (let i = 0; i < 45; i++) { const a = random() * 6.28, r = Math.sqrt(random()) * .4; dummy.position.set(Math.cos(a) * r, .045 + random() * .035, Math.sin(a) * r); dummy.scale.set(1 + random(), .6, 1 + random()); dummy.updateMatrix(); coals.setMatrixAt(i, dummy.matrix); }
  const light = new THREE.PointLight('#ff9c48', 7, 6, 2); light.position.set(4.5, .65, -10.8); camp.add(light);
  const flameUniforms = { time: { value: 0 }, strength: { value: 1 } };
  const flameMaterial = own(new THREE.ShaderMaterial({
    uniforms: flameUniforms, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `varying vec2 vUv; uniform float time; uniform float strength;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
      void main(){float y=vUv.y; float n=noise(vec2(vUv.x*7.,y*5.-time*2.4)); float sway=sin(y*8.-time*4.)*.06*y;
        float width=(1.-y)*(.34+.12*n); float edge=abs(vUv.x-.5+sway); float a=(1.-smoothstep(width*.45,width,edge))*(1.-smoothstep(.55,1.,y+n*.16));
        float core=pow(max(0.,1.-edge/max(width,.001)),3.)*(1.-y); vec3 col=mix(vec3(1.,.18,.015),vec3(1.,.83,.34),core);
        gl_FragColor=vec4(col*strength,a*.82);}`,
  }));
  const flames = group('Flames', [0, .12, 0], fire);
  for (let i = 0; i < 6; i++) {
    const angle = i * 2.4, height = .38 + random() * .4;
    for (let cross = 0; cross < 2; cross++) {
      const flame = mesh(new THREE.PlaneGeometry(.26 + random() * .15, height), flameMaterial, [Math.cos(angle) * .17, height / 2, Math.sin(angle) * .17], flames);
      flame.rotation.y = angle + cross * Math.PI / 2; flame.castShadow = flame.receiveShadow = false;
    }
  }

  // Shared GPU particle systems: soft smoke and coffee steam, plus a few rising sparks.
  function particles(count, origin, kind) {
    const positions = new Float32Array(count * 3), seeds = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { seeds[i * 3] = random(); seeds[i * 3 + 1] = random(); seeds[i * 3 + 2] = random(); }
    const geometry = own(new THREE.BufferGeometry()); geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)); geometry.setAttribute('seed', new THREE.BufferAttribute(seeds, 3));
    const uniforms = { time: { value: 0 }, viewport: { value: 800 }, boost: { value: 1 }, kind: { value: kind } };
    const material = own(new THREE.ShaderMaterial({ uniforms, transparent: true, depthWrite: false, blending: kind === 2 ? THREE.AdditiveBlending : THREE.NormalBlending,
      vertexShader: `attribute vec3 seed; uniform float time,viewport,boost,kind; varying float life; varying float rnd;
        void main(){float speed=kind==2.?.4:kind==1.?.24:.12; life=fract(seed.x+time*speed); rnd=seed.y;
        float spread=kind==1.?.04:kind==2.?.17:.2; float height=kind==1.?.72:kind==2.?1.8:2.8;
        vec3 p=position; p.x+=(seed.y-.5)*spread+sin(life*8.+seed.z*6.+time*.4)*spread*life+life*life*(kind==1.?.1:.5);
        p.z+=(seed.z-.5)*spread+cos(life*5.+seed.y*6.)*spread*life; p.y+=life*height;
        vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
        float size=kind==2.?.015:kind==1.?.06+life*.15:.19+life*.75;
        gl_PointSize=clamp(viewport*size*boost/max(1.,-mv.z),1.,180.); }`,
      fragmentShader: `uniform float kind; varying float life; varying float rnd;
        void main(){vec2 p=gl_PointCoord-.5; float r=length(p); float soft=1.-smoothstep(.06,.5,r);
        float fade=smoothstep(0.,.12,life)*(1.-smoothstep(.45,1.,life));
        vec3 color=kind==2.?vec3(1.,.43,.08):kind==1.?vec3(.95,.96,.92):vec3(.65,.67,.63);
        float opacity=kind==2.?.9:kind==1.?.19:.13; gl_FragColor=vec4(color,soft*soft*fade*opacity); }`,
    }));
    const points = new THREE.Points(geometry, material); points.position.set(...origin); points.frustumCulled = false; camp.add(points); return { points, uniforms };
  }
  const smoke = particles(coarse ? 15 : 26, [4.5, .52, -10.8], 0);
  const sparks = particles(coarse ? 12 : 20, [4.5, .23, -10.8], 2);
  let fireBoost = 0, coffeeBoost = 0;
  target(fire, 'camp-fire', 'Stoke the fire', [0, .45, 0], [1.4, .9, 1.4], () => { fireBoost = 1; onNotice('Fire stoked.'); });

  // A sitting log, woodpile, boots and a small stump coffee table.
  log([3.0, .24, -12.2], 1.6, .24, [Math.PI / 2, 0, -.6]);
  for (let i = 0; i < 5; i++) log([7.55 + (i % 2) * .13, .09 + Math.floor(i / 2) * .15, -12.3], .6, .075, [Math.PI / 2, 0, .15]);
  const table = group('Coffee stump', [6.4, 0, -10.4]); log([0, .28, 0], .56, .32, [0, 0, 0], table);
  const cup = group('Enamel coffee mug', [-.08, .565, .03], table);
  const enamel = mat({ color: '#ece6d5', metalness: .12, roughness: .28 });
  const blue = mat({ color: '#254b57', metalness: .35, roughness: .3 });
  mesh(new THREE.CylinderGeometry(.073, .066, .13, 32, 1, true), enamel, [0, .065, 0], cup);
  const rim = mesh(new THREE.TorusGeometry(.071, .005, 8, 32), blue, [0, .132, 0], cup); rim.rotation.x = Math.PI / 2;
  const handle = mesh(new THREE.TorusGeometry(.046, .009, 8, 24), blue, [.085, .072, 0], cup); handle.scale.x = .8;
  const coffee = mesh(new THREE.CircleGeometry(.067, 32), mat({ color: '#301c10', roughness: .19 }), [0, .115, 0], cup); coffee.rotation.x = -Math.PI / 2;
  label('LOJ', .072, .025, [0, .068, .068], cup, '#254b57');
  const steam = particles(coarse ? 14 : 24, [6.32, .71, -10.37], 1);
  target(table, 'camp-coffee', 'Brew another coffee', [0, .72, .04], [.7, .65, .7], () => { coffeeBoost = 1; onNotice('Fresh coffee.'); });
  // A brushed steel flask and folded map on the stump.
  mesh(new THREE.CylinderGeometry(.046, .046, .21, 20), metal, [.16, .68, -.1], table);
  mesh(new THREE.CylinderGeometry(.049, .049, .045, 20), dark, [.16, .808, -.1], table);
  const mapTex = canvasTexture(256, 256, c => {
    c.fillStyle = '#e1d7b8'; c.fillRect(0, 0, 256, 256); c.strokeStyle = '#a1ab87'; c.lineWidth = 1;
    for (let i = 0; i < 16; i++) { c.beginPath(); c.ellipse(40, 128, 20 + i * 12, 30 + i * 10, .4, 0, Math.PI * 2); c.stroke(); }
    c.strokeStyle = '#a66641'; c.lineWidth = 3; c.beginPath(); c.moveTo(40, 230); c.bezierCurveTo(60, 110, 200, 200, 160, 25); c.stroke(); c.fillStyle = '#374f43'; c.font = 'bold 16px Cabin'; c.fillText('HIGH PEAKS', 80, 28);
  });
  const map = mesh(new THREE.PlaneGeometry(.2, .25), mat({ map: mapTex, side: THREE.DoubleSide, roughness: .95 }), [-.12, .57, -.13], table); map.rotation.set(-Math.PI / 2, 0, .22);

  // L.I.M 35-inspired 59 × 31 × 25 cm pack: top lid, mesh pockets, cord and harness.
  const pack = group('Haglöfs L.I.M 35', [7.0, .04, -11.75]); pack.rotation.set(-.12, -.48, -.1);
  const packFabric = mat({ color: '#555e59', map: fabricTexture, bumpMap: fabricTexture, bumpScale: .006, roughness: .92 });
  const meshFabric = mat({ color: '#292f2a', roughness: 1, wireframe: true });
  const body = mesh(new THREE.SphereGeometry(1, 24, 20), packFabric, [0, .28, 0], pack); body.scale.set(.155, .28, .125);
  const lid = mesh(new THREE.SphereGeometry(1, 24, 14), packFabric, [0, .51, .01], pack); lid.scale.set(.17, .075, .142);
  box(.2, .35, .025, dark, [0, .3, -.115], pack);
  for (const side of [-1, 1]) {
    const pocket = mesh(new THREE.SphereGeometry(1, 16, 12), dark, [side * .14, .18, 0], pack); pocket.scale.set(.054, .12, .107);
    const net = mesh(new THREE.SphereGeometry(1, 12, 14), meshFabric, [side * .14, .185, .003], pack); net.scale.set(.056, .12, .109);
    tube([[side * .08, .49, -.08], [side * .12, .37, -.22], [side * .11, .19, -.23], [side * .065, .08, -.08]], .023, dark, pack);
    tube([[side * .11, .13, -.07], [side * .27, .095, -.13], [side * .3, .12, .02]], .026, dark, pack);
    box(.018, .31, .009, dark, [side * .09, .29, .118], pack);
    for (const y of [.2, .43]) box(.031, .022, .015, dark, [side * .09, y, .133], pack);
  }
  tube([[-.05, .53, -.055], [-.045, .594, -.06], [.045, .594, -.06], [.05, .53, -.055]], .007, dark, pack);
  tube([[-.09, .4, .126], [.09, .34, .134], [-.09, .27, .136], [.09, .2, .126], [-.09, .13, .108]], .003, cord, pack);
  label('HAGLÖFS', .19, .046, [0, .49, .151], pack); label('L.I.M 35', .14, .035, [0, .09, .12], pack, '#c9cf65');
  const bottle = mat({ color: '#6c8f86', metalness: .25, roughness: .4 });
  mesh(new THREE.CylinderGeometry(.033, .032, .17, 16), bottle, [-.17, .27, 0], pack); mesh(new THREE.CylinderGeometry(.023, .023, .025, 12), dark, [-.17, .367, 0], pack);
  target(pack, 'camp-pack', 'Read my camping notes', [0, .35, 0], [.65, .85, .6], () => onInteract('outside', 2));
  for (const x of [7.45, 7.6]) { tube([[x, .04, -11.8], [x - .3, 1.03, -12.5]], .009, metal); tube([[x - .3, 1.03, -12.5], [x - .34, 1.19, -12.61]], .022, dark); }
  const bootMat = mat({ color: '#786244', roughness: .95 });
  for (const x of [5.7, 6.0]) {
    const boot = mesh(new THREE.CapsuleGeometry(.085, .18, 4, 12), bootMat, [x, .1, -12.12]); boot.rotation.x = Math.PI / 2; boot.scale.y = 1.15;
    box(.16, .035, .36, dark, [x, .027, -12.12]);
    mesh(new THREE.CylinderGeometry(.072, .079, .16, 12), bootMat, [x, .17, -12.22]);
    const opening = mesh(new THREE.CircleGeometry(.058, 16), dark, [x, .252, -12.22]); opening.rotation.x = -Math.PI / 2;
    for (let i = 0; i < 4; i++) tube([[x - .037, .184, -12.16 + i * .029], [x + .037, .184, -12.14 + i * .029]], .003, cord);
  }

  // Warm lantern, with a real handle and metal cage.
  const lantern = group('Camp lantern', [5.25, .08, -12.45]);
  const lanternGlow = mat({ color: '#ffd990', emissive: '#ffc06b', emissiveIntensity: 2, roughness: .5 });
  mesh(new THREE.CylinderGeometry(.065, .074, .11, 20), lanternGlow, [0, .15, 0], lantern);
  for (const y of [.055, .225]) mesh(new THREE.CylinderGeometry(.09, .09, .025, 20), dark, [0, y, 0], lantern);
  mesh(new THREE.CylinderGeometry(.09, .1, .06, 20), dark, [0, .02, 0], lantern);
  for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2; tube([[Math.cos(a) * .075, .065, Math.sin(a) * .075], [Math.cos(a) * .075, .22, Math.sin(a) * .075]], .005, metal, lantern); }
  tube([[-.08, .22, 0], [-.09, .36, 0], [0, .4, 0], [.09, .36, 0], [.08, .22, 0]], .006, metal, lantern);
  const lamp = new THREE.PointLight('#ffcb83', 2.5, 3.2, 2); lamp.position.set(5.25, .4, -12.45); camp.add(lamp);
  target(lantern, 'camp-lantern', 'Switch the lantern on / off', [0, .25, 0], [.55, .6, .55], () => { lamp.visible = !lamp.visible; lanternGlow.emissiveIntensity = lamp.visible ? 2 : 0; onNotice(lamp.visible ? 'Lantern on.' : 'Lantern off.'); });

  // A modest direction sign keeps the camp discoverable on foot.
  const sign = group('Campsite direction', [6.9, 0, -5.9]);
  box(.085, 1.25, .085, wood, [0, .625, 0], sign);
  box(1.0, .25, .045, wood, [-.2, 1.13, .03], sign);
  label('CAMP ↑', .84, .19, [-.2, 1.13, .057], sign);

  let effectTime = 0;
  return {
    update(dt, reducedMotion, viewportHeight) {
      fireBoost = Math.max(0, fireBoost - dt * .18); coffeeBoost = Math.max(0, coffeeBoost - dt * .12);
      if (!reducedMotion) effectTime += dt;
      flameUniforms.time.value = effectTime; flameUniforms.strength.value = 1 + fireBoost * .4;
      flames.scale.y = 1 + fireBoost * .3;
      light.intensity = reducedMotion ? 7 : 7 + Math.sin(effectTime * 12) * .45 + Math.sin(effectTime * 19) * .25 + fireBoost * 3;
      emberMaterial.emissiveIntensity = reducedMotion ? 1.7 : 1.7 + Math.sin(effectTime * 3) * .3;
      for (const effect of [smoke, sparks, steam]) { effect.uniforms.time.value = effectTime; effect.uniforms.viewport.value = viewportHeight; effect.points.visible = !reducedMotion; }
      steam.uniforms.boost.value = 1 + coffeeBoost * .45;
    },
  };
}
