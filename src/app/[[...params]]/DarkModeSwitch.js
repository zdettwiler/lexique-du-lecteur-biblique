import React, { useContext } from 'react';
import { DarkModeContext } from './DarkMode';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export default function DarkModeSwitch() {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div onClick={toggleDarkMode}>
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip>
            Passer au mode {isDarkMode ? 'clair' : 'sombre'}
          </Tooltip>
        }
      ><span>{isDarkMode ? "🌛" : "🌞"}</span></OverlayTrigger>
    </div>
  )
}
