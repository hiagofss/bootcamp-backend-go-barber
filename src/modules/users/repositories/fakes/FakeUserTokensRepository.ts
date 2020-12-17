import { v4 as uuid } from 'uuid';

import IUserTokensRepository from '../IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/User';

class UserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
    });

    this.userTokens.push(userToken);

    return userToken;
  }
}

export default UserTokensRepository;
