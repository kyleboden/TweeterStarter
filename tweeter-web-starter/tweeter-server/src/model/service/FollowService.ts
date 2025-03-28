import { AuthToken, FakeData, User, UserDto } from "tweeter-shared";
import { Factory } from "../../factory/Factory";
import { FollowsDAO } from "../../dao/daoInterfaces/FollowsDAO";
import { UserDAO } from "../../dao/daoInterfaces/UserDAO";
import { StatusDAO } from "../../dao/daoInterfaces/StatusDAO";
import { DataPage } from "../../dao/entity/DataPage";
import { Follower } from "../../dao/entity/Follower";
import { BatchGetCommand } from "@aws-sdk/lib-dynamodb";

export class FollowService {
  // private followsDAO: FollowsDAO;
  // private userDAO: UserDAO;
  // private statusDAO: StatusDAO;

  // constructor(factory: Factory) {
  //   this.followsDAO = factory.getFollowsDAO();
  //   this.userDAO = factory.getUserDAO();
  //   this.statusDAO = factory.getStatusDAO();
  // }

  public async loadMoreFollowers(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server

    // const dataPage: DataPage<Follower> =
    //   await this.followsDAO.getPageOfFollowers(
    //     userAlias,
    //     pageSize,
    //     lastItem?.alias
    //   );
    // const result = await this.client.send(new BatchGetCommand(dataPage.values));

    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    token: string,
    userAlias: string,
    pageSize: number,
    lastItem: UserDto | null
  ): Promise<[UserDto[], boolean]> {
    // TODO: Replace with the result of calling server
    return this.getFakeData(lastItem, pageSize, userAlias);
  }

  private async getFakeData(
    lastItem: UserDto | null,
    pageSize: number,
    userAlias: string
  ): Promise<[UserDto[], boolean]> {
    const [items, hasMore] = FakeData.instance.getPageOfUsers(
      User.fromDto(lastItem),
      pageSize,
      userAlias
    );
    const dtos = items.map((user) => user.dto);
    return [dtos, hasMore];
  }
}
