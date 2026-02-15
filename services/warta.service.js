import prisma from '../config/prisma.js';

class WartaService {
    async getAll(pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const [data, totalItems] = await Promise.all([
            prisma.pewartaan.findMany({
                where: { status: 'approved' },
                select: {
                    id: true,
                    judul: true,
                    tanggal_ibadah: true,
                    tempat_jemaat: true,
                    tema_khotbah: true,
                    ayat_firman: true,
                    hari: true,
                    status: true,
                    created_at: true,
                    updated_at: true
                },
                orderBy: [
                    { tanggal_ibadah: 'desc' },
                    { created_at: 'desc' }
                ],
                take: limit,
                skip: skip
            }),
            prisma.pewartaan.count({
                where: { status: 'approved' }
            })
        ]);

        return {
            data,
            totalPages: Math.ceil(totalItems / limit),
            currentPage: page,
            totalItems
        };
    }

    async create(data) {
        // Note: 'warta' might be a separate table or just another status in pewartaan
        // Based on legacy code, it seems there's a 'warta' table
        return await prisma.warta.create({
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : new Date(),
                files: data.files || []
            }
        });
    }

    async update(id, data) {
        return await prisma.warta.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : undefined
            }
        });
    }

    async delete(id) {
        return await prisma.warta.delete({
            where: { id: parseInt(id) }
        });
    }

    async updateStatus(id, status) {
        return await prisma.warta.update({
            where: { id: parseInt(id) },
            data: { status }
        });
    }
}

export default new WartaService();
