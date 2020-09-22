import React, { useContext, useState } from 'react'
import { Button, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, UncontrolledDropdown } from 'reactstrap'
import './Header.css'
import { HeaderContext, UserContext } from '../../App'
import { Link } from 'react-router-dom'
const Header = () => {

    const { username, logout, setAskForUsername, askForUsername } = useContext(UserContext)

    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const { showHeader } = useContext(HeaderContext)

    return (
        showHeader && (
            <header className="container sticky-top">
                <Navbar expand="md" light>
                    <NavbarBrand tag={Link} to="/" className="mx-2 text-primary">
                        qavm
                </NavbarBrand>
                    <NavbarToggler onClick={toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav navbar className="ml-auto">
                            <NavItem>
                                <Link to="/join" className="mx-2 text-primary">
                                    Join a meeting
                            </Link>
                            </NavItem>
                            <NavItem>
                                <Link to="/host" className="mx-2 text-primary">
                                    Host a meeting
                            </Link>
                            </NavItem>
                        </Nav>
                    </Collapse>
                    <Collapse isOpen={isOpen} navbar>
                        <Nav navbar className="ml-auto">
                            {!username ? (
                                <NavItem>
                                    <Button color="primary" style={{ borderRadius: 75, overflow: "none" }} onClick={e => { setAskForUsername(true) }}>
                                        Get Started
                                </Button>
                                </NavItem>
                            ) : (
                                    <NavItem>
                                        <UncontrolledDropdown >
                                            <DropdownToggle nav caret>
                                                {username}
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem onClick={e => { logout(); setAskForUsername(true); }}>
                                                    Not {username}?
                                            </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </NavItem>
                                )
                            }
                        </Nav>
                    </Collapse>
                </Navbar>
            </header>
        )
    )
}

export default Header