"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const DarkModeContext = createContext();

const themeFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const isDarkMode = JSON.parse(localStorage.getItem('isDarkMode'));
    return isDarkMode || false;
  } else { return false }
}

const DarkModeProvider = ({ children }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    document.querySelector('html').setAttribute('data-bs-theme', isDarkMode ? 'dark' : 'light');
    return children;
  }
}

export default function DarkModeContextProvider({ children }) {
  const [isDarkMode, setDarkMode] = useState(() => {
    return themeFromLocalStorage();
  });

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode)
  }, [isDarkMode]);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <DarkModeProvider>
        { children }
      </DarkModeProvider>
    </DarkModeContext.Provider>
  );
}


