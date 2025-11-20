import { Application } from 'express';
import authRoutes from '../modules/auth/auth.routes';
const appRoutes = (app: Application) => {
	app.use('/api/auth', authRoutes);
};

export default appRoutes;
