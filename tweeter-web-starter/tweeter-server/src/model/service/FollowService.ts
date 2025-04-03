import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { FollowsDAO } from "../../dao/daoInterfaces/FollowsDAO";
import { UserDAO } from "../../dao/daoInterfaces/UserDAO";
import { DataPage } from "../../dao/entity/DataPage";
import { Follower } from "../../dao/entity/Follower";
import { UserEntity } from "../../dao/entity/UserEntity";
import { ImageDAO } from "../../dao/daoInterfaces/ImageDAO";

export class FollowService {
  private followsDAO: FollowsDAO;
  private userDAO: UserDAO;
  private imageDAO: ImageDAO;

  constructor(factory: Factory) {
    this.followsDAO = factory.getFollowsDAO();
    this.userDAO = factory.getUserDAO();
    this.imageDAO = factory.getImageDAO();
  }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    const dataPage: DataPage<Follower> =
      await this.followsDAO.getPageOfFollowers(
        userAlias,
        pageSize,
        lastItem?.alias
      );
    const aliases: string[] = [];
    for (const follower of dataPage.values) {
      aliases.push(follower.followerHandle);
    }

    // const aliases = dataPage.values
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
    const dataPage: DataPage<Follower> =
      await this.followsDAO.getPageOfFollowees(
        userAlias,
        pageSize,
        lastItem?.alias
      );
    const aliases: string[] = [];
    for (const followee of dataPage.values) {
      aliases.push(followee.followeeHandle);
    }

    // const aliases = dataPage.values
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

  // private async getFakeData(
  //   lastItem: UserDto | null,
  //   pageSize: number,
  //   userAlias: string
  // ): Promise<[UserDto[], boolean]> {
  //   const [items, hasMore] = FakeData.instance.getPageOfUsers(
  //     User.fromDto(lastItem),
  //     pageSize,
  //     userAlias
  //   );
  //   const dtos = items.map((user) => user.dto);
  //   return [dtos, hasMore];
  // }
}
