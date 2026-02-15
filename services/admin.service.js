import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { logActivity } from '../utils/activityLogger.js';

const SALT_ROUNDS = 10;
const VALID_ROLES = ['super_admin', 'admin_majelis'];

class AdminService {
    async register({ nama, email, password, role }, requestUser) {
        if (!VALID_ROLES.includes(role)) {
            throw new Error('Role tidak valid. Harus super_admin atau admin_majelis.');
        }

        const existing = await prisma.admins.findUnique({ where: { email } });
        if (existing) {
            throw new Error('Email sudah terdaftar.');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const newAdmin = await prisma.admins.create({
            data: { nama, email, password_hash: passwordHash, role }
        });

        await logActivity(requestUser?.id, requestUser?.nama, 'TAMBAH', 'ADMIN', `Mendaftarkan admin baru: ${nama} (${role})`);

        return newAdmin;
    }

    async getSummary() {
        // Consolidated dashboard logic using pure Prisma
        const today = new Date();
        const [
            pewartaanTotal, pewartaanApproved, announcements, agendaActive,
            programs, renungan, jemaat, sectors, admins, financeData
        ] = await Promise.all([
            prisma.pewartaan.count(),
            prisma.pewartaan.count({ where: { status: 'approved' } }),
            prisma.announcements.count(),
            prisma.agenda.count({ where: { deleted_at: null } }),
            prisma.programs.count({ where: { deleted_at: null } }),
            prisma.renungan.count(),
            prisma.jemaat.count({ where: { deleted_at: null } }),
            prisma.sectors.count(),
            prisma.admins.count(),
            prisma.finance.aggregate({
                _sum: { kas_penerimaan: true, kas_pengeluaran: true, bank_debit: true, bank_kredit: true }
            })
        ]);

        const income = Number(financeData._sum.kas_penerimaan || 0) + Number(financeData._sum.bank_debit || 0);
        const expense = Number(financeData._sum.kas_pengeluaran || 0) + Number(financeData._sum.bank_kredit || 0);

        return {
            totalJemaat: jemaat,
            totalSectors: sectors,
            totalAdmins: admins,
            activePewartaan: pewartaanApproved,
            totalWarta: pewartaanTotal,
            income,
            expense,
            balance: income - expense,
            lastUpdate: today.toLocaleDateString('id-ID')
        };
    }

    async getAll() {
        return await prisma.admins.findMany({
            select: { id: true, nama: true, email: true, role: true, is_active: true }
        });
    }

    async update(id, { name, email, role }) {
        return await prisma.admins.update({
            where: { id },
            data: { nama: name, email, role }
        });
    }

    async toggleStatus(id, isActive) {
        return await prisma.admins.update({
            where: { id },
            data: { is_active: isActive }
        });
    }

    async changePassword(adminId, currentPassword, newPassword) {
        const admin = await prisma.admins.findUnique({ where: { id: adminId } });
        if (!admin) throw new Error('Admin tidak ditemukan');

        const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
        if (!isMatch) throw new Error('Password lama salah');

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await prisma.admins.update({
            where: { id: adminId },
            data: { password_hash: passwordHash }
        });

        await logActivity(admin.id, admin.nama, 'UBAH', 'ADMIN', `Admin ${admin.nama} mengubah password sendiri`);
    }
}

export default new AdminService();
