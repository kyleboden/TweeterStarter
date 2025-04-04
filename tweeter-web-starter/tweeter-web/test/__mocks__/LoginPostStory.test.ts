import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../../src/model/service/UserService";
import "isomorphic-fetch";
import { StatusService } from "../../src/model/service/StatusService";
import { mock, instance, spy, when, verify } from "@typestrong/ts-mockito";
import {
  PostStatusView,
  PostStatusPresenter,
} from "../../src/presenters/PostStatusPresenter";

describe("loginPostStory", () => {
  let userService: UserService;
  let statusService: StatusService;

  let postStatusPresenter: PostStatusPresenter;
  let mockPostStatusPresenterView: PostStatusView;

  beforeEach(() => {
    // -- LOGGING IN USER --
    userService = new UserService();
    statusService = new StatusService();

    // -- POSTING STATUS --
    // const testView = new TestPostStatusView();
    mockPostStatusPresenterView = mock<PostStatusView>();
    postStatusPresenter = new PostStatusPresenter(
      instance(mockPostStatusPresenterView)
    );
  });

  afterEach(() => {
    // Clear any pending operations if necessary
    jest.clearAllMocks();
  });

  it("Properly Logs in and posts a status", async () => {
    // -- LOGGING IN USER --
    const alias: string = "@a";
    const password: string = "a";

    const [user, authToken]: [User, AuthToken] = await userService.login(
      alias,
      password
    );
    // console.log("Returned user: ", user);
    // console.log("Returned AuthToken", authToken);

    expect(user).not.toBeNull();
    expect(authToken).not.toBeNull();

    // -- POSTING STATUS --

    const post: string =
      "This is my post from my test for loginPostStory IM TRYING AGAIN";

    const roughlyTimeOfPost = Date.now();

    await postStatusPresenter.submitPost(authToken, user, post);
    verify(
      mockPostStatusPresenterView.displayInfoMessage("Status posted!", 2000)
    ).once();

    // -- RETRIEVING STORY --
    const [statusArray, hasMore] = await statusService.loadMoreStoryItems(
      authToken,
      alias,
      20,
      null
    );

    let receivedStatus: Status | undefined = undefined;
    for (const status of statusArray) {
      if (status.post === post && status.timestamp < roughlyTimeOfPost + 5000) {
        receivedStatus = status;
        break;
      }
    }
    expect(receivedStatus).toBeDefined();
    if (receivedStatus) {
      expect(receivedStatus.user).toEqual(user);
      expect(receivedStatus.post).toEqual(post);

      const statusTimestamp = new Date(receivedStatus.timestamp).getTime();
      const timeDiff = Math.abs(roughlyTimeOfPost - statusTimestamp);
      expect(timeDiff).toBeLessThan(5000);
    }
  });
});
