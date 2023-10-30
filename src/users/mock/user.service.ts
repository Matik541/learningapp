import { User } from '../entities/user.entity';

const user = new User();
user.id = 1;
user.userName = 'test user';

const users: User[] = [user];

export const mockUsersService = {
  getMe: jest.fn().mockImplementation(async (userId: number): Promise<User> => {
    return Promise.resolve(await mockUsersService.getUserById(userId));
  }),
  getUserById: jest
    .fn()
    .mockImplementation(async (userId: number): Promise<User> => {
      return Promise.resolve(users[userId - 1]);
    }),
};
