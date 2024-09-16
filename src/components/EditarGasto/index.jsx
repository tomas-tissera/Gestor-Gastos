import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './EditarGasto.module.css';

const EditarGasto = () => {
  const { id } = useParams(); // Obtener el ID del gasto desde la URL
  const navigate = useNavigate();
  const [gasto, setGasto] = useState({
    nombreGasto: '',
    monto: '',
    fecha: '',
    descripcion: '',
    color: '',
    cantCiclo: '' // Asegúrate de agregar este campo al estado
  });
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const fetchGasto = async () => {
      const docRef = doc(db, 'gastos', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Si la fecha es una cadena, recortar solo la parte YYYY-MM-DD
        if (data.fecha && typeof data.fecha === 'string') {
          data.fecha = data.fecha.split('T')[0]; // Extrae la parte YYYY-MM-DD
        }
        setGasto(data);
      } else {
        console.log("No such document!");
      }
      setLoading(false); // Dejar de mostrar el loader cuando los datos estén listos
    };
    fetchGasto();
  }, [id]);
  

  const handleChange = (e) => {
    setGasto({
      ...gasto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const docRef = doc(db, 'gastos', id);
    await updateDoc(docRef, gasto);
    navigate('/servicios'); // Volver a la página principal después de editar
  };

  return (
    <div className={styles.editarGastoContainer}>
      <h2>Editar Gasto</h2>
      {loading ? (
        <div className={styles.loader}></div> // Mostrar el spinner mientras carga
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Nombre del Gasto</label>
            <input
              type="text"
              name="nombreGasto"
              value={gasto.nombreGasto}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Monto</label>
            <input
              type="number"
              name="monto"
              value={gasto.monto}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Cant. días del Ciclo</label>
            <input
              type="number"
              name="cantCiclo" // Asegúrate de que el nombre del campo sea correcto
              value={gasto.cantCiclo}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Fecha a Debitar</label>
            <input
              type="date"
              name="fecha"
              value={gasto.fecha}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={gasto.descripcion}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Color</label>
            <input
              type="color"
              name="color"
              value={gasto.color}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={styles.btnSubmit}>Guardar Cambios</button>
        </form>
      )}
    </div>
  );
};

export default EditarGasto;
