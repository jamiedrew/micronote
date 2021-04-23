import logo from "../img/micronote.png"
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <div id="sidebar-contents">

            <div id="logo">
                <img src={logo} alt="" />
                <h1>micronote</h1>
                <h3>mee 𐤟 cro 𐤟 no 𐤟 tay</h3>
            </div>
        
            <div id="account-details">
                <p>Jamie</p>
                <p>Login</p>
            </div>
            
        </div>
    )
}

export default Sidebar;