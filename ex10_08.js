

const radius = 5;

// ���������� ����������
var container, camera, controls, scene, renderer, light; 
var Cube;

// �������� �������� ����� ������ �������� ��������
window.onload = function()
{
init();
animate();
}

function init()
{
scene = new THREE.Scene(); //������� ����� 
const color = 0xFFFFFF;  // white
  const near = 100;
  const far = 300;
  scene.fog = new THREE.Fog(color, near, far);
AddCamera( 0, 100, 100); //��������� ������
AddLight( 0, 500, 500 ); //������������� ����� ����

// Инициализация сцены
renderer = new THREE.WebGLRenderer( { antialias: true } ); 
renderer.setClearColor( 0xffffff );
renderer.setSize( window.innerWidth, window.innerHeight ); 
container = document.getElementById('MyWebGLApp'); 
container.appendChild( renderer.domElement );

// Создание системы координат и осей координат
var axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const gridHelper = new THREE.GridHelper(50, 50, 0x0000ff);
gridHelper.position.y = -2.5;
scene.add(gridHelper);

// земля
const landTexture = new THREE.TextureLoader().load( "textures/grass.jpg" );
landTexture.wrapS = THREE.RepeatWrapping;
landTexture.wrapT = THREE.RepeatWrapping;
landTexture.repeat.set( 75, 75 );

var landGeometry = new THREE.BoxGeometry(98, 0.1, 140)
var landMaterial = new THREE.MeshPhongMaterial({map: landTexture})
var land = new THREE.Mesh(landGeometry, landMaterial)
land.position.y = -2;

const rampTexture = new THREE.TextureLoader().load( "textures/red_metall.jpg" );
rampTexture.wrapS = THREE.RepeatWrapping;
rampTexture.wrapT = THREE.RepeatWrapping;
rampTexture.repeat.set( 1, 5 );

// создание рампы
var cubeGeometry = new THREE.BoxGeometry(3, 0.25, 10);
var cubeMaterial = new THREE.MeshPhongMaterial({map: rampTexture});
var ramp = new THREE.Mesh(cubeGeometry, cubeMaterial);
ramp.position.y = -1.25;
ramp.rotation.x = -Math.PI / 8;

// подложка
const podloskaTexture = new THREE.TextureLoader().load( "textures/black_metall.jpg" );
podloskaTexture.wrapS = THREE.RepeatWrapping;
podloskaTexture.wrapT = THREE.RepeatWrapping;
podloskaTexture.repeat.set( 1, 10 );

var rampUpperGeometry = new THREE.BoxGeometry(2.75, 0.05, 9.5);
var rampUpperMaterial = new THREE.MeshPhongMaterial({map: podloskaTexture});
var rampUpper = new THREE.Mesh(rampUpperGeometry, rampUpperMaterial);
rampUpper.position.y = -1.13;
rampUpper.rotation.x = -Math.PI / 8;

// балки для рампы
var firstBalkaGeometry = new THREE.BoxGeometry(0.25, 5, 0.25);
var firstBalka = new THREE.Mesh(firstBalkaGeometry, cubeMaterial);
firstBalka.position.z = 3.05;

var secondBalkaGeometry = new THREE.BoxGeometry(0.25, 0.25, 6);

firstBalka.updateMatrix();
secondBalkaGeometry.merge(firstBalka.geometry, firstBalka.matrix);

var ThirdBalkaGeometry = new THREE.BoxGeometry(2.5, 0.25, 0.25);
var thirdBalka = new THREE.Mesh(ThirdBalkaGeometry, cubeMaterial);
thirdBalka.position.z = 4.55;
thirdBalka.position.y = -1.95;

var balkiLeft = new THREE.Mesh(secondBalkaGeometry, cubeMaterial)
balkiLeft.position.x = 1.37;
balkiLeft.position.y = -1.95;
balkiLeft.position.z = 1.5;

var balkiRight = balkiLeft.clone()
balkiRight.position.x = -1.37;
balkiRight.position.y = -1.95;
balkiRight.position.z = 1.5;

const group = new THREE.Group();

group.add(balkiLeft);
    group.add(balkiRight);
    group.add(rampUpper);
    group.add(thirdBalka);
    group.add(ramp);

    group.position.z = 15
    group.rotation.y = 5
scene.add(group);

const anotherGroup = group.clone();
anotherGroup.position.z = -15
anotherGroup.position.x = -15
anotherGroup.rotation.y = 7
scene.add(anotherGroup)

const anotherGroup1 = group.clone();
anotherGroup1.position.z = -25
anotherGroup.position.x = 15
anotherGroup1.rotation.y = 2
scene.add(anotherGroup1)

const anotherGroup2 = group.clone();
anotherGroup2.position.z = -53
anotherGroup.position.x = 10
anotherGroup2.rotation.y = 1
scene.add(anotherGroup2)

const anotherGroup3 = group.clone();
anotherGroup3.position.z = 35
anotherGroup.position.x = -25
anotherGroup3.rotation.y = 9
scene.add(anotherGroup3)

// ---------------------------------------------------------- велотрек

// Корды кривой
var closedSpline = new THREE.CatmullRomCurve3( [
  //levo
  new THREE.Vector3( -60, 0,  45 ),
  new THREE.Vector3( -45, 0,  -65 ),
  //verh
  new THREE.Vector3( 0, 2,  -80 ),
  new THREE.Vector3( 45, 0,  -65 ),
  //pravo
  new THREE.Vector3( 60, 0,  45 ),
  //niz
  new THREE.Vector3( 45, 0,  65 ),
  new THREE.Vector3( 0, 2,  80 ),
  new THREE.Vector3( -45, 0,  65 ),

] );
closedSpline.closed = true;

// для экструда
var extrudeSettings = {
  steps           : 400,
  bevelEnabled    : false,
  extrudePath     : closedSpline
};

// Построение по поинтам
var pts = [], count = 3;
for ( var i = 0; i < count; i ++ ) {
  var l = 15;
  var a = 2 * i / count * -2.8 ;
  pts.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
}
var shape = new THREE.Shape( pts );

// Создание шейпа
var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
var material = new THREE.MeshPhongMaterial( { color: 'grey', wireframe: false, flatShading: false } );

// меш
var mesh = new THREE.Mesh( geometry, material );
mesh.position.y = -5
scene.add(mesh)

// -------------------------------------------------------------

// ---------------------------------------------------------- крутая обводка

// Корды кривой
var closedSplineWalls = new THREE.CatmullRomCurve3( [
  //levo
  new THREE.Vector3( -60 * 1.11, 0,  45 * 1.11),
  new THREE.Vector3( -45 * 1.11, 0,  -65 * 1.11),
  //verh
  new THREE.Vector3( 0, 2 * 1.11,  -80 * 1.11),
  new THREE.Vector3( 45 * 1.11, 0,  -65 * 1.11),
  //pravo
  new THREE.Vector3( 60 * 1.11, 0,  45 * 1.11),
  //niz
  new THREE.Vector3( 45 * 1.11, 0,  65 * 1.11),
  new THREE.Vector3( 0, 2 * 1.11,  80 * 1.11),
  new THREE.Vector3( -45 * 1.11, 0,  65 * 1.11),
] );
closedSplineWalls.closed = true;

// для экструда
var extrudeSettingsWalls = {
  steps           : 400,
  bevelEnabled    : false,
  extrudePath     : closedSplineWalls
};

// Построение по поинтам
var ptsWalls = [], countWalls = 5;
for ( var i = 0; i < countWalls; i ++ ) {
  var l = 1;
  var a = 2 * i / countWalls * Math.PI ;
  ptsWalls.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
}
var shapeWalls = new THREE.Shape( ptsWalls );

// Создание шейпа
var geometryWalls = new THREE.ExtrudeGeometry( shapeWalls, extrudeSettingsWalls );
var materialWalls = new THREE.MeshPhongMaterial( { color: 'gray', wireframe: false, flatShading: false } );

// меш
var meshWalls = new THREE.Mesh( geometryWalls, materialWalls );
meshWalls.position.y = 5
scene.add(meshWalls)

// -------------------------------------------------------------

// ---------------------------------------------------------- стены

// Корды кривой
var closedSplineWalls = new THREE.CatmullRomCurve3( [
  //levo
  new THREE.Vector3( -60 * 1.11, 0,  45 * 1.15),
  new THREE.Vector3( -45 * 1.11, 0,  -65 * 1.11),
  //verh
  new THREE.Vector3( 0, 2 * 1.11,  -80 * 1.10),
  new THREE.Vector3( 45 * 1.11, 0,  -65 * 1.11),
  //pravo
  new THREE.Vector3( 60 * 1.11, 0,  45 * 1.15),
  //niz
  new THREE.Vector3( 45 * 1.11, 0,  65 * 1.11),
  new THREE.Vector3( 0, 2 * 1.11,  80 * 1.10),
  new THREE.Vector3( -45 * 1.11, 0,  65 * 1.11),
] );
closedSplineWalls.closed = true;

// для экструда
var extrudeSettingsWalls = {
  steps           : 400,
  bevelEnabled    : false,
  extrudePath     : closedSplineWalls
};

// Построение по поинтам
var ptsWalls = [], countWalls = 5;
for ( var i = 0; i < countWalls; i ++ ) {
  var l = 1;
  var a = 2 * i / countWalls * Math.PI ;
  ptsWalls.push( new THREE.Vector2 ( Math.cos( a ) * l, Math.sin( a ) * l ) );
}
var shapeWalls = new THREE.Shape( ptsWalls );

// Создание шейпа
var geometryWalls = new THREE.ExtrudeGeometry( shapeWalls, extrudeSettingsWalls );
var materialWalls = new THREE.MeshPhongMaterial( { color: 'gray', wireframe: false, flatShading: false } );

// меш
var meshWalls = new THREE.Mesh( geometryWalls, materialWalls );
meshWalls.position.y = 7
scene.add(meshWalls)

// -------------------------------------------------------------

//частицы
var particleTexture = THREE.ImageUtils.loadTexture('textures/leaf.png');

var particles = new THREE.Geometry;
for (var p = 0; p < 2000; p++) {
  var particle = new THREE.Vector3(Math.random() * 500 - 250, Math.random() * 500 - 250, Math.random() * 500 - 250);
  particles.vertices.push(particle);
}

var particleMaterial = new THREE.ParticleBasicMaterial({ transparent: true, map: particleTexture});
var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
 
scene.add(particleSystem)

//добавлялки
scene.add(land)
particleSystem.rotation.y += 1;


}

function animate()
{
requestAnimationFrame(animate);
render();
}
 
function render()
{
controls.update(); 
renderer.render(scene, camera);
}

function AddCamera(X,Y,Z) 
{
camera = new THREE.PerspectiveCamera( 400, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set(X,Y,Z);
controls = new THREE.TrackballControls( camera, container );
controls.rotateSpeed = 2; 
controls.noZoom = false; 
controls.zoomSpeed = 1.2; 
controls.staticMoving = true;
}

function AddLight(X,Y,Z)
{
light = new THREE.DirectionalLight( 0xffffff );
light.position.set(X,Y,Z);
scene.add( light );
}






