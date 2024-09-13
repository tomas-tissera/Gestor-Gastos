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

  const handlePago = async (prestamoId, cuotasPagadas, diaPago) => {
    setLoadingUpdate(prestamoId); // Muestra la animación de carga para el préstamo actual
    try {
      const prestamoRef = doc(db, "prestamos", prestamoId);
      const fechaHoy = new Date();
      let fechaPago = new Date(diaPago);

      // Crear una nueva fecha con un día adicional
      fechaPago.setUTCDate(fechaPago.getUTCDate() + 1);

      // Si la nueva fecha es menor que el primer día del mes actual, ajustar al primer día del próximo mes
      const primerDiaMesActual = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), 1);
      if (fechaPago < primerDiaMesActual) {
        fechaPago = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 1);
      }

      await updateDoc(prestamoRef, {
        cuotasPagadas: cuotasPagadas + 1,
        diaPago: fechaPago.toISOString() // Usar ISO string para actualizar
      });
      // Actualiza el estado del componente para reflejar los cambios
      setPrestamos(prestamos.map(p => p.id === prestamoId ? { ...p, cuotasPagadas: cuotasPagadas + 1, diaPago: fechaPago.toISOString() } : p));
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
            const isPaid = prestamo.cuotasPagadas >= prestamo.cuotas; // Verifica si el préstamo está completamente pagado
            return (
              <tr key={prestamo.id} className={isPaid ? styles.paidRow : ''}>
                <td>{bancoNombre}</td>
                <td>${prestamo.montoTotal}</td>
                <td>{prestamo.cuotas}</td>
                <td>{prestamo.cuotasPagadas}</td>
                <td>{prestamo.diaPago.substring(0, 10)}</td> {/* Muestra la fecha exacta en formato DD/MM/YYYY */}
                <td>
                  <Link to={`/prestamos/${prestamo.id}`} className={styles.editButton}>
                    <FaEdit />
                  </Link>
                </td>
                <td>
                  <button 
                    onClick={() => handlePago(prestamo.id, prestamo.cuotasPagadas, prestamo.diaPago)}
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
