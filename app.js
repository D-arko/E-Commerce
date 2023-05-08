const express = require('express');
const app = express();
const session = require("express-session");
const PORT = 3000;
const Pool = require('pg').Pool;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const store = new session.MemoryStore();



const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'E-Commerce-db',
    password: 'postgres',
    port: 5432
});


// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);


// Registering new user
const registerUser = (request, response) => {
    const { username, password } = req.body;
    
    pool.query(`INSERT INTO E-Commerce-db VALUES (5, $1, $2) RETURNING *;`, [username, password], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).send(`User created with username: ${username}.`);
        }
    });
};


app.use(passport.initialize());
app.use(passport.session());

// Route for handling requests for registering new users
app.post('/register', registerUser);


// Logging in a user
app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/~' + req.user.username);
  }
);

app.get('/login',
  function(req, res, next) {
    res.render('login');
  }
);

passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE usename = ?', [ username ], function(err, user) {
        
        // error occured
        if (err) { return cb(err); }
        
        // no error occured, but user doesn't exist or password is incorrect
        if (!user) { return cb(null, false, { message: 'Incorrect username or password.'}); }
        
        // no error occured, user found and password is correct
        return cb(null, user);
    });
}));


// Get all products
const getAllProducts = (request, response) => {
    pool.query('SELECT * FROM products ORDER BY id ASC;', (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Route for handling requests for getting all products
app.get('/products', getAllProducts);


// Get a single product by id
const getProduct = (request, response) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM products WHERE id = $1'), [ id ], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).json(results.rows);
        }
    };
};

// Route for handling requests for getting a product by id
app.get('/products/:id', getProduct);




app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});