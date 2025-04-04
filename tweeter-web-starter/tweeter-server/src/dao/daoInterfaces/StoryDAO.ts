import { DataPage } from "../entity/DataPage";
import { StatusEntity } from "../entity/StatusEntity";

export interface StoryDAO {
  putStory(story: StatusEntity): Promise<void>;
  getPageOfStories(
    alias: string,
    pageSize: number,
    timestamp: number | undefined
  ): Promise<DataPage<StatusEntity>>;
}
