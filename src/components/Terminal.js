import React, { useState, useRef, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import skillsBar from '../constants/skillsBar';
import helpContent from '../constants/helpContent';
import { showNeofetch } from '../constants/neofetchContent';
import { getAsciiArt } from '../constants/asciiSelfie';
import miscContent from '../constants/miscContent';
import gamesContent from '../constants/gamesContent';
import PDFViewer from './PDFViewer';
import HollywoodEffect from './HollywoodEffect/HollywoodEffect';
import WhoamiCard from './WhoamiCard';
import ProjectsMasonry from '../constants/projectsContent';

// Lazy load heavy game components
const Calculator = lazy(() => import('./Calculator/Calculator'));
const SnakeGame = lazy(() => import('./SnakeGame/SnakeGame'));
const TetrisGame = lazy(() => import('./TetrisGame/TetrisGame'));
const Game2048 = lazy(() => import('./Game2048/Game2048'));
const TerminalFlappyBird = lazy(() => import('./FlappyBird/TerminalFlappyBird'));
const GameOfLife = lazy(() => import('./GameOfLife/GameOfLife'));
const RickrollAnimation = lazy(() => import('./RickrollAnimation'));

// Lazy load utility components
const QRGenerator = lazy(() => import('./QRGenerator/QRGenerator'));
const PasswordGenerator = lazy(() => import('./PasswordGenerator/PasswordGenerator'));
const GitHubFeed = lazy(() => import('./GitHubFeed/GitHubFeed'));

// Memoized Levenshtein distance calculation
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i - 1][j - 1], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
};

// Memoized command similarity finder
const findSimilarCommands = (input, availableCommands) => {
  const suggestions = availableCommands
    .map(cmd => ({
      command: cmd,
      distance: levenshteinDistance(input.toLowerCase(), cmd.toLowerCase())
    }))
    .filter(({ distance }) => distance <= 2 && distance > 0)
    .sort((a, b) => a.distance - b.distance)
    .map(({ command }) => command);

  return suggestions.slice(0, 3); // Return top 3 suggestions
};

