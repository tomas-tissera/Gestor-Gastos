// src/components/EditarGasto.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './EditarGastoTarjeta.module.css';
import AnimacionCarga from '../AnimacionCarga'; // Importar el componente de animación de carga
import Navbar from '../navbar';
const EditarGasto = () => {
  const { gastoId } = useParams();
  const navigate = useNavigate();
  const [gasto, setGasto] = useState(null);
  const [tarjetaNombre, setTarjetaNombre] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, 'gastosTarjeta', gastoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const gastoData = docSnap.data();
          setGasto(gastoData);

          // Obtener el nombre de la tarjeta
          const tarjetaRef = doc(db, 'tarjetas', gastoData.tarjeta);
          const tarjetaSnap = await getDoc(tarjetaRef);
          if (tarjetaSnap.exists()) {
            setTarjetaNombre(tarjetaSnap.data().nombre);
          }
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error getting document: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gastoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGasto((prevGasto) => ({
      ...prevGasto,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'gastosTarjeta', gastoId);
      await updateDoc(docRef, gasto);
      navigate('/tarjetas'); // Redirige a la vista de tarjetas después de guardar
    } catch (e) {
      console.error("Error updating document: ", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <AnimacionCarga mensaje="Cargando"/>; // Mostrar animación de carga mientras se actualiza

  if (!gasto) return <p>Loading...</p>;

  return (
    <>
    <Navbar/>
    <div className={styles.container}>
      <h1>Editar Gasto</h1>
      <div className={styles.formGroup}>
        <label htmlFor="nombreGasto">Nombre del Gasto</label>
        <input
          type="text"
          id="nombreGasto"
          name="nombreGasto"
          value={gasto.nombreGasto}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={gasto.descripcion}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="montoTotal">Monto Total</label>
        <input
          type="number"
          id="montoTotal"
          name="montoTotal"
          value={gasto.montoTotal}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="valorCuota">Valor de Cuota</label>
        <input
          type="number"
          id="valorCuota"
          name="valorCuota"
          value={gasto.valorCuota}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="cuotas">Cantidad de Cuotas</label>
        <input
          type="number"
          id="cuotas"
          name="cuotas"
          value={gasto.cuotas}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="cuotasPagadas">Cantidad de Cuotas Pagadas</label>
        <input
          type="number"
          id="cuotasPagadas"
          name="cuotasPagadas"
          value={gasto.cuotasPagadas || ''}
          onChange={handleChange}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Tarjeta</label>
        <p>{tarjetaNombre || "Nombre de tarjeta no disponible"}</p>
      </div>
      <button className={styles.button} onClick={handleSave}>Guardar</button>
    </div>
    </>
  );
};

export default EditarGasto;
