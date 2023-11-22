class CartDTO {
    constructor (cart) {
        this.id = cart.id || cart._id,
        this.products = cart.products.map((item) => ({
            product: {
                id: item.product.id || item.product._id,
                title: item.product.title,
                price: item.product.price,
                thumbnail: item.product.thumbnail
            },
            quantity: item.quantity
        }))
    }
}

module.exports = CartDTO;