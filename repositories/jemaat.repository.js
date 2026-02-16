import prisma from '../config/prisma.js';

class JemaatRepository {
    async findAll(args = {}) {
        return prisma.jemaat.findMany({
            ...args,
            where: {
                ...args.where,
                deleted_at: null
            },
            orderBy: args.orderBy || { nama: 'asc' }
        });
    }

    async findById(id) {
        return prisma.jemaat.findUnique({
            where: { id: parseInt(id) },
            include: {
                sectors: true,
                jemaat_sakramen: true
            }
        });
    }

    async create(data) {
        const {
            nama, sektor_id, pendidikan_terakhir, pekerjaan,
            kategorial, keterangan, sakramen,
            jenis_kelamin, tempat_lahir, tanggal_lahir
        } = data;

        return prisma.$transaction(async (tx) => {
            return tx.jemaat.create({
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
        });
    }

    async update(id, data) {
        const {
            nama, sektor_id, pendidikan_terakhir, pekerjaan,
            kategorial, keterangan, sakramen,
            jenis_kelamin, tempat_lahir, tanggal_lahir
        } = data;

        return prisma.$transaction(async (tx) => {
            return tx.jemaat.update({
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

    async softDelete(id) {
        return prisma.jemaat.update({
            where: { id: parseInt(id) },
            data: { deleted_at: new Date() }
        });
    }

    async count(args = {}) {
        return prisma.jemaat.count({
            ...args,
            where: {
                ...args.where,
                deleted_at: null
            }
        });
    }

    // Sector Methods
    async findAllSectors() {
        return prisma.sectors.findMany({
            orderBy: { nama_sektor: 'asc' }
        });
    }

    async createSector(data) {
        return prisma.sectors.create({ data });
    }

    async updateSector(id, data) {
        return prisma.sectors.update({
            where: { id: parseInt(id) },
            data
        });
    }

    async deleteSector(id) {
        return prisma.sectors.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new JemaatRepository();
