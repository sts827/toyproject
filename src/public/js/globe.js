import * as THREE from 'three';
import { OrbitControls } from 'orbitControls';
import { TrackballControls } from 'trackControl';
import { CSS2DRenderer } from 'css2Renderer';
import ThreeGlobe from 'https://cdn.jsdelivr.net/npm/three-globe@2.31.1/+esm';


// container
const globeContainer = document.getElementById('globe_container');
// 초기 세팅
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

// texture image URL
const mapURL = "/public/images/globe/globe_map.jpg";
const normalURL = "/public/images/globe/earth_normal_2048.jpg";
const bumpURL = "/public/images/globe/earth_bump.jpg";
const specURL = "/public/images/globe/earth_spec.jpg";
// const metalURL = "./static/images/globe/earth_spec.jpg"; -- not use
// const emissiveURL = "./static/images/globe/earth_night.jpg"; -- not use
const earthNight = "/public/images/globe/earth_night.jpg";
const earthNight_high = "/public/images/globe/night_sky.png"
const earthNight_low = "/public/images/globe/blackMarble.jpg"
const cloudURL = "/public/images/globe/clouds.png";

 
// globe materials
const pMaterial = new THREE.MeshPhongMaterial({
    specular: 0x7c7c7c,
    map: loadTextureImage(mapURL),
    bumpMap: loadTextureImage(bumpURL),
    specularMap: loadTextureImage(specURL),
    normalMap: loadTextureImage(normalURL),
    normalScale: new THREE.Vector2(0.85, - 0.85),
    shininess: 3
})


// load texture image
function loadTextureImage(url) {
    return new THREE.TextureLoader().load(url);
}

// load geo data -- core utils
function loadDataGeoJson() {
    return fetch("/public/data/geo.json")
    .then((response) => response.json())
    .then((json) => json.features.map(item => ({
        ...item,
        color: "#ffffff",
        elevate: false
    })));
}

// render globe by geoData -- core utils
function renderGlobe(data) {

    // shader
    if (data != undefined && data != null) {
        console.log("rendering globe...");
        const globe = new ThreeGlobe({
            waitForGlobeReady: true,
            animateIn:true
        });
        const sphereMaterial =  new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x3a228a),
            emissive: new THREE.Color(0x220038),
            emissiveIntensity: 0.1,
            shininess: 0.7
        });
        // globe
        globe.hexPolygonsData(data)
            .hexPolygonMargin(0.5)
            .hexPolygonResolution(3)
            .hexPolygonColor(d => d.color)
            .globeMaterial(sphereMaterial)
            .showAtmosphere(true)
            .atmosphereColor("#ffffff")
            .atmosphereAltitude(0.1)


        // setup renderer
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
        globeContainer.appendChild(renderer.domElement);

        
        // setup scene
        const scene = new THREE.Scene();
        scene.add(globe);

        scene.background = new THREE.Color(0x040d21);

        // setup camera
        const camera = new THREE.PerspectiveCamera();
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        camera.position.z = 500;
        
        // setup control
        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.maxDistance = 500;
        controls.minDistance = 150;
        controls.zoomSpeed = 0.3; // -> linear하게 1까지 변경

        // setup sunlight
        // const sunLight = new THREE.DirectionalLight(0xffffff, 1.5 * Math.PI);
        // sunLight.position.set(-3, 3, 3);
        // scene.add(sunLight);
        const ambientLight = new THREE.AmbientLight(0x509bff, 0.3);
        camera.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(-800, 2000, 400);
        camera.add(dirLight);

        const dirLight2 = new THREE.DirectionalLight(0x455dee, 0.1);
        dirLight2.position.set(-200, 500, 200);
        camera.add(dirLight2);

        const dirLight3 = new THREE.DirectionalLight(0x13176d, 0.5);
        dirLight3.position.set(-200, 500, 200);
        camera.add(dirLight3);

        scene.add(camera);
        scene.fog = new THREE.Fog(0x535ef3, 400, 2000);


        // animate IIFE
        (function animate() {
            controls.update();
            // globe.rotation.y += -0.5 * Math.PI / 180;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        })();
    }
}


function init() {
    loadDataGeoJson()
        .then((data) => renderGlobe(data));
}
init();