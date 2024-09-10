import Layout from "./Layout";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Carga from "./views/carga";
import Servicios from "./views/servicios";
import Actualizar from "./views/actualizar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path = "/" element = { <Layout></Layout> }>
            <Route index element = { <Login></Login> }></Route>
            <Route path = "/carga" element = { <Carga></Carga> } ></Route>
            <Route path = "/servicios" element = { <Servicios></Servicios> } ></Route>
            <Route path = "/actualizar" element = { <Actualizar></Actualizar> } ></Route>
            <Route path = "/profile" element = { <Profile></Profile> }></Route>
          </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App