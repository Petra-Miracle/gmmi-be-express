import prisma from '../config/prisma.js';

class SejarahRepository {
    async findAll() {
        return prisma.sejarah.findMany({
            orderBy: { tanggal_peristiwa: 'asc' }
        });
    }

    async create(data) {
        return prisma.sejarah.create({
            data: {
                ...data,
                tanggal_peristiwa: data.tanggal_peristiwa ? new Date(data.tanggal_peristiwa) : undefined
            }
        });
    }

    async update(id, data) {
        return prisma.sejarah.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tanggal_peristiwa: data.tanggal_peristiwa ? new Date(data.tanggal_peristiwa) : undefined
            }
        });
    }

    async delete(id) {
        return prisma.sejarah.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new SejarahRepository();
