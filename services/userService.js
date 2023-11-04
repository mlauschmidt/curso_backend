const UserManager = require('../storage/userManager');
const { isValidPassword } = require('../utils/passwordHash');

class UserService {
    constructor () {
        this.storage = new UserManager();
    }

    deletePassword (data) {
        let user = data;
        delete user.password;
        console.log('Contraseña eliminada');

        return user;
    }

    async validatePassword (userId, password) {
        let user = await this.storage.getUser(null, null, userId);
        
        //manejo de error cuando el usuario esta creado pero no tiene contraseña (no hay user.password), como cuando se crea por github

        if (isValidPassword(password, user.password)){
            user = await this.deletePassword(user);

            return user;
        } else {
            return {};
        }
    }
  
    getUsers () {
        //puedo hacer un map y borrar las contraseñas de todos
        return this.storage.getUsers();
    }
  
    async getUser (username, email, id, cartId) {
        let user = await this.storage.getUser(username, email, id, cartId);

        if (user.password) {
            user = await this.deletePassword(user);
        }

        return user;
    }
  
    async createUser (data) {
        let newUser = await this.storage.createUser(data);

        if (newUser.password) {
            newUser = await this.deletePassword(newUser);
        }

        return newUser;
    }
  
    async updateUser (username, email, data) {
        let updatedUser = await this.storage.updateUser(username, email, data);

        if (updatedUser.password) {
            updatedUser = await this.deletePassword(updatedUser);
        }

        return updatedUser;
    }
  
    deleteUser (username, email) {
        return this.storage.deleteUser(username, email);
    }
}

module.exports = UserService;