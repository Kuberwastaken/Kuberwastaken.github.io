import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const cssNakedDayMessage = "YOU GET NO THEMES ON CSS NAKED DAY LOL";

  return (
    <ThemeContext.Provider value={{ cssNakedDayMessage }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};