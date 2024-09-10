import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Hook para redirigir
import { FaEdit } from 'react-icons/fa';
import styles from './ServicioComponte.module.css';

// Función para formatear la fecha en formato dd-mm-yyyy
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses son indexados desde 0
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const ServicioComponte = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar si está cargando
  const navigate = useNavigate(); // Hook para navegar

  const fetchGastos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gastos'));
      const gastosList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const today = new Date();
        let fechaDebitar;

        // Convertir fecha desde Firestore a objeto Date
        if (typeof data.fecha === 'string') {
          fechaDebitar = new Date(data.fecha); // Convertir cadena de texto a Date
        } else {
          console.warn(`Formato de fecha no reconocido: ${data.fecha}`);
          return null; // Retornar null si el formato no es válido
        }

        // Verificar si la fecha es válida
        if (isNaN(fechaDebitar.getTime())) {
          console.error(`Fecha inválida para el gasto ID: ${doc.id}`);
          return null; // Retornar null si la fecha es inválida
        }

        const ciclo = parseInt(data.cantCiclo, 10); // Convertir a número entero

        // Verificar el valor de ciclo
        if (isNaN(ciclo) || ciclo <= 0) {
          console.error(`Valor de ciclo inválido para el gasto ID: ${doc.id}. Valor recibido: ${data.cantCiclo}`);
          return null; // Retornar null si el valor de ciclo es inválido
        }

        // Calcular la fecha más próxima
        let fechaProxima = new Date(fechaDebitar);
        console.log(`Fecha Debitar Inicial: ${fechaDebitar.toISOString()}`);
        console.log(`Ciclo: ${ciclo}`);

        // Si la fecha ya pasó, sumar ciclos completos hasta encontrar la próxima fecha futura
        while (fechaProxima < today) {
          fechaProxima.setDate(fechaProxima.getDate() + ciclo);
          console.log(`Fecha Proxima Calculada: ${fechaProxima.toISOString()}`);
        }

        // Verificar el valor de fechaProxima antes de convertirlo a formato dd-mm-yyyy
        if (isNaN(fechaProxima.getTime())) {
          console.error(`Fecha próxima inválida para el gasto ID: ${doc.id}`);
          return null; // Retornar null si la fecha próxima es inválida
        }

        return {
          id: doc.id,
          ...data,
          fechaProxima: formatDate(fechaProxima) // Formatear a dd-mm-yyyy
        };
      }).filter(gasto => gasto !== null); // Filtrar valores nulos

      setGastos(gastosList);
    } catch (error) {
      console.error("Error fetching gastos:", error);
    } finally {
      setLoading(false); // Deja de mostrar el loader cuando los datos están listos
    }
  };

  useEffect(() => {
    fetchGastos(); // Cargar los gastos cuando se monta el componente
  }, []);

  const handleEdit = (gastoId) => {
    // Redirige a la página de edición con el ID del gasto
    navigate(`/servicios/${gastoId}`);
  };

  return (
    <div className={styles.servicioContainer}>
      <h2>Gastos Creados</h2>
      {loading ? (
        <div className={styles.loader}></div>
      ) : (
        <div className={styles.gastosList}>
          {gastos.map(gasto => (
            <div key={gasto.id} className={styles.gastoCard} style={{ borderLeft: `5px solid ${gasto.color}` }}>
              <FaEdit 
                className={styles.editIcon} 
                onClick={() => handleEdit(gasto.id)} // Redirige a la página de edición
              />
              <h3>{gasto.nombreGasto}</h3>
              <p><strong>Monto:</strong> ${gasto.monto}</p>
              <p><strong>Fecha Próxima a Debitar:</strong> {gasto.fechaProxima}</p>
              {gasto.descripcion && <p><strong>Descripción:</strong> {gasto.descripcion}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicioComponte;
