import React, { useState, useEffect } from "react";
import localforage from "localforage";

import { FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import "./NoteList.css";

const NoteList = () => {

    const [loading, setLoading] = useState(false);
    const [noteList, setNoteList] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [noteID, setNoteID] = useState("");

    const getLocalNotes = async () => {
        try {
            setLoading(true)
            const notes = await localforage.getItem("notes");
            setLoading(false);
            setNoteList(notes);
        } catch (error) {
            console.error(error);
        }
    }

    const submitNote = async (event) => {
        event.preventDefault();

        // if the state holds a noteID, it'll update that note
        // if not it'll make a new one
        if (noteID !== "" && newNote !== "") {
            try {

                const notes = await localforage.getItem("notes");
                const note = notes.find(note => note.id === noteID);

                note.text = newNote;
                note.modifiedDate = new Date().toISOString();

                localforage.setItem("notes", notes)

                setNoteList(notes);
                setNewNote("");
                setNoteID("");

            } catch (error) {
                console.error(error);
            };
        } else {
            if (newNote.length > 0) {
                let submittedNote = {
                    id: `${Math.floor(Math.random() * 9999)}${Date.now()}`,
                    text: newNote,
                    createdDate: new Date().toISOString(),
                    modifiedDate: new Date().toISOString()
                };
    
                setNoteList([submittedNote, ...noteList]);
                
                localforage.setItem("notes", [submittedNote, ...noteList])
                    .then(setNewNote(""));
            }
        }
        
    };

    const deleteNewNote = async (event) => {

        event.preventDefault();

        if (noteID === "" && newNote !== "") {
            setNewNote("");
        } else {
            let filteredList;
            const notesList = await localforage.getItem("notes")

            filteredList = await localforage.setItem("notes", notesList.filter(item => item.id !== noteID));

            setNoteList(filteredList);
            setNewNote("");
            setNoteID("");
        }

    }

    // get local notes on page load
    useEffect(() => {
        getLocalNotes();
    }, []);

    // just having a look
    useEffect(() => console.log(noteList), [noteList])

    const deleteNote = id => async () => {
        const notesList = await localforage.getItem("notes")
        const filteredList = await localforage.setItem("notes", notesList.filter(item => item.id !== id));
        setNoteList(filteredList);
    }

    const editNote = (id, text) => () => {
        setNoteID(id);
        setNewNote(text);
    }

    return (

        <React.Fragment>

            <div id="new-note">

                <div id="note">
                    <label htmlFor="create-note">Create a new note</label>
                    <textarea
                        value={newNote}
                        onChange={event => setNewNote(event.target.value)}
                        placeholder="New note..."
                        form="create-note"
                        required />
                </div>

                <form id="create-note" className="actions">
                    <button onClick={deleteNewNote}><FA icon={faTimes} /></button>
                    <button onClick={submitNote}><FA icon={faCheck} /></button>
                </form>

            </div>

            <div id="note-list">
                { noteList &&  
                    noteList.map(note => <Note
                                            key={note.id}
                                            id={note.id}
                                            text={note.text}
                                            deleteNote={deleteNote}
                                            editNote={editNote} /> ) }
            </div>

            

        </React.Fragment>
        
    )
}

const Note = ({ text, id, editNote, deleteNote }) => {

    return (
        <div className="note">
            <div className="text">{text}</div>

            <div className="actions">
                <button onClick={editNote(id, text)}><FA icon={faPencilAlt} /></button>
                <button onClick={deleteNote(id)}><FA icon={faTrash} /></button>
            </div>

        </div>
    )
}

export default NoteList;