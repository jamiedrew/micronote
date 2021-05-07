const _ = require("lodash");
const uuid = require("uuid");
const User = require("./user.model");

// the User model stores an array of notes in json format. we're gonna be playing with some array methods.

module.exports = {

    // get the notelist from the database
    getUser : async (id) => {
        const doc = await User.findById(id);

        const user = {
            id: doc._id,
            username: doc.username,
            notes: doc.notes,
        };

        return user;
    },

    // send new notes to the server
    syncNotes : async (userID, localNotes = null, noteID = null) => {
        // compare the local notes array to the one on the database
        // in case of network error since last syncing with the db, this will upload all new notes

        try {
            if (noteID && !uuid.validate(noteID)) return "Invalid note ID"
            if (localNotes && !localNotes instanceof Array) return "Invalid local notes array"
            // else if (noteID)...

            const doc = await User.findById(userID);
            console.log(`${doc.notes.length} in database for user ${userID}`);
            const newNotes = _.differenceWith(localNotes, doc.notes, _.isEqual);
            console.log(`${newNotes.length} new notes to upload`)

            // for every one of these notes, if it's not returning equal we can update them via updateNote() if the id is the same, and if not, unshift it to the start of the queue
            if (newNotes.length > 0) {

                if (newNotes.length === 1) {
                    console.log(`Uploading new note: ${newNotes[0].id}`)
                } else {
                    console.log(`There are ${newNotes.length} new notes to upload.`)
                }
                
                for (let i = newNotes.length; i > 0; i--) {
                    const n = i - 1;

                    let foundNote = (doc.notes.find(note => note.id === newNotes[n].id))

                    if (foundNote) {

                        if (foundNote.modifiedDate > newNotes[n].modifiedDate) {
                            console.log("Database is latest");
                        } else if (foundNote.modifiedDate < newNotes[n].modifiedDate) {
                            doc.notes.set(doc.notes.indexOf(foundNote), newNotes[n]);
                        } else {
                            return;
                        }

                    } else {
                        doc.notes.unshift(newNotes[n]);
                    }
                }
    
                // I THINK this is sorting in descending order
                doc.notes.sort((a, b) => {
                    return b.createdDate - a.createdDate;
                });

                await doc.save();
                
            } else {
                console.log(`doc.notes coming from sync.syncNotes:`)
                console.log(doc.notes);
                return doc.notes;
            }
        
        } catch (error) {
            console.error(error);
        };
    },

    editNote : async (userID, noteID, newText, newModifiedDate = null) => {

        if (!userID) return "No user ID";
        if (!noteID) return "No note ID";
        if (!uuid.validate(noteID)) return "Invalid note ID";
        if (!newText) return "No text to update";
        if (!newModifiedDate) newModifiedDate = new Date().toISOString();

        const doc = await User.findById(userID);

        const foundNote = await doc.notes.find(note => note.id === noteID);

        // maybe even just...make a new one if this one isn't found?
        if (!foundNote) return `Could not find note ${noteID}`;

        const newNote = {
            id: noteID,
            text: newText,
            createdDate: foundNote.createdDate,
            modifiedDate: newModifiedDate,
        }

        const editedNote = await doc.notes.set(doc.notes.indexOf(foundNote), newNote);
        await doc.save();

        // edit the .text
        // change modifiedDate to right now
        return editedNote;
    },

    // delete a single note by ID
    deleteNote : async (userID, noteID) => {
        
        if (!userID) return "No user ID";
        if (!noteID) return "No note ID";
        if (!uuid.validate(noteID)) return "Invalid note ID";

        const doc = await User.findById(userID);

        // a good test here, Jamie, would be to get the .length properties before and after deletion
        doc.notes = doc.notes.filter(note => note.id !== noteID);

        await doc.save();
        return doc.notes;

    }

}