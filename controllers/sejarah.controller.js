import SejarahService from '../services/sejarah.service.js';

class SejarahController {
    async getAll(req, res) {
        try {
            const data = await SejarahService.getAll();
            return res.json(data);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async create(req, res) {
        try {
            const { judul, tanggal_peristiwa, deskripsi } = req.body;
            const gambar_url = req.file ? `/uploads/thumbnails/${req.file.filename}` : req.body.gambar_url;

            const data = await SejarahService.create({ judul, tanggal_peristiwa, deskripsi, gambar_url });
            return res.json(data);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { judul, tanggal_peristiwa, deskripsi } = req.body;
            const gambar_url = req.file ? `/uploads/thumbnails/${req.file.filename}` : undefined;

            const data = await SejarahService.update(id, { judul, tanggal_peristiwa, deskripsi, gambar_url });
            return res.json(data);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async delete(req, res) {
        try {
            await SejarahService.delete(req.params.id);
            return res.json({ message: "Sejarah deleted successfully" });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
}

export default new SejarahController();
