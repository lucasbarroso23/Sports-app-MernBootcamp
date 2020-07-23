const Registration = require('../models/Registration');
const { create } = require('../models/Registration');
const jwt = require('jsonwebtoken');

module.exports = {

    create(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                res.sendStatus(401);
            } else {
                const { user_id } = req.headers;
                const { eventId } = req.params;
                const { date } = req.body;

                const registration = await Registration.create({
                    user: user_id,
                    event: eventId,
                    date
                })

                await registration
                    .populate('event')
                    .populate('user', '-password')
                    .execPopulate();

                return res.json(registration)
            }
        })
    },

    async getRegistrationById(req, res) {
        jwt.verify(req.token, 'secret', async (err, authData) => {
            if (err) {
                res.sendStatus(401);
            } else {
                const { registration_id } = req.params;
    
                try {
                    const registration = await Registration.findById(registration_id)
    
                    await registration
                        .populate('event')
                        .populate('user', '-password')
                        .execPopulate();
    
                    return res.json(registration)
                } catch (error) {
                    return res.status(400).json({ message: 'Registration not found' })
                }
                
            }
        })
    }

}