import prisma from '../config/prisma.js';

class RenunganRepository {
    async findAll() {
        return prisma.renungan.findMany({
            orderBy: { tanggal: 'desc' }
        });
    }

    async findById(id) {
        return prisma.renungan.findUnique({
            where: { id: parseInt(id) }
        });
    }

    async create(data) {
        return prisma.renungan.create({
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : new Date()
            }
        });
    }

    async update(id, data) {
        return prisma.renungan.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : undefined
            }
        });
    }

    async delete(id) {
        return prisma.renungan.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new RenunganRepository();
