import prisma from '../config/prisma.js';

class IbadahRepository {
    async findAll(args = {}) {
        return prisma.agenda.findMany({
            ...args,
            orderBy: args.orderBy || [
                { tanggal: 'desc' },
                { jam_mulai: 'desc' }
            ]
        });
    }

    async create(data) {
        const { judul, tanggal, waktu, lokasi, penanggung_jawab, status } = data;
        return prisma.agenda.create({
            data: {
                kegiatan: judul,
                tanggal: new Date(tanggal),
                jam_mulai: new Date(`1970-01-01T${waktu}:00`),
                lokasi,
                penanggung_jawab,
                status: status || 'aktif'
            }
        });
    }

    async update(id, data) {
        const { judul, tanggal, waktu, lokasi, penanggung_jawab, status } = data;
        return prisma.agenda.update({
            where: { id: parseInt(id) },
            data: {
                kegiatan: judul,
                tanggal: tanggal ? new Date(tanggal) : undefined,
                jam_mulai: waktu ? new Date(`1970-01-01T${waktu}:00`) : undefined,
                lokasi,
                penanggung_jawab,
                status
            }
        });
    }

    async delete(id) {
        return prisma.agenda.delete({
            where: { id: parseInt(id) }
        });
    }

    async count(args = {}) {
        return prisma.agenda.count(args);
    }
}

export default new IbadahRepository();
