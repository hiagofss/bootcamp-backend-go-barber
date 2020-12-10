import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import User from '../entities/User';

class UserRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create({
    name,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create({ name, email, password });

    await this.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUserByEmail = await this.ormRepository.findOne({
      where: { email },
    });

    return findUserByEmail;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUserById = await this.ormRepository.findOne(id);

    return findUserById;
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

export default UserRepository;
