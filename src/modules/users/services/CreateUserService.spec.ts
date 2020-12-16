import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUserService', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user  same e-mail from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    expect(
      createUserService.execute({
        name: 'Jhon Doe',
        email: 'jhondow@example.com',
        password: '123456789',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
