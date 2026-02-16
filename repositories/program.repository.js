import prisma from '../config/prisma.js';

class ProgramRepository {
    async findMany(args = {}) {
        return prisma.program_kegiatan_gereja.findMany({
            ...args,
            orderBy: args.orderBy || { created_at: 'desc' }
        });
    }

    async findById(id) {
        return prisma.program_kegiatan_gereja.findUnique({ where: { id } });
    }

    async create(data) {
        return prisma.program_kegiatan_gereja.create({ data });
    }

    async update(id, data) {
        return prisma.program_kegiatan_gereja.update({
            where: { id },
            data: {
                ...data,
                updated_at: new Date()
            }
        });
    }

    async delete(id) {
        return prisma.program_kegiatan_gereja.delete({ where: { id } });
    }

    async count(where = {}) {
        return prisma.program_kegiatan_gereja.count({ where });
    }

    async groupByBidang() {
        return prisma.program_kegiatan_gereja.groupBy({
            by: ['bidang'],
            _count: { _all: true }
        });
    }
}

export default new ProgramRepository();
