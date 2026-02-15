import prisma from '../config/prisma.js';

class RenunganService {
    async getAll() {
        return await prisma.renungan.findMany({
            orderBy: { tanggal: 'desc' }
        });
    }

    async getById(id) {
        return await prisma.renungan.findUnique({
            where: { id: parseInt(id) }
        });
    }

    async create(data) {
        return await prisma.renungan.create({
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : new Date()
            }
        });
    }

    async update(id, data) {
        return await prisma.renungan.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : undefined
            }
        });
    }

    async delete(id) {
        return await prisma.renungan.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new RenunganService();
