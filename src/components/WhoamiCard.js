import React from 'react';
import '../App.css';
import { getAsciiArt } from '../constants/asciiSelfie';

import profileData from '../data/profile.json';

const WhoamiCard = React.memo(() => (
  <div className="whoami-glass-card whoami-landscape">
    <div className="whoami-profile-col">
      <h3 className="whoami-title">{profileData.name}</h3>
      <div
        className="whoami-mobile-hide"
        dangerouslySetInnerHTML={{ __html: getAsciiArt() }}
        style={{
          fontSize: '0.3rem',
          lineHeight: '0.4rem',
          fontFamily: "'JetBrains Mono', monospace",
          color: '#5abb9a',
          opacity: 0.7,
          overflow: 'hidden',
          maxWidth: '100%'
        }}
      />
    </div>
    <div className="whoami-info-col">
      <div className="whoami-section">
        <p>{profileData.bio.intro}</p>
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.education }} />
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.projects_highlight }} />
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.blog_highlight }} />
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.current_work }} />
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.skills_highlight }} />
      </div>
      <div className="whoami-section">
        <p>{profileData.bio.history}</p>
      </div>
      <div className="whoami-section">
        <p>{profileData.bio.fun_fact}</p>
      </div>
      <div className="whoami-section">
        <p>{profileData.bio.outro}</p>
      </div>
      <div className="whoami-footer">
        <p>Type <span className="command-link" data-command="twitter" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>twitter</span>, <span className="command-link" data-command="linkedin" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>linkedin</span>, or <span className="command-link" data-command="email" style={{ color: '#5abb9a', cursor: 'pointer', textDecoration: 'underline' }}>email</span> to connect with me.</p>
      </div>    </div>
  </div>
));

export default WhoamiCard;