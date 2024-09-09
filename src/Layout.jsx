import { Outlet } from "react-router-dom";
import "./layout.css";
const Layout = () => {
    return(
        <div className = "container-fluid">
            
                <Outlet />
            
        </div>
    )
}

export default Layout