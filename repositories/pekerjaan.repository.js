import prisma from '../config/prisma.js';

class PekerjaanRepository {
    async findAll() {
        return prisma.pekerjaan.findMany({
            select: { id: true, nama_pekerjaan: true },
            orderBy: { nama_pekerjaan: 'asc' }
        });
    }

    async findById(id) {
        return prisma.pekerjaan.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, nama_pekerjaan: true }
        });
    }

    async create(nama) {
        return prisma.pekerjaan.create({
            data: { nama_pekerjaan: nama.trim() }
        });
    }

    async update(id, nama) {
        return prisma.pekerjaan.update({
            where: { id: parseInt(id) },
            data: { nama_pekerjaan: nama.trim() }
        });
    }

    async delete(id) {
        return prisma.pekerjaan.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new PekerjaanRepository();
