import 'reflect-metadata';

import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatarService', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_fileName: 'avatar.png',
    });

    expect(user.avatar).toBe('avatar.png');
  });

  it('should not be able to update avatar for non existing user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: 'non-existing-user',
        avatar_fileName: 'avatar-2.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondow@example.com',
      password: '123456789',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_fileName: 'avatar.png',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatar_fileName: 'avatar-2.png',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.png');

    expect(user.avatar).toBe('avatar-2.png');
  });
});
