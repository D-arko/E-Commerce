const express = require('express');
const app = express();
const session = require("express-session");
const PORT = 3000;
const Pool = require('pg').Pool;
const passport = require('passport');
const LocalStrategy = require('passport-local');
const store = new session.MemoryStore();
const bodyParser = require('body-parser');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'E-Commerce-db1',
    password: 'postgres',
    port: 5432
});

app.use(bodyParser.json());

app.use(
  session({
    secret: "f4z4gs$Gcg",
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
})
);

app.use(passport.initialize());
app.use(passport.session());

// Strategy for loging users in
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

// USERS
// Get all users from a database
const getAllUsers = (request, response) => {
    pool.query('SELECT * FROM users;', (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Get a single user from a database by id
const getUser = (request, response) => {
    const id = parseInt(req.params.id);

    pool.query('SELECT * FROM users WHERE id = $1', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).json(results.rows);
        }
    });
};

// Registering new user
const registerUser = (request, response) => {
    const { username, password } = request.body;
    
    pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *', [ username, password ], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).send(`User created with username: ${username}.`);
        }
    });
};

// Delete user from database by id
const deleteUser = (request, response) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE * FROM users WHERE id = $1', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).send(`User deleted with id = ${id}`);
        }
    });
};


// PRODUCTS
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

// Get a single product by id
const getProduct = (request, response) => {
    const id = parseInt(request.params.id);

    pool.query('SELECT * FROM products WHERE id = $1'), [ id ], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).json(results.rows);
        }
    };
};

// Insert new product into database
const insertProduct = (request, response) => {
    const { name, category, quantity_available } = req.body;
    
    pool.query('INSERT INTO products (name, category, quantity_available) VALUES ($1, $2, $3) RETURNING *;', 
        [ name, category, quantity_available ], (error, results) => {
            if (error) {
                throw error;
            } else {
                response.status(201).json(results.rows);
            }
        });
    };
    
// Delete product by id
const deleteProduct = (request, response) => {
    const id = parseInt(req.params.id);

    pool.query('DELETE FROM products WHERE id = $1', [ id ], (error, results) => {
        if (error) {
            throw error;
        } else {
            response.status(200).send(`User deleted with id ${id}`);
        }
    });
};


// Logging in a user
app.post('/login',
passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
function(req, res) {
    res.redirect('/~' + req.user.username);
}
);

// Render login page
app.get('/login',
function(req, res, next) {
    res.render('login');
});

// PRODUCTS ROUTES
// Route for handling requests for getting all products
app.get('/products', getAllProducts);
// Route for handling requests for getting a product by id

app.get('/products/:id', getProduct);

// Route for handling requests for inserting a new product
app.post('/products', insertProduct);

// Route for handling requests for deleting a product by id
app.delete('/products/:id', deleteProduct);

// USERS ROUTES
// Route for handling requests for getting all users
app.get('/users', getAllUsers);

// Route for handling request for getting a single user by id
app.get('/users/:id', getUser);

// Route for handling requests for registering new users
app.post('/users/register', registerUser);

// Route for  handling requests for deleting a user by id
app.delete('/users/:id', deleteUser);

// listening port
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});