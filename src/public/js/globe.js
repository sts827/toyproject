import * as THREE from 'three';
import { OrbitControls } from 'orbitControls';
import { CSS2DRenderer } from 'css2Renderer';
import globeGl from 'https://cdn.jsdelivr.net/npm/globe.gl@2.32.5/+esm';

// container
const globeContainer = document.getElementById('globe_container');

// renderer 초기 세팅
const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth / window.innerHeight;

// renderer 생성
const renderer = new THREE.WebGLRenderer();
renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

