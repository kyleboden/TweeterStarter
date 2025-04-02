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
import { StatusEntity } from "../../dao/entity/StoryEntity";
import { DataPage } from "../../dao/entity/DataPage";

export class StatusService {
  private userDAO: UserDAO;
  private imageDAO: ImageDAO;
  private storyDAO: StoryDAO;

  constructor(factory: Factory) {
    this.userDAO = factory.getUserDAO();
    this.imageDAO = factory.getImageDAO();
    this.storyDAO = factory.getStoryDAO();
  }
  public async loadMoreFeedItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize);
  }

  public async loadMoreStoryItems(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
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
    // Pause so we can see the logging out message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
    return true;
    // TODO: Call the server to post the status
  }

  private async getFakeData(
    lastItem: StatusDto | null,
    pageSize: number
  ): Promise<[StatusDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      Status.fromDto(lastItem),
      pageSize
    );
    const dtos = items.map((status) => status.dto);
    return [dtos, hasMore];
  }
}
