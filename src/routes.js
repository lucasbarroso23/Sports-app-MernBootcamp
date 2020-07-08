const express = require('express');
const multer = require('multer');

const uploadConfig = require('./config/upload');
const UserController = require('./controllers/UserController');
const EventController = require('./controllers/EventController');
const DashboardController = require('./controllers/DashboardController');
const LoginController = require('./controllers/LoginController');
const RegistrationController = require('./controllers/RegistrationController');

const routes = express.Router();
const upload = multer(uploadConfig);

routes.get('/status', (req, res) => { 
    res.send({ status: 200 });
})

//Registration
routes.post('/registration/:eventId', RegistrationController.create)

//Login
routes.post('/login', LoginController.store)

//Dashboard
routes.get('/dashboard', DashboardController.getAllEvents)
routes.get('/dashboard/:sport', DashboardController.getAllEvents)
routes.get('/event/:eventId', DashboardController.getEventById)

//Events
routes.delete('/event/:eventId', EventController.delete)
routes.post('/event', upload.single("thumbnail"), EventController.createEvent)


//User
routes.post('/user/register', UserController.createUser)
routes.get('/user/:userId', UserController.getUserById)

module.exports = routes;