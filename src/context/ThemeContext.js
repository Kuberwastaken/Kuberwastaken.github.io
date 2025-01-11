import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

const backgrounds = {
  solid: [
    { name: 'Ubuntu', value: '#2C001E' },
    { name: 'Fedora', value: '#0B3D91' },
    { name: 'Arch Linux', value: '#1B1D1E' },
    { name: 'Debian', value: '#A80030' },
    { name: 'Mint', value: '#2C3E50' },
    { name: 'Red Hat', value: '#EE0000' },
    { name: 'Garuda', value: '#E95420' },
  ],
  gradients: [
    { name: 'Sunset', value: 'linear-gradient(to right, #ff7e5f, #feb47b)' },
    { name: 'TREAT', value: 'linear-gradient(to right, #6a11cb, #2575fc)' },
    { name: 'Orange Pink', value: 'linear-gradient(to right, #ff6a00, #ee0979)' },
    { name: 'Github Art', value: 'linear-gradient(to right,rgb(0, 0, 0), #00f2fe)' },
    { name: 'Deep Space', value: 'linear-gradient(to right, #000428, #004e92)' },
    { name: 'Cherry Blossom', value: 'linear-gradient(to right, #fd79a8, #fab1a0)' },
    { name: 'Twilight', value: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)' },
    { name: 'ORCUS', value: 'linear-gradient(to right,rgb(0, 0, 0),rgb(212, 20, 46))' }
  ]
};

export const ThemeProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState('#000000');

  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'theme-styles';
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('theme-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const applyBackground = (color) => {
    const existingStyle = document.getElementById('theme-styles');
    if (existingStyle) {
      existingStyle.textContent = `
        body {
          background: ${color};
          min-height: 100vh;
          margin: 0;
          transition: background 0.3s ease;
        }
      `;
    }
  };

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color);
    applyBackground(color);
  };

  return (
    <ThemeContext.Provider value={{ backgroundColor, changeBackgroundColor, backgrounds }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Modify the Terminal.js component to display backgrounds in rows
const backgroundOptions = `
  <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
      ${backgrounds.solid.map(bg => `
        <div key="${bg.name}" style="text-align: center;">
          <div style="width: 50px; height: 50px; background: ${bg.value}; cursor: pointer; border-radius: 5px;" 
               onclick="document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: '${bg.name}' }))">
          </div>
          <small style="color: #5abb9a;">${bg.name}</small>
        </div>
      `).join('')}
    </div>
    <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; margin-top: 20px;">
      ${backgrounds.gradients.map(bg => `
        <div key="${bg.name}" style="text-align: center;">
          <div style="width: 50px; height: 50px; background: ${bg.value}; cursor: pointer; border-radius: 5px;" 
               onclick="document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: '${bg.name}' }))">
          </div>
          <small style="color: #5abb9a;">${bg.name}</small>
        </div>
      `).join('')}
    </div>
  </div>
`;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};