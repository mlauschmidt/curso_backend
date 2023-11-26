const { ticketService } = require('../services/index');

class TicketController {
    constructor () {
        this.service = ticketService;
    }

    async getTickets (req, res) {
        try {
            const tickets = await this.service.getTickets();
            
            return res.json(tickets);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
     
    async getTicketById (req, res) {
        try {
            const ticketId = req.params.tid;
            const ticket = await this.service.getTicketById(ticketId);
            
            return res.json(ticket);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
  
    async createTicket (req, res) {
        try {
            const data = {
                ...req.body,
                cartId: req.params.cid
            };

            const newTicket = await this.service.createTicket(data);
            
            return res.status(201).json(newTicket);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }   
    }
}

module.exports = TicketController;