import RenunganService from '../services/renungan.service.js';

class RenunganController {
    async getAll(req, res) {
        try {
            const data = await RenunganService.getAll();
            return res.json(data);
        } catch (err) {
            console.error('Error in RenunganController.getAll:', err.message);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    }

    async getById(req, res) {
        try {
            const data = await RenunganService.getById(req.params.id);
            if (!data) return res.status(404).json({ error: 'Renungan not found' });
            return res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async create(req, res) {
        try {
            const { judul, isi, tanggal } = req.body;
            const gambar = req.file ? `/uploads/${req.file.filename}` : null;
            const data = await RenunganService.create({ judul, isi, tanggal, gambar });
            return res.status(201).json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { judul, isi, tanggal } = req.body;
            const gambar = req.file ? `/uploads/${req.file.filename}` : undefined;
            const data = await RenunganService.update(id, { judul, isi, tanggal, gambar });
            return res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            await RenunganService.delete(req.params.id);
            return res.json({ message: 'Renungan deleted successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default new RenunganController();
