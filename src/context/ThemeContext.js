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

  // CSS Naked Day: No styles applied
  useEffect(() => {
    // No styles for CSS Naked Day
    return () => {
      // No cleanup needed
    };
  }, []);

  const applyBackground = (color) => {
    // CSS Naked Day: No background styles applied
    console.log('Theme selected (not applied for CSS Naked Day):', color);
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
  <table cellpadding="10" cellspacing="0" border="0" align="center">
    <tr>
      <td>
        <table cellpadding="5" cellspacing="0" border="0" align="center">
          <tr>
            ${backgrounds.solid.map(bg => `
              <td align="center">
                <table width="50" height="50" cellpadding="0" cellspacing="0" border="1" bgcolor="${bg.value}" 
                     onclick="document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: '${bg.name}' }))">
                  <tr><td>&nbsp;</td></tr>
                </table>
                <small><font color="#5abb9a">${bg.name}</font></small>
              </td>
            `).join('')}
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <table cellpadding="5" cellspacing="0" border="0" align="center">
          <tr>
            ${backgrounds.gradients.map(bg => `
              <td align="center">
                <table width="50" height="50" cellpadding="0" cellspacing="0" border="1" bgcolor="${bg.value}" 
                     onclick="document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: '${bg.name}' }))">
                  <tr><td>&nbsp;</td></tr>
                </table>
                <small><font color="#5abb9a">${bg.name}</font></small>
              </td>
            `).join('')}
          </tr>
        </table>
      </td>
    </tr>
  </table>
`;

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};