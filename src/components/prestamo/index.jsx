// src/components/Prestamo.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from './Prestamo.module.css'; // Importa el archivo CSS
import { FaEdit, FaCheck } from 'react-icons/fa'; // Importa el ícono de Font Awesome

const Prestamo = () => {
  const [prestamos, setPrestamos] = useState([]);
  const [bancos, setBancos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(null); // Para la animación de carga

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

        // Obtener préstamos
        const prestamosSnapshot = await getDocs(collection(db, "prestamos"));
        const prestamosData = prestamosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPrestamos(prestamosData);
      } catch (e) {
        console.error("Error al obtener datos: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePago = async (prestamoId, cuotasPagadas) => {
    setLoadingUpdate(prestamoId); // Muestra la animación de carga para el préstamo actual
    try {
      const prestamoRef = doc(db, "prestamos", prestamoId);
      await updateDoc(prestamoRef, {
        cuotasPagadas: cuotasPagadas + 1
      });
      // Actualiza el estado del componente para reflejar los cambios
      setPrestamos(prestamos.map(p => p.id === prestamoId ? { ...p, cuotasPagadas: cuotasPagadas + 1 } : p));
    } catch (e) {
      console.error("Error al actualizar el préstamo: ", e);
    } finally {
      setLoadingUpdate(null); // Oculta la animación de carga
    }
  };

  if (loading) return <div className={styles.loaderContainer}><div className={styles.loader}></div></div>;

  return (
    <div className={styles.container}>
      <h1>Préstamos</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Banco</th>
            <th>Monto Pedido</th>
            <th>Cuotas</th>
            <th>Cuotas Pagadas</th>
            <th>Fecha de Pago</th>
            <th>Acción</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map(prestamo => {
            const bancoNombre = bancos.find(banco => banco.id === prestamo.banco)?.nombre || 'Desconocido';
            return (
              <tr key={prestamo.id}>
                <td>{bancoNombre}</td>
                <td>{prestamo.montoTotal}</td>
                <td>{prestamo.cuotas}</td>
                <td>{prestamo.cuotasPagadas}</td>
                <td>{new Date(prestamo.diaPago).toLocaleDateString()}</td>
                <td>
                  <Link to={`/prestamos/${prestamo.id}`} className={styles.editButton}>
                    Editar
                  </Link>
                </td>
                <td>
                  <button 
                    onClick={() => handlePago(prestamo.id, prestamo.cuotasPagadas)}
                    className={styles.pagoButton}
                    disabled={prestamo.cuotasPagadas >= prestamo.cuotas || loadingUpdate === prestamo.id}
                  >
                    {loadingUpdate === prestamo.id ? (
                      <div className={styles.loader}></div>
                    ) : (
                      <FaCheck />
                    )}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Prestamo;
