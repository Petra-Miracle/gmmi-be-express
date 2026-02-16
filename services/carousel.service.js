import CarouselRepository from '../repositories/carousel.repository.js';

class CarouselService {
    async getAllActive() {
        return await CarouselRepository.findAllActive();
    }

    async getAllAdmin() {
        return await CarouselRepository.findAll();
    }

    async create(data) {
        return await CarouselRepository.create(data);
    }

    async update(id, data) {
        return await CarouselRepository.update(id, data);
    }

    async delete(id) {
        return await CarouselRepository.delete(id);
    }
}

export default new CarouselService();
