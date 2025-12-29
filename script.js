/* =========================
   CONFIGURATION
========================= */
const fadeInDuration = 1000;
const fadeOutDuration = 500;

/* =========================
   PAGE TRANSITIONS
========================= */
const page = document.getElementById("page");
const links = document.querySelectorAll("a[href]");

page.style.opacity = 0;
page.style.transition = `opacity ${fadeInDuration}ms ease`;
page.style.visibility = "hidden";

window.addEventListener("load", () => {
  setTimeout(() => {
    page.style.visibility = "visible";
    page.style.opacity = 1;
  }, 50);
});

links.forEach(link => {
  link.addEventListener("click", e => {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href === window.location.pathname) return;

    e.preventDefault();
    page.style.transition = `opacity ${fadeOutDuration}ms ease`;
    page.style.opacity = 0;

    setTimeout(() => {
      window.location.href = href;
    }, fadeOutDuration);
  });
});

window.addEventListener("pageshow", () => {
  page.style.transition = `opacity ${fadeInDuration}ms ease`;
  page.style.visibility = "visible";
  page.style.opacity = 1;
});

/* =========================
   NAVIGATION MENU
========================= */
const navLinks = document.querySelector(".nav-links");
const hamburger = document.querySelector(".hamburger");
const navbarEl = document.querySelector(".navbar");
const dropdowns = document.querySelectorAll(".dropdown");

function toggleMenu(btn) {
  btn.classList.toggle("active");
  navLinks.classList.toggle("open");

  if (window.innerWidth <= 768) {
    navbarEl.classList.toggle("hamburger-open", navLinks.classList.contains("open"));
  }
}

function closeMenu() {
  navLinks.classList.remove("open");
  hamburger.classList.remove("active");
  navbarEl.classList.remove("hamburger-open", "dropdown-active");

  dropdowns.forEach(dd => {
    dd.classList.remove("open");
    const menu = dd.querySelector(".dropdown-menu");
    if (menu) menu.style.maxHeight = "0";
  });
}

document.addEventListener("click", e => {
  if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
    closeMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) closeMenu();
});

/* ---------- DROPDOWN ---------- */
function toggleDropdown(e) {
  e.preventDefault();
  const dropdown = e.target.closest(".dropdown");
  const menu = dropdown.querySelector(".dropdown-menu");

  dropdown.classList.toggle("open");

  if (window.innerWidth <= 768) {
    if (dropdown.classList.contains("open")) {
      menu.style.transition =
        "max-height 0.5s cubic-bezier(0.25, 1.25, 0.5, 1)";
      menu.style.maxHeight = menu.scrollHeight + "px";

      const links = menu.querySelectorAll("a");
      links.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.05}s`;
      });
    } else {
      menu.style.maxHeight = "0";
      const links = menu.querySelectorAll("a");
      links.forEach(link => (link.style.transitionDelay = "0s"));
    }
  } else {
    navbarEl.classList.toggle(
      "dropdown-active",
      dropdown.classList.contains("open")
    );
  }
}


/* =========================
   SCROLL LOCK (SAFE)
========================= */
function lockScroll() {
  document.body.classList.add("scroll-locked");
}

function unlockScroll() {
  document.body.classList.remove("scroll-locked");
}

/* =========================
   LIGHTBOX GALLERY
========================= */
const images = Array.from(document.querySelectorAll(".masonry img"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const caption = document.getElementById("lightbox-caption");
const closeBtn = document.querySelector(".lightbox-close");
const prevBtn = document.querySelector(".lightbox-prev");
const nextBtn = document.querySelector(".lightbox-next");

let currentIndex = 0;

/* ---------- OPEN ---------- */
images.forEach((img, index) => {
  img.addEventListener("click", () => openLightbox(index));
});

function openLightbox(index) {
  currentIndex = index;
  lockScroll();

  lightboxImg.src = "";
  lightboxImg.style.opacity = "0";

  lightbox.classList.remove("closing");
  lightbox.classList.add("active");

  requestAnimationFrame(showImage);
  updateHash();
}

/* ---------- DISPLAY ---------- */
function showImage() {
  const img = images[currentIndex];

  // Animate OUT
  lightboxImg.style.opacity = "0";
  lightboxImg.style.transform = "scale(1)";

  setTimeout(() => {
    // Swap image
    lightboxImg.src = img.src;
    caption.textContent = img.alt || "";

    // Force browser to apply styles before animating in
    lightboxImg.getBoundingClientRect();

    // Animate IN
    lightboxImg.style.opacity = "1";
    lightboxImg.style.transform = "scale(1)";

    preload();
  }, 200); // must match your CSS timing
}


/* ---------- CLOSE ---------- */
function closeLightbox() {
  lightbox.classList.add("closing");
  lightboxImg.style.opacity = "0";

  setTimeout(() => {
    lightbox.classList.remove("active", "closing");
    unlockScroll();
    history.pushState("", document.title, window.location.pathname);
  }, 400);
}

closeBtn.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

/* ---------- NAVIGATION ---------- */
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage();
  updateHash();
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage();
  updateHash();
});

/* ---------- KEYBOARD ---------- */
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("active")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextBtn.click();
  if (e.key === "ArrowLeft") prevBtn.click();
});

/* ---------- SWIPE ---------- */
let startX = 0;
lightbox.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

lightbox.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  if (Math.abs(diff) > 50) diff > 0 ? nextBtn.click() : prevBtn.click();
});

/* ---------- PRELOAD ---------- */
function preload() {
  [currentIndex + 1, currentIndex - 1].forEach(i => {
    const index = (i + images.length) % images.length;
    const img = new Image();
    img.src = images[index].src;
  });
}

/* ---------- URL HASH SUPPORT ---------- */
function updateHash() {
  history.replaceState(null, "", `#${currentIndex + 1}`);
}

window.addEventListener("load", () => {
  const match = location.hash.match(/(\d+)/);
  if (match) {
    const index = parseInt(match[1], 10) - 1;
    if (images[index]) openLightbox(index);
  }
});


