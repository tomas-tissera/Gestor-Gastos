// src/components/EditarPrestamo.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import styles from './EditarPrestamo.module.css';
import Navbar from '../navbar'; // Si tienes un componente Navbar

const EditarPrestamo = () => {
  const { prestamoId } = useParams();
  const [prestamo, setPrestamo] = useState(null);
  const [bancos, setBancos] = useState([]);
  const [nuevoBanco, setNuevoBanco] = useState('');
  const [nuevoPago, setNuevoPago] = useState(0);
  const [fechaPago, setFechaPago] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingAddBanco, setLoadingAddBanco] = useState(false);
  const [loadingAddPago, setLoadingAddPago] = useState(false); // Para manejar el estado del botón de agregar pago

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

  const handleAddPago = async () => {
    if (!nuevoPago || !fechaPago) return;
    setLoadingAddPago(true);
    try {
      const prestamoRef = doc(db, "prestamos", prestamoId);

      // Agregar el pago al historial de pagos
      const nuevoHistorialPago = {
        monto: parseFloat(nuevoPago),
        fecha: fechaPago,
      };

      const nuevoMontoPagado = prestamo.montoPagado + parseFloat(nuevoPago);

      await updateDoc(prestamoRef, {
        montoPagado: nuevoMontoPagado,
        historialPagos: [...(prestamo.historialPagos || []), nuevoHistorialPago],
        cuotasPagadas: (prestamo.cuotasPagadas || 0) + 1 // Incrementar la cantidad de cuotas pagadas
      });

      // Actualizar el estado con el nuevo total y limpiar los campos
      setPrestamo({
        ...prestamo,
        montoPagado: nuevoMontoPagado,
        historialPagos: [...(prestamo.historialPagos || []), nuevoHistorialPago],
        cuotasPagadas: (prestamo.cuotasPagadas || 0) + 1
      });

      setNuevoPago(0);
      setFechaPago('');
    } catch (e) {
      console.error("Error al agregar el pago: ", e);
    } finally {
      setLoadingAddPago(false);
    }
  };

  const handleDeletePago = async (pago) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este pago?")) {
      try {
        console.log("Pago a eliminar:", pago);
  
        // Filtrar el historial de pagos para eliminar el pago seleccionado
        const nuevoHistorialPagos = prestamo.historialPagos.filter(p => {
          console.log(`Comparando pago con fecha: ${p.fecha} y monto: ${p.monto}`);
          return !(p.fecha === pago.fecha && p.monto === pago.monto);
        });
  
        console.log("Nuevo historial de pagos:", nuevoHistorialPagos);
  
        // Calcular el nuevo monto pagado y la cantidad de cuotas pagadas
        const montoRestante = (prestamo.montoPagado || 0) - pago.monto;
        const nuevasCuotasPagadas = (prestamo.cuotasPagadas || 0) - 1;
  
        console.log(`Nuevo monto pagado: ${montoRestante}, Nuevas cuotas pagadas: ${nuevasCuotasPagadas}`);
  
        // Referencia al documento del préstamo en Firestore
        const prestamoRef = doc(db, "prestamos", prestamoId);
  
        // Actualizar el documento en Firestore
        await updateDoc(prestamoRef, {
          montoPagado: montoRestante,
          historialPagos: nuevoHistorialPagos,
          cuotasPagadas: nuevasCuotasPagadas
        });
  
        // Actualizar el estado local con los cambios
        setPrestamo(prevPrestamo => ({
          ...prevPrestamo,
          montoPagado: montoRestante,
          historialPagos: nuevoHistorialPagos,
          cuotasPagadas: nuevasCuotasPagadas
        }));
  
        alert("Pago eliminado con éxito.");
      } catch (e) {
        console.error("Error al eliminar el pago: ", e);
      }
    }
  };
  
  if (loading) return <div className={styles.loader}></div>;

  return (
    <>
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
              value={prestamo?.cuotas || 0}
              onChange={(e) => setPrestamo({ ...prestamo, cuotas: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Cuotas Pagas:</label>
            <input
              type="number"
              value={prestamo?.cuotasPagadas || 0}
              onChange={(e) => setPrestamo({ ...prestamo, cuotasPagadas: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Monto pagado:</label>
            <input
              type="number"
              value={prestamo?.montoPagado || 0}
              onChange={(e) => setPrestamo({ ...prestamo, montoPagado: parseInt(e.target.value) })}
              className={styles.input}
            />
          </div>
          {/* Sección para agregar nuevos pagos */}
          <div className={styles.newPagoContainer}>
            <input
              type="number"
              value={nuevoPago}
              onChange={(e) => setNuevoPago(e.target.value)}
              placeholder="Agregar nuevo Pago"
              className={styles.input}
            />
            <input
              type="date"
              value={fechaPago}
              onChange={(e) => setFechaPago(e.target.value)}
              className={styles.input}
            />
            <button
              type="button"
              onClick={handleAddPago}
              className={styles.button}
              disabled={loadingAddPago}
            >
              {loadingAddPago ? <div className={styles.loader}></div> : 'Agregar Pago'}
            </button>
          </div>
          {/* Historial de pagos */}
          <div className={styles.pagosContainer}>
            <h3>Historial de Pagos</h3>
            {prestamo?.historialPagos && prestamo.historialPagos.length > 0 ? (
              <ul>
                {prestamo.historialPagos.map((pago, index) => (
                  <li key={index}>
                    {`Monto: ${pago.monto}, Fecha: ${pago.fecha}`}
                    <button
                      onClick={() => handleDeletePago(pago)}
                      className={styles.deleteButton}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay pagos registrados.</p>
            )}
          </div>
          <button
            type="submit"
            className={styles.button}
            disabled={loadingUpdate}
          >
            {loadingUpdate ? <div className={styles.loader}></div> : 'Actualizar Préstamo'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditarPrestamo;
