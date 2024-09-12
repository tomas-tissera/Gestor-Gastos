import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styles from './CargaTarjeta.module.css';
import AgregarTarjeta from '../AgregarTarjeta';
import AnimacionCarga from '../AnimacionCarga';

const CargaTarjeta = () => {
  const [nombreGasto, setNombreGasto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [cuotas, setCuotas] = useState(1);
  const [cuotasPagadas, setCuotasPagadas] = useState(0); // Nuevo estado para cuotas pagadas
  const [montoTotal, setMontoTotal] = useState('');
  const [valorCuota, setValorCuota] = useState('');
  const [showAgregarTarjeta, setShowAgregarTarjeta] = useState(false);
  const [tarjetas, setTarjetas] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchTarjetas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tarjetas"));
        const tarjetasData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTarjetas(tarjetasData);
      } catch (e) {
        console.error("Error al obtener tarjetas: ", e);
      }
    };

    fetchTarjetas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (!nombreGasto || !fecha || !tarjeta || !montoTotal || cuotas <= 0 || cuotasPagadas < 0 || cuotasPagadas > cuotas) {
      alert("Por favor completa todos los campos requeridos y verifica la cantidad de cuotas pagadas.");
      setCargando(false);
      return;
    }

    try {
      await addDoc(collection(db, "gastosTarjeta"), {
        nombreGasto,
        descripcion,
        fecha: new Date(fecha).toISOString(),
        tarjeta,
        cuotas: parseInt(cuotas, 10),
        cuotasPagadas: parseInt(cuotasPagadas, 10),
        montoTotal: parseFloat(montoTotal),
        valorCuota: parseFloat(valorCuota),
      });
      alert('Gasto añadido con éxito!');
      setNombreGasto('');
      setDescripcion('');
      setFecha('');
      setTarjeta('');
      setCuotas(1);
      setCuotasPagadas(0); // Reinicia las cuotas pagadas
      setMontoTotal('');
      setValorCuota('');
    } catch (e) {
      console.error("Error al añadir gasto: ", e);
      alert("Hubo un error al cargar el gasto.");
    } finally {
      setCargando(false);
    }
  };

  const handleMontoTotalChange = (e) => {
    const monto = e.target.value;
    setMontoTotal(monto);
    if (cuotas > 0) {
      setValorCuota((monto / cuotas).toFixed(2));
    }
  };

  const handleCuotasChange = (e) => {
    const cuota = e.target.value;
    setCuotas(cuota);
    if (montoTotal) {
      setValorCuota((montoTotal / cuota).toFixed(2));
    }
  };

  const handleCuotasPagadasChange = (e) => {
    setCuotasPagadas(e.target.value);
  };

  return (
    <div>
      {cargando && <AnimacionCarga />}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nombre del gasto:</label>
          <input 
            type="text" 
            value={nombreGasto} 
            onChange={(e) => setNombreGasto(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Descripción:</label>
          <textarea 
            value={descripcion} 
            onChange={(e) => setDescripcion(e.target.value)} 
            className={styles.textarea}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Fecha realizada del gasto:</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Seleccionar tarjeta:</label>
          <select 
            value={tarjeta} 
            onChange={(e) => setTarjeta(e.target.value)} 
            required 
            className={styles.input}
          >
            <option value="">Selecciona una tarjeta</option>
            {tarjetas.map(tarjeta => (
              <option key={tarjeta.id} value={tarjeta.id}>{tarjeta.nombre}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <button 
            type="button" 
            onClick={() => setShowAgregarTarjeta(true)} 
            className={styles.button}
          >
            Agregar Tarjeta
          </button>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cantidad de cuotas:</label>
          <input 
            type="number" 
            value={cuotas} 
            onChange={handleCuotasChange} 
            min="1" 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Cantidad de cuotas pagadas:</label>
          <input 
            type="number" 
            value={cuotasPagadas} 
            onChange={handleCuotasPagadasChange} 
            min="0" 
            max={cuotas} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Monto total a debitar:</label>
          <input 
            type="number" 
            value={montoTotal} 
            onChange={handleMontoTotalChange} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Valor de cuota:</label>
          <input 
            type="text" 
            value={valorCuota} 
            readOnly 
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Añadir Gasto</button>
      </form>
      {showAgregarTarjeta && (
        <AgregarTarjeta onClose={() => setShowAgregarTarjeta(false)} />
      )}
    </div>
  );
};

export default CargaTarjeta;
