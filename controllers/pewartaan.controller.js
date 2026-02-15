import PewartaanService from '../services/pewartaan.service.js';
import notificationService from '../services/notification.service.js';
import { generatePewartaanExcel, generatePewartaanWord } from '../utils/fileExporter.js';

class PewartaanController {
    async create(req, res) {
        try {
            const result = await PewartaanService.create(req.body);

            if (req.body.status === 'approved') {
                await this.triggerNotifications(result.id);
            }

            res.status(201).json({ success: true, message: 'Pewartaan berhasil dibuat', id: result.id });
        } catch (error) {
            console.error('Error in PewartaanController.create:', error);
            res.status(500).json({ success: false, message: 'Gagal membuat pewartaan', error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            await PewartaanService.update(id, req.body);

            if (req.body.status === 'approved') {
                await this.triggerNotifications(id);
            }

            res.json({ success: true, message: 'Pewartaan berhasil diperbarui' });
        } catch (error) {
            console.error('Error in PewartaanController.update:', error);
            res.status(500).json({ success: false, message: 'Gagal memperbarui pewartaan', error: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const data = await PewartaanService.getAll();
            res.json({ success: true, data });
        } catch (error) {
            console.error('Error in PewartaanController.getAll:', error);
            res.status(500).json({ success: false, message: 'Gagal mengambil data' });
        }
    }

    async getById(req, res) {
        try {
            const data = await PewartaanService.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Pewartaan tidak ditemukan' });
            res.json({ success: true, data });
        } catch (error) {
            console.error('Error in PewartaanController.getById:', error);
            res.status(500).json({ success: false, message: 'Gagal mengambil detail pewartaan' });
        }
    }

    async delete(req, res) {
        try {
            await PewartaanService.delete(req.params.id);
            res.json({ success: true, message: 'Pewartaan berhasil dihapus' });
        } catch (error) {
            console.error('Error in PewartaanController.delete:', error);
            res.status(500).json({ success: false, message: 'Gagal menghapus pewartaan' });
        }
    }

    async exportExcel(req, res) {
        try {
            const data = await PewartaanService.getById(req.params.id);
            if (!data) return res.status(404).json({ success: false, message: 'Pewartaan tidak ditemukan' });

            const sections = [
                { name: 'Tata Ibadah', dataKey: 'pewartaan_tata_ibadah', cols: ['urutan', 'nama_bagian', 'keterangan', 'judul_pujian', 'isi_konten'] },
                { name: 'Pokok Doa', dataKey: 'pewartaan_pokok_doa', cols: ['kategori', 'keterangan'] },
                { name: 'Jemaat Ultah', dataKey: 'pewartaan_jemaat_ultah', cols: ['tanggal', 'nama_jemaat', 'keterangan'] },
                { name: 'Jemaat Sakit', dataKey: 'pewartaan_jemaat_sakit', cols: ['nama_jemaat', 'keterangan'] },
                { name: 'Pemulihan', dataKey: 'pewartaan_pemulihan', cols: ['nama_jemaat', 'keterangan'] },
                { name: 'Lansia', dataKey: 'pewartaan_lansia', cols: ['nama_jemaat', 'keterangan'] },
                { name: 'Info Ibadah', dataKey: 'pewartaan_info_ibadah', cols: ['tanggal', 'jam', 'jenis_ibadah', 'pemimpin', 'sektor'] },
                { name: 'Pelayanan Sektor', dataKey: 'pewartaan_pelayanan_sektor', cols: ['nomor_sektor', 'tempat', 'pemimpin', 'liturgos'] },
                { name: 'Pelayanan Kategorial', dataKey: 'pewartaan_pelayanan_kategorial', cols: ['tanggal_waktu', 'kategori_pelayanan', 'tempat', 'pemimpin', 'liturgos_petugas'] }
            ];

            const workbook = await generatePewartaanExcel(data, sections);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', `attachment; filename=Warta_${data.judul.replace(/\s+/g, '_')}.xlsx`);
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.error('Error in exportExcel:', error);
            res.status(500).send('Error generating Excel');
        }
    }

    async exportWord(req, res) {
        try {
            const data = await PewartaanService.getById(req.params.id);
            if (!data) return res.status(404).send('Pewartaan not found');

            const buffer = await generatePewartaanWord(data);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
            res.setHeader('Content-Disposition', `attachment; filename=Warta_${data.id}.docx`);
            res.send(buffer);
        } catch (error) {
            console.error('Error in exportWord:', error);
            res.status(500).send('Error generating Word document');
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const data = await PewartaanService.updateStatus(id, status);

            if (status === 'approved') {
                await this.triggerNotifications(id);
            }

            res.json({ success: true, message: `Status pewartaan berhasil diubah menjadi ${status}`, data });
        } catch (error) {
            console.error('Error in PewartaanController.updateStatus:', error);
            res.status(500).json({ success: false, message: 'Gagal memperbarui status pewartaan' });
        }
    }

    async triggerNotifications(pewartaanId) {
        try {
            const data = await PewartaanService.getById(pewartaanId);
            if (data && data.pewartaan_pelayanan_sektor.length > 0) {
                for (const sektor of data.pewartaan_pelayanan_sektor) {
                    if (sektor.nomor_hp) {
                        await notificationService.sendWartaSektorNotification(sektor.nomor_hp, {
                            nomor_sektor: sektor.nomor_sektor,
                            tempat: sektor.tempat,
                            pemimpin: sektor.pemimpin,
                            liturgos: sektor.liturgos,
                            judul_warta: data.judul,
                            tanggal: data.tanggal_ibadah
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error triggering notifications:', error);
        }
    }
}

export default new PewartaanController();
