import { NotFoundException } from '../../utils/apiErrors.utils';
import userModel from './user.model';

class UserService {
	async profile(id: string) {
		const user = await userModel.findById(id);
		if (!user) {
			throw new NotFoundException('User not found');
		}
		return user;
	}
}
export default new UserService();
