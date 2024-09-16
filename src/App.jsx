import Layout from "./Layout";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Carga from "./views/carga";
import Servicios from "./views/servicios";
import Actualizar from "./views/Prestamos";
import EditarG from "./views/editarG"
import TarjetasGastos from "./views/tarjetasG";
import EditarGastoTarjeta from "./components/EditarGastoTarjeta";
import EditarTarjeta from "./components/EditarTarjeta";
import EditarPrestamo from "./components/EditarPrestamo";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
const App = () => {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
          <Route path = "/" element = { <Layout></Layout> }>
            <Route index element = { <Login></Login> }></Route>
            <Route path = "/carga" element = { <Carga></Carga> } ></Route>
            <Route path = "/servicios" element = { <Servicios></Servicios> } ></Route>
            <Route path="/servicios/:id" element={<EditarG />} />
            <Route path = "/prestamos" element = { <Actualizar></Actualizar> } ></Route>
            <Route path = "/prestamos/:prestamoId" element = { <EditarPrestamo></EditarPrestamo> } ></Route>
            <Route path = "/profile" element = { <Profile></Profile> }></Route>
            <Route path = "/tarjetas" element = { <TarjetasGastos></TarjetasGastos> }></Route>
            <Route path="/tarjetas/:gastoId" element={<EditarGastoTarjeta />} /> {/* Agregar esta ruta */}
            <Route path="/tarjetas/editarTarjeta/:tarjetaId" element={<EditarTarjeta />} /> {/* Agregar esta ruta */}
            

          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App