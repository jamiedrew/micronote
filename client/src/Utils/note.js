export class Note {
    constructor (text) {
        this.text = text;
        this.id =`${Math.floor(Math.random() * 9999)}${Date.now()}`;
        this.createdDate = new Date().toISOString();
        this.modifiedDate = new Date().toISOString();
    }
};