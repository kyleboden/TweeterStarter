import {
  AuthToken,
  FakeData,
  PagedItemRequest,
  PostStatusRequest,
  Status,
  StatusDto,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class StatusService {
  public async loadMoreFeedItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const facade = new ServerFacade();
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return facade.getMoreFeedItems(request);
  }

  public async loadMoreStoryItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    const facade = new ServerFacade();
    const request: PagedItemRequest<StatusDto> = {
      token: authToken.token,
      userAlias: userAlias,
      pageSize: pageSize,
      lastItem: lastItem ? lastItem.dto : null,
    };
    return facade.getMoreStoryItems(request);
  }
  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const facade = new ServerFacade();
    const request: PostStatusRequest = {
      token: authToken.token,
      newStatus: newStatus.dto,
    };
    await facade.postStatus(request);
  }
}
