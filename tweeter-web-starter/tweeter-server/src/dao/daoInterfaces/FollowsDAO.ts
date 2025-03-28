import { DataPage } from "../entity/DataPage";
import { Follower } from "../entity/Follower";

export interface FollowsDAO {
  putFollower(follower: Follower): Promise<void>;
  updateFollower(
    follower: Follower,
    newFollowerName: string,
    newFolloweeName: string
  ): Promise<void>;

  getFollower(follower: Follower): Promise<Follower | undefined>;

  deleteFollower(follower: Follower): Promise<void>;

  getPageOfFollowees(
    followerHandle: string,
    pageSize: number,
    lastFolloweeHandle: string | undefined
  ): Promise<DataPage<Follower>>;

  getPageOfFollowers(
    followeeHandle: string,
    pageSize: number,
    lastFollowerHandle: string | undefined
  ): Promise<DataPage<Follower>>;
}
