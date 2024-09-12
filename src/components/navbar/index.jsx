import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Navbar.css'; // Para agregar estilos personalizados

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/profile">MiLogo</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink 
            exact 
            to="/profile" 
            activeClassName="active"
            className="nav-item"
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/carga" 
            activeClassName="active"
            className="nav-item"
          >
            Carga
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/servicios" 
            activeClassName="active"
            className="nav-item"
          >
            Servicios
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/tarjetas" 
            activeClassName="active"
            className="nav-item"
          >
            Tarjetas
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/actualizar" 
            activeClassName="active"
            className="nav-item"
          >
            Actualizar
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
