import PekerjaanService from '../services/pekerjaan.service.js';

class PekerjaanController {
    async getAll(req, res) {
        try {
            const data = await PekerjaanService.getAll();
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Error fetching pekerjaan:', error);
            res.status(500).json({ success: false, error: 'Gagal mengambil data pekerjaan' });
        }
    }

    async getById(req, res) {
        try {
            const data = await PekerjaanService.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, error: 'Pekerjaan tidak ditemukan' });
            return res.json({ success: true, data });
        } catch (error) {
            console.error('Error fetching pekerjaan:', error);
            res.status(500).json({ success: false, error: 'Gagal mengambil data pekerjaan' });
        }
    }

    async create(req, res) {
        try {
            const { nama_pekerjaan } = req.body;
            if (!nama_pekerjaan || nama_pekerjaan.trim() === '') {
                return res.status(400).json({ success: false, error: 'Nama pekerjaan harus diisi' });
            }
            const data = await PekerjaanService.create(nama_pekerjaan);
            return res.status(201).json({ success: true, data, message: 'Pekerjaan berhasil ditambahkan' });
        } catch (error) {
            if (error.code === 'P2002') return res.status(400).json({ success: false, error: 'Pekerjaan sudah ada' });
            console.error('Error creating pekerjaan:', error);
            res.status(500).json({ success: false, error: 'Gagal menambahkan pekerjaan' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { nama_pekerjaan } = req.body;
            if (!nama_pekerjaan || nama_pekerjaan.trim() === '') {
                return res.status(400).json({ success: false, error: 'Nama pekerjaan harus diisi' });
            }
            const data = await PekerjaanService.update(id, nama_pekerjaan);
            return res.json({ success: true, data, message: 'Pekerjaan berhasil diperbarui' });
        } catch (error) {
            if (error.code === 'P2002') return res.status(400).json({ success: false, error: 'Pekerjaan sudah ada' });
            console.error('Error updating pekerjaan:', error);
            res.status(500).json({ success: false, error: 'Gagal memperbarui pekerjaan' });
        }
    }

    async delete(req, res) {
        try {
            await PekerjaanService.delete(req.params.id);
            return res.json({ success: true, message: 'Pekerjaan berhasil dihapus' });
        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }
}

export default new PekerjaanController();
