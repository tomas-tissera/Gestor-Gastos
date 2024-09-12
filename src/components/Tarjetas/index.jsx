// src/components/Tarjetas.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Tarjetas.module.css';
import Navbar from '../navbar';
import { useNavigate } from 'react-router-dom';
import AnimacionCarga from '../AnimacionCarga'; // Importar el componente de animación de carga

const Tarjetas = () => {
  const [tarjetas, setTarjetas] = useState([]);
  const [gastos, setGastos] = useState({});
  const [loading, setLoading] = useState(true); // Estado de carga
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
        setLoading(false); // Finalizar carga
      }
    };

    fetchData();
  }, []);

  const calcularPorcentajePagado = (cuotas, cuotasPagadas) => {
    return cuotas ? ((cuotasPagadas / cuotas) * 100).toFixed(2) : 0;
  };

  const handleEdit = (gastoId) => {
    navigate(`/tarjetas/${gastoId}`); // Reemplaza con la ruta adecuada para editar el gasto
  };

  if (loading) return <AnimacionCarga mensaje="Estamos cargando los datos"/>; // Mostrar animación de carga mientras se obtienen los datos

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {Object.keys(gastos).map(tarjetaNombre => (
          <div key={tarjetaNombre} className={styles.tarjetaContainer}>
            <h2 className={styles.tarjetaTitle}>{tarjetaNombre}</h2>
            {gastos[tarjetaNombre].map(gasto => (
              <div key={gasto.id} className={styles.gastoItem}>
                <h3>{gasto.nombreGasto || "Nombre del Gasto No Disponible"}</h3>
                <p><strong>Descripción:</strong> {gasto.descripcion || "No Disponible"}</p>
                <p><strong>Monto por cuota:</strong> ${gasto.valorCuota?.toFixed(2) || "No Disponible"}</p>
                <p><strong>Monto total:</strong> ${gasto.montoTotal?.toFixed(2) || "No Disponible"}</p>
                <p><strong>Fecha realizada:</strong> {new Date(gasto.fecha).toLocaleDateString() || "No Disponible"}</p>
                <p><strong>Cuotas:</strong> {gasto.cuotas || "No Disponible"}</p>
                <p><strong>Cuotas pagadas:</strong> {gasto.cuotasPagadas || "No Disponible"}</p>
                <p>
                  <strong>Porcentaje de cuotas pagadas:</strong> {gasto.cuotas && gasto.cuotasPagadas ? calcularPorcentajePagado(gasto.cuotas, gasto.cuotasPagadas) : "No Disponible"}%
                </p>
                <button className={styles.editButton} onClick={() => handleEdit(gasto.id)}>Editar Gasto</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default Tarjetas;
