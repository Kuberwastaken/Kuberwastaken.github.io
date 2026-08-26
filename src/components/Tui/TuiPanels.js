import React from 'react';
import profileData from '../../data/profile.json';
import TuiBrandMark from './TuiBrand';

const CommandButton = ({ command, label = command, description }) => (
  <button type="button" className="command-link tui-command-row" data-command={command}>
    <span className="tui-command-name">/{label}</span>
    {description && <span className="tui-command-description">{description}</span>}
  </button>
);

export const TuiPanel = ({ title, meta, className = '', children }) => (
  <fieldset className={`tui-panel ${className}`.trim()}>
    <legend>
      <span>{title}</span>
      {meta && <span className="tui-panel-meta">{meta}</span>}
    </legend>
    {children}
  </fieldset>
);

export const WelcomePanel = () => (
  <TuiPanel title="Kuber CLI" meta="v2.0.0" className="tui-welcome-panel">
    <div className="tui-welcome-grid">
      <div className="tui-welcome-identity">
        <p className="tui-bright">Welcome to Kuber Mehta's portfolio.</p>
        <TuiBrandMark scale={4.2} className="tui-welcome-mark" />
        <div className="tui-muted tui-welcome-meta">
          <span>AI developer · builder · breaker</span>
          <span>New Delhi, India</span>
          <span>~/kuber.studio</span>
        </div>
      </div>
      <div className="tui-welcome-actions">
        <p className="tui-section-label">Start here</p>
        <CommandButton command="who" description="identity and current work" />
        <CommandButton command="projects" description="selected sidequests" />
        <CommandButton command="skills" description="languages and technologies" />
        <div className="tui-rule" />
        <p className="tui-section-label">Recently shipped</p>
        <a href="https://github.com/Kuberwastaken/claurst" target="_blank" rel="noopener noreferrer" className="tui-inline-link">Claurst — Claude Code, ported to Rust ↗</a>
        <a href="https://polyth.ink" target="_blank" rel="noopener noreferrer" className="tui-inline-link">PolyThink — multi-agent research systems ↗</a>
      </div>
    </div>
  </TuiPanel>
);

const commandGroups = [
  {
    title: 'portfolio',
    items: [
      ['who', 'identity and biography'],
      ['projects', 'all shipped sidequests'],
      ['skills', 'languages and technologies'],
      ['resume', 'open the latest résumé'],
      ['blog', 'open MindDump']
    ]
  },
  {
    title: 'playground',
    items: [
      ['games', 'terminal-native games'],
      ['misc', 'utilities and experiments'],
      ['neofetch', 'system profile'],
      ['clear', 'clear this session']
    ]
  },
  {
    title: 'contact',
    items: [
      ['github', 'github.com/Kuberwastaken'],
      ['twitter', 'x.com/Kuberwastaken'],
      ['linkedin', 'linkedin.com/in/kubermehta'],
      ['email', 'kuberhob@gmail.com']
    ]
  }
];

export const HelpPanel = () => (
  <TuiPanel title="/help" meta="command directory">
    <div className="tui-command-groups">
      {commandGroups.map(group => (
        <section className="tui-command-group" key={group.title}>
          <p className="tui-section-label">{group.title}</p>
          {group.items.map(([command, description]) => (
            <CommandButton key={command} command={command} description={description} />
          ))}
        </section>
      ))}
    </div>
  </TuiPanel>
);

export const SkillsPanel = () => (
  <TuiPanel title="/skills" meta={`${Object.values(profileData.skills).flat().length} loaded`}>
    <div className="tui-skills-grid">
      {Object.entries(profileData.skills).map(([category, skills]) => (
        <section className="tui-skill-group" key={category}>
          <div className="tui-skill-heading">
            <span>{category}</span>
            <span>{String(skills.length).padStart(2, '0')}</span>
          </div>
          <ol className="tui-skill-list">
            {skills.map((skill, index) => (
              <li key={skill.name}>
                <span className="tui-row-index">{String(index + 1).padStart(2, '0')}</span>
                <span className="tui-skill-name">{skill.name}</span>
                <span className="tui-skill-description">{skill.desc}</span>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  </TuiPanel>
);

export const GamesPanel = () => (
  <TuiPanel title="/games" meta="3 available">
    <div className="tui-list-view">
      <CommandButton command="snake" description="arrow keys · tap zones on mobile" />
      <CommandButton command="tetris" description="arrows to move · up to rotate" />
      <CommandButton command="gameoflife" description="seed and evolve a cellular world" />
      <a href="https://kuber.studio/backdooms/" target="_blank" rel="noopener noreferrer" className="tui-command-row tui-external-row">
        <span className="tui-command-name">/backdooms</span>
        <span className="tui-command-description">open the 2.4kB game ↗</span>
      </a>
    </div>
  </TuiPanel>
);

export const MiscPanel = () => (
  <TuiPanel title="/misc" meta="utilities">
    <div className="tui-command-groups tui-command-groups-two">
      <section className="tui-command-group">
        <p className="tui-section-label">local tools</p>
        <CommandButton command="calculator" description="expression evaluator" />
        <CommandButton command="qr-generator" description="text and URL encoder" />
        <CommandButton command="password-generator" description="cryptographic password generator" />
        <CommandButton command="github-feed" description="live public GitHub activity" />
      </section>
      <section className="tui-command-group">
        <p className="tui-section-label">oddities</p>
        <CommandButton command="ascii-selfie" description="the original full ASCII render" />
        <CommandButton command="neofetch" description="totally accurate system information" />
        <CommandButton command="hackermode" description="matrix overlay" />
        <CommandButton command="secret" description="classified" />
      </section>
    </div>
  </TuiPanel>
);

export { CommandButton };
