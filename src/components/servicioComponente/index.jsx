import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './ServicioComponte.module.css'; // Importar los estilos del module.css

const ServicioComponte = () => {
  const [gastos, setGastos] = useState([]);

  // Función para obtener los gastos de Firebase
  const fetchGastos = async () => {
    const querySnapshot = await getDocs(collection(db, 'gastos'));
    const gastosList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setGastos(gastosList);
  };

  useEffect(() => {
    fetchGastos(); // Cargar los gastos cuando se monta el componente
  }, []);

  return (
    <div className={styles.servicioContainer}>
      <h2>Gastos Creados</h2>
      <div className={styles.gastosList}>
        {gastos.map(gasto => (
          <div key={gasto.id} className={styles.gastoCard} style={{ borderLeft: `5px solid ${gasto.color}` }}>
            <h3>{gasto.nombreGasto}</h3>
            <p><strong>Monto:</strong> ${gasto.monto}</p>
            <p><strong>Fecha a Debitar:</strong> {gasto.fecha}</p>
            {gasto.descripcion && <p><strong>Descripción:</strong> {gasto.descripcion}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicioComponte;
