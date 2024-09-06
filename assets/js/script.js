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

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

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

// Add these functions at the end of the file

let viewer;

function showGSplats() {
  document.querySelector('.projects').style.display = 'none';
  document.getElementById('gsplats-viewer').style.display = 'block';
  
  // Update URL
  history.pushState(null, '', '#gsplats');
}

function loadGSplat(filename) {
  if (!viewer) {
    viewer = new GaussianSplats3D.Viewer({
      'cameraUp': [0, -1, 0],
      'initialCameraPosition': [-2, -2, -2],
      'initialCameraLookAt': [0, 0, 0],
      'sharedMemoryForWorkers': false
    });
  }
  
  // Clear previous scene
  if (viewer.splatMesh) {
    viewer.dispose();
  }
  viewer = new GaussianSplats3D.Viewer({
    'cameraUp': [0, -1, 0],
    'initialCameraPosition': [-2, -2, -2],
    'initialCameraLookAt': [0, 0, 0],
    'sharedMemoryForWorkers': false
  });
  console.log(viewer);
  viewer.addSplatScene(`./assets/gsplats/${filename}`, {
    'showLoadingUI': true
  }).then(() => {
    viewer.start();
    // Move the viewer's div into the gsplats-viewer container
    const viewerDiv = document.body.lastElementChild;
    const gsplatsContainer = document.getElementById('gsplats-container');
    gsplatsContainer.innerHTML = ''; // Clear existing content
    while (viewerDiv.firstChild) {
      gsplatsContainer.appendChild(viewerDiv.firstChild);
    }
    viewerDiv.remove(); // Remove the original empty div
  });
  
  // Update URL
  history.pushState(null, '', `#gsplats/${filename}`);
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

// Add this new function to handle URL changes
function handleURL() {
  const hash = window.location.hash;
  if (hash.startsWith('#gsplats')) {
    showGSplats();
    const filename = hash.split('/')[1];
    if (filename) {
      loadGSplat(filename);
    }
  }
  else {
    document.querySelector('.projects').style.display = 'block';
    document.getElementById('gsplats-viewer').style.display = 'none';
  }
}

// Add this to handle browser back/forward navigation
window.addEventListener('popstate', handleURL);
