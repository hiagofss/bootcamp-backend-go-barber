import { inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import User from '../infra/typeorm/entities/User';

interface IRequest {
  email: string;
}

class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    this.mailProvider.sendMail(email, 'Pedido de recuperação de senha enviado');
  }
}

export default SendForgotPasswordEmailService;
