import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
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
      const gastosList = await Promise.all(querySnapshot.docs.map(async docSnap => {
        const data = docSnap.data();
        const today = new Date();
        let fechaDebitar = new Date(data.fecha); // Intentar convertir fecha

        // Manejar errores en fecha inválida, asignando fecha actual si es necesario
        if (isNaN(fechaDebitar.getTime())) {
          console.error(`Fecha inválida para el gasto ID: ${docSnap.id}, usando fecha actual.`);
          fechaDebitar = today; // Usar fecha actual si la original es inválida
        }

        const ciclo = parseInt(data.cantCiclo, 10);

        // Manejar errores en el ciclo, asignando ciclo predeterminado
        if (isNaN(ciclo) || ciclo <= 0) {
          console.error(`Ciclo inválido para el gasto ID: ${docSnap.id}, usando ciclo predeterminado (30 días).`);
          return {
            id: docSnap.id,
            ...data,
            color: data.color || '#000000', // Color por defecto
            fechaProxima: 'Ciclo inválido' // Mostrar mensaje si ciclo es inválido
          };
        }

        // Calcular la fecha más próxima
        let fechaProxima = new Date(fechaDebitar);
        while (fechaProxima < today) {
          fechaProxima.setDate(fechaProxima.getDate() + ciclo);
        }

        // Si la fecha cambió, actualizar en Firestore
        if (fechaProxima.getTime() !== fechaDebitar.getTime()) {
          console.log(`Actualizando fecha próxima para el gasto ID: ${docSnap.id}`);
          const docRef = doc(db, 'gastos', docSnap.id);
          await updateDoc(docRef, { fecha: fechaProxima.toISOString() });
        }

        return {
          id: docSnap.id,
          ...data,
          color: data.color || '#000000', // Asignar color por defecto si no existe
          fechaProxima: formatDate(fechaProxima) // Formatear a dd-mm-yyyy
        };
      }));

      setGastos(gastosList); // Asignar la lista de gastos
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

  const handleDelete = async (gastoId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este gasto?")) {
      try {
        await deleteDoc(doc(db, 'gastos', gastoId));
        setGastos(gastos.filter(gasto => gasto.id !== gastoId)); // Actualizar la lista de gastos
        alert("Gasto eliminado con éxito.");
      } catch (error) {
        console.error("Error eliminando gasto:", error);
        alert("Hubo un error al eliminar el gasto.");
      }
    }
  };

  return (
    <div className={styles.servicioContainer}>
      <h2>Gastos Creados</h2>
      {loading ? (
        <div className={styles.loader}></div>
      ) : (
        <div className={styles.gastosList}>
          {gastos.map(gasto => (
            gasto && ( // Asegurarse de que `gasto` no sea null
              <div 
                key={gasto.id} 
                className={styles.gastoCard} 
                style={{ borderLeft: `5px solid ${gasto.color || '#000000'}` }} // Asegurarse de que `gasto.color` sea válido
              >
                <div className={styles.buttonGroup}>
                  <FaEdit 
                    className={styles.editIcon} 
                    onClick={() => handleEdit(gasto.id)} // Redirige a la página de edición
                  />
                  <button 
                    onClick={() => handleDelete(gasto.id)} 
                    className={styles.deleteButton}
                  >
                    Borrar
                  </button>
                </div>
                <h3>{gasto.nombreGasto}</h3>
                <p><strong>Monto:</strong> ${gasto.monto}</p>
                <p><strong>Fecha Próxima a Debitar:</strong> {gasto.fechaProxima || 'Fecha no disponible'}</p>
                {gasto.descripcion && <p><strong>Descripción:</strong> {gasto.descripcion}</p>}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicioComponte;
