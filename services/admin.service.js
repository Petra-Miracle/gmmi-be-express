import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import AdminRepository from '../repositories/admin.repository.js';
import DashboardRepository from '../repositories/dashboard.repository.js';
import ActivityRepository from '../repositories/activity.repository.js';

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

        await ActivityRepository.create({
            adminId: requestUser?.id,
            adminNama: requestUser?.nama,
            aksi: 'TAMBAH',
            modul: 'ADMIN',
            detail: `Mendaftarkan admin baru: ${nama} (${role})`,
        });

        return newAdmin;
    }

    async login({ email, password }) {
        const admin = await AdminRepository.findByEmail(email);
        if (!admin) {
            throw new Error('Email atau password salah.');
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            throw new Error('Email atau password salah.');
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role, nama: admin.nama },
            process.env.JWT_SECRET || 'gmmi_secret_key',
            { expiresIn: '24h' },
        );

        await ActivityRepository.create({
            adminId: admin.id,
            adminNama: admin.nama,
            aksi: 'LOGIN',
            modul: 'AUTH',
            detail: `Admin ${admin.nama} melakukan login`,
        });

        return {
            token,
            user: { id: admin.id, nama: admin.nama, email: admin.email, role: admin.role },
        };
    }

    async getAll() {
        const admins = await AdminRepository.findAll();
        return admins.map((admin) => ({
            id: admin.id,
            name: admin.nama,
            email: admin.email,
            role: admin.role,
            isActive: admin.is_active,
        }));
    }

    async update(id, { name, email, role }) {
        const admin = await AdminRepository.findById(id);
        if (!admin) {
            throw new Error('Admin tidak ditemukan');
        }

        return AdminRepository.update(id, { nama: name, email, role });
    }

    async toggleStatus(id, isActive) {
        const admin = await AdminRepository.findById(id);
        if (!admin) {
            throw new Error('Admin tidak ditemukan');
        }

        return AdminRepository.updateStatus(id, isActive);
    }

    async resetPassword(adminId, requestUser) {
        const admin = await AdminRepository.findById(adminId);
        if (!admin) {
            throw new Error('Admin tidak ditemukan');
        }

        const defaultPassword = 'GMMI1234';
        const passwordHash = await bcrypt.hash(defaultPassword, SALT_ROUNDS);
        await AdminRepository.updatePassword(adminId, passwordHash);

        await ActivityRepository.create({
            adminId: requestUser?.id,
            adminNama: requestUser?.nama,
            aksi: 'UBAH',
            modul: 'ADMIN',
            detail: `Mereset password admin ID: ${adminId}`,
        });

        return { message: 'Password berhasil direset ke GMMI1234' };
    }

    async changePassword(adminId, currentPassword, newPassword) {
        const admin = await AdminRepository.findById(adminId);
        if (!admin) {
            throw new Error('Admin tidak ditemukan');
        }

        const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
        if (!isMatch) {
            throw new Error('Password lama salah');
        }

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await AdminRepository.updatePassword(adminId, passwordHash);

        await ActivityRepository.create({
            adminId: admin.id,
            adminNama: admin.nama,
            aksi: 'UBAH',
            modul: 'ADMIN',
            detail: `Admin ${admin.nama} mengubah password sendiri`,
        });
    }

    async getSummary() {
        const [counts, finance, recentFinance, upcomingAgenda, activities, archives] =
            await Promise.all([
                DashboardRepository.getCounts(),
                DashboardRepository.getFinanceSummary(),
                DashboardRepository.getRecentFinance(5),
                DashboardRepository.getUpcomingAgenda(5),
                DashboardRepository.getRecentActivities(10),
                DashboardRepository.getArchiveCount(),
            ]);

        const formattedActivities = activities.map((act) => {
            const date = new Date(act.created_at);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffHrs / 24);

            let timeAgo = '';
            if (diffHrs < 1) timeAgo = 'Baru saja';
            else if (diffHrs < 24) timeAgo = `${diffHrs} jam yang lalu`;
            else if (diffDays === 1) timeAgo = 'Kemarin';
            else timeAgo = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

            return {
                id: act.id,
                type: act.modul?.toLowerCase(),
                title: `${act.admin_nama || 'System'} ${act.aksi?.toLowerCase()} ${act.modul?.toLowerCase()}: ${act.detail}`,
                date: act.created_at,
                time: timeAgo,
            };
        });

        const formattedFinance = recentFinance.map((f) => ({
            id: f.id,
            tanggal: f.tanggal,
            keterangan: f.keterangan,
            masuk: Number(f.kas_penerimaan || 0) + Number(f.bank_debit || 0),
            keluar: Number(f.kas_pengeluaran || 0) + Number(f.bank_kredit || 0),
        }));

        const balance = finance.income - finance.expense;
        const todayFormatted = new Date().toLocaleDateString('id-ID');

        // Fetch enhanced statistics in parallel
        const [educationStats, kategorialStats, sakramenStats, sectorsList, sectorsMap] =
            await Promise.all([
                DashboardRepository.getEducationStats().catch(() => []),
                DashboardRepository.getKategorialStats().catch(() => []),
                DashboardRepository.getSakramenStats().catch(() => []),
                DashboardRepository.getSectorsList().catch(() => []),
                DashboardRepository.getSectorsMap().catch(() => ({})),
            ]);

        // Transform groupBy results to match original response format
        const eduFormatted = educationStats.map((row) => ({
            sector: sectorsMap[row.sektor_id] || null,
            education: row.pendidikan_terakhir,
            count: row._count._all,
        }));

        const katFormatted = kategorialStats.map((row) => ({
            sector: sectorsMap[row.sektor_id] || null,
            category: row.kategorial,
            count: row._count._all,
        }));

        return {
            totalPewartaan: counts.pewartaanTotal,
            activePewartaan: counts.pewartaanApproved,
            totalAnnouncements: counts.announcements,
            totalAgenda: counts.agendaActive,
            totalProgram: counts.programs,
            totalRenungan: counts.renungan,

            totalWarta: counts.pewartaanTotal,
            upcomingServices: counts.agendaActive,
            totalPrograms: counts.programs,
            activePrograms: counts.programs,
            lastUpdateAnnouncements: todayFormatted,
            lastUpdateWarta: todayFormatted,
            lastUpdateJadwal: todayFormatted,

            totalJemaat: counts.jemaat,
            totalSectors: counts.sectors,
            totalAdmins: counts.admins,

            income: finance.income,
            expense: finance.expense,
            startBalance: balance,
            archives,
            recentActivities: formattedActivities,
            recentFinance: formattedFinance,
            upcomingAgenda,

            educationStats: eduFormatted,
            kategorialStats: katFormatted,
            sakramenStats,
            sectorsList,
        };
    }
}

export default new AdminService();
