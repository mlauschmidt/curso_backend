const TicketDTO = require('../DAO/DTO/ticketDTO');

class TicketService {
    constructor (dao) {
        this.dao = dao;
    }

    async getTickets () {
        const tickets = await this.dao.getTickets();
        const ticketsDTO = tickets.map(ticket => new TicketDTO(ticket));

        return ticketsDTO;
    }

    async getTicketById (ticketId) {
        const ticket = await this.dao.getTicketById(ticketId);
        const ticketDTO = new TicketDTO(ticket);

        return ticketDTO;
    }
    
    async createTicket (data) {
        const newTicket = await this.dao.createTicket(data);
        const ticketDTO = new TicketDTO(newTicket);

        return ticketDTO;
    }
}

module.exports = TicketService;