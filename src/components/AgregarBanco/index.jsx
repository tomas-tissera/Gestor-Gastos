import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './AgregarBanco.module.css';

const AgregarBanco = ({ onClose }) => {
  const [nombreBanco, setNombreBanco] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreBanco) {
      alert("Por favor ingresa el nombre del banco.");
      return;
    }

    try {
      await addDoc(collection(db, "bancos"), {
        nombre: nombreBanco,
      });
      alert('Banco añadido con éxito!');
      setNombreBanco('');
      onClose();
    } catch (e) {
      console.error("Error al añadir banco: ", e);
      alert("Hubo un error al cargar el banco.");
    }
  };

  return (
    <div className={styles.modal}>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
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
        <button type="submit" className={styles.button}>Añadir Banco</button>
        <button type="button" onClick={onClose} className={styles.button}>Cancelar</button>
      </form>
    </div>
  );
};

export default AgregarBanco;
