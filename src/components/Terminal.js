import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PDFViewer from './PDFViewer';
import HollywoodEffect from './HollywoodEffect/HollywoodEffect';
import WhoamiCard from './WhoamiCard';
import ProjectsTerminal from '../constants/projectsContent';
import TuiBrandMark from './Tui/TuiBrand';
import { GamesPanel, HelpPanel, MiscPanel, SkillsPanel, WelcomePanel } from './Tui/TuiPanels';
import { AsciiSelfie, SystemProfile } from './Tui/TuiOddities';

const Calculator = lazy(() => import('./Calculator/Calculator'));
const SnakeGame = lazy(() => import('./SnakeGame/SnakeGame'));
const TetrisGame = lazy(() => import('./TetrisGame/TetrisGame'));
const GameOfLife = lazy(() => import('./GameOfLife/GameOfLife'));
const RickrollAnimation = lazy(() => import('./RickrollAnimation'));
const QRGenerator = lazy(() => import('./QRGenerator/QRGenerator'));
const PasswordGenerator = lazy(() => import('./PasswordGenerator/PasswordGenerator'));
const GitHubFeed = lazy(() => import('./GitHubFeed/GitHubFeed'));

const INITIAL_OUTPUT = [
  { type: 'component', content: <WelcomePanel /> },
  { type: 'component', content: <HelpPanel /> }
];

const levenshteinDistance = (left, right) => {
  const rows = left.length + 1;
  const columns = right.length + 1;
  const distances = Array.from({ length: rows }, () => Array(columns).fill(0));

  for (let row = 0; row < rows; row += 1) distances[row][0] = row;
  for (let column = 0; column < columns; column += 1) distances[0][column] = column;

  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      distances[row][column] = left[row - 1] === right[column - 1]
        ? distances[row - 1][column - 1]
        : 1 + Math.min(
          distances[row - 1][column],
          distances[row][column - 1],
          distances[row - 1][column - 1]
        );
    }
  }

  return distances[left.length][right.length];
};

const LazyView = ({ label, children }) => (
  <Suspense fallback={<div className="tui-loading">Loading {label}…</div>}>
    {children}
  </Suspense>
);

const TuiTopbar = () => (
  <header className="tui-topbar">
    <div className="tui-topbar-inner">
      <div className="tui-brand-lockup">
        <TuiBrandMark />
        <span className="tui-brand-copy">
          <span className="tui-brand-name">Kuber Mehta</span>
          <span className="tui-brand-path">KM · ~/portfolio</span>
        </span>
      </div>
      <nav className="tui-nav" aria-label="Primary commands">
        {['who', 'projects', 'skills', 'blog', 'games', 'misc'].map(command => (
          <button key={command} type="button" className="command-link" data-command={command}>
            /{command}
          </button>
        ))}
      </nav>
      <div className="tui-topbar-status" aria-label="Portfolio status">
        <span className="tui-status-dot" aria-hidden="true" />
        <span>session ready</span>
        <span>·</span>
        <span>v2.0.0</span>
      </div>
    </div>
  </header>
);

