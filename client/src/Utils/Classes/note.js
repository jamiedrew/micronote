import { v4 as uuidv4 } from "uuid";

export class Note {
    constructor (text) {
        this.text = text;
        this.id = uuidv4();
        this.createdDate = new Date().toISOString();
        this.modifiedDate = new Date().toISOString();
    }
}