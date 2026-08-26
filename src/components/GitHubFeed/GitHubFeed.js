import React, { useState, useEffect, useCallback } from 'react';

const GitHubFeed = () => {
  const [repositories, setRepositories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('repos');
  const [stats, setStats] = useState(null);
  const [username, setUsername] = useState('Kuberwastaken');
  const [inputUsername, setInputUsername] = useState('');

  const fetchGitHubData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [reposResponse, eventsResponse, userResponse] = await Promise.all([
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`),
        fetch(`https://api.github.com/users/${username}/events?per_page=15`),
        fetch(`https://api.github.com/users/${username}`)
      ]);

      if (!reposResponse.ok || !eventsResponse.ok || !userResponse.ok) {
        throw new Error('Failed to fetch GitHub data');
      }

      const [reposData, eventsData, userData] = await Promise.all([
        reposResponse.json(),
        eventsResponse.json(),
        userResponse.json()
      ]);

      setRepositories(reposData);
      setEvents(eventsData.slice(0, 10)); // Limit to 10 recent events
      setStats({
        public_repos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
        total_stars: reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0)
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchGitHubData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchGitHubData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const getEventIcon = (type) => {
    const iconMap = {
      PushEvent: '↑',
      CreateEvent: '+',
      WatchEvent: '★',
      ForkEvent: '⑂',
      IssuesEvent: '!',
      PullRequestEvent: '↗',
      ReleaseEvent: '◆',
      PublicEvent: '○',
      default: '·'
    };
    return iconMap[type] || iconMap.default;
  };

  const getEventDescription = (event) => {
    switch (event.type) {
      case 'PushEvent':
        const commits = event.payload.commits?.length || 0;
        return `Pushed ${commits} commit${commits !== 1 ? 's' : ''} to ${event.repo.name}`;
      case 'CreateEvent':
        return `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${event.repo.name}`;
      case 'WatchEvent':
        return `Starred ${event.repo.name}`;
      case 'ForkEvent':
        return `Forked ${event.repo.name}`;
      case 'IssuesEvent':
        return `${event.payload.action} issue in ${event.repo.name}`;
      case 'PullRequestEvent':
        return `${event.payload.action} pull request in ${event.repo.name}`;
      case 'ReleaseEvent':
        return `Released ${event.payload.release?.tag_name} in ${event.repo.name}`;
      case 'PublicEvent':
        return `Made ${event.repo.name} public`;
      default:
        return `Activity in ${event.repo.name}`;
    }
  };

  const handleUsernameChange = () => {
    if (inputUsername.trim() && inputUsername.trim() !== username) {
      setUsername(inputUsername.trim());
      setInputUsername('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleUsernameChange();
    }
  };

  if (loading) {
    return (
      <section className="tui-tool github-feed">
        <div className="tui-tool-titlebar"><strong>/github-feed</strong><span>loading</span></div>
        <div className="github-header">
          <h3>GitHub activity</h3>
          <div className="loading-spinner">Fetching public data…</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="tui-tool github-feed">
        <div className="tui-tool-titlebar"><strong>/github-feed</strong><span>request failed</span></div>
        <div className="github-header">
          <h3>GitHub activity</h3>
          <div className="error-message">
            <p>error: {error}</p>
            <button onClick={fetchGitHubData} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="tui-tool github-feed">
      <div className="tui-tool-titlebar">
        <strong>/github-feed</strong>
        <span>api.github.com · public</span>
      </div>
      <div className="github-header">
        <h3>GitHub activity</h3>
        <p>Live updates from <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">@{username}</a></p>
        
        <div className="username-input">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="github username"
            className="username-field"
          />
          <button onClick={handleUsernameChange} disabled={!inputUsername.trim()}>
            Load user
          </button>
        </div>
        
        <div className="quick-users">
          <span>presets </span>
          <button onClick={() => setUsername('Kuberwastaken')} className="quick-btn">kuber</button>
          <button onClick={() => setUsername('torvalds')} className="quick-btn">torvalds</button>
          <button onClick={() => setUsername('gaearon')} className="quick-btn">gaearon</button>
          <button onClick={() => setUsername('tj')} className="quick-btn">tj</button>
        </div>
        
        {stats && (
          <div className="github-stats">
            <span>repos <strong>{stats.public_repos}</strong></span>
            <span>stars <strong>{stats.total_stars}</strong></span>
            <span>followers <strong>{stats.followers}</strong></span>
            <span>following <strong>{stats.following}</strong></span>
          </div>
        )}
      </div>

      <div className="github-tabs">
        <button
          className={`tab-btn ${activeTab === 'repos' ? 'active' : ''}`}
          onClick={() => setActiveTab('repos')}
        >
          [ repositories ]
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          [ activity ]
        </button>
      </div>

      <div className="github-content">
        {activeTab === 'repos' && (
          <div className="repos-list">
            {repositories.map((repo) => (
              <a key={repo.id} className="repo-item" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                <div className="repo-header">
                  <h4 className="repo-name">{repo.name}</h4>
                  <div className="repo-stats">
                    {repo.stargazers_count > 0 && (
                      <span className="repo-stat">★ {repo.stargazers_count}</span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="repo-stat">⑂ {repo.forks_count}</span>
                    )}
                  </div>
                </div>
                
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}
                
                <div className="repo-footer">
                  {repo.language && (
                    <span className="repo-language">
                      <span className="language-dot" />
                      {repo.language}
                    </span>
                  )}
                  <span className="repo-updated">Updated {formatDate(repo.updated_at)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="activity-list">
            {events.map((event, index) => (
              <div key={`${event.id}-${index}`} className="activity-item">
                <div className="activity-icon">{getEventIcon(event.type)}</div>
                <div className="activity-content">
                  <p className="activity-description">{getEventDescription(event)}</p>
                  <span className="activity-time">{formatDate(event.created_at)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="github-footer">
        <button onClick={fetchGitHubData} className="refresh-btn">
          Refresh
        </button>
        <small>Auto-refreshes every 5 minutes</small>
      </div>
    </section>
  );
};

export default GitHubFeed;
