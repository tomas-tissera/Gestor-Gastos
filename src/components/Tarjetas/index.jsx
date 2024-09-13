import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Tarjetas.module.css';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../ProgressBar'; // Importa el nuevo componente
import { FaEdit } from 'react-icons/fa'; // Importa el ícono de edición
import AnimacionCarga from '../AnimacionCarga';

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

  const calcularTotalCuotasTarjeta = (gastos) => {
    return gastos.reduce((total, gasto) => {
      const valorCuota = Number(gasto.valorCuota);
      const cuotasPagadas = Number(gasto.cuotasPagadas);
      const cuotas = Number(gasto.cuotas);

      // Solo sumar el valor de la cuota si hay cuotas no pagadas
      if (cuotas > cuotasPagadas) {
        return total + (valorCuota || 0);
      }
      return total;
    }, 0);
  };

  const handleEditGasto = (gastoId) => {
    navigate(`/tarjetas/${gastoId}`);
  };

  const handleEditTarjeta = (tarjetaId) => {
    navigate(`/tarjetas/editarTarjeta/${tarjetaId}`);
  };

  if (loading) return <div className={styles.loader}></div>;

  return (
    <div className={styles.container}>
      {tarjetas.map(tarjeta => {
        const gastosTarjeta = gastos[tarjeta.nombre] || [];
        const totalCuotasTarjeta = calcularTotalCuotasTarjeta(gastosTarjeta);

        return (
          <div key={tarjeta.id} className={styles.tarjetaContainer}>
            <div className={styles.editIcon} onClick={() => handleEditTarjeta(tarjeta.id)}>
              <FaEdit />
            </div>
            <h2 className={styles.tarjetaTitle}>{tarjeta.nombre}</h2>

            {/* Mostrar el total de las cuotas de la tarjeta */}
            <p className={styles.totalCuotasTarjeta}>
              <strong>Total de cuotas de la tarjeta:</strong> ${totalCuotasTarjeta.toFixed(2)}
            </p>

            {gastosTarjeta.map(gasto => {
              const porcentaje = calcularPorcentajePagado(gasto.cuotas, gasto.cuotasPagadas);

              // Convertir valor de la cuota y monto total a número y asegurar que sean válidos
              const valorCuota = Number(gasto.valorCuota);
              const montoTotal = Number(gasto.montoTotal);

              // Determinar si el gasto está completamente pagado
              const isPagado = gasto.cuotas === gasto.cuotasPagadas;

              return (
                <div key={gasto.id} className={`${styles.gastoItem} ${isPagado ? styles.pagado : ''}`}>
                  <hr />
                  <div>
                    <h3>{gasto.nombreGasto || "Nombre del Gasto No Disponible"}</h3>
                    <p><strong>Descripción:</strong> {gasto.descripcion || "No Disponible"}</p>

                    {/* Verificar si el valor de la cuota es un número antes de usar .toFixed() */}
                    <p><strong>Monto por cuota:</strong> 
                      {!isNaN(valorCuota) ? `$${valorCuota.toFixed(2)}` : "No Disponible"}
                    </p>

                    {/* Monto total del gasto */}
                    <p><strong>Monto total:</strong> 
                      {!isNaN(montoTotal) ? `$${montoTotal.toFixed(2)}` : "No Disponible"}
                    </p>

                    <p><strong>Cuotas:</strong> {gasto.cuotas || "No Disponible"}</p>
                    <p><strong>Cuotas pagadas:</strong> {gasto.cuotasPagadas || "No Disponible"}</p>
                    <ProgressBar porcentaje={porcentaje} />
                    <button className={styles.editButton} onClick={() => handleEditGasto(gasto.id)}>Editar Gasto</button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Tarjetas;
