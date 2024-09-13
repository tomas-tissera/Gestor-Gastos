import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './AgregarBanco.module.css';

const AgregarBanco = ({ onClose }) => {
  const [nombreBanco, setNombreBanco] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreBanco) {
      alert("Por favor ingrese el nombre del banco.");
      return;
    }

    try {
      await addDoc(collection(db, "bancos"), { nombre: nombreBanco });
      alert("Banco añadido con éxito!");
      onClose();
    } catch (e) {
      console.error("Error al añadir banco: ", e);
      alert("Hubo un error al añadir el banco.");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Agregar Banco</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Nombre del banco:</label>
            <input 
              type="text" 
              value={nombreBanco} 
              onChange={(e) => setNombreBanco(e.target.value)} 
              required 
              className={styles.input}
            />
          </div>
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.button}>Añadir Banco</button>
            <button type="button" className={styles.button} onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarBanco;
