// src/components/ProgressBar.js
import React from 'react';
import styles from './ProgressBar.module.css'; // Asegúrate de crear este archivo CSS para los estilos

const ProgressBar = ({ porcentaje }) => {
  return (
    <div className={styles.progressContainer}>
      <p className={styles.progressLabel}>
        <strong>Porcentaje de cuotas pagadas:</strong>
      </p>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${porcentaje}%` }}
        >
          <span className={styles.progressText}>
            {porcentaje}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
