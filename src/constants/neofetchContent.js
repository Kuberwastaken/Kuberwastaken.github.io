export function showNeofetch(addOutput) {
  const neofetchOutput = `
    <div class="neofetch-container">
      <!-- Neofetch Logo -->
      <div class="neofetch-logo">
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
  ⣠⠟⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣄
        </pre>
      </div>
      
      <!-- Neofetch Details -->
      <div class="neofetch-details">
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
  addOutput(prev => [...prev, { type: 'output', content: neofetchOutput }]);
}