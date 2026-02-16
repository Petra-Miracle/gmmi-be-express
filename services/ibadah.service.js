import IbadahRepository from '../repositories/ibadah.repository.js';

class IbadahService {
    async getAll() {
        return await IbadahRepository.findAll();
    }

    async create(data) {
        return await IbadahRepository.create(data);
    }

    async update(id, data) {
        return await IbadahRepository.update(id, data);
    }

    async delete(id) {
        return await IbadahRepository.delete(id);
    }
}

export default new IbadahService();
