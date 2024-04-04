const express = require("express");

const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3001;
const sendEmail = require('./sendEmail/sendEmail.js');

// Create Express app
const app = express();

// Connect to MongoDB and set up models
require("./db/conn.js");
const Register = require("./models/register.js");

// Define static files directory
const static_path = path.join(__dirname, "../public");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));

// Route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Route to serve register.html
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/register.html"));
});

// Register new user
app.post("/register", async (req, res) => {
    try {
        // Validate request body
        if (!req.body.username || !req.body.email || !req.body.password) {
            return res.status(400).send("Username, email, and password are required.");
        }

        // Create a new user document
        const registerUserSchema = new Register({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        });

        // Save the user document
        const registered = await registerUserSchema.save();
        res.status(201).redirect("main.html"); // Redirect to home page after registration
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user");
    }
});

// Route to fetch the username from the database
app.get("/getUsername", async (req, res) => {
    try {
        const user = await Register.findOne({});
        res.status(200).json({ username: user.username });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching username");
    }
});

// Route to handle login
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const pass = req.body.password;

        const user = await Register.findOne({ email: email });

        if (!user || user.password !== pass) {
            res.status(401).send("Invalid email or password");
        } else {
            res.redirect("main.html"); // Redirect to main page after successful login
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle sending email
app.post('/send-email', async (req, res) => {
    const { name, email, subject, suggestion } = req.body;

    try {
        await sendEmail(email, subject, `From: ${name} (${email})\n\n${suggestion}`);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error sending email:', error);
        res.sendStatus(500);
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
