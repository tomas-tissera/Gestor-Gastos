// src/components/Tarjetas.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Tarjetas.module.css';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar'; // Importa el nuevo componente
import { FaEdit } from 'react-icons/fa'; // Importa el ícono de edición

const Tarjetas = () => {
  const [tarjetas, setTarjetas] = useState([]);
  const [gastos, setGastos] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener tarjetas
        const tarjetasSnapshot = await getDocs(collection(db, "tarjetas"));
        const tarjetasData = tarjetasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Obtener gastos
        const gastosSnapshot = await getDocs(collection(db, "gastosTarjeta"));
        const gastosData = gastosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Agrupar gastos por nombre de tarjeta
        const groupedGastos = gastosData.reduce((acc, gasto) => {
          const tarjeta = tarjetasData.find(tarjeta => tarjeta.id === gasto.tarjeta);
          const tarjetaNombre = tarjeta ? tarjeta.nombre : "Sin Nombre";

          if (!acc[tarjetaNombre]) {
            acc[tarjetaNombre] = [];
          }
          acc[tarjetaNombre].push(gasto);
          return acc;
        }, {});

        setTarjetas(tarjetasData);
        setGastos(groupedGastos);
      } catch (e) {
        console.error("Error al obtener datos: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calcularPorcentajePagado = (cuotas, cuotasPagadas) => {
    return cuotas ? ((cuotasPagadas / cuotas) * 100).toFixed(2) : 0;
  };

  const handleEditGasto = (gastoId) => {
    navigate(`/tarjetas/${gastoId}`);
  };

  const handleEditTarjeta = (tarjetaId) => {
    navigate(`/tarjetas/editarTarjeta/${tarjetaId}`); // Redirige a la página de edición de tarjeta
  };

  if (loading) return <div className={styles.loader}></div>;

  return (
    <div className={styles.container}>
      {tarjetas.map(tarjeta => (
        <div key={tarjeta.id} className={styles.tarjetaContainer}>
          <div className={styles.editIcon} onClick={() => handleEditTarjeta(tarjeta.id)}>
            <FaEdit />
          </div>
          <h2 className={styles.tarjetaTitle}>{tarjeta.nombre}</h2>
          {gastos[tarjeta.nombre]?.map(gasto => {
            const porcentaje = calcularPorcentajePagado(gasto.cuotas, gasto.cuotasPagadas);
            return (
              <div key={gasto.id} className={styles.gastoItem}>
                <h3>{gasto.nombreGasto || "Nombre del Gasto No Disponible"}</h3>
                <p><strong>Descripción:</strong> {gasto.descripcion || "No Disponible"}</p>
                <p><strong>Monto por cuota:</strong> ${gasto.valorCuota?.toFixed(2) || "No Disponible"}</p>
                <p><strong>Monto total:</strong> ${gasto.montoTotal?.toFixed(2) || "No Disponible"}</p>
                <p><strong>Fecha realizada:</strong> {new Date(gasto.fecha).toLocaleDateString() || "No Disponible"}</p>
                <p><strong>Cuotas:</strong> {gasto.cuotas || "No Disponible"}</p>
                <p><strong>Cuotas pagadas:</strong> {gasto.cuotasPagadas || "No Disponible"}</p>
                <ProgressBar porcentaje={porcentaje} />
                <button className={styles.editButton} onClick={() => handleEditGasto(gasto.id)}>Editar Gasto</button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Tarjetas;
