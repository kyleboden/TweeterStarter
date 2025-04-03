import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { FollowsDAO } from "../../dao/daoInterfaces/FollowsDAO";
import { UserDAO } from "../../dao/daoInterfaces/UserDAO";
import { DataPage } from "../../dao/entity/DataPage";
import { FollowEntity } from "../../dao/entity/FollowEntity";
import { UserEntity } from "../../dao/entity/UserEntity";
import { ImageDAO } from "../../dao/daoInterfaces/ImageDAO";
import { AuthDAO } from "../../dao/daoInterfaces/AuthDAO";

export class FollowService {
  private followsDAO: FollowsDAO;
  private userDAO: UserDAO;
  private imageDAO: ImageDAO;
  private authDAO: AuthDAO;

  constructor(factory: Factory) {
    this.followsDAO = factory.getFollowsDAO();
    this.userDAO = factory.getUserDAO();
    this.imageDAO = factory.getImageDAO();
    this.authDAO = factory.getAuthDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const dataPage: DataPage<FollowEntity> =
      await this.followsDAO.getPageOfFollowers(
        userAlias,
        pageSize,
        lastItem?.alias
      );
    const aliases: string[] = [];
    for (const follower of dataPage.values) {
      aliases.push(follower.followerHandle);
    }

    const userDtoArray: UserDto[] = [];
    for (const alias of aliases) {
      const userEntity: UserEntity | undefined = await this.userDAO.getUser(
        alias
      );
      if (!userEntity) {
        throw new Error("Error finding a specific user.");
      }

      const fileName = `${alias}_Image`;
      const imageUrl = await this.imageDAO.getImage(fileName);
      const userDto: UserDto = {
        firstName: userEntity?.firstName,
        lastName: userEntity?.lastName,
        alias: userEntity?.alias,
        imageUrl: imageUrl,
      };

      userDtoArray.push(userDto);
    }

    return [userDtoArray, dataPage.hasMorePages];
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const isValidAuth = await this.authDAO.checkAuth(token);
    if (!isValidAuth) {
      throw new Error("Error authenticating, please login again");
    }

    const dataPage: DataPage<FollowEntity> =
      await this.followsDAO.getPageOfFollowees(
        userAlias,
        pageSize,
        lastItem?.alias
      );
    const aliases: string[] = [];
    for (const followee of dataPage.values) {
      aliases.push(followee.followeeHandle);
    }

    const userDtoArray: UserDto[] = [];
    for (const alias of aliases) {
      const userEntity: UserEntity | undefined = await this.userDAO.getUser(
        alias
      );
      if (!userEntity) {
        throw new Error("Error finding a specific user.");
      }

      const fileName = `${alias}_Image`;
      const imageUrl = await this.imageDAO.getImage(fileName);
      const userDto: UserDto = {
        firstName: userEntity?.firstName,
        lastName: userEntity?.lastName,
        alias: userEntity?.alias,
        imageUrl: imageUrl,
      };

      userDtoArray.push(userDto);
    }

    return [userDtoArray, dataPage.hasMorePages];
  }
}
