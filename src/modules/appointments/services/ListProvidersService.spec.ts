import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;

let listProvidersService: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });

  it('should be able to list the providers', async () => {
    const loggedUser = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow1@example.com',
      password: '123456789',
    });

    const user1 = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow2@example.com',
      password: '123456789',
    });

    const user2 = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow3@example.com',
      password: '123456789',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
