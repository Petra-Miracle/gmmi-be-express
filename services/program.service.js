import ProgramRepository from '../repositories/program.repository.js';

class ProgramService {
    async getStats() {
        const [total, byBidang] = await Promise.all([
            ProgramRepository.count(),
            ProgramRepository.groupByBidang()
        ]);

        return {
            total,
            byBidang: byBidang.map(item => ({
                bidang: item.bidang,
                count: String(item._count._all)
            }))
        };
    }

    async getAll(filters = {}) {
        const { bidang, startDate, endDate } = filters;
        const where = {};

        if (bidang) {
            where.bidang = bidang;
        }

        if (startDate && endDate) {
            where.created_at = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }

        return await ProgramRepository.findMany({ where });
    }

    async create(data) {
        return await ProgramRepository.create({
            ...data,
            volume: data.volume ? parseInt(data.volume) : 1,
            rencana_biaya: data.rencana_biaya ? parseFloat(data.rencana_biaya) : 0
        });
    }

    async update(id, data) {
        return await ProgramRepository.update(id, {
            ...data,
            volume: data.volume ? parseInt(data.volume) : undefined,
            rencana_biaya: data.rencana_biaya ? parseFloat(data.rencana_biaya) : undefined
        });
    }

    async delete(id) {
        return await ProgramRepository.delete(id);
    }
}

export default new ProgramService();
