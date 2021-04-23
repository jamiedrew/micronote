import localforage from "localforage";
import { useState } from "react";

import "./CreateNote.css";

import { FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome'
import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons'

const CreateNote = () => {

    const [newNote, setNewNote] = useState("");

    const submitNote = (event) => {
        event.preventDefault();

        let submittedNote = {
            id: `${Math.floor(Math.random() * 9999)}${Date.now()}`,
            date: new Date().toISOString(),
            text: newNote,
        };

        localforage.setItem("notes", submittedNote, () => {
            localforage.iterate((value, key, iteration) => console.log(value))
        }).then(setNewNote(""));
    };

    return (
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
                <button><FA icon={faTrash} /></button>
                <button onClick={submitNote}><FA icon={faSave} /></button>
            </form>

        </div>
        
    )
}

export default CreateNote;