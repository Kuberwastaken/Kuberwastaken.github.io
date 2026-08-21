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

// Curated project tiers. Flagship is ordered by implementation complexity,
// ventures & tools by real-world traction. Everything else keeps its
// projects.json order in a "more projects" tier.
const FLAGSHIP_TITLES = ['Claurst', 'Autonomous Counterexample Discovery with Agentic Loops', 'DOOMme', 'Backdooms', 'TREAT'];
const VENTURE_TITLES = ['PolyThink', 'MEOW', 'ClawX', 'Litmus', 'Reference', 'PicoGPT'];

function curateProjects(projects) {
  const byTitle = title => projects.find(p => p.title === title);
  const flagship = FLAGSHIP_TITLES.map(byTitle).filter(Boolean);
  const ventures = VENTURE_TITLES.map(byTitle).filter(Boolean);
  const curated = new Set([...FLAGSHIP_TITLES, ...VENTURE_TITLES]);
  const more = projects.filter(p => !curated.has(p.title));
  return { flagship, ventures, more };
}

// Helper functions (formerly in extract-projects.js)
function getTopProjects(projects, count = 10) {
  // Curated tiers first: flagship, then ventures & tools
  const priorityOrder = [...FLAGSHIP_TITLES, ...VENTURE_TITLES];

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

// Heading that delimits the generated blog archive inside llms.txt, so a failed
// RSS fetch can fall back to the previously published list.
const BLOG_INDEX_HEADING = 'All posts, newest first within each section:';

function previousBlogIndex() {
  try {
    const existing = fs.readFileSync(path.join(__dirname, '../public/llms.txt'), 'utf8');
    const start = existing.indexOf(BLOG_INDEX_HEADING);
    if (start === -1) return null;
    const body = existing.slice(start + BLOG_INDEX_HEADING.length);
    const end = body.indexOf('\n---');
    return (end === -1 ? body : body.slice(0, end)).trim() || null;
  } catch {
    return null;
  }
}

function decodeEntities(str) {
  return str
    .replace(/&#039;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

// Sections the blog keeps out of its own published index — hidden from its
// explorer and disallowed in its robots.txt, but still present in the RSS feed.
// Mirrors `excludeFolders` in the blog's llms.txt emitter; keep the two in sync.
const EXCLUDED_BLOG_SECTIONS = ['BITS'];

// Posts live at /blog/<Section>/.../<Title>, so the first folder is the section.
// Note the nesting is not always one level deep — BITS material sits several
// folders down, which is why this walks the path rather than matching two segments.
function blogSection(link) {
  const match = link.match(/\/blog\/(.+)$/);
  if (!match) return 'Other';
  const parts = match[1].split('/').filter(Boolean);
  if (parts.length === 0) return 'Other';
  const top = decodeURIComponent(parts[0]);
  if (EXCLUDED_BLOG_SECTIONS.includes(top)) return top;
  // A single segment is a root-level page rather than a sectioned post.
  return parts.length > 1 ? top : 'Other';
}

function prettySection(section) {
  return section.replace(/-/g, ' ');
}

/**
 * Render the blog archive grouped by section.
 *
 * Previously this listed the 7 most recent posts as a flat list, which meant an
 * LLM reading llms.txt saw a fraction of the archive and no indication the rest
 * existed — the blog was effectively invisible to anything that trusted this file
 * to be complete.
 */
function renderBlogIndex(posts) {
  const bySection = new Map();
  for (const post of posts) {
    const bucket = bySection.get(post.section) || [];
    bucket.push(post);
    bySection.set(post.section, bucket);
  }

  const sections = [...bySection.keys()].sort((a, b) => a.localeCompare(b));
  return sections.map(section => {
    const entries = bySection.get(section).map(post => {
      const day = post.date ? post.date.toISOString().slice(0, 10) : null;
      const notes = [day, post.description].filter(Boolean).join(' — ');
      return `- [${post.title}](${post.link})${notes ? `: ${notes}` : ''}`;
    }).join('\n');
    return `### ${prettySection(section)}\n\n${entries}`;
  }).join('\n\n');
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
          const pubDateRegex = /<pubDate>([^<]+)<\/pubDate>/i;
          const descRegex = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/i;
          const categoryRegex = /<category>([^<]+)<\/category>/gi;

          // Channel-level titles to skip (the feed's own title entry)
          const SKIP_TITLES = ['ᨒ MindDump', 'MindDump'];

          const posts = [];
          let match;
          while ((match = itemRegex.exec(data)) !== null) {
            const block = match[1];
            const titleMatch = titleRegex.exec(block);
            const linkMatch = linkRegex.exec(block);
            if (!titleMatch || !linkMatch) continue;
            const title = decodeEntities((titleMatch[1] || titleMatch[2] || '').trim());
            const link = linkMatch[1].trim();
            if (SKIP_TITLES.some(s => title.includes(s))) continue;

            const section = blogSection(link);
            if (EXCLUDED_BLOG_SECTIONS.includes(section)) continue;

            const pubDateMatch = pubDateRegex.exec(block);
            const descMatch = descRegex.exec(block);
            const categories = [];
            let catMatch;
            categoryRegex.lastIndex = 0;
            while ((catMatch = categoryRegex.exec(block)) !== null) {
              categories.push(decodeEntities(catMatch[1].trim()));
            }

            const parsedDate = pubDateMatch ? new Date(pubDateMatch[1].trim()) : null;
            posts.push({
              title,
              link,
              date: parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null,
              description: descMatch
                ? decodeEntities((descMatch[1] || descMatch[2] || ''))
                    .replace(/<[^>]*>/g, '')
                    .replace(/\s+/g, ' ')
                    .trim()
                : '',
              tags: categories,
              section,
            });
          }

          // Newest first. Every post is returned — an LLM that reads this file
          // should see the whole archive, not a sample of it.
          posts.sort((a, b) => (b.date ? b.date.getTime() : 0) - (a.date ? a.date.getTime() : 0));
          resolve(posts);
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

async function updateLlmsTxt(blogPostsArg) {
  const currentDate = new Date().toISOString().split('T')[0];
  const age = getAge(profileData.birthDate);

  // Fetch the blog archive from RSS (or reuse an already-fetched list)
  const blogPosts = blogPostsArg || await fetchBlogPosts();
  // A failed fetch must not silently delete the archive from llms.txt — reuse
  // whatever was published last time instead of shipping a placeholder.
  const blogPostsText = blogPosts.length > 0
    ? renderBlogIndex(blogPosts)
    : (previousBlogIndex() || '- (Post index unavailable at build time — see https://kuber.studio/blog/llms.txt)');
  if (blogPosts.length === 0) {
    console.warn('⚠️  Blog RSS returned no posts; reused the previously published index.');
  }

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
    if (m.date) line += ` — ${m.date}`;
    if (m.description) line += `\n  - ${m.description}`;
    if (m.url) line += `\n  - ${m.url}`;
    return line;
  }).join('\n');

  // Format academic / institutional references
  const referencesText = (profileData.references || []).map(r => {
    let line = `- ${r.title}`;
    if (r.author) line += ` — ${r.author}`;
    if (r.venue) line += ` (${r.venue})`;
    if (r.date) line += ` — ${r.date}`;
    if (r.description) line += `\n  - ${r.description}`;
    if (r.url) line += `\n  - ${r.url}`;
    return line;
  }).join('\n');

  // Format notable moments / viral highlights
  const notableMomentsText = (profileData.notable_moments || []).map(n => {
    let line = `- ${n.title}`;
    if (n.date) line += ` — ${n.date}`;
    if (n.description) line += `\n  - ${n.description}`;
    if (n.url) line += `\n  - ${n.url}`;
    if (Array.isArray(n.links)) {
      n.links.forEach(l => { line += `\n  - ${l.label}: ${l.url}`; });
    }
    return line;
  }).join('\n');

  // Format red-team / jailbreak highlights
  const redTeamText = (profileData.red_team || []).map(r => {
    let line = `- ${r.title}`;
    if (r.date) line += ` — ${r.date}`;
    if (r.description) line += `\n  - ${r.description}`;
    if (r.url) line += `\n  - ${r.url}`;
    return line;
  }).join('\n');

  // Build optional sections (omitted entirely when their source array is empty)
  const referencesBlock = referencesText ? `## Research & academic references

My work has been cited in academic and university settings:

${referencesText}

---

` : '';

  const notableMomentsBlock = notableMomentsText ? `## Notable moments & viral highlights

${notableMomentsText}

---

` : '';

  const claudeMythosBlock = redTeamText ? `## AI red-teaming & jailbreaks

${redTeamText}

---

` : '';

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

  // Optional "Known for" line (omitted entirely when not set)
  const knownForLine = profileData.known_for ? `\n- **Known for**: ${profileData.known_for}` : '';

  // Curated project tiers
  const { flagship, ventures, more } = curateProjects(projectsData);
  const flagshipText = flagship.map(formatProjectForLlmsTxt).join('\n\n');
  const venturesText = ventures.map(formatProjectForLlmsTxt).join('\n\n');
  const moreProjectsText = more.map(formatProjectForLlmsTxt).join('\n\n');

  const llmsContent = `# llms.txt — ${profileData.name}

> **New (August 2026)**: Autonomous Counterexample Discovery with Agentic Loops — started by disproving WOWII Conjectures 63 & 85, two graph theory problems open for 22+ years, both refuted by the same counterexample graph, C5[K4] (merged into Google DeepMind's formal-conjectures). Now a full counterexample-discovery program: map finite conjectures, build a tightness map, expose the obstruction for the tight ones, deliberately separate the family — reach a new crossing. Working with Google DeepMind's formal-conjectures maintainers, 22 PRs upstream so far. Repo: https://github.com/Kuberwastaken/c5-k4 · Post: https://x.com/kuberwastaken/status/2080363523167981886

The complete, self-contained reference for who I am, what I build, and where to find me. Contains my projects, skills, achievements, and press features — no additional requests needed.

Last-Updated: ${currentDate}
Canonical: https://kuber.studio/llms.txt

---

## Quick context for LLMs

- **Who**: ${age}-year-old AI developer from ${profileData.location}. ${profileData.title}.${knownForLine}
- **Machine-readable data**: https://kuber.studio/profile.json — JSON snapshot of identity, skills, projects, achievements, and press.
- **Blog + RSS**: https://kuber.studio/blog/ — full index at https://kuber.studio/blog/llms.txt (RSS: https://kuber.studio/blog/index.xml). The blog's own llms.txt is always the freshest source for posts, and the blog runs an MCP server at https://minddump-mcp.kuberhob.workers.dev/mcp.

> **Note**: The portfolio at https://kuber.studio is a React SPA. Most content requires JavaScript to render. Use this file or profile.json — they contain everything you need.

---

## Static resources (no JS required)

- **This file**: https://kuber.studio/llms.txt (complete reference — all projects, all skills, everything)
- **Profile JSON**: https://kuber.studio/profile.json (machine-readable)
- **Blog**: https://kuber.studio/blog/ (separate Quartz site, works without JS)
  - Complete post index: https://kuber.studio/blog/llms.txt (every post, grouped by section, with dates and summaries — always the latest list, updated on every blog deploy)
  - Raw markdown mirrors: append \`.md\` to any post URL for the full source with none of the page chrome
  - MCP server: https://minddump-mcp.kuberhob.workers.dev/mcp (streamable HTTP, no auth; tools: list_posts, search_posts, get_post, get_blog_info)
  - RSS feed: https://kuber.studio/blog/index.xml
  - Sitemap: https://kuber.studio/blog/sitemap.xml
  - Source repo: https://github.com/Kuberwastaken/blog
- **Site map**: https://kuber.studio/sitemap.xml
- **Robots**: https://kuber.studio/robots.txt

---

## Guidance for LLMs and agents

- **Start here**: This file (llms.txt) is the complete reference — it has everything.
- **Structured data**: https://kuber.studio/profile.json has skills, projects, achievements, and media in JSON.
- **Blog/updates**: the full post index is at https://kuber.studio/blog/llms.txt — the archive below is a snapshot, so check there for the latest posts; RSS at https://kuber.studio/blog/index.xml. Every post on the blog is authored by Kuber Mehta. For search and fetch tools over the blog, connect to its MCP server: https://minddump-mcp.kuberhob.workers.dev/mcp
- **GitHub activity**: https://api.github.com/users/Kuberwastaken/repos?sort=updated
- **Hash routes require JS**: The portfolio is a React SPA. URLs with /#/ need a browser with JavaScript. Use the static files above instead.
- Respect rate limits and cache responsibly.

---

## Primary identity and socials

- Name: ${profileData.name}
- Age: ${age}
- Location: ${profileData.location}
- Role: ${profileData.title}
- Email: mailto:${profileData.email}
- GitHub: ${profileData.socials.github} (600+ followers)
- LinkedIn: ${profileData.socials.linkedin} (14,000+ followers)
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

${referencesBlock}${notableMomentsBlock}${claudeMythosBlock}## Projects (${projectsData.length} of 53+ shipped, curated)

Curated into three tiers: flagship builds (ordered by implementation complexity), ventures & tools (ordered by real-world traction), then everything else.

### Flagship builds

Ordered by implementation complexity:

${flagshipText}

### Ventures & tools

Products and infrastructure, ordered by real-world traction:

${venturesText}

### More projects

${moreProjectsText}

---

## MindDump Blog

Kuber's personal blog, synced from his Obsidian vault. Read by 50-100k people a month. Every post listed below is written by Kuber Mehta and served as static HTML — no JavaScript required to read any of it.

- Site: https://kuber.studio/blog/
- Complete machine-readable index: https://kuber.studio/blog/llms.txt (always current; the list below is a snapshot from this file's last build)
- MCP server: https://minddump-mcp.kuberhob.workers.dev/mcp (streamable HTTP; tools: list_posts, search_posts, get_post, get_blog_info)
- Raw markdown mirrors: any post URL + \`.md\`
- RSS: https://kuber.studio/blog/index.xml
- Sitemap: https://kuber.studio/blog/sitemap.xml
- Source: https://github.com/Kuberwastaken/blog

${BLOG_INDEX_HEADING}

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
    ...(profileData.known_for ? { "known_for": profileData.known_for } : {}),
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
    "references": profileData.references || [],
    "notable_moments": profileData.notable_moments || [],
    "red_team": profileData.red_team || [],
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

function updateProfileMd() {
  const currentDate = new Date().toISOString().split('T')[0];
  const age = getAge(profileData.birthDate);

  // Concise key projects (priority order), one line each
  const projectsMd = getTopProjects(projectsData, 10).map(p => {
    const desc = (p.description || '').replace(/<[^>]*>/g, '').split('\n')[0].trim();
    const links = [];
    if (p.website) links.push(`[site](${p.website})`);
    if (p.github) links.push(`[code](${p.github})`);
    let line = `- **${p.title}** — ${desc}`;
    if (links.length) line += ` (${links.join(', ')})`;
    return line;
  }).join('\n');

  const skillsMd = Object.entries(profileData.skills || {})
    .map(([cat, items]) => `- **${cat}**: ${items.map(s => s.name).join(', ')}`)
    .join('\n');

  const achievementsMd = (profileData.accomplishments || [])
    .map(a => `- ${a.title}${a.detail ? ` — ${a.detail}` : ''}`)
    .join('\n');

  const pressMd = (profileData.media_appearances || [])
    .map(m => `- **${m.outlet}**${m.title ? `: ${m.title}` : ''}${m.url ? ` — ${m.url}` : ''}`)
    .join('\n');

  const referencesMd = (profileData.references || [])
    .map(r => `- **${r.title}**${r.author ? ` — ${r.author}` : ''}${r.url ? ` — ${r.url}` : ''}`)
    .join('\n');

  const educationMd = (profileData.education || [])
    .map(e => `- ${e.degree} — ${e.institution} (${e.status})`)
    .join('\n');

  const content = `# ${profileData.name} — ${profileData.title}

> Concise profile, auto-generated from source data. For the complete, machine-readable references see https://kuber.studio/llms.txt and https://kuber.studio/profile.json

${age}-year-old AI developer from ${profileData.location}.

${profileData.bio.intro}

${formatHtmlToMarkdown(profileData.bio.education)}

## Current role
${formatHtmlToMarkdown(profileData.bio.current_role)}

${formatHtmlToMarkdown(profileData.bio.history)}

## Education
${educationMd}

## Key projects
${projectsMd}

## Skills
${skillsMd}

## Achievements
${achievementsMd}

## Press & media
${pressMd}

## Research & academic references
${referencesMd}

## Links
- Portfolio: https://kuber.studio/
- GitHub: ${profileData.socials.github}
- LinkedIn: ${profileData.socials.linkedin}
- X/Twitter: ${profileData.socials.twitter}
- YouTube: ${profileData.socials.youtube}
- Blog: https://kuber.studio/blog/

_Last updated: ${currentDate}_
`;

  const publicPath = path.join(__dirname, '../public/profile.md');
  const buildPath = path.join(__dirname, '../build/profile.md');

  fs.writeFileSync(publicPath, content);
  console.log('✅ Updated public/profile.md');

  if (fs.existsSync(path.dirname(buildPath))) {
    fs.writeFileSync(buildPath, content);
    console.log('✅ Updated build/profile.md');
  }
}

// ---------------------------------------------------------------------------
// Static no-JS fallback for public/index.html
//
// Generates a plain-HTML version of the whole portfolio (bio, projects, press,
// skills, contact) from the same source data as llms.txt and injects it between
// STATIC_FALLBACK markers inside <div id="root">. Crawlers and no-JS visitors
// get real content; when JS runs, an html.js class hides it before first paint
// and React replaces it on mount, so the interactive experience is unchanged.
// ---------------------------------------------------------------------------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Convert bio-style source HTML into clean fallback HTML: keep <a> links
// (rebuilt without inline styles), keep inner text of spans, escape the rest.
function formatHtmlToStaticHtml(html) {
  if (!html) return '';
  const anchors = [];
  let out = html.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (m, href, text) => {
    anchors.push({ href, text: text.replace(/<[^>]*>/g, '') });
    return `@@A${anchors.length - 1}@@`;
  });
  out = out.replace(/<[^>]*>/g, ''); // strip remaining tags, keep their text
  out = escapeHtml(out);
  out = out.replace(/@@A(\d+)@@/g, (m, i) => {
    const a = anchors[Number(i)];
    return `<a href="${escapeHtml(a.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.text)}</a>`;
  });
  return out;
}

