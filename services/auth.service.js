import AdminService from './admin.service.js';
import jwt from 'jsonwebtoken';

class AuthService {
    async login(email, password) {
        const admin = await AdminService.loginAdmin({ email, password });

        if (!admin) {
            throw new Error('Email atau password salah.');
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role, name: admin.nama },
            process.env.JWT_SECRET || 'gmmi_secret_key',
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: admin.id,
                name: admin.nama,
                email: admin.email,
                role: admin.role,
                password: admin.password_hash // Maintains existing behavior but noted for future security refinement
            }
        };
    }

    async getMe(userId) {
        // Current logic uses AdminService to get all admins then filtering
        // In a mature architecture, this would be a direct repository call
        const admins = await AdminService.getAllAdmins();
        const admin = admins.find(a => a.id === userId);

        if (!admin) {
            throw new Error('User tidak ditemukan.');
        }

        // Note: AdminService.getAllAdmins might be stripping sensitive info
        return admin;
    }
}

export default new AuthService();
