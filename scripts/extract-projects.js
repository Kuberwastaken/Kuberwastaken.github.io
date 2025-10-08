#!/usr/bin/env node

/**
 * Extract project data from the React component source
 * This provides a more dynamic way to keep metadata in sync
 */

const fs = require('fs');
const path = require('path');

function extractProjectsFromSource() {
  try {
    const projectsPath = path.join(__dirname, '../src/constants/projectsContent.js');
    const content = fs.readFileSync(projectsPath, 'utf8');
    
    // Extract the projectsBase array
    const projectsMatch = content.match(/const projectsBase = \[([\s\S]*?)\];/);
    if (!projectsMatch) {
      console.warn('Could not extract projects from source');
      return [];
    }
    
    const projectsString = projectsMatch[1];
    const projects = [];
    
    // Split by project objects (looking for title: pattern)
    const projectMatches = projectsString.match(/\{[\s\S]*?title:\s*['"`]([^'"`]+)['"`][\s\S]*?\}/g);
    
    if (projectMatches) {
      projectMatches.forEach(projectStr => {
        try {
          const project = {};
          
          // Extract title
          const titleMatch = projectStr.match(/title:\s*['"`]([^'"`]+)['"`]/);
          if (titleMatch) project.title = titleMatch[1];
          
          // Extract description
          const descMatch = projectStr.match(/description:\s*['"`]([\s\S]*?)['"`]/);
          if (descMatch) {
            project.description = descMatch[1]
              .replace(/\\n/g, ' ')
              .replace(/\s+/g, ' ')
              .trim()
              .substring(0, 200); // Limit length
          }
          
          // Extract website
          const websiteMatch = projectStr.match(/website:\s*['"`]([^'"`]+)['"`]/);
          if (websiteMatch) project.website = websiteMatch[1];
          
          // Extract github
          const githubMatch = projectStr.match(/github:\s*['"`]([^'"`]+)['"`]/);
          if (githubMatch) project.github = githubMatch[1];
          
          // Extract extra (social links)
          const extraMatch = projectStr.match(/extra:\s*['"`]([^'"`]+)['"`]/);
          if (extraMatch) project.extra = extraMatch[1];
          
          if (project.title) {
            projects.push(project);
          }
        } catch (error) {
          console.warn('Error parsing project:', error.message);
        }
      });
    }
    
    return projects;
  } catch (error) {
    console.error('Error extracting projects:', error);
    return [];
  }
}

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
    formatted += ` — ${project.description}`;
  }
  
  const links = [];
  if (project.website) links.push(`Site: ${project.website}`);
  if (project.github) links.push(`GitHub: ${project.github}`);
  if (project.extra && project.extra.includes('news.ycombinator.com')) {
    links.push(`HN: ${project.extra}`);
  } else if (project.extra && project.extra.includes('x.com')) {
    links.push(`X: ${project.extra}`);
  } else if (project.extra && project.extra.includes('linkedin.com')) {
    links.push(`LinkedIn: ${project.extra}`);
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

module.exports = {
  extractProjectsFromSource,
  getTopProjects,
  formatProjectForLlmsTxt,
  formatProjectForProfileJson
};

// If run directly, output the extracted projects
if (require.main === module) {
  const projects = extractProjectsFromSource();
  console.log('Extracted projects:');
  console.log(JSON.stringify(projects, null, 2));
}
