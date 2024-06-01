import { Navbar, Nav, Container } from 'react-bootstrap';

import DarkModeSwitch from './DarkModeSwitch';

export default function LLBNav() {

  return (
    <Navbar expand="sm" sticky="top" >
      <Container fluid>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav>
            {/* <Nav.Link href="#"></Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
        <DarkModeSwitch />
      </Container>
    </Navbar>
  )
}
