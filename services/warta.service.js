import WartaRepository from '../repositories/warta.repository.js';
import PewartaanRepository from '../repositories/pewartaan.repository.js';

class WartaService {
    async getAll(pagination = {}) {
        const { page = 1, limit = 10 } = pagination;
        const skip = (page - 1) * limit;

        const [data, totalItems] = await Promise.all([
            PewartaanRepository.findAll({
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
                take: limit,
                skip: skip
            }),
            PewartaanRepository.count({
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
        return await WartaRepository.create(data);
    }

    async update(id, data) {
        return await WartaRepository.update(id, data);
    }

    async delete(id) {
        return await WartaRepository.delete(id);
    }

    async updateStatus(id, status) {
        return await WartaRepository.updateStatus(id, status);
    }
}

export default new WartaService();