const Terminal = () => {
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [input, setInput] = useState('');
  const [hackermode, setHackermode] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const suppressAutoScrollRef = useRef(false);
  const pendingScrollOffsetRef = useRef(0);
  const lastHandledHashRef = useRef('');
  const { changeBackgroundColor, backgrounds } = useTheme();

  // Memoized available commands array
  const availableCommands = useMemo(() => [
    'help', 'skills', 's', 'github', 'gh', 'discord', 'ds', 'email', 'em',
    'youtube', 'yt', 'linkedin', 'li', 'twitter',
    'ascii-selfie', 'projects', 'pj',
    'blog', 'b', 'clear', 'c', 'games', 'g', 'who', 'w', 'wiki', 'wikipedia',
    'chatgpt', 'gpt', 'neofetch', 'nf', 'misc', 'miscellaneous', 'resume',
    'cv', 'google', 'snake', 'backdooms', 'tetris', '2048',
    'flappybird', 'gameoflife', 'time', 'date', 'background', 'theme', 'themes', 'bg',
    'color', 'calculator', 'perplexity', 'perp', 'hackermode', 'qr-generator',
    'password-generator', 'github-feed'
  ], []);

  // Memoized banners to avoid recreation on every render
  const banners = useMemo(() => ({
    large: `
 
.##....##.##.....##.########..########.########.........##.....##.########.##.....##.########....###...
.##...##..##.....##.##.....##.##.......##.....##........###...###.##.......##.....##....##......##.##..
.##..##...##.....##.##.....##.##.......##.....##........####.####.##.......##.....##....##.....##...##.
.#####....##.....##.########..######...########.........##.###.##.######...#########....##....##.....##
.##..##...##.....##.##.....##.##.......##...##..........##.....##.##.......##.....##....##....#########
.##...##..##.....##.##.....##.##.......##....##.........##.....##.##.......##.....##....##....##.....##
.##....##..#######..########..########.##.....##........##.....##.########.##.....##....##....##.....##                                                              `,
    small: `
..##....##....##.....##..
..##...##.....###...###..
..##..##......####.####..
..#####.......##.###.##..
..##..##......##.....##..
..##...##.....##.....##..
..##....##....##.....##..`
  }), []);

  // Memoized add to output function
  const addToOutput = useCallback((newEntry) => {
    setOutput(prev => {
      const updated = [...prev, newEntry];
      // Keep only the last 100 entries to prevent memory bloat
      return updated.length > 100 ? updated.slice(-100) : updated;
    });
  }, []);

  // Memoized similar commands finder
  const getSimilarCommands = useCallback((input) => {
    return findSimilarCommands(input, availableCommands);
  }, [availableCommands]);

  // Memoized command handler (defined early to avoid dependency issues)
  const handleCommand = useCallback((command) => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ');
    const argument = args.join(' ');

    // Check if command exists in availableCommands
    if (!availableCommands.includes(cmd)) {
      const suggestions = getSimilarCommands(cmd);
      if (suggestions.length > 0) {
        const suggestionLinks = suggestions
          .map(suggestion => `<span class="command-link" style="color: #5abb9a; cursor: pointer;" data-command="${suggestion}">${suggestion}</span>`)
          .join(', ');
        addToOutput({ type: 'output', content: `Command not found. Did you mean: ${suggestionLinks}?` });
        return;
      }
    }

    switch (cmd) {
      case 'skills':
      case 'sk':
      case 's':
        addToOutput({ type: 'output', content: skillsBar });
        break;
      case 'github':
      case 'gh':
        window.open('https://github.com/Kuberwastaken', '_blank');
        addToOutput({ type: 'output', content: 'Opening GitHub profile...' });
        break;
      case 'discord':
      case 'ds':
        window.open('https://discord.com/users/1296085958374068316', '_blank');
        addToOutput({ type: 'output', content: 'Opening Discord profile...' });
        break;
      case 'email':
      case 'em':
        window.open('mailto:kuberhob@gmail.com', '_blank');
        addToOutput({ type: 'output', content: 'Opening email client...' });
        break;
      case 'youtube':
      case 'yt':
        window.open('https://www.youtube.com/@Kuberwastaken', '_blank');
        addToOutput({ type: 'output', content: 'Opening YouTube channel...' });
        break;
      case 'linkedin':
      case 'li':
        window.open('https://www.linkedin.com/in/kubermehta/', '_blank');
        addToOutput({ type: 'output', content: 'Opening LinkedIn profile...' });
        break;
      case 'twitter':
        window.open('https://x.com/Kuberwastaken', '_blank');
        addToOutput({ type: 'output', content: 'I refuse to call it X lol' });
        break;
      case 'ascii-selfie':
        addToOutput({ type: 'output', content: getAsciiArt() });
        break;
      case 'projects':
      case 'pj':
        // Temporarily disable full autoscroll and request a tiny partial scroll
        suppressAutoScrollRef.current = true;
        pendingScrollOffsetRef.current = Math.round((terminalRef.current?.clientHeight || 0) * 0.8) || 450;
        addToOutput({ type: 'component', content: <ProjectsMasonry /> });
        // Re-enable autoscroll shortly after render settles
        setTimeout(() => { suppressAutoScrollRef.current = false; }, 600);
        break;
      case 'blog':
      case 'b':
        window.open('https://kuber.studio/blog/', '_blank');
        addToOutput({ type: 'output', content: 'Opening blog...' });
        break;
      case 'clear':
      case 'c':
        setOutput([]);
        break;
      case 'games':
      case 'g':
        addToOutput({ type: 'output', content: gamesContent });
        break;
      case 'help':
        addToOutput({ type: 'output', content: helpContent });
        break;
      case "neofetch":
      case "nf":
        showNeofetch(addToOutput);
        break;
      case 'misc':
      case 'miscellaneous':
        addToOutput({ type: 'output', content: miscContent });
        break;
      case 'resume':
      case 'cv':
        addToOutput({ type: 'component', content: <PDFViewer /> });
        break;
      case 'google':
        if (argument) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(argument)}`, '_blank');
          addToOutput({ type: 'output', content: `Searching Google for: ${argument}` });
        } else {
          addToOutput({ type: 'output', content: 'Please provide a search query.' });
        }
        break;
      case 'who':
      case 'w':
        addToOutput({ type: 'component', content: <WhoamiCard /> });
        break;
      case 'wiki':
      case 'wikipedia':
        if (argument) {
          window.open(`https://wikipedia.org/w/index.php?search=${encodeURIComponent(argument)}`, '_blank');
          addToOutput({ type: 'output', content: `Searching Wikipedia for: ${argument}` });
        } else {
          addToOutput({ type: 'output', content: 'Please provide a search query.' });
        }
        break;
      case 'chatgpt':
      case 'gpt':
        if (argument) {
          window.open(`https://chatgpt.com/?q=${encodeURIComponent(argument)}`, '_blank');
          addToOutput({ type: 'output', content: `Searching ChatGPT for: ${argument}` });
        } else {
          addToOutput({ type: 'output', content: 'Please provide a search query.' });
        }
        break;
      case 'perplexity':
      case 'perp':
        if (argument) {
          window.open(`https://www.perplexity.ai/?q=${encodeURIComponent(argument)}`, '_blank');
          addToOutput({ type: 'output', content: `Searching Perplexity for: ${argument}` });
        } else {
          addToOutput({ type: 'output', content: 'Please provide a search query.' });
        }
        break;
      case 'hackermode':
        setHackermode(prev => !prev);
        addToOutput({ type: 'output', content: `Hackermode ${hackermode ? 'deactivated' : 'activated'}` });
        break;
      case 'calculator':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading calculator...</div>}>
              <Calculator />
            </Suspense>
          )
        });
        break;
      case 'qr-generator':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading QR Generator...</div>}>
              <QRGenerator />
            </Suspense>
          )
        });
        break;
      case 'password-generator':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading Password Generator...</div>}>
              <PasswordGenerator />
            </Suspense>
          )
        });
        break;
      case 'github-feed':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading GitHub Feed...</div>}>
              <GitHubFeed />
            </Suspense>
          )
        });
        break;
      case 'snake':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading Snake game...</div>}>
              <SnakeGame />
            </Suspense>
          )
        });
        break;
      case 'backdooms':
      case 'thebackdooms':
        window.open('https://kuber.studio/backdooms/', '_blank');
        addToOutput({ type: 'output', content: 'Opening The Backdooms...' });
        break;
      case 'tetris':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading Tetris game...</div>}>
              <TetrisGame />
            </Suspense>
          )
        });
        break;
      case '2048':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading 2048 game...</div>}>
              <Game2048 />
            </Suspense>
          )
        });
        break;
      case 'flappybird':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading Flappy Bird game...</div>}>
              <TerminalFlappyBird />
            </Suspense>
          )
        });
        break;
      case 'gameoflife':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading Game of Life...</div>}>
              <GameOfLife />
            </Suspense>
          )
        });
        break;
      case 'secret':
        addToOutput({
          type: 'component', content: (
            <Suspense fallback={<div>Loading secret...</div>}>
              <RickrollAnimation />
            </Suspense>
          )
        });
        break;
      case 'time':
        addToOutput({ type: 'output', content: `Current Time: ${new Date().toLocaleTimeString()}` });
        break;
      case 'date':
        addToOutput({ type: 'output', content: `Current Date: ${new Date().toLocaleDateString()}` });
        break;
      case 'background':
      case 'theme':
      case 'themes':
      case 'bg':
      case 'color':
        if (argument) {
          const selectedBackground = [...backgrounds.solid, ...backgrounds.gradients].find(bg => bg.name.toLowerCase() === argument.toLowerCase());
          if (selectedBackground) {
            changeBackgroundColor(selectedBackground.value);
            addToOutput({ type: 'output', content: `Background changed to ${selectedBackground.name}` });
          } else {
            addToOutput({ type: 'output', content: 'Invalid background. Please choose from the list.' });
          }
        } else {
          const backgroundOptions = [...backgrounds.solid, ...backgrounds.gradients].map(bg => (
            `<div key="${bg.name}" style="display: inline-block; margin: 5px;">
                <div style="width: 50px; height: 50px; background: ${bg.value}; cursor: pointer;" onclick="document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: '${bg.name}' }))"></div>
              </div>`
          )).join('');
          addToOutput({ type: 'output', content: `<div style="display: flex; flex-wrap: wrap;">${backgroundOptions}</div>` });
        }
        break;
      case 'tos':
        window.open('/tos', '_blank');
        addToOutput({ type: 'output', content: 'Opening Terms of Service...' });
        break;
      default:
        addToOutput({ type: 'output', content: 'Command not found. Type "help" for a list of commands.' });
        break;
    }
    setInput(''); // Clear the input field after handling the command
  }, [availableCommands, getSimilarCommands, addToOutput, hackermode, setHackermode, backgrounds, changeBackgroundColor]);

  // Memoized command execution function
  const executeCommand = useCallback((command) => {
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    setInput('');
    handleCommand(command);
  }, [handleCommand]);

  // Memoized typing simulation function
  const simulateTyping = useCallback((command) => {
    if (!command || typeof command !== 'string') {
      console.error('Invalid command:', command);
      return;
    }

    // Clean the command string to ensure no undefined characters
    const cleanCommand = command.trim();
    if (!cleanCommand) {
      console.error('Empty command after trimming:', command);
      return;
    }

    let index = 0;
    setInput(''); // Clear input
    const interval = setInterval(() => {
      if (index < cleanCommand.length) {
        const char = cleanCommand[index];
        if (char !== undefined && char !== null) {
          setInput((prev) => prev + char); // Add each character
        }
        index++;
      } else {
        clearInterval(interval);
        executeCommand(cleanCommand);
      }
    }, 100);
  }, [executeCommand]);

  // Convert URL hash to a terminal command and auto-execute
  useEffect(() => {
    const parseHashToCommand = (hash) => {
      if (!hash) return null;
      // remove leading # or #/
      const cleaned = hash.replace(/^#\/?/, '');
      if (!cleaned) return null;
      const parts = cleaned.split('/').filter(Boolean).map(p => {
        try { return decodeURIComponent(p); } catch { return p; }
      });
      if (parts.length === 0) return null;
      const head = (parts[0] || '').toLowerCase();
      const tail = parts.slice(1);
      const joinTail = tail.join(' ');

      // Map hash paths to commands
      switch (head) {
        case 'projects':
          return 'projects';
        case 'who':
          return 'who';
        case 'help':
          return 'help';
        case 'misc':
          // e.g., #/misc/calculator -> 'calculator'
          return tail.length ? joinTail.toLowerCase() : 'misc';
        case 'games':
          // e.g., #/games/snake -> 'snake'
          return tail.length ? tail[0].toLowerCase() : 'games';
        case 'google':
        case 'youtube':
        case 'wiki':
        case 'wikipedia':
        case 'chatgpt':
        case 'perplexity':
          // e.g., #/google/hello%20world -> 'google hello world'
          return tail.length ? `${head} ${joinTail}` : head;
        case 'background':
        case 'theme':
        case 'themes':
        case 'bg':
        case 'color':
          return tail.length ? `${head} ${joinTail}` : head;
        default: {
          // Direct command passthrough if supported
          // Examples: #/resume, #/cv, #/calculator, #/snake, #/2048
          const direct = [head, ...tail].join(' ').trim();
          return direct || null;
        }
      }
    };

    const maybeRunFromHash = () => {
      const { hash } = window.location;
      if (!hash || hash === '#' || hash === lastHandledHashRef.current) return;
      const cmd = parseHashToCommand(hash);
      if (cmd && typeof cmd === 'string') {
        lastHandledHashRef.current = hash;
        // Mirror typed input line for consistency and add to history
        addToOutput({ type: 'input', content: cmd });
        executeCommand(cmd);
      }
    };

    // Run on initial load (after a microtask so React mount settles)
    Promise.resolve().then(maybeRunFromHash);
    window.addEventListener('hashchange', maybeRunFromHash);
    return () => window.removeEventListener('hashchange', maybeRunFromHash);
  }, [addToOutput, executeCommand]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const welcomeMessage = `
      <div style="margin-bottom: 20px;">
      <div class="welcome-banner">
      <pre style="color: #5abb9a;">
    ${isMobile ? banners.small : banners.large}
      </pre>
      </div>
      <div style="margin: 20px 0;">
      <p>Welcome to my personal portfolio! (Version 1.6.9)
      <p style="margin-top: 8px;">Type <span style="color: #5abb9a;">'help'</span> to see the list of available commands.</p>
      <p style="margin-top: 15px;"><span class="rgb-animation">NEW</span> try <a href="https://www.secondyou.app/" target="_blank" style="color: #5abb9a;">SecondYou</a> & <a href="https://polyth.ink" target="_blank" style="color: #5abb9a;">PolyThink</a></p>
      </div>
      </div>`;

    // Only set the welcome/help content if nothing has been printed yet.
    // This avoids overwriting deep-linked commands executed earlier in the mount cycle.
    setOutput(prev => (prev && prev.length)
      ? prev
      : [
        { type: 'output', content: welcomeMessage },
        { type: 'output', content: helpContent }
      ]
    );
    inputRef.current?.focus();

    const observer = new MutationObserver(() => {
      const el = terminalRef.current;
      if (!el) return;

      if (pendingScrollOffsetRef.current) {
        const newTop = Math.min(el.scrollHeight, el.scrollTop + pendingScrollOffsetRef.current);
        el.scrollTo({ top: newTop, behavior: 'smooth' });
        pendingScrollOffsetRef.current = 0;
        return;
      }

      if (!suppressAutoScrollRef.current) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: 'smooth'
        });
      }
    });

    if (terminalRef.current) {
      observer.observe(terminalRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [isMobile, banners.small, banners.large]);

  useEffect(() => {
    const handleCommandClick = (event) => {
      if (event.target.classList.contains('command-link')) {
        const command = event.target.getAttribute('data-command');
        if (command && command.trim()) {
          simulateTyping(command.trim());
        } else {
          console.error('Invalid command from click:', command);
        }
      }
    };

    document.addEventListener('click', handleCommandClick);

    return () => {
      document.removeEventListener('click', handleCommandClick);
    };
  }, [simulateTyping]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const command = e.target.value.trim();
      if (command) {
        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(prev => prev + 1);
        addToOutput({ type: 'input', content: command });
        handleCommand(command);
        e.target.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        setInput(commandHistory[historyIndex - 1]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(prev => prev + 1);
        setInput(commandHistory[historyIndex + 1]);
      } else {
        setHistoryIndex(commandHistory.length);
        setInput('');
      }
    }
  };

  useEffect(() => {
    const handleBackgroundSelected = (event) => {
      const selectedBackground = [...backgrounds.solid, ...backgrounds.gradients].find(bg => bg.name === event.detail);
      if (selectedBackground) {
        changeBackgroundColor(selectedBackground.value);
        addToOutput({ type: 'output', content: `Background changed to ${selectedBackground.name}` });
      }
    };

    document.addEventListener('backgroundSelected', handleBackgroundSelected);

    return () => {
      document.removeEventListener('backgroundSelected', handleBackgroundSelected);
    };
  }, [backgrounds, changeBackgroundColor, addToOutput]);

  return (
    <div id="terminal" className="terminal-container" ref={terminalRef}>
      {hackermode && <HollywoodEffect />}
      {output.map((item, index) => (
        <div key={index}>
          {item.type === 'input' ? (
            <div>
              <span className="ownerTerminal"><b>kuber@profile</b></span>
              <b>:~$</b> {item.content}
            </div>
          ) : item.type === 'component' ? (
            <div>{item.content}</div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          )}
        </div>
      ))}

      <div className="command-input">
        <span className="prompt">
          <span className="ownerTerminal"><b>kuber@profile</b></span>
          <b>:~$</b>
        </span>
        <input
          ref={inputRef}
          type="text"
          className="command-field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>
    </div>
  );
};

export default Terminal;
