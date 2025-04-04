import {
  PagedItemRequest,
  RegisterRequest,
  UserDto,
  UserRequest,
} from "tweeter-shared";

import { ServerFacade } from "../../../src/network/ServerFacade";
import "@testing-library/jest-dom";
import "isomorphic-fetch";

describe("Facade", () => {
  let facade = new ServerFacade();

  beforeEach(() => {
    facade = new ServerFacade();
  });

  it("returns a User and an Authtoken when register is called", async () => {
    const request: RegisterRequest = {
      token: "token",
      alias: "alias",
      password: "pass",
      firstName: "john",
      lastName: "doe",
      userImageBytes: "myimage",
      imageFileExtension: "imageExtenstion",
    };
    const [user, authToken] = await facade.register(request);

    //check if not null
    expect(user).not.toBeNull();
    expect(authToken).not.toBeNull();
  });

  it("returns a list of Users and a boolean hasMore value when getMoreFollowers is called", async () => {
    const request: PagedItemRequest<UserDto> = {
      token: "token",
      userAlias: "alias",
      pageSize: 10,
      lastItem: null,
    };
    const [items, hasMore] = await facade.getMoreFollowers(request);

    //check if not null
    expect(items).not.toBeNull();
    expect(hasMore).not.toBeNull();
  });

  it("returns a number relating to amount of followers a user has when getFollowerCount is called", async () => {
    const request: UserRequest = {
      token: "token",
      user: {
        alias: "alias",
        firstName: "john",
        lastName: "doe",
        imageUrl: "imageUrl",
      },
    };
    const numFollowers = await facade.getFollowerCount(request);

    //check if not null
    expect(typeof numFollowers).toBe("number");
  });
});
