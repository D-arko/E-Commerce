const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
   res.send('Hello World1!');
});

app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});