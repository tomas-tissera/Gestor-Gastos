import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styles from './AgregarTarjeta.module.css';
import AgregarBanco from '../AgregarBanco';

const AgregarTarjeta = ({ onClose }) => {
  const [nombreTarjeta, setNombreTarjeta] = useState('');
  const [banco, setBanco] = useState('');
  const [bancos, setBancos] = useState([]);
  const [showAgregarBanco, setShowAgregarBanco] = useState(false);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bancos"));
        const bancosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBancos(bancosData);
      } catch (e) {
        console.error("Error al obtener bancos: ", e);
      }
    };

    fetchBancos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreTarjeta || !banco) {
      alert("Por favor completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "tarjetas"), {
        nombre: nombreTarjeta,
        banco,
      });
      alert('Tarjeta añadida con éxito!');
      setNombreTarjeta('');
      setBanco('');
      onClose();
    } catch (e) {
      console.error("Error al añadir tarjeta: ", e);
      alert("Hubo un error al cargar la tarjeta.");
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
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
            <label className={styles.label}>Seleccionar banco:</label>
            <select 
              value={banco} 
              onChange={(e) => setBanco(e.target.value)} 
              required 
              className={styles.input}
            >
              <option value="">Selecciona un banco</option>
              {bancos.map(banco => (
                <option key={banco.id} value={banco.id}>{banco.nombre}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <button 
              type="button" 
              onClick={() => setShowAgregarBanco(true)} 
              className={styles.button}
            >
              Agregar Banco
            </button>
          </div>
          <button type="submit" className={styles.button}>Añadir Tarjeta</button>
        </form>
        {showAgregarBanco && (
          <AgregarBanco onClose={() => setShowAgregarBanco(false)} />
        )}
      </div>
    </div>
  );
};

export default AgregarTarjeta;
