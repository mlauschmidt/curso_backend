const UserService = require('../services/userService');
const mongoose = require('mongoose');

class UserController {
    constructor () {
        this.service = new UserService()
    }

    async getUsers (req, res) {
        try {
            const users = await this.service.getUsers();

            return res.json(users);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
     
    async getUser (req, res) {
        try {
            const username = req.params.user;
            const email = req.params.user;
            const id = mongoose.Types.ObjectId.isValid(req.params.user) ? req.params.user : null;

            const user = await this.service.getUser(username, email, id);
            
            return res.json(user);    
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
  
    async createUser (req, res) {
        try {
            const data = req.body;
            const newUser= await this.service.createUser(data);
    
            return res.status(201).json(newUser);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        } 
    }
  
    async updateUser (req, res) {
        try { 
            const username = req.params.user;
            const email = req.params.user;
            const newData = req.body;
            const updatedUser = await this.service.updateUser(username, email, newData);
    
            return res.status(200).json(updatedUser);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
  
    async deleteUser (req, res) {
        try {
            const username = req.params.user;
            const email = req.params.user;
            const user = await this.service.deleteUser(username, email);

            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }    
    }
}

module.exports = UserController;