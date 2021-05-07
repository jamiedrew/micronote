const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../db/user.model");
const jwt = require("jsonwebtoken");
const sync = require("../db/sync");
require("dotenv").config();

// REGISTER NEW ACCOUNT
router.post("/register", async (req, res) => {
    try {
        
        if (req.cookies.micronote) {
            return res.send({
                status: false,
                message: "Already logged in!"
            });
        }

        let { username, password, localNotes } = req.body;
        if (!username || !password) res.json({
            status: false,
            message: "Please enter a username and password."
        })

        User.findOne({ username: username }, async (err, user) => {
            if (err) throw err;
            // if an account exists for that username:
            if (user) return res.json({
                status: false,
                message: `An account for ${username} already exists.`
            });

            // otherwise:
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username: username,
                password: hashedPassword,
                notes: localNotes
            });

            // save that new user
            await newUser.save();
            console.log(newUser);

            // set jwt
            const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.SECRET);
            res.cookie("micronote", token);

            res.status(201).json({
                status: true,
                user: newUser
            });
        });
    } catch (error) {
        res.status(500).json(error);
    };
});

// ACCOUNT LOGIN
router.post("/login", async (req, res, next) => {
    // we're using stateless JWT so we don't have to call the database every time
    try {

        if (req.cookies.micronote) {
            return res.json({ 
                status: false,
                message: "Already logged in!"
            });
        }

        const { username, password, localNotes } = req.body;
        if (!username || !password) res.json({
            status: false,
            message: "Please enter a username and password."
        });

        User.findOne({ username: username }, async (err, user) => {
            if (err) console.error(err);
            if (!user) return res.json({
                status: false,
                message: `No account found for ${username}`
            });

            const validPassword = await bcrypt.compare(password, user.password);

            if (validPassword !== true) {
                res.json({
                    status: false,
                    message: "Invalid password"
                });
            } else {

                sync.syncNotes(user._id, localNotes)
                    .catch(err => console.error(err))

                // set jwt
                const token = jwt.sign({ id: user._id, username: user.username }, process.env.SECRET)
                res.cookie("micronote", token);
                res.json({
                    status: true,
                    user: {
                        id: user.id,
                        username: user.username,
                        notes: user.notes
                    }
                });
            }
            

        });

    } catch (error) {
        res.status(500).json(error);
    };
});

// GET USER
router.get("/user", async (req, res) => {
    try {
        const user = await jwt.verify(req.cookies.micronote, process.env.SECRET);
        const data = await sync.getUser(user.id)
        res.send(data);
    } catch (error) {
        res.json(error);
        console.error(error);
    }
    
});

// SYNC NOTES ON ACCOUNT
// maybe just when React loads? Can it read cookies?

// LOG OUT ACCOUNT
// delete the cookie & jwt on logout
router.post("/logout", async (req, res) => {
    if (!req.cookies.micronote) return res.send("Nobody is logged in");
    res.clearCookie("micronote");
    return res.status(200).json(`User logged out.`);
})

router.delete("/deleteAccount", async (req, res) => {
    // find the user in the db and take it out
    // delete all notes on the database and locally
    // (for local may have to do that via a React button / link)
    // also do the "are you _sure_ you meant to press that button" thing
})

module.exports = router;