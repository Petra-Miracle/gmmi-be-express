import AuthService from '../services/auth.service.js';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email dan password harus diisi.'
            });
        }

        const result = await AuthService.login(email, password);

        return res.status(200).json({
            success: true,
            message: 'Login berhasil.',
            ...result
        });
    } catch (error) {
        console.error('Error in auth.login:', error.message);
        return res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export const me = async (req, res) => {
    try {
        const user = await AuthService.getMe(req.user.id);

        return res.status(200).json({
            success: true,
            user: {
                ...req.user,
                ...user
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
