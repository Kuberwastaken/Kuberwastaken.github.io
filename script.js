// Function to scroll to bottom of the terminal smoothly
function scrollToBottom() {
  const terminal = document.getElementById('terminal');
  terminal.scrollTo({
    top: terminal.scrollHeight,
    behavior: 'smooth'
  });
}

// Add MutationObserver to watch for content changes
const observer = new MutationObserver(() => {
  scrollToBottom();
});

let commandHistory = [];
let historyIndex = -1;

function initializeTerminal() {
  const commandInput = document.getElementById("cmd");
  const output = document.getElementById("output");
  const mainInfo = document.getElementById("mainInfo");
  commandInput.focus();
  document.getElementById("helpCmdList").innerHTML = helpCmd;

  observer.observe(output, { childList: true, subtree: true });

  commandInput.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
          handleCommand(commandInput, output, mainInfo);
      }
  });

  commandInput.addEventListener("keydown", function (event) {
      if (event.keyCode === 38) { // Up arrow key
          if (historyIndex > 0) {
              historyIndex--;
              commandInput.value = commandHistory[historyIndex];
          } else if (historyIndex === -1 && commandHistory.length > 0) {
              historyIndex = commandHistory.length - 1;
              commandInput.value = commandHistory[historyIndex];
          }
      } else if (event.keyCode === 40) { // Down arrow key
          if (historyIndex < commandHistory.length - 1) {
              historyIndex++;
              commandInput.value = commandHistory[historyIndex];
          } else if (historyIndex === commandHistory.length - 1) {
              historyIndex++;
              commandInput.value = "";
          }
      }
  });
}

function handleCommand(inputField, output, mainInfo) {
  const fullCommand = inputField.value.trim();
  if (!fullCommand) return;

  // Add command to history
  commandHistory.push(fullCommand);
  historyIndex = commandHistory.length;

  const [command, ...args] = fullCommand.split(' ');
  const argument = args.join(' ');

  displayUserInput(output, fullCommand);
  inputField.value = "";

  switch (command.toLowerCase()) {
      case "skills":
      case "s":
          output.innerHTML += skillsBar;
          break;
      case "github":
      case "gh":
          linkToURL("https://github.com/Kuberwastaken");
          break;
      case "discord":
      case "ds":
          linkToURL("https://discord.com/users/1296085958374068316");
          break;
      case "email":
      case "em":
          linkToURL("mailto:kuberhob@gmail.com");
          break;
      case "youtube":
      case "yt":
          linkToURL("https://www.youtube.com/@Kuberwastaken");
          break;
      case "linkedin":
      case "li":
          linkToURL("https://www.linkedin.com/in/kubermehta/");
          break;
      case "projects":
      case "pj":
          output.innerHTML += projectCmd;
          break;
      case "blog":
          linkToURL("https://medium.com/@kubermehta");
          break;
      case "neofetch":
      case "nf":
          showNeofetch(output);
          break;
      case "help":
          output.innerHTML += helpCmd;
          break;
      case "clear":
      case "c":
          clearTerminal(output, mainInfo);
          break;
      case "resume":
      case "cv":
          showResume(output);
          break;
      case "miscellaneous":
      case "misc":
          output.innerHTML += miscCmd;
          break;
      case "ascii-selfie": 
       showAsciiSelfie(output); 
       break;
      case "open":
          if (argument) {
              const url = argument.startsWith('http') ? argument : `http://${argument}`;
              linkToURL(url);
              output.innerHTML += `<div>Opening URL: ${argument}</div>`;
          } else {
              output.innerHTML += `<div>Please provide a URL to open.</div>`;
          }
          break;
      case "google":
          if (argument) {
              linkToURL(`https://www.google.com/search?q=${encodeURIComponent(argument)}`);
              output.innerHTML += `<div>Searching Google for: ${argument}</div>`;
          } else {
              output.innerHTML += `<div>Please provide a search query.</div>`;
          }
          break;
      case "youtube":
          if (argument) {
              linkToURL(`https://www.youtube.com/results?search_query=${encodeURIComponent(argument)}`);
              output.innerHTML += `<div>Searching YouTube for: ${argument}</div>`;
          } else {
              output.innerHTML += `<div>Please provide a search query.</div>`;
          }
          break;
      case "wiki":
      case "wikipedia":
          if (argument) {
              linkToURL(`https://wikipedia.org/w/index.php?search=${encodeURIComponent(argument)}`);
              output.innerHTML += `<div>Searching Wikipedia for: ${argument}</div>`;
          } else {
              output.innerHTML += `<div>Please provide a search query.</div>`;
          }
          break;
      case "time":
          const timeNow = new Date().toLocaleTimeString();
          output.innerHTML += `<div>Current Time: ${timeNow}</div>`;
          break;
      case "date":
          const currentDate = new Date().toLocaleDateString();
          output.innerHTML += `<div>Current Date: ${currentDate}</div>`;
          break;
      default:
          output.innerHTML += `<div>Command not found. Type 'help' for a list of commands.</div>`;
  }

  // Scroll to the bottom after processing the command
  setTimeout(scrollToBottom, 0);
  setTimeout(scrollToBottom, 100);
  setTimeout(scrollToBottom, 500);
}

