import React from 'react';
import styles from './AnimacionCarga.module.css';

const AnimacionCarga = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p>Por favor, espere...</p>
    </div>
  );
};

export default AnimacionCarga;