const Terminal = () => {
  const [output, setOutput] = useState(INITIAL_OUTPUT);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [input, setInput] = useState('');
  const [hackermode, setHackermode] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const lastHandledHashRef = useRef('');
  const hasMountedRef = useRef(false);

  const availableCommands = useMemo(() => [
    'help', 'skills', 'sk', 's', 'github', 'gh', 'discord', 'ds', 'email', 'em',
    'youtube', 'yt', 'linkedin', 'li', 'twitter', 'ascii-selfie', 'projects', 'pj',
    'blog', 'b', 'clear', 'c', 'games', 'g', 'who', 'w', 'wiki', 'wikipedia',
    'chatgpt', 'gpt', 'neofetch', 'nf', 'misc', 'miscellaneous', 'resume', 'cv',
    'google', 'snake', 'backdooms', 'thebackdooms', 'tetris', 'gameoflife', 'time',
    'date', 'calculator', 'perplexity', 'perp', 'hackermode', 'qr-generator',
    'password-generator', 'github-feed', 'secret', 'tos', 'rm', 'sudo'
  ], []);

  const addToOutput = useCallback((entry) => {
    setOutput(previous => {
      const next = [...previous, entry];
      return next.length > 100 ? next.slice(-100) : next;
    });
  }, []);

  const addMessage = useCallback((content, tone = 'normal') => {
    addToOutput({ type: 'message', content, tone });
  }, [addToOutput]);

  const handleCommand = useCallback((command) => {
    const [rawCommand, ...args] = command.trim().split(' ');
    const cmd = rawCommand.toLowerCase();
    const argument = args.join(' ').trim();

    if (!availableCommands.includes(cmd)) {
      const suggestions = availableCommands
        .map(candidate => ({
          command: candidate,
          distance: levenshteinDistance(cmd, candidate)
        }))
        .filter(({ distance }) => distance > 0 && distance <= 2)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3)
        .map(({ command: candidate }) => candidate);

      addToOutput({ type: 'suggestions', content: suggestions, attempted: cmd });
      return;
    }

    switch (cmd) {
      case 'help':
        addToOutput({ type: 'component', content: <HelpPanel /> });
        break;
      case 'skills':
      case 'sk':
      case 's':
        addToOutput({ type: 'component', content: <SkillsPanel /> });
        break;
      case 'who':
      case 'w':
        addToOutput({ type: 'component', content: <WhoamiCard /> });
        break;
      case 'projects':
      case 'pj':
        addToOutput({ type: 'component', content: <ProjectsTerminal /> });
        break;
      case 'games':
      case 'g':
        addToOutput({ type: 'component', content: <GamesPanel /> });
        break;
      case 'misc':
      case 'miscellaneous':
        addToOutput({ type: 'component', content: <MiscPanel /> });
        break;
      case 'github':
      case 'gh':
        window.open('https://github.com/Kuberwastaken', '_blank', 'noopener,noreferrer');
        addMessage('Opened github.com/Kuberwastaken.');
        break;
      case 'discord':
      case 'ds':
        window.open('https://discord.com/users/1296085958374068316', '_blank', 'noopener,noreferrer');
        addMessage('Opened Discord profile.');
        break;
      case 'email':
      case 'em':
        window.location.href = 'mailto:kuberhob@gmail.com';
        addMessage('Opened mailto:kuberhob@gmail.com.');
        break;
      case 'youtube':
      case 'yt':
        window.open(
          argument
            ? `https://www.youtube.com/results?search_query=${encodeURIComponent(argument)}`
            : 'https://www.youtube.com/@Kuberwastaken',
          '_blank',
          'noopener,noreferrer'
        );
        addMessage(argument ? `Searching YouTube for “${argument}”.` : 'Opened YouTube profile.');
        break;
      case 'linkedin':
      case 'li':
        window.open('https://www.linkedin.com/in/kubermehta/', '_blank', 'noopener,noreferrer');
        addMessage('Opened LinkedIn profile.');
        break;
      case 'twitter':
        window.open('https://x.com/Kuberwastaken', '_blank', 'noopener,noreferrer');
        addMessage('Opened Twitter. I still refuse to call it X.');
        break;
      case 'blog':
      case 'b':
        window.open('https://kuber.studio/blog/', '_blank', 'noopener,noreferrer');
        addMessage('Opened MindDump.');
        break;
      case 'resume':
      case 'cv':
        addToOutput({ type: 'component', content: <PDFViewer /> });
        break;
      case 'google':
        if (!argument) addMessage('Usage: google <query>', 'warning');
        else {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(argument)}`, '_blank', 'noopener,noreferrer');
          addMessage(`Searching Google for “${argument}”.`);
        }
        break;
      case 'wiki':
      case 'wikipedia':
        if (!argument) addMessage('Usage: wiki <query>', 'warning');
        else {
          window.open(`https://wikipedia.org/w/index.php?search=${encodeURIComponent(argument)}`, '_blank', 'noopener,noreferrer');
          addMessage(`Searching Wikipedia for “${argument}”.`);
        }
        break;
      case 'chatgpt':
      case 'gpt':
        if (!argument) addMessage('Usage: chatgpt <query>', 'warning');
        else {
          window.open(`https://chatgpt.com/?q=${encodeURIComponent(argument)}`, '_blank', 'noopener,noreferrer');
          addMessage(`Opening ChatGPT with “${argument}”.`);
        }
        break;
      case 'perplexity':
      case 'perp':
        if (!argument) addMessage('Usage: perplexity <query>', 'warning');
        else {
          window.open(`https://www.perplexity.ai/?q=${encodeURIComponent(argument)}`, '_blank', 'noopener,noreferrer');
          addMessage(`Opening Perplexity with “${argument}”.`);
        }
        break;
      case 'ascii-selfie':
        addToOutput({ type: 'component', content: <AsciiSelfie /> });
        break;
      case 'neofetch':
      case 'nf':
        addToOutput({ type: 'component', content: <SystemProfile /> });
        break;
      case 'calculator':
        addToOutput({ type: 'component', content: <LazyView label="calculator"><Calculator /></LazyView> });
        break;
      case 'qr-generator':
        addToOutput({ type: 'component', content: <LazyView label="QR generator"><QRGenerator /></LazyView> });
        break;
      case 'password-generator':
        addToOutput({ type: 'component', content: <LazyView label="password generator"><PasswordGenerator /></LazyView> });
        break;
      case 'github-feed':
        addToOutput({ type: 'component', content: <LazyView label="GitHub feed"><GitHubFeed /></LazyView> });
        break;
      case 'snake':
        addToOutput({ type: 'component', content: <LazyView label="Snake"><SnakeGame /></LazyView> });
        break;
      case 'tetris':
        addToOutput({ type: 'component', content: <LazyView label="Tetris"><TetrisGame /></LazyView> });
        break;
      case 'gameoflife':
        addToOutput({ type: 'component', content: <LazyView label="Game of Life"><GameOfLife /></LazyView> });
        break;
      case 'backdooms':
      case 'thebackdooms':
        window.open('https://kuber.studio/backdooms/', '_blank', 'noopener,noreferrer');
        addMessage('Opened The Backdooms in a new tab.');
        break;
      case 'secret':
        addToOutput({ type: 'component', content: <LazyView label="classified output"><RickrollAnimation /></LazyView> });
        break;
      case 'time':
        addMessage(new Date().toLocaleTimeString());
        break;
      case 'date':
        addMessage(new Date().toLocaleDateString());
        break;
      case 'hackermode':
        setHackermode(active => !active);
        addMessage(`Matrix overlay ${hackermode ? 'disabled' : 'enabled'}.`);
        break;
      case 'tos':
        window.open('/tos', '_blank', 'noopener,noreferrer');
        addMessage('Opened Terms of Service.');
        break;
      case 'rm':
      case 'sudo':
        if (command.toLowerCase().includes('rm -rf /')) {
          setHackermode(true);
          addMessage('Permission denied: this portfolio is mounted read-only. Nice try.', 'warning');
        } else {
          addMessage(`${cmd}: command not found`, 'error');
        }
        break;
      case 'clear':
      case 'c':
        setOutput([]);
        break;
      default:
        addMessage('Command not found. Run /help for the command directory.', 'error');
    }
  }, [addMessage, addToOutput, availableCommands, hackermode]);

  const executeCommand = useCallback((command) => {
    const cleanCommand = command.trim();
    if (!cleanCommand) return;

    setCommandHistory(previous => {
      const next = [...previous, cleanCommand];
      setHistoryIndex(next.length);
      return next;
    });
    setInput('');
    addToOutput({ type: 'input', content: cleanCommand });
    handleCommand(cleanCommand);
  }, [addToOutput, handleCommand]);

  const handleSubmit = (event) => {
    event.preventDefault();
    executeCommand(input);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!commandHistory.length) return;
      const nextIndex = Math.max(0, Math.min(historyIndex - 1, commandHistory.length - 1));
      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!commandHistory.length) return;
      const nextIndex = Math.min(commandHistory.length, historyIndex + 1);
      setHistoryIndex(nextIndex);
      setInput(nextIndex === commandHistory.length ? '' : commandHistory[nextIndex]);
    }
  };

  useEffect(() => {
    const handleCommandClick = (event) => {
      const target = event.target.closest('.command-link[data-command]');
      if (!target) return;
      const command = target.getAttribute('data-command');
      if (command) executeCommand(command);
    };

    document.addEventListener('click', handleCommandClick);
    return () => document.removeEventListener('click', handleCommandClick);
  }, [executeCommand]);

  useEffect(() => {
    const parseHashToCommand = (hash) => {
      const cleaned = hash.replace(/^#\/?/, '');
      if (!cleaned) return null;
      const parts = cleaned.split('/').filter(Boolean).map(part => {
        try {
          return decodeURIComponent(part);
        } catch {
          return part;
        }
      });
      if (!parts.length) return null;
      const [head, ...tail] = parts;
      const command = head.toLowerCase();
      if (['misc', 'games'].includes(command) && tail.length) return tail[0].toLowerCase();
      if (['google', 'youtube', 'wiki', 'wikipedia', 'chatgpt', 'perplexity'].includes(command) && tail.length) {
        return `${command} ${tail.join(' ')}`;
      }
      return [command, ...tail].join(' ').trim();
    };

    const executeHash = () => {
      const { hash } = window.location;
      if (!hash || hash === '#' || hash === lastHandledHashRef.current) return;
      const command = parseHashToCommand(hash);
      if (!command) return;
      lastHandledHashRef.current = hash;
      executeCommand(command);
    };

    Promise.resolve().then(executeHash);
    window.addEventListener('hashchange', executeHash);
    return () => window.removeEventListener('hashchange', executeHash);
  }, [executeCommand]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    const scroller = terminalRef.current;
    if (!scroller) return;
    const lastTurn = scroller.querySelector('.tui-turn:last-child');
    window.requestAnimationFrame(() => {
      lastTurn?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="tui-shell">
      {hackermode && <HollywoodEffect />}
      <TuiTopbar />

      <main id="terminal" className="tui-scroll-region" ref={terminalRef} aria-live="polite">
        <div className="tui-transcript">
          {output.map((item, index) => (
            <div className={`tui-turn tui-turn-${item.type}`} key={`${item.type}-${index}`}>
              {item.type === 'input' && (
                <div className="tui-user-turn">
                  <span className="tui-user-chevron" aria-hidden="true">❯</span>
                  <span className="tui-user-command">{item.content}</span>
                </div>
              )}
              {item.type === 'component' && item.content}
              {item.type === 'message' && (
                <div className={`tui-output-line tui-output-${item.tone || 'normal'}`}>
                  <div>{item.content}</div>
                </div>
              )}
              {item.type === 'suggestions' && (
                <div className="tui-output-line tui-output-error">
                  <div>
                    command not found: {item.attempted}
                    {item.content.length > 0 && (
                      <span> · try {item.content.map((suggestion, suggestionIndex) => (
                        <React.Fragment key={suggestion}>
                          {suggestionIndex > 0 && ', '}
                          <button type="button" className="command-link tui-inline-command" data-command={suggestion}>/{suggestion}</button>
                        </React.Fragment>
                      ))}</span>
                    )}
                  </div>
                </div>
              )}
              {item.type === 'output' && (
                <div className="tui-output-line">
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <form className="tui-composer" onSubmit={handleSubmit}>
        <div className="tui-composer-inner">
          <div className="tui-effort-line">◈ portfolio · custom Claude harness</div>
          <label className="tui-prompt-rule">
            <span className="tui-prompt-symbol" aria-hidden="true">❯</span>
            <span className="sr-only">Portfolio command</span>
            <input
              ref={inputRef}
              type="text"
              className="command-field"
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Try /who, /projects, or /help"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="Portfolio command"
            />
          </label>
          <div className="tui-mode-line">
            <span className="tui-mode-glyph">⏵⏵ </span>
            <span className="tui-mode-active">explore mode on</span>
            <span> · enter to run · ↑↓ history · tap commands anywhere</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Terminal;
