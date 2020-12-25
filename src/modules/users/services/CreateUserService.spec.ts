import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user  same e-mail from another', async () => {
    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    await expect(
      createUserService.execute({
        name: 'Jhon Doe',
        email: 'jhondow@example.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
