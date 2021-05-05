const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 5000;

// CORS
const cors = require("cors");
app.use(cors({
    origin: "http://localhost:3000", // <-- the location of the react app; change this in production, probably
    credentials: true
}))

// serve static React files
const path = require("path");
app.use(express.static(path.join(__dirname, "client/build")));

// request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false })) // for forms
app.use(cookieParser(process.env.SECRET)) // parsing the cookie and making req.cookies

// // TODO: only connect to Mongoif logged in
mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_ATLAS_PASSWORD}@micronote.u2jou.mongodb.net/accounts?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(console.log(`Connected to MongoDB`))
    .catch(error => console.error(error));

// ROUTES
app.use("/account", require("./routes/account"));
app.use("/notes", require("./routes/notes"));

// for a request that doesn't match one of the above routes just send the index.html
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname+'/client/build/index.html'));
// });

app.get("/debug", (req, res) => {
    if(process.env.ENV === "dev") {
        res.json("Hello! This is the debug route!");
    } else res.redirect("/");
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));