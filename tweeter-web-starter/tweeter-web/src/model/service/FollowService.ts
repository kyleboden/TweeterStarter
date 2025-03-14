import {
  AuthToken,
  FakeData,
  PagedUserItemRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class FollowService {
  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
  }

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    // TODO: Replace with the result of calling server
    // return FakeData.instance.getPageOfUsers(lastItem, pageSize, userAlias);
    // create an instance of server facade
    // facade.getMoreFollowees.
    const facade = new ServerFacade();
    const request: PagedUserItemRequest = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem
    };
    return facade.getMoreFollowees(request);
  }
}
