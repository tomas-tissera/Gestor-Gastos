import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom'; // Hook para redirigir
import { FaEdit } from 'react-icons/fa';
import styles from './ServicioComponte.module.css';

const ServicioComponte = () => {
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar si está cargando
  const navigate = useNavigate(); // Hook para navegar

  const fetchGastos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gastos'));
      const gastosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
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
              <p><strong>Fecha a Debitar:</strong> {gasto.fecha}</p>
              {gasto.descripcion && <p><strong>Descripción:</strong> {gasto.descripcion}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicioComponte;
