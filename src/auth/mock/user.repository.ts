import { user } from './user.object';

let id = 0;

export const mockUserRepository = {
  findOneOrFail: jest.fn().mockImplementation(() => user),
  create: jest.fn().mockImplementation((dto) => dto),
  save: jest.fn().mockImplementation((dto) => {
    id++;
    return { id, ...dto };
  }),
};