function displayUserInput(output, command) {
  output.innerHTML += `<div><span class='ownerTerminal'><b>kuber@profile</b></span>:<b>~$</b> ${command}</div>`;
}

function linkToURL(url) {
  window.open(url, "_blank");
}

function clearTerminal(output, mainInfo) {
  output.innerHTML = "";
  mainInfo.innerHTML = "";
}

window.addEventListener("DOMContentLoaded", initializeTerminal);

/**
* Displays the neofetch output in the terminal.
* @param {HTMLElement} output - The output container.
*/
function showNeofetch(output) {
  const neofetchOutput = `
      <div style="display: flex; align-items: flex-start; font-family: monospace;">
          <div style="margin-right: 30px; padding: 10px;">
              <pre style="line-height: 1.3em;">
                  ...
              </pre>
          </div>
          <div style="padding: 10px; line-height: 1.6em;">
              <span><strong>OS:</strong> I use Arch btw</span><br>
              <span><strong>Host:</strong> Kuber's PC</span><br>
              <span><strong>Kernel:</strong> 6.4.7-arch1-1</span><br>
              <span><strong>Uptime:</strong> Forever</span><br>
              <span><strong>Resolution:</strong> 3840x2160</span><br>
              <span><strong>DE:</strong> KDE Plasma</span><br>
              <span><strong>Vim:</strong> Neovim 0.9.1</span><br>
              <span><strong>WPI:</strong> Kuber's Config</span><br>
              <span><strong>Theme:</strong> Nord Dark</span><br>
              <span><strong>Terminal:</strong> Made by Kuber Mehta</span><br>
              <span><strong>CPU:</strong> Intel Core i5 1355U</span>
          </div>
      </div>
  `;
  output.innerHTML += `<div>${neofetchOutput}</div>`;
}

function showResume(output) {
  const resumeEmbedDesktop = `
    <div class="resume-container desktop-version" style="text-align: center; margin: 20px 0;">
      <object data="https://kuberwastaken.github.io/Resume/Resume.pdf" type="application/pdf" 
              width="80%" 
              height="1000px" 
              style="border: none;">
        <p>Your browser does not support PDFs. <a href="https://kuberwastaken.github.io/Resume/Resume.pdf">Download the PDF</a>.</p>
      </object>
    </div>
  `;
  
  const resumeEmbedMobile = `
    <div class="resume-container mobile-version" style="text-align: center; margin: 20px 0;">
      <object data="https://kuberwastaken.github.io/Resume/Resume.pdf" type="application/pdf" 
              width="100%" 
              height="90%" 
              style="border: none;">
        <p>Your browser does not support PDFs. <a href="https://kuberwastaken.github.io/Resume/Resume.pdf">Download the PDF</a>.</p>
      </object>
    </div>
  `;
  
  // Add both desktop and mobile embeds
  output.innerHTML = resumeEmbedDesktop + resumeEmbedMobile;

  // Call the toggle function once to set initial visibility
  toggleResumeView();

  // Listen to window resize events to adjust visibility dynamically
  window.addEventListener('resize', toggleResumeView);
}


