import PengumumanRepository from '../repositories/pengumuman.repository.js';

class PengumumanService {
    async getAll() {
        return await PengumumanRepository.findAll();
    }

    async create(data, userId) {
        return await PengumumanRepository.create(data, userId);
    }

    async update(id, data) {
        return await PengumumanRepository.update(id, data);
    }

    async delete(id) {
        return await PengumumanRepository.delete(id);
    }
}

export default new PengumumanService();
