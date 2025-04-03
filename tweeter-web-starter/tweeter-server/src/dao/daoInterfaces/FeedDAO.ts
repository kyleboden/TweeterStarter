import { DataPage } from "../entity/DataPage";
import { StatusEntity } from "../entity/StatusEntity";

export interface FeedDAO {
  putFeed(feed: StatusEntity): Promise<void>;
  getPageOfFeeds(
    alias: string,
    pageSize: number,
    timestamp: number | undefined
  ): Promise<DataPage<StatusEntity>>;
}
