import api from './api';

export const storageService = {
    async uploadFile(file: File): Promise<{ filename: string; url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<{ filename: string; url: string }>('/storage/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async deleteFile(filename: string): Promise<void> {
        await api.delete(`/storage/${filename}`);
    },
};
