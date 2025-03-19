import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  FakeData,
  IsFollowerRequest,
  UserRequest,
  LoginRequest,
  RegisterRequest,
  TweeterRequest,
} from "tweeter-shared";
import { ServerFacade } from "../../network/ServerFacade";

export class UserService {
  public async getIsFollowerStatus(
    authToken: AuthToken,
    user: User,
    selectedUser: User
  ): Promise<boolean> {
    const facade = new ServerFacade();
    const request: IsFollowerRequest = {
      token: authToken.token,
      user: user.dto,
      selectedUser: selectedUser.dto,
    };
    return facade.getIsFollowerStatus(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    console.log("about to call facade in followeeCount");
    const facade = new ServerFacade();
    const request: UserRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return facade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    user: User
  ): Promise<number> {
    console.log("about to call facade in followerCount");
    const facade = new ServerFacade();
    const request: UserRequest = {
      token: authToken.token,
      user: user.dto,
    };
    return facade.getFollowerCount(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    console.log("about to call facade in follow");
    const facade = new ServerFacade();
    const request: UserRequest = {
      token: authToken.token,
      user: userToFollow.dto,
    };
    return facade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToUnfollow: User
  ): Promise<[followerCount: number, followeeCount: number]> {
    console.log("about to call facade in follow");
    const facade = new ServerFacade();
    const request: UserRequest = {
      token: authToken.token,
      user: userToUnfollow.dto,
    };
    return facade.follow(request);
  }

  public async login(
    alias: string,
    password: string
  ): Promise<[User, AuthToken]> {
    console.log("about to call facade in login");
    const facade = new ServerFacade();
    const request: LoginRequest = {
      alias: alias,
      password: password,
      token: "fakeToken",
    };
    return facade.login(request);
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    console.log("about to call facade in register");
    const facade = new ServerFacade();
    const request: RegisterRequest = {
      firstName: firstName,
      lastName: lastName,
      alias: alias,
      password: password,
      token: "fakeToken",
      userImageBytes: userImageBytes,
      imageFileExtension: imageFileExtension,
    };
    return facade.register(request);
  }

  public async logout(authToken: AuthToken): Promise<void> {
    console.log("about to call facade in logout");
    const facade = new ServerFacade();
    const request: TweeterRequest = {
      token: "fakeToken",
    };
    return facade.logout(request);
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
}
