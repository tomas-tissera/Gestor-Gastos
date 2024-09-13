import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styles from './CargaTarjeta.module.css';
import AgregarTarjeta from '../AgregarTarjeta';
import AgregarBanco from '../AgregarBanco'; // Componente para agregar banco
import AnimacionCarga from '../AnimacionCarga';

const CargaTarjeta = () => {
  const [nombreGasto, setNombreGasto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');
  const [tarjeta, setTarjeta] = useState('');
  const [cuotas, setCuotas] = useState(1);
  const [cuotasPagadas, setCuotasPagadas] = useState(0);
  const [montoTotal, setMontoTotal] = useState('');
  const [valorCuota, setValorCuota] = useState('');
  const [banco, setBanco] = useState(''); // Estado para el banco
  const [showAgregarTarjeta, setShowAgregarTarjeta] = useState(false);
  const [showAgregarBanco, setShowAgregarBanco] = useState(false); // Estado para agregar banco
  const [tarjetas, setTarjetas] = useState([]);
  const [bancos, setBancos] = useState([]); // Estado para almacenar los bancos
  const [cargando, setCargando] = useState(false);

  // Fetch de las tarjetas y bancos
  useEffect(() => {
    const fetchTarjetasYBancos = async () => {
      try {
        // Obtener tarjetas
        const tarjetasSnapshot = await getDocs(collection(db, "tarjetas"));
        const tarjetasData = tarjetasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTarjetas(tarjetasData);

        // Obtener bancos
        const bancosSnapshot = await getDocs(collection(db, "bancos"));
        const bancosData = bancosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBancos(bancosData);
      } catch (e) {
        console.error("Error al obtener tarjetas o bancos: ", e);
      }
    };

    fetchTarjetasYBancos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (!nombreGasto || !fecha || !tarjeta || !banco || !montoTotal || cuotas <= 0 || cuotasPagadas < 0 || cuotasPagadas > cuotas) {
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
        banco, // Guardar el banco seleccionado
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
      setBanco(''); // Reiniciar el banco
      setCuotas(1);
      setCuotasPagadas(0);
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
          <button 
            type="button" 
            onClick={() => setShowAgregarTarjeta(true)} 
            className={styles.button}
          >
            Agregar Tarjeta
          </button>
        </div>
        {/* Rest of the form for cuotas and monto */}
        {/* ... */}
        <button type="submit" className={styles.button}>Añadir Gasto</button>
      </form>
      {showAgregarTarjeta && <AgregarTarjeta onClose={() => setShowAgregarTarjeta(false)} />}
      
    </div>
  );
};

export default CargaTarjeta;
