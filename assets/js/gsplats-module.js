import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Make both libraries available globally
window.GaussianSplats3D = GaussianSplats3D;
window.THREE = THREE;

// Add OrbitControls to THREE
window.OrbitControls = OrbitControls;