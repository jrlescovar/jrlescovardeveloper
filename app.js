const setContainerInteractive = (container, isInteractive) => {
  container.toggleAttribute("inert", !isInteractive);

  container.querySelectorAll("a, button").forEach((element) => {
    if (isInteractive) {
      const previousTabIndex = element.dataset.previousTabIndex;

      if (previousTabIndex === "") {
        element.removeAttribute("tabindex");
      } else if (previousTabIndex !== undefined) {
        element.setAttribute("tabindex", previousTabIndex);
      }

      delete element.dataset.previousTabIndex;
    } else {
      if (element.dataset.previousTabIndex === undefined) {
        element.dataset.previousTabIndex = element.getAttribute("tabindex") || "";
      }

      element.tabIndex = -1;
    }
  });
};

(() => {
  const languageToggle = document.getElementById("langToggle");
  const spanishToggle = document.getElementById("spanishToggle");
  const description = document.querySelector('meta[name="description"]');

  if (!languageToggle || !spanishToggle) return;

  const copy = {
    pt: {
      description: "Portfólio de João Lescovar, desenvolvedor web e estudante de Sistemas de Informação.",
      topLinks: ["Sobre", "Habilidades", "Projetos", "Redes"],
      sidebarLabel: "Navegação",
      sideTitles: ["Início", "Sobre", "Habilidades", "Projetos", "Redes"],
      sideDetails: ["Apresentação", "Minha trajetória", "Tecnologias e ferramentas", "Trabalhos selecionados", "Onde me encontrar"],
      connect: "Conecte-se",
      skillsKicker: "MINHA STACK",
      skillsTitle: "Tecnologias que uso para construir.",
      skillsDescription: "Ferramentas que fazem parte dos meus estudos, projetos e soluções.",
      aboutKicker: "SOBRE MIM",
      aboutTitle: "Desenvolvo experiências digitais que unem<br>design, código e propósito.",
      aboutParagraphs: [
        "Sou <strong>João Lescovar</strong>, estudante de <strong>Sistemas de Informação na FIPP/UNOESTE</strong> e desenvolvedor web.",
        "Transformo ideias em <strong>sites modernos, responsivos e bem estruturados</strong>, buscando equilibrar identidade visual, experiência do usuário e soluções que realmente façam sentido para cada projeto.",
        "Minha trajetória com programação começou em 2020 e, desde então, venho evoluindo através de estudos, projetos próprios e experiências reais de desenvolvimento.",
      ],
      resumeTitle: "Currículo",
      resumeDescription: "Uma versão completa estará disponível em breve.",
      soon: "Em breve",
      realProjectsKicker: "PROJETOS REAIS",
      realProjectsTitle: "Projetos Pelo Mundo",
      realProjectsDescription: "Clique nas imagens para navegar pelas telas de cada projeto.",
      realProjectDescription: "Tu momento de café en Madrid. Café de especialidad, brunch y un espacio tranquilo para disfrutar sin prisas en Hortaleza.",
      realProjectType: "Desenvolvimento Web",
      realProjectCountry: "Espanha",
      realProjectLink: "Visitar ↗",
      projectsKicker: "CRIAÇÕES",
      projectsTitle: "Projetos Pessoais.",
      projectsDescription: "Clique nas imagens para navegar pelas telas de cada projeto.",
      swipe: "Deslize para explorar <span>→</span>",
      featured: "2026 — DESTAQUE",
      projectDescriptions: [
        "Experiência 100% inspirada na Kings League e em sua dinâmica. Escolha entre 70 clubes e crie sua história no universo Kings.",
        "Estatísticas, campeonatos, perfis e personalização para uma comunidade de jogadores de EA27, remodelado e otimizado em uma nova versão do antigo EA26 Club APP.",
        "Disputa de pênaltis com cartas, estatísticas e mecânicas estratégicas, construída inteiramente em C.",
        "Recriação acadêmica do clássico dBase, com banco de dados dinâmico e estruturas encadeadas.",
        "Catálogo responsivo com autenticação, carrinho por usuário e painel administrativo no Firebase.",
      ],
      gallery: "Ver galeria <b>↗</b>",
      development: "Em desenvolvimento",
      updating: "Em atualização",
      projectLinks: ["Em breve", "Visitar ↗", "GitHub ↗", "GitHub ↗", "GitHub ↗"],
      contactKicker: "ALÉM DESTE PORTFÓLIO",
      contactTitle: "Me encontre por aí.",
      contactDescription: "Código, projetos e um pouco dos bastidores do que estou construindo.",
      socialDetails: ["jrlescovar@gmail.com", "Código e projetos", "Perfil profissional", "Perfil pessoal", "Perfil em breve"],
      footerCredit: "Projetado e desenvolvido por João Lescovar.",
      rights: "Todos os direitos reservados.",
      previous: "← ANTERIOR",
      next: "PRÓXIMA →",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      toggleLabel: "Mudar idioma para inglês",
    },
    en: {
      description: "Portfolio of João Lescovar, Web Developer and Information Systems student.",
      topLinks: ["About", "Skills", "Projects", "Socials"],
      sidebarLabel: "Navigation",
      sideTitles: ["Home", "About", "Skills", "Projects", "Socials"],
      sideDetails: ["Introduction", "My journey", "Technologies and tools", "Selected work", "Where to find me"],
      connect: "Connect",
      skillsKicker: "MY STACK",
      skillsTitle: "Technologies I use to build.",
      skillsDescription: "Tools that are part of my studies, projects and solutions.",
      aboutKicker: "ABOUT ME",
      aboutTitle: "I develop digital experiences that unite<br>design, code and purpose.",
      aboutParagraphs: [
        "I am <strong>João Lescovar</strong>, an <strong>Information Systems student at FIPP/UNOESTE</strong> and a web developer.",
        "I turn ideas into <strong>modern, responsive and well-structured websites</strong>, seeking to balance visual identity, user experience and solutions that truly make sense for each project.",
        "My programming journey began in 2020 and, since then, I have continued to grow through studies, personal projects and real-world development experience.",
      ],
      resumeTitle: "Résumé",
      resumeDescription: "A complete version will be available soon.",
      soon: "Coming soon",
      realProjectsKicker: "REAL-WORLD PROJECTS",
      realProjectsTitle: "Projects Around the World",
      realProjectsDescription: "Click the images to browse each project's screens.",
      realProjectDescription: "Your coffee moment in Madrid. Specialty coffee, brunch and a peaceful space to enjoy without rushing in Hortaleza.",
      realProjectType: "Web Development",
      realProjectCountry: "Spain",
      realProjectLink: "Visit ↗",
      projectsKicker: "CREATIONS",
      projectsTitle: "Personal Projects.",
      projectsDescription: "Click the images to browse each project's screens.",
      swipe: "Swipe to explore <span>→</span>",
      featured: "2026 — FEATURED",
      projectDescriptions: [
        "A 100% Kings League-inspired experience built around its unique dynamics. Choose from 70 clubs and create your own story in the Kings universe.",
        "Statistics, tournaments, profiles and customization for an EA27 player community, redesigned and optimized as a new version of the former EA26 Club APP.",
        "A penalty shootout game with cards, statistics and strategic mechanics, built entirely in C.",
        "An academic recreation of the classic dBase, featuring a dynamic database and linked structures.",
        "A responsive catalog with authentication, per-user carts and a Firebase admin panel.",
      ],
      gallery: "Open gallery <b>↗</b>",
      development: "In development",
      updating: "Being updated",
      projectLinks: ["Coming soon", "Visit ↗", "GitHub ↗", "GitHub ↗", "GitHub ↗"],
      contactKicker: "BEYOND THIS PORTFOLIO",
      contactTitle: "Find me online.",
      contactDescription: "Code, projects and a glimpse behind the scenes of what I am building.",
      socialDetails: ["jrlescovar@gmail.com", "Code and projects", "Professional profile", "Personal profile", "Profile coming soon"],
      footerCredit: "Designed and developed by João Lescovar.",
      rights: "All rights reserved.",
      previous: "← PREVIOUS",
      next: "NEXT →",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      toggleLabel: "Mudar idioma para português",
    },
    es: {
      description: "Portafolio de João Lescovar, desarrollador web y estudiante de Sistemas de Información.",
      topLinks: ["Sobre mí", "Habilidades", "Proyectos", "Redes"],
      sidebarLabel: "Navegación",
      sideTitles: ["Inicio", "Sobre mí", "Habilidades", "Proyectos", "Redes"],
      sideDetails: ["Presentación", "Mi trayectoria", "Tecnologías y herramientas", "Trabajos seleccionados", "Dónde encontrarme"],
      connect: "Conéctate",
      skillsKicker: "MI STACK",
      skillsTitle: "Tecnologías que uso para construir.",
      skillsDescription: "Herramientas que forman parte de mis estudios, proyectos y soluciones.",
      aboutKicker: "SOBRE MÍ",
      aboutTitle: "Desarrollo experiencias digitales que unen<br>diseño, código y propósito.",
      aboutParagraphs: [
        "Soy <strong>João Lescovar</strong>, estudiante de <strong>Sistemas de Información en FIPP/UNOESTE</strong> y desarrollador web.",
        "Transformo ideas en <strong>sitios modernos, responsivos y bien estructurados</strong>, buscando equilibrar identidad visual, experiencia de usuario y soluciones que realmente tengan sentido para cada proyecto.",
        "Mi trayectoria en programación comenzó en 2020 y, desde entonces, sigo evolucionando mediante estudios, proyectos propios y experiencias reales de desarrollo.",
      ],
      resumeTitle: "Currículum",
      resumeDescription: "Una versión completa estará disponible próximamente.",
      soon: "Próximamente",
      realProjectsKicker: "PROYECTOS REALES",
      realProjectsTitle: "Proyectos por el Mundo",
      realProjectsDescription: "Haz clic en las imágenes para recorrer las pantallas de cada proyecto.",
      realProjectDescription: "Tu momento de café en Madrid. Café de especialidad, brunch y un espacio tranquilo para disfrutar sin prisas en Hortaleza.",
      realProjectType: "Desarrollo Web",
      realProjectCountry: "España",
      realProjectLink: "Visitar ↗",
      projectsKicker: "CREACIONES",
      projectsTitle: "Proyectos Personales.",
      projectsDescription: "Haz clic en las imágenes para recorrer las pantallas de cada proyecto.",
      swipe: "Desliza para explorar <span>→</span>",
      featured: "2026 — DESTACADO",
      projectDescriptions: [
        "Una experiencia 100% inspirada en la Kings League y su dinámica. Elige entre 70 clubes y crea tu propia historia en el universo Kings.",
        "Estadísticas, campeonatos, perfiles y personalización para una comunidad de jugadores de EA27, rediseñado y optimizado como una nueva versión del antiguo EA26 Club APP.",
        "Una tanda de penaltis con cartas, estadísticas y mecánicas estratégicas, desarrollada completamente en C.",
        "Una recreación académica del clásico dBase, con una base de datos dinámica y estructuras enlazadas.",
        "Un catálogo adaptable con autenticación, carritos por usuario y un panel administrativo en Firebase.",
      ],
      gallery: "Ver galería <b>↗</b>",
      development: "En desarrollo",
      updating: "En actualización",
      projectLinks: ["Próximamente", "Visitar ↗", "GitHub ↗", "GitHub ↗", "GitHub ↗"],
      contactKicker: "MÁS ALLÁ DE ESTE PORTAFOLIO",
      contactTitle: "Encuéntrame por aquí.",
      contactDescription: "Código, proyectos y un poco del proceso detrás de lo que estoy construyendo.",
      socialDetails: ["jrlescovar@gmail.com", "Código y proyectos", "Perfil profesional", "Perfil personal", "Perfil próximamente"],
      footerCredit: "Diseñado y desarrollado por João Lescovar.",
      rights: "Todos los derechos reservados.",
      previous: "← ANTERIOR",
      next: "SIGUIENTE →",
      openMenu: "Abrir menú",
      closeMenu: "Cerrar menú",
      toggleLabel: "Mudar idioma para português",
    },
  };

  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setHTML = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.innerHTML = value;
  };

  const setList = (selector, values, useHTML = false) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (values[index] === undefined) return;
      if (useHTML) element.innerHTML = values[index];
      else element.textContent = values[index];
    });
  };

  const applyLanguage = (language) => {
    const selected = ["pt", "en", "es"].includes(language) ? language : "pt";
    const text = copy[selected];

    document.documentElement.lang = selected === "pt" ? "pt-BR" : selected;
    document.title = "João Lescovar — Web Developer";
    if (description) description.content = text.description;

    setList(".topbar-nav .top-link", text.topLinks);
    setText(".sidebar-nav-label", text.sidebarLabel);
    setList(".side-copy strong", text.sideTitles);
    setList(".side-copy small", text.sideDetails);
    setText(".sidebar-footer > span", text.connect);
    setText("#habilidades .section-kicker", text.skillsKicker);
    setText("#skillsTitle", text.skillsTitle);
    setText(".skills-heading > p", text.skillsDescription);
    setText("#sobre .section-kicker", text.aboutKicker);
    setHTML("#aboutTitle", text.aboutTitle);
    setList(".about-copy > p", text.aboutParagraphs, true);
    setText(".resume-card > div > span", text.resumeTitle);
    setText(".resume-card strong", text.resumeDescription);
    setText(".resume-status", text.soon);
    setText(".real-projects .section-kicker", text.realProjectsKicker);
    setText(".real-projects-heading h2", text.realProjectsTitle);
    setText(".real-projects-heading > p", text.realProjectsDescription);
    setText(".real-project-card .project-content > p", text.realProjectDescription);
    setText(".real-project-type", text.realProjectType);
    setText(".real-project-country", text.realProjectCountry);
    setText(".real-project-link", text.realProjectLink);
    setText(".personal-projects-heading .section-kicker", text.projectsKicker);
    setText("#projectsTitle", text.projectsTitle);
    setText(".personal-projects-heading > p", text.projectsDescription);
    setHTML(".projects-swipe-hint", text.swipe);
    setText(".project-manager .project-number", text.featured);
    setList("#projectsGrid .project-content > p", text.projectDescriptions);
    document.querySelectorAll(".media-open").forEach((element) => { element.innerHTML = text.gallery; });
    document.querySelectorAll(".project-status-development").forEach((element) => {
      element.textContent = text.development;
    });
    document.querySelectorAll(".project-status-updating").forEach((element) => {
      element.textContent = text.updating;
    });
    setList("#projectsGrid .project-link", text.projectLinks);
    setText("#contato .section-kicker", text.contactKicker);
    setText("#contactTitle", text.contactTitle);
    setText(".connect-copy > p:last-child", text.contactDescription);
    setList(".connect-links small", text.socialDetails);
    setText(".footer > div p", text.footerCredit);
    setHTML(".footer > p", `© <span id="year">${new Date().getFullYear()}</span> ${text.rights}`);
    setText("#lbPrev", text.previous);
    setText("#lbNext", text.next);

    const menuButton = document.getElementById("menuBtn");
    const closeButton = document.getElementById("closeBtn");
    if (menuButton) menuButton.setAttribute("aria-label", text.openMenu);
    if (closeButton) closeButton.setAttribute("aria-label", text.closeMenu);

    languageToggle.textContent = selected === "pt" ? "EN" : "PT";
    languageToggle.setAttribute("aria-label", text.toggleLabel);
    languageToggle.setAttribute("title", text.toggleLabel);
    spanishToggle.textContent = selected === "es" ? "EN" : "ES";
    spanishToggle.setAttribute("aria-label", selected === "es" ? "Cambiar idioma a inglés" : "Cambiar idioma a español");
    spanishToggle.setAttribute("title", selected === "es" ? "Cambiar idioma a inglés" : "Cambiar idioma a español");

    try {
      localStorage.setItem("portfolio-language", selected);
    } catch (_) {
      // O idioma continua funcionando mesmo se o armazenamento estiver indisponível.
    }

    document.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: { language: selected } }));
  };

  let initialLanguage = "pt";
  try {
    const savedLanguage = localStorage.getItem("portfolio-language");
    initialLanguage = ["pt", "en", "es"].includes(savedLanguage) ? savedLanguage : "pt";
  } catch (_) {
    initialLanguage = "pt";
  }

  applyLanguage(initialLanguage);
  languageToggle.addEventListener("click", () => {
    applyLanguage(document.documentElement.lang.startsWith("pt") ? "en" : "pt");
  });
  spanishToggle.addEventListener("click", () => {
    applyLanguage(document.documentElement.lang.startsWith("es") ? "en" : "es");
  });
})();

