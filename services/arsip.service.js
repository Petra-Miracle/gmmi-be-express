import prisma from '../config/prisma.js';

class ArsipService {
    async getArsip(bulan, tahun) {
        const startDate = new Date(tahun, bulan - 1, 1);
        const endDate = new Date(tahun, bulan, 0, 23, 59, 59);

        // Fetch from various tables in parallel
        const [announcements, warta, agenda] = await Promise.all([
            prisma.announcements.findMany({
                where: { created_at: { gte: startDate, lte: endDate } },
                select: { id: true, isi: true, created_at: true }
            }),
            prisma.warta.findMany({
                where: { tanggal: { gte: startDate, lte: endDate } },
                select: { id: true, judul: true, tanggal: true }
            }),
            prisma.agenda.findMany({
                where: { tanggal: { gte: startDate, lte: endDate } },
                select: { id: true, kegiatan: true, tanggal: true }
            })
        ]);

        // Format and combine
        const result = [
            ...announcements.map(a => ({
                id: a.id,
                type: 'Pengumuman',
                name: a.isi.substring(0, 100),
                date: a.created_at.toISOString().split('T')[0],
                size: 'N/A'
            })),
            ...warta.map(w => ({
                id: w.id,
                type: 'Warta Jemaat',
                name: w.judul,
                date: w.tanggal.toISOString().split('T')[0],
                size: 'N/A'
            })),
            ...agenda.map(ag => ({
                id: ag.id,
                type: 'Jadwal Pelayanan',
                name: ag.kegiatan,
                date: ag.tanggal.toISOString().split('T')[0],
                size: 'N/A'
            }))
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return result;
    }
}

export default new ArsipService();
