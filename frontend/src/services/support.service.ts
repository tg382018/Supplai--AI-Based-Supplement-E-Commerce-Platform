import api from './api';

export interface SupportTicket {
    id: string;
    subject: string;
    status: 'OPEN' | 'CLOSED';
    userId: string;
    createdAt: string;
    updatedAt: string;
    messages?: TicketMessage[];
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface TicketMessage {
    id: string;
    content: string;
    sender: 'USER' | 'ADMIN';
    ticketId: string;
    createdAt: string;
}

export const supportService = {
    createTicket: async (subject: string, message: string): Promise<SupportTicket> => {
        const response = await api.post('/support/tickets', { subject, message });
        return response.data;
    },

    getMyTickets: async (): Promise<SupportTicket[]> => {
        const response = await api.get('/support/tickets');
        return response.data;
    },

    getTicketById: async (ticketId: string): Promise<SupportTicket> => {
        const response = await api.get(`/support/tickets/${ticketId}`);
        return response.data;
    },

    sendMessage: async (ticketId: string, content: string): Promise<TicketMessage> => {
        const response = await api.post(`/support/tickets/${ticketId}/messages`, { content });
        return response.data;
    },

    // Admin endpoints
    getAllTickets: async (): Promise<SupportTicket[]> => {
        const response = await api.get('/support/admin/tickets');
        return response.data;
    },

    closeTicket: async (ticketId: string): Promise<SupportTicket> => {
        const response = await api.patch(`/support/tickets/${ticketId}/close`);
        return response.data;
    },

    reopenTicket: async (ticketId: string): Promise<SupportTicket> => {
        const response = await api.patch(`/support/tickets/${ticketId}/reopen`);
        return response.data;
    },
};
