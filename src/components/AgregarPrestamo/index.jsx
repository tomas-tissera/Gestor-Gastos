import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import styles from './CargaPrestamo.module.css';
import AgregarBanco from "../AgregarBanco"
import AnimacionCarga from '../AnimacionCarga';

const CargaPrestamo = () => {
  const [montoTotal, setMontoTotal] = useState('');
  const [banco, setBanco] = useState('');
  const [diaPago, setDiaPago] = useState('');
  const [cuotas, setCuotas] = useState(1);
  const [cuotasPagadas, setCuotasPagadas] = useState(0);
  const [valorCuota, setValorCuota] = useState('');
  const [bancos, setBancos] = useState([]);
  const [showAgregarBanco, setShowAgregarBanco] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const fetchBancos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bancos"));
        const bancosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBancos(bancosData);
      } catch (e) {
        console.error("Error al obtener bancos: ", e);
      }
    };

    fetchBancos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    if (!montoTotal || !banco || !diaPago || cuotas <= 0 || cuotasPagadas < 0 || cuotasPagadas > cuotas) {
      alert("Por favor completa todos los campos requeridos y verifica la cantidad de cuotas pagadas.");
      setCargando(false);
      return;
    }

    try {
      await addDoc(collection(db, "prestamos"), {
        montoTotal: parseFloat(montoTotal),
        banco,
        diaPago: new Date(diaPago).toISOString(),
        cuotas: parseInt(cuotas, 10),
        cuotasPagadas: parseInt(cuotasPagadas, 10),
        valorCuota: parseFloat(valorCuota),
      });
      alert('Préstamo añadido con éxito!');
      setMontoTotal('');
      setBanco('');
      setDiaPago('');
      setCuotas(1);
      setCuotasPagadas(0);
      setValorCuota('');
    } catch (e) {
      console.error("Error al añadir préstamo: ", e);
      alert("Hubo un error al cargar el préstamo.");
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
          <label className={styles.label}>Monto Total:</label>
          <input 
            type="number" 
            value={montoTotal} 
            onChange={handleMontoTotalChange} 
            required 
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Seleccionar banco:</label>
          <select 
            value={banco} 
            onChange={(e) => setBanco(e.target.value)} 
            required 
            className={styles.input}
          >
            <option value="">Selecciona un banco</option>
            {bancos.map(banco => (
              <option key={banco.id} value={banco.id}>{banco.nombre}</option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <button 
            type="button" 
            onClick={() => setShowAgregarBanco(true)} 
            className={styles.button}
          >
            Agregar Banco
          </button>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Día de Pago:</label>
          <input 
            type="date" 
            value={diaPago} 
            onChange={(e) => setDiaPago(e.target.value)} 
            required 
            className={styles.input}
          />
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
          <label className={styles.label}>Valor de cuota:</label>
          <input 
            type="text" 
            value={valorCuota} 
            readOnly 
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>Añadir Préstamo</button>
      </form>
      {showAgregarBanco && (
        <AgregarBanco onClose={() => setShowAgregarBanco(false)} />
      )}
    </div>
  );
};

export default CargaPrestamo;
