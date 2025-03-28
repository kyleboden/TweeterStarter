import { UserEntity } from "../entity/UserEntity";

export interface UserDAO {
  putUser(user: UserEntity): Promise<void>;

  getUser(alias: string): Promise<UserEntity | undefined>;
}
