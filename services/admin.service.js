import bcrypt from 'bcryptjs';
import AdminRepository from '../repositories/admin.repository.js';
import DashboardRepository from '../repositories/dashboard.repository.js';
import { logActivity } from '../utils/activityLogger.js';

const SALT_ROUNDS = 10;
const VALID_ROLES = ['super_admin', 'admin_majelis'];

class AdminService {
    async register({ nama, email, password, role }, requestUser) {
        if (!VALID_ROLES.includes(role)) {
            throw new Error('Role tidak valid. Harus super_admin atau admin_majelis.');
        }

        const existing = await AdminRepository.findByEmail(email);
        if (existing) {
            throw new Error('Email sudah terdaftar.');
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const newAdmin = await AdminRepository.create({ nama, email, passwordHash, role });

        await logActivity(requestUser?.id, requestUser?.nama, 'TAMBAH', 'ADMIN', `Mendaftarkan admin baru: ${nama} (${role})`);

        return newAdmin;
    }

    async getSummary() {
        const today = new Date();
        const counts = await DashboardRepository.getCounts();
        const finance = await DashboardRepository.getFinanceSummary();

        return {
            totalJemaat: counts.jemaat,
            totalSectors: counts.sectors,
            totalAdmins: counts.admins,
            activePewartaan: counts.pewartaanApproved,
            totalWarta: counts.pewartaanTotal,
            income: finance.income,
            expense: finance.expense,
            balance: finance.income - finance.expense,
            lastUpdate: today.toLocaleDateString('id-ID')
        };
    }

    async getAll() {
        return await AdminRepository.findAll();
    }

    async update(id, { name, email, role }) {
        return await AdminRepository.update(id, { nama: name, email, role });
    }

    async toggleStatus(id, isActive) {
        return await AdminRepository.updateStatus(id, isActive);
    }

    async changePassword(adminId, currentPassword, newPassword) {
        const admin = await AdminRepository.findById(adminId);
        if (!admin) throw new Error('Admin tidak ditemukan');

        const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
        if (!isMatch) throw new Error('Password lama salah');

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await AdminRepository.updatePassword(adminId, passwordHash);

        await logActivity(admin.id, admin.nama, 'UBAH', 'ADMIN', `Admin ${admin.nama} mengubah password sendiri`);
    }

    // Helper for Auth
    async loginAdmin({ email, password }) {
        const admin = await AdminRepository.findByEmail(email);
        if (!admin || !admin.is_active) return null;

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        return isMatch ? admin : null;
    }
}

export default new AdminService();
