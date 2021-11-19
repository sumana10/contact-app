//TODO: Done set NavbarBrand to go to home page and export Header

import React from "react";
import { Navbar, NavbarBrand, NavbarText } from "reactstrap";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Navbar color="info" light>
      <NavbarBrand tag={Link} to="/" className="text-white" style={{cursor:"pointer"}}>Firebase Contact App</NavbarBrand>
      <NavbarText className="text-white float-right">
        Contact app
      </NavbarText>
    </Navbar>
  );
};
export default Header