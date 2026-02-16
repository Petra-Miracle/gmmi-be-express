import prisma from '../config/prisma.js';

class PengumumanRepository {
    async findAll() {
        return prisma.announcements.findMany({
            orderBy: { created_at: 'desc' }
        });
    }

    async create(data, userId) {
        return prisma.announcements.create({
            data: {
                ...data,
                status: data.status || 'draft',
                created_by: userId
            }
        });
    }

    async update(id, data) {
        return prisma.announcements.update({
            where: { id: parseInt(id) },
            data
        });
    }

    async delete(id) {
        return prisma.announcements.delete({
            where: { id: parseInt(id) }
        });
    }

    async count(args = {}) {
        return prisma.announcements.count(args);
    }
}

export default new PengumumanRepository();
