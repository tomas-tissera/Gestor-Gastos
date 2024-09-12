import Navbar from "./components/navbar/index"
import "./Profile.css"
import Home from "./views/Home"
const Profile = () => {

    return (
            <>
            <div className="contenedor">

                <Navbar/>
                <Home/>
            </div>
            </>
    )
}

export default Profile