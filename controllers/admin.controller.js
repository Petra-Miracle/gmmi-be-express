import AdminService from '../services/admin.service.js';

class AdminController {
    async register(req, res) {
        try {
            const { nama, email, password, role } = req.body;

            if (!nama || !email || !password || !role) {
                return res.status(400).json({
                    success: false,
                    message: 'Semua field (nama, email, password, role) harus diisi.',
                });
            }

            const newAdmin = await AdminService.register(
                { nama, email, password, role },
                req.user,
            );

            return res.status(201).json({
                success: true,
                message: 'Registrasi admin berhasil.',
                data: newAdmin,
            });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Email dan password harus diisi.',
                });
            }

            const data = await AdminService.login({ email, password });

            return res.status(200).json({
                success: true,
                message: 'Login berhasil.',
                data,
            });
        } catch (error) {
            return res.status(401).json({ success: false, message: error.message });
        }
    }

    async getSummary(req, res) {
        try {
            const data = await AdminService.getSummary();
            return res.json(data);
        } catch (error) {
            console.error('Error in getSummary:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil ringkasan data' });
        }
    }

    async getAdmins(req, res) {
        try {
            const data = await AdminService.getAll();
            return res.json(data);
        } catch (error) {
            console.error('Error in getAdmins:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil data admin' });
        }
    }

    async updateAdmin(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { name, email, role } = req.body;

            const data = await AdminService.update(id, { name, email, role });

            return res.json({ success: true, data });
        } catch (error) {
            const status = error.message === 'Admin tidak ditemukan' ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    async toggleAdminStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { isActive } = req.body;

            const data = await AdminService.toggleStatus(id, isActive);

            return res.json({ success: true, data });
        } catch (error) {
            const status = error.message === 'Admin tidak ditemukan' ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    async resetAdminPassword(req, res) {
        try {
            const { id } = req.body;

            const result = await AdminService.resetPassword(id, req.user);

            return res.json({ success: true, message: result.message });
        } catch (error) {
            const status = error.message === 'Admin tidak ditemukan' ? 404 : 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const { id, currentPassword, newPassword } = req.body;

            await AdminService.changePassword(id, currentPassword, newPassword);

            return res.json({ success: true, message: 'Password berhasil diubah' });
        } catch (error) {
            const statusMap = {
                'Admin tidak ditemukan': 404,
                'Password lama salah': 400,
            };
            const status = statusMap[error.message] || 500;
            return res.status(status).json({ success: false, message: error.message });
        }
    }
}

export default new AdminController();
