const express = require('express');
const app = express();
const PORT = 3000;
const db = require('./queries.js');

const bodyParser = require('body-parser');

app.use(bodyParser.json());

// ROUTES //
// homepage
app.get('/', (request, response) => {
    response.send('Welcome to E-Commerce!');
});

// PRODUCTS ROUTES
// Route for handling requests for getting all products
app.get('/products', db.getAllProducts);
// Route for handling requests for getting a product by id

app.get('/products/:id', db.getProduct);

// Route for handling requests for inserting a new product
app.post('/products', db.insertProduct);

// Route for handling requests for deleting a product by id
app.delete('/products/:id', db.deleteProduct);

        // USERS ROUTES
// Route for handling requests for getting all users
app.get('/users', db.getAllUsers);

// Route for handling request for getting a single user by id
app.get('/users/:id', db.getUser);

// Route for handling requests for registering new users
app.post('/users/register', db.registerUser);

// Route for handling requests for deleting a user by id
app.delete('/users/:id', db.deleteUser);

    // CART ROUTES
// Route for handling requests for getting all carts
app.get('/cart', db.getAllCarts);

// Route for handling requests for getting a cart by id
app.get('/cart/:id', db.getCart);

// Route for handling requests for inserting a new product into cart
app.post('/cart', db.addToCart);


// listening port
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});