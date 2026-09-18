import React, { useEffect, useRef, useState } from "react";
import { personalProjects, sidebarTargets, skills, worldProjects } from "./data.js";
import { translations } from "./translations.js";

const github = "https://github.com/jrlescovar";
const linkedin = "https://www.linkedin.com/in/jo%C3%A3o-lescovar-18b951277/";
const instagram = "https://instagram.com/jrlescovar";
const galleryImageCache = new Map();

function preloadGalleryImages(images = []) {
  if (typeof Image === "undefined") return;
  images.forEach((src) => {
    if (galleryImageCache.has(src)) return;
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "high";
    image.src = src;
    galleryImageCache.set(src, image);
    image.decode?.().catch(() => {});
    image.addEventListener("error", () => galleryImageCache.delete(src), { once: true });
  });
}

function Brand({ link = false }) {
  const content = <><span className="brand-bracket">&lt;</span><span className="brand-jr">jr</span><span className="brand-dev">Dev</span><span className="brand-bracket">/&gt;</span></>;
  return link ? <a className="brand-code" href="#inicio" aria-label="Voltar ao início">{content}</a> : <span className="brand-code" aria-label="JrDev">{content}</span>;
}

function AccentArrows({ label }) {
  return label.split(/([←→↗])/u).map((part, index) =>
    /[←→↗]/u.test(part) ? <span className="accent-arrow" key={index}>{part}</span> : part
  );
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-2.2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" /></svg>;
}

function SocialIcons({ label = "Redes sociais" }) {
  return <div className="social-links" aria-label={label}>
    <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="devicon-github-original" aria-hidden="true" /></a>
    <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="devicon-linkedin-plain" aria-hidden="true" /></a>
    <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
  </div>;
}

function SqlIcon() {
  return <span className="sql-icon" aria-hidden="true"><svg viewBox="0 0 64 64">
    <ellipse cx="32" cy="14" rx="20" ry="8" />
    <path d="M12 14v18c0 4.5 9 8 20 8s20-3.5 20-8V14" />
    <path d="M12 32v18c0 4.5 9 8 20 8s20-3.5 20-8V32" />
    <path d="M12 23c0 4.5 9 8 20 8s20-3.5 20-8" />
    <path d="M12 41c0 4.5 9 8 20 8s20-3.5 20-8" />
  </svg></span>;
}

function ProjectCard({ project, text, personalIndex, openGallery }) {
  const personal = Number.isInteger(personalIndex);
  const number = project.numberKey ? text[project.numberKey] : project.number || "2026";
  const description = personal ? text.projectDescriptions[personalIndex] : text[project.descriptionKey];
  const status = personal ? (project.statusKey ? text[project.statusKey] : project.status) : text[project.typeKey];
  const detail = personal ? project.tag : (project.countryKey ? text[project.countryKey] : null);
  const linkLabel = personal ? text.projectLinks[personalIndex] : text[project.linkKey];
  const classes = ["project-card", `project-${project.slug}`];
  if (project.featured) classes.push("project-card-featured");
  if (!personal) classes.push("real-project-card");

  return <article className={classes.join(" ")}>
    <button className="project-media" type="button" aria-label={`${text.gallery.replace(/<[^>]*>/g, "")} — ${project.title}`} onPointerEnter={() => preloadGalleryImages(project.images)} onPointerDown={() => preloadGalleryImages(project.images)} onFocus={() => preloadGalleryImages(project.images)} onClick={(event) => openGallery(project, event.currentTarget)}>
      <img src={project.cover} alt={project.alt} width={project.width} height={project.height} loading="lazy" decoding="async" />
      <span className="media-open" dangerouslySetInnerHTML={{ __html: text.gallery }} />
    </button>
    <div className="project-content">
      <div className="project-number">{number}</div>
      <h3>{project.title}</h3>
      <p>{description}</p>
      <div className="project-footer">
        <div className="project-tags"><span>{status}</span>{detail && <span>{detail}</span>}</div>
        {project.href
          ? <a className="project-link" href={project.href} target="_blank" rel="noopener noreferrer"><AccentArrows label={linkLabel} /></a>
          : <span className="project-link disabled" aria-disabled="true"><AccentArrows label={linkLabel} /></span>}
      </div>
    </div>
  </article>;
}