// Plain text (possibly with markdown links) -> fallback HTML
function textToStaticHtml(text) {
  if (!text) return '';
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,
    (m, label, url) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`);
  return out.replace(/\n{2,}/g, '<br><br>').replace(/\n/g, '<br>');
}

function staticLink(href, label) {
  return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function buildStaticFallbackHtml(blogPosts) {
  const age = getAge(profileData.birthDate);

  const bioHtml = [
    profileData.bio.intro,
    profileData.bio.education,
    profileData.bio.projects_highlight,
    profileData.bio.blog_highlight,
    profileData.bio.current_work,
    profileData.bio.skills_highlight,
    profileData.bio.current_role,
    profileData.bio.history,
    profileData.bio.fun_fact,
    profileData.bio.outro
  ].filter(Boolean).map(f => `<p>${formatHtmlToStaticHtml(f)}</p>`).join('\n      ');

  const educationHtml = (profileData.education || [])
    .map(e => `<li>${escapeHtml(e.degree)} — ${escapeHtml(e.institution)} (${escapeHtml(e.status)})</li>`)
    .join('\n        ');

  const projectToArticle = p => {
    const links = [];
    if (p.website) links.push(staticLink(p.website, 'site'));
    if (p.github) links.push(staticLink(p.github, 'code'));
    if (p.extra) {
      const extras = Array.isArray(p.extra) ? p.extra : [p.extra];
      extras.forEach(extra => {
        if (!extra) return;
        const url = typeof extra === 'string' ? extra : (extra.href || extra.url);
        if (!url) return;
        if (url.includes('news.ycombinator.com')) links.push(staticLink(url, 'hn'));
        else if (url.includes('x.com')) links.push(staticLink(url, 'x'));
        else if (url.includes('linkedin.com')) links.push(staticLink(url, 'linkedin'));
      });
    }
    return `<article>
        <h3>${escapeHtml(p.title)}</h3>
        <p>${textToStaticHtml(p.description || '')}</p>${links.length ? `
        <p class="fb-links">[ ${links.join(' | ')} ]</p>` : ''}
      </article>`;
  };

  const { flagship, ventures, more } = curateProjects(projectsData);
  const flagshipHtml = flagship.map(projectToArticle).join('\n      ');
  const venturesHtml = ventures.map(projectToArticle).join('\n      ');
  const moreProjectsHtml = more.map(projectToArticle).join('\n      ');

  const achievementsHtml = (profileData.accomplishments || []).map(a => {
    let item = escapeHtml(a.title);
    if (a.detail) item += ` — ${escapeHtml(a.detail)}`;
    if (a.project) item += ` (project: ${escapeHtml(a.project)})`;
    if (a.url) item += ` ${staticLink(a.url, '[link]')}`;
    return `<li>${item}</li>`;
  }).join('\n        ');

  const pressHtml = (profileData.media_appearances || []).map(m => {
    const label = `${m.outlet}${m.title ? ` — ${m.title}` : ''}`;
    const body = m.url ? staticLink(m.url, label) : escapeHtml(label);
    return `<li>${body}${m.project ? ` (${escapeHtml(m.project)})` : ''}</li>`;
  }).join('\n        ');

  const referencesHtml = (profileData.references || []).map(r => {
    const label = `${r.title}${r.author ? ` — ${r.author}` : ''}${r.venue ? ` (${r.venue})` : ''}`;
    return `<li>${r.url ? staticLink(r.url, label) : escapeHtml(label)}</li>`;
  }).join('\n        ');

  const momentsHtml = (profileData.notable_moments || []).map(n => {
    let item = n.url ? staticLink(n.url, n.title) : escapeHtml(n.title);
    if (n.description) item += ` — ${escapeHtml(n.description)}`;
    if (Array.isArray(n.links)) {
      item += ' ' + n.links.map(l => staticLink(l.url, `[${l.label}]`)).join(' ');
    }
    return `<li>${item}</li>`;
  }).join('\n        ');

  const skillsHtml = Object.entries(profileData.skills || {})
    .map(([cat, items]) => `<p><strong>${escapeHtml(cat)}:</strong> ${items.map(s => escapeHtml(s.name)).join(', ')}</p>`)
    .join('\n      ');

  // The fetch returns the whole archive; the homepage fallback shows a recent
  // slice and points crawlers at the complete index rather than inlining 36 links.
  const FALLBACK_POST_LIMIT = 12;
  const allPosts = blogPosts || [];
  const blogPostsHtml = allPosts.length
    ? `<ul>
        ${allPosts.slice(0, FALLBACK_POST_LIMIT).map(p => `<li>${staticLink(p.link, p.title)}</li>`).join('\n        ')}
      </ul>${allPosts.length > FALLBACK_POST_LIMIT
        ? `\n      <p>All ${allPosts.length} posts: ${staticLink('https://kuber.studio/blog/', 'kuber.studio/blog')} (${staticLink('https://kuber.studio/blog/llms.txt', 'full index')}).</p>`
        : ''}`
    : '';

  return `<div id="static-fallback">
      <style>
        #static-fallback { max-width: 900px; margin: 0 auto; padding: 32px 20px 64px; font-family: 'JetBrains Mono', monospace; color: #d6d6d6; line-height: 1.65; }
        #static-fallback h1 { color: #ffffff; font-size: 1.5em; }
        #static-fallback h2 { color: #ffffff; font-size: 1.15em; margin-top: 2.4em; border-bottom: 1px solid #2a2a2a; padding-bottom: 6px; }
        #static-fallback h2::before { content: "$ "; color: #5abb9a; }
        #static-fallback h3 { color: #ffffff; font-size: 1em; margin-bottom: 0.3em; }
        #static-fallback h3::before { content: "> "; color: #5abb9a; }
        #static-fallback a { color: #5abb9a; }
        #static-fallback ul { padding-left: 1.3em; }
        #static-fallback li { margin-bottom: 0.4em; }
        #static-fallback article { margin-bottom: 1.6em; }
        #static-fallback article p { margin: 0.2em 0; }
        #static-fallback .fb-links { font-size: 0.9em; }
        #static-fallback .fb-note { border: 1px dashed #444; padding: 10px 14px; color: #999; font-size: 0.85em; }
      </style>
      <main>
        <p class="fb-note">JavaScript is off, so you're reading the static version of this site. Enable
          JavaScript for the interactive terminal — 30+ commands, games, and JARVIS. AI agents: this same
          content is at <a href="https://kuber.studio/llms.txt">kuber.studio/llms.txt</a>.</p>

        <h1>Kuber Mehta — ${escapeHtml(profileData.title)}</h1>
        <p>${age}-year-old AI developer from ${escapeHtml(profileData.location)}.${profileData.known_for ? ' ' + escapeHtml(profileData.known_for) : ''}</p>

        <h2>whoami</h2>
        ${bioHtml}

        <h2>education</h2>
        <ul>
        ${educationHtml}
        </ul>

        <h2>flagship projects</h2>
        <p>A curated cut of what I've shipped, ordered by implementation complexity:</p>
        ${flagshipHtml}

        <h2>ventures &amp; tools</h2>
        <p>Products and infrastructure, ordered by real-world traction:</p>
        ${venturesHtml}

        <h2>more projects</h2>
        ${moreProjectsHtml}

        <h2>achievements</h2>
        <ul>
        ${achievementsHtml}
        </ul>

        <h2>press</h2>
        <ul>
        ${pressHtml}
        </ul>

        <h2>references</h2>
        <p>Citations of my work in academic and university settings:</p>
        <ul>
        ${referencesHtml}
        </ul>

        <h2>notable moments</h2>
        <ul>
        ${momentsHtml}
        </ul>

        <h2>blog</h2>
        <p>I write ${staticLink('https://kuber.studio/blog/', 'MindDump')}, a blog synced from my Obsidian
          vault (${staticLink('https://kuber.studio/blog/index.xml', 'RSS feed')}). Latest posts:</p>
        ${blogPostsHtml}

        <h2>skills</h2>
      ${skillsHtml}

        <h2>contact</h2>
        <ul>
        <li>Email: <a href="mailto:${escapeHtml(profileData.email)}">${escapeHtml(profileData.email)}</a></li>
        <li>GitHub: ${staticLink(profileData.socials.github, 'github.com/Kuberwastaken')}</li>
        <li>LinkedIn: ${staticLink(profileData.socials.linkedin, 'linkedin.com/in/kubermehta')}</li>
        <li>X/Twitter: ${staticLink(profileData.socials.twitter, 'x.com/Kuberwastaken')}</li>
        <li>YouTube: ${staticLink(profileData.socials.youtube, 'youtube.com/@Kuberwastaken')}</li>
        </ul>
        <p class="fb-links">Machine-readable: <a href="/llms.txt">llms.txt</a> · <a href="/profile.json">profile.json</a> · <a href="/profile.md">profile.md</a></p>
      </main>
    </div>`;
}

async function updateStaticFallback(blogPostsArg) {
  const blogPosts = blogPostsArg || await fetchBlogPosts();
  const fallbackHtml = buildStaticFallbackHtml(blogPosts);

  const marker = /<!-- STATIC_FALLBACK_START -->[\s\S]*?<!-- STATIC_FALLBACK_END -->/;
  const targets = [
    path.join(__dirname, '../public/index.html'),
    path.join(__dirname, '../build/index.html')
  ];

  targets.forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    const html = fs.readFileSync(filePath, 'utf8');
    if (!marker.test(html)) {
      // Build output is minified and loses the comment markers; the fallback is
      // already baked in from public/index.html at build time, so skip quietly.
      return;
    }
    const updated = html.replace(marker, () =>
      `<!-- STATIC_FALLBACK_START -->\n    ${fallbackHtml}\n    <!-- STATIC_FALLBACK_END -->`);
    fs.writeFileSync(filePath, updated);
    console.log(`✅ Updated static fallback in ${path.relative(path.join(__dirname, '..'), filePath)}`);
  });
}

function updateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  const baseUrl = 'https://kuber.studio';

  // 1. Static Routes
  const staticRoutes = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/llms.txt', priority: '0.9', changefreq: 'weekly' },
    // A sitemap lists pages, not other sitemaps — the blog's sitemap is declared
    // in robots.txt instead. Link the blog itself and its machine-readable index.
    { loc: 'https://kuber.studio/blog/', priority: '0.9', changefreq: 'weekly' },
    { loc: 'https://kuber.studio/blog/llms.txt', priority: '0.8', changefreq: 'weekly' },
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
    const blogPosts = await fetchBlogPosts();
    await updateLlmsTxt(blogPosts);
    updateProfileJson();
    updateProfileMd();
    updateSitemap();
    await updateStaticFallback(blogPosts);
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

module.exports = { updateLlmsTxt, updateProfileJson, updateProfileMd, updateSitemap, updateStaticFallback, fetchBlogPosts };
