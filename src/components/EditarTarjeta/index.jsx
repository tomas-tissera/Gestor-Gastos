// src/components/EditarTarjeta.js
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, getDocs, addDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './EditarTarjeta.module.css';
import Navbar from '../navbar';

const EditarTarjeta = () => {
  const { tarjetaId } = useParams();
  const [nombre, setNombre] = useState('');
  const [banco, setBanco] = useState('');
  const [bancos, setBancos] = useState([]);
  const [nuevoBanco, setNuevoBanco] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingBancos, setLoadingBancos] = useState(true);
  const [loadingUpdate, setLoadingUpdate] = useState(false); // Para la actualización
  const [loadingAddBanco, setLoadingAddBanco] = useState(false); // Para la adición de banco
  const [showSuccess, setShowSuccess] = useState(false); // Para la animación de éxito
  const navigate = useNavigate();

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

        // Obtener tarjeta
        const tarjetaDoc = await getDoc(doc(db, "tarjetas", tarjetaId));
        if (tarjetaDoc.exists()) {
          const tarjetaData = tarjetaDoc.data();
          setNombre(tarjetaData.nombre);
          setBanco(tarjetaData.banco);
        } else {
          console.log("No existe la tarjeta.");
        }
      } catch (e) {
        console.error("Error al obtener datos: ", e);
      } finally {
        setLoading(false);
        setLoadingBancos(false);
      }
    };

    fetchData();
  }, [tarjetaId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true); // Mostrar carga mientras se actualiza
    setShowSuccess(false); // Ocultar la animación de éxito si está visible
    try {
      const tarjetaRef = doc(db, "tarjetas", tarjetaId);
      await updateDoc(tarjetaRef, {
        nombre,
        banco,
      });
      setShowSuccess(true); // Mostrar la animación de éxito
      setTimeout(() => {
        navigate('/tarjetas');
      }, 1500); // Esperar 1.5 segundos para mostrar la animación antes de redirigir
    } catch (e) {
      console.error("Error al actualizar la tarjeta: ", e);
    } finally {
      setLoadingUpdate(false); // Ocultar carga cuando termine
    }
  };

  const handleAddBanco = async () => {
    if (!nuevoBanco.trim()) return;
    setLoadingAddBanco(true); // Mostrar carga mientras se agrega el banco
    try {
      await addDoc(collection(db, "bancos"), { nombre: nuevoBanco });
      setBancos([...bancos, { nombre: nuevoBanco }]);
      setBanco(nuevoBanco); // Selecciona el nuevo banco
      setNuevoBanco(''); // Limpia el campo de texto
    } catch (e) {
      console.error("Error al agregar el banco: ", e);
    } finally {
      setLoadingAddBanco(false); // Ocultar carga cuando termine
    }
  };

  if (loading || loadingBancos || loadingUpdate) return <div className={styles.loader}></div>;

  return (
    <>
      <div className={styles.formContainer}>
        <h2>Editar Tarjeta</h2>
        {showSuccess && <div className={styles.successAnimation}></div>} {/* Animación de éxito */}
        <form onSubmit={handleUpdate}>
          <div className={styles.formGroup}>
            <label>Nombre de la tarjeta:</label>
            <input 
              type="text" 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Banco:</label>
            <select 
              value={banco} 
              onChange={(e) => setBanco(e.target.value)} 
              className={styles.select}
            >
              <option value="">Seleccionar Banco</option>
              {bancos.map(banco => (
                <option key={banco.id} value={banco.nombre}>{banco.nombre}</option>
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
                disabled={loadingAddBanco} // Desactiva el botón mientras se está cargando
              >
                {loadingAddBanco ? <div className={styles.loader}></div> : 'Agregar Banco'}
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className={styles.button}
            disabled={loadingUpdate} // Desactiva el botón mientras se está cargando
          >
            {loadingUpdate ? <div className={styles.loader}></div> : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditarTarjeta;
