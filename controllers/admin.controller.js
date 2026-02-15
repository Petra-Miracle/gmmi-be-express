import AdminService from '../services/admin.service.js';

class AdminController {
    async register(req, res) {
        try {
            const data = await AdminService.register(req.body, req.user);
            return res.status(201).json({ success: true, message: 'Registrasi admin berhasil.', data });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    async getSummary(req, res) {
        try {
            const data = await AdminService.getSummary();
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Error in getSummary:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil ringkasan data' });
        }
    }

    async getAdmins(req, res) {
        try {
            const data = await AdminService.getAll();
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Error in getAdmins:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil data admin' });
        }
    }

    async updateAdmin(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = await AdminService.update(id, req.body);
            return res.json({ success: true, data });
        } catch (error) {
            return res.status(error.message.includes('not found') ? 404 : 500).json({ success: false, message: error.message });
        }
    }

    async toggleAdminStatus(req, res) {
        try {
            const id = parseInt(req.params.id);
            const data = await AdminService.toggleStatus(id, req.body.isActive);
            return res.json({ success: true, data });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            await AdminService.changePassword(req.user.id, currentPassword, newPassword);
            return res.json({ success: true, message: 'Password berhasil diubah' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }
}

export default new AdminController();
