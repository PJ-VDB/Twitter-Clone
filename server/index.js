const express = require('express');
const cors = require('cors');
const monk = require('monk');
const rateLimit = require("express-rate-limit");
const Filter = require('bad-words'),

filter = new Filter();

const limiter = rateLimit({
    windowMs: 1 * 30 * 1000, // 30 seconds minutes
    max: 10 // limit each IP to 100 requests per windowMs
});

const app = express();

const db = monk('localhost/meower'); //db will be automatically created if it doesn't exist
const mews = db.get('mews'); //collection will be automatically created if it doesn't exist

app.use(cors());
app.use(express.json()); //any incoming body will be parsed as a json
app.use("/mews", limiter);

app.get('/', (req, res) => {
    res.json({
        message: 'Meower 😺'
    });
});

app.get('/mews', (req, res) => {
    mews.find()
    .then(mews => {
        res.json(mews);
    });
});

function isValidMew(mew){
    return mew.name && mew.name.toString().trim !== '' && 
           mew.content && mew.content.toString().trim !== '';
};

app.post('/mews', (req, res) => {
    if( isValidMew(req.body)){
        // console.log(req.body);
        const mew = {
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        console.log(mew);

        mews.insert(mew).then(createdMew => {
            res.json(createdMew);
        });

    } else {
        res.status(422);
        res.json({
            message: "Hey! Name and content are required!"
        });
    }
});


app.listen(5000, () => {
    console.log('Listening on http://localhost:5000');
}); 

