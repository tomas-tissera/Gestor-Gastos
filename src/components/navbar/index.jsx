import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css'; // Para agregar estilos personalizados

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MiLogo</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink 
            exact 
            to="/" 
            activeClassName="active"
            className="nav-item"
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about" 
            activeClassName="active"
            className="nav-item"
          >
            Acerca de
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/services" 
            activeClassName="active"
            className="nav-item"
          >
            Servicios
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contact" 
            activeClassName="active"
            className="nav-item"
          >
            Contacto
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
