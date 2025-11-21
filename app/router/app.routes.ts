import { Application } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
const appRoutes = (app: Application) => {
	app.use('/api/auth', authRoutes);
	app.use('/api/users', userRoutes);
};

export default appRoutes;
