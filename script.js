// Wait for DOM content to load
window.addEventListener("DOMContentLoaded", function () {
  initializeTerminal();
});

/**
 * Initializes the terminal functionality.
 */
function initializeTerminal() {
  const commandInput = document.getElementById("cmd");
  const output = document.getElementById("output");
  const mainInfo = document.getElementById("mainInfo");
  
  commandInput.focus();
  document.getElementById("helpCmdList").innerHTML = helpCmd;

  commandInput.addEventListener("keypress", function (event) {
    if (event.keyCode === 13) {
      handleCommand(commandInput, output, mainInfo);
    }
  });
}

/**
 * Handles user commands input.
 * @param {HTMLElement} inputField - The command input field.
 * @param {HTMLElement} output - The output container.
 * @param {HTMLElement} mainInfo - The main info container.
 */
function handleCommand(inputField, output, mainInfo) {
  const command = inputField.value.trim();
  if (!command) return;

  displayUserInput(output, command);
  inputField.value = "";

  switch (command) {
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
    default:
      output.innerHTML += `<div>Not found</div>`;
  }

  scrollToLatest(output);
}

/**
 * Displays user input in the terminal output.
 * @param {HTMLElement} output - The output container.
 * @param {string} command - The user command.
 */
function displayUserInput(output, command) {
  output.innerHTML += `<div><span class='ownerTerminal'><b>kuber@profile</b></span>:<b>~$</b> ${command}</div>`;
}

/**
 * Opens a given URL in a new tab.
 * @param {string} url - The URL to open.
 */
function linkToURL(url) {
  window.open(url, "_blank");
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
 * Scrolls the terminal output to the latest entry.
 * @param {HTMLElement} output - The output container.
 */
function scrollToLatest(output) {
  output.scrollTop = output.scrollHeight;
}

/**
 * Displays the neofetch output in the terminal.
 * @param {HTMLElement} output - The output container.
 */
function showNeofetch(output) {
  const neofetchOutput = `
    <pre>
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
    ⣠⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣄
    </pre>
    <span>OS: I use arch btw</span><br>
    <span>Kernel: 6.4.7-arch1-1</span><br>
    <span>Uptime: forever </span><br>
    <span>Packages: 1200</span><br>
    <span>Shell: Zsh 5.9</span><br>
    <span>Resolution: 3840 x 2160</span><br>
    <span>DE: KDE Plasma</span><br>
    <span>WM: Mutter</span><br>
    <span>Terminal: Made by Kuber Mehta</span><br>
    <span>CPU: Intel Core i5 1355U</span><br>
    <span>GPU: Intel UHD Graphics</span><br>
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

// Suggestions and command definitions
const suggestions = [
  "resume", "cv", "help", "skills", "clear", "projects", "blog", "tools", "github", "discord", "email", "youtube", "neofetch"
];

const helpCmd = `
  <br>Available commands: <br />
  [<span class="commandName">skills</span>] or [<span class="commandName">s</span>]<br />
  [<span class="commandName">projects</span>] or [<span class="commandName">pj</span>]<br />
  [<span class="commandName">resume</span>] or [<span class="commandName">cv</span>]<br />
  [<span class="commandName">blog</span>]<br />
  [<span class="commandName">neofetch</span>]<br /><br />
  [<span class="commandName">clear</span>]<br /><br />
  Contact me: <br />
  
  [<span class="commandName">email</span>] <br />
  [<span class="commandName">linkedin</span>] <br />
  [<span class="commandName">github</span>] <br />
  [<span class="commandName">discord</span>] <br />
  [<span class="commandName">youtube</span>]
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
    </div>
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

