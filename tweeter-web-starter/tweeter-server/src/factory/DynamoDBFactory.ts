import { AuthDynamoDBDAO } from "../dao/daoClasses/AuthDynamoDBDAO";
import { FeedDynamoDBDAO } from "../dao/daoClasses/FeedDynamoDBDAO";
import { FollowsDynamoDBDAO } from "../dao/daoClasses/FollowsDynamoDBDAO";
import { ImageS3DAO } from "../dao/daoClasses/ImageS3DAO";
import { StoryDynamoDBDAO } from "../dao/daoClasses/StoryDynamoDBDAO";
import { UserDynamoDBDAO } from "../dao/daoClasses/UserDynamoDBDAO";
import { AuthDAO } from "../dao/daoInterfaces/AuthDAO";
import { FeedDAO } from "../dao/daoInterfaces/FeedDAO";
import { FollowsDAO } from "../dao/daoInterfaces/FollowsDAO";
import { ImageDAO } from "../dao/daoInterfaces/ImageDAO";
import { StoryDAO } from "../dao/daoInterfaces/StoryDAO";
import { UserDAO } from "../dao/daoInterfaces/UserDAO";
import { Factory } from "./Factory";

export class DynamoDBFactory implements Factory {
  getFollowsDAO(): FollowsDAO {
    return new FollowsDynamoDBDAO();
  }
  getUserDAO(): UserDAO {
    return new UserDynamoDBDAO();
  }
  getAuthDAO(): AuthDAO {
    return new AuthDynamoDBDAO();
  }
  getImageDAO(): ImageDAO {
    return new ImageS3DAO();
  }
  getStoryDAO(): StoryDAO {
    return new StoryDynamoDBDAO();
  }
  getFeedDAO(): FeedDAO {
    return new FeedDynamoDBDAO();
  }
}
