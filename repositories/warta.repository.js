import prisma from '../config/prisma.js';

class WartaRepository {
    async create(data) {
        return prisma.warta.create({
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
                files: data.files || []
            }
        });
    }

    async update(id, data) {
        return prisma.warta.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : undefined
            }
        });
    }

    async delete(id) {
        return prisma.warta.delete({
            where: { id: parseInt(id) }
        });
    }

    async updateStatus(id, status) {
        return prisma.warta.update({
            where: { id: parseInt(id) },
            data: { status }
        });
    }

    async findMany(args) {
        return prisma.warta.findMany(args);
    }
}

export default new WartaRepository();
