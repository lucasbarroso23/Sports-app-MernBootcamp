const express = require('express');
const multer = require('multer');

const uploadConfig = require('./config/upload');
const UserController = require('./controllers/UserController');
const EventController = require('./controllers/EventController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/status', (req, res) => { 
    res.send({ status: 200 });
})

//Event
routes.post('/event', upload.single("thumbnail"), EventController.createEvent)


//User
routes.post('/user/register', UserController.createUser)

routes.get('/user/:userId', UserController.getUserById)

module.exports = routes;