import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

export const CustomNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light" collapseOnSelect expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">
          PWA
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav"></Navbar.Toggle>

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>

            <Nav.Link as={Link} to="/hospitalized">
              Госпіталізовані
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>

            <NavDropdown title="Resources">
              <NavDropdown.Item as={Link} to="/articles">
                Articles
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/courses">
                Courses
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
