import { DataPage } from "../entity/DataPage";
import { FollowEntity } from "../entity/FollowEntity";

export interface FollowsDAO {
  putFollower(follower: FollowEntity): Promise<void>;
  updateFollower(
    follower: FollowEntity,
    newFollowerName: string,
    newFolloweeName: string
  ): Promise<void>;

  getFollower(follower: FollowEntity): Promise<FollowEntity | undefined>;

  deleteFollower(follower: FollowEntity): Promise<void>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<FollowEntity>>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<FollowEntity>>;

  getAllFollowers(followeeHandle: string): Promise<DataPage<FollowEntity>>;

  getAllFollowees(followerHandle: string): Promise<DataPage<FollowEntity>>;
}
