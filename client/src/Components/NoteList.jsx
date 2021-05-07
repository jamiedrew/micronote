import React, { useState } from "react";
import { useCookies } from "react-cookie";
import localforage from "localforage";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import axios from "axios";

import { FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome'
import { faTrash, faPencilAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

import { Note } from "../Utils/Classes/note";

import "./NoteList.css";

const NoteList = ({ notes, updateNoteList }) => {

    const [newNote, setNewNote] = useState("");
    const [noteID, setNoteID] = useState("");
    const [cookies, setCookies] = useCookies();

    const submitNote = async (event) => {
        event.preventDefault();

        const jwt = cookies.micronote;
        console.log(jwt);

        // if the state holds a noteID, it'll update that note
        // if not it'll make a new one
        if (noteID !== "" && newNote !== "") {
            

            try {
                const localNotes = await localforage.getItem("notes");
                const noteToUpdate = localNotes.find(note => note.id === noteID);
                const updatedDate = new Date().toISOString();

                noteToUpdate.text = newNote;
                noteToUpdate.modifiedDate = updatedDate;

                if (jwt) {
                    axios.put(`/notes/${noteID}`, {
                        text: newNote,
                        modifiedDate: updatedDate
                    }).then(res => console.log(res))
                    .catch(err => console.error(err))
                }

                localforage.setItem("notes", localNotes);
                updateNoteList(localNotes);
                setNewNote("");
                setNoteID("");
            } catch (error) {
                console.error(error);
            };
        } else {
            // make a new note!
            if (newNote.length > 0) {
                try {
                    const submittedNote = new Note(newNote);
                    const newNoteList = await localforage.setItem("notes", [submittedNote, ...notes])
                    
                    if (jwt) {
                        axios.post("/notes", {
                            list: newNoteList,
                            note: submittedNote
                        }).then(res => console.log(res))
                            .catch(err => console.error(err))
                    };

                    updateNoteList(newNoteList);
                    setNewNote("");
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    const deleteNewNote = async (event) => {
        event.preventDefault();

        if (noteID === "" && newNote !== "") {
            setNewNote("");
        } else if (noteID !== "") {
            setNewNote("");
            setNoteID("");
        } else {
            let filteredList;
            const notesList = await localforage.getItem("notes")

            if (notesList) filteredList = await localforage.setItem("notes", notesList.filter(item => item.id !== noteID));

            updateNoteList(filteredList);
            setNewNote("");
            setNoteID("");
        }
    }

    const deleteNote = id => async () => {
        if (cookies.micronote) {
            axios.delete(`/notes/${id}`)
                .then(res => console.log(res))
                .catch(err => console.error(err));
        }
        
        const notesList = await localforage.getItem("notes")
        const filteredList = await localforage.setItem("notes", notesList.filter(item => item.id !== id));
        updateNoteList(filteredList);
    }

    const editNote = (id, text) => () => {
        window.scroll({ top: 0, left: 0, behavior: "smooth" });
        setNoteID(id);
        setNewNote(text);
    }

    return (
        <React.Fragment>
            <div id="new-note">
                <form id="note">
                    <label htmlFor="create-note">Create a new note</label>
                    <textarea
                        value={newNote}
                        onChange={event => setNewNote(event.target.value)}
                        placeholder="New note..."
                        form="create-note"
                        required />
                </form>

                <form id="create-note" className="actions">
                    <button onClick={deleteNewNote}><FA icon={faTimes} /></button>
                    <button onClick={submitNote}><FA icon={faCheck} /></button>
                </form>
            </div>

            <div id="note-list">
                { notes && 
                    notes.map(note => {if (note !== null) {
                        return <NoteComponent
                                    key={note.id}
                                    id={note.id}
                                    text={note.text}
                                    deleteNote={deleteNote}
                                    editNote={editNote} /> }
                        }
                    ) }
            </div>
        </React.Fragment>
    )
}

const NoteComponent = ({ text, id, editNote, deleteNote }) => {

    return (
        <div className="note">
            <ReactMarkdown className="text" remarkPlugins={[gfm]}>{text}</ReactMarkdown>

            <div className="actions">
                <button onClick={editNote(id, text)}><FA icon={faPencilAlt} /></button>
                <button onClick={deleteNote(id)}><FA icon={faTrash} /></button>
            </div>

        </div>
    )
}

export default NoteList;