import KeuanganService from '../services/keuangan.service.js';
import { logActivity } from '../utils/activityLogger.js';

class KeuanganController {
    async getAll(req, res) {
        try {
            const result = await KeuanganService.getAll(req.query);
            return res.json({ success: true, ...result });
        } catch (error) {
            console.error('Error fetching finance:', error);
            res.status(500).json({ message: 'Gagal mengambil data keuangan' });
        }
    }

    async getSummary(req, res) {
        try {
            const data = await KeuanganService.getSummary();
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Error getting summary:', error);
            res.status(500).json({ message: 'Gagal mengambil ringkasan' });
        }
    }

    async create(req, res) {
        try {
            const data = await KeuanganService.create(req.body);
            await logActivity(req.user?.id, req.user?.nama, 'TAMBAH', 'KEUANGAN', `Menambah transaksi: ${req.body.keterangan}`);
            res.status(201).json(data);
        } catch (error) {
            console.error('Error creating transaction:', error);
            res.status(500).json({ message: 'Gagal menyimpan transaksi' });
        }
    }

    async update(req, res) {
        try {
            const id = req.params.id;
            const data = await KeuanganService.update(id, req.body);
            await logActivity(req.user?.id, req.user?.nama, 'UBAH', 'KEUANGAN', `Memperbarui transaksi ID: ${id}`);
            res.json(data);
        } catch (error) {
            console.error('Error updating transaction:', error);
            res.status(500).json({ message: 'Gagal memperbarui transaksi' });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            await KeuanganService.delete(id);
            await logActivity(req.user?.id, req.user?.nama, 'HAPUS', 'KEUANGAN', `Menghapus transaksi ID: ${id}`);
            res.json({ message: 'Transaksi berhasil dihapus' });
        } catch (error) {
            console.error('Error deleting transaction:', error);
            res.status(500).json({ message: 'Gagal menghapus transaksi' });
        }
    }
}

export default new KeuanganController();
