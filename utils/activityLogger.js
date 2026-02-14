import ActivityRepository from '../repositories/activity.repository.js';

/**
 * Logs an administrative activity to the database.
 * @param {number} adminId - ID of the admin performing the action.
 * @param {string} adminNama - Name of the admin performing the action.
 * @param {string} aksi - Type of action (TAMBAH, UBAH, HAPUS, LOGIN, etc).
 * @param {string} modul - Relevant module (JEMAAT, KEUANGAN, etc).
 * @param {string} detail - Description of the action.
 */
export const logActivity = async (adminId, adminNama, aksi, modul, detail) => {
    try {
        await ActivityRepository.create({ adminId, adminNama, aksi, modul, detail });
    } catch (err) {
        console.error('Error logging activity:', err.message);
    }
};

export default logActivity;
