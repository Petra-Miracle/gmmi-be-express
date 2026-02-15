import ArsipService from '../services/arsip.service.js';

class ArsipController {
    async getArsip(req, res) {
        try {
            const { bulan, tahun } = req.query;
            if (!bulan || !tahun) {
                return res.status(400).json({ success: false, message: 'Bulan dan tahun harus diisi' });
            }

            const data = await ArsipService.getArsip(parseInt(bulan), parseInt(tahun));
            return res.status(200).json(data);
        } catch (error) {
            console.error('Error in ArsipController.getArsip:', error);
            return res.status(500).json({ success: false, message: 'Gagal mengambil data arsip' });
        }
    }
}

export default new ArsipController();
