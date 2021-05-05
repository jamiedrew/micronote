import axios from "axios";
import { useState } from "react";
import * as localforage from "localforage";
import { useCookies } from "react-cookie";

import { FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleUp } from '@fortawesome/free-solid-svg-icons'

import "./Account.css";

const Account = ({ toggle, show, id, username, updateUserState, updateNoteList }) => {

    const [ newUsername, setNewUsername ] = useState("");
    const [ newPassword, setNewPassword ] = useState("");
    const [ flashMessage, setFlashMessage ] = useState("");

    const [ cookies, setCookies, removeCookies ] = useCookies();

    let accountClasses = ["account"];

    if (show) {
        accountClasses.push("show");
    }

    const register = async (event) => {
        event.preventDefault();

        let localNotes = await localforage.getItem("notes");

        axios.post("/account/register", {
            username: newUsername,
            password: newPassword,
            localNotes: localNotes
        })
            .then(res => {
                if (res.data.status) {
                    updateUserState({
                        id: res.data.user._id,
                        username: res.data.user.username
                    });
                    toggle();
                } else {
                    setFlashMessage(res.data.message);
                }
            })
            .catch(err => console.error(err));
    };

    const login = async (event) => {
        event.preventDefault();
        const noteList = await localforage.getItem("notes");

        await axios.post("/account/login", {
            username: newUsername,
            password: newPassword,
            localNotes: noteList
        })
            .then(res => {
                if (res.data.status) {
                    updateUserState({ id: res.data.user.id, username: res.data.user.username});
                    updateNoteList(res.data.user.notes);
                    toggle();
                } else {
                    setFlashMessage(res.data.message);
                }
            })
            .catch(err => console.error(err))
    };

    const logout = async() => {
        await axios.post("/account/logout")
            .then(updateUserState({ }))
            .then(removeCookies("micronote"))
            .catch(err => console.error(err))
            .finally(toggle());
    }
    
    return (
        <div className={accountClasses.join(" ")}>
            {/* This is all going to need to change depending on if we have a micronote cookie */}

            <button className="close desktop" onClick={toggle}><FA icon={faAngleLeft} /></button>
            <button className="close mobile" onClick={toggle}><FA icon={faAngleUp} /></button>

            {username && <h3>{username}</h3>}

            {/* Don't show this if there's a cookie */}

            {!id && 
            <div className="login-register">
                <form id="login" onSubmit={login}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input type="text" 
                            onChange={e => setNewUsername(e.target.value)}
                            id="username"
                            name="username" 
                            placeholder="username"
                            required />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input type="password"
                            onChange={e => setNewPassword(e.target.value)}
                            id="password"
                            name="username"
                            placeholder="password"
                            required />
                    </div>

                    <div className="buttons">
                        <button onClick={register}>Register</button>
                        <button onClick={login} type="submit">Login</button>
                    </div>
                </form>

                

            </div> }

            {flashMessage && <div className="flash">{flashMessage}</div> }

            <div className="actions">
                { username && <button onClick={logout}>Log Out</button> }
            </div>
        
        </div>
    )
}

export default Account;