import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Para agregar estilos personalizados
import { IoIosLogOut } from "react-icons/io";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.js"; // Configuración de firebase

const Navbar = () => {
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/profile">MiLogo</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink 
            exact="true" 
            to="/profile" 
            activeclassname="active"
            className="nav-item"
          >
            Inicio
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/carga" 
            activeclassname="active"
            className="nav-item"
          >
            Carga
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/servicios" 
            activeclassname="active"
            className="nav-item"
          >
            Servicios
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/tarjetas" 
            activeclassname="active"
            className="nav-item"
          >
            Tarjetas
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/prestamos" 
            activeclassname="active"
            className="nav-item"
          >
            Prestamos
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <IoIosLogOut /> Salir
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
