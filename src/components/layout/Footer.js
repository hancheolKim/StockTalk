import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <h1>My Application</h1>
      <p>
        &copy; {new Date().getFullYear()} My Application. All rights reserved.
      </p>
      <p>
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          개인정보 처리방침
        </a>
        {" | "}
        <a href="https://www.example.com" target="_blank" rel="noopener noreferrer">
          이용약관
        </a>
      </p>
    </footer>
  );
};

export default Footer;
