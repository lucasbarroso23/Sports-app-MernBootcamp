const Event = require('../models/Event');



module.exports = {

    async getEventById(req, res) {

        const { eventId } = req.params;

        try {
            const event = await Event.findById(eventId)

            if (event) {
                return res.json(event)
            }

        } catch (error) {

            return res.status(400).json({ message: "Event ID does not exist!" })
        }

    },


    async getAllEvents(req, res) {
        const { sport } = req.params;
        const query = sport ? { sport } : {}
        try {
            const events = await Event.find(query)
            if (events) {
                return res.json(events);
            }
        } catch (error) {
            return res.status(400).json({ message: "Sorry, we dont have any events yet" })
        }

    },

    async getEventsByUserId(req, res) {
        const { user_id } = req.headers;
        try {
            const events = await Event.find({ user: user_id })
            if (events) {
                return res.json(events);
            }
        } catch (error) {
            return res.status(400).json({ message: `We do not have any events with this user_id ${user_id}` });
        }

    }
}