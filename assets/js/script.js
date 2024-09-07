'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    history.pushState(null, '', '/');

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
        history.pushState(null, '', '#' + pages[i].dataset.page);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
    handleURL();

  });
}

const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");

const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");
const overlay = document.querySelector("[data-overlay]");

const modalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// Function to open the modal and load BibTeX content
function openModal(title, path) {
  loadBibTeX(path);
  modalTitle.innerHTML = title;
  modalFunc();
}


// Function to load BibTeX content
function loadBibTeX(path) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    modalText.innerHTML = "<p>"+this.responseText+"</p>";
  };
  xhr.open("GET", path);
  xhr.send();
}

// add click event to modal close button
modalCloseBtn.addEventListener("click", modalFunc);
overlay.addEventListener("click", modalFunc);
let viewer;
let renderer;
let camera;
let controls;
const gsplatsContainer = document.getElementById('gsplats-container');
let containerWidth = gsplatsContainer.clientWidth;
let containerHeight = gsplatsContainer.clientHeight;

// Function to handle container size changes
function handleContainerResize() {
  containerWidth = gsplatsContainer.clientWidth;
  containerHeight = gsplatsContainer.clientHeight;
  
  if (renderer && camera) {
    renderer.setSize(containerWidth, containerHeight);
    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
  }
}

// Add these functions at the end of the file
document.addEventListener('DOMContentLoaded', function() {
  renderer = new THREE.WebGLRenderer({
    antialias: false
  });
  
  handleContainerResize();
  gsplatsContainer.appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(65, containerWidth / containerHeight, 0.1, 500);
  camera.position.copy(new THREE.Vector3().fromArray([-1, -4, 6]));
  camera.up = new THREE.Vector3().fromArray([0, -1, -0.6]).normalize();
  camera.lookAt(new THREE.Vector3().fromArray([0, 4, -0]));

  // Add OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.screenSpacePanning = true;
  //controls.maxPolarAngle = Math.PI / 2;

  viewer = new GaussianSplats3D.Viewer({
    'selfDrivenMode': false,
    'renderer': renderer,
    'camera': camera,
    'useBuiltInControls': false,
    'ignoreDevicePixelRatio': false,
    'gpuAcceleratedSort': false,// only works with shared memory
    'enableSIMDInSort': true,
    'sharedMemoryForWorkers': false,//fix CORS
    'integerBasedSort': true,
    'halfPrecisionCovariancesOnGPU': true,
    'dynamicScene': false,
    'webXRMode': GaussianSplats3D.WebXRMode.None,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Instant,
    'antialiased': false,
    'focalAdjustment': 1.0,
    'logLevel': GaussianSplats3D.LogLevel.None,
    'sphericalHarmonicsDegree': 0,
    'enableOptionalEffects': false,
    'plyInMemoryCompressionLevel': 2,
    'freeIntermediateSplatData': false
  });

  // Add resize listener
  window.addEventListener('resize', handleContainerResize);
});


function update() {
  requestAnimationFrame(update);
  controls.update(); // Update OrbitControls
  viewer.update();
  viewer.render();
}

function showGSplats() {
  document.querySelector('.projects').style.display = 'none';
  document.getElementById('gsplats-viewer').style.display = 'block';
  
  // Update URL
  const currentHash = window.location.hash;
  if (!currentHash.includes('?gsplats')) {
    const newHash = currentHash ? currentHash + '?gsplats' : '?gsplats';
    history.pushState(null, '', newHash);
  }
  
  // Trigger resize handler
  handleContainerResize();
}

function loadGSplat(filename) {
  // Clear the previous viewer before loading the next asset
  if (viewer) {
    viewer.dispose();
    viewer = new GaussianSplats3D.Viewer({
      'selfDrivenMode': false,
      'renderer': renderer,
      'camera': camera,
      'useBuiltInControls': false,
      'ignoreDevicePixelRatio': false,
      'gpuAcceleratedSort': false,// only works with shared memory
      'enableSIMDInSort': true,
      'sharedMemoryForWorkers': false,//fix CORS
      'integerBasedSort': true,
      'halfPrecisionCovariancesOnGPU': true,
      'dynamicScene': false,
      'webXRMode': GaussianSplats3D.WebXRMode.None,
      'renderMode': GaussianSplats3D.RenderMode.OnChange,
      'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Instant,
      'antialiased': false,
      'focalAdjustment': 1.0,
      'logLevel': GaussianSplats3D.LogLevel.None,
      'sphericalHarmonicsDegree': 0,
      'enableOptionalEffects': false,
      'plyInMemoryCompressionLevel': 2,
      'freeIntermediateSplatData': false
    });
  }
  
  viewer.addSplatScene(`./assets/gsplats/${filename}`, {
    'showLoadingUI': true
  }).then(() => {
    requestAnimationFrame(update);
    handleContainerResize();
  });
  
  // Update URL
  const currentHash = window.location.hash;
  if (currentHash.includes('?filename=')) {
    // Replace existing filename
    const newHash = currentHash.replace(/\?filename=[^&]+/, `?filename=${filename}`);
    history.pushState(null, '', newHash);
  } else {
    // Add new filename
    const newHash = `${currentHash}?filename=${filename}`;
    history.pushState(null, '', newHash);
  }
}

// Modify the existing elementHasChild function
function elementHasChild(parent, child) {
  if (child === parent) return true;
  let node = child.parentNode;
  while (node != null) {
    if (node == parent) return true;
    node = node.parentNode;
  }
  return false;
}

// Add this to the existing window.addEventListener('load', ...) function
window.addEventListener('load', function() {
  // ... (existing code)

  // Handle initial URL
  handleURL();
});

// Listen for hash changes and call handleURL
window.onhashchange = function() { handleURL(); }

// Add this new function to handle URL changes
function handleURL() {
  const hash = window.location.hash;
  if (hash === '') {
    history.pushState(null, '', '#about');
    return;
  }
  if (hash.includes('?gsplats')) {
    showGSplats();
    const filename = hash.split('?filename=')[1];
    if (filename && filename.trim() !== '') {
      loadGSplat(filename);
    }
  } else {
    document.querySelector('.projects').style.display = 'block';
    document.getElementById('gsplats-viewer').style.display = 'none';
  }

  // Handle navbar menu selection
  const pages = document.querySelectorAll("[data-page]");
  const navigationLinks = document.querySelectorAll("[data-nav-link]");

  pages.forEach((page, index) => {
    if (hash.includes('#' + page.dataset.page)) {
      page.classList.add("active");
      navigationLinks[index].classList.add("active");
    } else {
      page.classList.remove("active");
      navigationLinks[index].classList.remove("active");
    }
  });
}

// Add this to handle browser back/forward navigation
window.addEventListener('popstate', handleURL);
