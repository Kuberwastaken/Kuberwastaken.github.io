window.addEventListener("DOMContentLoaded", function () {
  let n = document.getElementById("cmd");
  n.focus();
  document.getElementById("helpCmdList").innerHTML = helpCmd;
  let e = document.getElementById("output"),
    s = document.getElementById("mainInfo");

  n.addEventListener("keypress", function (i) {
    if (13 === i.keyCode && "" !== (i = n.value.trim())) {
      // Show user input in terminal
      e.innerHTML += "<div><span class='ownerTerminal'><b>kuber@profile</b></span>:<b>~$</b> " + i + "</div>";
      n.value = ""; // Clear the input field

      // Command handling
      if ("skills" === i || "s" === i) {
        e.innerHTML += skillsBar;
      } else if ("github" === i || "gh" === i) {
        window.open("https://github.com/Kuberwastaken", "_blank");
      } else if ("discord" === i || "ds" === i) {
        window.open("https://discord.com/users/1296085958374068316", "_blank");
      } else if ("email" === i || "em" === i) {
        window.open("mailto:kuberhob@gmail.com", "_blank");
      } else if ("youtube" === i || "yt" === i) {
        window.open("https://www.youtube.com/@Kuberwastaken", "_blank");
      } else if ("linkedin" === i || "li" === i) {
        window.open("https://www.linkedin.com/in/kubermehta/", "_blank");
      } else if ("projects" === i || "pj" === i) {
        e.innerHTML += projectCmd;
      } else if ("blog" === i) {
        // Redirect to Medium profile
        window.open("https://medium.com/@kubermehta", "_blank");
      } else if ("neofetch" === i || "nf" === i) {
        showNeofetch();
      } else if ("help" === i) {
        e.innerHTML += helpCmd;
      } else if ("clear" === i || "c" === i) {
        e.innerHTML = "";
        s.innerHTML = "";
      } else if ("resume" === i || "cv" === i) {
        showResume();
      } else {
        e.innerHTML += "<div>Not found</div>";
      }
      e.scrollTop = e.scrollHeight; // Scroll to the latest output
    }
  });
});

let currentSuggestionIndex = -1;

function showSuggestions() {
  let cmdInput = document.getElementById("cmd");
  let inputText = cmdInput.value.trim();
  let suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = ""; // Clear previous suggestions

  if (inputText) {
    let filteredSuggestions = suggestions.filter(s => s.startsWith(inputText));
    filteredSuggestions.forEach((suggestion) => {
      let suggestionItem = document.createElement("div");
      suggestionItem.textContent = suggestion;
      suggestionItem.addEventListener("click", function () {
        cmdInput.value = suggestion;
        suggestionsList.innerHTML = ""; // Clear suggestions after selection
      });
      suggestionsList.appendChild(suggestionItem);
    });
    cmdInput.classList.add("command-entered");
  } else {
    cmdInput.classList.remove("command-entered");
  }
}

function handleKeyDown(event) {
  let suggestionsList = document.getElementById("suggestions");
  let suggestionItems = suggestionsList.getElementsByTagName("div");

  if (event.key === "ArrowUp") {
    event.preventDefault();
    if (currentSuggestionIndex > 0) currentSuggestionIndex--;
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    if (currentSuggestionIndex < suggestionItems.length - 1) currentSuggestionIndex++;
  } else if (event.key === "Enter") {
    let cmdInput = document.getElementById("cmd");
    let selectedItem = suggestionItems[currentSuggestionIndex];
    if (selectedItem) {
      cmdInput.value = selectedItem.textContent;
      suggestionsList.innerHTML = ""; // Clear suggestions after selection
      cmdInput.classList.remove("command-entered");
    }
  }

  for (let i = 0; i < suggestionItems.length; i++) {
    let item = suggestionItems[i];
    item.classList.toggle("selected", i === currentSuggestionIndex);
  }
}

function linkHref(url) {
  window.open(url, "_blank");
}

function showNeofetch() {
  let neofetchOutput = `
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
  document.getElementById("output").innerHTML += `<div>${neofetchOutput}</div>`;
}

function showResume() {
  let resumeEmbed = `
    <div class="resume-container" style="text-align: center; margin: 20px 0;">
      <iframe src="https://drive.google.com/file/d/15qaFbjdSAyfsO0wjcPblJsBPMJ_iWgnZ/preview" 
              width="80%" 
              height="1000px" 
              style="border: none;">
      </iframe>
    </div>
  `;
  document.getElementById("output").innerHTML += resumeEmbed;
}

// Command suggestions and help
let suggestions = [
  "resume", "cv", "help", "skills", "clear", "projects", "blog", "tools", "github", "discord", "email", "youtube", "neofetch"
];

let helpCmd = `
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

let skillsBar = `
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
  </div>
`;
