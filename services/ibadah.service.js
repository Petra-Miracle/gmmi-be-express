import prisma from '../config/prisma.js';

class IbadahService {
    async getAll() {
        return await prisma.agenda.findMany({
            orderBy: [
                { tanggal: 'desc' },
                { jam_mulai: 'desc' }
            ]
        });
    }

    async create(data) {
        const { judul, tanggal, waktu, lokasi, penanggung_jawab, status } = data;
        return await prisma.agenda.create({
            data: {
                kegiatan: judul,
                tanggal: new Date(tanggal),
                jam_mulai: new Date(`1970-01-01T${waktu}:00`), // Store as date-time but used for time
                lokasi,
                penanggung_jawab,
                status: status || 'aktif'
            }
        });
    }

    async update(id, data) {
        const { judul, tanggal, waktu, lokasi, penanggung_jawab, status } = data;
        return await prisma.agenda.update({
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
        return await prisma.agenda.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new IbadahService();
