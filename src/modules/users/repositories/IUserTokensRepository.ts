import UserToken from '../infra/typeorm/entities/User';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserToken>;
}
