import React from 'react';
import '../App.css';

const WhoamiCard = React.memo(() => (
  <div className="whoami-glass-card whoami-landscape">
    <div className="whoami-profile-col">
      <h3 className="whoami-title">Kuber Mehta</h3>
      {/* You can add an avatar or icon here if desired */}
    </div>
    <div className="whoami-info-col">
      <div className="whoami-section">
        <p>Hey! I'm an 18 year old AI dev & Tech Enthusiast from New Delhi, India</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>I'm doing two degrees - Computer Science from BITS Pilani and AI & Data Science from Indraprastha University and run <a href="https://www.polyth.ink/" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>PolyThink</a> and <a href="https://www.trytreat.tech/" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>TREAT AI</a>.</p>
      </div>
      <div className="whoami-section">
        <p>I've built and shipped 40+ projects (28+ AI Based) in the past year, run <span className="command-link" data-command="projects" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>Projects</span> to see some of my favourites (that I'm allowed to show)</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>Currently, I'm trying to democratize SLMs with superior context for non-intensive (over 70%) AI usage, <a href="https://x.com/kuberwastaken/status/1972594854715961570" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>check this tweet for more information</a>.</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>I design agentic LLM pipelines, post-train models, optimise local RAG systems and play around with resource constrained projects like <a href="https://github.com/kuberwastaken/backdooms" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>The Backdooms</a> and <a href="https://minilms.kuber.studio/" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>MiniLMs</a>, but to know more about the languages and tools I know run <span className="command-link" data-command="skills" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>Skills</span> </p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>Previously: Business Fellow @ Perplexity, AI Summer Resident @ Nas Daily (Dubai), Virtual Intern @ JP Morgan Chase, AI Agents Websocket Framework LEAD Intern @ HTMX</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>Fun Fact: I started programming when I was 12 by making games on roblox and became a Roblox millionaire at 14, at 16 I got into 3D modelling semi-early and won India's biggest 3D modelling contest, before going all-in into AI at 17</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>At my core, I love making (and breaking) things and new AI apps are like Christmas morning presents to me, If that sounds like something you're into, let's talk!</p>
      </div>
      <div className="whoami-footer">
        <p>Type <span className="command-link" data-command="github" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>github</span>, <span className="command-link" data-command="linkedin" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>linkedin</span>, or <span className="command-link" data-command="email" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>email</span> to connect with me.</p>
      </div>    </div>
  </div>
));

export default WhoamiCard;