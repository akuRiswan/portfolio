const projects = [
  {
    title: "Running Text Arduino",
    desc: "Sistem display teks berjalan berbasis Arduino.",
    img: "assets/img/running-text-arduino.jpg",
    link: "#",
  },
  {
    title: "Digital Invitation",
    desc: "Undangan digital berbasis web.",
    img: "assets/img/digital-invitation.png",
    link: "https://kuladigital.webinvit.id/",
  },
  {
    title: "Royal Rent Web",
    desc: "Platform penyewaan mobil otomatis.",
    img: "assets/img/web-royal-rent.png",
    link: "https://rental-mobil-phi.vercel.app/",
  },
];

function renderProjects() {
  const container = document.getElementById("project-list");
  if (!container) return;
  container.innerHTML = projects
    .map(
      (p) => `
    <a href="${p.link}" target="_blank" class="project-card min-w-[75vw] md:min-w-[400px] group relative overflow-hidden rounded-3xl h-[45vh] lg:h-[50vh] bg-gray-100 block z-100">
      <img src="${p.img}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" draggable="false" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-8 flex flex-col justify-end text-white">
        <h3 class="text-2xl font-bold tracking-tight">${p.title}</h3>
        <p class="text-xs opacity-60 line-clamp-2">${p.desc}</p>
      </div>
    </a>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.__riswanInitialized) return;
  window.__riswanInitialized = true;
  renderProjects();

  const wrapper = document.getElementById("pin-wrapper");
  const sections = Array.from(document.querySelectorAll(".stack-section"));
  const projectList = document.getElementById("project-list");
  const menuBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  // Blocker overlay to intercept pointer/selection for background sections
  let stackBlocker = document.getElementById("stack-blocker");
  if (!stackBlocker) {
    stackBlocker = document.createElement("div");
    stackBlocker.id = "stack-blocker";
    Object.assign(stackBlocker.style, {
      position: "fixed",
      inset: "0",
      background: "transparent",
      zIndex: "0",
      pointerEvents: "none",
      userSelect: "none",
      display: "none",
    });
    document.body.appendChild(stackBlocker);
  }

  // --- MOBILE MENU LOGIC ---

  // Create backdrop element for blur + dim when menu is open
  let mobileBackdrop = document.getElementById("mobile-menu-backdrop");
  if (!mobileBackdrop) {
    mobileBackdrop = document.createElement("div");
    mobileBackdrop.id = "mobile-menu-backdrop";
    Object.assign(mobileBackdrop.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.25)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      opacity: "0",
      transition: "opacity 0.35s ease",
      pointerEvents: "none",
      zIndex: "9",
    });
    document.body.appendChild(mobileBackdrop);
  }

  // inject simple hover/glass styles for mobile menu links
  if (!document.getElementById("mobile-menu-styles")) {
    const style = document.createElement("style");
    style.id = "mobile-menu-styles";
    style.innerHTML = `
      #mobile-menu{ background: rgba(255,255,255,0.7); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); color: #111 }
      #mobile-menu .mobile-nav-link{ display:block; padding:12px 5px; transition: transform .18s ease, background .18s ease, color .18s ease; border-radius:6px; color: inherit; text-decoration:none }
      #mobile-menu .mobile-nav-link:hover{ transform: translateY(2px); color: rgba(106, 114, 130, 0.8); }
    `;
    document.head.appendChild(style);
  }

  if (mobileMenu) {
    // remove utility classes that set full inset/translate which conflict with our inline transform
    mobileMenu.classList.remove("inset-0", "translate-x-full", "translate-x-0");
    // initialize styles so menu slides from top and occupies half the screen height
    Object.assign(mobileMenu.style, {
      position: mobileMenu.style.position || "fixed",
      top: "0",
      left: "0",
      right: "auto",
      bottom: "auto",
      height: mobileMenu.style.height || "100%",
      width: mobileMenu.style.width || "100%",
      maxWidth: mobileMenu.style.maxWidth || "100%",
      transform: "translateY(-100%)",
      transition: "transform 0.35s ease",
      zIndex: mobileMenu.style.zIndex || "10",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      display: mobileMenu.style.display || "flex",
      flexDirection: mobileMenu.style.flexDirection || "column",
      alignItems: mobileMenu.style.alignItems || "center",
      justifyContent: mobileMenu.style.justifyContent || "center",
    });
    mobileMenu.setAttribute("data-open", "false");
  }

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.transform = "translateY(0)";
    mobileMenu.setAttribute("data-open", "true");
    if (menuIcon) menuIcon.className = "bi bi-x-lg";
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (mobileBackdrop) {
      mobileBackdrop.style.opacity = "1";
      mobileBackdrop.style.pointerEvents = "auto";
    }
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.transform = "translateY(-100%)";
    mobileMenu.setAttribute("data-open", "false");
    if (menuIcon) menuIcon.className = "bi bi-list";
    if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (mobileBackdrop) {
      mobileBackdrop.style.opacity = "0";
      mobileBackdrop.style.pointerEvents = "none";
    }
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", () => {
      closeMobileMenu();
    });
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenu && mobileMenu.getAttribute("data-open") === "true";
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });
  }

  // --- DRAG TO SCROLL LOGIC ---
  let isDown = false;
  let startX;
  let scrollLeft;

  projectList.addEventListener("mousedown", (e) => {
    isDown = true;
    projectList.classList.replace("cursor-grab", "cursor-grabbing");
    startX = e.pageX - projectList.offsetLeft;
    scrollLeft = projectList.scrollLeft;
  });

  projectList.addEventListener("mouseleave", () => {
    isDown = false;
    projectList.classList.replace("cursor-grabbing", "cursor-grab");
  });

  projectList.addEventListener("mouseup", () => {
    isDown = false;
    projectList.classList.replace("cursor-grabbing", "cursor-grab");
  });

  projectList.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - projectList.offsetLeft;
    const walk = (x - startX) * 2;
    projectList.scrollLeft = scrollLeft - walk;
  });

  // --- BUTTON NAVIGATION ---
  document.getElementById("prev-btn").addEventListener("click", () => {
    projectList.scrollBy({ left: -500, behavior: "smooth" });
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    projectList.scrollBy({ left: 500, behavior: "smooth" });
  });

  // --- STACKING ANIMATION LOGIC ---
  const animationDistance = wrapper.offsetHeight - window.innerHeight;
  let ticking = false;
  let lastScrolledIdx = -1;
  let disableAutoSnap = false;

  function update() {
    const scrollProgress = Math.max(0, Math.min(-wrapper.getBoundingClientRect().top / animationDistance, 1));
    const numSections = sections.length;
    const phaseDuration = 1 / (numSections - 1);

    const currentIdx = Math.min(Math.floor(scrollProgress / phaseDuration), numSections - 2);
    const phaseProgress = (scrollProgress - currentIdx * phaseDuration) / phaseDuration;

    // Auto snap ke section berikutnya
    if (!disableAutoSnap && phaseProgress > 0.5 && lastScrolledIdx !== currentIdx + 1) {
      lastScrolledIdx = currentIdx + 1;
      const targetScroll = (currentIdx + 1) * (animationDistance / (numSections - 1));
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    } else if (phaseProgress <= 0.5 && lastScrolledIdx !== currentIdx) {
      lastScrolledIdx = currentIdx;
    }

    sections.forEach((section, index) => {
      const isActive = index === currentIdx || index === currentIdx + 1;
      const topIndex = phaseProgress < 0.5 ? currentIdx : currentIdx + 1;

      if (isActive) {
        section.classList.add("active-section");
        // Ensure the visually-top section has the highest z-index and receives pointer events
        if (index === topIndex) {
          section.style.zIndex = 1000 + index;
          section.style.pointerEvents = "auto";
          section.style.userSelect = "auto";
          section.setAttribute("aria-hidden", "false");
        } else {
          section.style.zIndex = 100 + index;
          section.style.pointerEvents = "none";
          section.style.userSelect = "none";
          section.setAttribute("aria-hidden", "true");
        }
      } else {
        section.classList.remove("active-section");
        section.style.zIndex = index;
        section.style.pointerEvents = "none";
        section.style.userSelect = "none";
        section.setAttribute("aria-hidden", "true");
      }

      let animProgress = phaseProgress > 0.3 ? (phaseProgress - 0.3) / 0.7 : 0;

      if (index === currentIdx) {
        section.style.opacity = 1 - animProgress * 1.5;
        section.style.transform = `scale(${1 + animProgress * 1.5})`;
      } else if (index === currentIdx + 1) {
        section.style.opacity = animProgress;
        section.style.transform = `scale(${0.7 + animProgress * 0.3})`;
      } else {
        section.style.opacity = "0";
      }
    });

    // Keep blocker disabled — rely on per-section pointer-events/user-select instead
    stackBlocker.style.display = "none";
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Smooth Nav
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        // close mobile menu when navigating
        closeMobileMenu();

        const idx = ["#home", "#aboutme", "#skills", "#project", "#contact"].indexOf(targetId);
        if (idx >= 0) {
          disableAutoSnap = true;
          const targetScroll = idx * (animationDistance / (sections.length - 1));
          window.scrollTo({
            top: targetScroll,
            behavior: "smooth",
          });
          setTimeout(() => {
            disableAutoSnap = false;
            lastScrolledIdx = idx;
          }, 700);
        }
      }
    });
  });

  update();
});
