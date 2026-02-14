import prisma from '../config/prisma.js';

class ActivityRepository {
    async create({ adminId, adminNama, aksi, modul, detail }) {
        return prisma.aktivitas.create({
            data: {
                admin_id: adminId,
                admin_nama: adminNama,
                aksi,
                modul,
                detail,
            },
        });
    }
}

export default new ActivityRepository();
