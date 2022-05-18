import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import React from "react";
import { Nav, Navbar, Container } from "react-bootstrap";
function NavCreate() {
  let navigate = useNavigate();
  function Logout() {
    signOut(auth);
    return navigate("/login");
  }

  const [expanded, setExpanded] = React.useState(false);
  return (
    <Navbar expanded={expanded} bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Blog Website</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="h6">
            <Nav.Link>
              <Link
                className="d-block text-decoration-none text-muted"
                to="/blog"
                onClick={() => setExpanded(false)}
              >
                Home
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link
                className="d-block text-decoration-none text-muted"
                to="/create"
                onClick={() => setExpanded(false)}
              >
                Create
              </Link>
            </Nav.Link>
            <Nav.Link onClick={Logout} className="text-danger">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavCreate;