function Lightbox({ project, index, setIndex, close, text, language }) {
  const closeRef = useRef(null);
  const stageRef = useRef(null);
  const gestureRef = useRef({ pointers: new Map(), mode: "idle" });
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [gesturing, setGesturing] = useState(false);
  const total = project?.images.length || 1;
  const current = project?.images[index] || "";
  const next = () => setIndex((index + 1) % total);
  const previous = () => setIndex((index - 1 + total) % total);

  const updateTransform = (scale, x, y) => {
    const safeScale = Math.min(4, Math.max(1, scale));
    const bounds = stageRef.current?.getBoundingClientRect();
    const maxX = bounds ? (bounds.width * (safeScale - 1)) / 2 : 0;
    const maxY = bounds ? (bounds.height * (safeScale - 1)) / 2 : 0;
    setTransform({
      scale: safeScale,
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    });
  };

  const startGesture = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    stageRef.current?.setPointerCapture?.(event.pointerId);
    const gesture = gestureRef.current;
    gesture.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setGesturing(true);

    if (gesture.pointers.size === 2) {
      const [first, second] = [...gesture.pointers.values()];
      gesture.mode = "pinch";
      gesture.startDistance = Math.hypot(second.x - first.x, second.y - first.y) || 1;
      gesture.startCenter = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      gesture.startScale = transform.scale;
      gesture.startX = transform.x;
      gesture.startY = transform.y;
    } else if (gesture.pointers.size === 1 && transform.scale > 1) {
      gesture.mode = "pan";
      gesture.startPoint = { x: event.clientX, y: event.clientY };
      gesture.startX = transform.x;
      gesture.startY = transform.y;
    }
  };

  const moveGesture = (event) => {
    const gesture = gestureRef.current;
    if (!gesture.pointers.has(event.pointerId)) return;
    event.preventDefault();
    gesture.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (gesture.pointers.size >= 2 && gesture.mode === "pinch") {
      const [first, second] = [...gesture.pointers.values()];
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const center = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
      updateTransform(
        gesture.startScale * (distance / gesture.startDistance),
        gesture.startX + center.x - gesture.startCenter.x,
        gesture.startY + center.y - gesture.startCenter.y,
      );
    } else if (gesture.pointers.size === 1 && gesture.mode === "pan" && transform.scale > 1) {
      const [point] = gesture.pointers.values();
      updateTransform(
        transform.scale,
        gesture.startX + point.x - gesture.startPoint.x,
        gesture.startY + point.y - gesture.startPoint.y,
      );
    }
  };

  const endGesture = (event) => {
    const gesture = gestureRef.current;
    if (!gesture.pointers.has(event.pointerId)) return;
    gesture.pointers.delete(event.pointerId);

    if (gesture.pointers.size === 1 && transform.scale > 1) {
      const [point] = gesture.pointers.values();
      gesture.mode = "pan";
      gesture.startPoint = point;
      gesture.startX = transform.x;
      gesture.startY = transform.y;
    } else {
      gesture.mode = "idle";
      setGesturing(false);
    }

    if (transform.scale <= 1.01) setTransform({ scale: 1, x: 0, y: 0 });
  };

  const zoomWithTrackpad = (event) => {
    if (!event.ctrlKey) return;
    event.preventDefault();
    updateTransform(transform.scale * Math.exp(-event.deltaY * 0.01), transform.x, transform.y);
  };

  const toggleZoom = () => {
    if (transform.scale > 1) setTransform({ scale: 1, x: 0, y: 0 });
    else updateTransform(2, 0, 0);
  };

  useEffect(() => {
    gestureRef.current.pointers.clear();
    gestureRef.current.mode = "idle";
    setGesturing(false);
    setTransform({ scale: 1, x: 0, y: 0 });
    if (project) preloadGalleryImages(project.images);
  }, [project, index]);

  useEffect(() => {
    if (!project) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [project, index]);

  if (!project) return null;
  const counter = language === "en" ? `${index + 1} of ${total}` : `${index + 1} de ${total}`;
  const alt = language === "en" ? `${project.title} — image ${index + 1} of ${total}` : `${project.title} — imagem ${index + 1} de ${total}`;

  return <div className="lightbox open" aria-hidden="false">
    <div className="lightbox-backdrop" onClick={close} />
    <div className="lightbox-shell">
      <button ref={closeRef} className="lightbox-close" type="button" aria-label={language === "en" ? "Close gallery" : language === "es" ? "Cerrar galería" : "Fechar galeria"} onClick={close}>✕</button>
      <div className="lightbox-content" role="dialog" aria-modal="true" aria-label="Galeria do projeto">
        <div
          ref={stageRef}
          className={`lightbox-stage${transform.scale > 1 ? " is-zoomed" : ""}${gesturing ? " is-gesturing" : ""}`}
          role="group"
          aria-label={language === "en" ? "Zoomable image. Pinch with two fingers to zoom." : language === "es" ? "Imagen ampliable. Pellizca con dos dedos para ampliar." : "Imagem ampliável. Use dois dedos para dar zoom."}
          onPointerDown={startGesture}
          onPointerMove={moveGesture}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          onLostPointerCapture={endGesture}
          onWheel={zoomWithTrackpad}
          onDoubleClick={toggleZoom}
        >
          <img className="lightbox-img" src={current} alt={alt} draggable="false" decoding="async" fetchPriority="high" style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})` }} />
        </div>
        <div className="lightbox-nav" aria-label="Navegação da galeria">
          <button className="lb-btn" type="button" onClick={previous}><AccentArrows label={text.previous} /></button>
          <div className="lb-center"><span>{counter}</span><div className="lb-line" aria-hidden="true" style={{ "--progress": `${((index + 1) / total) * 100}%` }} /></div>
          <button className="lb-btn" type="button" onClick={next}><AccentArrows label={text.next} /></button>
        </div>
      </div>
    </div>
  </div>;
}

function App() {
  const [language, setLanguage] = useState(() => {
    try { return ["pt", "en", "es"].includes(localStorage.getItem("portfolio-language")) ? localStorage.getItem("portfolio-language") : "pt"; }
    catch { return "pt"; }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryProject, setGalleryProject] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const menuButtonRef = useRef(null);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const galleryTriggerRef = useRef(null);
  const dragRef = useRef({ active: false, dragging: false, startX: 0, startY: 0, x: 0, pointerId: null });
  const text = translations[language];

  useEffect(() => {
    document.documentElement.lang = language === "pt" ? "pt-BR" : language;
    document.querySelector('meta[name="description"]')?.setAttribute("content", text.description);
    try { localStorage.setItem("portfolio-language", language); } catch { /* armazenamento opcional */ }
  }, [language, text.description]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return undefined;
    const frame = window.requestAnimationFrame(() => {
      const element = document.getElementById(hash);
      if (!element) return;
      const offset = (document.getElementById("topbar")?.getBoundingClientRect().height || 0) + 40;
      window.scrollTo({ top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - offset), behavior: "auto" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = [...document.querySelectorAll(".skills-card, .about-section .section-heading, .about-grid, .real-projects, .projects-heading, .projects-grid, .connect-section, .faith-mark")];
    if (!elements.length || reduced.matches || !("IntersectionObserver" in window)) return undefined;
    elements.forEach((element) => {
      element.classList.add("reveal-item");
      if (element.getBoundingClientRect().top < window.innerHeight * 0.92) element.classList.add("reveal-visible");
    });
    document.body.classList.add("reveal-ready");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("reveal-visible"); observer.unobserve(entry.target); }
    }), { rootMargin: "0px 0px -8%", threshold: 0.12 });
    elements.filter((element) => !element.classList.contains("reveal-visible")).forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const navigate = (event, target) => {
    event.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(target);
    if (!element) return;
    const offset = (document.getElementById("topbar")?.getBoundingClientRect().height || 0) + 40;
    window.scrollTo({ top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - offset), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const resetMenuDrag = () => {
    if (sidebarRef.current) { sidebarRef.current.style.transform = ""; sidebarRef.current.style.transition = ""; sidebarRef.current.style.userSelect = ""; }
    if (overlayRef.current) { overlayRef.current.style.opacity = ""; overlayRef.current.style.transition = ""; }
  };
  const startMenuDrag = (event) => {
    if (!menuOpen || event.target.closest("a, button")) return;
    dragRef.current = { active: true, dragging: false, startX: event.clientX, startY: event.clientY, x: 0, pointerId: event.pointerId };
  };
  const moveMenuDrag = (event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const x = event.clientX - drag.startX;
    const y = event.clientY - drag.startY;
    if (!drag.dragging) {
      if (Math.abs(x) < 10 || Math.abs(x) < Math.abs(y) || x > 0) return;
      drag.dragging = true;
      sidebarRef.current?.setPointerCapture(event.pointerId);
      if (sidebarRef.current) { sidebarRef.current.style.transition = "none"; sidebarRef.current.style.userSelect = "none"; }
      if (overlayRef.current) overlayRef.current.style.transition = "none";
    }
    const width = sidebarRef.current?.getBoundingClientRect().width || 360;
    drag.x = Math.max(-width, Math.min(0, x));
    if (sidebarRef.current) sidebarRef.current.style.transform = `translateX(${drag.x}px)`;
    if (overlayRef.current) overlayRef.current.style.opacity = String(1 - Math.min(Math.abs(drag.x) / width, 1));
  };
  const finishMenuDrag = () => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const width = sidebarRef.current?.getBoundingClientRect().width || 360;
    const shouldClose = drag.dragging && drag.x <= -Math.max(70, width * 0.28);
    dragRef.current.active = false;
    resetMenuDrag();
    if (shouldClose) setMenuOpen(false);
  };
  const openGallery = (project, trigger) => { preloadGalleryImages(project.images); galleryTriggerRef.current = trigger; setGalleryIndex(0); setGalleryProject(project); };
  const closeGallery = () => { setGalleryProject(null); window.requestAnimationFrame(() => galleryTriggerRef.current?.focus({ preventScroll: true })); };

  return <>
    <header className={`topbar${scrolled ? " scrolled" : ""}`} id="topbar">
      <div className="topbar-inner">
        <span onClick={(event) => navigate(event, "inicio")}><Brand link /></span>
        <nav className="topbar-nav" aria-label="Navegação principal">
          {text.topLinks.map((label, index) => <a className="top-link" href={`#${["sobre", "habilidades", "projetos", "contato"][index]}`} key={label} onClick={(event) => navigate(event, ["sobre", "habilidades", "projetos", "contato"][index])}>{label}</a>)}
        </nav>
        <div className="topbar-actions">
          <button className="lang-toggle" type="button" aria-label={text.toggleLabel} onClick={() => setLanguage(language === "pt" ? "en" : "pt")}>{language === "pt" ? "EN" : "PT"}</button>
          <button className="lang-toggle" type="button" aria-label={language === "es" ? "Cambiar idioma a inglés" : "Cambiar idioma a español"} onClick={() => setLanguage(language === "es" ? "en" : "es")}>{language === "es" ? "EN" : "ES"}</button>
          <button ref={menuButtonRef} className="menu-btn" type="button" aria-label={text.openMenu} aria-controls="sidebar" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span className="hamburger" aria-hidden="true"><span /><span /><span /></span></button>
        </div>
      </div>
    </header>

    <div ref={overlayRef} className={`overlay${menuOpen ? " show" : ""}`} aria-hidden={!menuOpen} onClick={() => setMenuOpen(false)} />
    <aside ref={sidebarRef} className={`sidebar${menuOpen ? " open" : ""}`} id="sidebar" aria-label="Menu lateral" aria-hidden={!menuOpen} inert={menuOpen ? undefined : ""} onPointerDown={startMenuDrag} onPointerMove={moveMenuDrag} onPointerUp={finishMenuDrag} onPointerCancel={finishMenuDrag}>
      <div className="sidebar-header"><Brand /><button className="close-btn" type="button" aria-label={text.closeMenu} onClick={() => setMenuOpen(false)}>✕</button></div>
      <div className="sidebar-profile"><img src="/img/perfil.webp" alt="" width="830" height="900" decoding="async" /><div><strong>João Lescovar</strong><span>Web Developer</span></div></div>
      <nav className="sidebar-nav" aria-label="Navegação lateral">
        <span className="sidebar-nav-label">{text.sidebarLabel}</span>
        {sidebarTargets.map((target, index) => <a className="side-link" href={`#${target}`} key={target} onClick={(event) => navigate(event, target)}><span className="side-copy"><strong>{text.sideTitles[index]}</strong><small>{text.sideDetails[index]}</small></span></a>)}
      </nav>
      <div className="sidebar-footer"><span>{text.connect}</span><div>
        <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="devicon-github-original" aria-hidden="true" /></a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i className="devicon-linkedin-plain" aria-hidden="true" /></a>
        <a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
      </div></div>
    </aside>

    <main className="page-shell">
      <section className="hero" id="inicio" aria-label="Apresentação de João Lescovar"><aside className="profile-card" aria-label="Perfil de João Lescovar">
        <div className="portrait-ring"><img src="/img/perfil.webp" alt="Foto de João Lescovar" width="830" height="900" decoding="async" fetchPriority="high" /></div>
        <div className="profile-card-content"><h2>João Lescovar</h2><p className="profile-role">Web Developer</p><SocialIcons /></div>
      </aside></section>

      <section className="skills-card" id="habilidades" aria-labelledby="skillsTitle">
        <div className="section-heading skills-heading"><div><p className="section-kicker">{text.skillsKicker}</p><h2 id="skillsTitle">{text.skillsTitle}</h2></div><p>{text.skillsDescription}</p></div>
        <div className="skills-grid">{skills.map(([icon, label]) => <div className="skill-item" key={label}>{icon === "sql" ? <SqlIcon /> : <i className={icon} aria-hidden="true" />}<span>{label}</span></div>)}</div>
      </section>

      <section className="about-section" id="sobre" aria-labelledby="aboutTitle">
        <div className="section-heading"><div><p className="section-kicker">{text.aboutKicker}</p><h2 id="aboutTitle" dangerouslySetInnerHTML={{ __html: text.aboutTitle }} /></div></div>
        <div className="about-grid"><div className="about-copy">
          {text.aboutParagraphs.map((paragraph) => <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />)}
          <div className="resume-card" aria-label="Currículo em preparação"><div><span>{text.resumeTitle}</span><strong>{text.resumeDescription}</strong></div><span className="resume-status">{text.soon}</span></div>
        </div></div>
      </section>

      <section className="projects-section" id="projetos" aria-labelledby="projectsTitle">
        <div className="real-projects"><div className="section-heading real-projects-heading"><div><p className="section-kicker">{text.realProjectsKicker}</p><h2>{text.realProjectsTitle}</h2></div><p>{text.realProjectsDescription}</p></div>
          <p className="projects-swipe-hint real-projects-swipe-hint" aria-hidden="true">{text.swipe.replace(/<[^>]*>/g, " ")} <span>→</span></p>
          <div className="projects-grid real-projects-grid">{worldProjects.map((project) => <ProjectCard key={project.slug} project={project} text={text} openGallery={openGallery} />)}</div>
        </div>
        <div className="section-heading projects-heading personal-projects-heading"><div><p className="section-kicker">{text.projectsKicker}</p><h2 id="projectsTitle">{text.projectsTitle}</h2></div><p>{text.projectsDescription}</p></div>
        <p className="projects-swipe-hint" aria-hidden="true">{text.swipe.replace(/<[^>]*>/g, " ")} <span>→</span></p>
        <div className="projects-grid" id="projectsGrid">{personalProjects.map((project, index) => <ProjectCard key={project.slug} project={project} text={text} personalIndex={index} openGallery={openGallery} />)}</div>
      </section>

      <section className="connect-section" id="contato" aria-labelledby="contactTitle">
        <div className="connect-copy"><p className="section-kicker">{text.contactKicker}</p><h2 id="contactTitle">{text.contactTitle}</h2><p>{text.contactDescription}</p></div>
        <nav className="connect-links" aria-label="Redes sociais de João Lescovar">
          <a href="mailto:jrlescovar@gmail.com"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4h15A2.5 2.5 0 0 1 22 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 17.5v-11A2.5 2.5 0 0 1 4.5 4Zm0 2a.5.5 0 0 0-.5.5v.3l8 5.1 8-5.1v-.3a.5.5 0 0 0-.5-.5h-15ZM20 9.2l-7.46 4.76a1 1 0 0 1-1.08 0L4 9.2v8.3a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5V9.2Z" /></svg><span><strong>E-mail</strong><small>{text.socialDetails[0]}</small></span><b aria-hidden="true">↗</b></a>
          <a href={github} target="_blank" rel="noopener noreferrer"><i className="devicon-github-original" aria-hidden="true" /><span><strong>GitHub</strong><small>{text.socialDetails[1]}</small></span><b aria-hidden="true">↗</b></a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer"><i className="devicon-linkedin-plain" aria-hidden="true" /><span><strong>LinkedIn</strong><small>{text.socialDetails[2]}</small></span><b aria-hidden="true">↗</b></a>
          <a href={instagram} target="_blank" rel="noopener noreferrer"><InstagramIcon /><span><strong>Instagram</strong><small>{text.socialDetails[3]}</small></span><b aria-hidden="true">↗</b></a>
        </nav>
      </section>
    </main>

    <footer className="footer"><div><Brand /><p>{text.footerCredit}</p></div><p>© <span>{new Date().getFullYear()}</span> {text.rights}</p></footer>
    <div className="faith-mark" aria-label="إيمان"><span lang="ar" dir="rtl">إيمان</span></div>
    <Lightbox project={galleryProject} index={galleryIndex} setIndex={setGalleryIndex} close={closeGallery} text={text} language={language} />
  </>;
}

export default App;
