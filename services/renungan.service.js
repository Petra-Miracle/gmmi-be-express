import RenunganRepository from '../repositories/renungan.repository.js';

class RenunganService {
    async getAll() {
        return await RenunganRepository.findAll();
    }

    async getById(id) {
        return await RenunganRepository.findById(id);
    }

    async create(data) {
        return await RenunganRepository.create(data);
    }

    async update(id, data) {
        return await RenunganRepository.update(id, data);
    }

    async delete(id) {
        return await RenunganRepository.delete(id);
    }
}

export default new RenunganService();
