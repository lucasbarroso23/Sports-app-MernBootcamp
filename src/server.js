const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const UserController = require('./controllers/UserController');

const PORT = process.env.PORT ||  8000;


if(process.env.NODE_ENV != 'production'){
    require('dotenv').config()
}


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => { 
    res.send('hello from nodemon');
})

app.post('/register', UserController.store)

try {
    mongoose.connect(process.env.MONGO_DB_CONNECTION, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
} catch (error) {
    console.log(error)
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})


