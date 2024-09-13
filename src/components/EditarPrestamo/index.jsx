// src/components/EditarPrestamo.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditarPrestamo.module.css';
import Navbar from '../navbar'; // Si tienes un componente Navbar

const EditarPrestamo = () => {
  const { prestamoId } = useParams();
  const [prestamo, setPrestamo] = useState(null);
  const [bancos, setBancos] = useState([]);
  const [nuevoBanco, setNuevoBanco] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingAddBanco, setLoadingAddBanco] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener bancos
        const bancosSnapshot = await getDocs(collection(db, "bancos"));
        const bancosData = bancosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBancos(bancosData);

        // Obtener préstamo
        const prestamoDoc = await getDoc(doc(db, "prestamos", prestamoId));
        if (prestamoDoc.exists()) {
          setPrestamo(prestamoDoc.data());
        } else {
          console.log("No existe el préstamo.");
        }
      } catch (e) {
        console.error("Error al obtener los datos: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [prestamoId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const prestamoRef = doc(db, "prestamos", prestamoId);
      await updateDoc(prestamoRef, {
        ...prestamo,
      });
      alert('Préstamo actualizado con éxito!');
      navigate('/prestamos');
    } catch (e) {
      console.error("Error al actualizar el préstamo: ", e);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleAddBanco = async () => {
    if (!nuevoBanco.trim()) return;
    setLoadingAddBanco(true);
    try {
      await addDoc(collection(db, "bancos"), { nombre: nuevoBanco });
      setBancos([...bancos, { nombre: nuevoBanco }]);
      setPrestamo({ ...prestamo, banco: nuevoBanco }); // Actualiza el banco seleccionado
      setNuevoBanco('');
    } catch (e) {
      console.error("Error al agregar el banco: ", e);
    } finally {
      setLoadingAddBanco(false);
    }
  };

  if (loading) return <div className={styles.loader}></div>;

  return (
    <>
      <Navbar />
      <div className={styles.formContainer}>
        <h2>Editar Préstamo</h2>
        <form onSubmit={handleUpdate}>
          <div className={styles.formGroup}>
            <label>Monto Total:</label>
            <input
              type="number"
              value={prestamo?.montoTotal || ''}
              onChange={(e) => setPrestamo({ ...prestamo, montoTotal: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Banco:</label>
            <select
              value={prestamo?.banco || ''}
              onChange={(e) => setPrestamo({ ...prestamo, banco: e.target.value })}
              className={styles.select}
            >
              <option value="">Seleccionar Banco</option>
              {bancos.map(banco => (
                <option key={banco.id} value={banco.id}>{banco.nombre}</option>
              ))}
            </select>
            <div className={styles.newBancoContainer}>
              <input
                type="text"
                value={nuevoBanco}
                onChange={(e) => setNuevoBanco(e.target.value)}
                placeholder="Agregar nuevo banco"
                className={styles.input}
              />
              <button
                type="button"
                onClick={handleAddBanco}
                className={styles.button}
                disabled={loadingAddBanco}
              >
                {loadingAddBanco ? <div className={styles.loader}></div> : 'Agregar Banco'}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Cantidad de Cuotas:</label>
            <input
              type="number"
              value={prestamo?.cuotas || ''}
              onChange={(e) => setPrestamo({ ...prestamo, cuotas: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Cuotas Pagas:</label>
            <input
              type="number"
              value={prestamo?.cuotasPagadas || ''}
              onChange={(e) => setPrestamo({ ...prestamo, cuotasPagadas: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Fecha de Pago:</label>
            <input
              type="date"
              value={prestamo?.diaPago.split('T')[0] || ''}
              onChange={(e) => setPrestamo({ ...prestamo, diaPago: e.target.value + 'T00:00:00.000Z' })}
              className={styles.input}
            />
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={loadingUpdate}
          >
            {loadingUpdate ? <div className={styles.loader}></div> : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditarPrestamo;
