import PengumumanService from '../services/pengumuman.service.js';
import { logActivity } from '../utils/activityLogger.js';

class PengumumanController {
    async getAll(req, res) {
        try {
            const data = await PengumumanService.getAll();
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error in PengumumanController.getAll:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil data pengumuman' });
        }
    }

    async create(req, res) {
        try {
            const { isi, status } = req.body;
            if (!isi) {
                return res.status(400).json({ success: false, message: 'Isi pengumuman harus diisi' });
            }

            const data = await PengumumanService.create({ isi, status }, req.user?.id);
            await logActivity(req.user?.id, req.user?.nama, 'TAMBAH', 'PENGUMUMAN', `Membuat pengumuman baru`);

            return res.status(201).json({
                success: true,
                message: 'Pengumuman berhasil dibuat',
                data
            });
        } catch (error) {
            console.error('Error in PengumumanController.create:', error);
            return res.status(500).json({ success: false, message: 'Gagal membuat pengumuman' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const data = await PengumumanService.update(id, req.body);
            await logActivity(req.user?.id, req.user?.nama, 'UBAH', 'PENGUMUMAN', `Memperbarui pengumuman ID: ${id}`);

            return res.status(200).json({
                success: true,
                message: 'Pengumuman berhasil diperbarui',
                data
            });
        } catch (error) {
            console.error('Error in PengumumanController.update:', error);
            return res.status(500).json({ success: false, message: 'Gagal memperbarui pengumuman' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await PengumumanService.delete(id);
            await logActivity(req.user?.id, req.user?.nama, 'HAPUS', 'PENGUMUMAN', `Menghapus pengumuman ID: ${id}`);

            return res.status(200).json({
                success: true,
                message: 'Pengumuman berhasil dihapus'
            });
        } catch (error) {
            console.error('Error in PengumumanController.delete:', error);
            return res.status(500).json({ success: false, message: 'Gagal menghapus pengumuman' });
        }
    }
}

export default new PengumumanController();
