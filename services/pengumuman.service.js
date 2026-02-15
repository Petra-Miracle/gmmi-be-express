import prisma from '../config/prisma.js';

class PengumumanService {
    async getAll() {
        return await prisma.announcements.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    async create(data, userId) {
        return await prisma.announcements.create({
            data: {
                ...data,
                status: data.status || 'draft',
                created_by: userId
            }
        });
    }

    async update(id, data) {
        return await prisma.announcements.update({
            where: { id: parseInt(id) },
            data
        });
    }

    async delete(id) {
        return await prisma.announcements.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new PengumumanService();
