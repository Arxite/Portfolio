/* ==========================================================================
   DOM CONTENT LOADED
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("hero-video");
  const heroText = document.getElementById("hero-text");
  const navbar = document.querySelector(".navbar");

  // NAVBAR: Immediate on other pages, delayed on homepage
  const isHomepage = window.location.pathname === "/" || window.location.pathname.includes("index");
  if (navbar) {
    if (isHomepage) {
      navbar.style.opacity = 0;
      navbar.style.top = "-55px";
      setTimeout(() => {
        navbar.style.transition = "opacity 2s ease, top 2s ease";
        navbar.style.opacity = 1;
        navbar.style.top = "0";
      }, 4000);
    } else {
      navbar.style.opacity = 1;
      navbar.style.top = "0";
    }
  }

  // HERO VIDEO + TYPEWRITER
  if (video && heroText) {
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    video.addEventListener("canplaythrough", () => {
      video.style.opacity = 1;
      setTimeout(() => startTypeWriter(heroText, 200), 1500);
    });

    function startTypeWriter(el, speed = 150, callback) {
      el.classList.add("show");
      const text = el.innerText;
      el.innerText = "";
      let i = 0;
      function type() {
        if (i < text.length) {
          el.innerText += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else if (callback) {
          callback();
        }
      }
      type();
    }
  }
});


/* ==========================================================================
   GALLERY FULLSCREEN
   ========================================================================== */
const galleryImages = [
  "indexportfolio/final_tam_1.jpg",
  "indexportfolio/treasure_maddi.jpg",
  "indexportfolio/treasure_tam.jpg",
  "indexportfolio/kav_2.jpg",
  "indexportfolio/final_tam_2.jpg",
  "indexportfolio/tam_2.jpg",
  "indexportfolio/bread.jpg",
  "indexportfolio/voss.jpg",
  "indexportfolio/tam_1.jpg",
  "indexportfolio/kav_1.jpg"
];

let currentIndex = 0;

function openFullscreen(index) {
  currentIndex = index;
  document.getElementById("fullscreen-img").src = galleryImages[currentIndex];
  document.getElementById("fullscreen-view").style.display = "flex";
}

function closeFullscreen() {
  document.getElementById("fullscreen-view").style.display = "none";
}

function changeImage(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = galleryImages.length - 1;
  if (currentIndex >= galleryImages.length) currentIndex = 0;
  document.getElementById("fullscreen-img").src = galleryImages[currentIndex];
}

document.addEventListener("keydown", e => {
  const fs = document.getElementById("fullscreen-view").style.display === "flex";
  if (!fs) return;
  if (e.key === "ArrowLeft") changeImage(-1);
  else if (e.key === "ArrowRight") changeImage(1);
  else if (e.key === "Escape") closeFullscreen();
});


/* ==========================================================================
   SCROLL-TRIGGERED FADE
   ========================================================================== */
function fadeOnScroll() {
  const elements = document.querySelectorAll(".fade-on-scroll");
  const windowBottom = window.innerHeight + window.scrollY;

  elements.forEach(el => {
    const elTop = el.getBoundingClientRect().top + window.scrollY;
    if (windowBottom > elTop + 50) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", fadeOnScroll);
window.addEventListener("load", fadeOnScroll);


/* ==========================================================================
   NAV MENU: HAMBURGER + DROPDOWN FIXED WITH MOBILE DROPDOWN GRADIENT
   ========================================================================== */
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const navbarEl = document.querySelector(".navbar");
const dropdowns = document.querySelectorAll(".dropdown");

function toggleMenu(btn) {
  btn.classList.toggle("active");
  navLinks.classList.toggle("open");

  if (window.innerWidth <= 768) {
    // Mobile: Hamburger controls gradient
    navbarEl.classList.toggle("hamburger-open", navLinks.classList.contains("open"));
  }
}

function closeMenu() {
  navLinks.classList.remove("open");
  hamburger.classList.remove("active");
  navbarEl.classList.remove("hamburger-open");
  navbarEl.classList.remove("dropdown-active");
  navbarEl.classList.remove("dropdown-mobile-active");
  dropdowns.forEach(dd => dd.classList.remove("open"));
}

function toggleDropdown(e) {
  e.preventDefault();
  const dropdown = e.target.closest(".dropdown");
  dropdown.classList.toggle("open");

  if (window.innerWidth > 768) {
    navbarEl.classList.toggle("dropdown-active", dropdown.classList.contains("open"));
  } else {
    if (dropdown.classList.contains("open")) {
      navbarEl.classList.add("dropdown-mobile-active");
    } else {
      navbarEl.classList.remove("dropdown-mobile-active");
    }
  }
}

// Close menus on outside click
document.addEventListener("click", e => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }

  dropdowns.forEach(dd => {
    if (!dd.contains(e.target)) {
      dd.classList.remove("open");
    }
  });

  if (!navLinks.classList.contains("open") &&
      !Array.from(dropdowns).some(dd => dd.classList.contains("open"))) {
    navbarEl.classList.remove("dropdown-active");
    navbarEl.classList.remove("hamburger-open");
    navbarEl.classList.remove("dropdown-mobile-active");
  }
});

// Close menus on scroll
window.addEventListener("scroll", () => {
  if (navLinks.classList.contains("open") || Array.from(dropdowns).some(dd => dd.classList.contains("open"))) {
    closeMenu();
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navbarEl.classList.remove("hamburger-open", "dropdown-mobile-active");
    navLinks.classList.remove("open");
    hamburger.classList.remove("active");
  } else {
    navbarEl.classList.remove("dropdown-active");
    dropdowns.forEach(dd => dd.classList.remove("open"));
  }
});


/* ==========================================================================
   FULLSCREEN SWIPE
   ========================================================================== */
let startX = 0;
const fsView = document.getElementById("fullscreen-view");

fsView.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

fsView.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) changeImage(1);
  if (endX - startX > 50) changeImage(-1);
});
