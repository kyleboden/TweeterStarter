import {
  AuthResponse,
  AuthToken,
  FollowResponse,
  GetUserRequest,
  GetUserResponse,
  IsFollowerRequest,
  LoginRequest,
  NumFollowResponse,
  PagedItemRequest,
  PagedItemResponse,
  PostStatusRequest,
  RegisterRequest,
  Status,
  StatusDto,
  TweeterRequest,
  TweeterResponse,
  User,
  UserDto,
  UserRequest,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
  private SERVER_URL =
    "https://r4ua982xo9.execute-api.us-east-1.amazonaws.com/dev";

  private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getMoreFollowees(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/followee/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followees found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown errorr");
    }
  }
  public async getMoreFollowers(
    request: PagedItemRequest<UserDto>
  ): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<UserDto>,
      PagedItemResponse<UserDto>
    >(request, "/follower/list");

    // Convert the UserDto array returned by ClientCommunicator to a User array
    const items: User[] | null =
      response.success && response.items
        ? response.items.map((dto) => User.fromDto(dto) as User)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No followers found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown errorr");
    }
  }

  public async getMoreFeedItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/feedItem/list");

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No feed items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown errorr");
    }
  }

  public async getMoreStoryItems(
    request: PagedItemRequest<StatusDto>
  ): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator.doPost<
      PagedItemRequest<StatusDto>,
      PagedItemResponse<StatusDto>
    >(request, "/storyItem/list");

    // Convert the StatusDto array returned by ClientCommunicator to a Status array
    const items: Status[] | null =
      response.success && response.items
        ? response.items.map((dto) => Status.fromDto(dto) as Status)
        : null;

    // Handle errors
    if (response.success) {
      if (items == null) {
        throw new Error(`No story items found`);
      } else {
        return [items, response.hasMore];
      }
    } else {
      console.error(response);
      throw new Error(response.message ?? "Unknown errorr");
    }
  }

  public async postStatus(request: PostStatusRequest): Promise<void> {
    const response = await this.clientCommunicator.doPost<
      PostStatusRequest,
      TweeterResponse
    >(request, "/postStatus/list");
    console.log(response.message);
  }

  public async getIsFollowerStatus(
    request: IsFollowerRequest
  ): Promise<boolean> {
    const response = await this.clientCommunicator.doPost<
      IsFollowerRequest,
      TweeterResponse
    >(request, "/isFollowerStatus/list");
    return response.success;
  }

  public async getFolloweeCount(request: UserRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      NumFollowResponse
    >(request, "/followeeCount/list");
    console.log("in getFollowee Count");
    console.log("response: ", response);

    return response.numFollow;
  }

  public async getFollowerCount(request: UserRequest): Promise<number> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      NumFollowResponse
    >(request, "/followerCount/list");
    console.log("in getFollower Count");
    console.log("response: ", response);

    return response.numFollow;
  }

  public async follow(request: UserRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      FollowResponse
    >(request, "/follow/list");

    return [response.numFollow, response.follow];
  }

  public async unfollow(request: UserRequest): Promise<[number, number]> {
    const response = await this.clientCommunicator.doPost<
      UserRequest,
      FollowResponse
    >(request, "/unfollow/list");

    return [response.numFollow, response.follow];
  }

  public async login(request: LoginRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      LoginRequest,
      AuthResponse
    >(request, "/login/list");

    return [User.fromDto(response.user)!, response.authToken];
  }

  public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator.doPost<
      RegisterRequest,
      AuthResponse
    >(request, "/register/list");

    return [User.fromDto(response.user)!, response.authToken];
  }

  public async logout(request: TweeterRequest): Promise<void> {
    await this.clientCommunicator.doPost<TweeterRequest, TweeterResponse>(
      request,
      "/logout/list"
    );
  }

  public async getUser(request: GetUserRequest): Promise<User | null> {
    const response = await this.clientCommunicator.doPost<
      GetUserRequest,
      GetUserResponse
    >(request, "/getUser/list");

    return User.fromDto(response.user);
  }
}
