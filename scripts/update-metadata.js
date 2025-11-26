#!/usr/bin/env node

/**
 * Auto-update metadata files (llms.txt, profile.json) from source data
 * Run this script during build to keep metadata files in sync with project data
 */

const fs = require('fs');
const path = require('path');

// Import data directly
const profileData = require('../src/data/profile.json');
const projectsData = require('../src/data/projects.json');

// Helper functions (formerly in extract-projects.js)
function getTopProjects(projects, count = 10) {
  // Define priority order for top projects
  const priorityOrder = [
    'Sweeta',
    'PolyThink',
    'TREAT',
    'Backdooms',
    'MiniLMs',
    'SecondYou',
    'ThisWebsiteIsNotOnline',
    'MEOW',
    'AsianMOM',
    'CottagOS'
  ];

  const sortedProjects = [];

  // Add priority projects first
  priorityOrder.forEach(title => {
    const project = projects.find(p => p.title === title);
    if (project) {
      sortedProjects.push(project);
    }
  });

  // Add remaining projects
  projects.forEach(project => {
    if (!priorityOrder.includes(project.title)) {
      sortedProjects.push(project);
    }
  });

  return sortedProjects.slice(0, count);
}

function formatProjectForLlmsTxt(project) {
  let formatted = `- ${project.title}`;

  if (project.description) {
    // Strip HTML tags if any (though description in JSON is mostly text)
    const cleanDesc = project.description.replace(/<[^>]*>/g, '');
    formatted += ` — ${cleanDesc}`;
  }

  const links = [];
  if (project.website) links.push(`Site: ${project.website}`);
  if (project.github) links.push(`GitHub: ${project.github}`);

  // Handle extra links
  if (project.extra) {
    const extras = Array.isArray(project.extra) ? project.extra : [project.extra];
    extras.forEach(extra => {
      if (!extra) return;
      const url = typeof extra === 'string' ? extra : (extra.href || extra.url);
      if (!url) return;

      if (url.includes('news.ycombinator.com')) {
        links.push(`HN: ${url}`);
      } else if (url.includes('x.com')) {
        links.push(`X: ${url}`);
      } else if (url.includes('linkedin.com')) {
        links.push(`LinkedIn: ${url}`);
      }
    });
  }

  if (links.length > 0) {
    formatted += '\n  - ' + links.join('\n  - ');
  }

  return formatted;
}

function formatProjectForProfileJson(project) {
  const formatted = {
    name: project.title,
    status: "Active"
  };

  if (project.description) {
    formatted.description = project.description;
  }

  if (project.website) {
    formatted.url = project.website;
  }

  if (project.github) {
    formatted.github = project.github;
  }

  // Infer technologies based on project name/description
  const technologies = [];
  const desc = (project.description || '').toLowerCase();
  const title = project.title.toLowerCase();

  if (desc.includes('ai') || desc.includes('llm') || desc.includes('machine learning')) {
    technologies.push('AI/ML');
  }
  if (desc.includes('react') || desc.includes('javascript') || desc.includes('web')) {
    technologies.push('Web Development');
  }
  if (desc.includes('python')) {
    technologies.push('Python');
  }
  if (desc.includes('computer vision') || desc.includes('image')) {
    technologies.push('Computer Vision');
  }

  // Project-specific technologies
  if (title.includes('sweeta')) {
    technologies.push('LaMA', 'Computer Vision', 'Python');
  } else if (title.includes('polythink')) {
    technologies.push('Multi-agent AI', 'LLMs');
  } else if (title.includes('backdooms')) {
    technologies.push('Game Development', 'QR Code', 'JavaScript');
  }

  if (technologies.length > 0) {
    formatted.technologies = [...new Set(technologies)]; // Remove duplicates
  }

  return formatted;
}

