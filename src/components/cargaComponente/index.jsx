import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './CargaComp.module.css';  // Importar los estilos

const CargaComp = () => {
  const [nombreGasto, setNombreGasto] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [color, setColor] = useState('#000000');
  const [cantCiclo, setCantCiclo] = useState("0");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombreGasto || !monto || !fecha) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    // Convertir la fecha seleccionada al formato adecuado
    const formattedFecha = new Date(fecha).toISOString();  // "2024-10-10T00:00:00.000Z"

    try {
      const docRef = await addDoc(collection(db, "gastos"), {
        nombreGasto,
        monto: parseFloat(monto),
        fecha: formattedFecha,
        descripcion,
        color,
        cantCiclo
      });
      alert(`Gasto añadido con éxito! ID: ${docRef.id}`);
      setNombreGasto('');
      setMonto('');
      setFecha('');
      setDescripcion('');
      setColor('#000000');
      setCantCiclo("0")
    } catch (e) {
      console.error("Error al añadir gasto: ", e);
      alert("Hubo un error al cargar el gasto.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.formGroup}>
        <label className={styles.label}>Nombre del gasto:</label>
        <input 
          type="text" 
          value={nombreGasto} 
          onChange={(e) => setNombreGasto(e.target.value)} 
          required 
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Monto:</label>
        <input 
          type="number" 
          value={monto} 
          onChange={(e) => setMonto(e.target.value)} 
          required 
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Fecha a debitar:</label>
        <input 
          type="date" 
          value={fecha} 
          onChange={(e) => setFecha(e.target.value)} 
          required 
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Descripción:</label>
        <textarea 
          value={descripcion} 
          onChange={(e) => setDescripcion(e.target.value)} 
          className={styles.textarea}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Cant. dias de Ciclo:</label>
        <input 
          type="number" 
          value={cantCiclo} 
          onChange={(e) => setCantCiclo(e.target.value)} 
          required 
          className={styles.input}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Color:</label>
        <input 
          type="color" 
          value={color} 
          onChange={(e) => setColor(e.target.value)} 
          className={styles.input}
        />
      </div>
      <button type="submit" className={styles.button}>Añadir Gasto</button>
    </form>
  );
};

export default CargaComp;
