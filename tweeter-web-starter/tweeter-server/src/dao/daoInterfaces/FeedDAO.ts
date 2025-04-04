import { StatusDto } from "tweeter-shared";
import { DataPage } from "../entity/DataPage";
import { StatusEntity } from "../entity/StatusEntity";

export interface FeedDAO {
  putFeed(feed: StatusDto, followerAlias: string): Promise<void>;
  getPageOfFeeds(
    alias: string,
    pageSize: number,
    timestamp: number | undefined
  ): Promise<DataPage<StatusDto>>;
}
