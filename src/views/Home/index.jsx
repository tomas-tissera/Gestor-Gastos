// src/components/Home.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from './Home.module.css';
import ProgressBar from '../../components/ProgressBar'; // Asegúrate de tener este componente creado

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Home = () => {
  const [gastosServicios, setGastosServicios] = useState([]);
  const [gastosTarjeta, setGastosTarjeta] = useState([]);
  const [tarjetas, setTarjetas] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener gastos de servicios
        const gastosSnapshot = await getDocs(collection(db, "gastos"));
        const gastosData = gastosSnapshot.docs.map(doc => doc.data());
        setGastosServicios(gastosData);

        // Obtener gastos por tarjeta
        const gastosTarjetaSnapshot = await getDocs(collection(db, "gastosTarjeta"));
        const gastosTarjetaData = gastosTarjetaSnapshot.docs.map(doc => doc.data());
        setGastosTarjeta(gastosTarjetaData);

        // Obtener tarjetas
        const tarjetasSnapshot = await getDocs(collection(db, "tarjetas"));
        const tarjetasData = tarjetasSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[data.id] = data.nombre; // Guardar nombre de la tarjeta usando el ID
          return acc;
        }, {});
        setTarjetas(tarjetasData);

      } catch (e) {
        console.error("Error al obtener datos: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calcular porcentaje de cuotas pagadas
  const calcularPorcentajePagado = (cuotas, cuotasPagadas) => {
    return cuotas ? ((cuotasPagadas / cuotas) * 100).toFixed(2) : 0;
  };

  // Preparar datos para gráficos
  const prepararDatosServicios = () => {
    const nombresGasto = gastosServicios.map(gasto => gasto.nombreGasto);
    const montos = gastosServicios.map(gasto => parseFloat(gasto.monto));
    const colores = gastosServicios.map(gasto => gasto.color || '#FF6F0F'); // Color por defecto si no está especificado

    const totalMonto = montos.reduce((acc, monto) => acc + monto, 0);

    return {
      labels: nombresGasto,
      datasets: [{
        label: 'Monto de Gastos de Servicios',
        data: montos,
        backgroundColor: colores,
      }],
      totalMonto: isNaN(totalMonto) ? 0 : parseFloat(totalMonto.toFixed(2))
    };
  };

  const prepararDatosTarjetas = () => {
    const tarjetaGastos = gastosTarjeta.reduce((acc, gasto) => {
      
      const tarjetaNombre = tarjetas.undefined || 'Desconocida'; // Obtener nombre de la tarjeta
      
      if (!acc[tarjetaNombre]) {
        acc[tarjetaNombre] = { total: 0, detalles: [] };
      }
      acc[tarjetaNombre].total += parseFloat(gasto.valorCuota);
      acc[tarjetaNombre].detalles.push({
        id: gasto.id,
        nombre: gasto.nombreGasto,
        monto: parseFloat(gasto.valorCuota),
        cuotas: gasto.cuotas,
        cuotasPagadas: gasto.cuotasPagadas
      });
      return acc;
    }, {});

    return Object.keys(tarjetaGastos).map(tarjetaNombre => ({
      nombre: tarjetaNombre,
      ...tarjetaGastos[tarjetaNombre]
    }));
  };

  const datosServicios = prepararDatosServicios();
  const tarjetasData = prepararDatosTarjetas();

  if (loading) return <div className={styles.loader}></div>; // Reemplaza con tu componente de carga si es necesario

  return (
    <div className={styles.container}>
      <h1>Estadísticas y Datos Útiles</h1>

      <div className={styles.chartContainer}>
        <h2 className={styles.chartContainerTitle}>Total de Gastos de Servicios</h2>
        <div className={styles.pieContainer}>
          <Pie
            data={{
              labels: datosServicios.labels,
              datasets: [datosServicios.datasets[0]]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                tooltip: {
                  callbacks: {
                    label: (tooltipItem) => {
                      return `${tooltipItem.label}: $${tooltipItem.raw}`;
                    }
                  }
                },
              }
            }}
          />
          <div className={styles.totalMonto}>
            <p>Total: ${datosServicios.totalMonto}</p>
          </div>
        </div>
      </div>

      <div className={styles.gastosTarjetaContainer}>
        <h2>Gastos por Tarjeta</h2>
        {tarjetasData.map(tarjeta => (
          <div key={tarjeta.nombre} className={styles.tarjetaContainer}>
            <h3>{tarjeta.nombre}</h3>
            <ul className={styles.gastosList}>
              {tarjeta.detalles.map(detalle => {
                const porcentaje = calcularPorcentajePagado(detalle.cuotas, detalle.cuotasPagadas);
                return (
                  <li key={detalle.id} className={styles.gastoItem}>
                    <span className={styles.gastoNombre}>{detalle.nombre}</span>
                    <span className={styles.gastoMonto}>${detalle.monto.toFixed(2)}</span>
                    <ProgressBar porcentaje={porcentaje} /> {/* Usa el nuevo componente aquí */}
                  </li>
                );
              })}
            </ul>
            <div className={styles.totalContainer}>
              <h4>Total de Gastos:</h4>
              <p className={styles.totalMonto}>${tarjeta.total.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
