import * as THREE from 'three';
import { addWinterDetails } from './seasonal.js';
import { projects, hobbies } from './portfolio.js';

// An authored woodland clearing, informed by the Loj. This is not surveyed geometry.
export async function createTrailScene({ canvas, engine, onInteract = () => {}, onPageChange = () => {}, onReady = () => {}, onError = () => {} }) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  } catch (error) {
    onError(error);
    throw error;
  }
  const coarse = matchMedia('(pointer: coarse)').matches;
  renderer.setPixelRatio(Math.min(devicePixelRatio, coarse ? 1.35 : 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .95;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#aec1bf');
  scene.fog = new THREE.FogExp2('#87927d', 0.0035);
  const camera = new THREE.PerspectiveCamera(66, 1, 0.08, 230);
  camera.rotation.order = 'YXZ';
  const skyLight = new THREE.HemisphereLight('#dbe7ea', '#635a3b', 1.65);
  scene.add(skyLight);
  const sun = new THREE.DirectionalLight('#fff2cf', 2.5);
  sun.position.set(-28, 36, 17);
  sun.castShadow = true;
  sun.shadow.mapSize.set(coarse ? 1024 : 2048, coarse ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -38, right: 38, top: 42, bottom: -36, near: 1, far: 120 });
  sun.shadow.normalBias = 0.035;
  sun.shadow.bias = -0.00015;
  sun.shadow.radius = 3;
  sun.target.position.set(0, 0, -9);
  scene.add(sun, sun.target);
  let seed = 29211;
  function random() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 4294967296; }
  const range = (a, b) => a + random() * (b - a);
  const assets = new Set();
  function texture(size, paint, repeat = 1) {
    const el = document.createElement('canvas'); el.width = el.height = size;
    paint(el.getContext('2d'), size);
    const tex = new THREE.CanvasTexture(el); tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(repeat, repeat);
    tex.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8); assets.add(tex); return tex;
  }
  function panelTexture(width, height, paint) {
    const el=document.createElement('canvas');el.width=width;el.height=height;paint(el.getContext('2d'),width,height);
    const tex=new THREE.CanvasTexture(el);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);assets.add(tex);return tex;
  }
  function material(options) { const m = new THREE.MeshStandardMaterial(options); assets.add(m); return m; }
  function mesh(geometry, mat, position = [0, 0, 0], parent = scene) {
    assets.add(geometry); const m = new THREE.Mesh(geometry, mat); m.position.set(...position);
    m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  function box(x, y, z, mat, position, parent) { return mesh(new THREE.BoxGeometry(x, y, z), mat, position, parent); }
  const soilTex = texture(512, (ctx, s) => {
    ctx.fillStyle = '#685e42'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 42000; i++) {
      const v = Math.floor(range(45, 132)); ctx.fillStyle = `rgba(${v + 10},${v},${Math.max(25, v - 23)},${range(.15, .7)})`;
      ctx.fillRect(random() * s, random() * s, range(1, 4), range(1, 4));
    }
    for (let i = 0; i < 350; i++) {
      ctx.strokeStyle = 'rgba(52,42,29,.4)'; ctx.lineWidth = .7; ctx.beginPath();
      const x = random() * s, y = random() * s; ctx.moveTo(x, y); ctx.lineTo(x + range(-20, 20), y + range(-12, 12)); ctx.stroke();
    }
  }, 25);
  const ground = material({ map: soilTex, roughness: 1, color: '#a9a886' });
  const terrain=new THREE.PlaneGeometry(260,260,90,90);
  const terrainPositions=terrain.attributes.position;
  for(let i=0;i<terrainPositions.count;i++){
    const x=terrainPositions.getX(i),z=-20-terrainPositions.getY(i);
    const edge=Math.min(1,Math.max(0,Math.max(Math.abs(x)-10,-z-20,z-10)/14));
    terrainPositions.setZ(i,edge*(.45+Math.sin(x*.12)*Math.cos(z*.11)*1.4));
  }
  terrain.computeVertexNormals();
  const groundMesh = mesh(terrain, ground, [0, -.045, -20]); groundMesh.rotation.x = -Math.PI / 2; groundMesh.castShadow = false;
  const gravelTex = texture(512, (ctx, s) => {
    ctx.fillStyle = '#96948b'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 18000; i++) {
      const v = Math.floor(range(90, 175)); ctx.fillStyle = `rgb(${v + 5},${v + 3},${v - 4})`;
      ctx.beginPath(); ctx.ellipse(random() * s, random() * s, range(.6, 2.3), range(.6, 1.7), random() * Math.PI, 0, Math.PI * 2); ctx.fill();
    }
  }, 11);
  const gravel = material({ map: gravelTex, roughness: .98, color: '#c1b9a7' });
  const clearingShape=new THREE.Shape();
  for(let i=0;i<=32;i++){const angle=i/32*Math.PI*2,r=1+Math.sin(angle*7)*.035;const x=Math.cos(angle)*8*r,y=Math.sin(angle)*7*r;i?clearingShape.lineTo(x,y):clearingShape.moveTo(x,y);}
  const clearingGeometry=new THREE.ShapeGeometry(clearingShape);
  const clearingUV=clearingGeometry.attributes.uv;
  for(let i=0;i<clearingUV.count;i++)clearingUV.setXY(i,(clearingGeometry.attributes.position.getX(i)+8)/16,(clearingGeometry.attributes.position.getY(i)+7)/14);
  const lot = mesh(clearingGeometry, gravel, [0, -.018, 2]); lot.rotation.x = -Math.PI / 2; lot.castShadow = false;
  // A slightly irregular footpath leaves the clearing on the right side of the register.
  const pathMat = material({ map: soilTex, color: '#c4b595', roughness: 1, side: THREE.DoubleSide });
  const pathShape = new THREE.Shape(); pathShape.moveTo(-2, 1); pathShape.lineTo(2, 1); pathShape.lineTo(4, -10); pathShape.lineTo(5, -23); pathShape.lineTo(4, -50); pathShape.lineTo(2, -50); pathShape.lineTo(3, -23); pathShape.lineTo(2, -11); pathShape.closePath();
  const path = mesh(new THREE.ShapeGeometry(pathShape), pathMat, [0, .002, 0]); path.rotation.x = Math.PI / 2; path.castShadow = false;
  // Canvas bark has lengthwise fissures and lichen, rather than a flat cylinder colour.
  const barkTex = texture(256, (ctx, s) => {
    ctx.fillStyle = '#665c4c'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 1000; i++) {
      const v = Math.floor(range(37, 125)); ctx.strokeStyle = `rgba(${v + 8},${v + 4},${v},.65)`;
      ctx.lineWidth = range(.4, 3); const x = random() * s, y = random() * s; ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x + range(-3,3), y + range(5,80));ctx.stroke();
    }
    for(let i=0;i<80;i++){ctx.fillStyle='rgba(168,173,134,.25)';ctx.beginPath();ctx.ellipse(random()*s,random()*s,range(1,5),range(2,10),0,0,Math.PI*2);ctx.fill();}
  });
  const barkMat = material({ map: barkTex, roughness: .97, color: '#a6a094' });
  const leafTex = texture(512, (ctx, s) => {
    ctx.clearRect(0,0,s,s);
    // Open branching sprays: small individual leaves, never a solid oval billboard.
    for(let stem=0;stem<9;stem++){
      const angle=-1.55+stem*.37,length=range(140,230),endX=256+Math.cos(angle)*length,endY=460-Math.sin(Math.abs(angle)+.5)*length;
      ctx.strokeStyle='#4b4b2b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(256,490);ctx.quadraticCurveTo(256,290,endX,endY);ctx.stroke();
      for(let leaf=0;leaf<34;leaf++){
        const t=leaf/34,x=256*(1-t)+endX*t+range(-25,25),y=490*(1-t)+endY*t+range(-24,24);
        const shade=random();ctx.fillStyle=shade>.78?'#81905c':shade>.35?'#536e3b':'#304c2b';
        ctx.beginPath();ctx.ellipse(x,y,range(7,13),range(3,6),angle+range(-1,1),0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='rgba(158,167,113,.28)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x-6,y);ctx.lineTo(x+6,y);ctx.stroke();
      }
    }
  });
  const leafMat = material({ map: leafTex, alphaTest: .45, side: THREE.DoubleSide, roughness: 1, color: '#b5c389' });
  const pineTex = texture(256, (ctx, s) => {
    ctx.clearRect(0, 0, s, s);ctx.strokeStyle='#243c24';
    for(let i=0;i<1350;i++){
      const y=range(8,248), w=(y/256)*105, x=128+range(-w,w);
      ctx.strokeStyle = i%4===0?'#597046':'#263f2b';ctx.lineWidth=range(.7,1.5);
      ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+range(-9,9),y+range(2,12));ctx.stroke();
    }
  });
  const pineMat = material({ map: pineTex, alphaTest: .4, side: THREE.DoubleSide, roughness: 1 });
  // Batch every canopy and trunk to keep the forest inexpensive on phones.
  const treeCount = coarse ? 145 : 230;
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.15, .24, 1, 9), barkMat, treeCount);
  const branches = new THREE.InstancedMesh(new THREE.CylinderGeometry(.025, .065, 1, 5), barkMat, treeCount * 4);
  const crowns = new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1), leafMat, treeCount * 12);
  const firs = new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1), pineMat, treeCount * 3);
  assets.add(trunks.geometry);assets.add(branches.geometry);assets.add(crowns.geometry);assets.add(firs.geometry);
  trunks.castShadow = branches.castShadow = crowns.castShadow = true;
  trunks.receiveShadow = crowns.receiveShadow = true;
  scene.add(trunks, branches, crowns, firs);
  const dummy = new THREE.Object3D(); const direction = new THREE.Vector3(); const up = new THREE.Vector3(0,1,0);
  let leafIndex=0, firIndex=0;
  for(let i=0;i<treeCount;i++){
    let x,z;
    do { x=range(-42,42);z=range(-55,25); } while((Math.abs(x)<10 && z>-20 && z<11) || (Math.abs(x-3)<2.5 && z<-18));
    const height=range(8,17), radius=range(.9,1.8);
    dummy.position.set(x,height/2,z);dummy.rotation.set(0,range(0,6.28),range(-.035,.035));dummy.scale.set(radius,height,radius);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);
    const evergreen=false;
    for(let b=0;b<4;b++){
      const angle=range(0,Math.PI*2), reach=range(1.3,3.4), base=height*range(.52,.82);
      direction.set(Math.sin(angle)*reach,range(.6,2),Math.cos(angle)*reach);
      dummy.position.set(x+direction.x/2,base+direction.y/2,z+direction.z/2);dummy.quaternion.setFromUnitVectors(up,direction.clone().normalize());dummy.scale.set(1,direction.length(),1);dummy.updateMatrix();branches.setMatrixAt(i*4+b,dummy.matrix);
    }
    if(evergreen){
      for(let j=0;j<3;j++){dummy.position.set(x,height*.63,z);dummy.rotation.set(0,j*Math.PI/3,0);dummy.scale.set(height*.51,height*.9,1);dummy.updateMatrix();firs.setMatrixAt(firIndex++,dummy.matrix);}
    }else{
      for(let j=0;j<12;j++){
        const angle=range(0,6.28), spread=range(.5,2.8);
        dummy.position.set(x+Math.cos(angle)*spread,height*range(.6,.98),z+Math.sin(angle)*spread);dummy.rotation.set(range(-.8,.8),range(0,6.28),range(-.6,.6));dummy.scale.set(range(2.5,3.9),range(2.5,4.2),1);dummy.updateMatrix();crowns.setMatrixAt(leafIndex++,dummy.matrix);
      }
    }
  }
  crowns.count=leafIndex;firs.count=firIndex;
  // Ferns and grasses soften the edge of the road.
  const fernTex = texture(256, (ctx,s)=>{
    ctx.clearRect(0,0,s,s);
    for(let f=0;f<9;f++){
      const endX=range(8,248),endY=range(15,150);
      ctx.strokeStyle='#4f6035';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(128,250);ctx.quadraticCurveTo(128,endY,endX,endY);ctx.stroke();
      for(let p=0;p<16;p++){
        const t=p/17,x=(1-t)*(1-t)*128+2*(1-t)*t*128+t*t*endX,y=(1-t)*(1-t)*250+2*(1-t)*t*endY+t*t*endY;
        const len=Math.sin(t*Math.PI)*range(8,17);ctx.strokeStyle=p%3?'#657846':'#8b9856';ctx.lineWidth=2.5;
        ctx.beginPath();ctx.moveTo(x-len,y-6);ctx.lineTo(x,y);ctx.lineTo(x+len,y-8);ctx.stroke();
      }
    }
  });
  const fernMat=material({map:fernTex,alphaTest:.4,side:THREE.DoubleSide,roughness:1});
  const ferns=new THREE.InstancedMesh(new THREE.PlaneGeometry(1,1),fernMat,450);assets.add(ferns.geometry);scene.add(ferns);
  for(let i=0;i<450;i++){
    let x=range(-25,25),z=range(-32,17);
    if(Math.abs(x)<9&&z>-20&&z<10)x=(x<0?-1:1)*range(8.7,12.5);
    if(Math.abs(x-3)<2.3&&z<-15)x+=5;
    const h=range(.35,1.1);dummy.position.set(x,h*.4,z);dummy.rotation.set(0,range(0,6.28),0);dummy.scale.set(h*1.5,h,1);dummy.updateMatrix();ferns.setMatrixAt(i,dummy.matrix);
  }
  const stoneMat=material({color:'#77766b',roughness:1});
  const rocks=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),stoneMat,90);assets.add(rocks.geometry);scene.add(rocks);rocks.castShadow=rocks.receiveShadow=true;
  for(let i=0;i<90;i++){
    let x=range(-24,24),z=range(-34,15);if(Math.abs(x)<9&&z>-20&&z<10)x=(x<0?-1:1)*range(8.9,12.5);
    dummy.position.set(x,range(-.1,.15),z);dummy.rotation.set(random()*3,random()*3,random()*3);dummy.scale.set(range(.16,.7),range(.12,.4),range(.2,.8));dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);
  }
  // Weathered, open-sided timber register at the entrance to the foot trail.
  const woodTex=texture(512,(ctx,s)=>{
    ctx.fillStyle='#7c6448';ctx.fillRect(0,0,s,s);
    for(let i=0;i<2400;i++){const v=Math.floor(range(40,125));ctx.strokeStyle=`rgba(${v+30},${v+13},${v},.35)`;ctx.lineWidth=range(.4,2);const x=random()*s,y=random()*s;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+range(-2,2),y+range(20,220));ctx.stroke();}
    for(let i=0;i<8;i++){const x=random()*s,y=random()*s;ctx.strokeStyle='rgba(38,28,18,.3)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y,range(4,10),range(16,28),0,0,Math.PI*2);ctx.stroke();}
  });
  const wood=material({map:woodTex,color:'#8f8170',roughness:.91});
  const darkWood=material({map:woodTex,color:'#5d5140',roughness:.98});
  const kiosk=new THREE.Group();kiosk.position.set(0,0,-8);scene.add(kiosk);
  for(const x of [-2.15,2.15]){
    box(.22,3.1,.22,wood,[x,1.55,0],kiosk);
    const footing=material({color:'#65645a',roughness:1});box(.36,.12,.36,footing,[x,.03,0],kiosk);
  }
  box(4.5,.18,.25,wood,[0,.83,0],kiosk);box(4.5,.18,.25,wood,[0,2.78,0],kiosk);
  box(4.14,1.68,.12,darkWood,[0,1.82,0],kiosk);
  for(let p=0;p<16;p++)box(.245,1.68,.045,wood,[-1.94+p*.258,1.82,.085],kiosk);
  // Roof slopes toward both sides and projects beyond the board.
  const roofMat=material({color:'#40473c',roughness:.91});
  for(const side of [-1,1]){const roof=box(2.72,.12,3.0,roofMat,[side*1.25,3.13,.55],kiosk);roof.rotation.z=-side*.2;}
  box(4.9,.32,.12,wood,[0,2.9,2.03],kiosk);box(4.9,.13,.12,wood,[0,2.87,-.95],kiosk);
  for(const x of [-2.15,2.15]){
    box(.22,2.9,.22,wood,[x,1.45,1.65],kiosk);
    const brace=box(.15,.88,.15,wood,[x-Math.sign(x)*.26,2.55,1.65],kiosk);brace.rotation.z=Math.sign(x)*-.62;
  }
  for(let i=0;i<17;i++)box(.247,.1,2.0,darkWood,[-2.06+i*.257,.08,.8],kiosk);
  const fasciaTex=texture(1024,(ctx,s)=>{ctx.fillStyle='#433e31';ctx.fillRect(0,0,s,s);ctx.fillStyle='#dfbc52';ctx.textAlign='center';ctx.font='bold 105px sans-serif';ctx.translate(s/2,s/2);ctx.scale(1,5.5);ctx.fillText('REGISTER HERE',0,35);});
  mesh(new THREE.PlaneGeometry(3.45,.34),material({map:fasciaTex,roughness:1}),[0,2.91,2.1],kiosk);
  for(const [words,y] of [[['ALL DOGS','MUST','BE LEASHED'],2.35],[['SKIS OR','SNOWSHOES','IN WINTER'],1.92]]){
    const ruleTex=texture(256,(ctx,s)=>{ctx.fillStyle='#e4bb4d';ctx.fillRect(0,0,s,s);ctx.strokeStyle='#514b30';ctx.strokeRect(8,8,s-16,s-16);ctx.fillStyle='#33392c';ctx.textAlign='center';ctx.font='bold 33px sans-serif';words.forEach((line,i)=>ctx.fillText(line,s/2,75+i*48));});
    mesh(new THREE.PlaneGeometry(.4,.35),material({map:ruleTex,roughness:1}),[2.15,y,1.79],kiosk);
  }
  const nailMat=material({color:'#353936',metalness:.65,roughness:.5});
  for(const x of [-2.15,2.15])for(const y of [.85,2.77]){const n=mesh(new THREE.CylinderGeometry(.025,.025,.025,8),nailMat,[x,y,.14],kiosk);n.rotation.x=Math.PI/2;}
  const titleTex=texture(1024,(ctx,s)=>{
    ctx.fillStyle='#234132';ctx.fillRect(0,0,s,s);ctx.strokeStyle='#ced1a9';ctx.lineWidth=12;ctx.strokeRect(18,18,s-36,s-36);
    ctx.fillStyle='#f1ecd5';ctx.textAlign='center';ctx.font='bold 67px Georgia';ctx.translate(s/2,s/2);ctx.scale(1,6);ctx.fillText('ADIRONDACK HIGH PEAKS',0,22);
  });
  const titleMat=material({map:titleTex,roughness:.8});
  const title=mesh(new THREE.PlaneGeometry(3.95,.47),titleMat,[0,2.42,.14],kiosk);title.castShadow=false;
  const mapTex=texture(1024,(ctx,s)=>{
    ctx.fillStyle='#e8e5cc';ctx.fillRect(0,0,s,s);
    ctx.strokeStyle='#d0d2b5';ctx.lineWidth=2;
    for(let r=30;r<850;r+=26){ctx.beginPath();for(let k=0;k<=90;k++){const a=k/90*Math.PI*2,rr=r*(1+Math.sin(a*5+r*.01)*.09);const x=590+Math.cos(a)*rr*.6,y=570+Math.sin(a)*rr; k?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
    ctx.fillStyle='#254537';ctx.font='bold 56px sans-serif';ctx.fillText('FROM THE LOJ',65,88);ctx.font='25px sans-serif';ctx.fillText('A SCHEMATIC OF THE HIGH PEAKS',65,130);
    const line=(points,color)=>{ctx.strokeStyle=color;ctx.lineWidth=10;ctx.lineJoin='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();};
    line([[180,235],[265,320],[390,350],[470,480],[590,535]],'#507c95');
    line([[590,535],[670,650],[620,770],[700,890]],'#b89d40');
    line([[390,350],[310,490],[240,620],[300,730]],'#64754d');
    ctx.fillStyle='#85a9ae';ctx.beginPath();ctx.ellipse(610,766,20,44,-.4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(700,889,26,45,-.4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#253c30';ctx.font='bold 32px sans-serif';ctx.fillText('Adirondak Loj',65,205);ctx.fillText('Marcy Dam',500,480);ctx.fillText('Algonquin Peak',60,790);ctx.font='bold 27px sans-serif';ctx.fillText('Avalanche Lake',680,740);ctx.fillText('Lake Colden',740,895);
    ctx.font='23px sans-serif';ctx.fillText('TRAILHEAD',65,250);ctx.fillText('Van Hoevenberg Trail',390,305);ctx.fillText('Not for navigation',65,975);
    ctx.fillStyle='#b46439';ctx.beginPath();ctx.arc(180,235,13,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#fff8df';ctx.lineWidth=4;ctx.stroke();
    ctx.fillStyle='#264436';ctx.font='bold 24px sans-serif';ctx.fillText('N',922,190);ctx.beginPath();ctx.moveTo(930,205);ctx.lineTo(916,250);ctx.lineTo(930,240);ctx.lineTo(944,250);ctx.closePath();ctx.fill();
  });
  const mapMat=material({map:mapTex,roughness:.9});mesh(new THREE.PlaneGeometry(1.94,1.35),mapMat,[1.02,1.48,.14],kiosk).castShadow=false;
  const noticeTex=texture(1024,(ctx,s)=>{
    ctx.fillStyle='#ede8d5';ctx.fillRect(0,0,s,s);ctx.fillStyle='#283d2f';ctx.textAlign='center';ctx.font='bold 75px Georgia';ctx.fillText('WELCOME,',s/2,140);ctx.fillText('HIKER.',s/2,230);
    ctx.font='38px sans-serif';['Please sign the trail register','before you head into the woods.','','Leave only footprints.','Take only memories.'].forEach((t,i)=>ctx.fillText(t,s/2,350+i*65));
    ctx.strokeStyle='#9b9c82';ctx.lineWidth=2;ctx.strokeRect(80,720,864,200);ctx.font='bold 30px sans-serif';ctx.fillText('REGISTER BELOW',s/2,790);ctx.font='27px sans-serif';ctx.fillText('Keep the wilderness wild.',s/2,865);
  });
  mesh(new THREE.PlaneGeometry(1.8,1.35),material({map:noticeTex,roughness:1}),[-1.02,1.48,.14],kiosk).castShadow=false;
  box(1.2,.42,.28,wood,[-1.02,.7,.28],kiosk);const lid=box(1.3,.055,.45,wood,[-1.02,.94,.35],kiosk);lid.rotation.x=.11;
  const paperMat=material({color:'#eee9d4',roughness:1});const book=box(.38,.022,.27,paperMat,[-1.02,.98,.35],kiosk);book.rotation.y=.08;
  // Timber rails and boulders frame the pedestrian entrance.
  for(const side of [-1,1])for(let i=0;i<1;i++){
    const x=side*(7.9+i*3.2);box(.17,1,.17,wood,[x,.5,-8.8]);box(2,.13,.13,wood,[x+side*1,.7,-8.8]);
  }
  // Trail direction fingerboards, close enough to inspect while walking.
  const directionGroup=new THREE.Group();directionGroup.position.set(5.4,0,-12);scene.add(directionGroup);
  box(.17,2.45,.17,darkWood,[0,1.2,0],directionGroup);
  for(const [text,y] of [['ALGONQUIN PEAK  ↗',2.13],['LAKE COLDEN  ↗',1.77]]){
    const signTex=texture(1024,(ctx,s)=>{ctx.fillStyle='#354b35';ctx.fillRect(0,0,s,s);ctx.fillStyle='#f4edce';ctx.font='bold 70px sans-serif';ctx.textAlign='center';ctx.translate(s/2,s/2);ctx.scale(1,7);ctx.fillText(text,0,23);});
    box(2.2,.3,.09,darkWood,[.4,y,.02],directionGroup);mesh(new THREE.PlaneGeometry(2.16,.28),material({map:signTex,roughness:1}),[.4,y,.07],directionGroup);
  }
  // Personal field notes live on real objects in the clearing.
  const interactionPoints = [
    { id:'register', label:'Open the trail register', position:new THREE.Vector3(0,1.65,-6.8), group:kiosk },
  ];
  function interactive(group,id,label,position,action){group.userData.interaction=id;interactionPoints.push({id,label,position:new THREE.Vector3(...position),group,action});}
  kiosk.userData.interaction='register';
  const paper=material({color:'#e3ddca',roughness:.96});
  const pin=material({color:'#a4a28f',roughness:.6,metalness:.6});
  function pinPaper(group,x,y,z,w,h,tex,angle=0){
    const note=mesh(new THREE.PlaneGeometry(w,h),material({map:tex,roughness:.93}),[x,y,z],group);note.rotation.z=angle;note.castShadow=false;
    const thumb=mesh(new THREE.SphereGeometry(.022,8,6),pin,[x,y+h*.43,z+.015],group);thumb.scale.z=.35;return note;
  }
  const workBoard=new THREE.Group();workBoard.position.set(-5,0,-4);workBoard.rotation.y=.27;scene.add(workBoard);
  for(const x of [-1.3,1.3])box(.12,2.18,.12,darkWood,[x,1.09,0],workBoard);
  box(2.82,1.78,.1,darkWood,[0,1.73,0],workBoard);
  for(let i=0;i<11;i++)box(.245,1.7,.025,wood,[-1.25+i*.25,1.73,.065],workBoard);
  box(3,.09,.4,darkWood,[0,2.67,0],workBoard);
  const workTitle=panelTexture(1300,180,(ctx,w,h)=>{
    ctx.fillStyle='#263d32';ctx.fillRect(0,0,w,h);ctx.fillStyle='#eee4c8';ctx.font='bold 57px Georgia';ctx.fillText('EXPERIENCE',58,83);ctx.font='22px sans-serif';ctx.fillStyle='#b6bba0';ctx.fillText('HUZAIFA FAREED  /  PEOPLE, SOFTWARE & USEFUL THINGS',60,133);
  });
  pinPaper(workBoard,0,2.28,.09,2.6,.36,workTitle);
  const employers=[['shopify','01','Shopify','Building for merchants.','#b4c092'],['mlh','02','Meta × MLH','Learning by building together.','#aabdc5'],['bombardier','03','Bombardier','Software, in the real world.','#cbb595']];
  for(const [i,[key,number,name,copy,color]] of employers.entries()){
    const note=panelTexture(480,630,(ctx,w,h)=>{
      ctx.fillStyle='#e5dfcd';ctx.fillRect(0,0,w,h);ctx.fillStyle=color;ctx.fillRect(0,0,w,17);
      ctx.fillStyle='#79816d';ctx.font='26px monospace';ctx.fillText(number,38,83);ctx.fillStyle='#26392e';ctx.font='bold 45px Georgia';ctx.fillText(name,35,194);
      ctx.font='25px sans-serif';const words=copy.split(' ');let line='',y=270;for(const word of words){if(ctx.measureText(line+word).width>400){ctx.fillText(line,37,y);line='';y+=37;}line+=word+' ';}ctx.fillText(line,37,y);
      ctx.strokeStyle='#b6b6a1';ctx.lineWidth=1;for(let k=0;k<5;k++){ctx.beginPath();ctx.moveTo(38,390+k*28);ctx.lineTo(420-(k%2)*70,390+k*28);ctx.stroke();}
      ctx.fillStyle='#596951';ctx.font='24px monospace';ctx.fillText('OPEN FIELD NOTE ↗',37,578);
    });
    const fieldNote=pinPaper(workBoard,(i-1)*.85,1.48,.105,.77,1.01,note,(i-1)*.025);
    workBoard.updateWorldMatrix(true,true);
    interactive(fieldNote,`experience-${key}`,`Read about ${name}`,fieldNote.getWorldPosition(new THREE.Vector3()).toArray());
  }
  interactive(workBoard,'experience','Read my work field notes',[-5,1.6,-4]);

  const projectsBench=new THREE.Group();projectsBench.position.set(5,0,-3);scene.add(projectsBench);
  for(const x of [-1.1,1.1]){box(.17,.67,.46,darkWood,[x,.34,0],projectsBench);box(.57,.1,.67,darkWood,[x,.09,0],projectsBench);}
  for(let p=0;p<4;p++)box(2.8,.09,.155,wood,[0,.73,-.24+p*.16],projectsBench);
  box(2.35,.11,.1,darkWood,[0,.31,0],projectsBench);
  // Separate solid covers from the printed pages; the former tilt pushed the
  // bottom of the book through the bench and its front label.
  const notebook=new THREE.Group();notebook.position.set(-.13,.99,.02);notebook.rotation.set(-1.22,-.12,0);projectsBench.add(notebook);
  const cover=material({color:'#425843',roughness:.97});box(1.37,.94,.055,cover,[0,0,0],notebook);box(1.3,.88,.045,paper,[0,0,.04],notebook);
  const folioImages=new Map();let projectPage=0,outsidePage=0;
  function wrapText(ctx,text,x,y,width,lineHeight,maxLines=5){
    let line='',count=0;
    for(const word of text.split(' ')){
      if(ctx.measureText(`${line}${word}`).width>width&&line){ctx.fillText(line.trim(),x,y);y+=lineHeight;line='';if(++count>=maxLines)return;}
      line+=`${word} `;
    }ctx.fillText(line.trim(),x,y);
  }
  function drawImageFit(ctx,img,x,y,w,h,cover=false){
    const ratio=cover?Math.max(w/img.width,h/img.height):Math.min(w/img.width,h/img.height);
    ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();ctx.drawImage(img,x+(w-img.width*ratio)/2,y+(h-img.height*ratio)/2,img.width*ratio,img.height*ratio);ctx.restore();
  }
  const journalTex=panelTexture(1400,940,()=>{});
  function paintProject(){
    const project=projects[projectPage],ctx=journalTex.image.getContext('2d');
    ctx.fillStyle='#e9e2cf';ctx.fillRect(0,0,1400,940);ctx.fillStyle='#c6c1af';ctx.fillRect(694,0,12,940);
    ctx.strokeStyle='#d2cbb9';ctx.lineWidth=1;for(let y=250;y<760;y+=50){ctx.beginPath();ctx.moveTo(55,y);ctx.lineTo(640,y);ctx.stroke();}
    ctx.fillStyle='#66765e';ctx.font='25px monospace';ctx.fillText(`PROJECT ${String(projectPage+1).padStart(2,'0')} / ${projects.length}`,55,88);
    ctx.fillStyle='#233e30';ctx.font='bold 55px Georgia';wrapText(ctx,project.title,55,180,570,65,2);
    ctx.font='29px sans-serif';wrapText(ctx,project.copy,55,340,560,45,7);
    ctx.fillStyle='#805e36';ctx.font='25px monospace';ctx.fillText('READ THIS PROJECT ↗',55,790);
    ctx.fillStyle='#d7dacd';ctx.fillRect(755,110,585,545);
    const img=folioImages.get(project.image);if(img)drawImageFit(ctx,img,755,110,585,545);
    ctx.fillStyle='#334b39';ctx.font='28px sans-serif';wrapText(ctx,project.kicker,760,710,570,38,2);
    ctx.font='24px monospace';ctx.fillText(`${projectPage+1} / ${projects.length}`,1020,800);
    journalTex.needsUpdate=true;
  }
  paintProject();
  mesh(new THREE.PlaneGeometry(1.28,.86),material({map:journalTex,roughness:1}),[0,0,.085],notebook).castShadow=false;
  // A separate hinged sheet supplies a brief, real page turn without coplanar faces.
  const turningLeafTex=panelTexture(700,940,()=>{}),leafGeo=new THREE.PlaneGeometry(.64,.86);leafGeo.translate(.32,0,0);
  const leaf=mesh(leafGeo,material({map:turningLeafTex,side:THREE.DoubleSide,roughness:1}),[0,0,.11],notebook);leaf.visible=false;leaf.castShadow=false;
  let pageTurn=null;
  function startPageTurn(direction){
    turningLeafTex.image.getContext('2d').drawImage(journalTex.image,direction>0?700:0,0,700,940,0,0,700,940);turningLeafTex.needsUpdate=true;
    leaf.rotation.y=direction>0?0:-Math.PI;leaf.visible=true;pageTurn={start:performance.now(),direction};
  }
  function pageButton(parent,x,y,z,label,id,action){
    const tex=panelTexture(450,180,(ctx,w,h)=>{ctx.fillStyle='#344d3e';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#c3c5a4';ctx.lineWidth=5;ctx.strokeRect(8,8,w-16,h-16);ctx.fillStyle='#f2ead4';ctx.font='bold 58px sans-serif';ctx.textAlign='center';ctx.fillText(label,w/2,112);});
    const button=mesh(new THREE.PlaneGeometry(.46,.184),material({map:tex,roughness:1}),[x,y,z],parent);button.castShadow=false;
    // Broad lower-page targets leave room for imprecise aiming and touch input.
    // Keep them just ahead of the paper so its larger Read target cannot win.
    const hitArea=mesh(new THREE.PlaneGeometry(.64,.34),material({transparent:true,opacity:0,depthWrite:false,colorWrite:false}),[0,.025,.006],button);
    hitArea.castShadow=false;hitArea.receiveShadow=false;
    parent.updateWorldMatrix(true,true);interactive(button,id,`${id.endsWith('prev')?'Previous':'Next'} ${id.startsWith('projects')?'project':'photo'} page`,button.getWorldPosition(new THREE.Vector3()).toArray(),action);
    return button;
  }
  function setPage(kind,index,animate=false){
    if(kind==='projects'){
      const next=Math.max(0,Math.min(projects.length-1,index));if(next===projectPage)return;
      if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)startPageTurn(next>projectPage?1:-1);
      projectPage=next;paintProject();
    }else if(kind==='outside'){
      const next=Math.max(0,Math.min(hobbies.length-1,index));if(next===outsidePage)return;
      outsidePage=next;paintOutside();
    }
  }
  function turnPage(kind,delta){
    const before=kind==='projects'?projectPage:outsidePage;
    setPage(kind,before+delta,true);
    onPageChange(kind,kind==='projects'?projectPage:outsidePage);
  }
  pageButton(notebook,-.35,-.33,.112,'← PREV','projects-prev',()=>turnPage('projects',-1));
  pageButton(notebook,.35,-.33,.112,'NEXT →','projects-next',()=>turnPage('projects',1));
  // A small enamel cup and pencil make this feel like a notebook someone left open.
  const enamel=material({color:'#bbc9bc',roughness:.38,metalness:.2});mesh(new THREE.CylinderGeometry(.11,.09,.18,20),enamel,[.98,.88,0],projectsBench);
  const mugInside=mesh(new THREE.CircleGeometry(.09,20),material({color:'#3d4131',roughness:1}),[.98,.976,0],projectsBench);mugInside.rotation.x=-Math.PI/2;
  const handle=mesh(new THREE.TorusGeometry(.075,.015,8,16),enamel,[1.11,.89,0],projectsBench);handle.rotation.y=Math.PI/2;
  const pencil=mesh(new THREE.CylinderGeometry(.009,.009,.32,6),material({color:'#a88840',roughness:.8}),[-1,.8,.06],projectsBench);pencil.rotation.z=1.3;
  const benchLabel=panelTexture(1200,150,(ctx,w,h)=>{ctx.fillStyle='#43503b';ctx.fillRect(0,0,w,h);ctx.fillStyle='#e7dfc7';ctx.font='bold 63px Georgia';ctx.fillText('PROJECTS',45,96);ctx.font='26px monospace';ctx.fillText('OPEN THE FIELD NOTEBOOK ↗',520,91);});
  mesh(new THREE.PlaneGeometry(2.4,.3),material({map:benchLabel,roughness:1}),[0,.59,.335],projectsBench).castShadow=false;
  interactive(projectsBench,'projects','Open the project notebook',[5,1.05,-3]);

  const outsideStand=new THREE.Group();outsideStand.position.set(4,0,3);outsideStand.rotation.y=-1.65;scene.add(outsideStand);
  for(const x of [-.58,.58])box(.1,1.98,.1,darkWood,[x,.99,0],outsideStand);
  box(1.75,1.46,.08,wood,[0,1.43,0],outsideStand);
  const outsideTitle=panelTexture(1000,150,(ctx,w,h)=>{ctx.fillStyle='#364636';ctx.fillRect(0,0,w,h);ctx.fillStyle='#e9dfc4';ctx.font='bold 63px Georgia';ctx.fillText('OUTSIDE',40,99);ctx.font='23px monospace';ctx.fillText('THE BITS IN BETWEEN',420,94);});
  pinPaper(outsideStand,0,2.05,.075,1.65,.2,outsideTitle);
  // The photo album sits clearly in front of its board, including its caption.
  const albumFrame=box(1.55,1.02,.025,paper,[0,1.38,.09],outsideStand);
  const albumTex=panelTexture(1200,840,()=>{});
  function paintOutside(){
    const item=hobbies[outsidePage],ctx=albumTex.image.getContext('2d');
    ctx.fillStyle='#ece6d6';ctx.fillRect(0,0,1200,840);
    const img=folioImages.get(item.image);if(img)drawImageFit(ctx,img,32,30,1136,610,true);
    ctx.fillStyle='#485c45';ctx.font='24px monospace';ctx.fillText(item.kicker.toUpperCase(),40,690);
    ctx.fillStyle='#263e30';ctx.font='bold 39px Georgia';wrapText(ctx,item.title,40,750,1100,43,2);
    albumTex.needsUpdate=true;
  }
  paintOutside();
  mesh(new THREE.PlaneGeometry(1.49,.98),material({map:albumTex,roughness:1}),[0,1.38,.125],outsideStand).castShadow=false;
  albumFrame.castShadow=false;
  pageButton(outsideStand,-.52,.79,.13,'← PREV','outside-prev',()=>turnPage('outside',-1));
  pageButton(outsideStand,.52,.79,.13,'NEXT →','outside-next',()=>turnPage('outside',1));
  interactive(outsideStand,'outside','Read this photo story',[4,1.45,3]);

  // Floating pollen catches the afternoon light, with subdued motion.
  const motesGeo=new THREE.BufferGeometry();const motePositions=new Float32Array(180*3);
  for(let i=0;i<180;i++){motePositions[i*3]=range(-22,22);motePositions[i*3+1]=range(.4,10);motePositions[i*3+2]=range(-35,18);}motesGeo.setAttribute('position',new THREE.BufferAttribute(motePositions,3));assets.add(motesGeo);
  const motesMat=new THREE.PointsMaterial({color:'#fff2c5',size:.035,transparent:true,opacity:.45,depthWrite:false});assets.add(motesMat);const motes=new THREE.Points(motesGeo,motesMat);scene.add(motes);
  let active=false,disposed=false,raf=0,previous=0,elapsed=0,mobileForward=0,mobileStrafe=0,yawDelta=0,pitchDelta=0,drag=null,lookEnabled=true;
  const keys=new Set();const cleanup=[];const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  engine.set_bob?.(reducedMotion ? 0 : 1);
  const listen=(target,name,fn,opts)=>{target.addEventListener(name,fn,opts);cleanup.push(()=>target.removeEventListener(name,fn,opts));};
  const raycaster=new THREE.Raycaster();const pointer=new THREE.Vector2();
  function distanceTo(point){return Math.hypot(engine.get_x()-point.position.x,engine.get_z()-point.position.z);}
  function getInteraction(){
    // Aim at an individual field note to make both E and the Read prompt specific.
    raycaster.setFromCamera(pointer.set(0,0),camera);
    const hit=raycaster.intersectObjects(interactionPoints.map(point=>point.group),true)[0];
    let object=hit?.object;
    while(object&&!object.userData.interaction)object=object.parent;
    const aimed=interactionPoints.find(point=>point.id===object?.userData.interaction&&distanceTo(point)<3);
    const point=aimed||interactionPoints.filter(point=>!point.action&&distanceTo(point)<3).sort((a,b)=>distanceTo(a)-distanceTo(b))[0];
    if(!point)return null;
    const projected=point.position.clone().project(camera);
    return {id:point.id,label:point.label,x:(projected.x+1)/2,y:(1-projected.y)/2};
  }
  function canInteract(){return getInteraction()!==null;}
  function interact(id){
    if(!active||!lookEnabled)return false;
    const interactionId=id??getInteraction()?.id;
    const point=interactionPoints.find(point=>point.id===interactionId&&distanceTo(point)<3);
    if(!point)return false;keys.clear();mobileForward=mobileStrafe=0;
    if(point.action)point.action();else onInteract(point.id,point.id==='projects'?projectPage:point.id==='outside'?outsidePage:undefined);return true;
  }
  function clickObject(event){
    if(!active||!lookEnabled)return;
    const rect=canvas.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);
    raycaster.setFromCamera(pointer,camera);
    const hit=raycaster.intersectObjects(interactionPoints.map(point=>point.group),true)[0];
    if(!hit)return;let object=hit.object;while(object&&!object.userData.interaction)object=object.parent;
    if(object)interact(object.userData.interaction);
  }
  function clearInput(){keys.clear();mobileForward=mobileStrafe=0;yawDelta=pitchDelta=0;drag=null;}
  listen(window,'keydown',(event)=>{
    if(!active||!lookEnabled||event.target.closest?.('input, textarea, select, dialog'))return;
    if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(event.code)){event.preventDefault();keys.add(event.code);}
    if(event.code==='ShiftLeft'||event.code==='ShiftRight')keys.add(event.code);
    if(event.code==='KeyE'&&!event.repeat)interact();
  });
  listen(window,'keyup',event=>keys.delete(event.code));listen(window,'blur',clearInput);
  listen(document,'visibilitychange',()=>{if(document.hidden)clearInput();});
  listen(canvas,'pointerdown',event=>{
    if(!active||!lookEnabled||event.button>0)return;
    canvas.focus({preventScroll:true});drag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:event.clientX,startY:event.clientY,moved:false};canvas.setPointerCapture(event.pointerId);
  });
  listen(canvas,'pointermove',event=>{
    if(!active||!lookEnabled)return;
    if(document.pointerLockElement===canvas){yawDelta-=event.movementX*.0022;pitchDelta-=event.movementY*.0022;}
    else if(drag?.id===event.pointerId){if(Math.hypot(event.clientX-drag.startX,event.clientY-drag.startY)>7)drag.moved=true;yawDelta-=(event.clientX-drag.x)*.004;pitchDelta-=(event.clientY-drag.y)*.004;drag.x=event.clientX;drag.y=event.clientY;}
  });
  const endDrag=event=>{if(drag?.id===event.pointerId){const clicked=!drag.moved&&event.type==='pointerup';drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(clicked)clickObject(event);}};
  listen(canvas,'pointerup',endDrag);listen(canvas,'pointercancel',endDrag);listen(canvas,'lostpointercapture',()=>{drag=null;});
  listen(canvas,'dblclick',()=>{if(active&&lookEnabled&&!coarse&&canvas.requestPointerLock)Promise.resolve(canvas.requestPointerLock()).catch(()=>{});});
  function resize(){const width=canvas.clientWidth||innerWidth,height=canvas.clientHeight||innerHeight;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();if(!active)render();}
  function render(){camera.position.set(engine.get_x(),engine.get_y(),engine.get_z());camera.rotation.set(engine.get_pitch(),engine.get_yaw(),0,'YXZ');renderer.render(scene,camera);}
  function frame(now){
    if(!active||disposed)return;const dt=Math.min((now-previous)/1000,.05);previous=now;elapsed+=dt;
    if(lookEnabled){
      const forward=mobileForward+Number(keys.has('KeyW')||keys.has('ArrowUp'))-Number(keys.has('KeyS')||keys.has('ArrowDown'));
      const strafe=mobileStrafe+Number(keys.has('KeyD'))-Number(keys.has('KeyA'));
      const turn=(Number(keys.has('ArrowLeft'))-Number(keys.has('ArrowRight')))*dt*1.5;
      engine.tick(dt,forward,strafe,Number(keys.has('ShiftLeft')||keys.has('ShiftRight')),yawDelta+turn,pitchDelta);
    }
    yawDelta=pitchDelta=0;if(!reducedMotion){motes.position.x=Math.sin(elapsed*.09)*.7;motes.position.y=Math.sin(elapsed*.14)*.18;}
    if(pageTurn){const t=Math.min(1,(now-pageTurn.start)/360);const eased=t*t*(3-2*t);leaf.rotation.y=pageTurn.direction>0?-Math.PI*eased:-Math.PI*(1-eased);if(t===1){leaf.visible=false;pageTurn=null;}}
    render();raf=requestAnimationFrame(frame);
  }
  listen(window,'resize',resize);canvas.style.touchAction='none';canvas.tabIndex=0;canvas.setAttribute('aria-label','First-person woodland trailhead. Use W A S D to walk, arrow keys to turn, drag to look, and E near a field note or the register.');
  // CC0 photographs provide continuous woodland beyond the authored clearing.
  // This is a generic forest environment, not a photograph taken at the Loj.
  const loader = new THREE.TextureLoader();
  const base = import.meta.env.BASE_URL;
  const load = (file) => loader.loadAsync(`${base}textures/${file}`);
  const textures = await Promise.allSettled([
    load('forest-slope.jpg'), load('ground-color.jpg'), load('ground-normal.jpg'),
    load('bark-color.jpg'), load('bark-normal.jpg'),
  ]);
  const prepare = (result, repeat, color = false) => {
    if(result.status !== 'fulfilled') return null;
    const tex=result.value;assets.add(tex);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
    tex.repeat.set(repeat,repeat);tex.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),8);
    if(color)tex.colorSpace=THREE.SRGBColorSpace;return tex;
  };
  if(textures[0].status==='fulfilled'){
    const backdrop=textures[0].value;assets.add(backdrop);backdrop.colorSpace=THREE.SRGBColorSpace;
    backdrop.mapping=THREE.EquirectangularReflectionMapping;scene.background=backdrop;
    scene.backgroundIntensity=.85;scene.backgroundRotation.y=.6;
    scene.environment=backdrop;scene.environmentIntensity=.22;
  }
  const groundPhoto=prepare(textures[1],90,true),groundNormal=prepare(textures[2],90);
  if(groundPhoto){ground.map=groundPhoto;ground.color.set('#d5d0bc');ground.needsUpdate=true;
    const lotPhoto=groundPhoto.clone();assets.add(lotPhoto);lotPhoto.repeat.set(8,7);gravel.map=lotPhoto;gravel.color.set('#b5b2a5');gravel.needsUpdate=true;
    const pathPhoto=groundPhoto.clone();assets.add(pathPhoto);pathPhoto.repeat.set(.3,.3);pathMat.map=pathPhoto;pathMat.color.set('#c5baa6');pathMat.needsUpdate=true;}
  if(groundNormal){ground.normalMap=groundNormal;ground.normalScale.set(.8,.8);ground.needsUpdate=true;}
  const barkPhoto=prepare(textures[3],1,true),barkNormal=prepare(textures[4],1);
  if(barkPhoto){barkMat.map=barkPhoto;barkMat.color.set('#c5c2b1');barkMat.needsUpdate=true;}
  if(barkNormal){barkMat.normalMap=barkNormal;barkMat.normalScale.set(.65,.65);barkMat.needsUpdate=true;}
  await Promise.allSettled([...projects,...hobbies].map(item=>new Promise(resolve=>{
    const img=new Image();img.onload=()=>{folioImages.set(item.image,img);resolve();};img.onerror=()=>resolve();img.src=`${base}images/${item.image}`;
  })));
  paintProject();paintOutside();
  addWinterDetails({ scene, assets, renderer });
  resize();onReady();
  return {
    start(){if(disposed||active)return;active=true;previous=performance.now();raf=requestAnimationFrame(frame);},
    stop(){active=false;cancelAnimationFrame(raf);clearInput();if(document.pointerLockElement===canvas)document.exitPointerLock();},
    resize,
    setTime(mode){const evening=mode==='evening'||mode==='golden';sun.color.set(evening?'#ffd4a0':'#fff2cf');sun.intensity=evening?2:2.5;sun.position.set(-28,evening?17:36,17);skyLight.intensity=evening?1.3:1.65;scene.fog.color.set(evening?'#a9a08c':'#aab7a2');if(scene.background.isColor)scene.background.set(evening?'#bdc0b3':'#aec1bf');else scene.backgroundIntensity=evening?.65:.85;render();},
    setMovement(forward,strafe){mobileForward=forward;mobileStrafe=strafe;},
    reset(){clearInput();engine.reset();render();},
    setLookEnabled(value){lookEnabled=value;if(!value){clearInput();if(document.pointerLockElement===canvas)document.exitPointerLock();}},
    canInteract,interact,getInteraction,setPage,
    dispose(){active=false;disposed=true;cancelAnimationFrame(raf);cleanup.forEach(fn=>fn());scene.traverse(object=>{if(object.isInstancedMesh)object.dispose();});sun.shadow.dispose();assets.forEach(asset=>asset.dispose());renderer.dispose();},
  };
}
