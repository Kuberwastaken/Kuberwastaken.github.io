import React, { useState } from 'react';
import projectsBase from '../data/projects.json';

// Convert simple markdown links and newlines in descriptions to safe HTML
const formatDescriptionToHtml = (raw) => {
  if (!raw || typeof raw !== 'string') return '';
  // Escape HTML
  const escaped = raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
  // Convert [text](url)
  const withLinks = escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, text, url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #5abb9a; text-decoration: underline;">${text}</a>`;
  });
  // Convert newlines to <br/>
  return withLinks.replace(/\n/g, '<br/>');
};



// Enforce explicit horizontal-first order on desktop and same order on mobile
const JSDELIVR_BASE = 'https://cdn.jsdelivr.net/gh/Kuberwastaken/Kuberwastaken.github.io/public/images/';
const projectOrder = [
  'ClawX',
  'MiniLMs',
  'GitHub View Counter',
  'Silverilla',
  'DOOMme',
  'Sweeta',
  'NoGreeting',
  'Fuzzy Redirect',
  'Berghain Challenge Algorithms',
  "ThisWebsiteIsNotOnline",
  'SecondYou',
  'MEOW',
  'CottagOS',
  "What's in a LinkedIn Name?",
  'PolyThink',
  'MindDump',
  'PrayGo',
  'LifeMap',
  'Backdooms',
  'Engram',
  'AsianMOM',
  'ORCUS',
  'Scorpius',
  'TREAT',
  'Free Deep Research',
  'Books Re-imagined',
];

const projects = projectOrder
  .map(title => projectsBase.find(p => p.title === title))
  .filter(Boolean);

const badgeLinks = (project) => {
  const badges = [];

  // Built-in badges first (keep behavior/appearance unchanged)
  if (project.website) {
    badges.push({
      href: project.website,
      alt: 'Website',
      src: 'https://cdn.simpleicons.org/googlechrome/ffebcd',
    });
  }
  if (project.github) {
    badges.push({
      href: project.github,
      alt: 'GitHub',
      src: 'https://cdn.simpleicons.org/github/ffebcd',
    });
  }

  // Normalize `extra` into an array of link objects using a default globe icon
  const normalizeExtra = (extra) => {
    if (!extra) return [];
    const arr = Array.isArray(extra) ? extra : [extra];
    return arr
      .map((item) => {
        if (!item) return null;
        if (typeof item === 'string') {
          return { href: item, alt: 'Post', src: '/globe.svg' };
        }
        if (typeof item === 'object') {
          const href = item.href || item.url;
          if (!href) return null;
          return {
            href,
            alt: item.alt || 'Post',
            src: item.src || '/globe.svg',
          };
        }
        return null;
      })
      .filter(Boolean);
  };

  // Append extras at the end so they are always last
  badges.push(...normalizeExtra(project.extra));

  return badges.map((badge, i) => (
    <a
      key={badge.href + i}
      href={badge.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginRight: 10, marginBottom: 6, display: 'inline-block' }}
    >
      <img
        src={badge.src}
        alt={badge.alt}
        style={{ height: 32, borderRadius: 6, boxShadow: '0 1px 4px #0002' }}
      />
    </a>
  ));
};

const MobileProjectsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = projects.length;
  const goLeft = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const goRight = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  const project = projects[current];  // Faux webpage image logic for mobile
  const fauxWebImage =
    project.title === 'ClawX' ? JSDELIVR_BASE + 'kuberwastaken-clawx.png' :
      project.title === 'Silverilla' ? JSDELIVR_BASE + 'kuberwastaken-silverilla.png' :
        project.title === 'DOOMme' ? JSDELIVR_BASE + 'kuberwastaken-doomme.gif' :
          project.title === 'GitHub View Counter' ? JSDELIVR_BASE + 'kuberwastaken-counter.png' :
            project.title === 'ThisWebsiteIsNotOnline' ? JSDELIVR_BASE + 'kuberwastaken-twino.png' :
              project.title === 'ORCUS' ? JSDELIVR_BASE + 'kuberwastaken-orcus.png' :
                project.title === 'Free Deep Research' ? JSDELIVR_BASE + 'kuberwastaken-freedeepresearch.png' :
                  project.title === 'Books Re-imagined' ? JSDELIVR_BASE + 'kuberwastaken-booksreimagined.png' :
                    project.title === 'PolyThink' ? JSDELIVR_BASE + 'kuberwastaken-polythink.png' :
                      project.title === 'MiniLMs' ? JSDELIVR_BASE + 'kuberwastaken-minilms.png' :
                        project.title === 'TREAT' ? JSDELIVR_BASE + 'kuberwastaken-treat.png' :
                          project.title === 'Engram' ? JSDELIVR_BASE + 'kuberwastaken-engram.png' :
                            project.title === 'LifeMap' ? JSDELIVR_BASE + 'kuberwastaken-lifemap.jpg' :
                              project.title === 'SecondYou' ? JSDELIVR_BASE + 'kuberwastaken-secondyou.png' :
                                project.title === 'PrayGo' ? JSDELIVR_BASE + 'kuberwastaken-praygo.png' :
                                  project.title === 'CottagOS' ? JSDELIVR_BASE + 'kuberwastaken-cottagos.png' :
                                    project.title === 'MEOW' ? JSDELIVR_BASE + 'kuberwastaken-meow.png' :
                                      null;
  return (
    <div className="mobile-projects-carousel" style={{ maxWidth: 420, margin: '0 auto', padding: '16px 0' }}>
      <div
        className="mobile-project-card"
        style={{
          background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 60%, rgba(90,187,154,0.10) 100%)',
          borderRadius: 18,
          marginBottom: 24,
          boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
          padding: '24px 12px',
          color: '#ffebcd',
          fontFamily: "'JetBrains Mono', monospace",
          border: '1.5px solid rgba(90,187,154,0.13)',
          position: 'relative',
          minHeight: 420,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Faux webpage, preview, or gif */}
        <div style={{ width: '100%', marginBottom: 16, borderRadius: 12, overflow: 'hidden', background: '#181818', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {fauxWebImage ? (
            <div style={{ width: '100%', height: '100%', overflowY: 'auto', background: '#fff', borderRadius: 6 }}>
              <img
                src={fauxWebImage}
                alt={project.title + ' faux webpage'}
                style={{ width: '100%', minHeight: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          ) : project.title === 'Sweeta' ? (
            <div style={{ width: '100%', height: '100%', overflowY: 'auto', overflowX: 'hidden', background: '#fff', borderRadius: 12 }}>
              <img
                src={JSDELIVR_BASE + 'kuberwastaken-sweeta.png'}
                alt="Sweeta watermark removal tool preview"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          ) : (project.previewImg || (project.title === 'Backdooms' && 'https://cdn.jsdelivr.net/gh/kuberwastaken/backdooms/public/Gameplay-GIF.gif')) ? (
            <img
              src={project.previewImg || (project.title === 'Backdooms' ? 'https://cdn.jsdelivr.net/gh/kuberwastaken/backdooms/public/Gameplay-GIF.gif' : '')}
              alt={project.title + ' preview'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 12 }}
            />
          ) : null}
        </div>
        {/* Title */}
        <div style={{ fontWeight: 700, fontSize: '1.18em', color: '#5abb9a', marginBottom: 10, textAlign: 'center' }}>{project.title}</div>
        {/* Description */}
        <div
          style={{ fontSize: '1em', marginBottom: 16, textAlign: 'center', lineHeight: 1.5 }}
          dangerouslySetInnerHTML={{ __html: formatDescriptionToHtml(project.description) }}
        />
        {/* Badges */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          {badgeLinks(project)}
        </div>
        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 10 }}>
          <button onClick={goLeft} style={{ background: '#111', color: '#5abb9a', border: '1.5px solid #333', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 22, width: 44, height: 44, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>&lt;</button>
          <button onClick={goRight} style={{ background: '#111', color: '#5abb9a', border: '1.5px solid #333', borderRadius: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 22, width: 44, height: 44, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>&gt;</button>
        </div>
        {/* Card index indicator */}
        <div style={{ marginTop: 8, fontSize: '0.92em', color: '#5abb9a', textAlign: 'center' }}>{current + 1} / {total}</div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .mobile-projects-carousel { display: block; }
          .project-masonry-card, .projects-grid { display: none !important; }
        }
        @media (min-width: 701px) {
          .mobile-projects-carousel { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const ProjectsMasonry = () => (
  <>
    <div
      className="projects-grid"
      style={{
        // Masonry-style multi-column layout to avoid fixed gaps below shorter cards
        columnCount: 3,
        columnGap: '32px',
        alignItems: 'start',
        maxWidth: 1300,
        margin: '0 auto',
        padding: '40px 0',
      }}
    >
      {projects.map((project, idx) => (
        <div
          key={project.title}
          className="project-masonry-card"
          style={{
            breakInside: 'avoid',
            display: 'inline-block',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 60%, rgba(90,187,154,0.10) 100%)',
            borderRadius: 18,
            marginBottom: 32,
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
            padding: '24px 20px',
            color: '#ffebcd',
            fontFamily: "'JetBrains Mono', monospace",
            position: 'relative',
            border: '1.5px solid rgba(90,187,154,0.13)',
            transition: 'transform 0.18s, box-shadow 0.18s',
            alignSelf: 'start',
          }}
          onMouseOver={e => {
            e.currentTarget.style.transform = 'scale(1.025)';
            e.currentTarget.style.boxShadow = '0 12px 36px 0 rgba(90,187,154,0.18)';
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(31,38,135,0.18)';
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            {project.title === 'Backdooms' ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(90,187,154,0.18)',
                  boxShadow: '0 2px 16px 0 rgba(90,187,154,0.10)',
                  background: '#181818',
                  height: 225,
                  maxWidth: '100%',
                  display: 'block',
                  overflow: 'hidden',
                }}
                className="project-iframe-container"
              >
                <img
                  src="https://cdn.jsdelivr.net/gh/kuberwastaken/backdooms/public/Gameplay-GIF.gif"
                  alt="Backdooms gameplay preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            ) : project.title === 'Sweeta' ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(90,187,154,0.18)',
                  boxShadow: '0 2px 16px 0 rgba(90,187,154,0.10)',
                  background: '#181818',
                  height: 225,
                  maxWidth: '100%',
                  display: 'block',
                  position: 'relative',
                }}
                className="project-fauxwebpage-container"
              >
                <div style={{ height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden', background: '#fff' }}>
                  <img
                    src={JSDELIVR_BASE + 'kuberwastaken-sweeta.png'}
                    alt="Sweeta watermark removal tool preview"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            ) : project.previewImg ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(90,187,154,0.18)',
                  boxShadow: '0 2px 16px 0 rgba(90,187,154,0.10)',
                  background: '#181818',
                  height: 225,
                  maxWidth: '100%',
                  display: 'block',
                  overflow: 'hidden',
                }}
                className="project-iframe-container"
              >
                <img
                  src={project.previewImg.startsWith('/images/') ? JSDELIVR_BASE + project.previewImg.replace('/images/', '') : project.previewImg}
                  alt={project.title + ' preview'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
            ) : (['Silverilla', 'DOOMme', 'GitHub View Counter', 'ThisWebsiteIsNotOnline', 'ORCUS', 'Free Deep Research', 'Books Re-imagined', 'MEOW', 'CottagOS', 'SecondYou', 'PrayGo'].includes(project.title)) ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(90,187,154,0.18)',
                  boxShadow: '0 2px 16px 0 rgba(90,187,154,0.10)',
                  background: '#181818',
                  height: 225,
                  maxWidth: '100%',
                  display: 'block',
                  overflow: 'hidden',
                  position: 'relative',
                }}
                className="project-fauxwebpage-container"
              >
                <div style={{ height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden', background: '#fff' }}>                  <img src={
                  project.title === 'Silverilla' ? JSDELIVR_BASE + 'kuberwastaken-silverilla.png' :
                    project.title === 'DOOMme' ? JSDELIVR_BASE + 'kuberwastaken-doomme.gif' :
                      project.title === 'DOOMme' ? JSDELIVR_BASE + 'kuberwastaken-doomme.gif' :
                        project.title === 'GitHub View Counter' ? JSDELIVR_BASE + 'kuberwastaken-counter.png' :
                          project.title === 'ThisWebsiteIsNotOnline' ? JSDELIVR_BASE + 'kuberwastaken-twino.png' :
                            project.title === 'ORCUS' ? JSDELIVR_BASE + 'kuberwastaken-orcus.png' :
                              project.title === 'Free Deep Research' ? JSDELIVR_BASE + 'kuberwastaken-freedeepresearch.png' :
                                project.title === 'Engram' ? JSDELIVR_BASE + 'kuberwastaken-engram.png' :
                                  project.title === 'CottagOS' ? JSDELIVR_BASE + 'kuberwastaken-cottagos.png' :
                                    project.title === 'MEOW' ? JSDELIVR_BASE + 'kuberwastaken-meow.png' :
                                      project.title === 'SecondYou' ? JSDELIVR_BASE + 'kuberwastaken-secondyou.png' :
                                        project.title === 'PrayGo' ? JSDELIVR_BASE + 'kuberwastaken-praygo.png' :
                                          JSDELIVR_BASE + 'kuberwastaken-booksreimagined.png'
                }
                  alt={project.title + ' faux webpage'}
                  style={{ width: '100%', minHeight: '100%', objectFit: 'cover', display: 'block' }}
                />
                </div>
              </div>
            ) : project.website && project.showIframe !== false ? (
              <div
                style={{
                  marginBottom: 16,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1.5px solid rgba(90,187,154,0.18)',
                  boxShadow: '0 2px 16px 0 rgba(90,187,154,0.10)',
                  background: '#181818',
                  height: 225,
                  maxWidth: '100%',
                  display: 'block',
                  overflow: 'hidden',
                }}
                className="project-iframe-container"
              >                <iframe
                src={project.website}
                title={project.title + ' preview'}
                style={{
                  width: '200%',
                  height: 450,
                  border: 'none',
                  borderRadius: 0,
                  background: '#181818',
                  display: 'block',
                  transform: 'scale(0.5)',
                  transformOrigin: '0 0',
                }}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                allowFullScreen={false}
                allow={project.title === 'CottagOS' ? "autoplay 'none'; microphone 'none'; camera 'none'; speaker 'none'" : undefined}
                className="project-iframe"
              >
                  Your browser does not support iframes or this site does not allow embedding.
                </iframe>
              </div>
            ) : null}
            <div style={{ fontWeight: 700, fontSize: '1.25em', marginBottom: 8, color: '#5abb9a' }}>{project.title}</div>
            <div
              style={{ fontSize: '1em', marginBottom: 16 }}
              dangerouslySetInnerHTML={{ __html: formatDescriptionToHtml(project.description) }}
            />
            <div className="project-badges" style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
              {badgeLinks(project)}
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .project-masonry-card {
          position: relative;
          overflow: hidden;
          z-index: 1;
        }
        .project-masonry-card::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 0;
          background: linear-gradient(120deg, rgba(90,187,154,0.08) 0%, rgba(90,187,154,0.18) 100%);
          opacity: 0;
          transition: opacity 0.4s, filter 0.4s;
          filter: blur(0px);
          pointer-events: none;
        }
        .project-masonry-card:hover::before {
          opacity: 1;
          filter: blur(6px) brightness(1.2) saturate(1.3);
          animation: projectCardBgAnim 1.2s linear infinite alternate;
        }
        .project-masonry-card:hover {
          box-shadow: 0 0 32px 0 #5abb9a55, 0 12px 36px 0 rgba(90,187,154,0.18);
          border-color: #5abb9a;
        }
        @keyframes projectCardBgAnim {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        @media (max-width: 1300px) {
          .projects-grid {
            column-count: 2 !important;
          }
        }
        @media (max-width: 900px) {
          .project-iframe-container, .project-iframe {
            display: none !important;
          }
          .projects-grid {
            column-count: 1 !important;
          }
        }
        @media (max-width: 700px) {
          .project-masonry-card {
            padding: 14px 4vw !important;
            margin-bottom: 18px !important;
            font-size: 0.98em !important;
            border-radius: 12px !important;
          }
          .project-masonry-card img {
            height: 120px !important;
            min-height: 80px !important;
            object-fit: cover !important;
          }
          .project-masonry-card .project-iframe-container {
            display: none !important;
          }
          .projects-grid {
            column-count: 1 !important;
            padding: 0 1vw !important;
          }
          .project-badges {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 6px !important;
          }
          .project-masonry-card .project-badges img {
            height: 26px !important;
            width: 26px !important;
          }
          .project-masonry-card div[style*='fontWeight: 700'] {
            font-size: 1.08em !important;
          }
          .project-masonry-card div[style*='fontSize: 1em'] {
            font-size: 0.97em !important;
          }
        }
      `}</style>
    </div>
    <MobileProjectsCarousel />
  </>
);

export default ProjectsMasonry;