import { AuthDAO } from "../dao/daoInterfaces/AuthDAO";
import { FeedDAO } from "../dao/daoInterfaces/FeedDAO";
import { FollowsDAO } from "../dao/daoInterfaces/FollowsDAO";
import { ImageDAO } from "../dao/daoInterfaces/ImageDAO";
import { StoryDAO } from "../dao/daoInterfaces/StoryDAO";
import { UserDAO } from "../dao/daoInterfaces/UserDAO";

export interface Factory {
  getFollowsDAO(): FollowsDAO;
  getUserDAO(): UserDAO;
  getAuthDAO(): AuthDAO;
  getImageDAO(): ImageDAO;
  getStoryDAO(): StoryDAO;
  getFeedDAO(): FeedDAO;
}
