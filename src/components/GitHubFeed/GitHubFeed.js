import React, { useState, useEffect, useCallback } from 'react';
import './GitHubFeed.css';

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
  }, [fetchGitHubData, username]);

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
      PushEvent: '📤',
      CreateEvent: '✨',
      WatchEvent: '⭐',
      ForkEvent: '🍴',
      IssuesEvent: '🐛',
      PullRequestEvent: '🔀',
      ReleaseEvent: '🚀',
      PublicEvent: '🌍',
      default: '📝'
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

  const openRepository = (repoUrl) => {
    window.open(repoUrl, '_blank', 'noopener,noreferrer');
  };

  const handleUsernameChange = () => {
    if (inputUsername.trim() && inputUsername.trim() !== username) {
      setUsername(inputUsername.trim());
      setInputUsername('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUsernameChange();
    }
  };

  if (loading) {
    return (
      <div className="github-feed">
        <div className="github-header">
          <h3>⚡ GitHub Activity Feed</h3>
          <div className="loading-spinner">Loading GitHub data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="github-feed">
        <div className="github-header">
          <h3>⚡ GitHub Activity Feed</h3>
          <div className="error-message">
            <p>❌ {error}</p>
            <button onClick={fetchGitHubData} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="github-feed">
      <div className="github-header">
        <h3>⚡ GitHub Activity Feed</h3>
        <p>Live updates from <a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">@{username}</a></p>
        
        <div className="username-input">
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter GitHub username..."
            className="username-field"
          />
          <button onClick={handleUsernameChange} disabled={!inputUsername.trim()}>
            🔍 Load User
          </button>
        </div>
        
        <div className="quick-users">
          <span>Quick users: </span>
          <button onClick={() => setUsername('Kuberwastaken')} className="quick-btn">Me</button>
          <button onClick={() => setUsername('torvalds')} className="quick-btn">Linus</button>
          <button onClick={() => setUsername('gaearon')} className="quick-btn">Dan A.</button>
          <button onClick={() => setUsername('tj')} className="quick-btn">TJ</button>
        </div>
        
        {stats && (
          <div className="github-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.public_repos}</span>
              <span className="stat-label">Repos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.total_stars}</span>
              <span className="stat-label">Stars</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.following}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        )}
      </div>

      <div className="github-tabs">
        <button
          className={`tab-btn ${activeTab === 'repos' ? 'active' : ''}`}
          onClick={() => setActiveTab('repos')}
        >
          📂 Recent Repos
        </button>
        <button
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 Recent Activity
        </button>
      </div>

      <div className="github-content">
        {activeTab === 'repos' && (
          <div className="repos-list">
            {repositories.map((repo) => (
              <div key={repo.id} className="repo-item" onClick={() => openRepository(repo.html_url)}>
                <div className="repo-header">
                  <h4 className="repo-name">{repo.name}</h4>
                  <div className="repo-stats">
                    {repo.stargazers_count > 0 && (
                      <span className="repo-stat">⭐ {repo.stargazers_count}</span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="repo-stat">🍴 {repo.forks_count}</span>
                    )}
                  </div>
                </div>
                
                {repo.description && (
                  <p className="repo-description">{repo.description}</p>
                )}
                
                <div className="repo-footer">
                  {repo.language && (
                    <span className="repo-language">
                      <span className="language-dot" style={{ backgroundColor: getLanguageColor(repo.language) }}></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="repo-updated">Updated {formatDate(repo.updated_at)}</span>
                </div>
              </div>
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
          🔄 Refresh
        </button>
        <small>Auto-refreshes every 5 minutes</small>
      </div>
    </div>
  );
};

// Helper function to get language colors
const getLanguageColor = (language) => {
  const colors = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Java: '#ed8b00',
    HTML: '#e34c26',
    CSS: '#1572b6',
    React: '#61dafb',
    Vue: '#4fc08d',
    PHP: '#777bb4',
    C: '#a8b9cc',
    'C++': '#f34b7d',
    'C#': '#239120',
    Go: '#00add8',
    Rust: '#000000',
    Swift: '#fa7343',
    Kotlin: '#7f52ff',
    Dart: '#0175c2',
    Ruby: '#cc342d',
    Shell: '#89e051',
    Dockerfile: '#384d54'
  };
  return colors[language] || '#6a737d';
};

export default GitHubFeed; 