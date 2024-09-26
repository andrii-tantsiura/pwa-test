import { Container, Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export const Layout = () => {
  return (
    <div>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">{window.location.hostname}</Navbar.Brand>

          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Outlet />
    </div>
  );
};
