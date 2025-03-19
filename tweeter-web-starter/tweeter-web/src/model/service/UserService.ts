import { Buffer } from "buffer";
import {
  AuthToken,
  User,
  FakeData,
  IsFollowerRequest,
  UserRequest,
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
    // Pause so we can see the follow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // // TODO: Call the server

    // const followerCount = await this.getFollowerCount(authToken, userToFollow);
    // const followeeCount = await this.getFolloweeCount(authToken, userToFollow);

    // return [followerCount, followeeCount];

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
    // Pause so we can see the unfollow message. Remove when connected to the server
    // await new Promise((f) => setTimeout(f, 2000));

    // // TODO: Call the server

    // const followerCount = await this.getFollowerCount(
    //   authToken,
    //   userToUnfollow
    // );
    // const followeeCount = await this.getFolloweeCount(
    //   authToken,
    //   userToUnfollow
    // );

    // return [followerCount, followeeCount];
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
    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid alias or password");
    }

    return [user, FakeData.instance.authToken];
  }

  public async register(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> {
    // Not neded now, but will be needed when you make the request to the server in milestone 3
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    // TODO: Replace with the result of calling the server
    const user = FakeData.instance.firstUser;

    if (user === null) {
      throw new Error("Invalid registration");
    }

    return [user, FakeData.instance.authToken];
  }

  public async logout(authToken: AuthToken): Promise<void> {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  }
}
