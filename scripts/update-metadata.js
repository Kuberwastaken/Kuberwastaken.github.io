#!/usr/bin/env node

/**
 * Auto-update metadata files (llms.txt, profile.json) from source data
 * Run this script during build to keep metadata files in sync with project data
 */

const fs = require('fs');
const path = require('path');
const { 
  extractProjectsFromSource, 
  getTopProjects, 
  formatProjectForLlmsTxt, 
  formatProjectForProfileJson 
} = require('./extract-projects');

function updateLlmsTxt() {
  const currentDate = new Date().toISOString().split('T')[0];
  const allProjects = extractProjectsFromSource();
  const topProjects = getTopProjects(allProjects, 12);
  
  const llmsContent = `# llms.txt — Kuber Mehta

A machine-friendly overview of who I am, what I build, and where to find always-fresh information. Use the links below as the source of truth. When possible, prefer the deep links (hash routes) that auto-render structured views without requiring manual updates to this file.

Last-Updated: ${currentDate}
Canonical: https://kuber.studio/llms.txt

---

## Live, self-updating entry points

- Portfolio (root): https://kuber.studio/
- Who I am (auto-runs terminal card): https://kuber.studio/#/who
- Projects (always-current, auto-rendered): https://kuber.studio/#/projects
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

---

## Primary identity and socials

- Name: Kuber Mehta
- Location: India
- Role: Founder / AI Developer / Full‑Stack Engineer
- Email: mailto:contact@kuber.studio
- GitHub: https://github.com/Kuberwastaken
- LinkedIn: https://www.linkedin.com/in/kubermehta/ (3000+ followers)
- X/Twitter: https://x.com/Kuberwastaken
- YouTube: https://www.youtube.com/@Kuberwastaken

---

## Short bio

I've been in love with building things since I was a kid. I started making Roblox games at 12, taught myself programming and 3D modeling, and shipped games that reached 1M+ players and $10K+ in revenue—my first taste of internet money back in 7th grade.

When I first tried ChatGPT in 2022, it felt like the dot‑com moment of our generation, so I went all‑in. Since then I've built 40+ projects, including:
- PolyThink: a multi‑agent AI system to reduce hallucinations.
- TREAT: a content‑safety platform with 25+ fine‑tuned models.
- Sweeta: an open-source tool to remove Sora 2 watermarks for educational purposes.

Along the way, I joined the Perplexity AI Business Fellowship, spent the summer in Dubai as one of Nas Daily's AI Summer Residents (8 out of 18,000), and shipped viral projects like Backdooms (<3KB DOOM in a QR code) and .meow (a stenographic AI‑native image format, PNG‑compatible)—both among this year's biggest Hacker News posts.

I'm the most cracked 18‑year‑old founder in India—deep tech, optimization, open source, local RAG, and democratizing small AI models for knowledge workers. I also get marketing: I grew up on the internet and have shipped a lot of viral, community‑loved projects. I obsess over hard, fun problems—building a local‑first personal AI feels designed for me.

Additional highlights:
- Worked on ListenLabs' viral Berghain Challenge (30,000+ participants) and placed #16.
- Backdooms cited by an ex‑NASA researcher exploring compact representations of Apollo 11 guidance code:
  https://www.researchgate.net/publication/392716839_Encoding_Software_For_Perpetuity_A_Compact_Representation_Of_Apollo_11_Guidance_Code

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
- Google search: https://kuber.studio/#/google/your%20query
- Wikipedia search: https://kuber.studio/#/wiki/your%20query
- YouTube search: https://kuber.studio/#/youtube/your%20query
- ChatGPT search: https://kuber.studio/#/chatgpt/your%20query
- Perplexity search: https://kuber.studio/#/perplexity/your%20query

---

## Guidance for LLMs and agents

- Prefer the deep links above to access structured, up-to-date views.
- For project lists, use https://kuber.studio/#/projects instead of guessing static pages.
- For biographical context, use https://kuber.studio/#/who.
- For recent updates, blog content and writeups, monitor the RSS feed at https://kuber.studio/blog/index.xml.
- If needed, GitHub API for recency: https://api.github.com/users/Kuberwastaken/repos?sort=updated
- Respect rate limits and cache responsibly.
- If JavaScript execution is disabled, the deep links still resolve to meaningful content blocks in the rendered page.

---

## Contact

- Email: contact@kuber.studio
- Portfolio: https://kuber.studio/
- LinkedIn: https://www.linkedin.com/in/kubermehta/
- GitHub: https://github.com/Kuberwastaken

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
  const allProjects = extractProjectsFromSource();
  const featuredProjects = getTopProjects(allProjects, 8).map(project => formatProjectForProfileJson(project));
  
  const profileData = {
    "name": "Kuber Mehta",
    "title": "AI Developer & Full Stack Engineer",
    "age": 18,
    "location": "New Delhi, India",
    "email": "kuberhob@gmail.com",
    "website": "https://kuber.studio",
    "github": "https://github.com/Kuberwastaken",
    "linkedin": "https://www.linkedin.com/in/kubermehta/",
    "blog": "https://kuber.studio/blog/",
    "youtube": "https://www.youtube.com/@Kuberwastaken",
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
    "skills": {
      "programming_languages": [
        "Python", "JavaScript", "TypeScript", "C", "C#", ".NET", 
        "Lua", "R", "HTML", "CSS", "SCSS"
      ],
      "frameworks": [
        "React", "Next.js", "Flask", "Node.js", "Transformers.js", "TensorFlow", 
        "PyTorch", "Express", "Vite"
      ],
      "databases": ["SQL", "MongoDB", "PostgreSQL", "BigQuery"],
      "tools": [
        "Git", "Docker", "AWS", "Tableau", "LaTeX", "Gradio",
        "Jupyter", "VS Code", "Figma", "Blender"
      ],
      "specializations": [
        "Artificial Intelligence", "Machine Learning", "Multi-agent AI Systems",
        "Computer Vision", "Natural Language Processing", "Web Development",
        "Data Science", "Full Stack Development"
      ]
    },
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

  const profileJson = JSON.stringify(profileData, null, 2);
  
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

function main() {
  console.log('🔄 Updating metadata files...');
  
  try {
    updateLlmsTxt();
    updateProfileJson();
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

module.exports = { updateLlmsTxt, updateProfileJson };
