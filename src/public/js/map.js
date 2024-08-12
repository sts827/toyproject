import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
hemiLight.position.set(0, 100, 0);
hemiLight.matrixAutoUpdate = false;
hemiLight.updateMatrix();

dirLight.position.set(3, 10, 1000);
dirLight.castShadow = true;

scene.add(hemiLight);
scene.add(dirLight);

const camera = new THREE.OrthographicCamera(
  -window.innerWidth / 4,
  window.innerWidth / 4,
  window.innerHeight / 4,
  -window.innerHeight / 4,
  1,
  1000
);

camera.position.set(0, 0, 100);

let controls = new OrbitControls(camera, renderer.domElement);

controls.enablePan = false;
controls.enableZoom = true;
controls.enableDamping = false;
controls.target.set(0, 0, 0);
controls.update();

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(90, 64, 64),
  new THREE.MeshPhongMaterial()
);

scene.add(globe);

const container = document.getElementById("container");
container.appendChild(renderer.domElement);

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

var osm = new ol.layer.Tile({
  extent: [-180, -90, 180, 90],
  source: new ol.source.OSM({
    maxZoom:19
  })
});

const view = new ol.View({
  projection: "EPSG:4326",
  extent: [-180, -90, 180, 90],
  center: [0, 0],
  zoom: 2,
  maxZoom:19
});

const map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      extent: [-180, -90, 180, 90],
      source: new ol.source.OSM({
        maxZoom: 2
      })
    }),
    osm,
    new ol.layer.Tile({
      source: new ol.source.TileDebug()
    })
  ],
  target: "map",
  view: view
});

map.on("rendercomplete", function () {
  try {
    let mapCanvas = document.createElement("canvas");
    let size = map.getSize();
    mapCanvas.width = size[0];
    mapCanvas.height = size[1];
    let mapContext = mapCanvas.getContext("2d");
    Array.prototype.forEach.call(
      document.querySelectorAll(".ol-layer canvas"),
      function (canvas) {
        if (canvas.width > 0) {
          let opacity = canvas.parentNode.style.opacity;
          mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
          let transform = canvas.style.transform;
    
          let matrix = transform
            .match(/^matrix\(([^\(]*)\)$/)[1]
            .split(",")
            .map(Number);
  
          CanvasRenderingContext2D.prototype.setTransform.apply(
            mapContext,
            matrix
          );
          mapContext.drawImage(canvas, 0, 0);
        }
      }
    );
  
    let texture = new THREE.CanvasTexture(mapCanvas);
    globe.material.map = texture;
    globe.material.needsUpdate = true;
  } catch (error) {
    console.error("렌더링 중 오류 발생:", error);
  }
});

let raycaster = new THREE.Raycaster();
let currentWidth = 1000;

controls.addEventListener("end", function (event) {
  raycaster.setFromCamera({ x: 0, y: 0 }, camera);

  let intersects = raycaster.intersectObject(globe);

  let x = -map.getCoordinateFromPixel([
    intersects[0].uv.x * currentWidth,
    (intersects[0].uv.y * currentWidth) / 2
  ])[1];
  let y = map.getCoordinateFromPixel([
    intersects[0].uv.x * currentWidth,
    (intersects[0].uv.y * currentWidth) / 2
  ])[0];

  let circle = new ol.Feature({
    geometry: new ol.geom.Circle([y, x], 20)
  });

  let circleSource = new ol.source.Vector({
    features: [circle]
  });
  osm.setExtent(circleSource.getExtent());

  switch (Math.floor(camera.zoom)) {
    case 1:
      document.getElementById("map").style.width = "1000px";
      document.getElementById("map").style.height = "500px";
      if (currentWidth !== 1000) {
        map.updateSize();
        view.setResolution(0.36);
        currentWidth = 1000;
      }
      break;
    case 2:
      document.getElementById("map").style.width = "2000px";
      document.getElementById("map").style.height = "1000px";
      if (currentWidth !== 2000) {
        map.updateSize();
        view.setResolution(0.225);
        currentWidth = 2000;
      }
      break;
    case 3:
      document.getElementById("map").style.width = "4000px";
      document.getElementById("map").style.height = "2000px";
      if (currentWidth !== 4000) {
        map.updateSize();
        view.setResolution(0.18);
        currentWidth = 4000;
      }
      break;
    default:
      break;
  }
});