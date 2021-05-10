const router = require("express").Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sync = require("../db/sync");

router.get("/", async (req, res) => {
    try {
        const user = await jwt.verify(req.cookies.micronote, process.env.SECRET);
        console.log("user sent to GET /notes:")
        console.log(user.id);

        console.log("req.body sent to GET /notes:")
        console.log(req.body);

        const data = await sync.syncNotes(user.id, req.body.list);
        console.log("data coming from GET /notes:");
        console.log(data);

        res.send(data);
    } catch (error) {
        res.json(error);
        console.error(error);
    }
});

router.post("/", async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.micronote, process.env.SECRET);
        const { list, note } = req.body;

        let response;

        if (list && note) {
            response = await sync.syncNotes(user.id, list, note.id);
        } else if (list) {
            response = await sync.syncNotes(user.id, list);
        } else {
            response = await sync.syncNotes(user.id);
        }

        res.status(201).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
});

router.put("/:noteID", async (req, res) => {
    try {
        const { text, modifiedDate } = req.body;
        const user = jwt.verify(req.cookies.micronote, process.env.SECRET);
        
        const editedNote = await sync.editNote(user.id, req.params.noteID, text, modifiedDate)

        res.status(200).send(editedNote);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete("/:noteID", async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.micronote, process.env.SECRET);

        const deletedNote = await sync.deleteNote(user.id, req.params.noteID);
        res.send(deletedNote);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;