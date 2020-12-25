import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfileService: UpdateProfileService;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Doe Jhon',
      email: 'test@test.com',
    });

    expect(updatedUser.name).toBe('Doe Jhon');
    expect(updatedUser.email).toBe('test@test.com');
  });

  it('should not be able to change another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456789',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Doe Jhon',
        email: 'jhondow@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Doe Jhon',
      email: 'test@test.com',
      old_password: '123456789',
      password: '123456',
    });

    expect(updatedUser.password).toBe('123456');
  });

  it('should be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Doe Jhon',
        email: 'test@test.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Doe Jhon',
        email: 'test@test.com',
        old_password: '123456467897',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
