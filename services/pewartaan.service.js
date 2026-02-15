import prisma from '../config/prisma.js';

class PewartaanService {
    async getAll() {
        return await prisma.pewartaan.findMany({
            orderBy: [
                { tanggal_ibadah: 'desc' },
                { created_at: 'desc' }
            ]
        });
    }

    async getById(id) {
        return await prisma.pewartaan.findUnique({
            where: { id: parseInt(id) },
            include: {
                pewartaan_tata_ibadah: { orderBy: { urutan: 'asc' } },
                pewartaan_pokok_doa: true,
                pewartaan_jemaat_ultah: { orderBy: { tanggal: 'asc' } },
                pewartaan_jemaat_sakit: true,
                pewartaan_pemulihan: true,
                pewartaan_lansia: true,
                pewartaan_info_ibadah: { orderBy: [{ tanggal: 'asc' }, { jam: 'asc' }] },
                pewartaan_pelayanan_sektor: true,
                pewartaan_pelayanan_kategorial: { orderBy: { tanggal_waktu: 'asc' } }
            }
        });
    }

    async create(data) {
        const {
            judul, tanggal_ibadah, hari, tempat_jemaat, ayat_firman, tema_khotbah, status,
            tata_ibadah, pokok_doa, jemaat_ultah, jemaat_sakit, pemulihan, lansia,
            info_ibadah, pelayanan_sektor, pelayanan_kategorial
        } = data;

        return await prisma.pewartaan.create({
            data: {
                judul,
                tanggal_ibadah: new Date(tanggal_ibadah),
                hari,
                tempat_jemaat,
                ayat_firman,
                tema_khotbah,
                status: status || 'draft',
                pewartaan_tata_ibadah: { create: tata_ibadah },
                pewartaan_pokok_doa: { create: pokok_doa },
                pewartaan_jemaat_ultah: {
                    create: jemaat_ultah?.map(u => ({ ...u, tanggal: new Date(u.tanggal) }))
                },
                pewartaan_jemaat_sakit: { create: jemaat_sakit },
                pewartaan_pemulihan: { create: pemulihan },
                pewartaan_lansia: { create: lansia },
                pewartaan_info_ibadah: {
                    create: info_ibadah?.map(i => ({ ...i, tanggal: new Date(i.tanggal) }))
                },
                pewartaan_pelayanan_sektor: { create: pelayanan_sektor },
                pewartaan_pelayanan_kategorial: {
                    create: pelayanan_kategorial?.map(p => ({ ...p, tanggal_waktu: new Date(p.tanggal_waktu) }))
                }
            }
        });
    }

    async update(id, data) {
        const pewartaanId = parseInt(id);
        const {
            judul, tanggal_ibadah, hari, tempat_jemaat, ayat_firman, tema_khotbah, status,
            tata_ibadah, pokok_doa, jemaat_ultah, jemaat_sakit, pemulihan, lansia,
            info_ibadah, pelayanan_sektor, pelayanan_kategorial
        } = data;

        return await prisma.$transaction(async (tx) => {
            // Clear existing relations
            const tables = [
                'pewartaan_tata_ibadah', 'pewartaan_pokok_doa', 'pewartaan_jemaat_ultah',
                'pewartaan_jemaat_sakit', 'pewartaan_pemulihan', 'pewartaan_lansia',
                'pewartaan_info_ibadah', 'pewartaan_pelayanan_sektor', 'pewartaan_pelayanan_kategorial'
            ];

            for (const table of tables) {
                await tx[table].deleteMany({ where: { pewartaan_id: pewartaanId } });
            }

            return await tx.pewartaan.update({
                where: { id: pewartaanId },
                data: {
                    judul,
                    tanggal_ibadah: new Date(tanggal_ibadah),
                    hari,
                    tempat_jemaat,
                    ayat_firman,
                    tema_khotbah,
                    status,
                    pewartaan_tata_ibadah: { create: tata_ibadah },
                    pewartaan_pokok_doa: { create: pokok_doa },
                    pewartaan_jemaat_ultah: {
                        create: jemaat_ultah?.map(u => ({ ...u, tanggal: new Date(u.tanggal) }))
                    },
                    pewartaan_jemaat_sakit: { create: jemaat_sakit },
                    pewartaan_pemulihan: { create: pemulihan },
                    pewartaan_lansia: { create: lansia },
                    pewartaan_info_ibadah: {
                        create: info_ibadah?.map(i => ({ ...i, tanggal: new Date(i.tanggal) }))
                    },
                    pewartaan_pelayanan_sektor: { create: pelayanan_sektor },
                    pewartaan_pelayanan_kategorial: {
                        create: pelayanan_kategorial?.map(p => ({ ...p, tanggal_waktu: new Date(p.tanggal_waktu) }))
                    }
                }
            });
        });
    }

    async delete(id) {
        return await prisma.pewartaan.delete({ where: { id: parseInt(id) } });
    }

    async updateStatus(id, status) {
        return await prisma.pewartaan.update({
            where: { id: parseInt(id) },
            data: { status }
        });
    }
}

export default new PewartaanService();
