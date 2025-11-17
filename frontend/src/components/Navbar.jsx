import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Akatsuki Food</Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link as={Link} to="/">Menu</Nav.Link>
          <Nav.Link as={Link} to="/cart">Keranjang</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
}
