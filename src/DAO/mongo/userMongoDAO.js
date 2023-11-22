const userModel = require('./models/user.model');
const { createHash } = require('../../../utils/passwordHash');

class UserManager {
    constructor () {
        this.model = userModel;
    }

    async getUsers () {
        const users = await this.model.find();

        if (users) {
            return users;
        } else {
            console.log('No se pudo acceder a la base de datos.');
            throw new Error('No se pudo acceder a la base de datos.');
        }
    }

    async getUser (username, email, id, cartId) {
        const user = await this.model.findOne({"$or": [{username}, {email}, {_id: id}, {cartId}]}).lean();

        if (user) {
            return user;
        } else {
            console.log('Not found.');
            return {};
        }
    }

    async createUser (data) {
        if (data.password) {
            data.password = createHash(data.password);
        }
                
        const newUser = await this.model.create(data);

        if (newUser) {
            console.log('Usuario creado correctamente.');
            return newUser;
        } else {
            console.log('Error al crear el usuario.');
            throw new Error('Error al crear el usuario.');
        }
    }

    async updateUser (username, email, data) {
        const user = await this.getUser(username, email);

        if (user._id) {
            const newData = {
                _id: user._id,
                name: data.name ?? user.name,
                lastname: data.lastname ?? user.lastname,
                username: data.username ?? user.username,
                email: user.email,
                age: data.age ?? user.age,
                password: data.password ?? user.password,
                cartId: data.cartId ?? user.cartId,
                role: user.role
            };

            try {
                await this.model.updateOne({"$or": [{username}, {email}]}, newData);

                console.log('Usuario actualizado correctamente.');

                return newData;
            } catch (err) {
                console.log('Error al actualizar el usuario.', err);
                throw new Error('Error al actualizar el usuario.');
            }
        } else {
            console.log('Not found.');
            throw new Error('Usuario inexistente.');
        }  
    }

    async deleteUser (username, email) {
        const user = await this.getUser(username, email);

        if (user._id) {
            try {
                await this.model.deleteOne({"$or": [{username}, {email}]});

                console.log('Usuario eliminado correctamente.');

                return user;
            } catch (err) {
                console.log('Error al eliminar el usuario.', err);
                throw new Error('Error al eliminar el usuario.');
            }
        } else {
            console.log('Not found.');
            throw new Error('Usuario inexistente.');
        }
    }

    recoveryPassword () {
        //no lo puedo lograr desde updateUser??
    }
}

module.exports = UserManager;