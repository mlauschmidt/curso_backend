const fs = require('fs');
const { createHash } = require('../../utils/passwordHash');

class UserManager {
    constructor (path) {
        this.path = path;
    }

    async getUsers () {
        return fs.promises.readFile(this.path, 'utf-8')
            .then((contenidoArchivo) => {
                const users = JSON.parse(contenidoArchivo); 
                return users;
            })
            .catch((err) => {
                console.log('No se pudo acceder al archivo.', err);
                throw new Error('No se pudo acceder al archivo.');
            })
    }

    async getUser (username, email, userId, cartId) {
        username = username;
        email = email;
        userId = parseInt(userId);
        cartId = parseInt(cartId);

        return this.getUsers()
            .then((users) => {
                const user = users.find(user => user.username === username || user.email === email || user.id === userId || user.cartId === cartId);

                if (user) {
                    return user;
                } else {
                    console.log('Not found.');
                    return {};
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }

    async createUser (data) {
        if (data.name 
            && data.lastname
            && data.username
            && data.email
            && data.age
            && data.password) {

            return this.getUsers()
                .then((users) => {
                    const newUser = {
                        id: users.length ? users[users.length-1].id + 1 : 1,
                        name: data.name,
                        lastname: data.lastname,
                        username: data.username,
                        email: data.email,
                        age: data.age,
                        password: createHash(data.password),
                        role: data.role ?? "user"
                    };        

                    const userExists = users.findIndex(user => user.email === data.email);

                    if (userExists === -1) {
                        fs.promises.writeFile(this.path, JSON.stringify([...users, newUser], null, 2))
                            .then(() => {
                                console.log('Usuario creado correctamente.');
                            })
                            .catch((err) => {
                                console.log('Error al crear el nuevo usuario.', err);
                                throw new Error('Error al crear el nuevo usuario.');
                            })

                        return newUser;
                    } else {
                        console.log(`Ya existe un usuario con el email ${data.email}.`);
                        throw new Error(`Ya existe un usuario con el email ${data.email}.`);
                    }
                }) 
                .catch((err) => {
                    console.log(err);
                    throw new Error(err);
                })
        } else {
            console.log('Todos los campos son obligatorios.'); 
            throw new Error('Todos los campos son obligatorios.'); 
        }
    }
    
    async updateUser (username, email, data) {
        username = username;
        email = email;

        return this.getUsers()
            .then((users) => {                 
                const userIndex = users.findIndex(user => user.username === username || user.email === email);
                const user = users[userIndex];
                
                if (!(userIndex === -1)) {
                    const newData = {
                        id: user.id,
                        name: data.name ?? user.name,
                        lastname: data.lastname ?? user.lastname,
                        username: data.username ?? user.username,
                        email: user.email,
                        age: data.age ?? user.age,
                        password: data.password ?? user.password,
                        cartId: data.cartId ?? user.cartId,
                        role: user.role
                    };

                    users.splice(userIndex, 1, newData);

                    fs.promises.writeFile(this.path, JSON.stringify(users, null, 2))
                        .then(() => {
                            console.log('Usuario actualizado correctamente.');
                        })
                        .catch((err) => {
                            console.log('Error al actualizar el usuario.', err);
                            throw new Error('Error al actualizar el usuario.');
                        })
                    
                    return newData;
                } else {
                    console.log('Not found.');
                    throw new Error('Usuario inexistente.');
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }

    async deleteUser (username, email) {
        username = username;
        email = email;

        return this.getUsers()
            .then((users) => {
                const userIndex = users.findIndex(user => user.username === username || user.email === email);
                const deletedUser = users[userIndex];

                if (!(userIndex === -1)) {
                    users.splice(userIndex, 1);

                    fs.promises.writeFile(this.path, JSON.stringify(users, null, 2))
                        .then(() => {
                            console.log('Usuario eliminado correctamente.');
                        })
                        .catch((err) => {
                            console.log('Error al eliminar el usuario.', err);
                            throw new Error('Error al eliminar el usuario.');
                        })  
                    
                    return deletedUser;
                } else {
                    console.log('Not found.');
                    throw new Error('Usuario inexistente.');
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }
}

module.exports = UserManager;