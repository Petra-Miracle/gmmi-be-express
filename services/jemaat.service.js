import JemaatRepository from '../repositories/jemaat.repository.js';

class JemaatService {
    async getAllJemaat(filters = {}) {
        const { sektor_id, pendidikan, kategorial, search } = filters;

        return await JemaatRepository.findAll({
            where: {
                sektor_id: sektor_id ? parseInt(sektor_id) : undefined,
                pendidikan_terakhir: pendidikan || undefined,
                kategorial: kategorial ? { contains: kategorial, mode: 'insensitive' } : undefined,
                nama: search ? { contains: search, mode: 'insensitive' } : undefined
            },
            include: {
                sectors: true,
                jemaat_sakramen: true
            }
        });
    }

    async createJemaat(data, userId, userName) {
        return await JemaatRepository.create(data);
    }

    async updateJemaat(id, data, userId, userName) {
        return await JemaatRepository.update(id, data);
    }

    async softDeleteJemaat(id) {
        return await JemaatRepository.softDelete(id);
    }

    // Sector Logic
    async getAllSectors() {
        return await JemaatRepository.findAllSectors();
    }

    async createSector(data) {
        return await JemaatRepository.createSector(data);
    }

    async updateSector(id, data) {
        return await JemaatRepository.updateSector(id, data);
    }

    async deleteSector(id) {
        const membersCount = await JemaatRepository.count({
            where: { sektor_id: parseInt(id) }
        });

        if (membersCount > 0) {
            throw new Error('Sektor tidak dapat dihapus karena masih memiliki jemaat aktif');
        }

        return await JemaatRepository.deleteSector(id);
    }
}

export default new JemaatService();
