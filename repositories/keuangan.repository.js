import prisma from '../config/prisma.js';

class KeuanganRepository {
    async findMany(args) {
        return prisma.laporan_keuangan.findMany(args);
    }

    async aggregate(args) {
        return prisma.laporan_keuangan.aggregate(args);
    }

    async create(data) {
        return prisma.laporan_keuangan.create({
            data: {
                ...data,
                tanggal: new Date(data.tanggal),
                kas_penerimaan: Number(data.kas_penerimaan || 0),
                kas_pengeluaran: Number(data.kas_pengeluaran || 0),
                bank_debit: Number(data.bank_debit || 0),
                bank_kredit: Number(data.bank_kredit || 0)
            }
        });
    }

    async update(id, data) {
        return prisma.laporan_keuangan.update({
            where: { id: id },
            data: {
                ...data,
                tanggal: data.tanggal ? new Date(data.tanggal) : undefined,
                kas_penerimaan: data.kas_penerimaan !== undefined ? Number(data.kas_penerimaan) : undefined,
                kas_pengeluaran: data.kas_pengeluaran !== undefined ? Number(data.kas_pengeluaran) : undefined,
                bank_debit: data.bank_debit !== undefined ? Number(data.bank_debit) : undefined,
                bank_kredit: data.bank_kredit !== undefined ? Number(data.bank_kredit) : undefined
            }
        });
    }

    async delete(id) {
        return prisma.laporan_keuangan.delete({ where: { id: id } });
    }
}

export default new KeuanganRepository();
