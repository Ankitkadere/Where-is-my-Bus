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

const pwaBtn = document.getElementById("pwaInstallBtn");
const statusMsg = document.getElementById("installStatusMsg");
let deferredPrompt = null;
let appInstalled = false;

// Disable button until PWA prompt is ready
pwaBtn.disabled = true;

// Listen for beforeinstallprompt event
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // Prevent auto prompt
  deferredPrompt = e;
  pwaBtn.disabled = false;
  statusMsg.textContent = " Install Now";
    document.getElementById("App").classList.remove("hidden");
});

// Handle button click
pwaBtn.addEventListener("click", async () => {
  document.getElementById("App").classList.remove("hidden");
  if (appInstalled) {
    statusMsg.textContent = " Already installed.";
    document.getElementById("App").classList.add("hidden");
    return;
  }

  if (!deferredPrompt) {
    statusMsg.textContent = "⚠️ Your Device Does Not Support App";
    document.getElementById("App").classList.add("hidden");
    return;
  }

  // Show the PWA install prompt
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;

  if (choice.outcome === "accepted") {
    statusMsg.textContent = "🎉 App Installed Successfully !";

    appInstalled = true;
  } else {
    statusMsg.textContent = "❌ Install Dismissed By User.";
  }

  deferredPrompt = null;
  pwaBtn.disabled = true;
});

// Listen for actual app installation
window.addEventListener("appinstalled", () => {
  statusMsg.textContent = "🎉 App Installed Successfully!";

  appInstalled = true;
  pwaBtn.disabled = true;
});

function toggleMenu() {
  document.getElementById("App").classList.toggle("hidden");
}
