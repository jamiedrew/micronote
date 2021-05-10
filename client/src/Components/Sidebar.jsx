import logo from "../Images/book.png"
import "./Sidebar.css";

import { FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome'
import { faUser, faUserSecret, faCog, faQuestion } from '@fortawesome/free-solid-svg-icons'

const Sidebar = ({ username, click }) => {

    return (
        <div id="sidebar-contents">

            <div id="logo">
                <img src={logo} alt="" />
                <h1>micronote</h1>
                <h2>mee 𐤟 cro 𐤟 no 𐤟 tay</h2>
            </div>

            <div className="info">
                { username ?
                    <button onClick={click}><FA icon={faUser} /> {username}</button> : 
                    <button onClick={click}><FA icon={faUserSecret} /> guest</button>
                }
            </div>

            {/* <div className="options">
                <button><FA icon={faCog} /></button>
                <button><FA icon={faQuestion} /></button>
            </div> */}

        </div>
    )
}

export default Sidebar;