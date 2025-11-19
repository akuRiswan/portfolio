// scroll animation
// scroll animation
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("pin-wrapper");

  // Anda hanya perlu menambah ID elemen baru di sini
  const sections = [
    document.getElementById("home"),
    document.getElementById("aboutme"),
    document.getElementById("project"),
    document.getElementById("skills"),
    document.getElementById("contact"),
  ];

  if (!wrapper || sections.some((s) => !s)) {
    console.error("Salah satu elemen HTML tidak ditemukan!");
    return;
  }

  const setInitialStates = () => {
    sections.forEach((section, i) => {
      section.style.opacity = i === 0 ? "1" : "0";
      section.style.transform = `scale(${i === 0 ? 1 : 0.5})`;
      section.style.position = "fixed"; // Pastikan semua section tetap di tempat
      section.style.top = "0";
      section.style.left = "0";
      section.style.width = "100%";
    });
  };
  setInitialStates();

  const animationScrollDistance = wrapper.offsetHeight - window.innerHeight;
  let ticking = false;

  function handleScroll() {
    const scrollFromWrapperTop = -wrapper.getBoundingClientRect().top;

    // Kondisi sebelum animasi dimulai
    if (scrollFromWrapperTop < 0) {
      setInitialStates();
      return;
    }
    // Kondisi setelah animasi selesai
    else if (scrollFromWrapperTop > animationScrollDistance) {
      sections.forEach((s, i) => {
        const isLastSection = i === sections.length - 1;
        s.style.opacity = isLastSection ? "1" : "0";
        s.style.transform = `scale(${isLastSection ? 1 : 0.5})`;
      });
      return;
    }

    // --- LOGIC DINAMIS ---
    const numTransitions = sections.length - 1;
    if (numTransitions <= 0) return;

    const phaseDuration = 1 / numTransitions;
    const totalProgress = scrollFromWrapperTop / animationScrollDistance;

    const currentPhaseIndex = Math.min(Math.floor(totalProgress / phaseDuration), numTransitions - 1);

    const phaseProgress = (totalProgress - currentPhaseIndex * phaseDuration) / phaseDuration;

    const outgoingSection = sections[currentPhaseIndex];
    const incomingSection = sections[currentPhaseIndex + 1];

    sections.forEach((section, index) => {
      if (index !== currentPhaseIndex && index !== currentPhaseIndex + 1) {
        section.style.opacity = "0";
        section.style.transform = "scale(0.5)";
      }
    });

    if (outgoingSection) {
      outgoingSection.style.transform = `scale(${1 + phaseProgress * 4})`;
      outgoingSection.style.opacity = 1 - phaseProgress;
    }
    if (incomingSection) {
      incomingSection.style.transform = `scale(${0.5 + phaseProgress * 0.5})`;
      incomingSection.style.opacity = phaseProgress;
    }
  }

  // Event listener tetap sama
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
});

// hover project card
document.addEventListener("DOMContentLoaded", () => {
  const projectCards = document.querySelectorAll(".card-project");

  projectCards.forEach((card) => {
    const overlay = card.querySelector(".project-overlay");
    if (!overlay) {
      return;
    }

    card.addEventListener("mouseenter", () => {
      // Tampilkan overlay dengan mengubah opacity-nya
      overlay.classList.remove("opacity-0");
      overlay.classList.add("opacity-100");
    });

    card.addEventListener("mouseleave", () => {
      // Sembunyikan kembali overlay-nya
      overlay.classList.remove("opacity-100");
      overlay.classList.add("opacity-0");
    });
  });
});

// max word length - 20 word
let twntyWord = document.querySelectorAll(".max-20word");

twntyWord.forEach((twnty) => {
  let words = twnty.innerText.split(" "); // pecah jadi array kata
  let limit = 20; // batas kata

  if (words.length > limit) {
    twnty.innerText = words.slice(0, limit).join(" ") + " . . ."; // potong dan tambahkan ...
  }
});

// max word length - 2 word
let twoWord = document.querySelectorAll(".max-2word");

twoWord.forEach((two) => {
  let words = two.innerText.split(" "); // pecah jadi array kata
  let limit = 2; // batas kata

  if (words.length > limit) {
    two.innerText = words.slice(0, limit).join(" "); // potong dan
  }
});

// Navbar
document.addEventListener("DOMContentLoaded", () => {
  // Pilih semua elemen dengan class 'nav-link'
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();

      const targetId = this.getAttribute("href");
      let targetScrollY = 0;

      switch (targetId) {
        case "#home":
          targetScrollY = 0;
          break;
        case "#aboutme":
          targetScrollY = window.innerHeight * 2;
          break;
        case "#project":
          targetScrollY = window.innerHeight * 4;
          break;
        case "#skills":
          targetScrollY = window.innerHeight * 6;
          break;
        case "#contact":
          targetScrollY = window.innerHeight * 8;
          break;
      }

      window.scrollTo({
        top: targetScrollY,
        behavior: "smooth", // Efek scroll halus
      });
    });
  });

  // NOTE: Kode animasi scroll utama Anda yang sudah ada harus tetap dipertahankan.
  // Kode ini hanya untuk menangani klik pada navbar.
});
