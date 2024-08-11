import * as THREE from 'three';
import { OrbitControls } from 'orbitControls';
import { TrackballControls } from 'trackControl';
import { CSS2DRenderer } from 'css2Renderer';
import ThreeGlobe from 'https://cdn.jsdelivr.net/npm/three-globe@2.31.1/+esm';

const globeContainer = document.getElementById('globe_container');
// 초기 세팅
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
// setup latlng position
const pointViews = [
    {
        lat:33.4528628,
        lng:126.5727632,
        size:0.3,
        color:"red",
        description: "wayplus",
        maxR: Math.random() * 2 + 3,
        propagationSpeed: 0.5,
        repeatPeriod: Math.random() * 2000 + 200
    },
    {
        lat:33.457063,
        lng:126.563973,
        size:0.3,
        color:"red",
        description: "jeju-university",
        maxR: Math.random() * 2 + 3,
        propagationSpeed: 0.5,
        repeatPeriod: Math.random() * 2000 + 200
    },
    {
        lat:34.829343,
        lng:128.425953,
        size:0.3,
        color:"red",
        description: "big-Leader AI campus",
        maxR: Math.random() * 2 + 3,
        propagationSpeed: 0.5,
        repeatPeriod: Math.random() * 2000 + 200
    },
    {
        lat:35.666752,
        lng:139.764006,
        size:0.3,
        color:"red",
        description: "jp ICT, CAL",
        maxR: Math.random() * 2 + 3,
        propagationSpeed: 0.5,
        repeatPeriod: Math.random() * 2000 + 200
    }
]

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

// openLayer URL

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

const hexSphere =  new THREE.MeshPhongMaterial({
    color: new THREE.Color(0x3a228a),
    emissive: new THREE.Color(0x220038),
    emissiveIntensity: 0.1,
    shininess: 0.7
});

// cloud materials
// 1. cloud texture
const cloudMap = loadTextureImage(cloudURL);
const cloudMaterial = new THREE.MeshLambertMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 0.8
});
// 2. cloud speed
const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

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

const colorInterpolator = t => `rgba(255,100,50,${1 - t})`;


// render globe by geoData -- core utils
function renderGlobe(data) {

    // shader
    if (data != undefined && data != null) {
        const globe = new ThreeGlobe({
            waitForGlobeReady: true,
            animateIn:true
        });
        // setup globe
        globe
            .globeMaterial(pMaterial)
            .showAtmosphere(true)
            .atmosphereColor("#3f7b9d")
            .atmosphereAltitude(0.2)
            // .hexPolygonsData(data)
            // .hexPolygonMargin(0.5)
            // .hexPolygonResolution(3)
            // .hexPolygonColor(d => d.color)
        globe
            .htmlElementsData(pointViews)
            .htmlElement(d => {
                const container = document.createElement("div");
                const tooltip = document.createElement("div");
                const marker = document.createElement("div");
                // container > tooltip, marker
                container.classList.add("markerContainer");
                tooltip.classList.add("tooltip");
                tooltip.innerHTML = `
                <h2 class='title'>${d.description}</h2>
                <div class='range'>기간:2021~2023</div>
                <div class='thumbnail'>이미지 area</div>
                `;
                marker.classList.add("marker");
                container.appendChild(tooltip);
                container.appendChild(marker);
                return container;
            })

        // setup cloud
        const cloudGeo = new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + 0.007), 64, 32);
        const clouds = new THREE.Mesh(cloudGeo, cloudMaterial);
        
        // animation arc


        // setup renderer
        const renderers = [new THREE.WebGLRenderer(), new CSS2DRenderer];
        renderers.forEach((r, idx) => {
            r.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
            if (idx > 0) {
                r.domElement.style.position = 'absolute';
                r.domElement.style.top = '0px';
                r.domElement.style.pointerEvents = 'none';
            }
            globeContainer.appendChild(r.domElement);
        })

        // setup scene
        const scene = new THREE.Scene();
        scene.add(globe);
        scene.add(clouds);

        scene.background = new THREE.Color(0x040d21);

        // setup camera
        const camera = new THREE.PerspectiveCamera();
        camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
        camera.updateProjectionMatrix();
        camera.position.set(-3,3,500);
        
        // setup control
        let controls = new OrbitControls(camera, renderers[0].domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
        controls.maxDistance = 500;
        controls.minDistance = 130;
        controls.zoomSpeed = 0.3; // -> linear하게 1까지 변경

        // setup sunlight
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5 * Math.PI);
        // sunLight.position.set(-3, 3, 3);
        scene.add(sunLight);


        globe.setPointOfView(camera.position, globe.position);
        controls.addEventListener('change', () => globe.setPointOfView(camera.position, globe.position));
        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderers.forEach((r) => { r.setSize(width, height) });
            // renderers[0].setSize(width, height);

            // // css2Renderer
            // labelRenderer.setSize(width, height);

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
        // animate IIFE
        (function animate() {
    
            controls.update();
            // globe.rotation.y += -0.5 * Math.PI / 180;
            renderers.forEach(r => r.render(scene, camera));
            // clouds
            clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
            requestAnimationFrame(animate);
        })();
    }
}


function init() {
    loadDataGeoJson()
        .then((data) => renderGlobe(data));
}
init();