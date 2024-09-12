import React from 'react';
import styles from './AnimacionCarga.module.css';

const AnimacionCarga = ({mensaje}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
      <p className={styles.spinnerP}>{mensaje}...</p>
    </div>
  );
};

export default AnimacionCarga;
