import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { supportService } from '../../services/support.service';
import type { SupportTicket, TicketMessage } from '../../services/support.service';

interface SupportState {
    tickets: SupportTicket[];
    currentTicket: SupportTicket | null;
    loading: boolean;
    error: string | null;
}

const initialState: SupportState = {
    tickets: [],
    currentTicket: null,
    loading: false,
    error: null,
};

export const fetchMyTickets = createAsyncThunk('support/fetchMyTickets', async () => {
    return await supportService.getMyTickets();
});

export const fetchTicketById = createAsyncThunk('support/fetchTicketById', async (ticketId: string) => {
    return await supportService.getTicketById(ticketId);
});

export const createTicket = createAsyncThunk(
    'support/createTicket',
    async ({ subject, message }: { subject: string; message: string }) => {
        return await supportService.createTicket(subject, message);
    }
);

export const sendMessage = createAsyncThunk(
    'support/sendMessage',
    async ({ ticketId, content }: { ticketId: string; content: string }) => {
        return await supportService.sendMessage(ticketId, content);
    }
);

export const fetchAllTickets = createAsyncThunk('support/fetchAllTickets', async () => {
    return await supportService.getAllTickets();
});

export const closeTicket = createAsyncThunk('support/closeTicket', async (ticketId: string) => {
    return await supportService.closeTicket(ticketId);
});

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyTickets.fulfilled, (state, action: PayloadAction<SupportTicket[]>) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(fetchMyTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch tickets';
            })
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action: PayloadAction<SupportTicket>) => {
                state.loading = false;
                state.currentTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch ticket';
            })
            .addCase(createTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state, action: PayloadAction<SupportTicket>) => {
                state.loading = false;
                state.tickets.unshift(action.payload);
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create ticket';
            })
            .addCase(sendMessage.fulfilled, (state, action: PayloadAction<TicketMessage>) => {
                if (state.currentTicket) {
                    state.currentTicket.messages = [
                        ...(state.currentTicket.messages || []),
                        action.payload,
                    ];
                }
            })
            .addCase(fetchAllTickets.fulfilled, (state, action: PayloadAction<SupportTicket[]>) => {
                state.loading = false;
                state.tickets = action.payload;
            })
            .addCase(closeTicket.fulfilled, (state, action: PayloadAction<SupportTicket>) => {
                const index = state.tickets.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
                if (state.currentTicket?.id === action.payload.id) {
                    state.currentTicket.status = 'CLOSED';
                }
            });
    },
});

export const { clearCurrentTicket, clearError } = supportSlice.actions;
export default supportSlice.reducer;
