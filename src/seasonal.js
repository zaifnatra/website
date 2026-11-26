import * as THREE from 'three';

/** Static, authored winter details. Adds resources to the scene's disposal Set. */
export function addWinterDetails({ scene, assets, renderer }) {
  const winter = new THREE.Group();winter.name='Early winter at the Loj';scene.add(winter);
  const owned=new Set();
  const keep=resource=>{assets?.add(resource);owned.add(resource);return resource;};
  const mat=options=>keep(new THREE.MeshStandardMaterial(options));
  const paint=mat({color:'#64858f',metalness:.73,roughness:.28});
  const rubber=mat({color:'#171d1e',roughness:.91});
  const dark=mat({color:'#202b2d',roughness:.52,metalness:.25});
  const chrome=mat({color:'#bac6c9',metalness:.93,roughness:.19});
  const glass=mat({color:'#253e43',metalness:.47,roughness:.12});
  const clearLamp=mat({color:'#dce2d7',metalness:.38,roughness:.23});
  const redLamp=mat({color:'#a22020',metalness:.22,roughness:.28});
  const car=new THREE.Group();car.name='2012 Volkswagen Jetta TDI · blue grey';car.position.set(-5.5,0,3.5);winter.add(car);
  const mesh=(geometry,material,position=[0,0,0],parent=car)=>{keep(geometry);const object=new THREE.Mesh(geometry,material);object.position.set(...position);object.castShadow=object.receiveShadow=true;parent.add(object);return object;};
  const box=(w,h,d,material,position,parent)=>mesh(new THREE.BoxGeometry(w,h,d),material,position,parent);
  function surface(points,material,parent=car){
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(points.flat(),3));geometry.setIndex([0,1,2,0,2,3]);geometry.computeVertexNormals();return mesh(geometry,material,[0,0,0],parent);
  }
  function line(points,material,radius=.008,parent=car){
    for(let i=1;i<points.length;i++){
      const a=new THREE.Vector3(...points[i-1]),b=new THREE.Vector3(...points[i]),difference=b.clone().sub(a);
      const part=mesh(new THREE.CylinderGeometry(radius,radius,difference.length(),6),material,a.clone().add(b).multiplyScalar(.5).toArray(),parent);
      part.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),difference.normalize());
    }
  }
  function panelTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=keep(new THREE.CanvasTexture(c));t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(renderer?.capabilities.getMaxAnisotropy()||4,8);return t;}
  function label(text,width,height,position,reverse=false){
    const tex=panelTexture(640,160,(ctx,w,h)=>{ctx.clearRect(0,0,w,h);ctx.fillStyle='#dce1dd';ctx.textAlign='center';ctx.font='bold 108px sans-serif';ctx.fillText(text,w/2,120);});
    const object=mesh(new THREE.PlaneGeometry(width,height),mat({map:tex,transparent:true,alphaTest:.2,metalness:.6,roughness:.25}),position);if(reverse)object.rotation.y=Math.PI;return object;
  }
  // Mk6 proportions: short front overhang, long bonnet, distinct sedan boot.
  // The body is a continuous loft with wheel-arch cutouts, not stacked boxes.
  const stations=[[-2.314,.76,.79],[-2.12,.87,.88],[-1.55,.9,.96],[-.95,.9,.99],[.8,.9,.98],[1.48,.88,.96],[2.13,.86,.89],[2.314,.78,.78]];
  function profile(z){let i=1;while(i<stations.length-1&&z>stations[i][0])i++;const a=stations[i-1],b=stations[i],t=(z-a[0])/(b[0]-a[0]);return [THREE.MathUtils.lerp(a[1],b[1],t),THREE.MathUtils.lerp(a[2],b[2],t)];}
  const vertices=[],indices=[],ring=10,steps=100;
  for(let i=0;i<=steps;i++){
    const z=-2.314+i/steps*4.628,[w,h]=profile(z);
    const wheelDistance=Math.min(Math.abs(z+1.3255),Math.abs(z-1.3255));
    const arch=wheelDistance<.397?.345+Math.sqrt(.397**2-wheelDistance**2):.37;
    const points=[[-w*.84,.33],[-w,arch],[-w,h-.09],[-w*.92,h],[-w*.62,h+.018],[w*.62,h+.018],[w*.92,h],[w,h-.09],[w,arch],[w*.84,.33]];
    points.forEach(([x,y])=>vertices.push(x,y,z));
    if(i<steps)for(let j=0;j<ring;j++){const n=(j+1)%ring,a=i*ring+j,b=i*ring+n;indices.push(a,a+ring,b,b,a+ring,b+ring);}
  }
  const bodyGeo=new THREE.BufferGeometry();bodyGeo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));bodyGeo.setIndex(indices);bodyGeo.computeVertexNormals();mesh(bodyGeo,paint);
  // Front/rear fascias close the ends of the loft.
  surface([[-.76,.36,-2.315],[.76,.36,-2.315],[.76,.78,-2.315],[-.76,.78,-2.315]],paint);
  surface([[.78,.36,2.315],[-.78,.36,2.315],[-.78,.78,2.315],[.78,.78,2.315]],paint);
  // Slight crown and taper on the roof; pillars are the painted cabin shell.
  const roofStations=[[-1.04,.83,1.0],[-.43,.695,1.423],[-.12,.69,1.453],[.52,.70,1.438],[.77,.73,1.37],[1.37,.84,1.0]];
  const cabinVertices=[],cabinIndices=[];
  roofStations.forEach(([z,w,y],i)=>{for(let j=0;j<=10;j++){const t=j/10,x=(t*2-1)*w,curve=Math.sin(t*Math.PI)*.018;cabinVertices.push(x,y+curve,z);if(i<roofStations.length-1&&j<10){const a=i*11+j;cabinIndices.push(a,a+11,a+1,a+1,a+11,a+12);}}});
  const roofGeo=new THREE.BufferGeometry();roofGeo.setAttribute('position',new THREE.Float32BufferAttribute(cabinVertices,3));roofGeo.setIndex(cabinIndices);roofGeo.computeVertexNormals();mesh(roofGeo,paint);
  const doubleGlass=mat({color:'#2d454a',metalness:.46,roughness:.12,side:THREE.DoubleSide});
  surface([[-.777,1.022,-1.013],[.777,1.022,-1.013],[.655,1.406,-.443],[-.655,1.406,-.443]],doubleGlass);
  surface([[.696,1.355,.79],[-.696,1.355,.79],[-.79,1.018,1.345],[.79,1.018,1.345]],doubleGlass);
  for(const side of [-1,1]){
    surface([[side*.83,1.0,-1.04],[side*.695,1.423,-.43],[side*.73,1.37,.77],[side*.84,1.0,1.37]],paint).material.side=THREE.DoubleSide;
    const front=[[side*.837,1.043,-.895],[side*.837,1.043,.02],[side*.705,1.407,.02],[side*.709,1.393,-.397]];
    const rear=[[side*.84,1.043,.105],[side*.845,1.043,1.14],[side*.739,1.333,.727],[side*.707,1.402,.105]];
    surface(front,glass);surface(rear,glass);glass.side=THREE.DoubleSide;
    line([...front,front[0]],chrome,.009);line([...rear,rear[0]],chrome,.009);
    // Dark B pillar and visible door shut-lines below the beltline.
    line([[side*.849,1.035,.061],[side*.712,1.42,.061]],dark,.029);
    for(const z of [.07,1.18])line([[side*.909,.43,z],[side*.91,.79,z],[side*.88,.99,z]],dark,.005);
    line([[side*.903,.94,-1.08],[side*.913,.94,.9],[side*.883,.92,1.85]],chrome,.006);
    for(const z of [-.18,.9]){
      const handle=mesh(new THREE.CapsuleGeometry(.018,.13,3,8),chrome,[side*.922,.91,z]);handle.rotation.x=Math.PI/2;
    }
    // Mirrors have rounded housings and a separate reflective rear face.
    const mirror=mesh(new THREE.SphereGeometry(1,16,10),paint,[side*.99,1.12,-.78]);mirror.scale.set(.145,.073,.115);
    const mirrorFace=mesh(new THREE.CircleGeometry(.063,16),chrome,[side*1.023,1.12,-.69]);mirrorFace.scale.x=1.45;
    line([[side*.85,1.08,-.78],[side*.97,1.11,-.78]],dark,.026);
  }
  // Four alloy wheels: sculpted tyres, sidewalls, split spokes and brake discs.
  for(const side of [-1,1])for(const z of [-1.3255,1.3255]){
    const wheel=new THREE.Group();wheel.position.set(side*.865,.345,z);wheel.rotation.y=side*Math.PI/2;car.add(wheel);
    const tyre=mesh(new THREE.TorusGeometry(.252,.092,12,40),rubber,[0,0,0],wheel);tyre.scale.z=1.15;
    mesh(new THREE.CircleGeometry(.24,36),dark,[0,0,.075],wheel);
    mesh(new THREE.CircleGeometry(.196,32),mat({color:'#6b7475',metalness:.78,roughness:.43}),[0,0,.083],wheel);
    mesh(new THREE.TorusGeometry(.206,.016,8,36),chrome,[0,0,.099],wheel);
    for(let j=0;j<5;j++)for(const split of [-1,1]){const angle=j/5*Math.PI*2+split*.09;const spoke=box(.026,.17,.021,chrome,[Math.sin(angle)*.107,Math.cos(angle)*.107,.105],wheel);spoke.rotation.z=-angle;}
    mesh(new THREE.CircleGeometry(.048,20),chrome,[0,0,.122],wheel);
    mesh(new THREE.CircleGeometry(.029,16),dark,[0,0,.125],wheel);
    for(const offset of [-.052,0,.052])mesh(new THREE.TorusGeometry(.338,.003,4,40),dark,[0,0,offset],wheel);
    for(let tread=0;tread<40;tread++){const angle=tread/40*Math.PI*2;const treadMark=box(.009,.012,.145,dark,[Math.sin(angle)*.339,Math.cos(angle)*.339,0],wheel);treadMark.rotation.z=-angle;}
  }
  // Narrow horizontal VW grille and paired rectangular lamp assemblies.
  box(.93,.19,.025,dark,[0,.764,-2.329]);
  for(const y of [.71,.767,.823])box(.94,.012,.032,chrome,[0,y,-2.347]);
  for(const side of [-1,1]){
    const headlamp=box(.37,.17,.033,clearLamp,[side*.65,.782,-2.294]);headlamp.rotation.y=side*.15;
    for(const x of [side*.56,side*.72]){const optic=mesh(new THREE.CircleGeometry(.059,20),chrome,[x,.792,-2.318]);optic.rotation.y=Math.PI;}
    const tail=box(.38,.19,.04,redLamp,[side*.62,.82,2.29]);tail.rotation.y=-side*.13;
    box(.17,.04,.045,clearLamp,[side*.54,.814,2.313]);
    box(.27,.05,.03,dark,[side*.56,.42,-2.3]);
  }
  box(1.42,.085,.03,dark,[0,.452,-2.325]);
  box(1.4,.025,.027,chrome,[0,.4,2.325]);
  const roundelTexture=panelTexture(256,256,(ctx,w,h)=>{
    ctx.fillStyle='#28393e';ctx.beginPath();ctx.arc(w/2,h/2,121,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d4dce0';ctx.lineWidth=12;ctx.stroke();
    ctx.lineWidth=13;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(71,53);ctx.lineTo(128,125);ctx.lineTo(185,53);ctx.moveTo(49,112);ctx.lineTo(84,193);ctx.lineTo(128,137);ctx.lineTo(171,193);ctx.lineTo(208,112);ctx.stroke();
  });
  for(const [z,y,reverse] of [[-2.365,.772,true],[2.335,.94,false]]){const logo=mesh(new THREE.CircleGeometry(.067,32),mat({map:roundelTexture,metalness:.5,roughness:.24}),[0,y,z]);if(reverse)logo.rotation.y=Math.PI;}
  label('JETTA',.32,.072,[-.53,.953,2.315]);label('TDI',.19,.07,[.57,.953,2.315]);
  const plateTexture=panelTexture(640,240,(ctx,w,h)=>{ctx.fillStyle='#e8e9dd';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#39494f';ctx.lineWidth=8;ctx.strokeRect(8,8,w-16,h-16);ctx.fillStyle='#305363';ctx.textAlign='center';ctx.font='25px sans-serif';ctx.fillText('ADIRONDACKS',w/2,46);ctx.font='bold 100px monospace';ctx.fillText('THE LOJ',w/2,160);});
  const plateMat=mat({map:plateTexture,roughness:.54});mesh(new THREE.PlaneGeometry(.5,.19),plateMat,[0,.62,2.342]);
  const frontPlate=mesh(new THREE.PlaneGeometry(.5,.19),plateMat,[0,.559,-2.357]);frontPlate.rotation.y=Math.PI;
  // Panel gaps and wipers give the roof/hood a believable scale.
  line([[-.77,.983,-1.04],[0,1.003,-1.04],[.77,.983,-1.04]],dark,.006);
  line([[-.75,.981,1.48],[0,.986,1.49],[.75,.981,1.48]],dark,.005);
  line([[-.65,1.061,-.96],[-.1,1.075,-.94]],rubber,.009);line([[.05,1.075,-.94],[.57,1.061,-.96]],rubber,.009);
  // Light, patchy early-winter snow; the walked centre remains exposed.
  let seed=5731;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const snowTexture=panelTexture(512,512,(ctx,w,h)=>{
    ctx.clearRect(0,0,w,h);const gradient=ctx.createRadialGradient(256,256,30,256,256,250);gradient.addColorStop(0,'rgba(241,245,243,1)');gradient.addColorStop(.73,'rgba(233,240,240,.98)');gradient.addColorStop(.92,'rgba(227,235,237,.55)');gradient.addColorStop(1,'rgba(229,238,240,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
    for(let i=0;i<22000;i++){const x=random()*w,y=random()*h;if(Math.hypot(x-256,y-256)>245)continue;ctx.fillStyle=random()>.5?'rgba(255,255,255,.19)':'rgba(141,166,176,.1)';ctx.fillRect(x,y,1,1);}
  });
  const snow=mat({map:snowTexture,color:'#eff5f5',transparent:true,alphaTest:.035,roughness:.94,metalness:0,depthWrite:false,side:THREE.DoubleSide});
  function snowPatch(x,z,width,depth,y=.014,parent=winter,angle=0){
    const geometry=new THREE.CircleGeometry(1,48);const positions=geometry.attributes.position;
    for(let i=1;i<positions.count;i++){const r=.94+random()*.12;positions.setX(i,positions.getX(i)*r);positions.setY(i,positions.getY(i)*r);}geometry.computeVertexNormals();
    const patch=mesh(geometry,snow,[x,y,z],parent);patch.rotation.set(-Math.PI/2,0,angle);patch.scale.set(width,depth,1);patch.castShadow=false;patch.renderOrder=2;return patch;
  }
  const patches=[[-7.5,-4,2.1,3],[-7.7,1,1.2,2.5],[-7.8,6.2,2.5,1.5],[7.7,1,1.8,2.7],[7.8,-5.5,2.1,3],[5.6,-11,2.1,3],[-5.2,-12,3,2.4],[-2.8,-17,2.3,2.4],[6,-17,2.3,3],[1,8.2,2.2,1.1],[5.5,7.3,2.4,1.2],[-3,7.8,2.2,1.3],[-3.1,-1,1.3,.7],[2.9,.8,.7,1.2],[-3.8,-8.8,1,.6],[2.4,-11,.8,.65]];
  for(const [x,z,w,d] of patches)snowPatch(x,z,w,d,.014,winter,random()*6.28);
  // Low banks are real volumes under their soft snowy surface.
  const bankMat=mat({color:'#dce6e7',roughness:1});
  for(const [x,z,w,d] of [[-7.3,4.1,.6,2.2],[8.2,-4.5,.7,2.5],[-7.2,-5,1.1,1.4]]){
    const bank=mesh(new THREE.SphereGeometry(1,24,12),bankMat,[x,.015,z],winter);bank.scale.set(w,.12,d);snowPatch(x,z,w*1.35,d*1.15,.13);
  }
  // A thin frosting on the roof and corners, not an obscuring blanket.
  snowPatch(-.22,.12,.43,.46,1.482,car,.3);snowPatch(.42,-1.65,.31,.39,.987,car,-.2);snowPatch(-.42,1.84,.3,.24,.95,car,.5);
  return { group:winter, car, dispose(){winter.removeFromParent();for(const resource of owned){assets?.delete(resource);resource.dispose();}owned.clear();} };
}
