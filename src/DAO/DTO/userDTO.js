class UserDTO {
    constructor (user) {
        this.id = user.id || user._id,
        this.name = user.name,
        this.lastname = user.lastname,
        this.username = user.username,
        this.email = user.email,
        this.age = user.age,
        this.cartId = user.cartId,
        this.role = user.role
    }
}

module.exports = UserDTO;