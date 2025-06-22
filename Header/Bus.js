
const menuBtn = document.getElementById("menuBtn");
const slideMenu = document.getElementById("slideMenu");
const closeMenuBtn = document.getElementById("closeMenuBtn");
const overlay = document.getElementById("overlay");

function openMenu() {
  slideMenu.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  slideMenu.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
}

menuBtn.addEventListener("click", openMenu);
closeMenuBtn.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

// Optional: close menu on ESC key
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    !slideMenu.classList.contains("-translate-x-full")
  ) {
    closeMenu();
  }
});

////// 