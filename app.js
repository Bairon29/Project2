const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');

/* BCrypt stuff here */
const bcrypt = require('bcrypt');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/viewsFile');
app.use("/", express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));



var db = pgp(process.env.DATABASE_URL) || pgp('postgres://student_02@localhost:5432/SecondPro_db');

// app.get('/', function(req, res) {

// res.render('index');

// });

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Node app is running on port ', port);
});
