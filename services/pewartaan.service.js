import PewartaanRepository from '../repositories/pewartaan.repository.js';

class PewartaanService {
    async getAll() {
        return await PewartaanRepository.findAll();
    }

    async getById(id) {
        return await PewartaanRepository.findById(id);
    }

    async create(data) {
        return await PewartaanRepository.create(data);
    }

    async update(id, data) {
        return await PewartaanRepository.update(id, data);
    }

    async delete(id) {
        return await PewartaanRepository.delete(id);
    }

    async updateStatus(id, status) {
        return await PewartaanRepository.updateStatus(id, status);
    }
}

export default new PewartaanService();
