import KeuanganRepository from '../repositories/keuangan.repository.js';

class KeuanganService {
    async getAll(filters = {}) {
        const { startDate, endDate } = filters;
        const where = {};
        if (startDate || endDate) {
            where.tanggal = {};
            if (startDate) where.tanggal.gte = new Date(startDate);
            if (endDate) where.tanggal.lte = new Date(endDate);
        }

        const data = await KeuanganRepository.findMany({
            where,
            orderBy: [
                { tanggal: 'asc' },
                { created_at: 'asc' }
            ]
        });

        // Calculate running balance logic
        let saldoKas = 0;
        let saldoBank = 0;

        if (startDate) {
            const prev = await KeuanganRepository.aggregate({
                where: { tanggal: { lt: new Date(startDate) } },
                _sum: { kas_penerimaan: true, kas_pengeluaran: true, bank_debit: true, bank_kredit: true }
            });
            saldoKas = Number(prev._sum.kas_penerimaan || 0) - Number(prev._sum.kas_pengeluaran || 0);
            saldoBank = Number(prev._sum.bank_debit || 0) - Number(prev._sum.bank_kredit || 0);
        }

        const formattedData = data.map(row => {
            saldoKas += Number(row.kas_penerimaan || 0) - Number(row.kas_pengeluaran || 0);
            saldoBank += Number(row.bank_debit || 0) - Number(row.bank_kredit || 0);
            return { ...row, saldo_kas: saldoKas, saldo_bank: saldoBank };
        });

        return {
            data: formattedData,
            summary: {
                saldo_akhir_kas: saldoKas,
                saldo_akhir_bank: saldoBank
            }
        };
    }

    async getSummary() {
        const summary = await KeuanganRepository.aggregate({
            _sum: { kas_penerimaan: true, kas_pengeluaran: true, bank_debit: true, bank_kredit: true }
        });

        const kasIn = Number(summary._sum.kas_penerimaan || 0);
        const kasOut = Number(summary._sum.kas_pengeluaran || 0);
        const bankIn = Number(summary._sum.bank_debit || 0);
        const bankOut = Number(summary._sum.bank_kredit || 0);

        return {
            totalIncome: kasIn + bankIn,
            totalExpense: kasOut + bankOut,
            balance: (kasIn + bankIn) - (kasOut + bankOut),
            details: {
                saldo_kas: kasIn - kasOut,
                saldo_bank: bankIn - bankOut
            }
        };
    }

    async create(data) {
        return await KeuanganRepository.create(data);
    }

    async update(id, data) {
        return await KeuanganRepository.update(id, data);
    }

    async delete(id) {
        return await KeuanganRepository.delete(id);
    }
}

export default new KeuanganService();
