import {
  AuthToken,
  FakeData,
  Status,
  StatusDto,
  UserDto,
} from "tweeter-shared";
import { StoryDAO } from "../../dao/daoInterfaces/StoryDAO";
import { ImageDAO } from "../../dao/daoInterfaces/ImageDAO";
import { UserDAO } from "../../dao/daoInterfaces/UserDAO";
import { Factory } from "../../factory/Factory";
import { StatusEntity } from "../../dao/entity/StatusEntity";
import { DataPage } from "../../dao/entity/DataPage";
import { FeedDAO } from "../../dao/daoInterfaces/FeedDAO";
import { FollowsDAO } from "../../dao/daoInterfaces/FollowsDAO";
import { FollowEntity } from "../../dao/entity/FollowEntity";
import { AuthDAO } from "../../dao/daoInterfaces/AuthDAO";

export class StatusService {
  private userDAO: UserDAO;
  private imageDAO: ImageDAO;
  private storyDAO: StoryDAO;
  private feedDAO: FeedDAO;
  private followDAO: FollowsDAO;
  private authDAO: AuthDAO;

  constructor(factory: Factory) {
    this.userDAO = factory.getUserDAO();
    this.imageDAO = factory.getImageDAO();
    this.storyDAO = factory.getStoryDAO();
    this.feedDAO = factory.getFeedDAO();
    this.followDAO = factory.getFollowsDAO();
    this.authDAO = factory.getAuthDAO();
  }
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const dataPage: DataPage<StatusEntity> = await this.feedDAO.getPageOfFeeds(
      userAlias,
      pageSize,
      lastItem?.timestamp
    );
    const statusDtoArray: StatusDto[] = [];

    for (const statusEntity of dataPage.values) {
      const userEntity = await this.userDAO.getUser(statusEntity.alias);
      const fileName = `${userAlias}_Image`;
      const imageUrl = await this.imageDAO.getImage(fileName);

      const userDto: UserDto = {
        firstName: userEntity!.firstName,
        lastName: userEntity!.lastName,
        alias: userEntity!.alias,
        imageUrl: imageUrl,
      };

      const statusDto: StatusDto = {
        post: statusEntity.post,
        user: userDto,
        timestamp: statusEntity.timestamp,
      };
      statusDtoArray.push(statusDto);
    }
    return [statusDtoArray, dataPage.hasMorePages];
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const dataPage: DataPage<StatusEntity> =
      await this.storyDAO.getPageOfStories(
        userAlias,
        pageSize,
        lastItem?.timestamp
      );
    // console.log("dataPage:  ", dataPage);
    const statusDtoArray: StatusDto[] = [];

    for (const statusEntity of dataPage.values) {
      const userEntity = await this.userDAO.getUser(statusEntity.alias);
      const fileName = `${userAlias}_Image`;
      const imageUrl = await this.imageDAO.getImage(fileName);

      const userDto: UserDto = {
        firstName: userEntity!.firstName,
        lastName: userEntity!.lastName,
        alias: userEntity!.alias,
        imageUrl: imageUrl,
      };

      const statusDto: StatusDto = {
        post: statusEntity.post,
        user: userDto,
        timestamp: statusEntity.timestamp,
      };
      statusDtoArray.push(statusDto);
    }
    return [statusDtoArray, dataPage.hasMorePages];
  }

  public async postStatus(
    token: string,
    newStatus: StatusDto
  ): Promise<boolean> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const statusEntity: StatusEntity = {
      alias: newStatus.user.alias,
      timestamp: newStatus.timestamp,
      post: newStatus.post,
    };

    await this.storyDAO.putStory(statusEntity);

    // todo: implement putFeed
    // for every follower of alias, put feed
    const dataPage = await this.followDAO.getAllFollowers(newStatus.user.alias);
    const followers: FollowEntity[] = dataPage.values;
    for (const entity of followers) {
      const followerStatusEntity: StatusEntity = {
        alias: entity.followerHandle,
        timestamp: newStatus.timestamp,
        post: newStatus.post,
      };
      await this.feedDAO.putFeed(followerStatusEntity);
    }
    return true;
  }

  // private async getFakeData(
  //   lastItem: StatusDto | null,
  //   pageSize: number
  // ): Promise<[StatusDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfStatuses(
  //     Status.fromDto(lastItem),
  //     pageSize
  //   );
  //   const dtos = items.map((status) => status.dto);
  //   return [dtos, hasMore];
  // }
}
