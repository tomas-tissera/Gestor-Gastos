import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './AgregarTarjeta.module.css';

const AgregarTarjeta = ({ onClose }) => {
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [fechaPago, setFechaPago] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombreTarjeta || !fechaPago) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      await addDoc(collection(db, "tarjetas"), {
        nombre: nombreTarjeta,
        fechaPago: new Date(fechaPago).toISOString(),
      });
      alert('Tarjeta añadida con éxito!');
      onClose(); // Cierra el formulario después de agregar la tarjeta
    } catch (e) {
      console.error("Error al añadir tarjeta: ", e);
      alert("Hubo un error al añadir la tarjeta.");
    }
  };

  return (
    <div className={styles.overlay}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre de la tarjeta:</label>
          <input 
            type="text" 
            value={nombreTarjeta} 
            onChange={(e) => setNombreTarjeta(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Fecha de pago:</label>
          <input 
            type="date" 
            value={fechaPago} 
            onChange={(e) => setFechaPago(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Añadir Tarjeta</button>
        <button type="button" onClick={onClose} className={styles.button}>Cancelar</button>
      </form>
    </div>
  );
};

export default AgregarTarjeta;
