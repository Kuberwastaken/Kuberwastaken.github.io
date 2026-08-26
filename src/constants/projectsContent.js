import React from 'react';
import projectsBase from '../data/projects.json';

const PREVIEWS = {
  Claurst: '/images/kuberwastaken-claurst-site.jpg',
  Reference: '/images/kuberwastaken-reference.png',
  ClawX: '/images/kuberwastaken-clawx.png',
  Litmus: '/images/kuberwastaken-litmus.png',
  PicoGPT: '/images/kuberwastaken-picogpt.png',
  Silverilla: '/images/kuberwastaken-silverilla.png',
  DOOMme: '/images/kuberwastaken-doomme.gif',
  'GitHub View Counter': '/images/kuberwastaken-counter.png',
  ThisWebsiteIsNotOnline: '/images/kuberwastaken-twino.png',
  ORCUS: '/images/kuberwastaken-orcus.png',
  'Free Deep Research': '/images/kuberwastaken-freedeepresearch.png',
  'Books Re-imagined': '/images/kuberwastaken-booksreimagined.png',
  PolyThink: '/images/kuberwastaken-polythink.png',
  MiniLMs: '/images/kuberwastaken-minilms.png',
  TREAT: '/images/kuberwastaken-treat.png',
  Engram: '/images/kuberwastaken-engram.png',
  LifeMap: '/images/kuberwastaken-lifemap.jpg',
  SecondYou: '/images/kuberwastaken-secondyou.png',
  PrayGo: '/images/kuberwastaken-praygo.png',
  CottagOS: '/images/kuberwastaken-cottagos.png',
  MEOW: '/images/kuberwastaken-meow.png',
  Strongy: '/images/kuberwastaken-strongy.png',
  Sweeta: '/images/kuberwastaken-sweeta.png',
  Spica: '/images/kuberwastaken-spica.png',
  Backdooms: '/backdooms/backdooms-gif.gif'
};

const projects = projectsBase.filter(project => !project.hidden);

const renderDescription = (description) => {
  if (!description) return null;
  const parts = description.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\))/g);

  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (!match) return <React.Fragment key={index}>{part}</React.Fragment>;
    return (
      <a key={index} href={match[2]} target="_blank" rel="noopener noreferrer">
        {match[1]}
      </a>
    );
  });
};

const normalizeExtras = (extra) => {
  if (!extra) return [];
  return (Array.isArray(extra) ? extra : [extra]).map((item, index) => {
    if (typeof item === 'string') return { href: item, label: `note ${index + 1}` };
    return {
      href: item.href || item.url,
      label: item.alt || `note ${index + 1}`
    };
  }).filter(item => item.href);
};

const ProjectCard = ({ project, index, total }) => {
  const preview = PREVIEWS[project.title] || project.previewImg || null;
  const links = [
    project.website && { href: project.website, label: 'web' },
    project.github && { href: project.github, label: 'source' },
    ...normalizeExtras(project.extra)
  ].filter(Boolean);

  return (
    <article className="project-terminal-card">
      <div className="project-titlebar">
        <span className="project-state" aria-label="shipped">●</span>
        <h3 title={project.title}>{project.title}</h3>
        <span className="project-index">{String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
      </div>
      {preview && (
        <div className="project-preview">
          <img src={preview} alt={`${project.title} preview`} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="project-card-body">
        <p className="project-description">{renderDescription(project.description)}</p>
        {links.length > 0 && (
          <div className="project-links" aria-label={`${project.title} links`}>
            {links.map((link, linkIndex) => (
              <a key={`${link.href}-${linkIndex}`} href={link.href} target="_blank" rel="noopener noreferrer">
                ↗ {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

const ProjectsTerminal = () => (
  <section className="projects-terminal">
    <div className="projects-terminal-header">
      <strong>/projects</strong>
      <span>{projects.length} records · iframes disabled · previews lazy-loaded</span>
    </div>
    <div className="projects-grid">
      {projects.map((project, index) => (
        <ProjectCard key={project.title} project={project} index={index} total={projects.length} />
      ))}
    </div>
  </section>
);

export default React.memo(ProjectsTerminal);
