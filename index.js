const express = require("express");
const app = express();

const path = require("path");

// serve static React files
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api/notes", (req, res) => res.json("This will be a glorious selection of notes"));

// for a request that doesn't match one of the above routes just send the index.html
app.get("*", (req, res) => res.sendFile(path.join(__dirname+'/client/build/index.html')));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));