import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import skillsBar from '../constants/skillsBar';
import projectsContent from '../constants/projectsContent';
import helpContent from '../constants/helpContent';
import { showNeofetch } from '../constants/neofetchContent';
import { getAsciiArt } from '../constants/asciiSelfie';
import miscContent from '../constants/miscContent';
import gamesContent from '../constants/gamesContent';
import PDFViewer from './PDFViewer';
import HollywoodEffect from './HollywoodEffect/HollywoodEffect';
import Calculator from './Calculator/Calculator';
import SnakeGame from './SnakeGame/SnakeGame';
import TetrisGame from './TetrisGame/TetrisGame';
import Game2048 from './Game2048/Game2048';
import TerminalFlappyBird from './FlappyBird/TerminalFlappyBird';
import Jarvis from './Jarvis/Jarvis';
import whoamiContent from '../constants/whoami';

const Terminal = () => {
  const [output, setOutput] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [input, setInput] = useState('');
  const [hackermode, setHackermode] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const { cssNakedDayMessage } = useTheme();

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
.##....##..#######..########..########.##.....##........##.....##.########.##.....##....##....##.....##`;

const smallBanner = `
..##....##....##.....##..
..##...##.....###...###..
..##..##......####.####..
..#####.......##.###.##..
..##..##......##.....##..
..##...##.....##.....##..
..##....##....##.....##..`;

    const welcomeMessage = `
      <div align="left">
      <div>
        <pre>
  ${isMobile ? `<a href="https://x.com/Kuberwastaken" target="_blank"><font color="blue">${smallBanner}</font></a>` : `<a href="https://x.com/Kuberwastaken" target="_blank"><font color="blue">${largeBanner}</font></a>`}</pre>
      </div>
      <div align="left">
        <p>Welcome to my personal portfolio! (<a href="https://css-naked-day.github.io/" target="_blank">Version CSS-Naked-Day</a>)
        <p>Type <strong>'help'</strong> to see the list of available commands.</p>
        <p><strong>NEW</strong> try <a href="https://kuberwastaken.github.io/backdooms/" target="_blank">The Backdooms</a> & <a href="https://trytreat.tech/" target="_blank">TREAT Web!</a></p>
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
      const commandElement = event.target.closest('[data-command]');
      if (commandElement) {
        const command = commandElement.getAttribute('data-command');
        simulateTyping(command);
      }
    };

    document.addEventListener('click', handleCommandClick);

    return () => {
      document.removeEventListener('click', handleCommandClick);
    };
  }, []);

  const simulateTyping = (command) => {
    if (!command || typeof command !== 'string') {
      console.error('Invalid command:', command);
      return;
    }
    let index = 0;
    setInput(''); // Clear input
    const interval = setInterval(() => {
      if (index < command.length) {
        setInput((prev) => prev + command[index]); // Add each character
        index++;
      } else {
        clearInterval(interval);
        executeCommand(command.trim()); // Ensure no trailing or invalid characters
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
      case 'b':
        window.open('https://kuberwastaken.github.io/blog/', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening blog...' }]);
        break;
      case 'resume':
      case 'cv':
        window.open('https://kuberwastaken.github.io/Resume/', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening resume...' }]);
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
        window.open('https://kuberwastaken.github.io/Resume/', '_blank');
        setOutput(prev => [...prev, { type: 'output', content: 'Opening resume...' }]);
        break;
        setOutput(prev => [...prev, { type: 'component', content: <PDFViewer /> }]);
        break;
      case 'jarvis':
      case 'j':
        setOutput(prev => [...prev, { type: 'component', content: <Jarvis /> }]);
        break;
      case 'google':
        if (argument) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(argument)}`, '_blank');
          setOutput(prev => [...prev, { type: 'output', content: `Searching Google for: ${argument}` }]);
        } else {
          setOutput(prev => [...prev, { type: 'output', content: 'Please provide a search query.' }]);
        }
        break;
        case 'whoami':
          setOutput(prev => [...prev, { type: 'output', content: whoamiContent }]);
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
        case 'backdooms':
        case 'the backdooms':
          window.open('https://kuberwastaken.github.io/backdooms/', '_blank');
          setOutput(prev => [...prev, { type: 'output', content: 'Opening The Backdooms...' }]);
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
          setOutput(prev => [...prev, { type: 'output', content: cssNakedDayMessage }]);
          break;
        default:
          setOutput(prev => [...prev, { type: 'output', content: 'Command not found. Type "help" for a list of commands.' }]);
          break;
      }
      setInput(''); // Clear the input field after handling the command
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



  return (
    <div id="terminal" ref={terminalRef}>
      {hackermode && <HollywoodEffect />} {/* MAKE SURE IT HAPPENS WHEN HACKERMODE IS ON */}
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          {output.map((item, index) => (
            <tr key={index}>
              <td>
                {item.type === 'input' ? (
                  <pre>
                    <font size="4"><strong>kuber@profile:~$</strong> {item.content}</font>
                  </pre>
                ) : item.type === 'component' ? (
                  <div>{item.content}</div>
                ) : (
                  <div align="left" dangerouslySetInnerHTML={{ __html: item.content }} />
                )}
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <pre>
                <font size="4"><strong>kuber@profile:~$</strong></font>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Terminal;