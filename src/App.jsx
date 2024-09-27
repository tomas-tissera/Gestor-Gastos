import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Carga from "./views/carga";
import Servicios from "./views/servicios";
import Actualizar from "./views/Prestamos";
import EditarG from "./views/editarG";
import TarjetasGastos from "./views/tarjetasG";
import EditarGastoTarjeta from "./components/EditarGastoTarjeta";
import EditarTarjeta from "./components/EditarTarjeta";
import EditarPrestamo from "./components/EditarPrestamo";
import Navbar from "./components/navbar";
const App = () => {
  return (
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );
};

const Main = () => {
  const location = useLocation();

  return (
    <>
      {/* Ocultar el Navbar si la ruta es "/" */}
      {location.pathname !== "/" && location.pathname !== "/signup" && <Navbar />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/signup" element={<Signup />} />
          <Route index element={<Login />} />
          <Route path="/carga" element={<Carga />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/:id" element={<EditarG />} />
          <Route path="/prestamos" element={<Actualizar />} />
          <Route path="/prestamos/:prestamoId" element={<EditarPrestamo />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tarjetas" element={<TarjetasGastos />} />
          <Route path="/tarjetas/:gastoId" element={<EditarGastoTarjeta />} />
          <Route path="/tarjetas/editarTarjeta/:tarjetaId" element={<EditarTarjeta />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
