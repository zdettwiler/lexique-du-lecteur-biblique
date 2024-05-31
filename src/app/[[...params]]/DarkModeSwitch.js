import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function DarkModeSwitch() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    let darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.querySelector('html').setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    setIsDarkMode(darkMode);
  }, []);

  function toggleMode() {
    const mode = !isDarkMode;
    setIsDarkMode(mode);
    document.querySelector('html').setAttribute('data-bs-theme', mode ? 'dark' : 'light');
  }

  return (
    <div onClick={toggleMode}>
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip>
            Passer au mode {isDarkMode ? 'clair' : 'sombre'}
          </Tooltip>
        }
      ><span>{isDarkMode ? "🌛" : "🌞"}</span></OverlayTrigger>
    </div>
  )
}
