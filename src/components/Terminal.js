import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import skillsBar from '../constants/skillsBar';
import projectsContent from '../constants/projectsContent';
import helpContent from '../constants/helpContent';
import { showNeofetch } from '../constants/neofetchContent';
import { getAsciiArt } from '../constants/asciiSelfie';
import miscContent from '../constants/miscContent';
import PDFViewer from './PDFViewer';
import HollywoodEffect from './HollywoodEffect/HollywoodEffect';
import gamesContent from '../constants/gamesContent';
import Calculator from './Calculator/Calculator';
import SnakeGame from './SnakeGame/SnakeGame';
import TetrisGame from './TetrisGame/TetrisGame';
import Game2048 from './Game2048/Game2048';
import TerminalFlappyBird from './FlappyBird/TerminalFlappyBird';

const Terminal = () => {
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState('');
  const [hackermode, setHackermode] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const { theme, changeBackgroundColor, backgrounds } = useTheme();

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
    const largeBanner = `
 
.##....##.##.....##.########..########.########.........##.....##.########.##.....##.########....###...
.##...##..##.....##.##.....##.##.......##.....##........###...###.##.......##.....##....##......##.##..
.##..##...##.....##.##.....##.##.......##.....##........####.####.##.......##.....##....##.....##...##.
.#####....##.....##.########..######...########.........##.###.##.######...#########....##....##.....##
.##..##...##.....##.##.....##.##.......##...##..........##.....##.##.......##.....##....##....#########
.##...##..##.....##.##.....##.##.......##....##.........##.....##.##.......##.....##....##....##.....##
.##....##..#######..########..########.##.....##........##.....##.########.##.....##....##....##.....##                                                              `;

const smallBanner = `
..##....##....##.....##..
..##...##.....###...###..
..##..##......####.####..
..#####.......##.###.##..
..##..##......##.....##..
..##...##.....##.....##..
..##....##....##.....##..`;

    const welcomeMessage = `
      <div style="margin-bottom: 20px;">
      <div class="welcome-banner">
        <pre style="color: #5abb9a;">
  ${isMobile ? smallBanner : largeBanner}
        </pre>
      </div>
      <div style="margin: 20px 0;">
        <p>Welcome to my personal portfolio! (Version 1.6.9)
        <p style="margin-top: 8px;">Type <span style="color: #5abb9a;">'help'</span> to see the list of available commands.</p>
        <p style="margin-top: 15px;"><span class="rgb-animation">NEW</span> try <a href="https://trytreat.tech/" target="_blank" style="color: #5abb9a;">TREAT Web!</a></p>
      </div>
      </div>`;

    setOutput([
      { type: 'output', content: welcomeMessage },
      { type: 'output', content: helpContent }
    ]);
    inputRef.current?.focus();

    const observer = new MutationObserver(() => {
      if (terminalRef.current) {
        terminalRef.current.scrollTo({
          top: terminalRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    });

    if (terminalRef.current) {
      observer.observe(terminalRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    const handleCommandClick = (event) => {
      if (event.target.classList.contains('command-link')) {
        const command = event.target.getAttribute('data-command');
        simulateTyping(command);
      }
    };

    document.addEventListener('click', handleCommandClick);

    return () => {
      document.removeEventListener('click', handleCommandClick);
    };
  }, []);

  const simulateTyping = (command) => {
    let index = 0;
    setInput('');
    const interval = setInterval(() => {
      if (index < command.length) {
        setInput((prev) => prev + command[index]);
        index++;
      } else {
        clearInterval(interval);
        executeCommand(command);
      }
    }, 100);
  };

  const executeCommand = (command) => {
    setCommandHistory([...commandHistory, command]);
    setHistoryIndex(-1);
    setInput('');
    handleCommand(command);
  };

  const handleCommand = (command) => {
    const [cmd, ...args] = command.toLowerCase().trim().split(' ');
    const argument = args.join(' ');

    switch (cmd) {
      case 'skills':
      case 's':
        setOutput(prev => [...prev, { type: 'output', content: skillsBar }]);
        break;
      case 'github':
      case 'gh':
        window.open('https://github.com/Kuberwastaken', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening GitHub profile...' }]);
        break;
      case 'discord':
      case 'ds':
        window.open('https://discord.com/users/1296085958374068316', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening Discord profile...' }]);
        break;
      case 'email':
      case 'em':
        window.open('mailto:kuberhob@gmail.com', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening email client...' }]);
        break;
      case 'youtube':
      case 'yt':
        window.open('https://www.youtube.com/@Kuberwastaken', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening YouTube channel...' }]);
        break;
      case 'linkedin':
      case 'li':
        window.open('https://www.linkedin.com/in/kubermehta/', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening LinkedIn profile...' }]);
        break;
      case 'ascii-selfie':
        setOutput(prev => [...prev, { type: 'output', content: getAsciiArt() }]);
        break;
      case 'projects':
      case 'pj':
        setOutput(prev => [...prev, { type: 'output', content: projectsContent }]);
        break;
      case 'blog':
        window.open('https://medium.com/@kubermehta', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening blog...' }]);
        break;
      case 'clear':
      case 'c':
        setOutput([]);
        break;
      case 'games':
      case 'g':
        setOutput(prev => [...prev, { type: 'output', content: gamesContent }]);
        break;
      case 'help':
        setOutput(prev => [...prev, { type: 'output', content: helpContent }]);
        break;
      case "neofetch":
      case "nf":
        showNeofetch(setOutput);
        break;
      case 'misc':
      case 'miscellaneous':
        setOutput(prev => [...prev, { type: 'output', content: miscContent }]);
        break;
      case 'resume':
      case 'cv':
        setOutput(prev => [...prev, { type: 'component', content: <PDFViewer /> }]);
        break;
      case 'google':
        if (argument) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(argument)}`, '_blank');
          setOutput(prev => [...prev, { type: 'output', content: `Searching Google for: ${argument}` }]);
        } else {
          setOutput(prev => [...prev, { type: 'output', content: 'Please provide a search query.' }]);
        }
        break;
      case 'wiki':
      case 'wikipedia':
        if (argument) {
          window.open(`https://wikipedia.org/w/index.php?search=${encodeURIComponent(argument)}`, '_blank');
          setOutput(prev => [...prev, { type: 'output', content: `Searching Wikipedia for: ${argument}` }]);
        } else {
          setOutput(prev => [...prev, { type: 'output', content: 'Please provide a search query.' }]);
        }
        break;
      case 'chatgpt':
      case 'gpt':
        if (argument) {
          window.open(`https://chatgpt.com/?q=${encodeURIComponent(argument)}`, '_blank');
          setOutput(prev => [...prev, { type: 'output', content: `Searching ChatGPT for: ${argument}` }]);
        } else {
          setOutput(prev => [...prev, { type: 'output', content: 'Please provide a search query.' }]);
        }
        break;
      case 'perplexity':
      case 'perp':
        if (argument) {
          window.open(`https://www.perplexity.ai/?q=${encodeURIComponent(argument)}`, '_blank');
          setOutput(prev => [...prev, { type: 'output', content: `Searching Perplexity for: ${argument}` }]);
        } else {
          setOutput(prev => [...prev, { type: 'output', content: 'Please provide a search query.' }]);
        }
        break;
      case 'hackermode':
        setHackermode(prev => !prev);
        setOutput(prev => [...prev, { type: 'output', content: `Hackermode ${hackermode ? 'deactivated' : 'activated'}` }]);
        break;
      case 'calculator':
        setOutput(prev => [...prev, { type: 'component', content: <Calculator /> }]);
        break;
        case 'snake':
          setOutput(prev => [...prev, { type: 'component', content: <SnakeGame /> }]);
          break;
        case 'tetris':
          setOutput(prev => [...prev, { type: 'component', content: <TetrisGame /> }]);
          break;
        case '2048':
          setOutput(prev => [...prev, { type: 'component', content: <Game2048 /> }]);
          break;
        case 'flappybird':
          setOutput(prev => [...prev, { type: 'component', content: <TerminalFlappyBird /> }]);
          break;
      case 'time':
        setOutput(prev => [...prev, { type: 'output', content: `Current Time: ${new Date().toLocaleTimeString()}` }]);
        break;
      case 'date':
        setOutput(prev => [...prev, { type: 'output', content: `Current Date: ${new Date().toLocaleDateString()}` }]);
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
              setOutput(prev => [...prev, { type: 'output', content: `Background changed to ${selectedBackground.name}` }]);
            } else {
              setOutput(prev => [...prev, { type: 'output', content: 'Invalid background. Please choose from the list.' }]);
            }
          } else {
            const backgroundOptions = [...backgrounds.solid, ...backgrounds.gradients].map(bg => (
              `<div key="${bg.name}" style="display: inline-block; margin: 5px;">
                <div style="width: 50px; height: 50px; background: ${bg.value}; cursor: pointer;" onclick="document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: '${bg.name}' }))"></div>
              </div>`
            )).join('');
            setOutput(prev => [...prev, { type: 'output', content: `<div style="display: flex; flex-wrap: wrap;">${backgroundOptions}</div>` }]);
          }
          break;
        default:
          setOutput(prev => [...prev, { type: 'output', content: 'Command not found. Type "help" for a list of commands.' }]);
          break;
      }
    };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const command = e.target.value.trim();
      if (command) {
        setCommandHistory(prev => [...prev, command]);
        setHistoryIndex(prev => prev + 1);
        setOutput(prev => [
          ...prev,
          { type: 'input', content: command }
        ]);
        handleCommand(command);
        e.target.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(prev => prev - 1);
        e.target.value = commandHistory[historyIndex - 1];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        setHistoryIndex(prev => prev + 1);
        e.target.value = commandHistory[historyIndex + 1];
      } else {
        setHistoryIndex(commandHistory.length);
        e.target.value = '';
      }
    }
  };

  useEffect(() => {
    const handleBackgroundSelected = (event) => {
      const selectedBackground = [...backgrounds.solid, ...backgrounds.gradients].find(bg => bg.name === event.detail);
      if (selectedBackground) {
        changeBackgroundColor(selectedBackground.value);
        setOutput(prev => [...prev, { type: 'output', content: `Background changed to ${selectedBackground.name}` }]);
      }
    };

    document.addEventListener('backgroundSelected', handleBackgroundSelected);

    return () => {
      document.removeEventListener('backgroundSelected', handleBackgroundSelected);
    };
  }, [backgrounds, changeBackgroundColor]);

  return (
    <div id="terminal" className="terminal-container" ref={terminalRef}>
      {hackermode && <HollywoodEffect />} {/* MAKE SURE IT HAPPENS WHEN HACKERMODE IS ON */}
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