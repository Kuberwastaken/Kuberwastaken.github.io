import React, { useEffect, useMemo, useState } from 'react';
import updates from '../data/siteUpdates.json';
import './UpdateTicker.css';

// Self-maintained status line: cycles the latest site updates.
// Content lives in src/data/siteUpdates.json and is refreshed whenever
// something ships (see SITE-CHANGELOG.md).
const UpdateTicker = () => {
  const items = useMemo(() => (Array.isArray(updates) ? updates.slice(0, 6) : []), []);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (items.length < 2) return undefined;
    const t = setInterval(() => setIdx(i => (i + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;
  const current = items[idx];

  return (
    <a
      className="update-ticker"
      href="https://github.com/Kuberwastaken/Kuberwastaken.github.io/blob/main/SITE-CHANGELOG.md"
      target="_blank"
      rel="noopener noreferrer"
      title="Running log of changes to this site"
    >
      <span className="ticker-label">live</span>
      <span key={idx} className="ticker-text">
        [{current.date}] {current.text}
      </span>
      <span className="ticker-cursor">&#9608;</span>
    </a>
  );
};

export default UpdateTicker;
