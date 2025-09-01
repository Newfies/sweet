/* Modules */
const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const cors = require('cors');
const nedb = require('nedb');
const db = new nedb({ filename: 'links.db', autoload: true });
const nanoid = require('nanoid');
const validurl = require('valid-url');
const path = require('path');
const dotenv = require('dotenv').config();

const app = express();

/* Variable */
const PORT = process.env.PORT

/* Set */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

/* Use */
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true })); 
app.use(session({
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

/* Post */
app.post('/', function(req, res) {
    let { inplink, inpslug, inpsubmit } = req.body;

    if (inpsubmit === "link") {

        // Validate URL
        if (!validurl.isWebUri(inplink)) {
            return res.send("Invalid URL!");
        }

        // Generate slug if not provided
        if (!inpslug || inpslug.trim() === "") {
            inpslug = nanoid.nanoid(6); // 6-character random ID
        }

        // Check if slug already exists
        db.findOne({ slug: inpslug }, (err, doc) => {
            if (doc) {
                return res.send("Slug already taken! Try another.");
            }

            // Save to database
            db.insert({ slug: inpslug, url: inplink }, (err, newDoc) => {
                if (err) return res.send("Error saving URL.");
                res.send(`Short URL created: <a href="/${inpslug}">url.com/${inpslug}</a>`);
            });
        });
    } else {
        res.send("Unknown action.");
    }
});

/* Get */
app.get('/', function(req, res) {
    res.render("index");
});

app.get('/:slug', function(req, res) {
    const slug = req.params.slug;

    db.findOne({ slug }, (err, doc) => {
        if (doc && doc.url) {
            res.redirect(doc.url);
        } else {
            res.status(404).send("Short URL not found!");
        }
    });
});

/* Listen */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});