import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const VisualEQNavBar = function VisualEQNavBarFunction() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">VisualEQ Viewer</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/npc">NPCs</Nav.Link>
          <Nav.Link as={Link} to="/item">Item</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default VisualEQNavBar