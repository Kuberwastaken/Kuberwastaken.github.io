import React from 'react';
import '../App.css';
import AsciiDepthPortrait from './AsciiDepthPortrait';

import profileData from '../data/profile.json';

const WhoamiCard = React.memo(() => (
  <div className="whoami-glass-card whoami-landscape">
    <div className="whoami-profile-col">
      <AsciiDepthPortrait />
    </div>
    <div className="whoami-info-col">
      <div className="whoami-section">
        <p>{profileData.bio.intro}</p>
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.projects_highlight }} />
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.education }} />
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.blog_highlight }} />
      </div>
      <div className="whoami-section">
        <p>{profileData.bio.history}</p>
      </div>
      <div className="whoami-section">
        <p>{profileData.bio.fun_fact}</p>
      </div>
      <div className="whoami-section">
        <p dangerouslySetInnerHTML={{ __html: profileData.bio.outro }} />
      </div>
    </div>
  </div>
));

export default WhoamiCard;
