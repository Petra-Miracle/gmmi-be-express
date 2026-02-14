import prisma from '../config/prisma.js';

class DashboardRepository {
    async getCounts() {
        const [
            pewartaanTotal,
            pewartaanApproved,
            announcements,
            agendaActive,
            programs,
            renungan,
            jemaat,
            sectors,
            admins,
        ] = await Promise.all([
            prisma.pewartaan.count(),
            prisma.pewartaan.count({ where: { status: 'approved' } }),
            prisma.announcements.count(),
            prisma.agenda.count({ where: { status: 'aktif' } }),
            prisma.program_kegiatan_gereja.count(),
            prisma.renungan_mingguan.count(),
            prisma.jemaat.count({ where: { deleted_at: null } }),
            prisma.sectors.count(),
            prisma.admins.count(),
        ]);

        return {
            pewartaanTotal,
            pewartaanApproved,
            announcements,
            agendaActive,
            programs,
            renungan,
            jemaat,
            sectors,
            admins,
        };
    }

    async getFinanceSummary() {
        const result = await prisma.laporan_keuangan.aggregate({
            _sum: {
                kas_penerimaan: true,
                kas_pengeluaran: true,
                bank_debit: true,
                bank_kredit: true,
            },
        });

        const sum = result._sum;
        const income = Number(sum.kas_penerimaan || 0) + Number(sum.bank_debit || 0);
        const expense = Number(sum.kas_pengeluaran || 0) + Number(sum.bank_kredit || 0);

        return { income, expense };
    }

    async getRecentFinance(limit = 5) {
        return prisma.laporan_keuangan.findMany({
            select: {
                id: true,
                tanggal: true,
                keterangan: true,
                kas_penerimaan: true,
                kas_pengeluaran: true,
                bank_debit: true,
                bank_kredit: true,
            },
            orderBy: [{ tanggal: 'desc' }, { created_at: 'desc' }],
            take: limit,
        });
    }

    async getUpcomingAgenda(limit = 5) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return prisma.agenda.findMany({
            where: {
                tanggal: { gte: today },
                status: 'aktif',
            },
            select: {
                id: true,
                kegiatan: true,
                tanggal: true,
                jam_mulai: true,
                lokasi: true,
            },
            orderBy: [{ tanggal: 'asc' }, { jam_mulai: 'asc' }],
            take: limit,
        });
    }

    async getRecentActivities(limit = 10) {
        return prisma.aktivitas.findMany({
            orderBy: { created_at: 'desc' },
            take: limit,
        });
    }

    async getArchiveCount() {
        return prisma.arsip_bulanan.count();
    }

    async getEducationStats() {
        return prisma.jemaat.groupBy({
            by: ['sektor_id', 'pendidikan_terakhir'],
            where: { deleted_at: null },
            _count: { _all: true },
        });
    }

    async getKategorialStats() {
        return prisma.jemaat.groupBy({
            by: ['sektor_id', 'kategorial'],
            where: { deleted_at: null },
            _count: { _all: true },
        });
    }

    async getSakramenStats() {
        const sakramen = await prisma.jemaat_sakramen.findMany({
            where: { jemaat: { deleted_at: null } },
            select: {
                bpts: true,
                sidi: true,
                nikah: true,
                meninggal: true,
                jemaat: {
                    select: {
                        sektor_id: true,
                        sector: { select: { nama_sektor: true } },
                    },
                },
            },
        });

        // Transform boolean sakramen fields into grouped counts by sector
        const statsMap = {};
        for (const row of sakramen) {
            const sector = row.jemaat?.sector?.nama_sektor || 'Unknown';
            if (!statsMap[sector]) statsMap[sector] = {};

            for (const type of ['bpts', 'sidi', 'nikah', 'meninggal']) {
                if (row[type]) {
                    statsMap[sector][type] = (statsMap[sector][type] || 0) + 1;
                }
            }
        }

        const result = [];
        for (const [sector, types] of Object.entries(statsMap)) {
            for (const [sacrament, count] of Object.entries(types)) {
                result.push({ sector, sacrament, count });
            }
        }
        return result;
    }

    async getSectorsList() {
        return prisma.sectors.findMany({
            select: { id: true, nama_sektor: true },
            orderBy: { nama_sektor: 'asc' },
        });
    }

    async getSectorsMap() {
        const sectors = await prisma.sectors.findMany({
            select: { id: true, nama_sektor: true },
        });
        return Object.fromEntries(sectors.map((s) => [s.id, s.nama_sektor]));
    }
}

export default new DashboardRepository();
