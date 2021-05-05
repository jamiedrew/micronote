import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import localforage from "localforage";

import Sidebar from "./Components/Sidebar";
import NoteList from "./Components/NoteList";
import Account from "./Components/Account";

import './App.css';

function App() {

  const [ cookies, setCookies ] = useCookies();

  const [ user, setUser ] = useState({});
  const [ notes, setNotes ] = useState([])
  const [ showAccount, setShowAccount ] = useState(false);

  // pass down these functions to update them from the top level
  const updateUserState = async (user) => {
    await setUser(user);
  }

  const updateNoteList = async (list) => {
    await setNotes(list);
  }

  // get user on page load if a cookie exists for micronote
  useEffect(() => {
    getUserInfo();
    getUserNotes();
  }, [cookies])

  // on page load
  const getUserInfo = async () => {
      try {
        if (cookies.micronote) {
          const { data } = await axios.get("/account/user");
          setUser({ id: data.id, username: data.username });
        } else {
          return;
        }
      } catch (error) {
        console.error(error);
      };
    };

  const getUserNotes = async () => {
    try {
      if (cookies.micronote) {
        const { data } = await axios.get("/notes", { list: notes })
        console.log(data);
        // sync those changes to the local storage at the same time as setting the note list, for storage
        localforage.setItem("notes", data);
        setNotes(data);
      } else {
        const localNotes = await localforage.getItem("notes");
        if (localNotes && localNotes.length > 0) {
          setNotes(localNotes);
        } else {
          let newLocalNotes = await localforage.setItem("notes", []);
          setNotes(newLocalNotes);
        };
      };
    } catch (error) {
      console.error(error);
    };
  }

  // // DEBUG - making sure the user is being set
  // useEffect(() => {
  //   if (user.id) console.log(user);
  // }, [user])

  return (
      <div className="App">

        {/* account management */}
        <Account toggle={() => setShowAccount(!showAccount)} show={showAccount} id={user.id} username={user.username} updateUserState={updateUserState} updateNoteList={updateNoteList} />

        {/* sidebar */}
        <div id="sidebar">
          <Sidebar username={user.username} click={() => setShowAccount(!showAccount)} />
        </div>

        {/* main content */}
        <div id="main">
          <NoteList notes={notes} updateNoteList={updateNoteList} />
        </div>

      </div>
  );
}

export default App;
