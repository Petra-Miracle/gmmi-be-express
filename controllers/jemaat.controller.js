import JemaatService from '../services/jemaat.service.js';
import { logActivity } from '../utils/activityLogger.js';

class JemaatController {
    static VALID_PEKERJAAN = [
        'Buruh', 'Petani', 'Nelayan', 'PNS', 'TNI / POLRI',
        'Guru / Dosen', 'Tenaga Kesehatan', 'Rohaniawan', 'Lainnya'
    ];

    async getAll(req, res) {
        try {
            const data = await JemaatService.getAllJemaat(req.query);
            res.json({ success: true, data });
        } catch (error) {
            console.error('Error in JemaatController.getAll:', error);
            res.status(500).json({ success: false, message: 'Gagal mengambil data jemaat' });
        }
    }

    async create(req, res) {
        try {
            const { pekerjaan, nama } = req.body;

            if (!pekerjaan || !JemaatController.VALID_PEKERJAAN.includes(pekerjaan)) {
                return res.status(400).json({ success: false, error: 'Pekerjaan tidak valid' });
            }

            const jemaat = await JemaatService.createJemaat(req.body);

            await logActivity(req.user?.id, req.user?.nama, 'TAMBAH', 'JEMAAT', `Menambahkan jemaat baru: ${nama}`);

            res.status(201).json({ success: true, id: jemaat.id, message: 'Data jemaat berhasil ditambahkan' });
        } catch (error) {
            console.error('Error in JemaatController.create:', error);
            res.status(500).json({ success: false, message: 'Gagal menambah data jemaat', error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { pekerjaan, nama } = req.body;

            if (!pekerjaan || !JemaatController.VALID_PEKERJAAN.includes(pekerjaan)) {
                return res.status(400).json({ success: false, error: 'Pekerjaan tidak valid' });
            }

            await JemaatService.updateJemaat(id, req.body);

            await logActivity(req.user?.id, req.user?.nama, 'UBAH', 'JEMAAT', `Memperbarui data jemaat: ${nama}`);

            res.json({ success: true, message: 'Data jemaat berhasil diperbarui' });
        } catch (error) {
            console.error('Error in JemaatController.update:', error);
            res.status(500).json({ success: false, message: 'Gagal memperbarui data jemaat', error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await JemaatService.softDeleteJemaat(id);
            await logActivity(req.user?.id, req.user?.nama, 'HAPUS', 'JEMAAT', `Menghapus jemaat ID: ${id}`);
            res.json({ success: true, message: 'Data jemaat berhasil dihapus (soft delete)' });
        } catch (error) {
            console.error('Error in JemaatController.delete:', error);
            res.status(500).json({ success: false, message: 'Gagal menghapus data jemaat' });
        }
    }

    async getSectors(req, res) {
        try {
            const data = await JemaatService.getAllSectors();
            res.json({ success: true, data });
        } catch (error) {
            console.error('Error in JemaatController.getSectors:', error);
            res.status(500).json({ success: false, message: 'Gagal mengambil data sektor' });
        }
    }

    async createSector(req, res) {
        try {
            const { nama_sektor } = req.body;
            if (!nama_sektor) {
                return res.status(400).json({ success: false, message: 'Nama sektor wajib diisi' });
            }
            const data = await JemaatService.createSector(req.body);
            await logActivity(req.user?.id, req.user?.nama, 'TAMBAH', 'SEKTOR', `Menambahkan sektor baru: ${nama_sektor}`);
            res.status(201).json({ success: true, data, message: 'Sektor berhasil ditambahkan' });
        } catch (error) {
            console.error('Error in JemaatController.createSector:', error);
            res.status(500).json({ success: false, message: 'Gagal menambahkan sektor' });
        }
    }

    async updateSector(req, res) {
        try {
            const { id } = req.params;
            const data = await JemaatService.updateSector(id, req.body);
            res.json({ success: true, data, message: 'Sektor berhasil diperbarui' });
        } catch (error) {
            console.error('Error in JemaatController.updateSector:', error);
            res.status(500).json({ success: false, message: 'Gagal memperbarui sektor' });
        }
    }

    async deleteSector(req, res) {
        try {
            const { id } = req.params;
            await JemaatService.deleteSector(id);
            res.json({ success: true, message: 'Sektor berhasil dihapus' });
        } catch (error) {
            console.error('Error in JemaatController.deleteSector:', error);
            res.status(500).json({ success: false, message: error.message || 'Gagal menghapus sektor' });
        }
    }
}

export default new JemaatController();
