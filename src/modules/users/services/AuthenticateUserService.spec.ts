import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUserService', () => {
  it('should be able to authenticate', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    const auth = await authenticateUserService.execute({
      email: 'jhondow@example.com',
      password: '123456789',
    });

    expect(auth).toHaveProperty('token');
    expect(auth.user).toEqual(user);
  });

  it('should be able to authenticate with none existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    expect(
      authenticateUserService.execute({
        email: 'jhondow@example.com.br',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with wrong user ', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    expect(
      authenticateUserService.execute({
        email: 'jhondow@example.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
