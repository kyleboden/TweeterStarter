import { UserEntity } from "../entity/UserEntity";

export interface UserDAO {
  putUser(user: UserEntity): Promise<void>;

  getUser(alias: string): Promise<UserEntity | undefined>;

  getFolloweeCount(followerHandle: string): Promise<number>;

  getFollowerCount(followeeHandle: string): Promise<number>;

  decrementFollowCounts(
    followerHandle: string,
    followeeHandle: string
  ): Promise<void>;
  incrementFollowCounts(
    followerHandle: string,
    followeeHandle: string
  ): Promise<void>;
}
