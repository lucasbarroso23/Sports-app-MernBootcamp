const User = require('../models/User');
const { request } = require('express');

module.exports = {
    async store(req, res) {
        try {
            console.log(req.body)
            const {firstName, lastName, password, email} =  request.body;
        } catch (error) {
            
        }
    }
}