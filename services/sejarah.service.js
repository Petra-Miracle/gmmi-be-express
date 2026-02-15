import prisma from '../config/prisma.js';

class SejarahService {
    async getAll() {
        return await prisma.sejarah.findMany({
            orderBy: { tanggal_peristiwa: 'asc' }
        });
    }

    async create(data) {
        return await prisma.sejarah.create({
            data: {
                ...data,
                tanggal_peristiwa: data.tanggal_peristiwa ? new Date(data.tanggal_peristiwa) : undefined
            }
        });
    }

    async update(id, data) {
        return await prisma.sejarah.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tanggal_peristiwa: data.tanggal_peristiwa ? new Date(data.tanggal_peristiwa) : undefined
            }
        });
    }

    async delete(id) {
        return await prisma.sejarah.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new SejarahService();
