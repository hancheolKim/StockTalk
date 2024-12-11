import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isVisible }) => {
  return (
    <div className={`navbar ${isVisible ? "visible" : "hidden"}`}>
      <Link to="/">
        <h2>GIANT ERP</h2>
      </Link>
      <div className="navbar-buttons">
        <Link to="/emp" className="navbar-item">
          인사관리
        </Link>
        <Link to="/item" className="navbar-item">
          재고관리
        </Link>
        <Link to="/sales" className="navbar-item">
          매출관리
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
