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

// Function to open the modal and load BibTeX content
function openModal(contentId) {
  document.getElementById('myModal').style.display = "block";
  loadBibTeX(contentId);
}

// Function to close the modal
window.onclick = function(event) {
  var modal = document.getElementById('myModal');
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

// Function to load BibTeX content
function loadBibTeX(contentId, path) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
      document.getElementById(contentId).textContent = this.responseText;
  };
  xhr.open("GET", "skywolf829.github.io"+path);
  xhr.send();
}

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  document.getElementById('myModal').style.display = "none";
}