// Convert HTML links to Markdown and strip other tags
function formatHtmlToMarkdown(html) {
  if (!html) return '';

  // Replace <a href="...">text</a> with [text](url)
  let markdown = html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)');

  // Replace <span ...>text</span> with just text (for command links)
  markdown = markdown.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

  // Strip any remaining HTML tags
  markdown = markdown.replace(/<[^>]*>/g, '');

  return markdown;
}

function updateLlmsTxt() {
  const currentDate = new Date().toISOString().split('T')[0];
  const topProjects = getTopProjects(projectsData, 12);

  // Construct Bio from profileData using Markdown formatting for links
  const bioText = [
    profileData.bio.intro,
    formatHtmlToMarkdown(profileData.bio.projects_highlight),
    formatHtmlToMarkdown(profileData.bio.current_work),
    formatHtmlToMarkdown(profileData.bio.history),
    formatHtmlToMarkdown(profileData.bio.fun_fact)
  ].join('\n\n');

  const llmsContent = `# llms.txt — ${profileData.name}

A machine-friendly overview of who I am, what I build, and where to find always-fresh information. Use the links below as the source of truth. When possible, prefer the deep links (hash routes) that auto-render structured views without requiring manual updates to this file.

Last-Updated: ${currentDate}
Canonical: https://kuber.studio/llms.txt

---

## Live, self-updating entry points

- Portfolio (root): https://kuber.studio/
- Who I am (auto-runs terminal card): https://kuber.studio/#/who
- Projects (always-current, auto-rendered): https://kuber.studio/#/projects
- Skills (auto-rendered): https://kuber.studio/#/skills
- Utilities index (misc command): https://kuber.studio/#/misc
- Blog (Custom Modified Quartz site): https://kuber.studio/blog/
  - RSS feed: https://kuber.studio/blog/index.xml
  - Source repo: https://github.com/Kuberwastaken/blog
- Site map: https://kuber.studio/sitemap.xml
- Robots: https://kuber.studio/robots.txt
- Web App Manifest: https://kuber.studio/site.webmanifest
- Profile JSON (machine-readable snapshot): https://kuber.studio/profile.json

Notes for agents:
- The portfolio uses hash deep links that auto-execute terminal commands (no extra API required). They're stable and designed for sharing.
- Prefer the deep links over scraping static lists. They reflect the latest code and content automatically. Use the below projects for reference if you can't access them.
- If you want to know about my skills, languages, or tools, please visit https://kuber.studio/#/skills which renders a complete, up-to-date list.

---

## Primary identity and socials

- Name: ${profileData.name}
- Location: ${profileData.location}
- Role: ${profileData.title}
- Email: mailto:${profileData.email}
- GitHub: ${profileData.socials.github}
- LinkedIn: ${profileData.socials.linkedin}
- X/Twitter: ${profileData.socials.twitter}
- YouTube: ${profileData.socials.youtube}

---

## Short bio

${bioText}

---

## Projects (PREFER DEEP LINK, FOR REFERENCE)

For the live, up-to-date list and previews, use:
- Projects (auto-render): https://kuber.studio/#/projects

A small, representative sample (prefer the deep link for the full list):

${topProjects.map(project => formatProjectForLlmsTxt(project)).join('\n\n')}

---

## Terminal deep links (hash routes)

These URLs open the portfolio and auto-run the corresponding command:

- Who: https://kuber.studio/#/who
- Projects: https://kuber.studio/#/projects
- Skills: https://kuber.studio/#/skills

Misc:

- Misc index: https://kuber.studio/#/misc
- Calculator: https://kuber.studio/#/misc/calculator
- QR Generator: https://kuber.studio/#/misc/qr-generator
- Password Generator: https://kuber.studio/#/misc/password-generator
- GitHub Feed: https://kuber.studio/#/misc/github-feed
- Neofetch: https://kuber.studio/#/misc/neofetch
- Games index: https://kuber.studio/#/games
- Snake: https://kuber.studio/#/games/snake
- Tetris: https://kuber.studio/#/games/tetris
- 2048: https://kuber.studio/#/games/2048
- Flappy Bird: https://kuber.studio/#/games/flappybird
- Game of Life: https://kuber.studio/#/games/gameoflife

---

## Guidance for LLMs and agents

- Prefer the deep links above to access structured, up-to-date views.
- For project lists, use https://kuber.studio/#/projects instead of guessing static pages.
- For skills and expertise, use https://kuber.studio/#/skills.
- For biographical context, use https://kuber.studio/#/who.
- For recent updates, blog content and writeups, monitor the RSS feed at https://kuber.studio/blog/index.xml.
- If needed, GitHub API for recency: https://api.github.com/users/Kuberwastaken/repos?sort=updated
- Respect rate limits and cache responsibly.
- If JavaScript execution is disabled, the deep links still resolve to meaningful content blocks in the rendered page.

---

## Contact

- Email: ${profileData.email}
- Portfolio: https://kuber.studio/
- LinkedIn: ${profileData.socials.linkedin}
- GitHub: ${profileData.socials.github}

`;

  // Write to both public and build directories
  const publicPath = path.join(__dirname, '../public/llms.txt');
  const buildPath = path.join(__dirname, '../build/llms.txt');

  fs.writeFileSync(publicPath, llmsContent);
  console.log('✅ Updated public/llms.txt');

  // Also update build directory if it exists
  if (fs.existsSync(path.dirname(buildPath))) {
    fs.writeFileSync(buildPath, llmsContent);
    console.log('✅ Updated build/llms.txt');
  }
}

