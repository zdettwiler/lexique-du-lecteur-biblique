import React from 'react';
import { Form } from 'react-bootstrap';

export default function DarkModeSwitch() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  function toggleMode() {
    const mode = !isDarkMode;
    setIsDarkMode(mode);
    document.querySelector('html').setAttribute('data-bs-theme', mode ? 'dark' : 'light');
  }
  return (
    <div onClick={toggleMode}>
      {isDarkMode ? "🌛" : "🌞"}
    </div>
  )
}
