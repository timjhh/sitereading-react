import { Navbar, Dropdown, Container, Nav, NavDropdown, DropdownButton } from 'react-bootstrap';
import { ReactComponent as Settings } from './images/gear.svg'
import { React } from 'react';
function Navigation(props) {


  // const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  //   <Settings      
  //   ref={ref}
  //   onClick={e => {
  //     e.preventDefault();
  //     onClick(e);
  //   }} className='icon mx-2' fill='white' stroke='white' />
  // ));

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand>Sight Reader</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Single Note</Nav.Link>
              <Nav.Link href="#link">Scroller</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <Navbar.Text>Points: {props.points} Score: {props.total} Accuracy: {props.score}%</Navbar.Text>
          {props.volume}
          <NavDropdown title={<Settings fill='white' stroke='white' />}>
                <NavDropdown.Item onClick={props.resetScore}>Reset Score</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">
                  Separated link
                </NavDropdown.Item>
              </NavDropdown>
        </Container>
      </Navbar>

    </>

  );
}
export default Navigation;