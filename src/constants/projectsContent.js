import React, { useState } from 'react';

const projects = [
  {
    title: 'PolyThink',
    description: `PolyThink is a multi-agent AI system where multiple models collaborate and fact-check each other to eliminate hallucinations and provide reliable answers.`,
    website: 'https://www.polyth.ink/',
    github: null,
    extra: [],
  },
  {
    title: 'AsianMOM',
    description: 'A WebML-based Vision-Language App that roasts you like an Asian Mom. Runs entirely in your browser using WebGPU and ONNX.',
    website: 'https://asianmom.kuber.studio/',
    github: 'https://github.com/Kuberwastaken/AsianMOM',
    previewImg: 'https://github.com/Kuberwastaken/AsianMOM/raw/main/Media/Assets/Readme-Image.jpg',
    extra: [],
  },  {
    title: 'TREAT',
    description: 'TREAT is an AI-powered platform for trigger recognition in movies and TV, making content more accessible and enjoyable.',
    website: 'https://www.trytreat.tech/',
    github: 'https://github.com/Kuberwastaken/TREAT',
    extra: [],
  },
  {
    title: 'Engram',
    description: `The centralized, No BS, Biggest Open-Source Notes and Resources Aggregator for IP University Engineering`,
    website: 'https://engram.kuber.studio/',
    github: 'https://github.com/kuberwastaken/engram',
    showIframe: true,
    extra: [],
  },
  {
    title: 'MiniLMs',
    description: `My ongoing study learning about AI Models architecturally and making fun little chatbots from it. Currently finished development of SYNEVA - a <3kb Markov Chain type Chatbot inspired by ELIZA that is actually fun to talk to and passively working on 15ABELLA, a 15Kb tiny Neural Network chatbot.`,
    website: 'https://minilms.kuber.studio/',
    github: 'https://github.com/Kuberwastaken/MiniLMs',
    extra: [],
  },  {
    title: 'ORCUS',
    description: `A dual-model AI tool to detect and flag AI-generated social media comments, especially on LinkedIn. It uses Hugging Face's OpenAI detector and GPT-2 to analyze suspicious content and generate personalized alerts.`,
    website: null,
    github: 'https://github.com/Kuberwastaken/ORCUS',
    showIframe: true,
    extra: [],
  },
  {
    title: 'MindDump',
    description: `My Blog website that I made that syncs from my Obsidian Vault! It's extremely customizable and a corner of the internet where I can truly share my thoughts freely.`,
    website: 'https://kuber.studio/blog/',
    github: 'https://github.com/Kuberwastaken/blog',
    extra: [],
  },
  {
    title: 'Books Re-imagined',
    description: `An AI tool that transforms the narrative perspective of popular literature. In this case, it retells Diary of a Wimpy Kid: Rodrick Rules from Rodrick's point of view using Google Gemini 1.5.`,
    website: 'https://www.kaggle.com/code/kubermehta/books-reimagined-diary-of-a-wimpy-kid-by-rodrick',
    github: null,
    showIframe: true,
    extra: [],
  },  {
    title: 'Free Deep Research',
    description: `My free, open-source version of OpenAI's Deep Research agent. It mimics the capabilities of the original agent, allowing users to run custom deep dives with adjustable breadth, depth, and duration.`,
    website: null,
    github: 'https://github.com/Kuberwastaken/free-deep-research',
    showIframe: false,
    extra: [],
  },
  {
    title: 'Backdooms',
    description: `A Game inspired by DOOM and the Backrooms inside a single QR code, less than 2.6kB in size.`,
    website: 'https://kuber.studio/backdooms/',
    github: 'https://github.com/Kuberwastaken/backdooms',
    extra: [],
  },
  {
    title: 'LifeMap',
    description: `LifeMap is a web application for creating and visualizing personal networks. Add nodes representing aspects of your life - education, work, hobbies, dreams, and family and connect them to see relationships and dependencies to answer the true questions in life.`,
    website: 'https://lifemap.kuber.studio',
    github: 'https://github.com/Kuberwastaken/LifeMap',
    showIframe: true,
    extra: [],
  },
  {
    title: 'CottagOS',
    description: `Won first place at Hack Club SiteJam!\nCottagOS is a lovingly crafted, interactive desktop experience inspired by the aesthetics of cottagecore and the magic of enchanted forests. It simulates a cozy OS environment, complete with draggable windows, animated desktop, and a suite of charming mini-apps—all wrapped in a warm, nature-inspired UI.`,
    website: 'https://cottagos.kuber.studio/',
    github: 'https://github.com/Kuberwastaken/CottagOS',
    showIframe: true,
    extra: [],
  },
];

const badgeLinks = (project) => {
  const badges = [];
  if (project.website) {
    badges.push({
      href: project.website,
      alt: 'Website',
      src: 'https://cdn.simpleicons.org/googlechrome/ffebcd',
      imgStyle: { width: 18, background: '#5abb9a', borderRadius: 6, padding: 2 }
    });
  }
  if (project.github) {
    badges.push({
      href: project.github,
      alt: 'GitHub',
      src: 'https://cdn.simpleicons.org/github/ffebcd',
      imgStyle: { width: 18, background: '#24292e', borderRadius: 6, padding: 2 }
    });
  }
  if (project.extra && Array.isArray(project.extra)) {
    project.extra.forEach((link) => badges.push(link));
  }
  return badges.map((badge, i) => (
    <a
      key={badge.href + i}
      href={badge.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ marginRight: 10, marginBottom: 6, display: 'inline-block' }}
    >
      <img src={badge.src} alt={badge.alt} style={{ height: 32, borderRadius: 6, boxShadow: '0 1px 4px #0002' }} />
    </a>
  ));
};

const MobileProjectsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = projects.length;
  const goLeft = () => setCurrent((prev) => (prev === 0 ? total - 1 : prev - 1));
  const goRight = () => setCurrent((prev) => (prev === total - 1 ? 0 : prev + 1));
  const project = projects[current];  // Faux webpage image logic for mobile
  const jsdelivrBase =
    'https://cdn.jsdelivr.net/gh/Kuberwastaken/Kuberwastaken.github.io/public/';const fauxWebImage =
    project.title === 'ORCUS' ? jsdelivrBase + 'kuberwastaken-orcus.png' :
    project.title === 'Free Deep Research' ? jsdelivrBase + 'kuberwastaken-freedeepresearch.png' :
    project.title === 'Books Re-imagined' ? jsdelivrBase + 'kuberwastaken-booksreimagined.png' :
    project.title === 'PolyThink' ? jsdelivrBase + 'kuberwastaken-polythink.png' :
    project.title === 'MiniLMs' ? jsdelivrBase + 'kuberwastaken-minilms.png' :
    project.title === 'TREAT' ? jsdelivrBase + 'kuberwastaken-treat.png' :
    project.title === 'Engram' ? jsdelivrBase + 'kuberwastaken-engram.png' :
    project.title === 'LifeMap' ? jsdelivrBase + 'kuberwastaken-lifemap.jpg' :
    project.title === 'CottagOS' ? jsdelivrBase + 'kuberwastaken-cottagOS.png' :
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
          fontFamily: 'JetBrains Mono, monospace',
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
          ) : (project.previewImg || (project.title === 'Backdooms' && 'https://cdn.jsdelivr.net/gh/kuberwastaken/backdooms/public/Gameplay-GIF.gif')) ? (
            <img
              src={project.previewImg || 'https://cdn.jsdelivr.net/gh/kuberwastaken/backdooms/public/Gameplay-GIF.gif'}
              alt={project.title + ' preview'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 12 }}
            />
          ) : null}
        </div>
        {/* Title */}
        <div style={{ fontWeight: 700, fontSize: '1.18em', color: '#5abb9a', marginBottom: 10, textAlign: 'center' }}>{project.title}</div>
        {/* Description */}
        <div style={{ fontSize: '1em', marginBottom: 16, textAlign: 'center', lineHeight: 1.5 }}>{project.description}</div>
        {/* Badges */}
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          {badgeLinks(project)}
        </div>
        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 10 }}>
          <button onClick={goLeft} style={{ background: '#111', color: '#5abb9a', border: '1.5px solid #333', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 22, width: 44, height: 44, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>&lt;</button>
          <button onClick={goRight} style={{ background: '#111', color: '#5abb9a', border: '1.5px solid #333', borderRadius: 6, fontFamily: 'JetBrains Mono, monospace', fontSize: 22, width: 44, height: 44, cursor: 'pointer', boxShadow: '0 1px 4px #0002' }}>&gt;</button>
        </div>
        {/* Card index indicator */}
        <div style={{ marginTop: 8, fontSize: '0.92em', color: '#5abb9a', textAlign: 'center' }}>{current + 1} / {total}</div>
      </div>
      <style>{`
        @media (max-width: 700px) {
          .mobile-projects-carousel { display: block; }
          .project-masonry-card, div[style*='columnCount'] { display: none !important; }
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
      style={{
        columnCount: 3,
        columnGap: '32px',
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
            background: 'linear-gradient(135deg, rgba(30,30,30,0.95) 60%, rgba(90,187,154,0.10) 100%)',
            borderRadius: 18,
            marginBottom: 32,
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
            padding: '24px 20px',
            color: '#ffebcd',
            fontFamily: 'JetBrains Mono, monospace',
            position: 'relative',
            border: '1.5px solid rgba(90,187,154,0.13)',
            transition: 'transform 0.18s, box-shadow 0.18s',
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
                  src={project.previewImg}
                  alt={project.title + ' preview'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
      </div>
            ) : (['ORCUS', 'Free Deep Research', 'Books Re-imagined'].includes(project.title)) ? (
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
                <div style={{height: '100%', width: '100%', overflowY: 'auto', overflowX: 'hidden', background: '#fff'}}>
                  <img                    src={
                      project.title === 'ORCUS' ? '/kuberwastaken-orcus.png' :
                      project.title === 'Free Deep Research' ? '/kuberwastaken-freedeepresearch.png' :
                      project.title === 'Engram' ? '/kuberwastaken-engram.png' :
                      '/kuberwastaken-booksreimagined.png'
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
            <div style={{ fontSize: '1em', marginBottom: 16, whiteSpace: 'pre-line' }}>{project.description}</div>
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
          div[style*='columnCount'] {
            column-count: 2 !important;
          }
        }
        @media (max-width: 900px) {
          .project-iframe-container, .project-iframe {
            display: none !important;
          }
          div[style*='columnCount'] {
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
          div[style*='columnCount'] {
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