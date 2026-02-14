import prisma from '../config/prisma.js';

class AdminRepository {
    async findByEmail(email) {
        return prisma.admins.findUnique({ where: { email } });
    }

    async findById(id) {
        return prisma.admins.findUnique({ where: { id } });
    }

    async findAll() {
        return prisma.admins.findMany({
            select: { id: true, nama: true, email: true, role: true, is_active: true },
            orderBy: { id: 'asc' },
        });
    }

    async create({ nama, email, passwordHash, role }) {
        return prisma.admins.create({
            data: { nama, email, password_hash: passwordHash, role },
            select: { id: true, nama: true, email: true, role: true },
        });
    }

    async update(id, { nama, email, role }) {
        return prisma.admins.update({
            where: { id },
            data: { nama, email, role, updated_at: new Date() },
            select: { id: true, nama: true, email: true, role: true },
        });
    }

    async updatePassword(id, passwordHash) {
        return prisma.admins.update({
            where: { id },
            data: { password_hash: passwordHash, updated_at: new Date() },
            select: { id: true },
        });
    }

    async updateStatus(id, isActive) {
        return prisma.admins.update({
            where: { id },
            data: { is_active: isActive, updated_at: new Date() },
            select: { id: true, is_active: true },
        });
    }

    async count() {
        return prisma.admins.count();
    }
}

export default new AdminRepository();
