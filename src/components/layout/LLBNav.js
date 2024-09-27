// 'use client'
import { Navbar, Container } from 'react-bootstrap'
import DarkModeSwitch from '@/components/layout/DarkModeSwitch'
import SignInOutButton from '@/components/SignInOutButton'

export default function LLBNav () {
  return (
    <Navbar expand='sm' sticky='top'>
      <Container fluid className='justify-content-end'>
        {/* <Navbar.Toggle /> */}
        {/* <Navbar.Collapse className="justify-content-end"> */}
        {/* <Nav> */}
        {/* <Nav.Link href="#"></Nav.Link> */}
        {/* </Nav> */}
        {/* </Navbar.Collapse> */}
        <SignInOutButton />
        <DarkModeSwitch />
      </Container>
    </Navbar>
  )
}
