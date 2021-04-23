import localforage from "localforage";

export const getNotes = () => async () => {
    try {
        const lfNotes = await localforage.getItem("notes", (value) => {
            console.log(value);
        });
        return lfNotes;

    } catch (error) {
        console.error(error);
    }

}