// Function to handle external links in projects
function linkHref(url) {
  window.open(url, '_blank');
}

/**
 * Clears the terminal output and main info.
 * @param {HTMLElement} output - The output container.
 * @param {HTMLElement} mainInfo - The main info container.
 */
function clearTerminal(output, mainInfo) {
  output.innerHTML = "";
  mainInfo.innerHTML = "";
}

function showNeofetch(output) {
  const neofetchOutput = `
    <div style="display: flex; align-items: flex-start; font-family: monospace; color: #ffebcd;">
      <!-- Neofetch Logo -->
      <div style="margin-right: 20px; padding: 10px;">
        <pre style="line-height: 1.3em;">
   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣷⣤⣙⢻⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⠀⢠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡄⠀⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⡿⠛⠛⠿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⣿⠏⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀
   ⠀⠀⠀⠀⣰⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⠿⣆⠀⠀⠀⠀
   ⠀⠀⠀⣴⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣷⣦⡀⠀⠀⠀
   ⠀⢀⣾⣿⣿⠿⠟⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠉⠉⠙⠛⠻⠿⣿⣿⣷⡀⠀
  ⣠⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣄
        </pre>
      </div>
      
      <!-- Neofetch Details -->
      <div style="padding: 10px; line-height: 1.3em;">
        <pre>
kuber@portfolio
------------
OS:           I use Arch btw
Host:         Kuber's PC
Kernel:       6.4.7-arch1-1
Uptime:       Forever
Resolution:   3840x2160
DE:           KDE Plasma
Vim:          Neovim 0.9.1
WPI:          Kuber's Config
Theme:        Xfce
Terminal:     Made by Kuber Mehta
CPU:          Intel Core i5 1355U

<span style="display: flex; justify-content: flex-start; margin-bottom: -2px;">
  <!-- Lighter shades -->
  <div style="width: 20px; height: 20px; background-color: #ff5555; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #55ff55; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #5555ff; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #ffff55; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #ff55ff; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #55ffff; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #ffffff; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #aaaaaa; margin-right: 2px;"></div>
</span>
<span style="display: flex; justify-content: flex-start;">
  <!-- Darker shades -->
  <div style="width: 20px; height: 20px; background-color: #990000; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #009900; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #000099; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #999900; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #990099; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #009999; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #333333; margin-right: 2px;"></div>
  <div style="width: 20px; height: 20px; background-color: #000000;"></div>
</span>
        </pre>
      </div>
    </div>
  `;
  output.innerHTML += neofetchOutput;
}

// Function to show ASCII art selfie
function showAsciiSelfie(output) {
  const asciiArt = getAsciiArt();
  output.innerHTML += `<div>${asciiArt}</div>`;
}

// Function to handle external links in projects
function linkHref(url) {
  window.open(url, '_blank');
}

// Suggestions and command definitions
const suggestions = [
  "resume", "cv", "help", "skills", "s", "clear", "c", "projects", "pj", "blog", 
  "github", "gh", "discord", "ds", "email", "em", "youtube", "yt", "linkedin", "li", 
  "neofetch", "nf", "miscellaneous", "misc", "ascii-selfie", "open", "google", 
  "wiki", "wikipedia", "time", "date"
];

const helpCmd = `
  <br>Available commands: <br />
  [<span class="commandName">skills</span>] or [<span class="commandName">s</span>]<br />
  [<span class="commandName">projects</span>] or [<span class="commandName">pj</span>]<br />
  [<span class="commandName">resume</span>] or [<span class="commandName">cv</span>]<br />
  [<span class="commandName">miscellaneous</span>] or [<span class="commandName">misc</span>]<br />
  [<span class="commandName">clear</span>]<br /><br />
  
  Contact me: <br />
  [<span class="commandName">email</span>] <br />
  [<span class="commandName">linkedin</span>] <br />
  [<span class="commandName">github</span>] <br />
  [<span class="commandName">discord</span>] <br />
  [<span class="commandName">youtube</span>] <br />
  [<span class="commandName">blog</span>]
`;

