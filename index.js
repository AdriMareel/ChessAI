const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'front')));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front/index.html');
});