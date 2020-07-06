const User = require('../models/User');
const bcrypt = require('bcrypt');


module.exports = {
    async createUser(req, res) {
        try {
            const {firstName, lastName, password, email} =  req.body;

            const existentUser = await User.findOne({email});

            if(!existentUser) {
                const hashedPassword = await bcrypt.hash(password, 10);
                const user = await User.create({
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword
                });

                return res.json(user)
            }

            return res.status(400).json({
                message:'email already exist! Do you want to login instead?'
            });

        } catch (error) {
            throw Error(`Error while registering a new user : ${error}`)
        }
    },

    async getUserById(req, res) {

        const { userId } = req.params;

        try {
            const user = await User.findById(userId);
            return res.json(user);
        } catch (error) {
            return res.status(400).json({
                message:'User ID does not exist! Do you want to register instead?'
            });
        }
    }

}