const miscCmd = `
  <br>Utility commands: <br />
  [<span class="commandName">open</span> URL] - Open a specific URL<br />
  [<span class="commandName">google</span> query] - Search Google<br />
  [<span class="commandName">youtube</span> query] - Search YouTube<br />
  [<span class="commandName">wiki</span> query] - Search Wikipedia<br />
  [<span class="commandName">neofetch</span>] - Neofetch<br />
  [<span class="commandName">ascii-selfie</span>] - See a Selfie of me :) <br />
  [<span class="commandName">time</span>] - Show current time<br />
  [<span class="commandName">date</span>] - Show current date
`;

const skillsBar = `
  <div class="container">
    <div class="flex">
      <h2>HTML/EJS:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem1"></div></div>
      <h3>70%</h3>
    </div>
    <div class="flex">
      <h2>CSS/SCSS:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem2"></div></div>
      <h3>100%</h3>
    </div>
    <div class="flex">
      <h2>JS:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem3"></div></div>
      <h3>60%</h3>
    </div>
    <div class="flex">
      <h2>TS:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem4"></div></div>
      <h3>55%</h3>
    </div>
    <div class="flex">
      <h2>NODE.JS:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem5"></div></div>
      <h3>75%</h3>
    </div>
    <div class="flex">
      <h2>REACT.JS:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem6"></div></div>
      <h3>75%</h3>
    </div>
    <div class="flex">
      <h2>RUST:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem7"></div></div>
      <h3>10%</h3>
    </div>
    <div class="flex">
      <h2>PYTHON:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem8"></div></div>
      <h3>65%</h3>
    </div>
    <div class="flex">
      <h2>C:</h2>
      <div class="skillBar"><div class="skillBarItem skillBarItem9"></div></div>
      <h3>75%</h3>
    </div>
  </div>
`;

let projectCmd = `
  <div class="projectsDiv">
    <article class="article-wrapper" onclick="linkHref('https://github.com/Kuberwastaken/TREAT-CS50')">
      <div class="project-info">
        <div class="flex-pr">
          <div class="project-title text-nowrap">TREAT-CS50</div>
        </div>
        <div class="flex-pr">
          <p class="project-description">An AI web application Built with Flask and Python to Analyze Movie and Show scripts for Potential Triggers.</p>
        </div>
      </div>
    </article>
    <article class="article-wrapper" onclick="linkHref('https://www.kaggle.com/code/kubermehta/books-reimagined-diary-of-a-wimpy-kid-by-rodrick')">
      <div class="project-info">
        <div class="flex-pr">
          <div class="project-title text-nowrap">Books Reimagined</div>
        </div>
        <div class="flex-pr">
          <p class="project-description">An AI tool to transform narrative perspectives in literature powered by Google Gemini 1.5.</p>
        </div>
      </div>
    </article>
    <article class="article-wrapper" onclick="linkHref('https://github.com/Kuberwastaken/ROOP-AI-Deepfakes')">
      <div class="project-info">
        <div class="flex-pr">
          <div class="project-title text-nowrap">ROOP AI Deepfakes</div>
        </div>
        <div class="flex-pr">
          <p class="project-description">A deepfake creation tool using AI.</p>
        </div>
      </div>
    </article>
    <article class="article-wrapper" onclick="linkHref('https://github.com/Kuberwastaken/Github-Art')">
      <div class="project-info">
        <div class="flex-pr">
          <div class="project-title text-nowrap">Github Art</div>
        </div>
        <div class="flex-pr">
          <p class="project-description">Make Pixel Art in your Github Commit History.</p>
        </div>
      </div>
    </article>
  </div>
`;


// Call initializeTerminal on page load
window.addEventListener("DOMContentLoaded", function () {
  initializeTerminal();
});