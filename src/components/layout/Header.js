import React from "react";
import "./Header.css";

const Header = ({ toggleNavbar, isNavVisible }) => {
  return (
    <header className="header">
      <h1 className="header-title">My Application</h1>
      <button className="navbar-toggle" onClick={toggleNavbar}>
        {isNavVisible ? "닫기" : "메뉴"}
      </button>
    </header>
  );
};

export default Header;
