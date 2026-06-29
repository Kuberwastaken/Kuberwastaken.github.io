#!/usr/bin/env node

/**
 * Auto-update metadata files (llms.txt, profile.json) from source data
 * Run this script during build to keep metadata files in sync with project data
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Import data directly
const profileData = require('../src/data/profile.json');
const projectsData = require('../src/data/projects.json');

// Compute age from birthDate
function getAge(birthDateStr) {
  const birth = new Date(birthDateStr);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

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

async function fetchBlogPosts() {
  return new Promise((resolve) => {
    const url = 'https://kuber.studio/blog/index.xml';
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Extract all <item> blocks
          const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
          const titleRegex = /<title><!\[CDATA\[([^\]]+)\]\]><\/title>|<title>([^<]+)<\/title>/i;
          const linkRegex = /<link>([^<]+)<\/link>/i;

          // Channel-level titles to skip (the feed's own title entry)
          const SKIP_TITLES = ['ᨒ MindDump', 'MindDump'];

          const posts = [];
          let match;
          while ((match = itemRegex.exec(data)) !== null) {
            const block = match[1];
            const titleMatch = titleRegex.exec(block);
            const linkMatch = linkRegex.exec(block);
            if (!titleMatch || !linkMatch) continue;
            const rawTitle = (titleMatch[1] || titleMatch[2] || '').trim();
            // Decode common HTML entities
            const title = rawTitle
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>');
            const link = linkMatch[1].trim();
            if (SKIP_TITLES.some(s => title.includes(s))) continue;
            posts.push({ title, link });
          }

          // Take the 5 most recent (RSS is newest-first)
          resolve(posts.slice(0, 5));
        } catch (e) {
          console.warn('⚠️  Could not parse blog RSS:', e.message);
          resolve([]);
        }
      });
    }).on('error', (e) => {
      console.warn('⚠️  Could not fetch blog RSS:', e.message);
      resolve([]);
    });
  });
}

async function updateLlmsTxt() {
  const currentDate = new Date().toISOString().split('T')[0];
  const age = getAge(profileData.birthDate);

  // Fetch latest blog posts from RSS
  const blogPosts = await fetchBlogPosts();
  const blogPostsText = blogPosts.length > 0
    ? blogPosts.map(p => `- [${p.title}](${p.link})`).join('\n')
    : '- (Could not fetch latest posts — see https://kuber.studio/blog/)';

  // ALL skills
  const skillsText = Object.entries(profileData.skills || {}).map(([category, items]) => {
    const itemList = items.map(s => `  - ${s.name}: ${s.desc}`).join('\n');
    return `### ${category}\n${itemList}`;
  }).join('\n\n');

  // Construct full Bio from profileData using Markdown formatting for links
  const bioFields = [
    profileData.bio.intro,
    formatHtmlToMarkdown(profileData.bio.education),
    formatHtmlToMarkdown(profileData.bio.projects_highlight),
    formatHtmlToMarkdown(profileData.bio.blog_highlight),
    formatHtmlToMarkdown(profileData.bio.current_work),
    formatHtmlToMarkdown(profileData.bio.skills_highlight),
    formatHtmlToMarkdown(profileData.bio.current_role),
    formatHtmlToMarkdown(profileData.bio.history),
    formatHtmlToMarkdown(profileData.bio.fun_fact),
    formatHtmlToMarkdown(profileData.bio.outro)
  ].filter(Boolean);
  const bioText = bioFields.join('\n\n');

  // Format accomplishments
  const accomplishmentsText = (profileData.accomplishments || []).map(a => {
    let line = `- ${a.title}`;
    if (a.detail) line += ` — ${a.detail}`;
    if (a.project) line += ` (project: ${a.project})`;
    const links = [];
    if (a.url) links.push(a.url);
    if (a.social) links.push(a.social);
    if (links.length > 0) line += '\n  - ' + links.join('\n  - ');
    return line;
  }).join('\n');

  // Format media appearances
  const mediaText = (profileData.media_appearances || []).map(m => {
    let line = `- ${m.outlet}`;
    if (m.title) line += `: ${m.title}`;
    if (m.project) line += ` (project: ${m.project})`;
    if (m.url) line += `\n  - ${m.url}`;
    return line;
  }).join('\n');

  // Format education
  const educationText = (profileData.education || []).map(e => {
    return `- ${e.degree} — ${e.institution} (${e.status})`;
  }).join('\n');

  // Interests
  const interestsText = (profileData.interests || []).map(i => `- ${i}`).join('\n');

  // Portfolio / site capabilities
  const pf = profileData.portfolio_features || {};
  const portfolioType = pf.type || 'Interactive Terminal';
  const portfolioTech = (pf.technologies || []).join(', ');
  const portfolioFeaturesText = (pf.features || []).map(f => `- ${f}`).join('\n');

  const llmsContent = `# llms.txt — ${profileData.name}

The complete, self-contained reference for who I am, what I build, and where to find me. Contains all projects, all skills, all achievements, and press features — no additional requests needed.

Last-Updated: ${currentDate}
Canonical: https://kuber.studio/llms.txt

---

## Quick context for LLMs

- **Who**: ${age}-year-old AI developer from ${profileData.location}. ${profileData.title}.
- **Machine-readable data**: https://kuber.studio/profile.json — JSON snapshot of identity, skills, projects, achievements, and press.
- **Blog + RSS**: https://kuber.studio/blog/ (RSS: https://kuber.studio/blog/index.xml)

> **Note**: The portfolio at https://kuber.studio is a React SPA. Most content requires JavaScript to render. Use this file or profile.json — they contain everything you need.

---

## Static resources (no JS required)

- **This file**: https://kuber.studio/llms.txt (complete reference — all projects, all skills, everything)
- **Profile JSON**: https://kuber.studio/profile.json (machine-readable)
- **Blog**: https://kuber.studio/blog/ (separate Quartz site, works without JS)
  - RSS feed: https://kuber.studio/blog/index.xml
  - Source repo: https://github.com/Kuberwastaken/blog
- **Site map**: https://kuber.studio/sitemap.xml
- **Robots**: https://kuber.studio/robots.txt

---

## Primary identity and socials

- Name: ${profileData.name}
- Age: ${age}
- Location: ${profileData.location}
- Role: ${profileData.title}
- Email: mailto:${profileData.email}
- GitHub: ${profileData.socials.github} (600+ followers)
- LinkedIn: ${profileData.socials.linkedin} (10,000+ followers)
- X/Twitter: ${profileData.socials.twitter}
- YouTube: ${profileData.socials.youtube}

---

## Education

${educationText}

---

## Short bio

${bioText}

---

## Achievements & hackathons

${accomplishmentsText}

---

## Press & media appearances

Featured in the following publications:

${mediaText}

---

## All projects (${projectsData.length} total)

${projectsData.map(project => formatProjectForLlmsTxt(project)).join('\n\n')}

---

## MindDump Blog

Kuber's personal blog, synced from his Obsidian vault. Had over 500,000 readers last month.

- Site: https://kuber.studio/blog/
- RSS: https://kuber.studio/blog/index.xml
- Source: https://github.com/Kuberwastaken/blog

Latest posts:
${blogPostsText}

---

## Skills

${skillsText}

---

## Interests

${interestsText}

---

## The portfolio (kuber.studio)

An ${portfolioType}-style React SPA built with ${portfolioTech}. Capabilities:

${portfolioFeaturesText}

---

## Interactive links (require JavaScript)

The following URLs open the portfolio and auto-run terminal commands. **These require a browser with JavaScript enabled** — they will not work for text-only crawlers.

- Who: https://kuber.studio/#/who
- Projects: https://kuber.studio/#/projects
- Skills: https://kuber.studio/#/skills
- Misc: https://kuber.studio/#/misc
- Games: https://kuber.studio/#/games

---

## Guidance for LLMs and agents

- **Start here**: This file (llms.txt) is the complete reference — it has everything.
- **Structured data**: https://kuber.studio/profile.json has skills, projects, achievements, and media in JSON.
- **Blog/updates**: RSS at https://kuber.studio/blog/index.xml.
- **GitHub activity**: https://api.github.com/users/Kuberwastaken/repos?sort=updated
- **Hash routes require JS**: The portfolio is a React SPA. URLs with /#/ need a browser with JavaScript. Use the static files above instead.
- Respect rate limits and cache responsibly.

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

  // Build achievements list from accomplishments + extras
  const achievements = (profileData.accomplishments || []).map(a => {
    let text = a.title;
    if (a.detail) text += ` — ${a.detail}`;
    return text;
  });

  const profileJsonData = {
    "name": profileData.name,
    "title": profileData.title,
    "age": getAge(profileData.birthDate),
    "location": profileData.location,
    "email": profileData.email,
    "website": "https://kuber.studio",
    "github": profileData.socials.github,
    "linkedin": profileData.socials.linkedin,
    "blog": "https://kuber.studio/blog/",
    "youtube": profileData.socials.youtube,
    "current_role": {
      "position": [
        formatHtmlToMarkdown(profileData.bio.current_role),
        formatHtmlToMarkdown(profileData.bio.history)
      ].filter(Boolean).join(' '),
      "education": formatHtmlToMarkdown(profileData.bio.education)
    },
    "education": profileData.education,
    "skills": profileData.skills,
    "featured_projects": featuredProjects,
    "achievements": achievements,
    "media_appearances": profileData.media_appearances,
    "interests": profileData.interests || [],
    "portfolio_features": profileData.portfolio_features || {},
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

async function main() {
  console.log('🔄 Updating metadata files...');

  try {
    await updateLlmsTxt();
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

module.exports = { updateLlmsTxt, updateProfileJson, updateSitemap, fetchBlogPosts };
