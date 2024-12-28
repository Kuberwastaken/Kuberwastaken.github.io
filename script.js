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
}

function handleCommand(inputField, output, mainInfo) {
  const fullCommand = inputField.value.trim();
  if (!fullCommand) return;

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

/**
* Displays the resume embedded in the terminal.
* @param {HTMLElement} output - The output container.
*/
function showResume(output) {
  const resumeEmbed = `
      <div class="resume-container" style="text-align: center; margin: 20px 0;">
          <iframe src="pdfs/Resume.pdf#view=FitH" 
                  width="80%" 
                  height="1000px" 
                  style="border: none;">
          </iframe>
      </div>
  `;
  output.innerHTML += resumeEmbed;
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

/**
 * Displays the neofetch output in the terminal.
 * @param {HTMLElement} output - The output container.
 */
function showNeofetch(output) {
  const neofetchOutput = `
    <div style="display: flex; align-items: flex-start; font-family: monospace;">
      <!-- Neofetch Logo -->
      <div style="margin-right: 30px; padding: 10px;">
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

      <!-- Color Palette (Two Rows) -->
      <div style="clear: both; margin-top: 20px;">
        <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 5px;">
          <!-- Lighter shades -->
          <div style="width: 10%; height: 20px; background-color: #ff5555;"></div>
          <div style="width: 10%; height: 20px; background-color: #55ff55;"></div>
          <div style="width: 10%; height: 20px; background-color: #5555ff;"></div>
          <div style="width: 10%; height: 20px; background-color: #ffff55;"></div>
          <div style="width: 10%; height: 20px; background-color: #ff55ff;"></div>
          <div style="width: 10%; height: 20px; background-color: #55ffff;"></div>
          <div style="width: 10%; height: 20px; background-color: #ffffff;"></div>
          <div style="width: 10%; height: 20px; background-color: #aaaaaa;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; width: 100%;">
          <!-- Darker shades -->
          <div style="width: 10%; height: 20px; background-color: #990000;"></div>
          <div style="width: 10%; height: 20px; background-color: #009900;"></div>
          <div style="width: 10%; height: 20px; background-color: #000099;"></div>
          <div style="width: 10%; height: 20px; background-color: #999900;"></div>
          <div style="width: 10%; height: 20px; background-color: #990099;"></div>
          <div style="width: 10%; height: 20px; background-color: #009999;"></div>
          <div style="width: 10%; height: 20px; background-color: #333333;"></div>
          <div style="width: 10%; height: 20px; background-color: #000000;"></div>
        </div>
      </div>
    </div>
  `;
  output.innerHTML += `<div>${neofetchOutput}</div>`;
}

// Function to show ASCII art selfie
function showAsciiSelfie(output) {
  const asciiArt = getAsciiArt();
  output.innerHTML += `<div>${asciiArt}</div>`;
}

/**
 * Displays the resume embedded in the terminal.
 * @param {HTMLElement} output - The output container.
 */
function showResume(output) {
  const resumeEmbed = `
    <div class="resume-container" style="text-align: center; margin: 20px 0;">
      <iframe src="pdfs/Resume.pdf#view=FitH" 
              width="80%" 
              height="1000px" 
              style="border: none;">
      </iframe>
    </div>
  `;
  output.innerHTML += resumeEmbed;
}

// Function to handle external links in projects
function linkHref(url) {
  window.open(url, '_blank');
}

// Suggestions and command definitions
const suggestions = [
  "resume", "cv", "help", "skills", "clear", "projects", "blog", "tools", 
  "github", "discord", "email", "youtube", "neofetch", "miscellaneous", "misc"
];

const helpCmd = `
  <br>Available commands: <br />
  [<span class="commandName">skills</span>] or [<span class="commandName">s</span>]<br />
  [<span class="commandName">projects</span>] or [<span class="commandName">pj</span>]<br />
  [<span class="commandName">resume</span>] or [<span class="commandName">cv</span>]<br />
  [<span class="commandName">blog</span>]<br />
  [<span class="commandName">neofetch</span>]<br />
  [<span class="commandName">miscellaneous</span>] or [<span class="commandName">misc</span>]<br />
  [<span class="commandName">clear</span>]<br /><br />
  
  Contact me: <br />
  [<span class="commandName">email</span>] <br />
  [<span class="commandName">linkedin</span>] <br />
  [<span class="commandName">github</span>] <br />
  [<span class="commandName">discord</span>] <br />
  [<span class="commandName">youtube</span>]
`;

const miscCmd = `
  <br>Utility commands: <br />
  [<span class="commandName">open</span> URL] - Open a specific URL<br />
  [<span class="commandName">google</span> query] - Search Google<br />
  [<span class="commandName">youtube</span> query] - Search YouTube<br />
  [<span class="commandName">wiki</span> query] - Search Wikipedia<br />
  [<span class="commandName">ascii-selfie</span>] - See a selfie of me :) <br />
  [<span class="commandName">time</span>] - Show current time<br />
  [<span class="commandName">date</span>] - Show current date<br />
`;

const skillsBar = `
  <div class="container">
    <div class="flex">
      <h2>HTML/EJS:</h2>
      <div class="skillBar"><div class="skillBarItem1" style="width: 70%"></div></div>
      <h3>70%</h3>
    </div>
    <div class="flex">
      <h2>CSS/SCSS:</h2>
      <div class="skillBar"><div class="skillBarItem2"></div></div>
      <h3>100%</h3>
    </div>
    <div class="flex">
      <h2>JS:</h2>
      <div class="skillBar"><div class="skillBarItem3" style="width: 60%"></div></div>
      <h3>60%</h3>
    </div>
    <div class="flex">
      <h2>TS:</h2>
      <div class="skillBar"><div class="skillBarItem4" style="width: 60%"></div></div>
      <h3>55%</h3>
    </div>
    <div class="flex">
      <h2>NODE.JS:</h2>
      <div class="skillBar"><div class="skillBarItem5"></div></div>
      <h3>75%</h3>
    </div>
    <div class="flex">
      <h2>REACT.JS:</h2>
      <div class="skillBar"><div class="skillBarItem6" style="width: 75%"></div></div>
      <h3>75%</h3>
    </div>
    <div class="flex">
      <h2>RUST:</h2>
      <div class="skillBar"><div class="skillBarItem7" style="width: 10%"></div></div>
      <h3>10%</h3>
    </div>
    <div class="flex">
      <h2>PYTHON:</h2>
      <div class="skillBar"><div class="skillBarItem8" style="width: 65%"></div></div>
      <h3>65%</h3>
    <div>
    <div class="flex">
      <h2>C:</h2>
      <div class="skillBar"><div class="skillBarItem9" style="width: 75%"></div></div>
      <h3>75%</h3>
    </div>
  </div>
`;

let projectCmd = `
  <div class="projectsDiv">
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
    <article class="article-wrapper" onclick="linkHref('https://github.com/Kuberwastaken/Miscellaneous-AI-Tools')">
      <div class="project-info">
        <div class="flex-pr">
          <div class="project-title text-nowrap">Miscellaneous AI Tools</div>
        </div>
        <div class="flex-pr">
          <p class="project-description">A collection of jailbreak scripts for LLMs like ChatGPT.</p>
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
  </div>
`;

// Call initializeTerminal on page load
window.addEventListener("DOMContentLoaded", function () {
  initializeTerminal();
});