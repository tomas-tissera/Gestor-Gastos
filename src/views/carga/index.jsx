import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CargaComp from '../../components/cargaComponente';
import CargaTarjeta from '../../components/CargaCompTarjeta';
import Prestamo from '../../components/AgregarPrestamo';
import Navbar from "../../components/navbar"
import styles from "./Carga.module.css"
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Carga() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
    <div className={styles.boxSelect}>

      <Box sx={{ width: '100%',display:"flex", flexDirection:"column" ,alignContent:"center" }} className={styles.boxSelect}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="tabs">
            <Tab label="Agregar Gasto" {...a11yProps(0)} />
            <Tab label="Agregar Gasto con Tarjeta" {...a11yProps(1)} />
            <Tab label="Agregar Prestamo" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <CargaComp />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <CargaTarjeta />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          <Prestamo />
        </CustomTabPanel>
      </Box>
    </div>
    </>
  );
}
