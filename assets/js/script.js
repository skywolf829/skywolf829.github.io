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