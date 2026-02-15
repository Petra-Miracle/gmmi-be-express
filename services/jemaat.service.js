import prisma from '../config/prisma.js';

class JemaatService {
    async getAllJemaat(filters = {}) {
        const { sektor_id, pendidikan, kategorial, search } = filters;

        return await prisma.jemaat.findMany({
            where: {
                deleted_at: null,
                sektor_id: sektor_id ? parseInt(sektor_id) : undefined,
                pendidikan_terakhir: pendidikan || undefined,
                kategorial: kategorial ? { contains: kategorial, mode: 'insensitive' } : undefined,
                nama: search ? { contains: search, mode: 'insensitive' } : undefined
            },
            include: {
                sectors: true,
                jemaat_sakramen: true
            },
            orderBy: {
                nama: 'asc'
            }
        });
    }

    async createJemaat(data, userId, userName) {
        const {
            nama, sektor_id, pendidikan_terakhir, pekerjaan,
            kategorial, keterangan, sakramen,
            jenis_kelamin, tempat_lahir, tanggal_lahir
        } = data;

        return await prisma.$transaction(async (tx) => {
            const jemaat = await tx.jemaat.create({
                data: {
                    nama,
                    sektor_id: parseInt(sektor_id),
                    pendidikan_terakhir,
                    pekerjaan,
                    kategorial,
                    keterangan,
                    jenis_kelamin,
                    tempat_lahir,
                    tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
                    jemaat_sakramen: {
                        create: {
                            bpts: sakramen?.bpts || false,
                            sidi: sakramen?.sidi || false,
                            nikah: sakramen?.nikah || false,
                            meninggal: sakramen?.meninggal || false
                        }
                    }
                }
            });

            return jemaat;
        });
    }

    async updateJemaat(id, data, userId, userName) {
        const {
            nama, sektor_id, pendidikan_terakhir, pekerjaan,
            kategorial, keterangan, sakramen,
            jenis_kelamin, tempat_lahir, tanggal_lahir
        } = data;

        return await prisma.$transaction(async (tx) => {
            await tx.jemaat.update({
                where: { id: parseInt(id) },
                data: {
                    nama,
                    sektor_id: parseInt(sektor_id),
                    pendidikan_terakhir,
                    pekerjaan,
                    kategorial,
                    keterangan,
                    jenis_kelamin,
                    tempat_lahir,
                    tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : null,
                    jemaat_sakramen: {
                        upsert: {
                            create: {
                                bpts: sakramen?.bpts || false,
                                sidi: sakramen?.sidi || false,
                                nikah: sakramen?.nikah || false,
                                meninggal: sakramen?.meninggal || false
                            },
                            update: {
                                bpts: sakramen?.bpts,
                                sidi: sakramen?.sidi,
                                nikah: sakramen?.nikah,
                                meninggal: sakramen?.meninggal
                            }
                        }
                    }
                }
            });
        });
    }

    async softDeleteJemaat(id) {
        return await prisma.jemaat.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() }
        });
    }

    // Sector Logic
    async getAllSectors() {
        return await prisma.sectors.findMany({
            orderBy: { nama_sektor: 'asc' }
        });
    }

    async createSector(data) {
        return await prisma.sectors.create({ data });
    }

    async updateSector(id, data) {
        return await prisma.sectors.update({
            where: { id: parseInt(id) },
            data
        });
    }

    async deleteSector(id) {
        const membersCount = await prisma.jemaat.count({
            where: { sektor_id: parseInt(id), deleted_at: null }
        });

        if (membersCount > 0) {
            throw new Error('Sektor tidak dapat dihapus karena masih memiliki jemaat aktif');
        }

        return await prisma.sectors.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new JemaatService();