(() => {
  const topbar = document.getElementById("topbar");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const menuButton = document.getElementById("menuBtn");
  const closeButton = document.getElementById("closeBtn");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!topbar || !sidebar || !overlay || !menuButton || !closeButton) return;

  setContainerInteractive(sidebar, false);

  const resetSwipeStyles = () => {
    sidebar.style.transform = "";
    sidebar.style.transition = "";
    sidebar.style.userSelect = "";
    overlay.style.opacity = "";
    overlay.style.transition = "";
  };

  const setMenuOpen = (isOpen) => {
    resetSwipeStyles();
    sidebar.classList.toggle("open", isOpen);
    overlay.classList.toggle("show", isOpen);
    setContainerInteractive(sidebar, isOpen);
    sidebar.setAttribute("aria-hidden", String(!isOpen));
    overlay.setAttribute("aria-hidden", String(!isOpen));
    menuButton.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) closeButton.focus();
  };

  const closeMenu = (returnFocus = false) => {
    const wasOpen = sidebar.classList.contains("open");
    setMenuOpen(false);

    if (returnFocus && wasOpen) menuButton.focus();
  };

  menuButton.addEventListener("click", () => {
    setMenuOpen(!sidebar.classList.contains("open"));
  });

  closeButton.addEventListener("click", () => closeMenu(true));
  overlay.addEventListener("click", () => closeMenu(true));

  const getScrollOffset = () => {
    const topbarHeight = topbar.getBoundingClientRect().height;
    return topbarHeight + 40;
  };

  document.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const selector = link.getAttribute("href");
      if (!selector || selector === "#") return;

      const target = document.querySelector(selector);
      if (!target) return;

      event.preventDefault();
      closeMenu();

      const top = window.scrollY + target.getBoundingClientRect().top - getScrollOffset();
      window.scrollTo({
        top: Math.max(0, top),
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    });
  });

  const updateHeader = () => {
    topbar.classList.toggle("scrolled", window.scrollY > 30);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("open")) {
      closeMenu(true);
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  let startX = 0;
  let startY = 0;
  let dragX = 0;
  let pointerId = null;
  let canDrag = false;
  let isDragging = false;

  sidebar.addEventListener("pointerdown", (event) => {
    if (!sidebar.classList.contains("open")) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (event.target.closest("a, button")) return;

    startX = event.clientX;
    startY = event.clientY;
    dragX = 0;
    pointerId = event.pointerId;
    canDrag = true;
    isDragging = false;
  });

  sidebar.addEventListener("pointermove", (event) => {
    if (!canDrag) return;

    const horizontalDistance = event.clientX - startX;
    const verticalDistance = event.clientY - startY;

    if (!isDragging) {
      const movedEnough = Math.abs(horizontalDistance) >= 10;
      const horizontalGesture = Math.abs(horizontalDistance) >= Math.abs(verticalDistance);
      if (!movedEnough || !horizontalGesture || horizontalDistance > 0) return;

      isDragging = true;
      sidebar.style.transition = "none";
      sidebar.style.userSelect = "none";
      overlay.style.transition = "none";

      try {
        sidebar.setPointerCapture(pointerId);
      } catch (_) {
        // O navegador pode cancelar a captura durante a rolagem.
      }
    }

    const width = sidebar.getBoundingClientRect().width || 360;
    dragX = Math.max(-width, Math.min(0, horizontalDistance));
    sidebar.style.transform = `translateX(${dragX}px)`;
    overlay.style.opacity = String(1 - Math.min(Math.abs(dragX) / width, 1));
  });

  const finishDrag = () => {
    if (!canDrag) return;

    const dragged = isDragging;
    canDrag = false;
    isDragging = false;

    if (!dragged) {
      pointerId = null;
      return;
    }

    const width = sidebar.getBoundingClientRect().width || 360;
    const shouldClose = dragX <= -Math.max(70, width * 0.28);
    sidebar.style.transition = "transform 0.25s ease";
    sidebar.style.userSelect = "";
    overlay.style.transition = "opacity 0.25s ease";

    if (shouldClose) {
      closeMenu();
    } else {
      sidebar.style.transform = "translateX(0)";
      overlay.style.opacity = "1";
      window.setTimeout(resetSwipeStyles, 280);
    }

    if (pointerId !== null) {
      try {
        sidebar.releasePointerCapture(pointerId);
      } catch (_) {
        // A captura pode já ter sido liberada.
      }
    }

    pointerId = null;
  };

  sidebar.addEventListener("pointerup", finishDrag);
  sidebar.addEventListener("pointercancel", finishDrag);
})();