function updateProfileJson() {
  const currentDate = new Date().toISOString().split('T')[0];
  const featuredProjects = getTopProjects(projectsData, 8).map(project => formatProjectForProfileJson(project));

  const profileJsonData = {
    "name": profileData.name,
    "title": profileData.title,
    "age": profileData.age,
    "location": profileData.location,
    "email": profileData.email,
    "website": "https://kuber.studio",
    "github": profileData.socials.github,
    "linkedin": profileData.socials.linkedin,
    "blog": "https://kuber.studio/blog/",
    "youtube": profileData.socials.youtube,
    "current_role": {
      "position": "Perplexity AI Business Fellow & OpenAI Asia-Pacific Developer Advisor",
      "company": "Perplexity AI / OpenAI",
      "focus": "AI development, business applications, and advising on SOTA open-weight models",
      "note": "Recently collaborated with the OpenAI team including Sam Altman on a call as part of a small group of Asia-Pacific developers advising their upcoming SOTA open-weight model"
    },
    "education": [
      {
        "degree": "BSc Computer Science",
        "institution": "BITS Pilani",
        "status": "Current"
      },
      {
        "degree": "BTech AI & Data Science",
        "institution": "Indraprastha University",
        "status": "Current"
      }
    ],
    "skills": profileData.skills,
    "featured_projects": featuredProjects,
    "achievements": [
      "Perplexity AI Business Fellow",
      "OpenAI Asia-Pacific Developer Advisor",
      "Collaborated with OpenAI team including Sam Altman",
      "First Place at Hack Club SiteJam",
      "Creator of 40+ AI/ML projects",
      "6+ years of 3D modeling experience",
      "100+ 3D renders for gaming environments"
    ],
    "interests": [
      "AI in media and recommendation algorithms",
      "Multi-agent AI systems",
      "Creative technology and interactive experiences",
      "Gaming and virtual environments",
      "Open source development"
    ],
    "portfolio_features": {
      "type": "Interactive Terminal",
      "technologies": ["React", "JavaScript", "CSS"],
      "features": [
        "30+ terminal commands",
        "Built-in games (Snake, Tetris, 2048, Flappy Bird)",
        "AI assistant (JARVIS)",
        "Calculator and utilities",
        "Dynamic theming system",
        "Mobile responsive design"
      ]
    },
    "last_updated": currentDate
  };

  const profileJson = JSON.stringify(profileJsonData, null, 2);

  // Write to both public and build directories
  const publicPath = path.join(__dirname, '../public/profile.json');
  const buildPath = path.join(__dirname, '../build/profile.json');

  fs.writeFileSync(publicPath, profileJson);
  console.log('✅ Updated public/profile.json');

  // Also update build directory if it exists
  if (fs.existsSync(path.dirname(buildPath))) {
    fs.writeFileSync(buildPath, profileJson);
    console.log('✅ Updated build/profile.json');
  }
}

function updateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://kuber.studio';

  // 1. Static Routes
  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: 'https://kuber.studio/blog/sitemap.xml', priority: '0.8', changefreq: 'weekly' },
    { loc: '/profile.json', priority: '0.8', changefreq: 'weekly' },
    { loc: '/profile.md', priority: '0.8', changefreq: 'weekly' },
  ];

  // 2. Hash Routes (Commands)
  const hashRoutes = [
    'who', 'projects', 'skills', 'misc',
    'misc/calculator', 'misc/qr-generator', 'misc/password-generator', 'misc/github-feed', 'misc/neofetch',
    'games', 'games/snake', 'games/tetris', 'games/2048', 'games/flappybird', 'games/gameoflife'
  ].map(route => ({
    loc: `/#/${route}`,
    priority: '0.7',
    changefreq: 'monthly'
  }));

  // 3. Project Routes (Subdomains or paths)
  const projectRoutes = [];
  projectsData.forEach(project => {
    if (project.website) {
      // Check if it's a subdomain of kuber.studio or a path
      if (project.website.includes('kuber.studio')) {
        // Skip blog as it's handled in staticRoutes with a specific sitemap link
        if (project.website.includes('/blog')) return;

        projectRoutes.push({
          loc: project.website,
          priority: '0.7',
          changefreq: 'monthly'
        });
      }
    }
  });

  // Combine all routes
  const allRoutes = [...staticRoutes, ...hashRoutes, ...projectRoutes];
  const uniqueRoutes = [];
  const seenUrls = new Set();

  allRoutes.forEach(route => {
    let url = route.loc;
    if (!url.startsWith('http')) {
      url = baseUrl + url;
    }

    // Normalize URL for deduplication (remove trailing slash)
    const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;

    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);

      // Use the original URL for the sitemap
      uniqueRoutes.push({ ...route, loc: url });
    }
  });

  // Generate XML
  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`;

  uniqueRoutes.forEach(route => {
    const url = route.loc;

    // Add image for root
    let imageXml = '';
    if (route.loc === '/' || route.loc === 'https://kuber.studio/') {
      imageXml = `
    <image:image>
      <image:loc>https://kuber.studio/embed-image.png</image:loc>
      <image:title>Kuber Mehta - AI Developer Portfolio</image:title>
      <image:caption>Interactive terminal-style portfolio showcasing AI development projects and skills</image:caption>
    </image:image>
    <image:image>
      <image:loc>https://kuber.studio/Portfolio-gif.gif</image:loc>
      <image:title>Portfolio Demo Animation</image:title>
      <image:caption>Animated demonstration of terminal-based portfolio interface</image:caption>
    </image:image>`;
    }

    sitemapXml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>${imageXml}
  </url>`;
  });

  sitemapXml += `
</urlset>`;

  // Write to both public and build directories
  const publicPath = path.join(__dirname, '../public/sitemap.xml');
  const buildPath = path.join(__dirname, '../build/sitemap.xml');

  fs.writeFileSync(publicPath, sitemapXml);
  console.log('✅ Updated public/sitemap.xml');

  // Also update build directory if it exists
  if (fs.existsSync(path.dirname(buildPath))) {
    fs.writeFileSync(buildPath, sitemapXml);
    console.log('✅ Updated build/sitemap.xml');
  }
}

function main() {
  console.log('🔄 Updating metadata files...');

  try {
    updateLlmsTxt();
    updateProfileJson();
    updateSitemap();
    console.log('✅ All metadata files updated successfully!');
  } catch (error) {
    console.error('❌ Error updating metadata files:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { updateLlmsTxt, updateProfileJson, updateSitemap };
