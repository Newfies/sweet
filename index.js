/* Modules */
const express = require('express');
const session = require('express-session');
const bodyparser = require('body-parser');
const cors = require('cors');
const nedb = require('nedb');
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
app.post('/', function(req, res){
    const { inplink, inpslug, inpsubmit } = req.body;

    if (inpsubmit === "link") {
        // do x
    } else {
        // handle other actions if needed
    }

    res.send(`url.com/${inpslug} will goto ${inplink}`);
})

/* Get */
app.get('/', function(req, res) {
    res.render("index");
});

/* Listen */
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});