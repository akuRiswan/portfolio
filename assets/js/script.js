const projects = [
  { title: "GDM Invitation", desc: "Digital invitation team project.", img: "assets/img/project-2.jpg", link: "#" },
  { title: "Coffee Shop POS", desc: "Automated ordering system.", img: "assets/img/project-1.jpg", link: "#" },
  { title: "Car Rental CRUD", desc: "Professional car rental management.", img: "assets/img/project-1.jpg", link: "#" },
  { title: "E-Commerce Web", desc: "Modern online shopping experience.", img: "assets/img/project-2.jpg", link: "#" },
  { title: "Future Project", desc: "Exploring new technologies.", img: "assets/img/project-1.jpg", link: "#" },
];

function renderProjects() {
  const container = document.getElementById("project-list");
  if (!container) return;
  container.innerHTML = projects
    .map(
      (p) => `
    <a href="${p.link}" target="_blank" class="project-card min-w-[85vw] md:min-w-[450px] group relative overflow-hidden rounded-3xl h-[45vh] lg:h-[50vh] bg-gray-100 block">
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
  renderProjects();

  const wrapper = document.getElementById("pin-wrapper");
  const sections = Array.from(document.querySelectorAll(".stack-section"));
  const projectList = document.getElementById("project-list");
  const menuBtn = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  // --- MOBILE MENU LOGIC ---
  menuBtn.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("translate-x-0");
    if (isOpen) {
      mobileMenu.classList.remove("translate-x-0");
      mobileMenu.classList.add("translate-x-full");
      menuIcon.className = "bi bi-list";
    } else {
      mobileMenu.classList.remove("translate-x-full");
      mobileMenu.classList.add("translate-x-0");
      menuIcon.className = "bi bi-x-lg";
    }
  });

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

  function update() {
    const scrollProgress = Math.max(0, Math.min(-wrapper.getBoundingClientRect().top / animationDistance, 1));
    const numSections = sections.length;
    const phaseDuration = 1 / (numSections - 1);

    const currentIdx = Math.min(Math.floor(scrollProgress / phaseDuration), numSections - 2);
    const phaseProgress = (scrollProgress - currentIdx * phaseDuration) / phaseDuration;

    // Auto snap ke section berikutnya
    if (phaseProgress > 0.5 && lastScrolledIdx !== currentIdx + 1) {
      lastScrolledIdx = currentIdx + 1;
      const targetScroll = (currentIdx + 1) * (animationDistance / (numSections - 1));
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    } else if (phaseProgress <= 0.5 && lastScrolledIdx !== currentIdx) {
      lastScrolledIdx = currentIdx;
    }

    sections.forEach((section, index) => {
      if (index === currentIdx || index === currentIdx + 1) {
        section.classList.add("active-section");
        section.style.zIndex = index + 10;
      } else {
        section.classList.remove("active-section");
        section.style.zIndex = index;
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
        mobileMenu.classList.add("translate-x-full");
        mobileMenu.classList.remove("translate-x-0");
        menuIcon.className = "bi bi-list";

        const idx = ["#home", "#aboutme", "#project", "#skills", "#contact"].indexOf(targetId);
        window.scrollTo({
          top: idx * (animationDistance / (sections.length - 1)),
          behavior: "smooth",
        });
      }
    });
  });

  update();
});
