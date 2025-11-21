import { Router } from 'express';
import userController from './user.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router: Router = Router();

router.route('/profile').get(authMiddleware, userController.fetchProfileHandler);
export default router;
