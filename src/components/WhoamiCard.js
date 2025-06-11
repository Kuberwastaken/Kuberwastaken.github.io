import React from 'react';
import '../App.css';

const WhoamiCard = () => (
  <div className="whoami-glass-card whoami-landscape">
    <div className="whoami-profile-col">
      <h3 className="whoami-title">Kuber Mehta</h3>
      {/* You can add an avatar or icon here if desired */}
    </div>
    <div className="whoami-info-col">
      <div className="whoami-section">
        <p>I'm an 18-year-old developer from New Delhi, India, currently focused on building multi-agent AI systems that push the boundaries of reliability and creativity. Here are my two main ones:</p>
      </div>
      <div className="whoami-section">
        <p><b>PolyThink</b> — <a href="https://www.polyth.ink/" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>PolyThink</a> is a multi-agent AI system that uses multiple AI models to eliminate hallucinations and provide consensus-based, accurate answers.</p>
      </div>
      <div className="whoami-section">
        <p><b>TREAT</b> — <a href="https://www.trytreat.tech/" target="_blank" rel="noopener noreferrer" style={{ color: '#5abb9a', textDecoration: 'underline' }}>TREAT</a> is an AI-powered platform for trigger recognition in movies and TV, making content more accessible and enjoyable.</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>Currently a Perplexity AI Business Fellow, I'm soon in a dual academic path with a BSc in Computer Science at BITS Pilani and a BTech in AI & Data Science at Indraprastha University. My academic focus includes programming, AI, and advanced data analysis.</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>My technical toolkit includes Python, SQL, R, and Tableau, along with hands-on experience in large language models (<span className="command-link" data-command="skills" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>Type Skills or S for more information</span>). I've applied AI to automate workflows, analyze media, and create interactive applications.</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>With over six years of 3D modeling experience, I've designed 100+ renders for gaming and virtual environments, blending technical precision with creative aesthetics.</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>I'm particularly intrigued by AI in media—especially how platforms like YouTube and TikTok refine their recommendation algorithms to shape user engagement.</p>
      </div>
      <div className="whoami-section whoami-mobile-hide">
        <p>At my core, I love experimenting, building, and pushing the boundaries of technology. If that sounds like something you're into—let's connect!</p>
      </div>
      <div className="whoami-footer">
        <p>Type <span className="command-link" data-command="github" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>github</span>, <span className="command-link" data-command="linkedin" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>linkedin</span>, or <span className="command-link" data-command="email" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>email</span> to connect with me.</p>
      </div>
    </div>
  </div>
);

export default WhoamiCard; 