(() => {
  const lightbox = document.getElementById("lightbox");
  const backdrop = document.getElementById("lightboxBackdrop");
  const closeButton = document.getElementById("lightboxClose");
  const image = document.getElementById("lightboxImg");
  const previousButton = document.getElementById("lbPrev");
  const nextButton = document.getElementById("lbNext");
  const counter = document.getElementById("lbCounter");
  const progress = document.getElementById("lbLine");
  const projectCollections = document.querySelectorAll(".projects-grid");

  if (
    !lightbox ||
    !backdrop ||
    !closeButton ||
    !image ||
    !previousButton ||
    !nextButton ||
    !counter ||
    !progress ||
    !projectCollections.length
  ) {
    return;
  }

  setContainerInteractive(lightbox, false);

  let projectImages = [];
  let currentImage = 0;
  let previousBodyOverflow = "";
  let lastFocusedElement = null;
  let activeProjectTitle = "Projeto";

  const preloadImage = (source) => {
    if (!source) return;
    const preload = new Image();
    preload.src = source;
  };

  const renderImage = () => {
    const total = projectImages.length || 1;
    const english = document.documentElement.lang.startsWith("en");
    currentImage = Math.max(0, Math.min(currentImage, total - 1));
    const source = projectImages[currentImage] || "";

    image.classList.add("is-switching");
    image.src = source;
    image.alt = english
      ? `${activeProjectTitle} — image ${currentImage + 1} of ${total}`
      : `${activeProjectTitle} — imagem ${currentImage + 1} de ${total}`;
    counter.textContent = english
      ? `${currentImage + 1} of ${total}`
      : `${currentImage + 1} de ${total}`;
    progress.style.setProperty("--progress", `${((currentImage + 1) / total) * 100}%`);

    preloadImage(projectImages[currentImage + 1]);
    preloadImage(projectImages[currentImage - 1]);
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    setContainerInteractive(lightbox, false);
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = previousBodyOverflow;

    if (lastFocusedElement && document.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }
  };

  const openLightbox = (sources, projectTitle) => {
    projectImages = sources;
    currentImage = 0;
    activeProjectTitle = projectTitle;
    previousBodyOverflow = document.body.style.overflow;
    lastFocusedElement = document.activeElement;
    document.body.style.overflow = "hidden";
    setContainerInteractive(lightbox, true);
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    renderImage();
    closeButton.focus();
  };

  const showNextImage = () => {
    if (!projectImages.length) return;
    currentImage = (currentImage + 1) % projectImages.length;
    renderImage();
  };

  const showPreviousImage = () => {
    if (!projectImages.length) return;
    currentImage = (currentImage - 1 + projectImages.length) % projectImages.length;
    renderImage();
  };

  const keepFocusInsideLightbox = (event) => {
    if (event.key !== "Tab" || !lightbox.classList.contains("open")) return;

    const focusableElements = Array.from(lightbox.querySelectorAll("button:not([tabindex='-1'])"));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

  image.addEventListener("load", () => image.classList.remove("is-switching"));
  image.addEventListener("error", () => image.classList.remove("is-switching"));
  nextButton.addEventListener("click", showNextImage);
  previousButton.addEventListener("click", showPreviousImage);
  closeButton.addEventListener("click", closeLightbox);
  backdrop.addEventListener("click", closeLightbox);
  document.addEventListener("portfolio:languagechange", () => {
    if (lightbox.classList.contains("open")) renderImage();
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("open")) return;

    keepFocusInsideLightbox(event);
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowRight") showNextImage();
    if (event.key === "ArrowLeft") showPreviousImage();
  });

  projectCollections.forEach((collection) => {
    collection.addEventListener("click", (event) => {
      const mediaButton = event.target.closest(".project-media");
      if (!mediaButton) return;

      const card = mediaButton.closest(".project-card");
      if (!card) return;

      const sources = (card.dataset.images || "")
        .split(",")
        .map((source) => source.trim())
        .filter(Boolean);

      if (!sources.length) return;

      const title = card.querySelector("h3")?.textContent?.trim() || "Projeto";
      openLightbox(sources, title);
    });
  });
})();

(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const elements = Array.from(
    document.querySelectorAll(
      ".skills-card, .about-section .section-heading, .about-grid, .real-projects, .projects-heading, .projects-grid, .connect-section, .faith-mark",
    ),
  );

  if (!elements.length || reducedMotion.matches || !("IntersectionObserver" in window)) return;

  elements.forEach((element) => {
    element.classList.add("reveal-item");
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      element.classList.add("reveal-visible");
    }
  });

  document.body.classList.add("reveal-ready");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );

  elements.forEach((element) => {
    if (!element.classList.contains("reveal-visible")) observer.observe(element);
  });
})();
