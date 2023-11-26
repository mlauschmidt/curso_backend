class TicketDTO {
    constructor (ticket) {
        this.id = ticket.id || ticket._id,
        this.code = ticket.code,
        this.purchase_datetime = ticket.purchase_datetime,
        this.amount = ticket.amount,
        this.purchaser = ticket.purchaser,
        this.products = ticket.products.map((item) => ({
            product: {
                id: item.product.id || item.product._id,
                title: item.product.title,
                price: item.product.price,
                thumbnail: item.product.thumbnail
            },
            quantity: item.quantity,
            subtotal: item.subtotal
        }))
    }
}

module.exports = TicketDTO;