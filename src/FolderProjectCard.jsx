import React, { useState } from "react";
import "./folderProjects.css";

export default function FolderProjectCard({ project, text, index, openGallery }) {
  const [expanded, setExpanded] = useState(false);
  const number = project.numberKey ? text[project.numberKey] : project.number;
  const status = project.statusKey ? text[project.statusKey] : project.status;
  const galleryLabel = text.galleryAction.replace(/↗/g, "").trim();
  const toggleLabel = `${text.folderToggle} — ${project.title}`;

  return <article className={`folder-project folder-${project.slug}${expanded ? " is-expanded" : ""}`}>
    <div className="folder-back" aria-hidden="true" />
    <div className="folder-artwork" aria-hidden="true">
      <img src={project.cover} alt="" width={project.width} height={project.height} loading="lazy" decoding="async" />
    </div>
    <div className="folder-face" aria-hidden="true" />
    <button className="folder-toggle" type="button" aria-label={toggleLabel} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>
      <span className="folder-index">{String(index + 1).padStart(2, "0")}</span>
      <span className="folder-toggle-icon" aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>
    <div className="folder-heading">
      <p className="folder-year">{number}</p>
      <h3>{project.title}</h3>
    </div>
    <div className="folder-details">
      <p className="folder-description">{text.projectDescriptions[index]}</p>
      <p className="folder-tags"><span>{status}</span><span>{project.tag}</span></p>
      <div className="folder-actions">
        <button type="button" onClick={(event) => openGallery(project, event.currentTarget)} aria-label={`${galleryLabel} — ${project.title}`}>{galleryLabel} <span aria-hidden="true">↗</span></button>
        {project.href && <a href={project.href} target="_blank" rel="noopener noreferrer">{text.projectLinks[index].replace(/↗/g, "").trim()} <span aria-hidden="true">↗</span></a>}
      </div>
    </div>
  </article>;
}
