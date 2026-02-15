import prisma from '../config/prisma.js';

class PekerjaanService {
    async getAll() {
        return await prisma.pekerjaan.findMany({
            select: { id: true, nama_pekerjaan: true },
            orderBy: { nama_pekerjaan: 'asc' }
        });
    }

    async getById(id) {
        return await prisma.pekerjaan.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, nama_pekerjaan: true }
        });
    }

    async create(nama) {
        return await prisma.pekerjaan.create({
            data: { nama_pekerjaan: nama.trim() }
        });
    }

    async update(id, nama) {
        return await prisma.pekerjaan.update({
            where: { id: parseInt(id) },
            data: { nama_pekerjaan: nama.trim() }
        });
    }

    async delete(id) {
        // Check usage
        const usage = await prisma.jemaat.count({
            where: { pekerjaan_id: parseInt(id) }
        });

        if (usage > 0) {
            throw new Error('Pekerjaan tidak dapat dihapus karena sedang digunakan oleh jemaat');
        }

        return await prisma.pekerjaan.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new PekerjaanService();
