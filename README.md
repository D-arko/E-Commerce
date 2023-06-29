# E-Commerce
E-Commerce Application

This is a complete server side implementation of E-Commerce web application.
It is built using Node JS, Express framework and PostgreSQL.
Express JS framework was used to start a server and listen for new requests from a client.
PostgreSQL was used to make new database and its tables: cart, customers, orders, products and users.
Server and database are connected via node-postgres module.

In queries.js file I implemented functions for CRUD operations for every table in a database.
Those functions are exported to app.js file. In app.js these functions are used to handle HTTP requests for each endpoint.
