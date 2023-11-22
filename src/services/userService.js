const UserDTO = require('../DAO/DTO/userDTO');
const { isValidPassword } = require('../../utils/passwordHash');

class UserService {
    constructor (dao) {
        this.dao = dao;
    }

    async validatePassword (userId, password) {
        //manejo de error cuando el usuario esta creado pero no tiene contraseña (no hay user.password), como cuando se crea por github

        const user = await this.dao.getUser(null, null, userId);

        if (isValidPassword(password, user.password)){
            const userDTO = new UserDTO(user);

            return userDTO;
        } else {
            return {};
        }
    }
  
    async getUsers () {
        const users = await this.dao.getUsers();
        const usersDTO = users.map(user => new UserDTO(user));

        return usersDTO;
    }
  
    async getUser (username, email, id, cartId) {
        const user = await this.dao.getUser(username, email, id, cartId);
        const userDTO = new UserDTO(user);

        return userDTO;
    }
  
    async createUser (data) {
        const newUser = await this.dao.createUser(data);
        const userDTO = new UserDTO(newUser);

        return userDTO;
    }
  
    async updateUser (username, email, data) {
        const updatedUser = await this.dao.updateUser(username, email, data);
        const userDTO = new UserDTO(updatedUser);

        return userDTO;
    }
  
    async deleteUser (username, email) {
        const user = await this.dao.deleteUser(username, email);
        const userDTO = new UserDTO(user);

        return userDTO;
    }
}

module.exports = UserService;