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

// Define the askPiece endpoint
app.post('/askPiece', async (req, res) => {
    //Parse the request body to extract the position information
    const { div, piece } = req.body;



    // Do some processing with the position information to determine the location
    color = piece.slice(0,5)
    colonne = div.slice(0,1)
    ligne = div.slice(1,2)
    console.log(ligne)
    //convert ligne to int
    ligne = parseInt(ligne)
    if(color == "white"){
        test = colonne + (ligne+1)
        test2 = colonne + (ligne+2)
    }
    else{
        test = colonne + (ligne-1)
        test2 = colonne + (ligne-2)
    }

    // Send a response back to the client with the location information
    res.status(200).json({ test, test2 });
});

module.exports = app;