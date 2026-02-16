import prisma from '../config/prisma.js';

class CarouselRepository {
    async findAllActive() {
        return prisma.carousel_slides.findMany({
            where: { is_active: true },
            orderBy: [
                { order_index: 'asc' },
                { created_at: 'desc' }
            ]
        });
    }

    async findAll() {
        return prisma.carousel_slides.findMany({
            orderBy: [
                { order_index: 'asc' },
                { created_at: 'desc' }
            ]
        });
    }

    async findById(id) {
        return prisma.carousel_slides.findUnique({
            where: { id: parseInt(id) }
        });
    }

    async create(data) {
        return prisma.carousel_slides.create({
            data: {
                ...data,
                order_index: parseInt(data.order_index) || 0,
                is_active: data.is_active === 'true' || data.is_active === true
            }
        });
    }

    async update(id, data) {
        return prisma.carousel_slides.update({
            where: { id: parseInt(id) },
            data: {
                ...data,
                order_index: data.order_index !== undefined ? parseInt(data.order_index) : undefined,
                is_active: data.is_active !== undefined ? (data.is_active === 'true' || data.is_active === true) : undefined
            }
        });
    }

    async delete(id) {
        return prisma.carousel_slides.delete({
            where: { id: parseInt(id) }
        });
    }
}

export default new CarouselRepository();
