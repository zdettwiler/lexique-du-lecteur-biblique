import { Navbar, Container } from 'react-bootstrap';
import DarkModeSwitch from './DarkModeSwitch';

export default function LLBNav() {

  return (
    <Navbar>
      <Container>
        {/* <Navbar.Brand href="#home">Navbar with text</Navbar.Brand> */}
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <DarkModeSwitch />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
