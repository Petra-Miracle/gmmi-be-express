import WartaService from '../services/warta.service.js';

class WartaController {
    async getAll(req, res) {
        try {
            const result = await WartaService.getAll(req.query);
            return res.status(200).json(result);
        } catch (error) {
            console.error('Error in WartaController.getAll:', error.message);
            return res.status(500).json({ success: false, message: 'Gagal mengambil data warta', error: error.message });
        }
    }

    async create(req, res) {
        try {
            const { judul, tanggal, isi, status, files } = req.body;
            if (!judul || !tanggal) {
                return res.status(400).json({ success: false, message: 'Judul dan tanggal harus diisi' });
            }

            const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : null;

            const data = await WartaService.create({
                judul, tanggal, isi, status, thumbnail, files
            });

            return res.status(201).json({
                success: true,
                message: 'Warta berhasil dibuat',
                data
            });
        } catch (error) {
            console.error('Error in WartaController.create:', error);
            return res.status(500).json({ success: false, message: 'Gagal membuat warta' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { judul, tanggal, isi, status, files } = req.body;

            const thumbnail = req.file ? `/uploads/thumbnails/${req.file.filename}` : undefined;

            const data = await WartaService.update(id, {
                judul, tanggal, isi, status, thumbnail, files
            });

            return res.status(200).json({
                success: true,
                message: 'Warta berhasil diperbarui',
                data
            });
        } catch (error) {
            console.error('Error in WartaController.update:', error);
            return res.status(500).json({ success: false, message: 'Gagal memperbarui warta' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await WartaService.delete(id);
            return res.status(200).json({
                success: true,
                message: 'Warta berhasil dihapus'
            });
        } catch (error) {
            console.error('Error in WartaController.delete:', error);
            return res.status(500).json({ success: false, message: 'Gagal menghapus warta' });
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!['approved', 'rejected', 'pending'].includes(status)) {
                return res.status(400).json({ success: false, message: 'Status tidak valid' });
            }

            const data = await WartaService.updateStatus(id, status);

            return res.status(200).json({
                success: true,
                message: `Status warta berhasil diubah menjadi ${status}`,
                data
            });
        } catch (error) {
            console.error('Error in WartaController.updateStatus:', error);
            return res.status(500).json({ success: false, message: 'Gagal memperbarui status warta' });
        }
    }
}

export default new WartaController();
