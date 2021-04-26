import { Note } from "./note";

export class NotesList extends Array {
    addNote (note) {
        if (typeof note === Note) console.log("hey this is a note! good job!")
        else console.log("hey, this ain't a note! idiot!")
    }
}