import prisma from '../config/prisma.js';

class ArsipRepository {
    async findAnnouncements(where, select) {
        return prisma.announcements.findMany({ where, select });
    }

    async findWarta(where, select) {
        return prisma.warta.findMany({ where, select });
    }

    async findAgenda(where, select) {
        return prisma.agenda.findMany({ where, select });
    }
}

export default new ArsipRepository();
