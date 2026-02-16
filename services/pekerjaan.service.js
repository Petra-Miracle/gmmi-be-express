import PekerjaanRepository from '../repositories/pekerjaan.repository.js';
import JemaatRepository from '../repositories/jemaat.repository.js';

class PekerjaanService {
    async getAll() {
        return await PekerjaanRepository.findAll();
    }

    async getById(id) {
        return await PekerjaanRepository.findById(id);
    }

    async create(nama) {
        return await PekerjaanRepository.create(nama);
    }

    async update(id, nama) {
        return await PekerjaanRepository.update(id, nama);
    }

    async delete(id) {
        // Check usage
        const usage = await JemaatRepository.count({
            where: { pekerjaan_id: parseInt(id) }
        });

        if (usage > 0) {
            throw new Error('Pekerjaan tidak dapat dihapus karena sedang digunakan oleh jemaat');
        }

        return await PekerjaanRepository.delete(id);
    }
}

export default new PekerjaanService();
