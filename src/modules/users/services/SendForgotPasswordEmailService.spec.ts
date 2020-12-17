import AppError from '@shared/errors/AppError';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailServices', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password: '123456789',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'jhondoe@example.com',
    });

    expect(sendEmail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'jhondoe@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

it('should generate a forgot password token', async () => {
  const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

  const user = await fakeUsersRepository.create({
    name: 'Jhon Doe',
    email: 'jhondoe@example.com',
    password: '123456789',
  });

  await sendForgotPasswordEmailService.execute({
    email: 'jhondoe@example.com',
  });

  expect(generateToken).toHaveBeenCalledWith(user.id);
});
