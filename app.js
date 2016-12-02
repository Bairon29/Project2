const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const methodOver = require('method-override');
/* BCrypt stuff here */
const bcrypt = require('bcrypt');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/viewsFile');
app.use("/", express.static(__dirname + '/public'));
app.use(methodOver('_method'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// var userStatus = {
// logged_in: false,
// email: ""
// };

 var userStatus = {logged: false, fname: "", lname: "", genger: "", email: ""};

app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
// var jsdom = require('jsdom');
// // var $ = require('./public/jquery.js')(jsdom.jsdom().createWindow());
// var PARSER = require('xml2js');
// var fetch = require('node-fetch');

// var window = jsdom.jsdom().defaultView;
// var $ = require('jquery')(window)
// jsdom.jQueryify(window, "./public/jquery.js", function(){
//     var $ = window.$;
// })

  // , jq = require('jquery').create
  // , jQuery = require('jquery').create.myWindow()
  ;



var db = pgp(process.env.DATABASE_URL || 'postgres://student_02@localhost:5432/SecondPro_db');

//GET routes

app.get('/', function(req, res) {

  console.log('in index main',req.session.user)
if(req.session.user){
  userStatus.logged_in = true;
  userStatus.fname = req.session.user.fname;
  userStatus.lname = req.session.user.lname;
  userStatus.email = req.session.user.email;
  userStatus.gender = req.session.user.gender;
  res.render('index', userStatus);
} else {
  res.render('userpages/signin');
}
});

app.get('/login', function(req, res){
res.render('userpages/signin');
})

app.get('/signup', function(req, res){
  res.render('userpages/signup');
})

app.get('/profile', function(req, res){
  if(req.session.user){
    res.redirect('/userlogin');
  }
  else{
    res.redirect('/login');
  }
})

app.get('/mylistp', function(req, res){
  db.many('SELECT * FROM movies WHERE user_id = $1',
    [req.session.user.id]).then(function(movies){
      console.log(movies);
      res.render('userpages/mylist', {
        myList: movies
      })
    }).catch(function(err){
        res.render('userpages/mylist');
      })
})

app.get('/updatemovie/:id', function(req, res){

  db.one('SELECT * FROM movies WHERE id = $1',
    [req.params.id]).then(function(movie){
      res.render('movie/singleMovie',{
        movie: movie
      })
    })
})


//POST routes

app.delete('/deactive/:id', function(req, res){
  db.none('DELETE FROM movies WHERE user_id = $1',
    [req.session.user.id]).then(function(){
      db.none('DELETE FROM users WHERE id = $1',
        [req.params.id]).then(function(){
          req.session.user = null;
      res.redirect('/login');
        })
    })
})



app.put('/updatemovie/:id', function(req, res){
  var data = req.body;
  if(data.image === ''){
    db.none('UPDATE movies SET name = $1 WHERE id = $2',
      [data.name, req.params.id]).then(function(){
        res.redirect('/mylistp');
      })
  }
  else{
    db.none('UPDATE movies SET name = $1, image = $2 WHERE id = $3',
      [data.name, data.image, req.params.id]).then(function(){
        res.redirect('/mylistp');
      })
  }
})


app.delete('/deletemovie/:id', function(req, res){
  db.none('DELETE FROM movies WHERE id = $1', [req.params.id])
  .then(function(){
      db.many('SELECT * FROM movies WHERE user_id = $1',
    [req.params.id]).then(function(movies){
      res.render('userpages/mylist', {
        myList: movies
      })
    }).catch(function(err){
        res.render('userpages/mylist');
      })
  })
})


app.post('/update', function(req, res){
  var data = req.body;
  db.none('UPDATE users SET Fname = $1, Lname = $2, Gender = $3, Email = $4 WHERE id = $5',
    [data.fname, data.lname, data.gender, data.email, req.session.user.id]).then(function(){
       if(!data.password === ''){
      bcrypt.hash(data.password, 10, function(err, hash){
          db.none('UPDATE users SET Password = $1 WHERE id = $2',
            [hash, req.session.user.id]).then(function(){
              db.one('SELECT * FROM users WHERE id = $1', [req.session.user.id])
              .then(function(user){
                req.session.user = user;
                res.redirect('/');
              })
            })
      })
  }
  else{
       db.one('SELECT * FROM users WHERE id = $1', [req.session.user.id])
              .then(function(user){
                req.session.user = user;
                res.redirect('/');
              })
  }


    })
})

app.put('/userlogin', function(req, res){
  var data = req.body;
  var gender = req.session.user.gender;
if(gender.toUpperCase() === 'F'){
  db.one('SELECT * FROM users WHERE gender = $1', [req.session.user.gender])
  .then(function(user){
    res.render('profile/flogin', {
      id: req.session.user.id,
      fname: userStatus.fname,
      lname: userStatus.lname,
      email: userStatus.email,
      gender: userStatus.gender    })
  })
}
else if(gender.toUpperCase() === 'M'){
  db.one('SELECT * FROM users WHERE gender = $1', [req.session.user.gender])
  .then(function(user){
    res.render('profile/mlogin', {
      id: req.session.user.id,
      fname: userStatus.fname,
      lname: userStatus.lname,
      email: userStatus.email,
      gender: userStatus.gender
    })
  })
}

})


app.post('/add', function(req, res){
  var data = req.body;
  console.log(req.body);
  if(req.session.user){
  db.none('INSERT INTO movies (name, image, user_id) VALUES ($1, $2, $3)',
    [data.name, data.img, req.session.user.id]).then(function(){
      res.redirect('/');
    })
  }
  else{
    res.redirect('/login');
  }
});

app.post('/login', function(req,res){
  var data = req.body;
  db.one('SELECT * FROM users WHERE Email = $1',[data.email])
  .catch(function(){
    res.send('Email/Password not found');
  }).then(function(user){
    bcrypt.compare(data.password, user.password, function(err, cmp){
      console.log(user);
      if(cmp){
        console.log('yes log');
        req.session.user = user;
        res.redirect('/');
      }
      else{
        res.send('Email/Password not found');
      }
    })
  })
});

app.post('/signup', function(req, res){
  var data = req.body;
  bcrypt.hash(data.password, 10, function(err, hash){
    db.none('INSERT INTO users (Fname, Lname, Gender, Email, Password) VALUES ($1, $2, $3, $4, $5)',
      [data.Fname, data.Lname, data.gender, data.email, hash]).then(function(){
         res.redirect('/login');
      })
  })
})

app.post('/logout', function(req, res){
  if(req.session.user){
    req.session.user = null;
  }
  res.redirect('/');
})

var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Node app is running on port ', port);
});
